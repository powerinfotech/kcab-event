import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import CustomInput from '@component/CustomInput';
import CustomButton from '@component/CustomButton';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import {callDeleteUser, callGetUserList, callSaveUser} from '@api/master/UserManagementApi';
import {User, UserList, UserListSearchParam} from '@interface/master/UserManagement';
import {IudType} from '@interface/common';
import {HttpStatusCode} from 'axios';
import {ColumnsType} from 'antd/es/table';
import {useCmCode} from '@hook/useCmCode';
import dayjs from 'dayjs';
import CustomCheckbox from '@component/CustomCheckbox';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';
import IconTitle from '@icon/IconTitle';
import {useMessage} from '@hook/useMessage';
import {Controller, useForm} from 'react-hook-form';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
import CustomSaveFormDatePicker from '@component/form/CustomSaveFormDatePicker';
import CustomSaveFormCheckbox from '@component/form/CustomSaveFormCheckbox';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import ChangePasswordPopup from '@page/auth/ChangePasswordPopup';


const columns: ColumnsType<User> = [
    IUD_COLUMN,
    {
        title: <div style={{ textAlign: 'center' }}>사용자ID</div>,
        key:'userId',
        dataIndex: 'userId',
        width: '11%',
    },
    {
        title: '성명',
        key:'userName',
        dataIndex: 'userName',
        align: 'center',
        width: '8%',
    },
    {
        title: <div style={{ textAlign: 'center' }}>성명(영어)</div>,
        key:'userNameEng',
        dataIndex: 'userNameEng',
        width: '12%',
    },
    {
        title: <div style={{ textAlign: 'center' }}>내선번호</div>,
        key:'telNo',
        dataIndex: 'telNo',
        width: '8%'
    },
    {
        title: <div style={{ textAlign: 'center' }}>휴대폰번호</div>,
        key:'hpNo',
        dataIndex: 'hpNo',
        width: '12%'
    },
    {
        title: <div style={{ textAlign: 'center' }}>이메일</div>,
        key:'email',
        dataIndex: 'email',
        width: '16%'
    },
    {
        title: '사용시작일',
        key:'strDate',
        dataIndex: 'strDate',
        align: 'center',
        width: '12%'
    },
    {
        title: '사용종료일',
        key:'endDate',
        dataIndex: 'endDate',
        align: 'center',
        width: '12%'
    }
];

const emptyList:UserList[] = [
    {
        userSeq: 0,
        userId: '',
        passwd: '',
        userName: '',
        userNameEng: '',
        nickName: '',
        userCd: '',
        telNo: '',
        hpNo: '',
        deptCd: '',
        email: '',
        workCd: '',
        strDate: undefined,
        endDate: undefined,
        loginDateTime: undefined,
        useFlag: true,
        admFlag: false,
        lastUpdateDate: undefined,
        lastModifyUserName: '',
        iudType:IudType.I
    }
];


