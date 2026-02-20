import {message, Table, TableColumnsType, TableProps} from 'antd';
import React, {useEffect, useState} from 'react';
import CustomButton from '@component/CustomButton';
import {IudType} from '@interface/common';
import CustomCheckbox from '@component/CustomCheckbox';

import CustomInput from '@component/CustomInput';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import IconBtnSearch from '@icon/IconBtnSearch';
import IconTitle from '@icon/IconTitle';
import {
    callGetCommonCodeList,
    callGetCommonGrpCodeList,
    callSetCommonCodeList
} from '@api/master/CommonCodeManagementApi';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import {useMessage} from '@hook/useMessage';
import {CommonCodeListItem} from '@interface/master/CommonCodeManagement';
import {CommonGepCodeSearchParam, CommonGrpCodeListItem} from '@interface/master/CommonGroupCodeManagement';
import {useForm} from 'react-hook-form';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import {HttpStatusCode} from 'axios';

const CommonCodeManagement = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchComGrpCdSeq,setSearchComGrpCdSeq] = useState<number|undefined>(undefined);
    const [searchGrpCd,setSearchGrpCd] = useState<string>('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const [commonGroupCodeDataSource, setCommonGroupCodeDataSource] = useState<CommonGrpCodeListItem[]>([]);
    const [commonCodeDataSource, setCommonCodeDataSource] = useState<CommonCodeListItem[]>([]);
    const [orgCommonCodeDataSource, setOrgCommonCodeDataSource] = useState<CommonCodeListItem[]>([]);
    // const [selectedGroupCodeRowIndex, setSelectedGroupCodeRowIndex] = useState(-1);
    // const [selectedCodeRowIndex, setSelectedCodeRowIndex] = useState(-1);
    const {getValues: searchFormGetValues} = useForm<CommonGepCodeSearchParam>({mode:'all'});
    const {confirm} = useMessage();
    const isChangedDataSource = commonCodeDataSource.some((v)=>v.iudType);
    type TableRowSelection<T> = TableProps<T>['rowSelection'];
    const{register: comCodeRegister
        , unregister: comCodeUnregister
        , control: comCodeControl
        , handleSubmit: comCodeHandleSubmit
        , getValues: comCodeGetValues
        , setValue: comCodeSetValue
    } = useForm<any>({mode:'onSubmit'});
    const addRow = () => {
        if(selectedRowIndex === -1)
        {
            message.info('분류코드를 선택하세요.');
            return;
        }
        const unqList = commonCodeDataSource?.map((item)=>{return item.unqKey;});
        const sortList = commonCodeDataSource?.filter(item => item.iudType !== IudType.D).map((item)=>{return item.sortSeq;});
        const addObject : CommonCodeListItem = {
            cmCd :'',
            cmNm :'',
            cmDesc :'',
            comGrpCdSeq:searchComGrpCdSeq,
            cmGrpCd:searchGrpCd,
            useFlag :false,
            refval01 :'',
            refval02 :'',
            refval03 :'',
            refval04 :'',
            refval05 :'',
            refval06 :'',
            refval07 :'',
            refval08 :'',
            refval09 :'',
            refval10 :'',
            refval11 :'',
            refval12 :'',
            refval13 :'',
            refval14 :'',
            refval15 :'',
            iudType:IudType.I,
            unqKey:unqList && unqList.length > 0?Math.max(...unqList) +1:0,
            sortSeq:sortList && sortList.length >0?Math.max(...sortList) +1:0
        };
        if (commonCodeDataSource.length > 0) {
            setCommonCodeDataSource(commonCodeDataSource.concat([addObject]));
        } else {
            setCommonCodeDataSource([addObject]);
        }
    };

    const deleteRow = () => {
        if(commonCodeDataSource.filter((v)=>selectedRowKeys.includes(v.unqKey, 0)).length == 0)
        {
            message.info('선택한 내용이 없습니다.');
            return;
        }
        commonCodeDataSource.filter((v)=>selectedRowKeys.includes(v.unqKey, 0)).forEach((v)=> {
            comCodeUnregister(`${v.unqKey}_cmCd`);
            comCodeUnregister(`${v.unqKey}_cmNm`);
        });
        const deleteData : CommonCodeListItem[]= [];
        commonCodeDataSource.forEach((item) => {
            const copyItem = {...item};
            if (selectedRowKeys.includes(copyItem.unqKey)) {
                copyItem.iudType = IudType.D;
            }

            if (!(copyItem.iudType === IudType.D && !item.comCdSeq)) {
                deleteData.push(copyItem);
            }
        });
        setCommonCodeDataSource(deleteData);
        setSelectedRowKeys([]);
    };

    const inputChange = (record:CommonCodeListItem, columns:string, value:string|boolean) => {
        commonCodeDataSource.map((item:any) => {
            if (record.unqKey === item.unqKey) {
                if(columns === "cmCd" || columns ==="cmNm") {
                    if(commonCodeDataSource.filter((v) => record.unqKey === v.unqKey)[0][columns] !== value){
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

        setCommonCodeDataSource([...commonCodeDataSource]);
    };

    const saveCode = async  (value: CommonCodeListItem)  => {
        if(!isChangedDataSource)
        {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        const result = await confirm('저장 하시겠습니까?');
        if(result) {
            callSetCommonCodeList(commonCodeDataSource).then((res) => {
                if (res.code === HttpStatusCode.Ok) {
                    message.success('저장이 완료 되었습니다.');
                    commonCodeDataSource.forEach((v) => {
                        comCodeUnregister(`${v.comCdSeq}_cmCd`);
                        comCodeUnregister(`${v.comCdSeq}_cmNm`);
                    });
                    selectCommonCodeList(searchComGrpCdSeq ?? -1);
                }


            });
        };
    };


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<CommonCodeListItem> = {
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

    const commonGrpCodecolumns: TableColumnsType<CommonGrpCodeListItem> = [
        {
            title: '분류코드',
            dataIndex: 'cmGrpCd',
            key: 'cmGrpCd',
            width:100,
            align:'center',
        },
        {
            title: '분류명',
            dataIndex: 'cmGrpNm',
            key: 'cmGrpNm',
            width:100,
            align:'center',
            render: (value, record) => {
                return (
                    <div style={{ textAlign: 'left' }}>
                        {record.cmGrpNm}
                    </div>
                );
            }
        },
    ];

    const commonCodeColumns: TableColumnsType<CommonCodeListItem> = [
        IUD_COLUMN,
        {
            title: (
                <span>
                공통코드 <span style={{color: 'red'}}>*</span>
                </span>
            ),
            dataIndex: 'cmCd',
            key: 'cmCd',
            width:100,
            align:'center',
            render: (value,record) => {
                if (record.comCdSeq) {
                    return value;
                } else {
                return (
                    <CustomValidFormInput
                       control={comCodeControl}
                       required={true}
                       maxLength={20}
                       regExp={{value:/^[a-zA-Z0-9_]*$/, message:'공통코드는 영문, 숫자, 특수문자(_)만 입력가능합니다.'}}
                       onChangeValue={(e) => inputChange(record, 'cmCd', e)}
                       {...comCodeRegister(`${record.unqKey}_cmCd`, {required:'공통코드는 필수입력입니다.'})}/>
                );
                }
            }
        },
        {
            title: (
                <span>
                코드명 <span style={{color: 'red'}}>*</span>
                </span>
            ),
            dataIndex: 'cmNm',
            key: 'cmNm',
            width:180,
            align:'center',
            render: (value,record) => {
                return (
                <>
                     {comCodeSetValue(`${record.unqKey}_cmNm`, value)}
                    <CustomValidFormInput
                       control={comCodeControl}
                       required={true}
                       maxLength={100}
                       onChangeValue={(e) => inputChange(record, 'cmNm', e)}
                       {...comCodeRegister(`${record.unqKey}_cmNm`, {required:'코드명은 필수입력입니다.'})}/>
                </>
                );
            }
        },
        {
            title: '설명',
            dataIndex: 'cmDesc',
            key: 'cmDesc',
            width:200,
            align:'center',
            render: (value,record) => {
                return <CustomInput value={value} maxLength={2000} onChange={(e) => inputChange(record,'cmDesc',e.target.value)} />;
            }
        },
        {
            title: '조회순서',
            dataIndex: 'sortSeq',
            key: 'sortSeq',
            width:100,
            align:'center',
            render: (value,record) => {
                return <CustomInput value={value} maxLength={10} style={{ textAlign: 'right' }} onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    inputChange(record,'sortSeq',numericValue);
                }} />;
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
                    dataIndex: 'refval01',
                    key: 'refval01',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval01',e.target.value)}  />;
                    }
                },
                {
                    title: '문자형2',
                    dataIndex: 'refval02',
                    key: 'refval02',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval02',e.target.value)} />;
                    }
                },
                {
                    title: '문자형3',
                    dataIndex: 'refval03',
                    key: 'refval03',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval03',e.target.value)}  />;
                    }
                },
                {
                    title: '문자형4',
                    dataIndex: 'refval04',
                    key: 'refval04',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval04',e.target.value)}  />;
                    }
                },
                {
                    title: '문자형5',
                    dataIndex: 'refval05',
                    key: 'refval05',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval05',e.target.value)} />;
                    }
                },
            ],
        },

        {
            title: '관리항목(정수형)',
            children: [
                {
                    title: '정수형1',
                    dataIndex: 'refval06',
                    key: 'refval06',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval06',e.target.value)} />;
                    }
                },
                {
                    title: '정수형2',
                    dataIndex: 'refval07',
                    key: 'refval07',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval07',e.target.value)} />;
                    }
                },
                {
                    title: '정수형3',
                    dataIndex: 'refval08',
                    key: 'refval08',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval08',e.target.value)} />;
                    }
                },
                {
                    title: '정수형4',
                    dataIndex: 'refval09',
                    key: 'refval09',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval09',e.target.value)} />;
                    }
                },
                {
                    title: '정수형5',
                    dataIndex: 'refval10',
                    key: 'refval10',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval10',e.target.value)}  />;
                    }
                },
            ],
        },

        {
            title: '관리항목(실수형)',
            children: [
                {
                    title: '실수형1',
                    dataIndex: 'refval11',
                    key: 'refval11',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval11',e.target.value)} />;
                    }
                },
                {
                    title: '실수형2',
                    dataIndex: 'refval12',
                    key: 'refval12',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval12',e.target.value)} />;
                    }
                },
                {
                    title: '실수형3',
                    dataIndex: 'refval13',
                    key: 'refval14',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval13',e.target.value)} />;
                    }
                },
                {
                    title: '실수형4',
                    dataIndex: 'refval14',
                    key: 'refval14',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval14',e.target.value)} />;
                    }
                },
                {
                    title: '실수형5',
                    dataIndex: 'refval15',
                    key: 'refval15',
                    width: 100,
                    align:'center',
                    render: (value,record) => {
                        return <CustomInput value={value} maxLength={100} onChange={(e) => inputChange(record,'refval15',e.target.value)}  />;
                    }
                },
            ],
        }
    ];

    const handleCodeRowSelection = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 초기화 하시겠습니까?');
            if(!result) return result;
        }

        setCommonCodeDataSource(JSON.parse(JSON.stringify(orgCommonCodeDataSource)));
        setOrgCommonCodeDataSource(JSON.parse(JSON.stringify(orgCommonCodeDataSource)));
        return true;
    };

    const selectCommonCodeList = async (searchComGrpCdSeq:number)=> {
        const data = await callGetCommonCodeList({
            comGrpCdSeq:searchComGrpCdSeq
        });
        data.item.map((item,index) => {
            item.unqKey = index;
        });
        setCommonCodeDataSource(JSON.parse(JSON.stringify(data.item)));
        setOrgCommonCodeDataSource(JSON.parse(JSON.stringify(data.item)));
    };

    const selectCommonGrpCodeList = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }
        const data = await callGetCommonGrpCodeList({searchText:searchFormGetValues('searchText')??''});
        data.item.map((item,index) => {
            item.unqKey = index;
        });
        if (data.item && data.item.length > 0) {
            setCommonGroupCodeDataSource(JSON.parse(JSON.stringify(data.item)));
        }
        setSearchComGrpCdSeq(undefined);
        setSelectedRowIndex(-1);
        setCommonCodeDataSource([]);
        setSelectedRowKeys([]);
    };


    useEffect(() => {
        if (searchComGrpCdSeq) {
            selectCommonCodeList(searchComGrpCdSeq);
        }
    }, [searchComGrpCdSeq]);

    useEffect(() => {
        selectCommonGrpCodeList();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const windowHeight = window.innerHeight;
            const availableHeight = windowHeight * 0.55;
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <>
        <section className="button-wrap">
            <div className="box-btn">
                <CustomButton type="primary" onClick={()=>handleCodeRowSelection()}><IconBtnRefresh />초기화</CustomButton>
                <CustomButton type="primary" onClick={selectCommonGrpCodeList}><IconBtnSearch />조회</CustomButton>
                <CustomButton type="primary" onClick={comCodeHandleSubmit(saveCode)}>저장</CustomButton>
            </div>
        </section>

        <section className="board-wrap half-wrap type02">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        분류코드
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    {/* rowSelected 에 예제로 만들어둠*/}
                    <CustomTable onRow={(recode:CommonGrpCodeListItem, index?:number) => {
                        return {
                            onClick: () => {
                                return new Promise((resolve) => {
                                    if(commonCodeDataSource.some((v)=> v.iudType)) {
                                        confirm('저장하지 않은 공통코드 정보는 초기화 됩니다. 계속 진행하시겠습니까?').then((res) => {
                                            if (res) {
                                                setSearchComGrpCdSeq(recode.comGrpCdSeq);
                                                setSearchGrpCd(recode.cmGrpCd);
                                                setSelectedRowIndex(index??-1);
                                                setSelectedRowKeys([]);
                                            }
                                            resolve(res);
                                        });
                                    } else {
                                        setSearchComGrpCdSeq(recode.comGrpCdSeq);
                                        setSearchGrpCd(recode.cmGrpCd);
                                        setSelectedRowIndex(index??-1);
                                        setSelectedRowKeys([]);
                                        resolve(true);
                                    }
                                });
                            },
                        };
                    }} columns={commonGrpCodecolumns} rowKey={'unqKey'} dataSource={commonGroupCodeDataSource} rowNoFlag={true} selectedRowIndex={selectedRowIndex}/>
                </div>
            </div>
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        공통코드
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small" onClick={addRow}>+ 행추가</CustomButton>
                        <CustomButton type="default" size="small" onClick={deleteRow}>행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable rowSelection={rowSelection} columns={commonCodeColumns} rowKey={'unqKey'} dataSource={commonCodeDataSource} rowNoFlag={true}/>
                </div>
            </div>
        </section>
    </>;
};

export default CommonCodeManagement;