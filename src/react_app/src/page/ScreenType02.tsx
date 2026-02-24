import {Breadcrumb, Form, GetProps, Radio, TableColumnsType, Tree} from 'antd';
import React, {useEffect, useState} from 'react';
import {callGetMenuInfo} from '@api/auth/MenuManagementApi';
import {MenuTree, MenuType} from '@interface/auth/MenuManagement';
import CustomButton from '@component/CustomButton';
import CustomInput from '@component/CustomInput';
import {IudType} from '@interface/common';
import CustomDatePicker from '@component/CustomDatePicker';
import CustomCheckbox from '@component/CustomCheckbox';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';

import CustomTable from '@component/CustomTable';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import IconTitle from '@icon/IconTitle';
import IconFolder from '@icon/IconFolder';
import IconFile from '@icon/IconFile';
import {useForm} from 'react-hook-form';
import {HttpStatusCode} from 'axios';


const columns2: TableColumnsType<any> = [
    {
        title: '기본버튼(권한설정)',
        dataIndex: 'col1',
        colSpan: 5
    },
    {
        dataIndex: 'col2',
        colSpan:0,
        width:40,
        render: () => {
            return <CustomCheckbox />;
        },
    },
    {
        dataIndex: 'col3',
        colSpan:0,
        width:70,
        align:'center'
    },
    {
        dataIndex: 'col4',
        colSpan:0,
        width:40,
        render: () => {
            return <CustomCheckbox />;
        },
    },
    {
        dataIndex: 'col5',
        colSpan:0,
        width:70,
        align:'center'
    }
    ,
    {
        title: '커스텀버튼(권한설정)',
        dataIndex: 'col6',
        colSpan: 6
    },
    {
        dataIndex: 'col7',
        colSpan: 0
    },
    {
        dataIndex: 'col8',
        colSpan:0,
        width:40,
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        dataIndex: 'col9',
        colSpan:0,
        width:70,
        align:'center'
    },
    {
        dataIndex: 'col10',
        colSpan:0,
        width:40,
        render: () => {
            return <CustomCheckbox />;
        }
    },
    {
        dataIndex: 'col11',
        colSpan:0,
        width:70,
        align:'center'
    }
];

const data2: any[] = [];
for (let i = 0; i < 10; i++) {
    data2.push({
        key: 0,
        col1: '초기화',
        col2: false,
        col3: '사용',
        col4: false,
        col5: '미사용',
        col6: '초기화',
        col7: '',
        col8: false,
        col9: '사용',
        col10: false,
        col11: '미사용',
    });
}

const columns3: TableColumnsType<any> = [
    {
        title: '기본버튼(권한설정)',
        dataIndex: 'col1',
        colSpan: 3
    },
    {
        dataIndex: 'col2',
        colSpan:0,
        width:100,
        align:'center',
        render: () => {
            return <>
                <CustomCheckbox /> 사용
            </>;
        },
    },
    {
        dataIndex: 'col3',
        colSpan:0,
        width:100,
        align:'center',
        render: () => {
            return <>
                <CustomCheckbox /> 미사용
            </>;
        },
    },
    {
        title: '커스텀버튼(권한설정)',
        dataIndex: 'col4',
        colSpan: 4
    },
    {
        dataIndex: 'col5',
        colSpan: 0
    },
    {
        dataIndex: 'col6',
        colSpan:0,
        width:100,
        align:'center',
        render: () => {
            return <>
                <CustomCheckbox /> 사용
            </>;
        },
    },
    {
        dataIndex: 'col7',
        colSpan:0,
        width:100,
        align:'center',
        render: () => {
            return <>
                <CustomCheckbox /> 미사용
            </>;
        },
    },
];

const data3: any[] = [];
for (let i = 0; i < 10; i++) {
    data3.push({
        key: 0,
        col1: '초기화',
        col2: false,
        col3: false,
        col4: '초기화',
        col5: '',
        col6: false,
        col7: false,
    });
}

