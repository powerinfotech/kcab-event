import { message } from '@util/antdMessage';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {HttpStatusCode} from 'axios';
import dayjs from 'dayjs';
import {AuthGrpList, AuthInfoList, AuthUserInfoList, UserSearchResult} from '@interface/auth/AuthManagement';
import {IudType} from '@interface/common';
import {callGetAuthGrpList, callGetAuthList, callGetAuthUserList, callSaveAuthManagement} from '@api/auth/AuthManagementApi';
import {useMessage} from '@hook/useMessage';
import {applyDataChange, applyDeleteRows} from '@util/dataSourceUtils';

export function useAuthManagement() {
    const form = useForm<any>({mode: 'onSubmit'});
    const {unregister} = form;
    const {confirm} = useMessage();
    const tempSeqRef = useRef(-1);
    const autoSelectAuthGrpRef = useRef(true);
    const prevAuthSeqsRef = useRef<number[]>([]);

    // ── Auth Group State ──
    const [authGrpDataSource, setAuthGrpDataSource] = useState<AuthGrpList[]>([]);
    const [orgAuthGrpDataSource, setOrgAuthGrpDataSource] = useState<AuthGrpList[]>([]);
    const [selectedAuthGrpRowIndex, setSelectedAuthGrpRowIndex] = useState(-1);
    const [selectedAuthGrpRowKeys, setSelectedAuthGrpRowKeys] = useState<React.Key[]>([]);

    // ── Auth State ──
    const [authDataSource, setAuthDataSource] = useState<AuthInfoList[]>([]);
    const [selectedAuthRowIndex, setSelectedAuthRowIndex] = useState(-1);
    const [selectedAuthRowKeys, setSelectedAuthRowKeys] = useState<React.Key[]>([]);

    // ── Auth User State ──
    const [authUserDataSource, setAuthUserDataSource] = useState<AuthUserInfoList[]>([]);
    const [selectedAuthUserRowKeys, setSelectedAuthUserRowKeys] = useState<React.Key[]>([]);

    // ── User Popup State ──
    const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

    // ── Derived ──
    const isAuthGrpChanged = authGrpDataSource.some(v => v.iudType);
    const isAuthChanged = authDataSource.some(v => v.iudType);
    const isAuthUserChanged = authUserDataSource.some(v => v.iudType);
    const isAnyChanged = isAuthGrpChanged || isAuthChanged || isAuthUserChanged;
    const selectedAuthGrp = selectedAuthGrpRowIndex >= 0 ? authGrpDataSource[selectedAuthGrpRowIndex] : null;
    const selectedAuth = selectedAuthRowIndex >= 0 ? authDataSource[selectedAuthRowIndex] : null;

    // ── Data Change Handlers ──
    const handleDataChangeAuthGrp = (record: AuthGrpList, key: string, value: any) =>
        applyDataChange(setAuthGrpDataSource, 'authGrpSeq', record, key, value);
    const handleDataChangeAuth = (record: AuthInfoList, key: string, value: any) =>
        applyDataChange(setAuthDataSource, 'authSeq', record, key, value);
    const handleDataChangeAuthUser = (record: AuthUserInfoList, key: string, value: any) =>
        applyDataChange(setAuthUserDataSource, 'authUserSeq', record, key, value);

    // ── Fetch Helpers ──
    const fetchAuthUserList = async (authGrpSeq: number, authSeq: number) => {
        const res = await callGetAuthUserList(authGrpSeq, authSeq);
        if (res.code === HttpStatusCode.Ok) {
            setAuthUserDataSource(structuredClone(res.item));
        }
    };

    const fetchAuthWithAutoSelect = async (authGrpSeq: number) => {
        const res = await callGetAuthList(authGrpSeq);
        if (res.code !== HttpStatusCode.Ok) return;
        const authList = structuredClone(res.item);
        setAuthDataSource(authList);
        if (authList.length > 0) {
            setSelectedAuthRowIndex(0);
            const first = authList[0];
            if (first.rgstUserSeq && first.authSeq) {
                await fetchAuthUserList(first.authGrpSeq, first.authSeq);
            }
        }
    };

    const resetAuthUserState = () => {
        setAuthUserDataSource([]);
        setSelectedAuthUserRowKeys([]);
    };

    // ── 초기화 ──
    const handleReset = async () => {
        if (isAnyChanged) {
            if (!await confirm('저장하지 않은 정보는 초기화됩니다. 계속 하시겠습니까?')) return;
        }
        setAuthGrpDataSource(structuredClone(orgAuthGrpDataSource));
        if (selectedAuthGrp?.rgstUserSeq && selectedAuthGrp?.authGrpSeq) {
            const res = await callGetAuthList(selectedAuthGrp.authGrpSeq);
            if (res.code === HttpStatusCode.Ok) setAuthDataSource(structuredClone(res.item));
            if (selectedAuth?.rgstUserSeq && selectedAuth?.authSeq) {
                await fetchAuthUserList(selectedAuthGrp.authGrpSeq, selectedAuth.authSeq);
            } else {
                setAuthUserDataSource([]);
            }
        } else {
            setAuthDataSource([]);
            setAuthUserDataSource([]);
        }
    };

    // ── Auth Group Handlers ──
    const handleSearchAuthGrpList = async () => {
        if (isAnyChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?')) return;
        }
        const res = await callGetAuthGrpList();
        if (res.code === HttpStatusCode.Ok) {
            autoSelectAuthGrpRef.current = true;
            setOrgAuthGrpDataSource(structuredClone(res.item));
        }
        setSelectedAuthGrpRowIndex(-1);
        setSelectedAuthGrpRowKeys([]);
    };

    const handleAddRowAuthGrp = () => {
        const tempSeq = tempSeqRef.current--;
        setAuthGrpDataSource(prev => [...prev, {
            authGrpSeq: tempSeq, authGrpNm: '', authGrpExpl: '',
            useYn: 'Y', iudType: IudType.I,
        }]);
    };

    const handleDeleteRowAuthGrp = () => {
        const removedKeys = applyDeleteRows(
            authGrpDataSource, setAuthGrpDataSource,
            selectedAuthGrpRowKeys, setSelectedAuthGrpRowKeys, 'authGrpSeq',
        );
        if (!removedKeys) return;
        removedKeys.forEach(seq => unregister(`${seq}_authGrpNm`));
        setSelectedAuthGrpRowIndex(-1);
    };

    const handleAuthGrpRowClick = async (record: AuthGrpList, index: number) => {
        if (index === selectedAuthGrpRowIndex) return;
        if (isAuthChanged || isAuthUserChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 계속 하시겠습니까?')) return;
        }
        setSelectedAuthGrpRowIndex(index);
        resetAuthUserState();
        setSelectedAuthRowIndex(-1);
        setSelectedAuthRowKeys([]);
        if (record.rgstUserSeq && record.authGrpSeq) {
            await fetchAuthWithAutoSelect(record.authGrpSeq);
        } else {
            setAuthDataSource([]);
        }
    };

    // ── Auth Handlers ──
    const handleAddRowAuth = () => {
        if (!selectedAuthGrp?.rgstUserSeq) {
            message.info('저장된 권한그룹을 선택해 주세요.');
            return;
        }
        const tempSeq = tempSeqRef.current--;
        setAuthDataSource(prev => [...prev, {
            authSeq: tempSeq, authGrpSeq: selectedAuthGrp.authGrpSeq,
            authNm: '', authExpl: '', useYn: 'Y', iudType: IudType.I,
        }]);
    };

    const handleDeleteRowAuth = () => {
        if (!applyDeleteRows(
            authDataSource, setAuthDataSource,
            selectedAuthRowKeys, setSelectedAuthRowKeys, 'authSeq',
        )) return;
        setSelectedAuthRowIndex(-1);
    };

    const handleAuthRowClick = async (record: AuthInfoList, index: number) => {
        if (index === selectedAuthRowIndex) return;
        if (isAuthUserChanged) {
            if (!await confirm('저장하지 않은 내용은 초기화 됩니다. 계속 하시겠습니까?')) return;
        }
        setSelectedAuthRowIndex(index);
        setSelectedAuthUserRowKeys([]);
        if (record.rgstUserSeq && record.authSeq) {
            await fetchAuthUserList(record.authGrpSeq, record.authSeq);
        } else {
            setAuthUserDataSource([]);
        }
    };

    // ── Auth User Handlers ──
    const handleDeleteRowAuthUser = () => {
        applyDeleteRows(
            authUserDataSource, setAuthUserDataSource,
            selectedAuthUserRowKeys, setSelectedAuthUserRowKeys, 'authUserSeq',
        );
    };

    const handleAddUserFromPopup = (user: UserSearchResult) => {
        if (!selectedAuth) {
            message.info('권한을 선택해 주세요.');
            return;
        }
        if (authUserDataSource.some(v => v.userSeq === user.userSeq)) {
            message.info('이미 추가된 사용자입니다.');
            return;
        }
        const tempSeq = tempSeqRef.current--;
        setAuthUserDataSource(prev => [...prev, {
            authUserSeq: tempSeq,
            authGrpSeq: selectedAuth.authGrpSeq,
            authSeq: selectedAuth.authSeq,
            userSeq: user.userSeq,
            userId: user.userId,
            userName: user.userName,
            strDt: dayjs().format('YYYYMMDD'),
            endDt: '29991231',
            useYn: 'Y',
            iudType: IudType.I,
        }]);
    };

    // ── User Popup Handlers ──
    const handleOpenUserPopup = () => {
        if (!selectedAuth?.rgstUserSeq) {
            message.info('저장된 권한을 선택해 주세요.');
            return;
        }
        setIsUserPopupOpen(true);
    };

    // ── Save ──
    const handleSave = async () => {
        if (!isAnyChanged) {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        try {
            const res = await callSaveAuthManagement({
                authGrpList: authGrpDataSource.map(v =>
                    v.iudType === IudType.I ? {...v, authGrpSeq: undefined} : v
                ) as AuthGrpList[],
                authList: authDataSource.map(v =>
                    v.iudType === IudType.I ? {...v, authSeq: undefined} : v
                ) as AuthInfoList[],
                authUserList: authUserDataSource.map(v =>
                    v.iudType === IudType.I ? {...v, authUserSeq: undefined} : v
                ) as AuthUserInfoList[],
            });
            if (res.code !== HttpStatusCode.Ok) return;
            message.success('저장되었습니다.');

            const hasDeletedAuthGrp = authGrpDataSource.some(v => v.iudType === IudType.D);
            const hasDeletedAuth = authDataSource.some(v => v.iudType === IudType.D);

            if (hasDeletedAuthGrp) {
                autoSelectAuthGrpRef.current = true;
                setSelectedAuthGrpRowIndex(-1);
                setSelectedAuthGrpRowKeys([]);
                setSelectedAuthRowIndex(-1);
                setSelectedAuthRowKeys([]);
                resetAuthUserState();

                const grpRes = await callGetAuthGrpList();
                if (grpRes.code === HttpStatusCode.Ok) {
                    setOrgAuthGrpDataSource(structuredClone(grpRes.item));
                }
            } else if (hasDeletedAuth) {
                const grpRes = await callGetAuthGrpList();
                if (grpRes.code === HttpStatusCode.Ok) {
                    setOrgAuthGrpDataSource(structuredClone(grpRes.item));
                }
                setSelectedAuthRowIndex(-1);
                setSelectedAuthRowKeys([]);
                resetAuthUserState();

                if (selectedAuthGrp?.authGrpSeq && selectedAuthGrp?.rgstUserSeq) {
                    await fetchAuthWithAutoSelect(selectedAuthGrp.authGrpSeq);
                }
            } else {
                const grpRes = await callGetAuthGrpList();
                if (grpRes.code === HttpStatusCode.Ok) {
                    setOrgAuthGrpDataSource(structuredClone(grpRes.item));
                }
                if (selectedAuthGrp?.authGrpSeq && selectedAuthGrp?.rgstUserSeq) {
                    const authRes = await callGetAuthList(selectedAuthGrp.authGrpSeq);
                    if (authRes.code === HttpStatusCode.Ok) {
                        setAuthDataSource(structuredClone(authRes.item));
                    }
                }
                if (selectedAuth?.authSeq && selectedAuth?.rgstUserSeq && selectedAuthGrp?.authGrpSeq) {
                    await fetchAuthUserList(selectedAuthGrp.authGrpSeq, selectedAuth.authSeq);
                }
            }
        } catch {
            // handled by axios interceptor
        }
    };

    // ── Effects ──
    useEffect(() => {
        const cloned = structuredClone(orgAuthGrpDataSource);
        setAuthGrpDataSource(cloned);

        if (autoSelectAuthGrpRef.current && cloned.length > 0) {
            autoSelectAuthGrpRef.current = false;
            setSelectedAuthGrpRowIndex(0);
            const first = cloned[0];
            if (first.rgstUserSeq && first.authGrpSeq) {
                fetchAuthWithAutoSelect(first.authGrpSeq);
            }
        }
    }, [orgAuthGrpDataSource]);

    useEffect(() => {
        const currentSeqs = authDataSource.map(v => v.authSeq);
        const removedSeqs = prevAuthSeqsRef.current.filter(seq => !currentSeqs.includes(seq));
        removedSeqs.forEach(seq => unregister(`${seq}_authNm`));
        prevAuthSeqsRef.current = currentSeqs;
    }, [authDataSource]);

    useEffect(() => {
        callGetAuthGrpList().then(res => {
            if (res.code === HttpStatusCode.Ok) {
                setOrgAuthGrpDataSource(structuredClone(res.item));
            }
        });
    }, []);

    return {
        form,

        // AuthGroup
        authGrpDataSource,
        selectedAuthGrpRowIndex,
        selectedAuthGrpRowKeys,
        setSelectedAuthGrpRowKeys,
        handleAuthGrpRowClick,
        handleAddRowAuthGrp,
        handleDeleteRowAuthGrp,
        handleDataChangeAuthGrp,

        // Auth
        authDataSource,
        selectedAuthRowIndex,
        selectedAuthRowKeys,
        setSelectedAuthRowKeys,
        handleAuthRowClick,
        handleAddRowAuth,
        handleDeleteRowAuth,
        handleDataChangeAuth,

        // AuthUser
        authUserDataSource,
        selectedAuthUserRowKeys,
        setSelectedAuthUserRowKeys,
        handleDeleteRowAuthUser,
        handleOpenUserPopup,
        handleAddUserFromPopup,
        handleDataChangeAuthUser,

        // Popup
        isUserPopupOpen,
        setIsUserPopupOpen,

        // Derived (선택 컨텍스트)
        selectedAuthGrp,
        selectedAuth,

        // Top-level
        handleReset,
        handleSearchAuthGrpList,
        handleSave,
    };
}
