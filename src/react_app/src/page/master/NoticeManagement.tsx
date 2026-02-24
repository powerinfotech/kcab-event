import {ColumnsType} from "antd/es/table";
import CustomTable, {IUD_COLUMN} from "@component/CustomTable";
import React, {useEffect, useRef, useState} from "react";

import {Notice, NoticeList, NoticeListSearchParam} from "@interface/master/NoticeManagement";
import CustomButton from "@component/CustomButton";
import {IudType} from "@interface/common";
import IconBtnRefresh from "@icon/IconBtnRefresh";
import {Controller, useForm} from "react-hook-form";
import CustomInput from "@component/CustomInput";
import CustomCheckbox from "@component/CustomCheckbox";
import IconTitle from "@icon/IconTitle";
import CustomSaveFormInput from "@component/form/CustomSaveFormInput";
import {useRecoilValue} from "recoil";
import {sessionInfoAtom} from "@atom/sessionInfoAtom";
import CustomSaveFormDatePicker from "@component/form/CustomSaveFormDatePicker";
import dayjs from "dayjs";
import {
    callDeleteNotice,
    callGetNoticeList,
    callGetNoticeManagementStateSearch,
    callSaveNotice
} from "@api/master/NoticeManagementApi";
import {useCmCode} from "@hook/useCmCode";
import {callGetNationAddrNoStateSearch} from "@api/code/NationAddrNoStateApi";
import {HttpStatusCode} from "axios";
import CustomSaveFormSelect from "@component/form/CustomSaveFormSelect";
import {message} from "antd";
import {callDeleteUser, callGetInstList, callSaveInst} from "@api/master/InstManagementApi";
import CustomSaveFormCheckbox from "@component/form/CustomSaveFormCheckbox";
import CustomCkEditor from "@component/CustomCkEditor";
import {useMessage} from "@hook/useMessage";
import {cloneDeep} from "lodash";
import CustomFile, {FileDetailType} from "@component/CustomFile";
import {callGetFileList, callSaveFiles} from "@api/CommonApi";
import {MenuInfo} from "@interface/auth/MenuManagement";


const columns: ColumnsType<Notice> = [
    IUD_COLUMN,
    {
        title: '카테고리',
        key:'ctgrNm',
        dataIndex: 'ctgrNm',
        align: 'center',
        width: '8%',
    },
    {
        title: <div style={{ textAlign: 'center' }}>제목</div>,
        key:'title',
        dataIndex: 'title',
        align: 'center',
        width: '14%',
    },
    {
        title: '작성자',
        key:'rgstUserNm',
        dataIndex: 'rgstUserNm',
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
        title: '시작일',
        key:'strDate',
        dataIndex: 'strDate',
        align: 'center',
        width: '10%',
    },  {
        title: '종료일',
        key:'endDate',
        dataIndex: 'endDate',
        align: 'center',
        width: '10%',
    },
    {
        title: '팝업여부',
        key:'popupFlagLabel',
        dataIndex: 'popupFlagLabel',
        align: 'center',
        width: '8%'
    },
    {
        title: '고정여부',
        key:'fixFlagLabel',
        dataIndex: 'fixFlagLabel',
        align: 'center',
        width: '8%'
    },

    {
        title: '조회수',
        key:'viewCnt',
        dataIndex: 'viewCnt',
        align: 'center',
        width: '8%'
    }
];

const emptyList:Notice[]=[
    {
        noticeSeq:0,
        ctgrCd:'',
        title:'',
        content:'',
        popupFlag:false,
        fixFlag:false,
        strDate:undefined,
        endDate:undefined,
        viewCnt:0,
        rgstUserId:'',
        rgstDateTime:'',
        uptUserId:'',
        uptDateTime:'',
        fileSeq:undefined,
        rgstUserNm:'',
        ctgrNm:'',
        useFlag:true,
        isChange:false
    }
];

interface props{
    menuInfo:MenuInfo;
}