const MenuManagement = () => {
    const {register: searchFormRegister, control: searchFormControl }= useForm<any>({mode:'all'});
    const {register: saveFormRegister, control: saveFormControl }= useForm<any>({mode:'all'});

    type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
    const { DirectoryTree } = Tree;
    const [treeData, setTreeData] = useState<MenuTree[]>();
    const userInfo = useRecoilValue(sessionInfoAtom);
    const [saveForm] = Form.useForm<any>();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<any[]>([]);
    const isAdminUser = userInfo.admYn === 'Y'; // 세션추가후 로컬스토리지에서 읽어와서 처리
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
                createMenuTree(res.item);
            }
        });
    };

    const createMenuTree = (menuList:any[]) => {
        const menuTree:MenuTree = {title:menuList[0].menuNm, key:menuList[0].menuId , icon: ({selected}) => (<IconFolder />),  children:[]};
        setChild(menuTree,  menuList[0], menuList);
        setTreeData([menuTree]);
    }
    ;

    const setChild = (parentTreeNode:MenuTree, parentMenuObject:any, menuList:any[]) => {
        menuList.map((v:any)=> {
            if(parentMenuObject.menuId === v.upMenuId) {
                  let childTreeNode : MenuTree = {title:v.menuNm, key:v.menuId};
                 if(MenuType.V === v.menuTypeCd) {
                     childTreeNode = {
                         ...childTreeNode,
                         icon: ({selected}) => (<IconFile />),
                     };
                     parentTreeNode.children?.push(childTreeNode);
                 }else if(MenuType.D === v.menuTypeCd) {

                     childTreeNode = {
                         ...childTreeNode,
                         icon: ({selected}) => (<IconFolder />),
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
    }, []);



    return <>
        <section className="title-wrap">
            <div className="box-flex">
                <h2 className="title">메뉴관리</h2>

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
                                    <span className="txt">메뉴관리</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>

            <div className="box-btn">
                <CustomButton type="primary"><IconBtnRefresh />초기화</CustomButton>
                <CustomButton type="primary"><IconBtnSearch />조회</CustomButton>
                <CustomButton type="primary">추가</CustomButton>
                <CustomButton type="primary">삭제</CustomButton>
                <CustomButton type="primary">저장</CustomButton>
            </div>
        </section>

        <section className="search-wrap">
            <form>
                <span>코드/명</span>
                <CustomInput placeholder="코드/명"/>

                <CustomButton type="primary" htmlType="submit">검색</CustomButton>
                <CustomCheckbox/>
                <span>미사용자 제외</span>
            </form>
        </section>

        <section className="board-wrap half-wrap type02">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        메뉴목록
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small">접기</CustomButton>
                        <CustomButton type="default" size="small">펼치기</CustomButton>
                    </div>
                </div>
                <div className="board-cont-wrap">
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
            </div>

            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle />
                        메뉴정보
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <form >
                        <div className="board-detail-info">
                            <div>
                                <p>
                                    <span className="tit">메뉴ID<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'} readOnly={saveForm && saveForm.getFieldValue('iudType') !== IudType.I}/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">상위메뉴ID<em>*</em></span>
                                    <div className="box-inp">
                                       <CustomInput type={'text'} />
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p className='full'>
                                    <span className="tit">메뉴명<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'} />
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">메뉴타입<em>*</em></span>
                                    <div className="box-inp">
                                        <Radio.Group
                                            className="box-radio"
                                            onChange={()=>{}}
                                        >
                                            <Radio value={1}>폴더</Radio>
                                            <Radio value={2}>화면</Radio>
                                        </Radio.Group>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">메뉴유형<em>*</em></span>
                                    <div className="box-inp">
                                         <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">URL<em>*</em></span>
                                    <div className="box-inp">
                                         <CustomInput type={'text'}/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">PREFIX<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'}/>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">조회순서<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'}/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">사용여부<em>*</em></span>
                                    <div className="box-inp">
                                        <Radio.Group
                                            className="box-radio"
                                            onChange={()=>{}}
                                        >
                                            <Radio value={1}>사용</Radio>
                                            <Radio value={2}>미사용</Radio>
                                        </Radio.Group>
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">등록자<em>*</em></span>
                                    <div className="box-inp">
                                         <CustomInput type={'text'} />
                                    </div>
                                </p>

                                <p>
                                    <span className="tit">수정자<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomInput type={'text'} />
                                    </div>
                                </p>
                            </div>

                            <div>
                                <p>
                                    <span className="tit">등록일자<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomDatePicker/>
                                    </div>
                                </p>
                                <p>
                                    <span className="tit">수정일자<em>*</em></span>
                                    <div className="box-inp">
                                        <CustomDatePicker/>
                                    </div>
                                </p>
                            </div>
                        </div>

                        <CustomTable scroll={{ x: 900 }} columns={columns2} dataSource={data2} rowNoFlag={false}/>

                        {/* 디자인 변경 안 */}
                        <CustomTable scroll={{ x: 900 }} columns={columns3} dataSource={data3} rowNoFlag={false}/>
                    </form>
                </div>
            </div>
        </section>
    </>;
};

export default MenuManagement;