const UserManagement = () => {
    const userInfo = useRecoilValue(sessionInfoAtom);
    const {control: searchFormControl
        , getValues: searchFormGetValues
        , handleSubmit: searchFormHandleSubmit
    } = useForm<UserListSearchParam>();
    const {register: saveFormRegister
        , control: saveFormControl
        , handleSubmit: saveFormHandleSubmit
        , reset: saveFormReset
        , setValue: saveFormSetValue
        , getValues:saveFormGetValues} = useForm<UserList>({mode:'onSubmit'});
    const [dataSource, setDataSource] = useState<UserList[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<UserList[]>([]);
    const cmCode = useCmCode(['UserClass']);
    const isAdminUser = userInfo.admFlag; // 세션추가후 로컬스토리지에서 읽어와서 처리
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isValidUser, setIsValidUser] = useState<boolean>(false);
    //const isEditable = isRowSelected && isAdminUser && isValidUser;
    //사용중지 유저도 수정할수 있게 수정
    const isEditable = isRowSelected && isAdminUser;
    const {confirm} = useMessage();
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const currentDataSource = dataSource[selectedRowIndex];
    const isChangedDataSource = dataSource.some((v)=>v.iudType);


    const handleSearchList = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }
        callGetUserList({userId:searchFormGetValues('userId')??'', userName: searchFormGetValues('userName')??'', isCheck: searchFormGetValues('isCheck')??false}).then((res)=> {
            setDataSource(JSON.parse(JSON.stringify(res.item)));
            setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
            saveFormReset(emptyList[0]);
            setIsRowSelected(false);
            setSelectedRowIndex(-1);
        });
    };

    const handleSave = async (value: UserList) => {
        const saveData = getCurrentRowDataSourceById(value.userSeq);
        if(!saveData.iudType) {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        const result = await confirm('저장 하시겠습니까?');
        if(result) {
             callSaveUser(saveData).then((result)=>{
                if(result.code === HttpStatusCode.Ok) {
                    message.info('저장 되었습니다.');
                    callGetUserList({
                        userId:searchFormGetValues('userId')??'',
                        userName: searchFormGetValues('userName')??'',
                        isCheck: searchFormGetValues('isCheck')??false
                    }).then((res)=> {
                        setDataSource(JSON.parse(JSON.stringify(res.item)));
                        setOrgDataSource(JSON.parse(JSON.stringify(res.item)));

                        const newUserListRowIdx = res.item.findIndex((f)=>{
                            return f.userSeq === result.item.userSeq;
                        }) ?? -1;

                        const saveFormData = res.item.filter((f)=>{
                           return  f.userSeq === result.item.userSeq;
                        });
                        setSelectedRowIndex(newUserListRowIdx);
                        saveFormReset(saveFormData[0]);
                        if(newUserListRowIdx >= 0){
                            setIsRowSelected(true);
                        }else{
                            saveFormReset(emptyList[0]);
                            setIsRowSelected(false);
                        }
                    });
                }
            });
        }
    };


    const getCurrentRowDataSourceById = (id : number) => {
        return dataSource.filter((v)=>v.userSeq === id)[0];
    };
    
    const handleReset = () => {
        const changedDataSource = dataSource.map((item)=> {
            if (item.userSeq === saveFormGetValues('userSeq')) {
                if(orgDataSource.some((v) => v.userSeq === saveFormGetValues('userSeq'))) {
                    return orgDataSource.filter((v) => v.userSeq === saveFormGetValues('userSeq'))[0];
                }
                else {
                    const ret = dataSource.filter((v) => v.userSeq === saveFormGetValues('userSeq'))[0];
                    ret.iudType = item.iudType !== IudType.I ? undefined: item.iudType;
                    return ret;
                }
            }
            return item;
        });
        resetSaveForm();
        setDataSource(changedDataSource);
    };

    const resetSaveForm = () =>{
       // saveFormReset(orgDataSource.filter((v)=>v.userSeq===saveFormGetValues('userSeq')??{})[0]);
        saveFormReset(emptyList[0]);
        setIsRowSelected(false);
        setSelectedRowIndex(-1);
    };

    const handleAdd = async() => {
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if(!result) return;
        }

        const addList:UserList[] = JSON.parse(JSON.stringify(emptyList));
        addList[0].userSeq=orgDataSource&&orgDataSource.length>0 ? Math.max(...orgDataSource.map((v:UserList) => v.userSeq+1)):0;
        addList[0].iudType = IudType.I;
        const addedDataSource = orgDataSource.concat(addList);
        setDataSource(addedDataSource);
        handleRowSelection(addList[0], addedDataSource.length-1).then();
    };

    const handleDelete = async () => {
        if(!await confirm('삭제 하시겠습니까?'))
            return;

         callDeleteUser(saveFormGetValues('userSeq')).then((result)=>{
           if(result.code === HttpStatusCode.Ok) {
               handleSearchList();
               setIsRowSelected(false);
           }
       });
    };
    

    const handleRowSelection = async (recode:User, index:number) => {
        saveFormReset(recode);
      //  setRowIndex(index);
        setIsRowSelected(true);
        setSelectedRowIndex(index);
        setIsValidUser(saveFormGetValues('useFlag'));
    };

    const handleRowChanged = async() => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 진행 하시겠습니까?');
            if(!result) {
                return false;
            }
            saveFormReset();
            setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
        }
        return true;
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchList();
        }
    };


    useEffect(() => {
        handleSearchList();
    }, []);

    // useEffect(() => {
    //     const changedData = dataSource.filter((v) => v.userSeq === watchAllFields.userSeq).map((item) => {
    //         return item;
    //     })[0];
    //
    //     if (changedData && watchAllFields.userSeq > 0 && watchAllFields.iudType !==IudType.I) {
    //         const tempChangedDate = JSON.parse(JSON.stringify((omit(changedData, 'iudType'))));
    //         const tempWatchAllFields = JSON.parse(JSON.stringify(omit(watchAllFields, 'iudType')));
    //         if (JSON.stringify(tempChangedDate) !== JSON.stringify(tempWatchAllFields)) handleDataChanged();
    //     }
    // }, [watchAllFields]);


    const handleDataChanged = () => {
        const formDate  = saveFormGetValues();
        const changedDataSource = dataSource.map((item)=> {
            if (item.userSeq === saveFormGetValues('userSeq')) {
                if(isItemChanged(item,formDate)) {
                    item = {...item, ...formDate};
                    item.iudType = item.iudType ?? IudType.U;
                }
            }
            return item;
        });
       changedDataSource&&setDataSource(changedDataSource);
    };

    const isItemChanged = (originalItem: User, newItem: User): boolean => {
        for (const key in newItem) {
            if (originalItem[key] !== newItem[key]) {
                return true;
            }
        }
        return false;
    };

    return  (
        <>
        <section className={'button-wrap'}>
            <div className="box-btn">
                <CustomButton type="primary" onClick={() => {
                    handleReset();
                }} disabled={!isEditable || currentDataSource?.iudType === IudType.I}><IconBtnRefresh/>{'초기화'}
                </CustomButton>
                <CustomButton type="primary" onClick={handleSearchList}><IconBtnSearch/>조회</CustomButton>
                <CustomButton type="primary" onClick={() => {
                    handleAdd().then();
                }} disabled={!isAdminUser}>{'추가'}</CustomButton>
                <CustomButton type="primary" onClick={() => {
                    handleDelete().then();
                }} disabled={!isEditable}>{'삭제'}</CustomButton>
                <CustomButton type="primary" onClick={saveFormHandleSubmit(handleSave)}
                              disabled={!isEditable}>{'저장'}</CustomButton>
            </div>
        </section>
        <section className="search-wrap">
        <form onSubmit={searchFormHandleSubmit(handleSearchList)}>
            <span>사용자ID</span>
            <Controller
                name={'userId'}
                defaultValue={''}
                control={searchFormControl}
                render={({field, fieldState}) => (
                    <CustomInput placeholder="검색할 ID를 입력해 주세요."
                                 onChange={field.onChange}
                                 style={{width: 250, margin: '0 8px'}}
                                 onKeyPress={handleKeyPress}/>
                )}
            />
            <span>이름</span>
            <Controller
                name={'userName'}
                defaultValue={''}
                control={searchFormControl}
                render={({field, fieldState}) => (
                    <CustomInput placeholder="검색할 이름을 입력해 주세요."
                                         onChange={field.onChange}
                                         style={{width: 250, margin: '0 8px'}}
                                 onKeyPress={handleKeyPress}/>
                        )}
                    />
                    <Controller
                        name={'isCheck'}
                        defaultValue={false}
                        control={searchFormControl}
                        render={({field, fieldState}) => (
                            <CustomCheckbox onChange={field.onChange}/>
                        )}
                    />
                    <span>미사용자포함</span>
                </form>
            </section>

            <section className="board-wrap half-wrap type01">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            사용자 목록
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable onRow={(recode:any, index?:number) => {
                            return {
                                onClick: () => {
                                     handleRowChanged().then((res)=> {
                                         if(res)
                                             handleRowSelection(recode, index??-1).then();
                                     });
                               },
                            };
                        }} rowKey={'userSeq'} pagination={false} rowNoFlag={true} columns={columns} selectedRowIndex={selectedRowIndex}
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
                                          disabled={selectedRowIndex<0
                                              || !isEditable
                                              || currentDataSource?.iudType === IudType.I} onClick={()=>setIsOpen(true)}>비밀번호 변경</CustomButton>
                        </div>
                    </div>

                    <div className="board-cont-wrap" >
                        <form onSubmit={saveFormHandleSubmit(handleSave)}  >
                        <CustomInput style={{display: 'none'}} className={'hide'} {...saveFormRegister('userSeq')}/>
                        <div className="board-detail-info">
                            <div>
                                <CustomSaveFormInput
                                    title={'사용자 ID'}
                                    control={saveFormControl}
                                    required={true}
                                    maxLength={20}
                                    disabled={!isEditable || currentDataSource?.iudType !== IudType.I}
                                    regExp={{value:/^[a-z0-9]*$/, message:'사용자 ID는 영문 소문자,숫자만 입력가능합니다.'}}
                                    {...saveFormRegister('userId',
                                        {required:'사용자 ID는 필수입력입니다.',
                                            minLength:{
                                                value:3,
                                                message:"사용자 ID는 3글자 이상이어야 합니다."
                                            },
                                            maxLength:{
                                                value:20,
                                                message:"사용자 ID는 20글자 이하이어야 합니다."
                                            },
                                            onChange:handleDataChanged})}
                                />

                                <CustomSaveFormSelect
                                    title={'사원 구분'}
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    options={Object.keys(cmCode).length > 0 ?Array.from(Object.entries(cmCode['UserClass']), ([value, label]) => ({
                                          value: value,
                                          label: label.toString()
                                      })):[]}
                                   {...saveFormRegister('userCd', {required:'사원 구분은 필수입력입니다.',onChange:handleDataChanged})}
                                />
                            </div>
                            <div>
                                 <CustomSaveFormInput
                                    title={'성명(한글)'}
                                    control={saveFormControl}
                                    required={true}
                                    maxLength={6}
                                    disabled={!isEditable}
                                    regExp={{value:/^[ㄱ-ㅎ가-힣]*$/, message:'성명(한글)은 한글만 입력가능합니다.'}}
                                    {...saveFormRegister('userName',
                                        {required:'성명(한글)은 필수입력입니다.',
                                            pattern: {
                                                value: /^[가-힣]*$/,
                                                message: "성명(한글)은 한글만 입력가능합니다."
                                            },
                                            minLength:{
                                                value:2,
                                                message:"성명(한글)은 2글자 이상이어야 합니다."
                                            },
                                            onChange:handleDataChanged})}
                                />
                                <CustomSaveFormInput
                                    title={'성명(영문)'}
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    maxLength={30}
                                    regExp={{value:/^[a-z\sA-Z]*$/, message:'성명(영문)은 알파벳만 입력가능합니다.'}}
                                    {...saveFormRegister('userNameEng',
                                        {required:'성명(영문)은 필수입력입니다.',
                                            minLength:{
                                                value:3,
                                                message:"성명(영문)은 2글자 이상이어야 합니다."
                                            },
                                            onChange:handleDataChanged})}
                                />
                            </div>
                            <div>
                                 <CustomSaveFormInput
                                    title={'내선번호'}
                                    control={saveFormControl}
                                    required={true}
                                    maxLength={4}
                                    disabled={!isEditable}
                                    regExp={{value:/^[0-9]*$/, message:'내선번호 숫자만 입력가능합니다.'}}
                                    {...saveFormRegister('telNo',
                                        {required:'내선번호는 필수입력입니다.',
                                            minLength:{
                                                value:4,
                                                message:"내선번호는 4자리여야 합니다."
                                            },
                                            onChange:handleDataChanged})}
                                />
                                <CustomSaveFormInput
                                    title={'휴대폰번호'}
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    maxLength={11}
                                    regExp={{value:/^[0-9]*$/, message:'휴대폰번호는 숫자만 입력가능합니다.'}}
                                    {...saveFormRegister('hpNo',
                                        {required:'휴대폰번호는 필수입력입니다.',
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "휴대폰번호는 숫자만 입력가능합니다."
                                            },
                                            minLength:{
                                                value:10,
                                                message:"휴대폰번호는 10자리 이상이어야 합니다."
                                            },
                                            onChange:handleDataChanged})}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'이메일'}
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    maxLength={120}
                                    regExp={{value:/^[@\-_.a-zA-Z0-9]*$/, message:"이메일은 영문,숫자,특수문자(@-_.)만 입력가능합니다."}}
                                    {...saveFormRegister('email',
                                        {required: '이메일은 필수입력입니다.',
                                            pattern: {
                                                value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                                                message: "이메일 형식에 맞지 않습니다."
                                            },
                                            onChange:handleDataChanged})}
                                />
                                <CustomSaveFormInput
                                    title={'부서명'}
                                    control={saveFormControl}
                                    disabled={!isEditable}
                                    name={'deptCd'}
                                    onChangeValue={handleDataChanged}
                                    maxLength={10}
                                />
                            </div>
                            <div>
                                <CustomSaveFormDatePicker
                                    title="사용시작일"
                                    control={saveFormControl}
                                    required={true}
                                    disabled={!isEditable}
                                    maxDate={saveFormGetValues('endDate') ? dayjs(saveFormGetValues('endDate'), 'YYYY-MM-DD') : undefined}
                                     {...saveFormRegister('strDate', {required:'사용시작일은 필수입력입니다.', onChange:handleDataChanged})}
                               />
                                <CustomSaveFormDatePicker
                                    name={'endDate'}
                                    title="사용종료일"
                                    control={saveFormControl}
                                    disabled={!isEditable}
                                    onChangeValue={handleDataChanged}
                                    minDate={saveFormGetValues('strDate') ? dayjs(saveFormGetValues('strDate'), 'YYYY-MM-DD') : undefined}
                               />

                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'최종수정일'}
                                    control={saveFormControl}
                                    name={'lastUpdateDate'}
                                    disabled={true}
                                />
                                <CustomSaveFormInput
                                    title={'수정자'}
                                    control={saveFormControl}
                                    name={'lastModifyUserName'}
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <CustomSaveFormCheckbox
                                    title="관리자여부"
                                    name="admFlag"
                                    disabled={!isEditable}
                                    control={saveFormControl}
                                     onChangeValue={handleDataChanged}
                                />
                                <CustomSaveFormCheckbox
                                    title="사용여부"
                                    name="useFlag"
                                    disabled={!isEditable}
                                    control={saveFormControl}
                                    onChangeValue={(v)=> {
                                        saveFormSetValue('endDate', v?undefined:dayjs().format('YYYY-MM-DD'));
                                        handleDataChanged();
                                    }}
                               />
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
                style={{minWidth: '400px'}}
                maskClosable={false}
                onOk={()=>setIsOpen(false)}
                onCancel={()=>setIsOpen(false)}
            />
        </>
    );

};

export default UserManagement;