import CustomButton from '@component/CustomButton';
import React, {useEffect, useRef, useState} from 'react';
import {ColumnsType} from 'antd/es/table';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import CustomInput from '@component/CustomInput';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomDatePicker from '@component/CustomDatePicker';
import {HttpStatusCode} from 'axios';
import {message, Modal} from 'antd';
import IconTitle from '@icon/IconTitle';
import {AuthGrpList, AuthInfoList, AuthUserInfoList, UserSearchResult} from '@interface/auth/AuthManagement';
import {IudType, PageButtonHandlers} from '@interface/common';
import {callGetAuthGrpList, callGetAuthList, callGetAuthUserList, callSaveAuthManagement, callSearchUsers} from '@api/auth/AuthManagementApi';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import {useMessage} from '@hook/useMessage';
import dayjs from 'dayjs';

const AuthGrpNmCell = ({
    record, value, setValue, control, register, onDataChange,
}: {
    record: AuthGrpList; value: string; setValue: (name: string, v: string) => void;
    control: any; register: any; onDataChange: (record: AuthGrpList, key: string, value: any) => void;
}) => {
    const fieldName = `${record.authGrpSeq}_authGrpNm`;
    useEffect(() => { setValue(fieldName, value); }, [fieldName, value, setValue]);
    return (
        <CustomValidFormInput
            control={control} required={true} maxLength={100}
            regExp={{value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]*$/, message: '권한그룹명은 한글,영문,숫자만 입력가능합니다.'}}
            onChangeValue={(e) => onDataChange(record, 'authGrpNm', e)}
            {...register(fieldName, {required: '권한그룹명은 필수입력입니다.'})}
        />
    );
};

const AuthManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {
        register: authGrpRegister, unregister: authGrpUnregister,
        control: authGrpControl, handleSubmit: authGrpHandleSubmit, setValue: authGrpSetValue
    } = useForm<any>({mode: 'onSubmit'});
    const {confirm} = useMessage();
    const tempSeqRef = useRef(-1);

    // ── Auth Group State (tb_auth_grp) ──
    const [authGrpDataSource, setAuthGrpDataSource] = useState<AuthGrpList[]>([]);
    const [orgAuthGrpDataSource, setOrgAuthGrpDataSource] = useState<AuthGrpList[]>([]);
    const [selectedAuthGrpRowIndex, setSelectedAuthGrpRowIndex] = useState(-1);
    const [selectedAuthGrpRowKeys, setSelectedAuthGrpRowKeys] = useState<React.Key[]>([]);
    const [isIncludeUnusable, setIsIncludeUnusable] = useState<boolean>(false);

    // ── Auth State (tb_auth) ──
    const [authDataSource, setAuthDataSource] = useState<AuthInfoList[]>([]);
    const [orgAuthDataSource, setOrgAuthDataSource] = useState<AuthInfoList[]>([]);
    const [selectedAuthRowIndex, setSelectedAuthRowIndex] = useState(-1);
    const [selectedAuthRowKeys, setSelectedAuthRowKeys] = useState<React.Key[]>([]);

    // ── Auth User State (tb_auth_user) ──
    const [authUserDataSource, setAuthUserDataSource] = useState<AuthUserInfoList[]>([]);
    const [orgAuthUserDataSource, setOrgAuthUserDataSource] = useState<AuthUserInfoList[]>([]);
    const [selectedAuthUserRowKeys, setSelectedAuthUserRowKeys] = useState<React.Key[]>([]);

    // ── User Popup State ──
    const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
    const [userSearchList, setUserSearchList] = useState<UserSearchResult[]>([]);
    const [userSearchText, setUserSearchText] = useState('');
    const [excludeUnused, setExcludeUnused] = useState(true);
    const [selectedUserRowIndex, setSelectedUserRowIndex] = useState(-1);

    // ── Derived ──
    const isAuthGrpChanged = authGrpDataSource.some(v => v.iudType);
    const isAuthChanged = authDataSource.some(v => v.iudType);
    const isAuthUserChanged = authUserDataSource.some(v => v.iudType);
    const isAnyChanged = isAuthGrpChanged || isAuthChanged || isAuthUserChanged;
    const selectedAuthGrp = selectedAuthGrpRowIndex >= 0 ? authGrpDataSource[selectedAuthGrpRowIndex] : null;
    const selectedAuth = selectedAuthRowIndex >= 0 ? authDataSource[selectedAuthRowIndex] : null;

    // ══════════════════════════════════════════
    //  AUTH GRP HANDLERS (tb_auth_grp)
    // ══════════════════════════════════════════
    const handleSearchAuthGrpList = async () => {
        if (isAnyChanged) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if (!result) return;
        }
        const res = await callGetAuthGrpList();
        if (res.code === HttpStatusCode.Ok) {
            autoSelectAuthGrpRef.current = true;
            setOrgAuthGrpDataSource(structuredClone(res.item));
        }
        setSelectedAuthGrpRowIndex(-1);
        setSelectedAuthGrpRowKeys([]);
    };

    const handleDataChangeAuthGrp = (record: AuthGrpList, key: string, value: any) => {
        const updated = authGrpDataSource.map((item) => {
            if (record.authGrpSeq === item.authGrpSeq) {
                return {...item, [key]: value, iudType: item.iudType !== IudType.I ? IudType.U : item.iudType};
            }
            return item;
        });
        setAuthGrpDataSource(updated);
    };

    const handleAddRowAuthGrp = () => {
        const tempSeq = tempSeqRef.current--;
        setAuthGrpDataSource([...authGrpDataSource, {
            authGrpSeq: tempSeq, authGrpNm: '', authGrpExpl: '',
            useYn: 'Y', iudType: IudType.I
        }]);
    };

    const handleDeleteRowAuthGrp = () => {
        if (authGrpDataSource.filter((v) => selectedAuthGrpRowKeys.includes(v.authGrpSeq)).length === 0) {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        const removedKeys = authGrpDataSource
            .filter((v) => selectedAuthGrpRowKeys.includes(v.authGrpSeq) && v.iudType === IudType.I)
            .map((v) => v.authGrpSeq);
        removedKeys.forEach((seq) => { authGrpUnregister(`${seq}_authGrpNm`); });
        setAuthGrpDataSource(authGrpDataSource
            .filter((v) => !(selectedAuthGrpRowKeys.includes(v.authGrpSeq) && v.iudType === IudType.I))
            .map((v) => selectedAuthGrpRowKeys.includes(v.authGrpSeq) ? {...v, iudType: IudType.D} : v)
        );
        setSelectedAuthGrpRowKeys((prev) => prev.filter((key) => !removedKeys.includes(key as number)));
        setSelectedAuthGrpRowIndex(-1);
    };

    const handleAuthGrpRowClick = async (record: AuthGrpList, index: number) => {
        if (index === selectedAuthGrpRowIndex) return;
        if (isAuthChanged || isAuthUserChanged) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }
        setSelectedAuthGrpRowIndex(index);
        resetAuthUserState();
        setSelectedAuthRowIndex(-1);
        setSelectedAuthRowKeys([]);
        if (record.rgstUserSeq && record.authGrpSeq) {
            await fetchAuthWithAutoSelect(record.authGrpSeq);
        } else {
            setAuthDataSource([]);
            setOrgAuthDataSource([]);
        }
    };

    const fetchAuthWithAutoSelect = async (authGrpSeq: number) => {
        const res = await callGetAuthList(authGrpSeq);
        if (res.code !== HttpStatusCode.Ok) return;
        const authList = structuredClone(res.item);
        setAuthDataSource(authList);
        setOrgAuthDataSource(authList);
        if (authList.length > 0) {
            setSelectedAuthRowIndex(0);
            const firstAuth = authList[0];
            if (firstAuth.rgstUserSeq && firstAuth.authSeq) {
                const userRes = await callGetAuthUserList(firstAuth.authGrpSeq, firstAuth.authSeq);
                if (userRes.code === HttpStatusCode.Ok) {
                    setAuthUserDataSource(structuredClone(userRes.item));
                    setOrgAuthUserDataSource(structuredClone(userRes.item));
                }
            }
        }
    };

    // ══════════════════════════════════════════
    //  AUTH HANDLERS (tb_auth)
    // ══════════════════════════════════════════

    const handleDataChangeAuth = (record: AuthInfoList, key: string, value: any) => {
        const updated = authDataSource.map((item) => {
            if (record.authSeq === item.authSeq) {
                return {...item, [key]: value, iudType: item.iudType !== IudType.I ? IudType.U : item.iudType};
            }
            return item;
        });
        setAuthDataSource(updated);
    };

    const handleAddRowAuth = () => {
        if (!selectedAuthGrp || !selectedAuthGrp.rgstUserSeq) {
            message.info('저장된 권한그룹을 선택해 주세요.');
            return;
        }
        const tempSeq = tempSeqRef.current--;
        setAuthDataSource([...authDataSource, {
            authSeq: tempSeq, authGrpSeq: selectedAuthGrp.authGrpSeq,
            authNm: '', authExpl: '', useYn: 'Y', iudType: IudType.I
        }]);
    };

    const handleDeleteRowAuth = () => {
        if (selectedAuthRowKeys.length === 0) {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        const removedKeys = authDataSource
            .filter((v) => selectedAuthRowKeys.includes(v.authSeq) && v.iudType === IudType.I)
            .map((v) => v.authSeq);
        setAuthDataSource(authDataSource
            .filter((v) => !(selectedAuthRowKeys.includes(v.authSeq) && v.iudType === IudType.I))
            .map((v) => selectedAuthRowKeys.includes(v.authSeq) ? {...v, iudType: IudType.D} : v)
        );
        setSelectedAuthRowKeys((prev) => prev.filter((key) => !removedKeys.includes(key as number)));
        setSelectedAuthRowIndex(-1);
    };

    const handleAuthRowClick = async (record: AuthInfoList, index: number) => {
        if (index === selectedAuthRowIndex) return;
        if (isAuthUserChanged) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }
        setSelectedAuthRowIndex(index);
        setSelectedAuthUserRowKeys([]);
        if (record.rgstUserSeq && record.authSeq) {
            const res = await callGetAuthUserList(record.authGrpSeq, record.authSeq);
            if (res.code === HttpStatusCode.Ok) {
                setAuthUserDataSource(structuredClone(res.item));
                setOrgAuthUserDataSource(structuredClone(res.item));
            }
        } else {
            setAuthUserDataSource([]);
            setOrgAuthUserDataSource([]);
        }
    };

    // ══════════════════════════════════════════
    //  AUTH USER HANDLERS (tb_auth_user)
    // ══════════════════════════════════════════
    const resetAuthUserState = () => {
        setAuthUserDataSource([]);
        setOrgAuthUserDataSource([]);
        setSelectedAuthUserRowKeys([]);
    };

    const handleDataChangeAuthUser = (record: AuthUserInfoList, key: string, value: any) => {
        const updated = authUserDataSource.map((item) => {
            if (record.authUserSeq === item.authUserSeq) {
                return {...item, [key]: value, iudType: item.iudType !== IudType.I ? IudType.U : item.iudType};
            }
            return item;
        });
        setAuthUserDataSource(updated);
    };

    const handleDeleteRowAuthUser = () => {
        if (selectedAuthUserRowKeys.length === 0) {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        const removedKeys = authUserDataSource
            .filter((v) => selectedAuthUserRowKeys.includes(v.authUserSeq) && v.iudType === IudType.I)
            .map((v) => v.authUserSeq);
        setAuthUserDataSource(authUserDataSource
            .filter((v) => !(selectedAuthUserRowKeys.includes(v.authUserSeq) && v.iudType === IudType.I))
            .map((v) => selectedAuthUserRowKeys.includes(v.authUserSeq) ? {...v, iudType: IudType.D} : v)
        );
        setSelectedAuthUserRowKeys((prev) => prev.filter((key) => !removedKeys.includes(key as number)));
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
        setAuthUserDataSource([...authUserDataSource, {
            authUserSeq: tempSeq,
            authGrpSeq: selectedAuth.authGrpSeq,
            authSeq: selectedAuth.authSeq,
            userSeq: user.userSeq,
            userId: user.userId,
            userName: user.userName,
            strDt: dayjs().format('YYYYMMDD'),
            endDt: '29991231',
            useYn: 'Y',
            iudType: IudType.I
        }]);
    };

    // ══════════════════════════════════════════
    //  USER POPUP HANDLERS
    // ══════════════════════════════════════════
    const handleOpenUserPopup = () => {
        if (!selectedAuth || !selectedAuth.rgstUserSeq) {
            message.info('저장된 권한을 선택해 주세요.');
            return;
        }
        setUserSearchText('');
        setExcludeUnused(true);
        setSelectedUserRowIndex(-1);
        setIsUserPopupOpen(true);
        callSearchUsers('', true).then(res => {
            if (res.code === HttpStatusCode.Ok) setUserSearchList(res.item);
        });
    };

    const handleSearchUser = () => {
        callSearchUsers(userSearchText, excludeUnused).then(res => {
            if (res.code === HttpStatusCode.Ok) setUserSearchList(res.item);
        });
    };

    const handleUserPopupOk = () => {
        if (selectedUserRowIndex >= 0 && userSearchList[selectedUserRowIndex]) {
            handleAddUserFromPopup(userSearchList[selectedUserRowIndex]);
        }
        setIsUserPopupOpen(false);
    };

    const handleUserDoubleClick = (record: UserSearchResult) => {
        handleAddUserFromPopup(record);
        setIsUserPopupOpen(false);
    };

    // ══════════════════════════════════════════
    //  SAVE & RESET
    // ══════════════════════════════════════════
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
                ) as AuthUserInfoList[]
            });
            if (res.code !== HttpStatusCode.Ok) return;

            message.success('저장이 완료 되었습니다.');

            const grpRes = await callGetAuthGrpList();
            if (grpRes.code === HttpStatusCode.Ok) {
                setOrgAuthGrpDataSource(structuredClone(grpRes.item));
            }
            if (selectedAuthGrp?.authGrpSeq && selectedAuthGrp?.rgstUserSeq) {
                const authRes = await callGetAuthList(selectedAuthGrp.authGrpSeq);
                if (authRes.code === HttpStatusCode.Ok) {
                    setAuthDataSource(structuredClone(authRes.item));
                    setOrgAuthDataSource(structuredClone(authRes.item));
                }
            }
            if (selectedAuth?.authSeq && selectedAuth?.rgstUserSeq && selectedAuthGrp?.authGrpSeq) {
                const userRes = await callGetAuthUserList(selectedAuthGrp.authGrpSeq, selectedAuth.authSeq);
                if (userRes.code === HttpStatusCode.Ok) {
                    setAuthUserDataSource(structuredClone(userRes.item));
                    setOrgAuthUserDataSource(structuredClone(userRes.item));
                }
            }
        } catch {
            // handled by axios interceptor
        }
    };

    // ══════════════════════════════════════════
    //  COLUMNS
    // ══════════════════════════════════════════
    const authGrpColumn: ColumnsType<AuthGrpList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">권한그룹명<em>*</em></span>,
            key: 'authGrpNm', dataIndex: 'authGrpNm', align: 'center', width: '25%',
            render: (value: string, record: AuthGrpList) => {
                if (record.rgstUserSeq && record.useYn !== 'Y') return value;
                return <AuthGrpNmCell record={record} value={value} setValue={authGrpSetValue}
                    control={authGrpControl} register={authGrpRegister} onDataChange={handleDataChangeAuthGrp}/>;
            }
        },
        {
            title: '설명', key: 'authGrpExpl', dataIndex: 'authGrpExpl', align: 'center', width: '40%',
            render: (value: string, record: AuthGrpList) => {
                return record.rgstUserSeq && record.useYn !== 'Y' ? value :
                    <CustomInput name={`${record.authGrpSeq}_authGrpExpl`} value={value} maxLength={200}
                        onChange={(e) => handleDataChangeAuthGrp(record, 'authGrpExpl', e.target.value)}/>;
            }
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '15%',
            render: (value: string, record: AuthGrpList) => {
                return <CustomCheckbox name={`${record.authGrpSeq}_useYn`} checked={value === 'Y'}
                    onChange={(e) => handleDataChangeAuthGrp(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>;
            }
        }
    ];

    const authColumn: ColumnsType<AuthInfoList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">권한명<em>*</em></span>,
            key: 'authNm', dataIndex: 'authNm', align: 'center', width: '30%',
            render: (value: string, record: AuthInfoList) => {
                return <CustomInput value={value} maxLength={100}
                    onChange={(e) => handleDataChangeAuth(record, 'authNm', e.target.value)}/>;
            }
        },
        {
            title: '권한설명', key: 'authExpl', dataIndex: 'authExpl', align: 'center', width: '35%',
            render: (value: string, record: AuthInfoList) => {
                return <CustomInput value={value} maxLength={2000}
                    onChange={(e) => handleDataChangeAuth(record, 'authExpl', e.target.value)}/>;
            }
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '15%',
            render: (value: string, record: AuthInfoList) => {
                return <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => handleDataChangeAuth(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>;
            }
        }
    ];

    const authUserColumn: ColumnsType<AuthUserInfoList> = [
        IUD_COLUMN,
        {title: '사용자ID', key: 'userId', dataIndex: 'userId', align: 'center', width: '20%'},
        {title: '사용자명', key: 'userName', dataIndex: 'userName', align: 'center', width: '15%'},
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '13%',
            render: (value: string, record: AuthUserInfoList) => {
                return <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => handleDataChangeAuthUser(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>;
            }
        },
        {
            title: '시작일', key: 'strDt', dataIndex: 'strDt', align: 'center', width: '18%',
            render: (value: string, record: AuthUserInfoList) => {
                return <CustomDatePicker
                    value={value ? dayjs(value, 'YYYYMMDD') : null}
                    onChange={(date) => handleDataChangeAuthUser(record, 'strDt', date ? date.format('YYYYMMDD') : '')}
                    style={{width: '100%'}}
                />;
            }
        },
        {
            title: '종료일', key: 'endDt', dataIndex: 'endDt', align: 'center', width: '18%',
            render: (value: string, record: AuthUserInfoList) => {
                return <CustomDatePicker
                    value={value ? dayjs(value, 'YYYYMMDD') : null}
                    onChange={(date) => handleDataChangeAuthUser(record, 'endDt', date ? date.format('YYYYMMDD') : '')}
                    style={{width: '100%'}}
                />;
            }
        }
    ];

    const userPopupColumn: ColumnsType<UserSearchResult> = [
        {title: '사용자 ID', key: 'userId', dataIndex: 'userId', align: 'center', width: '50%'},
        {title: '사용자명', key: 'userName', dataIndex: 'userName', align: 'center', width: '50%'}
    ];

    // ══════════════════════════════════════════
    //  EFFECTS
    // ══════════════════════════════════════════
    const autoSelectAuthGrpRef = useRef(true);
    useEffect(() => {
        if (orgAuthGrpDataSource) {
            const filtered = isIncludeUnusable
                ? structuredClone(orgAuthGrpDataSource)
                : structuredClone(orgAuthGrpDataSource).filter((v: AuthGrpList) => v.useYn === 'Y' || v.iudType !== null);
            setAuthGrpDataSource(filtered);

            if (autoSelectAuthGrpRef.current && filtered.length > 0) {
                autoSelectAuthGrpRef.current = false;
                setSelectedAuthGrpRowIndex(0);
                const firstRow = filtered[0];
                if (firstRow.rgstUserSeq && firstRow.authGrpSeq) {
                    fetchAuthWithAutoSelect(firstRow.authGrpSeq);
                }
            }
        }
    }, [orgAuthGrpDataSource, isIncludeUnusable]);

    useEffect(() => {
        callGetAuthGrpList().then(res => {
            if (res.code === HttpStatusCode.Ok) {
                setOrgAuthGrpDataSource(structuredClone(res.item));
            }
        });
    }, []);

    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleSearchAuthGrpList,
                cfmSearch: handleSearchAuthGrpList,
                cfmSave: authGrpHandleSubmit(handleSave),
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    // ══════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════
    return (
        <>
            <section className="board-wrap" style={{display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
                {/* ── LEFT: 권한그룹정보 (tb_auth_grp) ── */}
                <div style={{flex: '0 0 38%', minWidth: 0}}>
                    <div className="board-title-wrap">
                        <h3 className="title"><IconTitle/>권한그룹정보</h3>
                        <span className="total-count">Total {authGrpDataSource.length}</span>
                        <div className="box-btn">
                            <CustomButton type="default" size="small" onClick={handleAddRowAuthGrp}>+ 행추가</CustomButton>
                            <CustomButton type="default" size="small" onClick={handleDeleteRowAuthGrp}>- 행삭제</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            onRow={(record: any, index?: number) => ({
                                onClick: () => {
                                    if (index !== selectedAuthGrpRowIndex) handleAuthGrpRowClick(record, index ?? -1);
                                },
                            })}
                            rowSelection={{
                                selectedRowKeys: selectedAuthGrpRowKeys,
                                onChange: (keys: React.Key[]) => setSelectedAuthGrpRowKeys(keys),
                            }}
                            rowKey={'authGrpSeq'} pagination={false} rowNoFlag={true} rowSelectedFlag={true}
                            columns={authGrpColumn} dataSource={authGrpDataSource}
                            selectedRowIndex={selectedAuthGrpRowIndex}
                        />
                    </div>
                </div>

                {/* ── RIGHT ── */}
                <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    {/* ── RIGHT TOP: 권한정보 (tb_auth) ── */}
                    <div>
                        <div className="board-title-wrap">
                            <h3 className="title"><IconTitle/>권한정보</h3>
                            <span className="total-count">Total {authDataSource.length}</span>
                            <div className="box-btn">
                                <CustomButton type="default" size="small" onClick={handleAddRowAuth}>+ 행추가</CustomButton>
                                <CustomButton type="default" size="small" onClick={handleDeleteRowAuth}>- 행삭제</CustomButton>
                            </div>
                        </div>
                        <div className="board-cont-wrap">
                            <CustomTable
                                onRow={(record: any, index?: number) => ({
                                    onClick: () => {
                                        if (index !== selectedAuthRowIndex) handleAuthRowClick(record, index ?? -1);
                                    },
                                })}
                                rowSelection={{
                                    selectedRowKeys: selectedAuthRowKeys,
                                    onChange: (keys: React.Key[]) => setSelectedAuthRowKeys(keys),
                                }}
                                rowKey={'authSeq'} pagination={false} rowNoFlag={true} rowSelectedFlag={true}
                                columns={authColumn} dataSource={authDataSource}
                                selectedRowIndex={selectedAuthRowIndex}
                            />
                        </div>
                    </div>

                    {/* ── RIGHT BOTTOM: 사용자정보 (tb_auth_user) ── */}
                    <div>
                        <div className="board-title-wrap">
                            <h3 className="title"><IconTitle/>권한사용자정보</h3>
                            <span className="total-count">Total {authUserDataSource.length}</span>
                            <div className="box-btn">
                                <CustomButton type="default" size="small" onClick={handleOpenUserPopup}>인원추가</CustomButton>
                                <CustomButton type="default" size="small" onClick={handleDeleteRowAuthUser}>- 행삭제</CustomButton>
                            </div>
                        </div>
                        <div className="board-cont-wrap">
                            <CustomTable
                                rowSelection={{
                                    selectedRowKeys: selectedAuthUserRowKeys,
                                    onChange: (keys: React.Key[]) => setSelectedAuthUserRowKeys(keys),
                                }}
                                rowKey={'authUserSeq'} pagination={false} rowNoFlag={true}
                                columns={authUserColumn} dataSource={authUserDataSource}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── USER SEARCH POPUP ── */}
            <Modal title="사용자 팝업" open={isUserPopupOpen} onOk={handleUserPopupOk}
                onCancel={() => setIsUserPopupOpen(false)} width={650} okText="확인" cancelText="취소"
                maskClosable={false}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                    <span>← ID/사용자명</span>
                    <CustomInput value={userSearchText} style={{width: 180}}
                        onChange={(e) => setUserSearchText(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearchUser(); }}/>
                    <CustomCheckbox checked={excludeUnused} onChange={(e) => setExcludeUnused(e.target.checked)}/>
                    <span>미사용자 제외</span>
                    <CustomButton type="primary" size="small" onClick={handleSearchUser}>조회</CustomButton>
                </div>
                <div className="board-title-wrap" style={{marginBottom: '4px'}}>
                    <h3 className="title" style={{fontSize: '13px'}}><IconTitle/>사용자 ID 조회내역</h3>
                    <span className="total-count">Total {userSearchList.length}</span>
                </div>
                <CustomTable
                    onRow={(record: any, index?: number) => ({
                        onClick: () => setSelectedUserRowIndex(index ?? -1),
                        onDoubleClick: () => handleUserDoubleClick(record),
                    })}
                    rowKey={'userSeq'} pagination={false} rowNoFlag={true} rowSelectedFlag={true}
                    columns={userPopupColumn} dataSource={userSearchList}
                    selectedRowIndex={selectedUserRowIndex}
                    scroll={{y: 300}}
                />
            </Modal>
        </>
    );
};

export default AuthManagement;