const NoticeManagement =({menuInfo}:props)=>{
    const userInfo = useRecoilValue(sessionInfoAtom);
    const {register : saveFormRegister,
        control: saveFormControl,
        handleSubmit: saveFormHandleSubmit,
        reset: saveFormReset,
        setValue: saveFormSetValue,
        getValues: saveFormGetValues
    }= useForm<NoticeList>({mode:'onSubmit'});
    const {control: searchFormControl,
        getValues:searchFormGetValues,
        handleSubmit: searchFormHandleSubmit} =  useForm<NoticeListSearchParam>();
    const isAdminUser = userInfo.admYn === 'Y';
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const isEditable = isRowSelected && isAdminUser;
    const [dataSource,setDataSource] = useState<NoticeList[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<NoticeList[]>([]);
    const [selectRowIndex,setSelectRowIndex] = useState(-1);

    const currentDataSource = dataSource[selectRowIndex];
    const isChangedDataSource = dataSource.some((v)=>v.iudType);
    const [cmCode,setCmCode] = useState();
    const {confirm} = useMessage();
    const [rowIndex, setRowIndex] = useState(-1);
    const [rowSeq, setRowSeq] = useState(-1);


    const [fileList, setFileList] = useState<FileDetailType[]>([]);
    const [oriFileList, setOriFileList] = useState<FileDetailType[]>([]);

    const [fileSeq,setFileSeq] = useState<number|null>(0);
    const initialValueRef = useRef<string | null>(null);


    const handleReset =()=>{
        const changedDataSource = dataSource.map((item)=>{
            if(item.noticeSeq===saveFormGetValues('noticeSeq')){
                if(orgDataSource.some((v)=>v.noticeSeq===saveFormGetValues('noticeSeq'))){
                    return orgDataSource.filter((v)=>v.noticeSeq===saveFormGetValues('noticeSeq'))[0];
                }else{
                    const ret = dataSource.filter((v)=>v.noticeSeq === saveFormGetValues('noticeSeq'))[0];
                    ret.iudType = item.iudType !==IudType.I ? undefined : item.iudType;
                    return ret;
                }
            }
            return item;
        });
        setIsRowSelected(false);
        setOriFileList([]);
        setFileList([]);
        resetSaveForm();
        setDataSource(changedDataSource);

    };
    const resetSaveForm = () =>{
        // saveFormReset(orgDataSource.filter((v)=>v.userSeq===saveFormGetValues('userSeq')??{})[0]);
        //saveFormReset();
        setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
        saveFormReset(emptyList[0]);
        setIsRowSelected(false);
        setSelectRowIndex(-1);
    };
    const handleSearchList =async ()=>{
        callGetNoticeManagementStateSearch();
        handleReset();
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }
        callGetNoticeList({title:searchFormGetValues('title')??'',isChecked:searchFormGetValues('isChecked')??false})
            .then((res)=>{
               // setDataSource(JSON.parse(JSON.stringify(res.item)));
               // setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
                searchCallback(JSON.parse(JSON.stringify(res.item)));
            });

        };
    const handleAdd=async()=>{
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if(!result) return;
        }
        const addList:NoticeList[] = JSON.parse(JSON.stringify(emptyList));
        addList[0].noticeSeq=orgDataSource&&orgDataSource.length>0 ? Math.max(...orgDataSource.map((v:NoticeList) => v.noticeSeq+1)):0;
        addList[0].iudType = IudType.I;
        const addedDataSource = orgDataSource.concat(addList);

        //setRowIndex(orgDataSource.length+1);
        setDataSource(addedDataSource);
        handleRowSelection(addList[0], addedDataSource.length-1).then();
    };
    const handleDelete =async ()=>{
        if(!await confirm('삭제 하시겠습니까?'))
            return;

        callDeleteNotice(saveFormGetValues('noticeSeq')).then((result)=>{
            if(result.code === HttpStatusCode.Ok) {
                handleSearchList();
                setIsRowSelected(false);
                handleReset();
            }
        });

    };
    const getCurrentRowDataSourceById = (id : number) => {
        return dataSource.filter((v)=>v.noticeSeq === id)[0];
    };
    const handleSave= async (value:NoticeList)=>{
        const saveData = getCurrentRowDataSourceById(value.noticeSeq);
        if(!saveData.iudType){
            message.info('변경된 내용이 없습니다.');
            return;
        }
        const result = await confirm('저장하시겠습니까?');
        if(result){
            const res = await callSaveFiles(fileSeq, menuInfo.menuSeq, fileList);

            if(res.code === HttpStatusCode.Ok) {
                setFileList(cloneDeep(res.item.fileList));
                saveData.fileSeq=res.item.fileSeq;
                callSaveNotice(saveData).then((saveRes)=>{

                    if(saveRes.code===HttpStatusCode.Ok){
                        message.info('저장 되었습니다');
                        handleReset();
                        callGetNoticeList({title:searchFormGetValues('title')??'',isChecked:searchFormGetValues('isChecked')??false}).then((res)=>{

                            const cloneData = JSON.parse(JSON.stringify(res.item));
                            searchCallback(cloneData);

                            const saveFormData =  cloneData.filter((item:Notice)=>{
                                return item.noticeSeq===saveRes.item;
                            });

                            saveFormReset(saveFormData[0]);
                            setSelectRowIndex(rowIndex);
                            if(saveFormData[0]){
                                setIsRowSelected(true);
                                initialValueRef.current=saveFormData[0].content;
                                getFileList(saveFormData[0].fileSeq);
                            }else{
                                setIsRowSelected(false);
                                setSelectRowIndex(-1);
                            }

                        });
                    }else{
                        setFileList(oriFileList);
                        // 기존 파일리스트를 보여주는 것으로
                    }
                });
            }
            saveData.fileSeq=res.item.fileSeq;

        }

    };

    const searchCallback = ( data : NoticeList[])=>{
        setDataSource(data);
        setOrgDataSource(data);
    };


    const handleRowChanged =async (recode:any,index?:number)=>{
        if(isChangedDataSource){
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 진행 하시겠습니까?');
            if(!result) return false;
        }

        saveFormReset();

        setDataSource(JSON.parse(JSON.stringify(orgDataSource)));

        return true;
    };
    const handleRowSelection =async (recode:Notice,index:number)=>{
        saveFormReset(recode);
        initialValueRef.current = recode.content;
        getFileList(recode.fileSeq??null);
        setRowIndex(index);
        setRowSeq(recode.noticeSeq);
        setIsRowSelected(true);
        setSelectRowIndex(index);

    };
    const handleKeyPress=(e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key==='Enter'){
            handleSearchList();
        }
    };
    const handleDataChanged =()=>{
        const formData  = saveFormGetValues();
        const changedDataSource = dataSource.map((item)=>{
           if(item.noticeSeq===saveFormGetValues('noticeSeq')){
            if(isItemChanged(item,formData)){
                item = {...item,...formData};
                item.iudType = item.iudType ?? IudType.U;
            }
           }
           return item;
        });
        changedDataSource&&setDataSource(changedDataSource);
    };
    const isItemChanged = (originalItem: Notice, newItem: Notice): boolean => {
        for (const key in newItem) {
            if (originalItem[key as keyof Notice] !== newItem[key as keyof Notice]) {
                return true;
            }
        }
        return false;
    };

    const searchInfo = () => {
        callGetNoticeManagementStateSearch().then((res) => {
            if (res.code === HttpStatusCode.Ok) {
                setCmCode(res.item);
                handleSearchList();
            }
        });
    };


    const onFileListChange = (newFileList :FileDetailType[]) => {
        setFileList(newFileList);
        const isChanged= newFileList.filter((item)=>{
            return item.iudType !=null ;
        });
        // console.log(newFileList);
        // console.log(isChanged);
        if(isChanged.length>0){
            saveFormSetValue('isChange',true);
            handleDataChanged();
        }

    };
    const getFileList = async (fileSeq:number|null) => {
        setFileSeq(fileSeq);
        const res = await callGetFileList(fileSeq);

        if(res.code === HttpStatusCode.Ok) {
            setFileList(cloneDeep(res.item));
            setOriFileList(cloneDeep(res.item));
        }
    };

    useEffect(() => {
        searchInfo();
    }, []);

    return(
        <>
            <section className={'button-wrap'}>
                <div className="box-btn">
                    <CustomButton type="primary" onClick={handleReset} disabled={!isEditable||currentDataSource?.iudType === IudType.I}><IconBtnRefresh/>{'초기화'}</CustomButton>
                    <CustomButton type="primary" onClick={handleSearchList}>{'조회'}</CustomButton>
                    <CustomButton type="primary" onClick={handleAdd} disabled={!isAdminUser}>{'추가'}</CustomButton>
                    <CustomButton type="primary" onClick={handleDelete} disabled={!isEditable}>{'삭제'}</CustomButton>
                    <CustomButton type="primary"   onClick={() => {  saveFormHandleSubmit(handleSave)();
                    }} disabled={!isEditable}>{'저장'}</CustomButton>
                </div>
            </section>

            <section className="search-wrap">
                <form onSubmit={searchFormHandleSubmit(handleSearchList)}>
                    <span>제목</span>
                    <Controller name={'title'} defaultValue={''} control={searchFormControl}  render={({field,fieldState})=>(
                        <CustomInput placeholder="검색할 제목을 입력해주세요."
                                     onChange={field.onChange}
                                     style={{width:250,margin:'0 8px'}}
                                     onKeyPress={handleKeyPress}/>
                    )} />


                    <Controller
                        name={'isChecked'}
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
                            공지사항 목록
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable onRow={(recode:any,index?:number)=>{
                            return {
                                onClick: ()=> {
                                    handleRowChanged(recode,index).then((res:boolean)=>{
                                        if(res){
                                            handleRowSelection(recode,index??-1);
                                        }
                                    });
                                },
                            };
                        }} rowKey={'noticeSeq'} pagination={false} rowNoFlag={true} columns={columns} selectedRowIndex={selectRowIndex} dataSource={dataSource} scroll={{ x: 1645 }}/>
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
                            <CustomInput style={{display: 'none'}} className={'hide'} {...saveFormRegister('noticeSeq')}  />

                            <div className="board-detail-info">
                                <div>
                                    <CustomSaveFormInput
                                        title={'제목'}
                                        control={saveFormControl}
                                        maxLength={100}
                                        required={true}
                                        disabled={!isEditable}
                                        {...saveFormRegister('title', {
                                            required:'제목은 필수입력입니다.',

                                            maxLength:{value:100 , message:"기관명은 100글자 이하이어야 합니다."},
                                            onChange:handleDataChanged
                                        })}
                                    />
                                    <CustomSaveFormSelect
                                        title={'카테고리'}
                                        control={saveFormControl}
                                        maxLength={11}
                                        required={true}
                                        disabled={!isEditable}
                                        options={cmCode}
                                        onChangeValueback={(v) => {
                                            saveFormSetValue('ctgrNm',v.label);
                                            handleDataChanged();
                                        }}
                                        {...saveFormRegister('ctgrCd',{
                                            required:'카테고리는 필수입니다.',

                                        })}

                                    />

                                </div>





                                <div>

                                    <CustomSaveFormInput
                                        title={'작성자'}
                                        control={saveFormControl}
                                        maxLength={11}
                                        required={false}
                                        disabled={true}
                                        {...saveFormRegister('rgstUserId',{

                                            onChange:handleDataChanged
                                        })}

                                    />
                                    <CustomSaveFormInput
                                        title={'작성일자'}
                                        control={saveFormControl}
                                        maxLength={11}
                                        required={false}
                                        disabled={true}
                                        {...saveFormRegister('rgstDateTime',{

                                            onChange:handleDataChanged
                                        })}

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

                                    <CustomSaveFormCheckbox
                                        title="팝업여부"
                                        name="popupFlag"
                                        disabled={!isEditable}
                                        control={saveFormControl}
                                       onChangeValue={(v)=>{
                                           saveFormSetValue('popupFlagLabel',v ? '사용':'미사용');
                                           handleDataChanged();
                                       }}
                                    />
                                    <CustomSaveFormCheckbox
                                        title="고정여부"
                                        name="fixFlag"
                                        disabled={!isEditable}
                                        control={saveFormControl}
                                        onChangeValue={(v)=>{
                                            saveFormSetValue('fixFlagLabel',v ? '사용':'미사용');
                                            handleDataChanged();
                                        }}
                                    />
                                </div>

                                <div>
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
                                <div >
                                    <span className="tit" style={{paddingLeft:16, width:120}}>내용</span>


                                    <Controller
                                        name="content"
                                        control={saveFormControl}
                                        render={({ field }) => {


                                            return (
                                                <CustomCkEditor
                                                    isEditable={isEditable}
                                                    value={field.value}
                                                    onChange={(value: string) => {
                                                        const isActuallyChanged = value !== initialValueRef.current;

                                                        if (isActuallyChanged) {
                                                            field.onChange(value);
                                                            handleDataChanged();
                                                        }
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                                <div>
                                    <span className="tit" style={{paddingLeft:16, width:120}}>첨부파일</span>
                                    <CustomFile
                                        key={JSON.stringify(fileList)}
                                        fileList={fileList}
                                        isEditable={isEditable}
                                        onFileListChange={onFileListChange}
                                    />
                                </div>

                            </div>
                        </form>
                        <span style={{color:'red', fontSize:13,paddingTop:10}}> ※10MB 이하의 파일만 업로드 가능합니다.</span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NoticeManagement;