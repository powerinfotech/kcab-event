import CustomButton from '@component/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import React, {useEffect, useState} from 'react';
import {ColumnsType} from 'antd/es/table';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import CustomInput from '@component/CustomInput';
import CustomCheckbox from '@component/CustomCheckbox';
import {HttpStatusCode} from 'axios';
import {message} from 'antd';
import IconTitle from '@icon/IconTitle';
import {AuthGroupList} from '@interface/auth/AuthGroupManagement';
import {CommonCodeMap, IudType} from '@interface/common';
import {callGetAuthGroupList, callSaveAuthGroup} from '@api/auth/AuthGroupManagementApi';
import CustomSelect from '@component/CustomSelect';
import {useCmCode} from '@hook/useCmCode';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import {useMessage} from '@hook/useMessage';
import {CommonGrpCodeListItem} from "@interface/master/CommonGroupCodeManagement";
import {callSaveCommonGrpCodeList} from "@api/master/CommonCodeManagementApi";



const AuthGroupMenuManagement = () => {
    const cmCode = useCmCode(['AuthGrpType']);
    const {register: authGroupRegister
        , unregister: authGroupUnregister
        , control: authGroupControl
        , handleSubmit: authGroupHandleSubmit
        , setValue: authGroupSetValue
    } = useForm<any>({mode:'onSubmit'});
    const [cmCodes, setCmCodes] = useState<CommonCodeMap>();
    const [selectedAuthGroupRowIndex, setSelectedAuthGroupRowIndex] = useState(-1);
    const [selectedAuthGroupRowKeys, setSelectedAuthGroupRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<AuthGroupList[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<AuthGroupList[]>([]);
    const [isIncludeUnusableAuth, setIsIncludeUnusableAuth] = useState<boolean>(false);
    const {confirm} = useMessage();
    const isChangedDataSource = dataSource.some((v)=>v.iudType);
    const editCheckIud = (data:AuthGroupList) => data.rgstUserId ? IudType.U :  IudType.I;
    const authGroupColumn: ColumnsType<AuthGroupList> = [
            IUD_COLUMN,
            {
                title:  <span className="tit">권한ID<em>*</em></span>,
                key:'authGrpCd',
                dataIndex: 'authGrpCd',
                align:'center',
                width: '20%',
                render: (value:string, record:AuthGroupList, index:number) => {
                    return record.rgstUserId ? value :
                         <CustomValidFormInput
                             control={authGroupControl}
                             required={true}
                             maxLength={20}
                             regExp={{value:/^[a-zA-Z0-9]*$/, message:'권한ID는 영문,숫자만 입력가능합니다.'}}
                             onChangeValue={(e) => handleDataChangeAuthGroup(record, 'authGrpCd', e)}
                             {...authGroupRegister(`${record.authGrpSeq}_authGrpCd`,
                                 {required:'권한 ID는 필수입력입니다.',
                                            pattern: {
                                                value: /^[a-zA-Z0-9]*$/,
                                                message: "권한ID는 영문,숫자만 입력가능합니다"
                                            },
                                            onChange:()=>{}})}/>
                    ;
                }
            },
            {
                title: <span className="tit">권한명<em>*</em></span>,
                key:'authGrpNm',
                dataIndex: 'authGrpNm',
                align:'center',
                width: '20%',
                render: (value:string, record:AuthGroupList) => {
                    return record.rgstUserId &&  !record.useFlag ? value :
                        <>
                            {authGroupSetValue(`${record.authGrpSeq}_authGrpNm`, value)}
                            <CustomValidFormInput
                                 control={authGroupControl}
                                 required={true}
                                 maxLength={100}
                                 regExp={{value:/^[ㄱ-ㅎ가-힣a-zA-Z0-9]*$/, message:'권한명은 한글,영문,숫자만 입력가능합니다.'}}
                                 onChangeValue={(e) => handleDataChangeAuthGroup(record, 'authGrpNm', e)}
                                 {...authGroupRegister(`${record.authGrpSeq}_authGrpNm`, {required:'권한명은 필수입력입니다.'})}/>
                        </>

                        ;
                }
            },
            {
                title: '설명',
                key:'authGrpDesc',
                dataIndex: 'authGrpDesc',
                align:'center',
                width: '25%',
                render: (value:string, record:AuthGroupList) => {
                    return record.rgstUserId &&  !record.useFlag ? value :
                        <CustomInput name={`${record.authGrpSeq}_authGrpDesc`}
                                     value={value}
                                     maxLength={2000}
                                     regExp={{value:/^[ㄱ-ㅎ가-힣a-zA-Z0-9]*$/, message:'설명은 한글,영문,숫자만 입력가능합니다.'}}
                                     onChange={(e)=>handleDataChangeAuthGroup(record, 'authGrpDesc', e.target.value)}/>;
                }
            },
            {
                title: '지정방식',
                key:'authGrpTypeCd',
                dataIndex: 'authGrpTypeCd',
                align:'center',
                width: '25%',
                render: (value:string, record:AuthGroupList) => {
                    return record.rgstUserId &&  !record.useFlag ? cmCodes&&cmCodes['AuthGrpType'] && cmCodes['AuthGrpType'][value] :cmCodes&&cmCodes['AuthGrpType'] && <CustomSelect name={`${record.authGrpSeq}_authGrpTypeCd`}
                                         style={{width:'150px'}}
                                         defaultValue={value}
                                         options={Object.keys(cmCodes['AuthGrpType']).map((key)  => ({'value': key,'label':cmCode['AuthGrpType'][key]}))}
                                         onChange={(e)=>handleDataChangeAuthGroup(record, 'authGrpTypeCd', e)}/>;
                }
            },
            {
                title: '사용여부',
                key:'useFlag',
                dataIndex: 'useFlag',
                align:'center',
                width: '15%',
                render: (value:boolean, record:AuthGroupList) => {
                    return <CustomCheckbox name={`${record.authGrpSeq}_useFlag`} checked={value} onChange={(e)=>handleDataChangeAuthGroup(record, 'useFlag', e.target.checked)}/>;
                }
            }
    ];
    const handleSearchAuthGroupList = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }

        callGetAuthGroupList().then((res)=> {
            if(res.code === HttpStatusCode.Ok) {
                // setDataSource(JSON.parse(JSON.stringify(res.item)));
                setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
            }
        });


    };

    const handleDataChangeAuthGroup = (record:AuthGroupList, key:string, value:any) => {
        dataSource.map((item:any) => {
            if (record.authGrpSeq === item.authGrpSeq) {
                if(key === "authGrpCd" || key ==="authGrpNm") {
                    if(dataSource.filter((v) => record.authGrpSeq === v.authGrpSeq)[0][key] !== value){
                        item.iudType = item.iudType !== IudType.I ? IudType.U:item.iudType;
                        item[key] = value;
                    }
                }
                else
                {
                    item[key] = value;
                    item.iudType = item.iudType !== IudType.I ? IudType.U:item.iudType;
                }
            }
            return item;
        });

        setDataSource([...dataSource]);
    };

    const handleReset = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }

        setSelectedAuthGroupRowIndex(-1);
        setSelectedAuthGroupRowKeys([]);
         if(isIncludeUnusableAuth) setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
         else setDataSource(JSON.parse(JSON.stringify(orgDataSource.filter((v)=>v.useFlag || v.iudType !== null))));
    };

    const handleSave = async () =>  {

        if(dataSource.filter((v)=>v.iudType === "U" || v.iudType === "I" || v.iudType === "D").length ==0)
        {
            message.info("변경된 내용이 없습니다.");
            return;
        }

        callSaveAuthGroup(dataSource).then((result)=> {
            if(result.code === HttpStatusCode.Ok) {
                message.success('저장이 완료 되었습니다.');
        callGetAuthGroupList().then((res)=> {
            if(res.code === HttpStatusCode.Ok) {
                // setDataSource(JSON.parse(JSON.stringify(res.item)));
                setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
            }
        });
                setSelectedAuthGroupRowIndex(-1);
            }
        });
    };

    const handleAddRowAuthGroup = () => {
        dataSource.push({
            authGrpSeq:dataSource.length>0?Math.max(...dataSource.map((v:AuthGroupList) => v.authGrpSeq+1)):0
            , authGrpCd:''
            , authGrpDesc: ''
            , authGrpNm: ''
            , authGrpTypeCd: 'ROLE'
            , useFlag: true
            , iudType:IudType.I});
        setDataSource([...dataSource]);
    };

    const handleDeleteRowAuthGroup = () => {
        if(dataSource.filter((v)=>selectedAuthGroupRowKeys.includes(v.authGrpSeq, 0)).length == 0)
            {
                message.info('선택한 내용이 없습니다.');
                return;
            }

        dataSource.filter((v)=>selectedAuthGroupRowKeys.includes(v.authGrpSeq, 0)).forEach((v)=> {
            authGroupUnregister(`${v.authGrpSeq}_authGrpCd`);
            authGroupUnregister(`${v.authGrpNm}_authGrpNm`);
        });
        setDataSource(dataSource.filter((v)=>!selectedAuthGroupRowKeys.includes(v.authGrpSeq, 0)));
        setSelectedAuthGroupRowKeys([]);
        setSelectedAuthGroupRowIndex(-1);
    };


    const onAuthGroupSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedAuthGroupRowKeys(newSelectedRowKeys);
    };

    const handleAuthGroupRowSelection = async (recode:AuthGroupList, index:number) => {
        setSelectedAuthGroupRowIndex(index);
    };

    const authGroupRowSelection = {
        selectedRowKeys:selectedAuthGroupRowKeys,
        onChange: onAuthGroupSelectChange,
        getCheckboxProps: (record: AuthGroupList) => ({
            disabled: !!record.rgstUserId
        }),
    };

    const checkUnusableEditingConfirmMessage =  async (value:boolean) => {
        if(dataSource.some((v)=>v.iudType !== null)) {
           const result =  await confirm('작성중이던 내용이 존재합니다. 계속 진행하시겠습니까?');
           if(!result) return;
        }
        setIsIncludeUnusableAuth(value);
    };

    useEffect(() => {
        if(orgDataSource) {
             if(isIncludeUnusableAuth) setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
             else setDataSource(JSON.parse(JSON.stringify(orgDataSource)).filter((v:any)=>v.useFlag || v.iudType !== null));
        }

        setSelectedAuthGroupRowIndex(-1);

    }, [orgDataSource, isIncludeUnusableAuth]);

    useEffect(() => {
        cmCode && setCmCodes(cmCode);
    }, [cmCode]);

    useEffect(() => {
        handleSearchAuthGroupList();
    }, []);

    return (
        <>
            <section className="button-wrap">
                <div className="box-btn">
                    <CustomButton type="primary" onClick={handleReset}><IconBtnRefresh/>초기화</CustomButton>
                    <CustomButton type="primary" onClick={handleSearchAuthGroupList}><IconBtnSearch/>조회</CustomButton>
                    <CustomButton type="primary" onClick={authGroupHandleSubmit(handleSave)}>저장</CustomButton>
                </div>
            </section>

            <section className="board-wrap">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            권한정보
                        </h3>
                        <div className="box-btn">
                            <span><CustomCheckbox name={'isExceptUnused'}
                                                  checked={isIncludeUnusableAuth}
                                                  onChange={(v)=>checkUnusableEditingConfirmMessage(v.target.checked)}/>미사용 권한포함</span>
                            <CustomButton type="default" size="small" onClick={handleAddRowAuthGroup}>행추가</CustomButton>
                            <CustomButton type="default" size="small"
                                          onClick={handleDeleteRowAuthGroup}>행삭제</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable onRow={(recode: any, index?: number) => {
                            return {
                                onClick: () => {
                                    if(index !== selectedAuthGroupRowIndex) handleAuthGroupRowSelection(recode, index??-1).then();
                               },
                            };
                        }}
                                     rowSelection={{...authGroupRowSelection}} rowKey={'authGrpSeq'} pagination={false}
                                     rowNoFlag={true} rowSelectedFlag={true} columns={authGroupColumn} dataSource={dataSource}
                                     selectedRowIndex={selectedAuthGroupRowIndex}/>
                    </div>
                </div>


            </section>
        </>);
};

export default AuthGroupMenuManagement;