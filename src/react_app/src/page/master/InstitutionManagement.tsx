import {ColumnsType} from "antd/es/table";
import {User, UserList} from "@interface/master/UserManagement";
import {Inst,InstList,InstLisSearchParam} from "@interface/master/InstitutionManagement";
import CustomTable, {IUD_COLUMN} from "@component/CustomTable";
import React, {useEffect, useState} from "react";
import CustomButton from "@component/CustomButton";
import {isEditable} from "@testing-library/user-event/dist/utils";
import {IudType, PageButtonHandlers} from "@interface/common";
import IconBtnRefresh from "@icon/IconBtnRefresh";
import {Controller, useForm} from "react-hook-form";
import {useRecoilValue} from "recoil";
import {sessionInfoAtom} from "@atom/sessionInfoAtom";
import CustomInput from "@component/CustomInput";
import IconTitle from "@icon/IconTitle";
import CustomSaveFormInput from "@component/form/CustomSaveFormInput";
import CustomSaveFormSearchInput from "@component/form/CustomSaveFormSearchInput";
import CustomAddressSearchModal from "@component/CustomAddressSearchModal";
import {
    callGetInstList,
    callSaveInst,
    callDeleteUser,
    callGetInstManagementStateSearch
} from "@api/master/InstManagementApi";
import CustomCheckbox from "@component/CustomCheckbox";
import {message} from "antd";
import {HttpStatusCode} from "axios";
import {Address} from "react-daum-postcode";
import CustomSaveFormCheckbox from "@component/form/CustomSaveFormCheckbox";
import {useMessage} from "@hook/useMessage";
import CustomSaveFormSelect from "@component/form/CustomSaveFormSelect";
import {callGetNoticeManagementStateSearch} from "@api/master/NoticeManagementApi";


const columns: ColumnsType<Inst> = [
    IUD_COLUMN,
    {
        title: <div style={{ textAlign: 'center' }}>기관명</div>,
        key:'instName',
        dataIndex: 'instName',
        align: 'center',
        width: '11%',
    },
    {
        title: '기관구분',
        key:'instCd',
        dataIndex: 'instCd',
        align: 'center',
        width: '8%',
    },
    {
        title: <div style={{ textAlign: 'center' }}>기관고유코드</div>,
        key:'instCode',
        dataIndex: 'instCode',
        width: '12%',
    },
    {
        title: <div style={{ textAlign: 'center' }}>기관우편번호</div>,
        key:'instZipNo',
        dataIndex: 'instZipNo',
        width: '8%'
    },
    {
        title: <div style={{ textAlign: 'center' }}>기관주소</div>,
        key:'instAddress',
        dataIndex: 'instAddr',
        width: '12%'
    },
    {
        title: <div style={{ textAlign: 'center' }}>기관상세주소</div>,
        key:'instDtlAddress',
        dataIndex: 'instDtlAddr',
        width: '16%'
    },
    {
        title: '기관전화번호',
        key:'instTelNo',
        dataIndex: 'instTelNo',
        align: 'center',
        width: '12%'
    },
    {
        title: '기관이메일',
        key:'instEmail',
        dataIndex: 'instEmail',
        align: 'center',
        width: '12%'
    },
    {
        title: '기관비고',
        key:'instDesc',
        dataIndex: 'instDesc',
        align: 'center',
        width: '12%'
    },
    {
        title: '등록자',
        key:'rgstUserId',
        dataIndex: 'rgstUserId',
        align: 'center',
        width: '12%'
    },
    {
        title: '등록시간',
        key:'rgstDateTime',
        dataIndex: 'rgstDateTime',
        align: 'center',
        width: '12%'
    },
    {
        title: '수정자',
        key:'uptUserId',
        dataIndex: 'uptUserId',
        align: 'center',
        width: '12%'
    },
    {
        title: '수정시간',
        key:'uptDateTime',
        dataIndex: 'uptDateTime',
        align: 'center',
        width: '12%'
    }
];

