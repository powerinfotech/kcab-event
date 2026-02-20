import {Form, GetProps, Radio, Table, TableColumnsType, TableProps, Tree, TreeDataNode} from 'antd';
import React, {useState} from 'react';
import {useLoading} from '@hook/useLoading';
import CustomButton from '@component/CustomButton';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomInput from '@component/CustomInput';
import CustomSelect from '@component/CustomSelect';
import CustomDatePicker from '@component/CustomDatePicker';
import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import TestPopup from '@page/TestPopup';
import {IudType} from '@interface/common';
import {ColumnsType} from 'antd/es/table';
import {useMessage} from '@hook/useMessage';


type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

interface DataType2 {
    key: React.Key;
    col1: string;
    col2: boolean;
    col3: string;
    col4: boolean;
    col5: string;
    col6: string;
    col7: string;
    col8: boolean;
    col9: string;
    col10: boolean;
    col11: string;
}



export interface DataType3  {
    id: number;
    userId: string;
    userName: string;
    userNameEng: string;
    useFlag?: boolean;
    iudType?:IudType;
}



interface DataType4 {
    key: React.Key;
    name: string;
    age: number;
    street: string;
    building: string;
    number: number;
    companyAddress: string;
    companyName: string;
    gender: string;
}


const columns: TableColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

const columns2: TableColumnsType<DataType> = [
    {
        title: '기본버튼(권한설정)',
        dataIndex: 'col1',
        colSpan: 5
    },
    {
        dataIndex: 'col2',
        colSpan:0,
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        dataIndex: 'col3',
        colSpan:0,
    },
    {
        dataIndex: 'col4',
        colSpan:0,
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        dataIndex: 'col5',
        colSpan:0,
    }
    ,
    {
        title: '커스텀버튼(권한설정)',
        dataIndex: 'col6',
        colSpan: 5
    },
    {
        dataIndex: 'col7',
        colSpan: 0
    },
    {
        dataIndex: 'col8',
        colSpan:0,
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        dataIndex: 'col9',
        colSpan:0,
    },
    {
        dataIndex: 'col10',
        colSpan:0,
        render: () => {
            return <CustomCheckbox />;
        }
    }
    ,
    {
        dataIndex: 'col11',
    }
];

const columns3: ColumnsType<DataType3> = [
    IUD_COLUMN,
    {
        title: '사용자ID',
        key:'userId',
        dataIndex: 'userId'
    },
    {
        title: '성명',
        key:'userName',
        dataIndex: 'userName',
        align: 'center',
        width: '60px',
    },
    {
        title: '성명(영어)',
        key:'userNameEng',
        dataIndex: 'userNameEng',
    },
    {
        title: '사용여부',
        key: 'useFlag',
        dataIndex: 'useFlag',
        render: () => {
            return <CustomCheckbox />;
        }

    }
];

