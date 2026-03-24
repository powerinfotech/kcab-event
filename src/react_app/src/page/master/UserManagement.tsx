import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import CustomInput from '@component/input/CustomInput';
import CustomButton from '@component/button/CustomButton';
import CustomTable, {IUD_COLUMN} from '@component/display/CustomTable';
import {callDeleteUser, callGetUserList, callSaveUser} from '@api/master/UserManagementApi';
import {User, UserList, UserListSearchParam} from '@interface/master/UserManagement';
import {IudType, PageButtonHandlers} from '@interface/common';
import {HttpStatusCode} from 'axios';
import {ColumnsType} from 'antd/es/table';
import {useCmCode} from '@hook/useCmCode';
import dayjs from 'dayjs';
import CustomCheckbox from '@component/select/CustomCheckbox';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';
import IconTitle from '@icon/IconTitle';
import {useMessage} from '@hook/useMessage';
import {Controller, useForm} from 'react-hook-form';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
import CustomSaveFormDatePicker from '@component/form/CustomSaveFormDatePicker';
import ChangePasswordPopup from '@page/auth/ChangePasswordPopup';
import {usePageHandlers} from '@hook/usePageHandlers';

const columns: ColumnsType<any> = [
    IUD_COLUMN,
    {
        title: <div className="tac">ID</div>,
        key: 'userId',
        dataIndex: 'userId',
        width: '10%',
    },
    {
        title: <div className="tac">사용자구분</div>,
        key: 'userCd',
        dataIndex: 'userCd',
        align: 'center',
        width: '8%',
    },
    {
        title: <div className="tac">성명(한글)</div>,
        key: 'userName',
        dataIndex: 'userName',
        align: 'center',
        width: '9%',
    },
    {
        title: <div className="tac">성명(영문)</div>,
        key: 'userNameEng',
        dataIndex: 'userNameEng',
        width: '10%',
    },
    {
        title: <div className="tac">내선번호</div>,
        key: 'telNo',
        dataIndex: 'telNo',
        align: 'center',
        width: '8%',
    },
    {
        title: <div className="tac">전화번호</div>,
        key: 'hpNo',
        dataIndex: 'hpNo',
        width: '10%',
    },
    {
        title: <div className="tac">이메일</div>,
        key: 'email',
        dataIndex: 'email',
        width: '14%',
    },
    {
        title: <div className="tac">사용시작일</div>,
        key: 'strDate',
        dataIndex: 'strDate',
        align: 'center',
        width: '9%',
        render: (val: string | undefined) => (val ? dayjs(val, 'YYYYMMDD').format('YYYY-MM-DD') : ''),
    },
    {
        title: <div className="tac">사용종료일</div>,
        key: 'endDate',
        dataIndex: 'endDate',
        align: 'center',
        width: '9%',
        render: (val: string | undefined) => (val ? dayjs(val, 'YYYYMMDD').format('YYYY-MM-DD') : ''),
    },
    {
        title: <div className="tac">최종로그인일시</div>,
        key: 'loginDateTime',
        dataIndex: 'loginDateTime',
        align: 'center',
        width: '11%',
        render: (val: string | undefined) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
];

const EMPTY_USER: UserList = {
    userSeq: 0,
    userId: '',
    password: '',
    userName: '',
    userNameEng: '',
    nickName: '',
    userCd: '',
    telNo: '',
    hpNo: '',
    dprtCd: '',
    email: '',
    strDate: undefined,
    endDate: undefined,
    loginDateTime: undefined,
    useYn: 'Y',
    admYn: 'N',
    lastUpdateDate: undefined,
    lastModifyUserName: '',
    iudType: IudType.I,
};

const isItemChanged = (originalItem: User, newItem: User): boolean => {
    for (const key in newItem) {
        if (originalItem[key] !== newItem[key]) return true;
    }
    return false;
};

const toDateVarcharYYYYMMDD = (dateStr: string | undefined): string | undefined => {
    if (!dateStr) return undefined;
    const d = dayjs(dateStr);
    return d.isValid() ? d.format('YYYYMMDD') : undefined;
};

const UserManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const userInfo = useRecoilValue(sessionInfoAtom);
    const {
        control: searchFormControl,
        getValues: searchFormGetValues,
        handleSubmit: searchFormHandleSubmit,
    } = useForm<UserListSearchParam>();
    const {
        register: saveFormRegister,
        control: saveFormControl,
        handleSubmit: saveFormHandleSubmit,
        reset: saveFormReset,
        setValue: saveFormSetValue,
        getValues: saveFormGetValues,
    } = useForm<UserList>({mode: 'onSubmit'});
    const [dataSource, setDataSource] = useState<UserList[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<UserList[]>([]);
    const cmCode = useCmCode(['UserClass']);
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isValidUser, setIsValidUser] = useState<boolean>(false);
    const isEditable = isRowSelected;
    const {confirm} = useMessage();
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const currentDataSource = dataSource[selectedRowIndex];
    const isChangedDataSource = dataSource.some(v => v.iudType);

    const getCurrentRowDataSourceById = (id: number) => {
        return dataSource.find(v => v.userSeq === id);
    };

    const handleSearchList = async () => {
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if (!result) return;
        }
        const idOrName = searchFormGetValues('idOrName') ?? '';
        const isCheck = searchFormGetValues('isCheck') ?? false;
        const res = await callGetUserList({userId: idOrName, userName: idOrName, isCheck});
        setDataSource(structuredClone(res.item));
        setOrgDataSource(structuredClone(res.item));
        if (res.item.length > 0) {
            handleRowSelection(res.item[0], 0);
        } else {
            saveFormReset(EMPTY_USER);
            setIsRowSelected(false);
            setSelectedRowIndex(-1);
        }
    };

    const handleSave = async (value: UserList) => {
        const saveData = getCurrentRowDataSourceById(value.userSeq);
        if (!saveData?.iudType) {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        if (!await confirm('저장 하시겠습니까?')) return;

        const payload = {
            ...saveData,
            strDate: toDateVarcharYYYYMMDD(saveData.strDate),
            endDate: toDateVarcharYYYYMMDD(saveData.endDate),
        };
        const saveResult = await callSaveUser(payload);
        if (saveResult.code !== HttpStatusCode.Ok) return;

        message.info('저장 되었습니다.');
        const idOrName = searchFormGetValues('idOrName') ?? '';
        const isCheck = searchFormGetValues('isCheck') ?? false;
        const res = await callGetUserList({userId: idOrName, userName: idOrName, isCheck});
        setDataSource(structuredClone(res.item));
        setOrgDataSource(structuredClone(res.item));

        const newUserListRowIdx = res.item.findIndex(f => f.userSeq === saveResult.item.userSeq) ?? -1;
        const savedUser = res.item.find(f => f.userSeq === saveResult.item.userSeq);

        setSelectedRowIndex(newUserListRowIdx);
        if (newUserListRowIdx >= 0 && savedUser) {
            saveFormReset(savedUser);
            setIsRowSelected(true);
        } else {
            saveFormReset(EMPTY_USER);
            setIsRowSelected(false);
        }
    };

    const handleReset = () => {
        const currentUserSeq = saveFormGetValues('userSeq');
        const changedDataSource = dataSource.map(item => {
            if (item.userSeq !== currentUserSeq) return item;
            const original = orgDataSource.find(v => v.userSeq === currentUserSeq);
            if (original) {
                return {...original};
            }
            return {...item, iudType: item.iudType !== IudType.I ? undefined : item.iudType};
        });
        saveFormReset(EMPTY_USER);
        setIsRowSelected(false);
        setSelectedRowIndex(-1);
        setDataSource(changedDataSource);
    };

    const handleAdd = async () => {
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }

        const newUser: UserList = {
            ...structuredClone(EMPTY_USER),
            userSeq: orgDataSource.length > 0 ? Math.max(...orgDataSource.map(v => v.userSeq + 1)) : 0,
            iudType: IudType.I,
            strDate: dayjs().format('YYYY-MM-DD'),
        };
        const addedDataSource = orgDataSource.concat([newUser]);
        setDataSource(addedDataSource);
        handleRowSelection(newUser, addedDataSource.length - 1).then();
    };

    const handleDelete = async () => {
        if (!await confirm('삭제하시겠습니까?')) return;

        const result = await callDeleteUser(saveFormGetValues('userSeq'));
        if (result.code === HttpStatusCode.Ok) {
            handleSearchList();
            setIsRowSelected(false);
        }
    };

    const handleRowSelection = async (recode: User, index: number) => {
        saveFormReset(recode);
        setIsRowSelected(true);
        setSelectedRowIndex(index);
        setIsValidUser(saveFormGetValues('useYn') === 'Y');
    };

    const handleRowChanged = async (clickedRecord?: User, clickedIndex?: number) => {
        if (clickedRecord != null && currentDataSource != null && clickedRecord.userSeq === currentDataSource.userSeq) {
            return true;
        }
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 진행 하시겠습니까?');
            if (!result) return false;
            saveFormReset();
            setDataSource(structuredClone(orgDataSource));
        }
        return true;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchList();
        }
    };

    const handleDataChanged = () => {
        const formData = saveFormGetValues();
        const changedDataSource = dataSource.map(item => {
            if (item.userSeq !== saveFormGetValues('userSeq')) return item;
            if (!isItemChanged(item, formData)) return item;
            return {...item, ...formData, iudType: item.iudType ?? IudType.U};
        });
        setDataSource(changedDataSource);
    };

    useEffect(() => {
        handleSearchList();
    }, []);

    usePageHandlers(handlersRef, {
        cfmInit: handleReset,
        cfmSearch: handleSearchList,
        cfmAdd: () => handleAdd(),
        cfmDelete: () => handleDelete(),
        cfmSave: saveFormHandleSubmit(handleSave),
    });

    return (
        <>
        <section className="search-wrap">
            <form onSubmit={searchFormHandleSubmit(handleSearchList)}>
                <span>ID/성명</span>
                <Controller
                    name={'idOrName'}
                    defaultValue={''}
                    control={searchFormControl}
                    render={({field}) => (
                        <CustomInput
                            placeholder="ID 또는 성명을 입력해 주세요."
                            value={field.value}
                            onChange={field.onChange}
                            className="search-input-w250"
                            onKeyDown={handleKeyDown}
                        />
                    )}
                />
                <Controller
                    name={'isCheck'}
                    defaultValue={false}
                    control={searchFormControl}
                    render={({field}) => (
                        <CustomCheckbox checked={field.value} onChange={field.onChange} />
                    )}
                />
                <span>전체보기</span>
            </form>
        </section>

            <section className="board-wrap half-wrap type03">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            사용자 목록
                            <span className="total-count">{dataSource.length}건</span>
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable onRow={(recode: any, index?: number) => {
                            return {
                                onClick: () => {
                                    handleRowChanged(recode, index ?? -1).then(res => {
                                        if (res)
                                            handleRowSelection(recode, index ?? -1).then();
                                    });
                                },
                            };
                        }} scroll={{x: 1400, y: undefined}} rowKey={'userSeq'} pagination={false} rowNoFlag={true} columns={columns} selectedRowIndex={selectedRowIndex}
                                     dataSource={dataSource}/>
                    </div>
                </div>
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            상세정보
                        </h3>
                        <div className="box-btn">
                            <CustomButton className="w100" type="default" size="small"
                                          disabled={selectedRowIndex < 0
                                              || !isEditable
                                              || currentDataSource?.iudType === IudType.I} onClick={() => setIsOpen(true)}>비밀번호 변경</CustomButton>
                        </div>
                    </div>

                    <div className="board-cont-wrap">
                        <form onSubmit={saveFormHandleSubmit(handleSave)}>
                        <CustomInput className="hide" {...saveFormRegister('userSeq')}/>
                        <div className="board-detail-info menu-detail-two-column">
                            <div>
                                <CustomSaveFormInput
                                    title="사용자ID"
                                    control={saveFormControl}
                                    required={true}
                                    maxLength={20}
                                    disabled={!isEditable || currentDataSource?.iudType !== IudType.I}
                                    regExp={{value: /^[a-z0-9]*$/, message: '사용자 ID는 영문 소문자, 숫자만 입력가능합니다.'}}
                                    {...saveFormRegister('userId', {
                                        required: '사용자 ID는 필수입력입니다.',
                                        minLength: {value: 3, message: '사용자 ID는 3글자 이상이어야 합니다.'},
                                        maxLength: {value: 20, message: '사용자 ID는 20글자 이하이어야 합니다.'},
                                        onChange: handleDataChanged,
                                    })}
                                />
                                <CustomSaveFormSelect
                                    title="사용자구분"
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    options={Object.keys(cmCode).length > 0 ? Array.from(Object.entries(cmCode['UserClass'] ?? {}), ([value, label]) => ({value, label: String(label)})) : []}
                                    {...saveFormRegister('userCd', {required: '사용자구분은 필수입력입니다.', onChange: handleDataChanged})}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title="성명(한글)"
                                    control={saveFormControl}
                                    required={true}
                                    maxLength={20}
                                    disabled={!isEditable}
                                    regExp={{value: /^[ㄱ-ㅎ가-힣]*$/, message: '성명(한글)은 한글만 입력가능합니다.'}}
                                    {...saveFormRegister('userName', {
                                        required: '성명(한글)은 필수입력입니다.',
                                        pattern: {value: /^[가-힣]*$/, message: '성명(한글)은 한글만 입력가능합니다.'},
                                        minLength: {value: 2, message: '성명(한글)은 2글자 이상이어야 합니다.'},
                                        onChange: handleDataChanged,
                                    })}
                                />
                                <CustomSaveFormInput
                                    title="성명(영문)"
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    maxLength={30}
                                    regExp={{value: /^[a-z\sA-Z]*$/, message: '성명(영문)은 알파벳만 입력가능합니다.'}}
                                    {...saveFormRegister('userNameEng', {
                                        required: '성명(영문)은 필수입력입니다.',
                                        minLength: {value: 2, message: '성명(영문)은 2글자 이상이어야 합니다.'},
                                        onChange: handleDataChanged,
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title="내선번호"
                                    control={saveFormControl}
                                    required={true}
                                    maxLength={4}
                                    disabled={!isEditable}
                                    regExp={{value: /^[0-9]*$/, message: '내선번호는 숫자만 입력가능합니다.'}}
                                    {...saveFormRegister('telNo', {
                                        required: '내선번호는 필수입력입니다.',
                                        minLength: {value: 4, message: '내선번호는 4자리여야 합니다.'},
                                        onChange: handleDataChanged,
                                    })}
                                />
                                <CustomSaveFormInput
                                    title="H.P 번호"
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    maxLength={11}
                                    regExp={{value: /^[0-9]*$/, message: '휴대폰번호는 숫자만 입력가능합니다.'}}
                                    {...saveFormRegister('hpNo', {
                                        required: 'H.P 번호는 필수입력입니다.',
                                        pattern: {value: /^[0-9]*$/, message: '휴대폰번호는 숫자만 입력가능합니다.'},
                                        minLength: {value: 10, message: '휴대폰번호는 10자리 이상이어야 합니다.'},
                                        onChange: handleDataChanged,
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title="이메일"
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    maxLength={120}
                                    regExp={{value: /^[@\-_.a-zA-Z0-9]*$/, message: '이메일은 영문, 숫자, 특수문자(@-_.)만 입력가능합니다.'}}
                                    {...saveFormRegister('email', {
                                        required: '이메일은 필수입력입니다.',
                                        pattern: {value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i, message: '이메일 형식에 맞지 않습니다.'},
                                        onChange: handleDataChanged,
                                    })}
                                />
                                <CustomSaveFormInput
                                    title="부서"
                                    control={saveFormControl}
                                    disabled={!isEditable}
                                    name="dprtCd"
                                    onChangeValue={handleDataChanged}
                                    maxLength={20}
                                />
                            </div>
                            <div>
                                <CustomSaveFormDatePicker
                                    title="사용시작일"
                                    control={saveFormControl}
                                    disabled={!isEditable}
                                    maxDate={saveFormGetValues('endDate') ? dayjs(saveFormGetValues('endDate'), 'YYYY-MM-DD') : undefined}
                                    onChangeValue={() => handleDataChanged()}
                                    {...saveFormRegister('strDate', {required: '사용시작일은 필수입력입니다.', onChange: handleDataChanged})}
                                />
                                <CustomSaveFormDatePicker
                                    name="endDate"
                                    title="사용종료일"
                                    control={saveFormControl}
                                    disabled={!isEditable}
                                    onChangeValue={handleDataChanged}
                                    minDate={saveFormGetValues('strDate') ? dayjs(saveFormGetValues('strDate'), 'YYYY-MM-DD') : undefined}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="admYn"
                                    control={saveFormControl}
                                    render={({field}) => (
                                        <div>
                                            <span className="tit">관리자여부</span>
                                            <div className="box-inp">
                                                <CustomCheckbox
                                                    checked={field.value === 'Y'}
                                                    disabled={!isEditable}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.checked ? 'Y' : 'N');
                                                        handleDataChanged();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                />
                                <CustomSaveFormInput
                                    title="최종로그인일시"
                                    control={saveFormControl}
                                    name="loginDateTime"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="useYn"
                                    control={saveFormControl}
                                    render={({field}) => (
                                        <div>
                                            <span className="tit">사용여부</span>
                                            <div className="box-inp">
                                                <CustomCheckbox
                                                    checked={field.value === 'Y'}
                                                    disabled={!isEditable}
                                                    onChange={(e) => {
                                                        const v = e.target.checked ? 'Y' : 'N';
                                                        field.onChange(v);
                                                        saveFormSetValue('endDate', v === 'Y' ? undefined : dayjs().format('YYYY-MM-DD'));
                                                        handleDataChanged();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                />
                                <CustomSaveFormInput title="수정자" control={saveFormControl} name="lastModifyUserName" disabled={true} />
                            </div>
                            <div>
                                <CustomSaveFormInput title="최종수정일" control={saveFormControl} name="uptDateTime" disabled={true} />
                                {currentDataSource?.iudType === IudType.I ? (
                                    <CustomSaveFormInput
                                        title="비밀번호"
                                        type="password"
                                        control={saveFormControl}
                                        required={true}
                                        maxLength={20}
                                        disabled={!isEditable}
                                        autoComplete="new-password"
                                        {...saveFormRegister('password', {
                                            required: '비밀번호는 필수입력입니다.',
                                            minLength: {value: 4, message: '비밀번호는 4글자 이상이어야 합니다.'},
                                            maxLength: {value: 20, message: '비밀번호는 20글자 이하이어야 합니다.'},
                                            onChange: handleDataChanged,
                                        })}
                                    />
                                ) : <div />}
                            </div>
                        </div>
                        </form>
                    </div>

                </div>
            </section>
            <ChangePasswordPopup
                userInfo={currentDataSource}
                open={isOpen}
                title={'비밀번호 변경'}
                className="modal-min-w400"
                maskClosable={false}
                onOk={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
            />
        </>
    );
};

export default UserManagement;
