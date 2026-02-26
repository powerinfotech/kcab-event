import CustomButton from '@component/CustomButton';
import React, {useEffect, useRef, useState} from 'react';
import {ColumnsType} from 'antd/es/table';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import CustomInput from '@component/CustomInput';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomDatePicker from '@component/CustomDatePicker';
import {HttpStatusCode} from 'axios';
import {message} from 'antd';
import IconTitle from '@icon/IconTitle';
import {AuthGrpList, AuthInfoList, AuthUserInfoList, UserSearchResult} from '@interface/auth/AuthManagement';
import UserSearchPopup from '@component/popup/UserSearchPopup';
import {IudType, PageButtonHandlers} from '@interface/common';
import {callGetAuthGrpList, callGetAuthList, callGetAuthUserList, callSaveAuthManagement} from '@api/auth/AuthManagementApi';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import {useMessage} from '@hook/useMessage';
import dayjs from 'dayjs';

function applyDataChange<T extends Record<string, any>>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    keyField: keyof T,
    record: T,
    field: string,
    value: any,
) {
    setter(prev => prev.map(item =>
        item[keyField] === record[keyField]
            ? {...item, [field]: value, iudType: item.iudType !== IudType.I ? IudType.U : item.iudType}
            : item
    ));
}

function applyDeleteRows<T extends { iudType?: IudType }>(
    dataSource: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    selectedKeys: React.Key[],
    setSelectedKeys: React.Dispatch<React.SetStateAction<React.Key[]>>,
    keyField: keyof T,
): React.Key[] | null {
    if (selectedKeys.length === 0) {
        message.info('선택한 내용이 없습니다.');
        return null;
    }
    const newRowKeys = dataSource
        .filter(v => selectedKeys.includes(v[keyField] as React.Key) && v.iudType === IudType.I)
        .map(v => v[keyField] as React.Key);
    setter(
        dataSource
            .filter(v => !(selectedKeys.includes(v[keyField] as React.Key) && v.iudType === IudType.I))
            .map(v => selectedKeys.includes(v[keyField] as React.Key) ? {...v, iudType: IudType.D} : v)
    );
    setSelectedKeys(prev => prev.filter(key => !newRowKeys.includes(key)));
    return newRowKeys;
}

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
        control: authGrpControl, handleSubmit: authGrpHandleSubmit, setValue: authGrpSetValue,
    } = useForm<any>({mode: 'onSubmit'});
    const {confirm} = useMessage();
    const tempSeqRef = useRef(-1);
    const autoSelectAuthGrpRef = useRef(true);

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
        removedKeys.forEach(seq => authGrpUnregister(`${seq}_authGrpNm`));
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
            message.success('저장이 완료 되었습니다.');

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
        } catch {
            // handled by axios interceptor
        }
    };

    // ── Columns ──
    const authGrpColumn: ColumnsType<AuthGrpList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">권한그룹명<em>*</em></span>,
            key: 'authGrpNm', dataIndex: 'authGrpNm', align: 'center', width: '25%',
            render: (value: string, record: AuthGrpList) => {
                if (record.rgstUserSeq && record.useYn !== 'Y') return value;
                return <AuthGrpNmCell record={record} value={value} setValue={authGrpSetValue}
                    control={authGrpControl} register={authGrpRegister} onDataChange={handleDataChangeAuthGrp}/>;
            },
        },
        {
            title: '설명', key: 'authGrpExpl', dataIndex: 'authGrpExpl', align: 'center', width: '40%',
            render: (value: string, record: AuthGrpList) =>
                record.rgstUserSeq && record.useYn !== 'Y' ? value :
                    <CustomInput name={`${record.authGrpSeq}_authGrpExpl`} value={value} maxLength={200}
                        onChange={(e) => handleDataChangeAuthGrp(record, 'authGrpExpl', e.target.value)}/>,
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '15%',
            render: (value: string, record: AuthGrpList) =>
                <CustomCheckbox name={`${record.authGrpSeq}_useYn`} checked={value === 'Y'}
                    onChange={(e) => handleDataChangeAuthGrp(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
    ];

    const authColumn: ColumnsType<AuthInfoList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">권한명<em>*</em></span>,
            key: 'authNm', dataIndex: 'authNm', align: 'center', width: '30%',
            render: (value: string, record: AuthInfoList) =>
                <CustomInput value={value} maxLength={100}
                    onChange={(e) => handleDataChangeAuth(record, 'authNm', e.target.value)}/>,
        },
        {
            title: '권한설명', key: 'authExpl', dataIndex: 'authExpl', align: 'center', width: '35%',
            render: (value: string, record: AuthInfoList) =>
                <CustomInput value={value} maxLength={2000}
                    onChange={(e) => handleDataChangeAuth(record, 'authExpl', e.target.value)}/>,
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '15%',
            render: (value: string, record: AuthInfoList) =>
                <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => handleDataChangeAuth(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
    ];

    const authUserColumn: ColumnsType<AuthUserInfoList> = [
        IUD_COLUMN,
        {title: '사용자ID', key: 'userId', dataIndex: 'userId', align: 'center', width: '20%'},
        {title: '사용자명', key: 'userName', dataIndex: 'userName', align: 'center', width: '15%'},
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '13%',
            render: (value: string, record: AuthUserInfoList) =>
                <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => handleDataChangeAuthUser(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
        {
            title: '시작일', key: 'strDt', dataIndex: 'strDt', align: 'center', width: '18%',
            render: (value: string, record: AuthUserInfoList) =>
                <CustomDatePicker
                    value={value ? dayjs(value, 'YYYYMMDD') : null}
                    onChange={(date) => handleDataChangeAuthUser(record, 'strDt', date ? date.format('YYYYMMDD') : '')}
                    style={{width: '100%'}}/>,
        },
        {
            title: '종료일', key: 'endDt', dataIndex: 'endDt', align: 'center', width: '18%',
            render: (value: string, record: AuthUserInfoList) =>
                <CustomDatePicker
                    value={value ? dayjs(value, 'YYYYMMDD') : null}
                    onChange={(date) => handleDataChangeAuthUser(record, 'endDt', date ? date.format('YYYYMMDD') : '')}
                    style={{width: '100%'}}/>,
        },
    ];

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

    // ── Render ──
    return (
        <>
            <section className="board-wrap" style={{display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
                {/* 권한그룹정보 */}
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

                {/* 권한정보 + 권한사용자정보 */}
                <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px'}}>
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

            <UserSearchPopup
                open={isUserPopupOpen}
                onClose={() => setIsUserPopupOpen(false)}
                onSelect={handleAddUserFromPopup}
            />
        </>
    );
};

export default AuthManagement;