const emptyList:Inst[]=[
    {
        instSeq : 0,
        instName :'',
        instCd:'',
        instCode:'',
        instZipNo:'',
        instAddr:'',
        instDtlAddr:'',
        instTelNo:'',
        instEmail:'',
        instDesc:'',
        rgstUserId:'',
        rgstDateTime:'',
        uptUserId:'',
        uptDateTime:'',
        useFlag:true
    }
];
const InstitutionManagement=({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>})=>{
    const userInfo = useRecoilValue(sessionInfoAtom);
    const [dataSource,setDataSource] = useState<InstList[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<InstList[]>([]);
    const [selectRowIndex,setSelectRowIndex] = useState(-1);
    const currentDataSource = dataSource[selectRowIndex];
    const {control: searchFormControl,
            getValues:searchFormGetValues,
            handleSubmit: searchFormHandleSubmit} =  useForm<InstLisSearchParam>();
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const {register : saveFormRegister,
        control: saveFormControl,
        handleSubmit: saveFormHandleSubmit,
        reset: saveFormReset,
        setValue: saveFormSetValue,
        getValues: saveFormGetValues
    }= useForm<InstList>({mode:'onSubmit'});
    const isAdminUser = userInfo.admYn === 'Y';
    const [isOpen,setIsOpen] = useState(false);
    const isChangedDataSource = dataSource.some((v)=>v.iudType);
    const isEditable = isRowSelected && isAdminUser;
   // const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const [inCode,setInCode] = useState();

    const {confirm} = useMessage();

    const handleReset=()=>{

        const changedDataSource = dataSource.map((item)=> {
            if (item.instSeq === saveFormGetValues('instSeq')) {
                if(orgDataSource.some((v) => v.instSeq === saveFormGetValues('instSeq'))) {
                    return orgDataSource.filter((v) => v.instSeq === saveFormGetValues('instSeq'))[0];
                }
                else {
                    const ret = dataSource.filter((v) => v.instSeq === saveFormGetValues('instSeq'))[0];
                    ret.iudType = item.iudType !== IudType.I ? undefined: item.iudType;
                    return ret;
                }
            }
            return item;
        });
        saveFormReset(emptyList[0]);
        resetSaveForm();
        setDataSource(changedDataSource);
    };
    const resetSaveForm = () =>{
        // saveFormReset(orgDataSource.filter((v)=>v.userSeq===saveFormGetValues('userSeq')??{})[0]);
        saveFormReset();
        setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
        //saveFormReset(emptyList[0]);
        setIsRowSelected(false);
        setSelectRowIndex(-1);
    };

    const handleSearchList= async ()=>{
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }

        callGetInstList({instName:searchFormGetValues('instName')??'',isCheck:searchFormGetValues('isCheck')??false}).then((res)=>{
            setDataSource(JSON.parse(JSON.stringify(res.item)));
            setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
        });

    };

    const handleAdd= async ()=>{
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if(!result) return;
        }

        const addList:InstList[] = JSON.parse(JSON.stringify(emptyList));
        addList[0].instSeq=orgDataSource&&orgDataSource.length>0 ? Math.max(...orgDataSource.map((v:InstList) => v.instSeq+1)):0;
        addList[0].iudType = IudType.I;
        const addedDataSource = orgDataSource.concat(addList);

        setDataSource(addedDataSource);
        handleRowSelection(addList[0], addedDataSource.length-1).then();

    };
    const handleDelete= async ()=>{
        if(!await confirm('삭제 하시겠습니까?'))
            return;

        callDeleteUser(saveFormGetValues('instSeq')).then((result)=>{
            if(result.code === HttpStatusCode.Ok) {
                handleSearchList();
                setIsRowSelected(false);
                handleReset();
            }
        });

    };
    const handleSave= async(value:InstList)=>{

        const saveData = getCurrentRowDataSourceById(value.instSeq);
        if(!saveData.iudType){
            message.info('변경된 내용이 없습니다.');
            return;
        }

        const result = await confirm('저장하시겠습니까?');
        if(result){
            callSaveInst(saveData).then((saveRes)=>{
                if(saveRes.code===HttpStatusCode.Ok){
                    message.info('저장 되었습니다');
                    callGetInstList({instName:searchFormGetValues('instName')??'',isCheck:searchFormGetValues('isCheck')??false}).then((res)=>{
                        setDataSource(JSON.parse(JSON.stringify(res.item)));
                        setOrgDataSource(JSON.parse(JSON.stringify(res.item)));

                        const invisibleUser = res.item.filter((f)=>{
                            return f.instSeq === saveRes.item;
                        });

                        if(invisibleUser.length<=0){
                            saveFormReset(emptyList[0]);
                            setIsRowSelected(false);
                        }else {
                            saveFormReset(getCurrentRowDataSourceById(saveRes.item));
                            saveFormSetValue('iudType',undefined);
                            setIsRowSelected(true);
                        }
                    });
                }
            });
        }

    };
    const getCurrentRowDataSourceById = (id : number) => {
        return dataSource.filter((v)=>v.instSeq === id)[0];
    };
    const handleKeyPress=(event: React.KeyboardEvent<HTMLInputElement>)=>{
        if (event.key === 'Enter') {
            handleSearchList();
        }
    };
    const handleRowChanged = async ()=>{
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 진행 하시겠습니까?');
            if(!result) return false;
        }
        saveFormReset();
        setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
        return true;
    };
    const handleRowSelection= async (recode:Inst, index:number)=>{
        saveFormReset(recode);
        setIsRowSelected(true);
        setSelectRowIndex(index);

    };

    const handleDataChanged = () => {
        const formDate  = saveFormGetValues();
        const changedDataSource = dataSource.map((item)=> {
            if (item.instSeq === saveFormGetValues('instSeq')) {
                if(isItemChanged(item,formDate)) {
                    item = {...item, ...formDate};
                    item.iudType = item.iudType ?? IudType.U;
                }
            }
            return item;
        });
        changedDataSource&&setDataSource(changedDataSource);
    };




    const isItemChanged = (originalItem: Inst, newItem: Inst): boolean => {
        for (const key in newItem) {
            if (originalItem[key as keyof Inst] !== newItem[key as keyof Inst]) {
                return true;
            }
        }
        return false;
    };



    const setIsAddressSearchModalOpen=(open:boolean)=>{
        setIsOpen(true);
    };

    useEffect(() => {
        handleSearchList();
        searchInfo();
    }, []);


    /* 구역 주소,우편번호 조회 관련 start */
    const onAddrSearchComplete = (data:Address) => {
        if(data.userSelectedType === 'R'){
            saveFormSetValue("instAddr", data.address);
        } else {
            saveFormSetValue("instAddr", data.jibunAddress);
        }

        saveFormSetValue("instZipNo", data.zonecode);
        handleDataChanged();
        setIsOpen(false);
    };
    const searchInfo = () => {
        callGetInstManagementStateSearch().then((res) => {
            if (res.code === HttpStatusCode.Ok) {
                setInCode(res.item);
                handleSearchList();
            }
        });
    };

useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: handleSearchList,
                cfmAdd: handleAdd,
                cfmDelete: handleDelete,
                cfmSave: () => saveFormHandleSubmit(handleSave)(),
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

return(
    <>
        <section className="search-wrap">
            <form onSubmit={searchFormHandleSubmit(handleSearchList)}>
                <span>기관명</span>
                <Controller name={'instName'} defaultValue={''} control={searchFormControl}  render={({field,fieldState})=>(
                    <CustomInput placeholder="검색할 기관명을 입력해주세요."
                                 onChange={field.onChange}
                                 style={{width:250,margin:'0 8px'}}
                                 onKeyPress={handleKeyPress}/>
                )} />

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
                        기관목록
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable onRow={(recode:any,index?:number)=>{
                        return {
                            onClick: ()=> {
                                handleRowChanged().then((res:boolean)=>{
                                   if(res){
                                       handleRowSelection(recode,index??-1);
                                   }
                                });
                            },
                        };
                    }} rowKey={'instSeq'} pagination={false} rowNoFlag={true} columns={columns} selectedRowIndex={selectRowIndex} dataSource={dataSource} scroll={{ x: 1645 }}/>
                </div>
            </div>
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        상세정보
                    </h3>
                </div>
                <div className="board-cont-wrap">

                    <form onSubmit={saveFormHandleSubmit(handleSave)}>
                         <CustomInput style={{display: 'none'}} className={'hide'} {...saveFormRegister('instSeq')}  />

                        <div className="board-detail-info">
                            <div>
                                <CustomSaveFormInput
                                    title={'기관명'}
                                    control={saveFormControl}
                                    maxLength={100}
                                    required={true}
                                    disabled={!isEditable}
                                    {...saveFormRegister('instName', {
                                        required:'기관명은 필수입력입니다.',

                                        maxLength:{value:100 , message:"기관명은 100글자 이하이어야 합니다."},
                                        onChange:handleDataChanged
                                    })}
                                />
                                <CustomSaveFormInput
                                    title={'기관 고유코드'}
                                    control={saveFormControl}
                                    maxLength={11}
                                    required={true}
                                    disabled={!isEditable}
                                    {...saveFormRegister('instCode',{
                                        required:'기관 고유코드는 필수입니다.',
                                        validate: value =>
                                            value?.length === 11 || '기관 고유코드는 11글자여야 합니다.',
                                        onChange:handleDataChanged
                                    })}

                                />

                            </div>

                            <div>

                                <CustomSaveFormSelect
                                    title={'기관 구분'}
                                    control={saveFormControl}
                                    maxLength={20}
                                    required={true}
                                    disabled={!isEditable}
                                    options={inCode}
                                    onChangeValueback={(v) => {
                                        saveFormSetValue('instCd',v.label);
                                        handleDataChanged();
                                    }}
                                    {...saveFormRegister('instCd',{
                                        required:'기관 구분은 필수입니다.',
                                        maxLength:{value:20 , message:"기관명은 20글자 이하이어야 합니다."},
                                    })}

                                />
                                {/*<CustomSaveFormInput*/}
                                {/*    title={'기관 구분'}*/}
                                {/*    control={saveFormControl}*/}
                                {/*    maxLength={20}*/}
                                {/*    required={true}*/}
                                {/*    disabled={!isEditable}*/}
                                {/*    {...saveFormRegister('instCd',{*/}
                                {/*        required:'기관 구분은 필수입니다.',*/}

                                {/*        maxLength:{value:20 , message:"기관명은 20글자 이하이어야 합니다."},*/}
                                {/*        onChange:handleDataChanged*/}
                                {/*    })}*/}
                                {/*/>*/}
                            {/*기관우편번호*/}
                                <CustomSaveFormInput
                                    title={'기관 전화번호'}
                                    control={saveFormControl}
                                    maxLength={20}
                                    required={false}
                                    disabled={!isEditable}
                                    {...saveFormRegister('instTelNo',{
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "휴대폰번호는 숫자만 입력가능합니다."
                                        },
                                        minLength:{value:10 , message:"기관 전화번호는 10글자 이상이어야 합니다."},
                                        maxLength:{value:20 , message:'기관 전화번호는 20글자 이하이어야 합니다.'},
                                        onChange:handleDataChanged
                                    })}

                                />

                            </div>


                            <div>


                                <CustomSaveFormInput
                                    title={'기관 이메일'}
                                    control={saveFormControl}
                                    maxLength={20}
                                    singleRow={true}
                                    required={false}
                                    disabled={!isEditable}
                                    {...saveFormRegister('instEmail',{
                                        pattern: {
                                            value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                                            message: "이메일 형식에 맞지 않습니다."
                                        },
                                        maxLength:{value:50 , message:'기관 이메일은 50글자 이하이어야 합니다.'},
                                        onChange:handleDataChanged
                                    })}
                                />
                            </div>

                            <div>
                                {/*   기관주소 상세주소 */}
                                <CustomSaveFormInput
                                    title={'기관우편번호'}
                                    control={saveFormControl}
                                    maxLength={11}
                                    required={false}
                                    disabled={true}
                                    {...saveFormRegister('instZipNo',{
                                        minLength:{value:5,message:'기관주소는 5글자 이어야 합니다'},
                                        maxLength:{value:5 , message:'기관주소는 5글자 이어야 합니다.'},
                                        onChange:handleDataChanged
                                    })}

                                />

                                <CustomSaveFormSearchInput
                                    title={'기관주소'}
                                    isNoTitle={true}
                                    onlyUseButtonFlag={true}
                                    disabledButton={!isEditable }
                                    onClickSearchBtn={()=> setIsAddressSearchModalOpen(true)}
                                    control={saveFormControl}
                                    required={false}
                                    maxLength={20}
                                    disabled={true}
                                    {...saveFormRegister(
                                        'instAddr',{
                                            onChange:handleDataChanged
                                        }
                                        )
                                    }
                                />

                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'기관상세주소'}
                                    control={saveFormControl}
                                    maxLength={30}
                                    singleRow={true}
                                    required={false}
                                    disabled={!isEditable}
                                    {...saveFormRegister('instDtlAddr',{
                                        maxLength:{value:100 , message:'기관상세주소는 100글자 이하이어야 합니다.'},
                                        onChange:handleDataChanged
                                    })}

                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title = {'기관 비고'}
                                    control={saveFormControl}
                                    required={false}
                                    singleRow={true}
                                    disabled={!isEditable}
                                    {...saveFormRegister('instDesc',{
                                        onChange:handleDataChanged
                                    })}
                                />

                            </div>
                            <div>
                                <CustomSaveFormCheckbox
                                    title="사용여부"
                                    disabled={!isEditable}
                                    control={saveFormControl}
                                    {...saveFormRegister('useFlag',{
                                        onChange:handleDataChanged
                                    })}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        <CustomAddressSearchModal
            onAddrSearchComplete={onAddrSearchComplete}
            open={isOpen}
            onCancel={()=>setIsOpen(false)}
        ></CustomAddressSearchModal>

    </>
);


};



export default InstitutionManagement;