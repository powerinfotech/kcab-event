import {Checkbox, message} from 'antd';
import CustomButton from '@component/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import React, {useEffect, useState} from 'react';
import IconTitle from '@icon/IconTitle';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import {ColumnsType} from 'antd/es/table';
import {
    NationAddrNoSearchInfo,
    NationAddrNoStateListItem,
    NationAddrNoStateSearchParam
} from '@interface/code/NationAddrNoState';
import {IudType, PageButtonHandlers} from '@interface/common';
import {Option} from 'antd/lib/mentions';
import CustomModal from '@component/CustomModal';
import {useForm} from 'react-hook-form';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomValidFormSelect from '@component/form/CustomValidFormSelect';
import {
    callGetNationAddrNoStateList,
    callGetNationAddrNoStateSearch,
    callSetNationAddrNoStateList
} from '@api/code/NationAddrNoStateApi';
import {HttpStatusCode} from 'axios';
import {useMessage} from "@hook/useMessage";
import {callGetUserList} from "@api/master/UserManagementApi";
import CustomSaveFormCheckbox from "@component/form/CustomSaveFormCheckbox";
import CustomSaveFormSelect from "@component/form/CustomSaveFormSelect";


const NationAddrNoState = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {control: searchFormControl, handleSubmit: searchFormHandleSubmit,setValue, getValues: searchFormGetValues, reset:searchFormReset} = useForm<NationAddrNoStateSearchParam>({mode:'all'});
    const [nationAddrDataSource, setNationAddrDataSource] = useState<NationAddrNoStateListItem[]>([]);
    const [nationAddrOrgDataSource, setNationAddrOrgDataSource] = useState<NationAddrNoStateListItem[]>([]);
    const [changePopupOpen, setChangePopupOpen] = useState<boolean>(false);
    const [searchInfoState, setSearchInfoState] = useState<NationAddrNoSearchInfo>({
        sggList:[], instlList:[] , instlInstList:[]
    });
    const [searchSggList,setSearchSggList] = useState<NationAddrNoSearchInfo['sggList']>([]);
    const [saveSggList,setSaveSggList] = useState<NationAddrNoSearchInfo['sggList']>([]);

    const [isInstlInstSelect,setIsInstlInstSelect] = useState<boolean>(false);


    const isChangedDataSource = nationAddrDataSource.some((v)=>v.iudType);
    const {confirm} = useMessage();



    const {register: saveFormRegister
        , control: saveFormControl
        , handleSubmit: saveFormHandleSubmit
        , reset: saveFormReset
        , getValues:saveFormGetValues
        , setValue:saveFormSetValues
    } = useForm<NationAddrNoStateListItem>({mode:'all'});


    const columns: ColumnsType<NationAddrNoStateListItem> = [
        IUD_COLUMN,
        {
            title: '사고 다발 구역',
            key:'accdntAreaFlag',
            dataIndex: 'accdntAreaFlag',
            align:'center',
            width:'5%',
            render: (value, record, index) => {
                return <Checkbox checked={value} onChange={(e) => inputChange(record,'accdntAreaFlag',e.target.checked)} />;
            }
        },
        {
            title: '설치기관',
            key:'instlName',
            dataIndex: 'instlName',
            align:'center',
            width:'7%'
        },
        {
            title: '관리기관(권역)',
            key:'sggNm',
            dataIndex: 'sggNm',
            align:'center',
            width:'7%'
        },
        {
            title: '국가지점번호',
            key:'ntnlPntNo',
            dataIndex: 'ntnlPntNo',
            align:'center',
            width:'7%',
            render: (value,record) => {
                return <a onClick={() => {
                    setChangePopupOpen(true);
                    saveFormReset(record);
                }}>{value}</a>;
            }
        },
        {
            title: '다목적위치 표지판 번호',
            key:'lctnSignNo',
            dataIndex: 'lctnSignNo',
            align:'center',
            width:'150px'
        },

        {
            title: '설치유형',
            key:'instlTypeName',
            dataIndex: 'instlTypeName',
            align:'center',
        },
        {
            title: 'X(N)좌표',
            key:'xcrdnt',
            dataIndex: 'xcrdnt',
            align:'center',
        },
        {
            title: 'Y(E)좌표',
            key:'ycrdnt',
            dataIndex: 'ycrdnt',
            align:'center',
        },
        {
            title: 'Z좌표(정표고)',
            key:'zcrdnt',
            dataIndex: 'zcrdnt',
            align:'center',
        },
        {
            title: '경도',
            key:'lng',
            dataIndex: 'lng',
            align:'center',
        },
        {
            title: '위도',
            key:'lat',
            dataIndex: 'lat',
            align:'center',
        },
        {
            title: '높이(타원체고)',
            key:'hght',
            dataIndex: 'hght',
            align:'center',
        },
        {
            title: '경도(센서팩)',
            key:'snsrLng',
            dataIndex: 'snsrLng',
            align:'center',
            width:'7%'
        },
        {
            title: '위도(센서팩)',
            key:'snsrLat',
            dataIndex: 'snsrLat',
            align:'center',
            width:'7%'
        },
        {
            title: '조회순서',
            key:'srtSq',
            dataIndex: 'srtSq',
            align:'center',
        },
        {
            title: '사용여부',
            key:'useFlag',
            dataIndex: 'useFlag',
            align:'center',
            render: (value, record, index) => {
                return <Checkbox checked={value} onChange={(e) => inputChange(record,'useFlag',e.target.checked)} />;
            }
        },
    ];

    const inputChange = (record:NationAddrNoStateListItem, columns:string, value:string|boolean) => {
        nationAddrDataSource.map((item:any) => {
            if (record.unqKey === item.unqKey) {
                item[columns] = value;
                item.iudType = item.iudType !== IudType.I ? IudType.U:item.iudType;
            }
            return item;
        });

        setNationAddrDataSource([...nationAddrDataSource]);
    };

    const handleDataChanged = () => {
        const formDate  = saveFormGetValues();
        const changedDataSource = nationAddrDataSource.map((item)=> {
            if (item.ntnlPntNo === saveFormGetValues('ntnlPntNo')) {
                item = {...item, ...formDate};
                item.iudType = item.iudType ?? IudType.U;
            }
            return item;
        });
       changedDataSource&&setNationAddrDataSource(changedDataSource);
    };

    const handleSave = async (value: NationAddrNoStateListItem) => {
        onSave();
    };


        const onSearch = async () => {
            if(isChangedDataSource) {
                const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
                if(!result) return;
            }
            callGetNationAddrNoStateList({searchText:searchFormGetValues('searchText')??'', sggCd: searchFormGetValues('sggCd')??'',instlCd:searchFormGetValues('instlCd')??''}).then((res)=> {
                res.item.forEach((item,index) => {
                    item.unqKey = index;
                });
                setNationAddrDataSource(res.item);
                setNationAddrOrgDataSource(res.item);
            });
        };

    const onSave = async ()=> {
        if(nationAddrDataSource.filter((v)=>v.iudType === "U").length ==0)
        {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        const result = await confirm('저장 하시겠습니까?');
        if(result) {
            const saveNationAddrDataSource = nationAddrDataSource.filter((item) => {
                return item.iudType !== null;
            });
            callSetNationAddrNoStateList(saveNationAddrDataSource).then(res => {
                if (res.code === HttpStatusCode.Ok) {
                    setChangePopupOpen(false);
                    message.success('저장이 완료 되었습니다.');
                    callGetNationAddrNoStateList({searchText:searchFormGetValues('searchText')??'', sggCd: searchFormGetValues('sggCd')??'',instlCd:searchFormGetValues('instlCd')??''}).then((res)=> {
                        res.item.forEach((item,index) => {
                            item.unqKey = index;
                        });
                        setNationAddrDataSource(res.item);
                        setNationAddrOrgDataSource(res.item);
                    });
                }
            });
        }
    };

    const searchInfo = () => {
        callGetNationAddrNoStateSearch().then((res) => {
            if (res.code === HttpStatusCode.Ok) {
                setSearchInfoState(res.item);
                onSearch();
                setValue('sggCd','');
                setValue('instlCd', '');
            }
        });
    };

    const handleReset = async() => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 초기화 하시겠습니까?');
            if(!result) return;
            //setNationAddrDataSource(JSON.parse(JSON.stringify(nationAddrOrgDataSource)));
            callGetNationAddrNoStateList({searchText:'', sggCd: '',instlCd:''}).then((res)=> {
                res.item.forEach((item,index) => {
                    item.unqKey = index;
                });
                setNationAddrDataSource(res.item);
                setNationAddrOrgDataSource(res.item);
            });
            searchFormReset();
        }


    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };

    const ChangeinstlCd = (value:string)=>{
        //alert(value);
        setValue('sggCd','');
        if(!value){
            setSearchSggList(searchInfoState.sggList);

            return;
        }

        setSearchSggList(searchInfoState.sggList.filter(f=>{
            return f.parent===value;
        }));
    };

    const ChangeSggList = (e:React.ChangeEvent<any>)=> {
      //alert(e.target.value);
        saveFormSetValues('sggCd','');
        const value = e.target.value;
        if(!value) return;
        filterSggList(value);
    };

    const initList = ()=>{
        callGetNationAddrNoStateSearch().then((res)=>{
            setSearchInfoState(res.item);
        });
    };

    useEffect(() => {
        if(changePopupOpen){
            const instlCd =saveFormGetValues('instlCd');
            if(!instlCd){
                saveFormSetValues('sggCd','');
                setSaveSggList([]);
            }else{
                filterSggList(instlCd);
            }
        }
    }, [changePopupOpen]);

    const filterSggList =(value:string)=>{
        setSaveSggList(searchInfoState.sggList.filter(f=>{
            return f.parent===value;
        }));
    };

    useEffect(() => {
        setSearchSggList(searchInfoState.sggList);
        setSaveSggList(searchInfoState.sggList);
    }, [searchInfoState.sggList]);

    useEffect(() => {
        searchInfo();
    }, []);

    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: onSearch,
                cfmSave: onSave,
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    return (
        <>
            <section className="search-wrap">
                    <form onSubmit={searchFormHandleSubmit(onSearch)}>
                        <span>국가지점/다목적위치표지판 번호</span>
                        <CustomValidFormInput control={searchFormControl} name={'searchText'}
                                              style={{width: 250, margin: '0 8px'}}
                                              onKeyPress={handleKeyPress}/>
                        <span>설치기관</span>
                        <CustomValidFormSelect control={searchFormControl} name={'instlCd'}
                                               style={{width: 250, margin: '0 8px'}} onChangeValueback={ChangeinstlCd}>
                            <Option value={''}>전체</Option>
                            {searchInfoState.instlInstList?.map((item, index) => {
                                return <Option key={`sgg_${index}`} value={item.value}>{item.label}</Option>;
                            })
                            }
                        </CustomValidFormSelect>
                        <span>권역</span>
                        <CustomValidFormSelect control={searchFormControl} name={'sggCd'}
                                               style={{width: 250, margin: '0 8px'}}>
                            <Option value={''}>전체</Option>
                            {searchSggList.map((item, index) => {
                                return <Option key={`sgg_${index}`} value={item.value}>{item.label}</Option>;
                            })
                            }
                        </CustomValidFormSelect>
                    </form>
            </section>

            <section className="board-wrap">
            <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            목록
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable columns={columns}
                                     rowKey={'unqKey'} dataSource={nationAddrDataSource} rowNoFlag={true}/>
                    </div>
                </div>
            </section>
            <CustomModal open={changePopupOpen} title={'국가지점번호 상세'} width={1000} onOk={saveFormHandleSubmit(handleSave)} onCancel={() => {
                setNationAddrDataSource(JSON.parse(JSON.stringify(nationAddrOrgDataSource)));
                setChangePopupOpen(false);
                initList();
            }}
            >
                {/*.board-wrap .board-detail-info > div > p .tit em*/}
                <form>
                    <section className="board-wrap">
                        <div className="board-detail-info">
                            <div>
                                <CustomSaveFormInput
                                    title={'국가지점번호'}
                                    control={saveFormControl}
                                    disabled={true}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('ntnlPntNo', {
                                        onChange: handleDataChanged
                                    })}
                                />
                                <CustomSaveFormCheckbox
                                    title="사고다발구역"
                                    name="accdntAreaFlag"
                                    control={saveFormControl}
                                    onChangeValue={handleDataChanged}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'다목적표지판\n위치번호'}
                                    control={saveFormControl}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('lctnSignNo', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormSelect
                                    title={'설치기관'}
                                    control={saveFormControl}
                                    required={true}
                                    options={searchInfoState.instlInstList}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('instlCd', {
                                        onChange: ChangeSggList,
                                        required:'설치기관은 필수 입력입니다.'
                                    })}
                                />

                                 <CustomSaveFormSelect
                                title={'설치유형'}
                                control={saveFormControl}
                                options={searchInfoState.instlList}
                                style={{width: '200px'}}
                                {...saveFormRegister('instlTypeCd', {
                                    onChange: handleDataChanged
                                })}
                            />
                            </div>
                            <div>
                                <CustomSaveFormSelect
                                    title={'관리기관(권역)'}
                                    required={true}
                                    control={saveFormControl}
                                    options={saveSggList}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('sggCd', {
                                        onChange: handleDataChanged,
                                        required:'관리기관은 필수 입력입니다.'
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'X(N)좌표'}
                                    control={saveFormControl}
                                    style={{width: '200px'}}
                                    maxLength={15}
                                    regExp={{value:/^[0-9]+(\.[0-9]*)?$/, message:'X(N)좌표는 숫자와 소수점만 입력 가능합니다.'}}
                                    {...saveFormRegister('xcrdnt', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'Y(E)좌표'}
                                    control={saveFormControl}
                                    style={{width: '200px'}}
                                    maxLength={15}
                                    regExp={{value:/^[0-9]+(\.[0-9]*)?$/, message:'Y(E)좌표는 숫자와 소수점만 입력 가능합니다.'}}
                                    {...saveFormRegister('ycrdnt', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'Z좌표(정표고)'}
                                    control={saveFormControl}
                                    style={{width: '200px'}}
                                    maxLength={15}
                                    regExp={{value:/^[0-9]+(\.[0-9]*)?$/, message:'Z좌표(정표고)는 숫자와 소수점만 입력 가능합니다.'}}
                                    {...saveFormRegister('zcrdnt', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'경도'}
                                    control={saveFormControl}
                                    style={{width: '200px'}}
                                    maxLength={15}
                                    regExp={{value:/^[0-9]+(\.[0-9]*)?$/, message:'경도는 숫자와 소수점만 입력 가능합니다.'}}
                                    {...saveFormRegister('lng', {
                                        onChange: handleDataChanged
                                    })}
                                />
                                <CustomSaveFormInput
                                    title={'센서팩 경도'}
                                    control={saveFormControl}
                                    disabled={true}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('snsrLng', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'위도'}
                                    control={saveFormControl}
                                    style={{width: '200px'}}
                                    maxLength={15}
                                    regExp={{value:/^[0-9]+(\.[0-9]*)?$/, message:'위도는 숫자와 소수점만 입력 가능합니다.'}}
                                    {...saveFormRegister('lat', {
                                        onChange: handleDataChanged
                                    })}
                                />
                                <CustomSaveFormInput
                                    title={'센서팩 위도'}
                                    control={saveFormControl}
                                    disabled={true}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('snsrLat', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'높이'}
                                    control={saveFormControl}
                                    style={{width: '200px'}}
                                    maxLength={15}
                                    regExp={{value:/^[0-9]+(\.[0-9]*)?$/, message:'높이는 숫자와 소수점만 입력 가능합니다.'}}
                                    {...saveFormRegister('hght', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'조회순서'}
                                    control={saveFormControl}
                                    required={true}
                                    style={{width: '200px'}}
                                    maxLength={3}
                                    regExp={{value:/^[0-9]*$/, message:'조회순서는 숫자만 입력가능합니다.'}}
                                    {...saveFormRegister('srtSq', {
                                        required: '조회순서는 필수입력입니다.',
                                        onChange: handleDataChanged
                                    })}
                                />
                                <CustomSaveFormCheckbox
                                    title="사용여부"
                                    name="useFlag"
                                    control={saveFormControl}
                                    onChangeValue={handleDataChanged}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'등록일시'}
                                    control={saveFormControl}
                                    disabled={true}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('rgstDateTime', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                            <div>
                                <CustomSaveFormInput
                                    title={'수정일시'}
                                    control={saveFormControl}
                                    disabled={true}
                                    style={{width: '200px'}}
                                    {...saveFormRegister('uptDateTime', {
                                        onChange: handleDataChanged
                                    })}
                                />
                            </div>
                        </div>
                    </section>
                </form>
            </CustomModal>
        </>
    );
};

export default NationAddrNoState;