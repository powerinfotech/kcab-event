import {Breadcrumb, Form, Table, TableColumnsType, TableProps} from 'antd';
import React, {useEffect, useState} from 'react';
import CustomButton from '@component/CustomButton';
import {IudType} from '@interface/common';
import CustomCheckbox from '@component/CustomCheckbox';

import CustomInput from '@component/CustomInput';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import IconTitle from '@icon/IconTitle';

interface DataType4 {
    key: React.Key;

    A: string;
    B: string;
    C: string;
    D: string;



    F01: string;
    F02: string;
    F03: string;
    F04: string;
    F05: string;

    G01: string;
    G02: string;
    G03: string;
    G04: string;
    G05: string;

    H01: string;
    H02: string;
    H03: string;
    H04: string;
    H05: string;

    useFlag?: boolean;
    iudType?:IudType;
}

const MenuManagement = () => {
    const [searchForm] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [tableHeight, setTableHeight] = useState(600);

    type TableRowSelection<T> = TableProps<T>['rowSelection'];

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType4> = {
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


    const columns4: TableColumnsType<DataType4> = [
        IUD_COLUMN,
        {
            title: '공통코드',
            dataIndex: 'A',
            key: 'A',
            width:80,
            align:'center'
        },
        {
            title: '코드명',
            dataIndex: 'B',
            key: 'B',
        },
        {
            title: '설명',
            dataIndex: 'C',
            key: 'C',
            width:200,
        },
        {
            title: '조회순서',
            dataIndex: 'D',
            key: 'D',
            width:75,
        },
        {
            title: '사용여부',
            key: 'E',
            dataIndex: 'E',
            width:75,
            align:'center',
            render: () => {
                return <CustomCheckbox />;
            }

        },


        {
            title: '관리항목(문자형)',
            children: [
                {
                    title: '문자형1',
                    dataIndex: 'F01',
                    key: 'F01',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '문자형2',
                    dataIndex: 'F02',
                    key: 'F02',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '문자형3',
                    dataIndex: 'F03',
                    key: 'F03',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '문자형4',
                    dataIndex: 'F04',
                    key: 'F04',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '문자형5',
                    dataIndex: 'F05',
                    key: 'F05',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
            ],
        },

        {
            title: '관리항목(정수형)',
            children: [
                {
                    title: '정수형1',
                    dataIndex: 'G01',
                    key: 'G01',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '정수형2',
                    dataIndex: 'G02',
                    key: 'G02',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '정수형3',
                    dataIndex: 'G03',
                    key: 'G03',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '정수형4',
                    dataIndex: 'G04',
                    key: 'G04',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '정수형5',
                    dataIndex: 'G05',
                    key: 'G05',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
            ],
        },

        {
            title: '관리항목(실수형)',
            children: [
                {
                    title: '실수형1',
                    dataIndex: 'H01',
                    key: 'H01',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '실수형2',
                    dataIndex: 'H02',
                    key: 'H02',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '실수형3',
                    dataIndex: 'H03',
                    key: 'H03',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '실수형4',
                    dataIndex: 'H04',
                    key: 'H04',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
                {
                    title: '실수형5',
                    dataIndex: 'H05',
                    key: 'H05',
                    width: 75,
                    align:'center',
                    render: () => {
                        return <CustomInput className='small' />;
                    }
                },
            ],
        }
    ];

    const data4: DataType4[] = [];
    for (let i = 0; i < 30; i++) {
        data4.push({
            key: i,
            A: '101',
            B: '종료29',
            C: '',
            D: '',

            F01: '',
            F02: '',
            F03: '',
            F04: '',
            F05: '',

            G01: '',
            G02: '',
            G03: '',
            G04: '',
            G05: '',

            H01: '',
            H02: '',
            H03: '',
            H04: '',
            H05: '',


            iudType:IudType.I
        });
    }

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
                <h2 className="title">산정보 관리</h2>

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
                            href: '',
                            title: (
                                <>
                                    <span className="txt">공통코드</span>
                                </>
                            ),
                        },
                        {
                            title: (
                                <>
                                    <span className="txt">산정보 관리</span>
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

        <section className="search-wrap">
            <form>
                <span>코드/코드명</span>
                <CustomInput placeholder="코드/코드명" />
                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
            </form>
        </section>

        <section className="board-wrap">
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
                <CustomTable className='table-type-inp' scroll={{ x: 1800, y: tableHeight }} rowSelection={rowSelection} columns={columns4} rowKey={'id'} dataSource={data4} rowNoFlag={true}/>
                </div>
            </div>
        </section>
    </>;
};

export default MenuManagement;