const columns4: TableColumnsType<DataType4> = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        fixed: 'left'
    },
    {
        title: 'Other',
        children: [
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: 150
            },
            {
                title: 'Address',
                children: [
                    {
                        title: 'Street',
                        dataIndex: 'street',
                        key: 'street',
                        width: 150,
                    },
                    {
                        title: 'Block',
                        children: [
                            {
                                title: 'Building',
                                dataIndex: 'building',
                                key: 'building',
                                width: 100,
                            },
                            {
                                title: 'Door No.',
                                dataIndex: 'number',
                                key: 'number',
                                width: 100,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        title: 'Company',
        children: [
            {
                title: 'Company Address',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
                width: 200,
            },
            {
                title: 'Company Name',
                dataIndex: 'companyName',
                key: 'companyName',
            },
        ],
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: 80,
        fixed: 'right',
    },
];


const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    });
}

const data2: DataType2[] = [];
for (let i = 0; i < 10; i++) {
    data2.push({
        key: 0,
        col1: '초기화',
        col2: false,
        col3: '사용',
        col4: false,
        col5: '미사용',
        col6: '초기화',
        col7: '초기화',
        col8: false,
        col9: '사용',
        col10: false,
        col11: '미사용',
    });
}

const data3:DataType3[] = [
    {
        id: 0,
        userId: '추가',
        userName: 'a',
        userNameEng: 'a',
        iudType:IudType.I
    },
    {
        id: 1,
        userId: '수정',
        userName: 'b',
        userNameEng: 'b',
        iudType:IudType.U

    }
    ,
    {
        id: 2,
        userId: '삭제',
        userName: 'c',
        userNameEng: 'c',
        iudType:IudType.D
    },
    {
        id: 4,
        userId: '',
        userName: 'd',
        userNameEng: 'd',
        iudType:undefined
    },
];

const data4: DataType4[] = [];
for (let i = 0; i < 50; i++) {
    data4.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
    });
}

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
    {
        title: 'parent 0',
        key: '0-0',
        children: [
            { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
            { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
        ],
    },
    {
        title: 'parent 1',
        key: '0-1',
        children: [
            { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
            { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
        ],
    },
];

const Template = () => {
    const [searchForm] = Form.useForm();
    const [saveForm] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const loading = useLoading();
    const [isOpen, setIsOpen] = useState(false);
    const {confirm} = useMessage();

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };


    const rowSelection: TableRowSelection<DataType> = {
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

    const showLoading = () => {
        loading.add('1');
        setTimeout(() => {
            loading.clear();
        }, 1000);
    };


    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        console.log('Trigger Select', keys, info);
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        console.log('Trigger Expand', keys, info);
    };


    const save = (value: any) => {
        console.log(value);

    };

    const handleTest = () => {
        setIsOpen(true);
    };


    const handleConfirm = async () => {
       const result = await confirm('저장하실래요?');
       console.log(result);
    };

    return <>
        <h2 className="title">사용자관리</h2>
        <section className={'section'}>
            <h3 className="title">검색영역</h3>
            <Form form={searchForm} name="searchFrom" layout="inline" onFinish={() => {
            }}>
                <Form.Item
                    name="text"
                    label="검색어"
                    rules={[
                        {
                            required: true,
                            message: '필수입력 항목입니다.',
                        },
                    ]}
                >
                    <CustomInput placeholder="검색어 입력" style={{width: 250, margin: '0 8px'}}/>
                </Form.Item>
                <CustomButton type="primary" htmlType="submit">
                    검색
                </CustomButton>
                <CustomButton type="default" onClick={() => {
                    handleTest();
                }}>{'팝업오픈'}</CustomButton>
                <CustomButton type="default" onClick={() => {
                    handleConfirm();
                }}>{'Confirm'}</CustomButton>
            </Form>

        </section>

        <section className="section">
            <h3 className="title">저장영역</h3>
            <Form form={saveForm} onFinish={save} name="saveForm">
                <Form.Item
                    label="필수 체크"
                    name="checkName"
                    rules={[
                        {
                            required: true,
                            message: '필수체크 항목입니다.',
                        },
                    ]}
                >
                    <CustomCheckbox title={'필수체크'}
                                    onChange={(p) => {
                                        p.target.checked ? saveForm.setFieldsValue({checkName: p.target.checked}) : saveForm.setFieldsValue({checkName: null});
                                    }}/>
                </Form.Item>
                <Form.Item
                    label="필수입력"
                    name="input_name1"
                    rules={[
                        {
                            required: true,
                            message: '필수입력 사항입니다.',
                        },
                    ]}
                >
                    <CustomInput type={'text'} style={{width: '120px'}}/>
                </Form.Item>
                <Form.Item
                    label="필수 날짜 선택"
                    name="picker_name1"
                    rules={[
                        {
                            required: true,
                            message: '필수입력 사항입니다.',
                        },
                    ]}
                >
                    <CustomDatePicker style={{width: '150px'}}/>
                </Form.Item>

                <Form.Item
                    label="필수 선택"
                    name="select_name1"
                    rules={[
                        {
                            required: true,
                            message: '필수입력 사항입니다.',
                        },
                    ]}
                >
                    <CustomSelect style={{width: 120}}
                                  placeholder="선택해 주세용"
                                  options={[
                                      {value: 'jack', label: 'Jack'},
                                      {value: 'lucy', label: 'Lucy'},
                                      {value: 'Yiminghe', label: 'yiminghe'},
                                      {value: 'disabled', label: 'Disabled', disabled: true},
                                  ]}
                    />
                </Form.Item>

                <Form.Item
                    label="필수 선택"
                    name="radio_name1"
                    rules={[
                        {
                            required: true,
                            message: '필수선택 사항입니다.',
                        },
                    ]}
                >
                    <Radio.Group onChange={() => {
                    }}>
                        <Radio value={1}>A</Radio>
                        <Radio value={2}>B</Radio>
                        <Radio value={3}>C</Radio>
                        <Radio value={4}>D</Radio>
                    </Radio.Group>
                </Form.Item>
                <CustomButton type="default" onClick={() => {
                    saveForm.submit();
                }}>{'저장'}</CustomButton>
                <CustomButton type={'default'} onClick={showLoading}>{'로딩바 1초'}</CustomButton>
            </Form>
        </section>

        <div className={'mb10'}>
            <h3 className="title">테이블</h3>
            <CustomTable rowSelection={rowSelection} columns={columns} dataSource={data} rowNoFlag={true}/>
        </div>


        <div className={'mb10'}>
            <h3 className="title">트리</h3>
            <DirectoryTree
                multiple
                defaultExpandAll
                onSelect={onSelect}
                onExpand={onExpand}
                treeData={treeData}
            />
        </div>


        <div className={'mb10'}>
            <h3 className="title">테이블</h3>
            <CustomTable columns={columns2} dataSource={data2} rowNoFlag={false}/>
        </div>


        <div className={'mb10'}>
            <h3 className="title">테이블</h3>
            <CustomTable rowKey={'id'} pagination={false} rowNoFlag={true} columns={columns3}
                         dataSource={data3}/>
        </div>
        

        <div className={'mb10'}>
            <h3 className="title">테이블</h3>
            <CustomTable rowKey={'id'} columns={columns4}  bordered
                         size="middle"
                         scroll={{ x: 'calc(700px + 50%)', y: 240 }}
                         dataSource={data4}/>
        </div>
        <TestPopup open={isOpen} title={'Test Title'} style={{minWidth: '800px'}} onOk={() => setIsOpen(false)}
                   onCancel={() => setIsOpen(false)}/>
    </>
        ;

};
export default Template;