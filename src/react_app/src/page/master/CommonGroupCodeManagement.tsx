import {message, Table, TableColumnsType, TableProps} from 'antd';
import React, {useEffect, useState} from 'react';
import CustomButton from '@component/CustomButton';
import {IudType, PageButtonHandlers} from '@interface/common';
import CustomCheckbox from '@component/CustomCheckbox';

import CustomInput from '@component/CustomInput';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import IconTitle from '@icon/IconTitle';
import {callGetCommonGrpCodeList, callSaveCommonGrpCodeList} from '@api/master/CommonCodeManagementApi';
import {CommonGepCodeSearchParam, CommonGrpCodeListItem} from '@interface/master/CommonGroupCodeManagement';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import {HttpStatusCode} from 'axios';
import {useMessage} from '@hook/useMessage';
import {callGetUserList} from "@api/master/UserManagementApi";

const CommonGroupCodeManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {control: searchFormControl, getValues: searchFormGetValues, handleSubmit: searchFormHandleSubmit} = useForm<CommonGepCodeSearchParam>({mode:'all'});

    const {register: comGrpCodeRegister
        , unregister: comGrpCodeUnregister
        , control: comGrpCodeControl
        , handleSubmit: comGrpCodeHandleSubmit
        , setValue: comGrpCodeSetValue
        , reset: comGrpCodeReset
    } = useForm<any>({mode:'onSubmit'});
    const {confirm} = useMessage();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [tableHeight, setTableHeight] = useState(1000);
    const [dataSource, setDataSource] = useState<CommonGrpCodeListItem[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<CommonGrpCodeListItem[]>([]);
    const isChangedDataSource = dataSource.some((v)=>v.iudType);
    type TableRowSelection<T> = TableProps<T>['rowSelection'];
    const addRow = () => {
        const unqList = dataSource?.map((item)=>{return item.unqKey;});

        const addObject = {
            cmGrpCd :'',
            cmGrpNm :'',
            cmGrpExpl :'',
            useFlag :true,
            ref01 :'',
            ref02 :'',
            ref03 :'',
            ref04 :'',
            ref05 :'',
            ref06 :'',
            ref07 :'',
            ref08 :'',
            ref09 :'',
            ref10 :'',
            ref11 :'',
            ref12 :'',
            ref13 :'',
            ref14 :'',
            ref15 :'',
            iudType:IudType.I,
            unqKey:unqList && unqList.length > 0?Math.max(...unqList) +1:0
        };
        if (dataSource.length > 0) {
            setDataSource(JSON.parse(JSON.stringify(dataSource.concat([addObject]))));
        } else {
            setDataSource([JSON.parse(JSON.stringify(addObject))]);
        }
    };

    const deleteRow = () => {
        if(dataSource.filter((v)=>selectedRowKeys.includes(v.unqKey, 0)).length == 0)
        {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        dataSource.filter((v)=>selectedRowKeys.includes(v.unqKey, 0)).forEach((v)=> {
            comGrpCodeUnregister(`${v.unqKey}_cmGrpCd`);
            comGrpCodeUnregister(`${v.unqKey}_cmGrpNm`);
        });

        const deleteData : CommonGrpCodeListItem[]= [];
        dataSource.forEach((item) => {
            const copyItem = {...item};
            if (selectedRowKeys.includes(copyItem.unqKey)) {
                copyItem.iudType = IudType.D;
            }

            if (!(copyItem.iudType === IudType.D && !item.comGrpCdSeq)) {
                deleteData.push(copyItem);
            }
        });
        setDataSource(JSON.parse(JSON.stringify(deleteData)));
        setSelectedRowKeys([]);
    };

    const inputChange = (record:CommonGrpCodeListItem, columns:string, value:string|boolean) => {
        dataSource.map((item:any) => {
            if (record.unqKey === item.unqKey) {
                if(columns === "cmGrpCd" || columns ==="cmGrpNm") {
                    if(dataSource.filter((v) => record.unqKey === v.unqKey)[0][columns] !== value){
                        item.iudType = item.iudType !== IudType.I ? IudType.U:item.iudType;
                        item[columns] = value;
                    }
                }
                else
                {
                    item[columns] = value;
                    item.iudType = item.iudType !== IudType.I ? IudType.U:item.iudType;
                }
            }
            return item;
        });

        setDataSource([...dataSource]);
    };

    const saveCode = async (value: CommonGrpCodeListItem) => {
        if(!isChangedDataSource)
        {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        const result = await confirm('저장 하시겠습니까?');
        if(result) {
            callSaveCommonGrpCodeList(dataSource).then((res) => {
                if(res.code === HttpStatusCode.Ok) {
                    message.success('저장이 완료 되었습니다.');
                    comGrpCodeReset();
                    //애러나도 재조회
                    callGetCommonGrpCodeList({searchText:searchFormGetValues('searchText')??''}).then((res)=> {
                        res.item.map((item,index) => {
                            item.unqKey = index;
                        });
                        setDataSource(JSON.parse(JSON.stringify(res.item)));
                        setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
                    });
                }
            });
        }
    };


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<CommonGrpCodeListItem> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };

    const columns: TableColumnsType<CommonGrpCodeListItem> = [
        IUD_COLUMN,
        {
            title: (
                <span>
                분류코드 <span style={{color: 'red'}}>*</span>
            </span>
            ),
            dataIndex: 'cmGrpCd',
            key: 'cmGrpCd',
            width:100,
            align:'center',
            render: (value,record) => {
               return record.comGrpCdSeq?value
                    : <CustomValidFormInput
                       control={comGrpCodeControl}
                       required={true}
                       maxLength={10}
                       regExp={{value:/^[A-Z0-9]*$/, message:'분류코드는 영문 대문자와 숫자만 입력가능합니다.'}}
                       onChangeValue={(e) => inputChange(record, 'cmGrpCd', e)}
                       {...comGrpCodeRegister(`${record.unqKey}_cmGrpCd`, {required:'분류코드는 필수입력입니다.'})}/>
                   ;
            }
        },
        {
            title: (
                <span>
                분류명 <span style={{color: 'red'}}>*</span>
            </span>
            ),
            dataIndex: 'cmGrpNm',
            key: 'cmGrpNm',
            width:150,
            align:'center',
            render: (value,record) => {
                return  (
                <>
                    {comGrpCodeSetValue(`${record.unqKey}_cmGrpNm`, value)}
                     <CustomValidFormInput
                       control={comGrpCodeControl}
                       required={true}
                       maxLength={100}
                       onChangeValue={(e) => inputChange(record, 'cmGrpNm', e)}
                       {...comGrpCodeRegister(`${record.unqKey}_cmGrpNm`, {required:'분류명은 필수입력입니다.'})}/>
                </>
                )
                ;
            }
        },
        {
            title: '설명',
            dataIndex: 'cmGrpDesc',
            key: 'cmGrpDesc',
            width:200,
            align:'center',
            render: (value,record) => {
                return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'cmGrpDesc',e.target.value)} />;
            }
        },
        {
            title: '사용여부',
            key: 'D',
            dataIndex: 'useFlag',
            width:75,
            align:'center',
            render: (value,record) => {
                return <CustomCheckbox checked={value} onChange={(e) => inputChange(record,'useFlag',e.target.checked)} />;
            }

        },
        {
            title: '관리항목(문자형)',
            children: [
                {
                    title: '문자형1',
                    dataIndex: 'ref01',
                    key: 'ref01',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref01',e.target.value)}  />;
                    }
                },
                {
                    title: '문자형2',
                    dataIndex: 'ref02',
                    key: 'ref02',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref02',e.target.value)} />;
                    }
                },
                {
                    title: '문자형3',
                    dataIndex: 'ref03',
                    key: 'ref03',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref03',e.target.value)}  />;
                    }
                },
                {
                    title: '문자형4',
                    dataIndex: 'ref04',
                    key: 'ref04',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref04',e.target.value)}  />;
                    }
                },
                {
                    title: '문자형5',
                    dataIndex: 'ref05',
                    key: 'ref05',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref05',e.target.value)} />;
                    }
                },
            ],
        },

        {
            title: '관리항목(정수형)',
            children: [
                {
                    title: '정수형1',
                    dataIndex: 'ref06',
                    key: 'ref06',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref06',e.target.value)} />;
                    }
                },
                {
                    title: '정수형2',
                    dataIndex: 'ref07',
                    key: 'ref07',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref07',e.target.value)} />;
                    }
                },
                {
                    title: '정수형3',
                    dataIndex: 'ref08',
                    key: 'ref08',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref08',e.target.value)} />;
                    }
                },
                {
                    title: '정수형4',
                    dataIndex: 'ref09',
                    key: 'ref09',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref09',e.target.value)} />;
                    }
                },
                {
                    title: '정수형5',
                    dataIndex: 'ref10',
                    key: 'ref10',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref10',e.target.value)}  />;
                    }
                },
            ],
        },

        {
            title: '관리항목(실수형)',
            children: [
                {
                    title: '실수형1',
                    dataIndex: 'ref11',
                    key: 'ref11',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref11',e.target.value)} />;
                    }
                },
                {
                    title: '실수형2',
                    dataIndex: 'ref12',
                    key: 'ref12',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref12',e.target.value)} />;
                    }
                },
                {
                    title: '실수형3',
                    dataIndex: 'ref13',
                    key: 'ref14',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref13',e.target.value)} />;
                    }
                },
                {
                    title: '실수형4',
                    dataIndex: 'ref14',
                    key: 'ref14',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref14',e.target.value)} />;
                    }
                },
                {
                    title: '실수형5',
                    dataIndex: 'ref15',
                    key: 'ref15',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'ref15',e.target.value)}  />;
                    }
                },
            ],
        }
    ];


    const selectCommonGrpCodeList = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }
        callGetCommonGrpCodeList({searchText:searchFormGetValues('searchText')??''}).then((res)=> {
            res.item.map((item,index) => {
                item.unqKey = index;
            });
            setDataSource(JSON.parse(JSON.stringify(res.item)));
            setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
        });
    };

    const handleReset = async() => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 초기화 하시겠습니까?');
            if(!result) return;
            comGrpCodeReset();
            setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            selectCommonGrpCodeList();
        }
    };



    useEffect(() => {
        selectCommonGrpCodeList();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const windowHeight = window.innerHeight;
            const availableHeight = windowHeight * 0.55;
            setTableHeight(availableHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: selectCommonGrpCodeList,
                cfmSave: comGrpCodeHandleSubmit(saveCode),
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    return <>
        <section className="search-wrap">
            <form onSubmit={searchFormHandleSubmit(selectCommonGrpCodeList)}>
                <span>분류코드/명</span>
                <CustomValidFormInput name={'searchText'}
                                      placeholder="검색할 코드/명을 입력해 주세요."
                                      control={searchFormControl}
                                      onKeyPress={handleKeyPress}
                />
            </form>
        </section>

        <section className="board-wrap">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        분류코드
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small" onClick={addRow}>+ 행추가</CustomButton>
                        <CustomButton type="default" size="small" onClick={deleteRow}>행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable scroll={{ x: 1645, y: tableHeight }} rowSelection={rowSelection} columns={columns} rowKey={'unqKey'}
                                 dataSource={dataSource} rowNoFlag={true}/>
                </div>
            </div>
        </section>
    </>;
};

export default CommonGroupCodeManagement;