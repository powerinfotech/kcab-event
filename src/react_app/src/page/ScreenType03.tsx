import {Breadcrumb, Table, TableProps} from 'antd';
import React, {useEffect, useState} from 'react';
import CustomButton from '@component/CustomButton';
import {IudType} from '@interface/common';
import CustomCheckbox from '@component/CustomCheckbox';
import {ColumnsType} from 'antd/es/table';

import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import IconTitle from '@icon/IconTitle';

const MenuManagement = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [tableHeight, setTableHeight] = useState(600);

    type TableRowSelection<T> = TableProps<T>['rowSelection'];

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<any> = {
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


    const columns1: ColumnsType<any> = [
        IUD_COLUMN,
        {
            title: '권한그룹ID',
            key:'A',
            dataIndex: 'A'
        },
        {
            title: '권한그룹명',
            key:'B',
            dataIndex: 'B',
        },
        {
            title: '설명',
            key:'C',
            dataIndex: 'C',
        },
        {
            title: '사용여부',
            key: 'D',
            dataIndex: 'D',
            width:75,
            align:'center',
            render: () => {
                return <CustomCheckbox />;
            }

        }
    ];

    const data1:any[] = [
        {
            id: 0,
            A: '추가',
            B: '',
            C: '',
            iudType:IudType.I
        },
        {
            id: 1,
            A: '수정',
            B: '',
            C: '',
            iudType:IudType.U

        },
        {
            id: 2,
            A: '삭제',
            B: '',
            C: '',
            iudType:IudType.D
        },
        {
            id: 4,
            A: '',
            B: '',
            C: '',
            iudType:undefined
        },
    ];

    const columns2: ColumnsType<any> = [
        IUD_COLUMN,
        {
            title: '권한ID',
            key:'A',
            dataIndex: 'A'
        },
        {
            title: '권한명',
            key:'B',
            dataIndex: 'B',
        },
        {
            title: '권한설명',
            key:'C',
            dataIndex: 'C',
        },
        {
            title: '사용여부',
            key: 'D',
            dataIndex: 'D',
            width:75,
            align:'center',
            render: () => {
                return <CustomCheckbox />;
            }

        }
    ];

    const data2:any[] = [
        {
            id: 0,
            A: '추가',
            B: '',
            C: '',
            iudType:IudType.I
        },
        {
            id: 1,
            A: '수정',
            B: '',
            C: '',
            iudType:IudType.U

        },
        {
            id: 2,
            A: '삭제',
            B: '',
            C: '',
            iudType:IudType.D
        },
        {
            id: 4,
            A: '',
            B: '',
            C: '',
            iudType:undefined
        },
    ];

    const columns3: ColumnsType<any> = [
        IUD_COLUMN,
        {
            title: '사용자ID',
            key:'A',
            dataIndex: 'A'
        },
        {
            title: '사용자명',
            key:'B',
            dataIndex: 'B',
        },
        {
            title: '사용여부',
            key: 'C',
            dataIndex: 'C',
            width:75,
            align:'center',
            render: () => {
                return <CustomCheckbox />;
            }
        },
        {
            title: '시작일',
            key:'D',
            dataIndex: 'D',
            align:'center',
            width:95
        },
        {
            title: '종료일',
            key:'E',
            dataIndex: 'E',
            align:'center',
            width:95
        },
    ];

    const data3:any[] = [
        {
            id: 0,
            A: '추가',
            B: '',
            iudType:IudType.I,
            D: '2024-05-15',
            E: '2024-05-15'
        },
        {
            id: 1,
            A: '수정',
            B: '',
            iudType:IudType.I,
            D: '2024-05-15',
            E: '2024-05-15'
        },
        {
            id: 2,
            A: '삭제',
            B: '',
            iudType:IudType.I,
            D: '2024-05-15',
            E: '2024-05-15'
        },
        {
            id: 4,
            A: '',
            B: '',
            iudType:IudType.I,
            D: '2024-05-15',
            E: '2024-05-15'
        },
    ];

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

    return <>
        <section className="title-wrap">
            <div className="box-flex">
                <h2 className="title">권한관리</h2>

                <Breadcrumb
                    separator={[
                        (<><IconStepArrow /></>)
                    ]}
                    className="bread-crumb"
                    items={[
                        {
                            href: '',
                            title: (
                                <>
                                    <IconHome />
                                    <span className="txt">시스템</span>
                                </>
                            ),
                        },
                        {
                            title: (
                                <>
                                    <span className="txt">권한관리</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>

            <div className="box-btn">
                <CustomButton type="primary"><IconBtnRefresh />초기화</CustomButton>
                <CustomButton type="primary"><IconBtnSearch />조회</CustomButton>
                <CustomButton type="primary">저장</CustomButton>
            </div>
        </section>

        <section className="board-wrap half-wrap type03">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        권한그룹정보
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small">+ 행추가</CustomButton>
                        <CustomButton type="default" size="small">행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable scroll={{ x: 790, y: tableHeight }} rowSelection={rowSelection} rowKey={'id'} pagination={false} rowNoFlag={true} columns={columns1} dataSource={data1}/>
                </div>
            </div>

            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        권한역할정보
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small">+ 행추가</CustomButton>
                        <CustomButton type="default" size="small">행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable scroll={{ x: 790, y: tableHeight }} rowSelection={rowSelection} rowKey={'id'} pagination={false} rowNoFlag={true} columns={columns2} dataSource={data2}/>
                </div>

                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        사용자정보
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small">인원추가</CustomButton>
                        <CustomButton type="default" size="small">행삭제</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable scroll={{ x: 790, y: tableHeight }} rowSelection={rowSelection} rowKey={'id'} pagination={false} rowNoFlag={true} columns={columns3} dataSource={data3}/>
                </div>
            </div>
        </section>
    </>;
};

export default MenuManagement;