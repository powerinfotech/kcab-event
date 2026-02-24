import {Breadcrumb, Form, GetProps, TableColumnsType, Tree} from 'antd';
import React, {useEffect, useState} from 'react';
import {callGetMenuInfo} from '@api/auth/MenuManagementApi';
import CustomButton from '@component/CustomButton';
import CustomInput from '@component/CustomInput';
import {IudType} from '@interface/common';
import CustomCheckbox from '@component/CustomCheckbox';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';

import CustomTable, {IUD_COLUMN} from '@component/CustomTable';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import IconTitle from '@icon/IconTitle';
import IconFolder from '@icon/IconFolder';
import IconFile from '@icon/IconFile';
import {ColumnsType} from 'antd/es/table';
import {MenuType} from '@interface/auth/MenuManagement';
import {HttpStatusCode} from 'axios';


const columns1: ColumnsType<any> = [
    IUD_COLUMN,
    {
        title: '권한그룹',
        key:'A',
        dataIndex: 'A'
    },
    {
        title: '권한ID',
        key:'B',
        dataIndex: 'B',
    },
    {
        title: '권한명',
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


const columns2: TableColumnsType<any> = [
    {
        title: '조회',
        dataIndex: 'col1',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '초기화',
        dataIndex: 'col2',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '추가',
        dataIndex: 'col3',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '저장',
        dataIndex: 'col4',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타1',
        dataIndex: 'col5',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    }
    ,
    {
        title: '기타2',
        dataIndex: 'col6',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타3',
        dataIndex: 'col7',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타4',
        dataIndex: 'col8',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타5',
        dataIndex: 'col9',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타6',
        dataIndex: 'col10',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타7',
        dataIndex: 'col11',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타8',
        dataIndex: 'col12',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        title: '기타9',
        dataIndex: 'col13',
        width:75,
        align:'center',
        render: () => {
            return <CustomCheckbox />;
        }
    }
];

const data2: any[] = [];
for (let i = 0; i < 10; i++) {
    data2.push({
        key: 0,
        col1: false,
        col2: false,
        col3: false,
        col4: false,
        col5: false,
        col6: false,
        col7: false,
        col8: false,
        col9: false,
        col10: false,
        col11: false,
        col12: false,
        col13: false,
    });
}

const MenuManagement = () => {
    const [searchForm] = Form.useForm();
    const [tableHeight, setTableHeight] = useState(600);

    type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
    const { DirectoryTree } = Tree;
    const [treeData, setTreeData] = useState<any[]>();
    const userInfo = useRecoilValue(sessionInfoAtom);
    const [saveForm] = Form.useForm<any>();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<any[]>([]);
    const isAdminUser = userInfo.admYn === 'Y';
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const isEditable = isRowSelected && isAdminUser;

    const onSelect: DirectoryTreeProps['onSelect'] = (keys:any[], info) => {
        console.log('Trigger Select', keys, info);
        // saveForm.setFieldsValue()
         saveForm.resetFields();
        // saveForm.setFieldsValue(getCurrentRowDataSourceById(keys[0]));
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys:any[], info) => {
        console.log('Trigger Expand', keys, info);

    };

    const getCurrentRowDataSourceById = (id : number) => {
        return dataSource.filter((v)=>v.menuId === id)[0];
    };


    const handleDataChanged = (key:number) => {
    };


    const handleSave = async () => {

    };


    const handleSearch = () => {
        callGetMenuInfo().then((res)=> {
            if(res.code === HttpStatusCode.Ok) {
                setDataSource(JSON.parse(JSON.stringify(res.item)));
                setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
                createany(res.item);
            }
        });
    };

    const createany = (menuList:any[]) => {
        const any:any = {title:menuList[0].menuNm, key:menuList[0].menuId , icon: () => (<IconFolder />),  children:[]};
        setChild(any,  menuList[0], menuList);
        setTreeData([any]);
    }
    ;

    const setChild = (parentTreeNode:any, parentMenuObject:any, menuList:any[]) => {
        menuList.map((v:any)=> {
            if(parentMenuObject.menuId === v.upMenuId) {
                  let childTreeNode : any = {title:v.menuNm, key:v.menuId};
                 if(MenuType.V === v.menuTypeCd) {
                     childTreeNode = {
                         ...childTreeNode,
                         icon: () => (<IconFile />),
                     };
                     parentTreeNode.children?.push(childTreeNode);
                 }else if(MenuType.D === v.menuTypeCd) {

                     childTreeNode = {
                         ...childTreeNode,
                         icon: () => (<IconFolder />),
                         children: [],
                     };
                    parentTreeNode.children?.push(childTreeNode);
                    setChild(childTreeNode, v, menuList);
                }
            }
        });
    };


    useEffect(() => {
        handleSearch();

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
                <h2 className="title">권한별 메뉴관리</h2>

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
                                    <span className="txt">권한별 메뉴관리</span>
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
                <span>권한명</span>
                <CustomInput placeholder="권한명" />
                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
            </form>
        </section>

        <section className="board-wrap half-wrap type02">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        권한(역할) 정보
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable scroll={{ y: tableHeight }} rowKey={'id'} pagination={false} rowNoFlag={true} columns={columns1} dataSource={data1}/>
                </div>
            </div>

            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        메뉴권한
                    </h3>
                </div>
                <div className="board-cont-wrap box-flex">
                    <div className='box-tree'>
                        {treeData?
                            <DirectoryTree
                                showLine
                                multiple
                                defaultExpandAll
                                showIcon={true}
                                onSelect={onSelect}
                                onExpand={onExpand}
                                treeData={treeData}
                            />
                        :<></>}
                    </div>

                    <div>
                        <CustomTable scroll={{ x: 808 }}  columns={columns2} dataSource={data2} rowNoFlag={false}/>

                    </div>
                </div>
            </div>
        </section>
    </>;
};

export default MenuManagement;