import CustomButton from '@component/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import React, {useEffect, useState} from 'react';
import {ColumnsType} from 'antd/es/table';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import CustomCheckbox from '@component/CustomCheckbox';
import dayjs from 'dayjs';
import {useMessage} from '@hook/useMessage';
import {getRoleListByRoleName} from '@api/CommonApi';
import {HttpStatusCode} from 'axios';
import {message} from 'antd';
import IconTitle from '@icon/IconTitle';
import {IudType, PageButtonHandlers} from '@interface/common';
import {callGetAuthGroupRoleList, callSaveAuthGroupRole} from '@api/auth/AuthGroupRoleManagementApi';
import {callGetAuthGroupList} from '@api/auth/AuthGroupManagementApi';
import {AuthGroupList} from '@interface/auth/AuthGroupManagement';
import {AuthGroupRoleList, RoleAutoCompleteOption} from '@interface/auth/AuthGroupRoleManagement';
import {useForm} from 'react-hook-form';
import CustomValidAutocomplete from '@component/form/CustomValidAutocomplete';
import CustomValidDatePicker from '@component/form/CustomValidDatePicker';
import {RoleUserList} from "@interface/auth/RoleManagement";


const AuthGroupRoleMenuManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {confirm} = useMessage();
    const {register: authGroupRoleRegister
        , unregister: authGroupRoleUnregister
        , control: authGroupRoleControl
        , handleSubmit: authGroupRoleHandleSubmit
    } = useForm<any>({mode:'onSubmit'});
    const [selectedAuthGroupRowIndex, setSelectedAuthGroupRowIndex] = useState(-1);
    const [selectedAuthGroupRoleRowIndex, setSelectedAuthGroupRoleRowIndex] = useState(-1);
    const [selectedAuthGroupRoleRowKeys, setSelectedAuthGroupRoleRowKeys] = useState<React.Key[]>([]);
    const [authGroupDataSource, setAuthGroupDataSource] = useState<AuthGroupList[]>([]);
    const [orgAuthGroupDataSource, setOrgAuthGroupDataSource] = useState<AuthGroupList[]>([]);
    const [authGroupRoleDataSource, setAuthGroupRoleDataSource] = useState<AuthGroupRoleList[]>([]);
    const [orgAuthGroupRoleDataSource, setOrgAuthGroupRoleDataSource] = useState<AuthGroupRoleList[]>([]);
    const [roleAutoCompleteList, setRoleAutoCompleteList] = useState<RoleAutoCompleteOption[]>([]);
    const [isIncludeUnusableAuthGroup, setIsIncludeUnusableAuthGroup] = useState<boolean>(false);
    const [isIncludeUnusableAuthGroupRole, setIsIncludeUnusableAuthGroupRole] = useState<boolean>(false);
    const editCheckIud = (data:AuthGroupList | AuthGroupRoleList) => data.rgstUserId ? IudType.U :  IudType.I;
    const selectedAuthGroupRecord = ()=> {return authGroupDataSource&&authGroupDataSource.filter((v)=>v?.rowNo === selectedAuthGroupRowIndex+1)[0];};
    const isEditableAuthGroupRole = selectedAuthGroupRowIndex > -1 && selectedAuthGroupRecord()?.rgstUserId && selectedAuthGroupRecord()?.useFlag;
    const isChangedDataSource = authGroupRoleDataSource.some((v)=>v.iudType);
  //  const [foundSeq,setFoundSeq] = useState(-1);

    const [rowSeq, setRowSeq] = useState(-1);
    const [rowIndex, setRowIndex] = useState(-1);


    const authGroupColumn: ColumnsType<AuthGroupList> = [
        {
            title: '권한ID',
            key:'authGrpCd',
            dataIndex: 'authGrpCd',
            align:'center',
            width: '20%'
        },
        {
            title: '권한명',
            key:'authGrpNm',
            dataIndex: 'authGrpNm',
            align:'center',
            width: '20%'
        },
        {
            title: '설명',
            key:'authGrpDesc',
            dataIndex: 'authGrpDesc',
            align:'center',
            width: '40%',
        },
        {
            title: '사용여부',
            key:'useFlag',
            dataIndex: 'useFlag',
            align:'center',
            width: '20%',
            render: (value:boolean, record:AuthGroupList) => {
                return value?'예':'아니오';
            }
        }
    ];



    const authGroupRoleColumn: ColumnsType<AuthGroupRoleList> = [
        IUD_COLUMN,
        {
            title: '역할ID',
            key:'roleCd',
            dataIndex: 'roleCd',
            align:'center',
            width: '20%',
            render: (value:string, record:AuthGroupRoleList) => {
                return record.rgstUserId ? value:
                    <CustomValidAutocomplete
                        control={authGroupRoleControl}
                        style={{
                            width: 150,
                        }}
                        options={roleAutoCompleteList}
                        onSelect={(value,item) => {
                            authGroupRoleDataSource.map((v:any) => {
                                if (record.authGrpRoleSeq === v.authGrpRoleSeq) {
                                    v.roleCd = item.roleCd;
                                    v.roleNm = item.roleNm;
                                    v.roleSeq = item.roleSeq;
                                    v.iudType = editCheckIud(record);
                                }
                                return v;
                            });

                            setAuthGroupRoleDataSource([...authGroupRoleDataSource]);
                        }}
                        onSearch={handleSearchRoleComboList}
                        size="large"
                     {...authGroupRoleRegister(`${record.authGrpRoleSeq}_roleCd`, {required: '역할명은 필수입력입니다.'})}/>;
            }

        },
        {
            title: '역할명',
            key:'roleNm',
            dataIndex: 'roleNm',
            align:'center',
            width: '15%'
        },
        {
            title: '사용여부',
            key:'useFlag',
            dataIndex: 'useFlag',
            align:'center',
            width: '10%',
            render: (value:boolean, record:AuthGroupRoleList) => {
                return <CustomCheckbox name={`${record.authGrpRoleSeq}_useFlag`} checked={value} onChange={(e)=>handleDataChangeAuthGroupRoleUser(record, 'useFlag', e.target.checked)}/>;
            }
        },
        {
            title: '시작일',
            key:'strDate',
            dataIndex: 'strDate',
            align:'center',
            width: '20%',
            render: (value:string, record:AuthGroupRoleList) => {
                return record.rgstUserId ?
                    dayjs(value, 'YYYY-MM-DD').format('YYYY-MM-DD')
                    :
                    <CustomValidDatePicker
                        control={authGroupRoleControl}
                        required={true}
                        minDate={dayjs()}
                        onChangeValue={(e)=>handleDataChangeAuthGroupRoleUser(record, 'strDate', e?e.format('YYYY-MM-DD') :'')}
                        maxDate={record.endDate? dayjs(record.endDate, 'YYYY-MM-DD') : undefined}
                         {...authGroupRoleRegister(`${record.authGrpRoleSeq}_strDate`, {required:'사용시작일은 필수입력입니다.'})}
                    />
                    ;
            }
        },
        {
            title: '종료일',
            key:'endDate',
            dataIndex: 'endDate',
            align:'center',
            width: '20%',
            render: (value:string, record:AuthGroupRoleList) => {
                 return value&&dayjs(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
            }
        }
    ];

    const handleSearchAuthGroupList = () => {
        callGetAuthGroupList().then((res)=> {
            if(res.code === HttpStatusCode.Ok) {
                // setAuthGroupDataSource(JSON.parse(JSON.stringify(res.item)));
                setRowSeq(-1);
                setOrgAuthGroupDataSource(JSON.parse(JSON.stringify(res.item)));
                //setAuthGroupRoleDataSource([]);
                setSelectedAuthGroupRowIndex(-1);
                setSelectedAuthGroupRoleRowIndex(-1);
            }

        });
    };


    const handleSearchRoleComboList = async (searchText : string) => {
        const roleList = await getRoleListByRoleName(searchText);
        const filterString = authGroupRoleDataSource.filter((v)=>v.useFlag).map((v)=>v.roleSeq);
        const autoCompleteList = roleList.item
            .filter((v)=>
                !filterString.some((v2)=>v2===v.roleSeq)
            )
            .map((item) => {
            return {
                label : `${item.roleCd}(${item.roleNm})`,
                value : item.roleCd,
                roleCd : item.roleCd,
                roleNm : item.roleNm,
                roleSeq: item.roleSeq,
            };
        });
        setRoleAutoCompleteList(autoCompleteList);
    };

   useEffect(() => {
        if(orgAuthGroupDataSource) {
             if(isIncludeUnusableAuthGroup) setAuthGroupDataSource(JSON.parse(JSON.stringify(orgAuthGroupDataSource)));
             else setAuthGroupDataSource(JSON.parse(JSON.stringify(orgAuthGroupDataSource)).filter((v:any)=>v.useFlag));
        }

        setSelectedAuthGroupRowIndex(-1);
        setSelectedAuthGroupRoleRowIndex(-1);
        //setAuthGroupRoleDataSource([]);
    }, [orgAuthGroupDataSource, isIncludeUnusableAuthGroup]);

   useEffect(() => {
        if(orgAuthGroupDataSource) {
             if(isIncludeUnusableAuthGroup) setAuthGroupDataSource(JSON.parse(JSON.stringify(orgAuthGroupDataSource)));
             else setAuthGroupDataSource(JSON.parse(JSON.stringify(orgAuthGroupDataSource)).filter((v:any)=>v.useFlag));
        }

        setSelectedAuthGroupRowIndex(-1);
        setSelectedAuthGroupRoleRowIndex(-1);
        //setAuthGroupRoleDataSource([]);
    }, [orgAuthGroupDataSource, isIncludeUnusableAuthGroup]);


   useEffect(() => {
        if(orgAuthGroupRoleDataSource) {
             if(isIncludeUnusableAuthGroupRole) setAuthGroupRoleDataSource(JSON.parse(JSON.stringify(orgAuthGroupRoleDataSource)));
             else setAuthGroupRoleDataSource(JSON.parse(JSON.stringify(orgAuthGroupRoleDataSource)).filter((v:any)=>v.useFlag));
        }
        setSelectedAuthGroupRoleRowIndex(-1);
    }, [orgAuthGroupRoleDataSource, isIncludeUnusableAuthGroupRole]);


    useEffect(() => {
        const filterString = authGroupRoleDataSource.filter((v)=>v.useFlag).map((v)=>`${v.roleSeq}(${v.roleNm})`).join(',');
        const autoCompleteList = roleAutoCompleteList.filter((v)=>filterString.indexOf(v?.label??'') < 0).map((item) => {
            return {
                label : `${item.roleCd}(${item.roleNm})`,
                value : item.roleCd,
                roleCd : item.roleCd,
                roleNm : item.roleNm,
                roleSeq : item.roleSeq,
            };
        });
        setRoleAutoCompleteList(autoCompleteList);
    }, [authGroupRoleDataSource]);


    const handleDataChangeAuthGroupRoleUser = (record:AuthGroupRoleList, key:string, value:any) => {
        authGroupRoleDataSource.map((item:any) => {
            if (record.authGrpRoleSeq === item.authGrpRoleSeq) {
                item[key] = value;
                item.iudType = editCheckIud(record);
            }
            return item;
        });

        setAuthGroupRoleDataSource([...authGroupRoleDataSource]);
    };

    const handleReset = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 초기화 하시겠습니까?');
            if(!result) return;

        }
        authGroupRoleDataSource&&authGroupRoleDataSource.length&&setAuthGroupRoleDataSource(JSON.parse(JSON.stringify(orgAuthGroupRoleDataSource)));
        setAuthGroupRoleDataSource([]);
        setSelectedAuthGroupRowIndex(-1);
    };

    const handleSave = async (value: AuthGroupRoleList) => {
        if(authGroupRoleDataSource.filter((v)=>v.iudType === "U" || v.iudType === "I" || v.iudType === "D").length ==0)
        {
            message.info("변경된 내용이 없습니다.");
            return;
        }
        const result = await confirm('저장하시겠습니까?');
        if(!result) return;

        callSaveAuthGroupRole(authGroupRoleDataSource).then((result)=> {
            if(result.code === HttpStatusCode.Ok) {
                message.info('저장 되었습니다.');
                authGroupRoleDataSource.forEach((v)=> {
                    authGroupRoleUnregister(`${v.authGrpRoleSeq}_roleCd`);
                    authGroupRoleUnregister(`${v.authGrpRoleSeq}_strDate`);

                    callGetAuthGroupList().then((res)=> {
                        if(res.code === HttpStatusCode.Ok) {
                            // setAuthGroupDataSource(JSON.parse(JSON.stringify(res.item)));
                            setOrgAuthGroupDataSource(JSON.parse(JSON.stringify(res.item)));
                            setAuthGroupRoleDataSource([]);
                            setSelectedAuthGroupRoleRowIndex(-1);
                            handleSearchListAuthGroupRole(res.item[rowIndex].authGrpSeq,'Y');
                         //   setSelectedAuthGroupRowIndex(rowIndex);


                        }

                    });
                });


                // setSelectedAuthGroupRowIndex(rowIndex);
                // setSelectedAuthGroupRoleRowIndex(-1);
                // setAuthGroupRoleDataSource([]);
            }
        });
    };


    const handleSearchListAuthGroupRole = (authGrpSeq:number,saveYn?:string) => {
        callGetAuthGroupRoleList(authGrpSeq).then((res)=> {
            if(res.code === HttpStatusCode.Ok) {
                //setAuthGroupRoleDataSource(JSON.parse(JSON.stringify(res.item)));
                setOrgAuthGroupRoleDataSource(JSON.parse(JSON.stringify(res.item)));
                if(saveYn&&saveYn==='Y'){
                    setSelectedAuthGroupRowIndex(rowIndex);
                }
            }
        });
    };


    const handleAddRowAuthGroupRole = () => {
        authGroupRoleDataSource.push({ authGrpRoleSeq:authGroupRoleDataSource.length>0?Math.max(...authGroupRoleDataSource.map((v:AuthGroupRoleList) => v.authGrpRoleSeq+1)):0
            , roleNm: ''
            , authGrpSeq:authGroupDataSource[selectedAuthGroupRowIndex].authGrpSeq
            , roleSeq: -1
            , useFlag: true
            , iudType:IudType.I});
        setAuthGroupRoleDataSource([...authGroupRoleDataSource]);
        handleSearchRoleComboList('');
    };

    const handleRemoveRowAuthGroupRole = () => {
        if(authGroupRoleDataSource.filter((v)=>selectedAuthGroupRoleRowKeys.includes(v.authGrpRoleSeq, 0)).length == 0)
        {
            message.info('선택한 내용이 없습니다.');
            return;
        }

        authGroupRoleDataSource.filter((v)=>selectedAuthGroupRoleRowKeys.includes(v.authGrpRoleSeq, 0)).forEach((v)=> {
            authGroupRoleUnregister(`${v.authGrpRoleSeq}_roleCd`);
            authGroupRoleUnregister(`${v.authGrpRoleSeq}_strDate`);
        });

        setAuthGroupRoleDataSource(authGroupRoleDataSource.filter((v)=>!selectedAuthGroupRoleRowKeys.includes(v.authGrpRoleSeq, 0)));
        setSelectedAuthGroupRoleRowKeys([]);
    };

    const handleAuthGroupRowSelection = async (recode:AuthGroupList, index:number) => {
        if(authGroupRoleDataSource.some((v)=> v.iudType)) {
             const result = await confirm("저장하지 않은 사용자 정보는 초기화 됩니다. 계속 진행하시겠습니까?");
             if(!result) return;
             authGroupRoleDataSource.forEach((v)=> {
                authGroupRoleUnregister(`${v.authGrpRoleSeq}_roleCd`);
                authGroupRoleUnregister(`${v.authGrpRoleSeq}_strDate`);
            });
        }
        setRowSeq(recode.authGrpSeq);
        setRowIndex(index);
        setSelectedAuthGroupRowIndex(index);
        recode.iudType !== IudType.I && handleSearchListAuthGroupRole(recode.authGrpSeq);
    };

    const handleRowSelectionAuthGroupRole = async (recode:AuthGroupList, index:number) => {
        setSelectedAuthGroupRoleRowIndex(index);
    };

    const onSelectChangeAuthGroupRole = (newSelectedRowKeys: React.Key[]) => {
        setSelectedAuthGroupRoleRowKeys(newSelectedRowKeys);
    };

    const checkUnusableAuthGroupEditingConfirmMessage =  async (value:boolean) => {
        if(authGroupRoleDataSource.some((v)=>v.iudType !== null)) {
           const result =  await confirm('작성중이던 내용이 존재합니다. 계속 진행하시겠습니까?');
           if(!result) return;
        }
        setIsIncludeUnusableAuthGroup(value);
    };

    const checkUnusableAuthGroupRoleEditingConfirmMessage =  async (value:boolean) => {
        if(authGroupRoleDataSource.some((v)=>v.iudType !== null)) {
           const result =  await confirm('작성중이던 내용이 존재합니다. 계속 진행하시겠습니까?');
           if(!result) return;
        }
        setIsIncludeUnusableAuthGroupRole(value);
    };


    const authGroupRoleRowSelection = {
        selectedRowKeys:selectedAuthGroupRoleRowKeys,
        onChange: onSelectChangeAuthGroupRole,
        getCheckboxProps: (record: AuthGroupList) => ({
            disabled: !!record.rgstUserId
        }),

    };

    useEffect(() => {
        handleSearchAuthGroupList();
    }, []);

    // 첫 렌더시 데이터소스의 0번째 행 하위 검색
    useEffect(() => {
        console.log(rowSeq);
        if (orgAuthGroupDataSource.length > 0 && rowSeq === -1) {
            handleAuthGroupRowSelection(orgAuthGroupDataSource[0], 0).then(()=>{});
        }
    }, [orgAuthGroupDataSource]);

    // 미사용 권한포함 토글 시 0번째 행 하위 검색
    useEffect(() => {
        if (authGroupDataSource && authGroupDataSource.length > 0) {
            handleAuthGroupRowSelection(orgAuthGroupDataSource[0], 0).then(()=>{});
        }
    }, [isIncludeUnusableAuthGroup]);



    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: handleSearchAuthGroupList,
                cfmSave: authGroupRoleHandleSubmit(handleSave),
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    return (
        <>
        <section className="board-wrap half-wrap type02">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        권한정보
                    </h3>
                    <div className="box-btn">
                        <span>
                            <CustomCheckbox name={'isExceptUnusedAuthGroup'}
                                            checked={isIncludeUnusableAuthGroup}
                                            onChange={(v) => checkUnusableAuthGroupEditingConfirmMessage(v.target.checked)}>미사용 권한포함</CustomCheckbox>
                        </span>
                    </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable onRow={(recode: any, index?: number) => {
                            return {
                                onClick: () => {
                                    if (index !== selectedAuthGroupRowIndex) handleAuthGroupRowSelection(recode, index ?? -1).then();
                                },
                            };
                        }}
                                     rowKey={'authGrpSeq'} pagination={false} rowNoFlag={true}
                                     columns={authGroupColumn} dataSource={authGroupDataSource}
                                     selectedRowIndex={selectedAuthGroupRowIndex}/>
                    </div>
                </div>

                <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        역할정보
                    </h3>
                    <div className="box-btn">
                        <CustomCheckbox name={'isExceptUnusedAuthGroupRole'}
                                              checked={isIncludeUnusableAuthGroupRole}
                                        onChange={(v) => checkUnusableAuthGroupRoleEditingConfirmMessage(v.target.checked)}>미사용 역할포함</CustomCheckbox>
                        <CustomButton type="default" size="small" onClick={handleAddRowAuthGroupRole} disabled={!isEditableAuthGroupRole}>행추가</CustomButton>
                        <CustomButton type="default" size="small" onClick={handleRemoveRowAuthGroupRole} disabled={!isEditableAuthGroupRole}>행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable onRow={(recode:any, index?:number) => {
                            return {
                                onClick: () => {
                                    if(index !== selectedAuthGroupRoleRowIndex) handleRowSelectionAuthGroupRole(recode, index??-1).then();
                               },
                            };
                        }}
                                 rowSelection={authGroupRoleRowSelection} rowKey={'authGrpRoleSeq'}  pagination={false} rowNoFlag={true} columns={authGroupRoleColumn} dataSource={authGroupRoleDataSource} selectedRowIndex={selectedAuthGroupRoleRowIndex}/>
                </div>
            </div>
        </section>
    </>);
};

export default AuthGroupRoleMenuManagement;
