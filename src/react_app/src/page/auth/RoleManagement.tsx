import {message} from 'antd';
import CustomButton from '@component/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import React, {useEffect, useState} from 'react';
import IconTitle from '@icon/IconTitle';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import {ColumnsType} from 'antd/es/table';
import {RoleList, RoleUserAutoCompleteOption, RoleUserList} from '@interface/auth/RoleManagement';
import {useMessage} from '@hook/useMessage';
import {callGetRoleList, callGetRoleUserList, callSaveRole} from '@api/auth/RoleManagementApi';
import CustomInput from '@component/CustomInput';
import CustomCheckbox from '@component/CustomCheckbox';
import {IudType, PageButtonHandlers} from '@interface/common';
import dayjs from 'dayjs';
import {HttpStatusCode} from 'axios';
import {getUserListByUserName} from '@api/CommonApi';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomValidDatePicker from '@component/form/CustomValidDatePicker';
import CustomValidAutocomplete from '@component/form/CustomValidAutocomplete';
import {CommonGrpCodeListItem} from "@interface/master/CommonGroupCodeManagement";


const RoleManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {confirm} = useMessage();
    const {register: roleRegister
        , unregister: roleUnregister
        , control: roleControl
        , handleSubmit: roleHandleSubmit
        , setValue: roleSetValue
    } = useForm<any>({mode:'onSubmit'});
    const [roleDataSource, setRoleDataSource] = useState<RoleList[]>([]);
    const [orgRoleDataSource, setOrgRoleDataSource] = useState<RoleList[]>([]);
    const [roleUserDataSource, setRoleUserDataSource] = useState<RoleUserList[]>([]);
    const [orgRoleUserDataSource, setOrgRoleUserDataSource] = useState<RoleUserList[]>([]);
    const [roleUserAutoCompleteList, setRoleUserAutoCompleteList] = useState<RoleUserAutoCompleteOption[]>([]);
    const [isIncludeUnusableRole, setIsIncludeUnusableRole] = useState<boolean>(false);
    const [isIncludeUnusableRoleUser, setIsIncludeUnusableRoleUser] = useState<boolean>(false);
    const [selectedRoleRowIndex, setSelectedRoleRowIndex] = useState(-1);
    const [selectedRoleUserRowIndex, setSelectedRoleUserRowIndex] = useState(-1);
    const [selectedRoleRowKeys, setSelectedRoleRowKeys] = useState<React.Key[]>([]);
    const [selectedRoleUserRowKeys, setSelectedRoleUserRowKeys] = useState<React.Key[]>([]);
    const selectedRoleRecord = ()=> {return roleDataSource&&roleDataSource.filter((v)=>v?.rowNo === selectedRoleRowIndex+1)[0];};
    const isEditableRoleUser = selectedRoleRowIndex > -1 && selectedRoleRecord()?.rgstUserId && selectedRoleRecord()?.useFlag;
    const editCheckIud = (data:RoleList | RoleUserList) => data.rgstUserId ? IudType.U :  IudType.I;
    const isChangedDataSource = (roleDataSource.some((v)=>v.iudType) || roleUserDataSource.some((v)=>v.iudType));

    const [rowIndex,setRowIndex] = useState(-1);
    const [rowId,setRowId] = useState(-1);

    const roleColumn: ColumnsType<RoleList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">역할ID<em>*</em></span>,
            key:'roleCd',
            dataIndex: 'roleCd',
            align:'center',
            width: '20%',
            render: (value:string, record:RoleList, index:number) => {
                return record.rgstUserId ? value :
                    <>
                    <CustomValidFormInput
                        control={roleControl}
                        required={true}
                        regExp={{value:/^[a-zA-Z0-9]*$/, message:'역할ID는 영문,숫자만 입력가능합니다.'}}
                        onChangeValue={(e) => handleDataChangeRole(record, 'roleCd', e)}
                        {...roleRegister(`${record.roleSeq}_roleCd`,
                             {required:'역할ID는 필수입력입니다.',
                                                pattern: {
                                                    value: /^[a-zA-Z0-9]*$/,
                                                    message: "역할ID는 영문,숫자만 입력가능합니다"
                                                },
                                                onChange:()=>{}})}/>
                        </>
                    ;
            }
        },
        {
            title: <span className="tit">역할명<em>*</em></span>,
            key: 'roleNm',
            dataIndex: 'roleNm',
            align: 'center',
            width: '20%',
            render: (value: string, record: RoleList) => {
                return record.rgstUserId && !record.useFlag ? value :
                    <>
                        {roleSetValue(`${record.roleSeq}_roleNm`, value)}
                        <CustomValidFormInput
                            defaultValue={value}
                            control={roleControl}
                            required={true}
                            onChangeValue={(e) => handleDataChangeRole(record, 'roleNm', e)}
                            {...roleRegister(`${record.roleSeq}_roleNm`, {required: '역할명은 필수입력입니다.'})}/>
                    </>
                    ;
            }
        },
        {
            title: '설명',
            key: 'roleDesc',
            dataIndex: 'roleDesc',
            align:'center',
            width: '45%',
            render: (value:string, record:RoleList) => {
                return record.rgstUserId &&  !record.useFlag ? value :
                    <CustomInput name={`${record.roleSeq}_roleDesc`} value={value} onChange={(e)=>handleDataChangeRole(record, 'roleDesc', e.target.value)}/>;
            }
        },
        {
            title: '사용여부',
            key:'useFlag',
            dataIndex: 'useFlag',
            align:'center',
            width: '15%',
            render: (value:boolean, record:RoleList) => {
                //return  !value&&record.iudType===null? '아니오':<CustomCheckbox name={`${record.roleSeq}_useFlag`} checked={value} onChange={(e)=>handleDataChangeRole(record, 'useFlag', e.target.checked)}/>;
                return <CustomCheckbox name={`${record.roleSeq}_useFlag`} checked={value} onChange={(e)=>handleDataChangeRole(record, 'useFlag', e.target.checked)}/>;
            }
        }
    ];

    const roleUserColumn: ColumnsType<RoleUserList> = [
        IUD_COLUMN,
        {
            title: '사용자ID',
            key:'userId',
            dataIndex: 'userId',
            align:'center',
            width: '20%',
            render: (value:string, record:RoleUserList) => {
                return record.rgstUserId ? (
                    <div style={{ textAlign: 'left' }}>{value}</div>
                    ):
                    <CustomValidAutocomplete
                        control={roleControl}
                        required={true}
                        style={{
                            width: 150,
                        }}
                        options={roleUserAutoCompleteList}
                        onSelect={(value,item) => {
                            roleUserDataSource.map((v:any) => {
                                if (record.roleUserSeq === v.roleUserSeq) {
                                    v.userId = item.userId;
                                    v.userNm = item.userNm;
                                    v.userSeq = item.userSeq;
                                    v.iudType = editCheckIud(record);
                                }
                                return v;
                            });

                            setRoleUserDataSource([...roleUserDataSource]);
                        }}
                        onChangeValue={(value) => {
                            const user = roleUserAutoCompleteList.find(user => user.value === value);
                            if (!value || (undefined===user)) {
                                roleUserDataSource.map((v:any) => {
                                    if (record.roleUserSeq === v.roleUserSeq) {
                                        v.userId = null;
                                        v.userNm = null;
                                        v.userSeq = null;
                                        v.iudType = editCheckIud(record);
                                    }
                                    return v;
                                });
                                setRoleUserDataSource([...roleUserDataSource]);
                            }
                        }}
                        onSearch={handleSearchUserComboList}
                        size="large"
                        {...roleRegister(`${record.roleUserSeq}_userId`, {required: '사용자명은 필수입력입니다.'})}
                    />;
            }

        },
        {
            title: '사용자명',
            key:'userNm',
            dataIndex: 'userNm',
            align:'center',
            width: '15%'
        },
        {
            title: '사용여부',
            key:'useFlag',
            dataIndex: 'useFlag',
            align:'center',
            width: '10%',
            render: (value:boolean, record:RoleUserList) => {
                //return !value && record.iudType === null?'아니오':<CustomCheckbox name={`${record.roleUserSeq}_useFlag`} checked={value} onChange={(e)=>handleDataChangeRoleUser(record, 'useFlag', e.target.checked)}/>;
                return <CustomCheckbox name={`${record.roleUserSeq}_useFlag`} checked={value} onChange={(e)=>handleDataChangeRoleUser(record, 'useFlag', e.target.checked)}/>;
            }
        },
        {
            title: '시작일',
            key:'strDate',
            dataIndex: 'strDate',
            align:'center',
            width: '20%',
            render: (value:string, record:RoleUserList) => {
                return record.rgstUserId ?
                    dayjs(value, 'YYYY-MM-DD').format('YYYY-MM-DD')
                    :
                    <CustomValidDatePicker
                                    control={roleControl}
                                    required={true}
                                    onChangeValue={(e)=>handleDataChangeRoleUser(record, 'strDate', e?e.format('YYYY-MM-DD') :'')}
                                    maxDate={record.endDate? dayjs(record.endDate, 'YYYY-MM-DD') : undefined}
                                     {...roleRegister(`${record.roleUserSeq}_strDate`, {required:'사용시작일은 필수입력입니다.'})}
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
            render: (value:string, record:RoleUserList) => {
                 return value&&dayjs(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
            }
        }
    ];


    const handleSearchRoleList = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }
        callGetRoleList().then((res)=> {
            if(res.code === HttpStatusCode.Ok) {
                setRowIndex(-1);
                setOrgRoleDataSource(JSON.parse(JSON.stringify(res.item)));
            }
        });
    };

    useEffect(() => {
        if(orgRoleDataSource) {
             if(isIncludeUnusableRole) setRoleDataSource(JSON.parse(JSON.stringify(orgRoleDataSource)));
             else setRoleDataSource(JSON.parse(JSON.stringify(orgRoleDataSource)).filter((v:any)=>v.useFlag));
        }

        setSelectedRoleRowIndex(-1);
       // setRoleUserDataSource([]);

    }, [orgRoleDataSource, isIncludeUnusableRole]);

    useEffect(() => {
        if(orgRoleUserDataSource) {
             if(isIncludeUnusableRoleUser) setRoleUserDataSource(JSON.parse(JSON.stringify(orgRoleUserDataSource)));
             else setRoleUserDataSource(JSON.parse(JSON.stringify(orgRoleUserDataSource)).filter((v:any)=>v.useFlag));
        }
        setSelectedRoleUserRowIndex(-1);
    }, [orgRoleUserDataSource, isIncludeUnusableRoleUser]);


    const handleSearchUserComboList = async (searchText : string) => {
        const userList = await getUserListByUserName(searchText);
        const filterString = roleUserDataSource.filter((v)=>v.useFlag).map((v)=>`${v.userSeq}(${v.userNm})`).join(',');
        const autoCompleteList = userList.item
            .filter((v)=>filterString.indexOf(`${v.userSeq}(${v.userName})`) < 0).map((item) => {
            return {
                label : `${item.userId}(${item.userName})`,
                value : item.userId,
                userId : item.userId,
                userNm : item.userName,
                userSeq: item.userSeq,
            };
        });
        setRoleUserAutoCompleteList(autoCompleteList);
    };


    useEffect(() => {
        const filterString = roleUserDataSource.filter((v)=>v.useFlag).map((v)=>`${v.userSeq}(${v.userNm})`).join(',');
        const autoCompleteList = roleUserAutoCompleteList.filter((v)=>filterString.indexOf(v?.label??'') < 0).map((item) => {
            return {
                label : `${item.userId}(${item.userNm})`,
                value : item.userId,
                userId : item.userId,
                userNm : item.userNm,
                userSeq: item.userSeq,
            };
        });
        setRoleUserAutoCompleteList(autoCompleteList);
    }, [roleUserDataSource]);


    const handleDataChangeRole = (record:RoleList, key:string, value:any) => {
        roleDataSource.map((item:any) => {
            if (record.roleSeq === item.roleSeq) {
                if(key === "roleNm") {
                    if(roleDataSource.filter((v) => record.unqKey === v.unqKey)[0][key] !== value){
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

        setRoleDataSource([...roleDataSource]);
    };

    const handleDataChangeRoleUser = (record:RoleUserList, key:string, value:any) => {
        roleUserDataSource.map((item:any) => {
            if (record.roleUserSeq === item.roleUserSeq) {
                item[key] = value;
                item.iudType = editCheckIud(record);
            }
            return item;
        });

        setRoleUserDataSource([...roleUserDataSource]);
    };

    const handleReset = async () => {
        if(isChangedDataSource) {
             const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
             if(!result) return;
        }
             resetRoleData();
             resetRoleUserData();

    };

    const resetRoleData = () => {
        setSelectedRoleRowIndex(-1);
       isIncludeUnusableRole?
           setRoleDataSource(JSON.parse(JSON.stringify(orgRoleDataSource)))
       :setRoleDataSource(JSON.parse(JSON.stringify(orgRoleDataSource.filter((v)=>v.useFlag))));
    };

    const resetRoleUserData = () => {
        setSelectedRoleUserRowIndex(-1);
        setRoleUserDataSource([]);
    };


    const handleSave = async (value: RoleList | RoleUserList) =>  {
        if(!isChangedDataSource)
        {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        const result = await confirm('저장 하시겠습니까?');
        if(result) {
            callSaveRole(roleDataSource, roleUserDataSource).then((result) => {
                if (result.code === HttpStatusCode.Ok) {
                    message.info('저장 되었습니다.');
                    roleUserDataSource.forEach((v) => {
                        roleUnregister(`${v.roleUserSeq}_userId`);
                        roleUnregister(`${v.roleUserSeq}_strDate`);
                    });
                    callGetRoleList().then((res)=> {
                        if(res.code === HttpStatusCode.Ok) {
                            setOrgRoleDataSource(JSON.parse(JSON.stringify(res.item)));
                        }
                        callGetRoleUserList(rowId).then((res)=> {
                            if(res.code === HttpStatusCode.Ok) {
                                //setRoleUserDataSource(JSON.parse(JSON.stringify(res.item)));
                                setOrgRoleUserDataSource(JSON.parse(JSON.stringify(res.item)));
                            }
                            setSelectedRoleRowIndex(rowIndex);
                        });
                    });


                }

            });

        }
    };

    const handleSearchListRoleUser = (roleSeq:number ) => {
        setRowId(roleSeq);
        callGetRoleUserList(roleSeq).then((res)=> {
            if(res.code === HttpStatusCode.Ok) {
                //setRoleUserDataSource(JSON.parse(JSON.stringify(res.item)));
                setOrgRoleUserDataSource(JSON.parse(JSON.stringify(res.item)));
            }
        });
    };

    const handleAddRowRole = () => {
        roleDataSource.push({ roleSeq:roleDataSource.length>0?Math.max(...roleDataSource.map((v:RoleList) => v.roleSeq+1)):0, roleCd:'', roleNm:'', roleDesc:'', useFlag: true, iudType:IudType.I});
        setRoleDataSource([...roleDataSource]);
    };

    const handleRemoveRowRole = () => {
        if(roleDataSource.filter((v)=>selectedRoleRowKeys.includes(v.roleSeq, 0)).length == 0)
        {
            message.info('선택한 내용이 없습니다.');
            return;
        }

        roleDataSource.filter((v)=>selectedRoleRowKeys.includes(v.roleSeq, 0)).forEach((v)=> {
            roleUnregister(`${v.roleSeq}_roleCd`);
            roleUnregister(`${v.roleSeq}_roleNm`);
        });

        const deleteData : RoleList[]= [];
        roleDataSource.forEach((item) => {
            const copyItem = {...item};
            if (selectedRoleRowKeys.includes(copyItem.roleSeq)) {
                copyItem.iudType = IudType.D;
            }

            if (!(copyItem.iudType === IudType.D && !item.rgstUserId)) {
                deleteData.push(copyItem);
            }
        });
        //setRoleDataSource(roleDataSource.filter((v)=>!selectedRoleRowKeys.includes(v.roleSeq, 0)));
        setRoleDataSource(JSON.parse(JSON.stringify(deleteData)));
        setSelectedRoleRowKeys([]);
    };

    const handleAddRowRoleUser = () => {
        roleUserDataSource.push({ roleUserSeq:roleUserDataSource.length>0?Math.max(...roleUserDataSource.map((v:RoleUserList) => v.roleUserSeq+1)):0, roleSeq:roleDataSource[selectedRoleRowIndex].roleSeq, roleNm:'', userSeq: 0, userNm:'', useFlag: true, iudType:IudType.I});
        setRoleUserDataSource([...roleUserDataSource]);
        handleSearchUserComboList('');
    };

    const handleRemoveRowRoleUser = () => {
        if(roleUserDataSource.filter((v)=>selectedRoleUserRowKeys.includes(v.roleUserSeq, 0)).length == 0)
        {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        roleUserDataSource.filter((v)=>selectedRoleUserRowKeys.includes(v.roleUserSeq, 0)).forEach((v)=> {
            roleUnregister(`${v.roleUserSeq}_userId`);
            roleUnregister(`${v.roleUserSeq}_strDate`);
        });

        const deleteData : RoleUserList[]= [];
        roleUserDataSource.forEach((item) => {
            const copyItem = {...item};
            if (selectedRoleUserRowKeys.includes(copyItem.roleUserSeq)) {
                copyItem.iudType = IudType.D;
            }

            if (!(copyItem.iudType === IudType.D && !item.rgstUserId)) {
                deleteData.push(copyItem);
            }
        });
        setRoleUserDataSource(JSON.parse(JSON.stringify(deleteData)));
        setSelectedRoleUserRowKeys([]);
    };

    const handleRoleRowSelection = async (recode:RoleList, index:number) => {
        if(roleUserDataSource.some((v)=> v.iudType)) {
             const result = await confirm("저장하지 않은 사용자 정보는 초기화 됩니다. 계속 진행하시겠습니까?");
             if(!result) return;
             roleUserDataSource.forEach((v)=>{
                 roleUnregister(`${v.roleUserSeq}_userId`);
                 roleUnregister(`${v.roleUserSeq}_strDate`);
             });
        }

        setSelectedRoleRowIndex(index);
        setRowIndex(index);
        recode.iudType !== IudType.I && handleSearchListRoleUser(recode.roleSeq);
    };

    const handleRowSelectionRoleUser = async (recode:RoleUserList, index:number) => {
        setSelectedRoleUserRowIndex(index);
    };

    const onRoleSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRoleRowKeys(newSelectedRowKeys);
    };

    const onSelectChangeRoleUser = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRoleUserRowKeys(newSelectedRowKeys);
    };
    const roleRowSelection = {
        selectedRowKeys:selectedRoleRowKeys,
        onChange: onRoleSelectChange,
        /*
        getCheckboxProps: (record: RoleList) => ({
            disabled: !!record.rgstUserId
        }),
         */
    };


    const roleUserRowSelection = {
        selectedRowKeys:selectedRoleUserRowKeys,
        onChange: onSelectChangeRoleUser,
        /*
        getCheckboxProps: (record: RoleUserList) => ({
            disabled: !!record.rgstUserId
        }),
         */
    };

    useEffect(() => {
        handleSearchRoleList();
    }, []);

    //첫 렌더시 데이터소스의 0번째 행 하위 검색
    useEffect(() => {
        if (orgRoleDataSource.length > 0 && rowIndex === -1) {
            handleRoleRowSelection(orgRoleDataSource[0], 0).then(()=>{});
        }
    }, [orgRoleDataSource]);

    // 미사용 권한포함 토글 시 0번째 행 하위 검색
    useEffect(() => {
        if (orgRoleDataSource && orgRoleDataSource.length > 0) {
            handleRoleRowSelection(orgRoleDataSource[0], 0).then(()=>{});
        }
    }, [isIncludeUnusableRole]);

    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: handleSearchRoleList,
                cfmSave: roleHandleSubmit(handleSave),
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    return (
        <>
        <section className="board-wrap half-wrap type03">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        역할정보1
                    </h3>

                    <div className="box-btn">
                        <span><CustomCheckbox name={'isExceptUnusedRole'} onChange={(v)=>setIsIncludeUnusableRole(v.target.checked)}/>미사용 역할포함</span>
                        <CustomButton type="default" size="small" onClick={handleAddRowRole}>행추가</CustomButton>
                        <CustomButton type="default" size="small" onClick={handleRemoveRowRole}>행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
                    <form onSubmit={roleHandleSubmit(handleSave)}>
                        <CustomTable onRow={(recode: any, index?: number) => {
                            return {
                                onClick: () => {
                                    if (index !== selectedRoleRowIndex) handleRoleRowSelection(recode, index ?? -1).then();
                                },
                            };
                        }}
                                     rowSelection={{...roleRowSelection}} rowKey={'roleSeq'} pagination={false}
                                     rowNoFlag={true} columns={roleColumn} dataSource={roleDataSource}
                                     selectedRowIndex={selectedRoleRowIndex}/>
                    </form>
                </div>
            </div>

            <div>
            <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        사용자정보
                    </h3>
                <div className="box-btn">
                    <span><CustomCheckbox name={'isExceptUnusedRoleUser'} onChange={(v) => setIsIncludeUnusableRoleUser(v.target.checked)}/>미사용 사용자포함</span>
                    <CustomButton type="default" size="small" onClick={handleAddRowRoleUser}  disabled={!isEditableRoleUser}>행추가</CustomButton>
                    <CustomButton type="default" size="small" onClick={handleRemoveRowRoleUser} disabled={!isEditableRoleUser}>행삭제</CustomButton>
                </div>
            </div>
                <div className="board-cont-wrap">
                    <CustomTable onRow={(recode:any, index?:number) => {
                            return {
                                onClick: () => {
                                    if(index !== selectedRoleUserRowIndex) handleRowSelectionRoleUser(recode, index??-1).then();
                               },
                            };
                        }}
                         rowSelection={roleUserRowSelection} rowKey={'roleUserSeq'} pagination={false} rowNoFlag={true} columns={roleUserColumn} dataSource={roleUserDataSource} selectedRowIndex={selectedRoleUserRowIndex}/>
                </div>
            </div>
        </section>
    </>);

};

export default RoleManagement;