import CustomTable from '@component/CustomTable';
import IconTitle from '@icon/IconTitle';
import CustomAutoComplete from '@component/CustomAutoComplete';
import {useEffect, useState} from 'react';
import {
    UserComboAutoCompeteOption,
    UserMenuAuthGroupList,
    UserMenuAuthMenuList,
    UserMenuAuthMenuTree
} from '@interface/auth/UserMenuAuthState';
import {ColumnsType} from 'antd/es/table';
import {AuthGroupMenuTree} from '@interface/auth/AuthGroupMenuManagement';
import {
    callGetUserMenuAuthGroupList,
    callGetUserMenuAuthMenuList,
    callGetUserMenuAuthUserComboList
} from '@api/auth/UserMenuAuthStateApi';
import {AuthGroupList} from '@interface/auth/AuthGroupManagement';
import {MenuType} from '@interface/auth/MenuManagement';
import {HttpStatusCode} from 'axios';

const UserMenuAuthState = () => {
const [userComboList, setUserComboList] = useState<UserComboAutoCompeteOption[]>([]);
const [selectedUserAuthGroupRowIndex, setSelectedUserAuthGroupRowIndex] = useState(-1);
const [userAuthGroupDataSource, setUserAuthGroupDataSource] = useState<UserMenuAuthGroupList[]>([]);
const [orgUserAuthGroupDataSource, setOrgUserAuthGroupDataSource] = useState<UserMenuAuthGroupList[]>([]);
const [selectedSearchUser, setSelectedSearchUser] = useState<UserComboAutoCompeteOption | null>(null);
const [userAuthGroupMenuList, setUserAuthGroupMenuList] = useState<UserMenuAuthMenuList[]>();
const [userAuthGroupMenuTree, setUserAuthGroupMenuTree] = useState<UserMenuAuthMenuTree[]>([]);
const [orgUserAuthGroupMenuTree, setOrgUserAuthGroupMenuTree] = useState<UserMenuAuthMenuTree[]>([]);
const [defaultExpandRowKeys, setDefaultExpandRowKeys] = useState<React.Key[]>([]);
const authGroupColumn: ColumnsType<UserMenuAuthGroupList> = [
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
        width: '45%',
    },
    {
        title: '사용여부',
        key:'useFlag',
        dataIndex: 'useFlag',
        align:'center',
        width: '15%',
        render: (value:boolean, record:UserMenuAuthGroupList) => {
            return value?'예':'아니오';
        }
    }
];

const authMenuColumn: ColumnsType<AuthGroupMenuTree> = [
    {
        title: '메뉴명',
        dataIndex: 'menuNm',
        key: 'menuNm',
    },
    {
        title: '사용여부',
        dataIndex: 'useFlag',
        width: '15%',
        align:'center',
        render: (value:boolean, record:AuthGroupMenuTree) => {
            return value?'예':'아니오';
        }
    }
];

const handleSearchUserAuthGroupList = () => {
    selectedSearchUser?.userSeq&&
    callGetUserMenuAuthGroupList(selectedSearchUser?.userSeq).then((res)=> {
        if(res.code === HttpStatusCode.Ok) {
            setOrgUserAuthGroupDataSource(JSON.parse(JSON.stringify(res.item)));
            setSelectedUserAuthGroupRowIndex(-1);
        }
    });
};



useEffect(() => {
    setUserAuthGroupDataSource(JSON.parse(JSON.stringify(orgUserAuthGroupDataSource)).filter((v:any)=>v.useFlag));
    setUserAuthGroupMenuTree([]);
    setSelectedUserAuthGroupRowIndex(-1);
}, [orgUserAuthGroupDataSource]);



const handleUserAuthGroupRowSelection = async (recode:AuthGroupList, index:number) => {
    callGetUserMenuAuthMenuList(recode.authGrpSeq).then((res)=>{
        if(res.code === HttpStatusCode.Ok) {
            setUserAuthGroupMenuList(JSON.parse(JSON.stringify(res.item)));
        }
    });
    setSelectedUserAuthGroupRowIndex(index);
};


const handleSearchUserComboList = async (searchText : string) => {
    const data = await callGetUserMenuAuthUserComboList(searchText);
    const autoCompleteList = data.item.map((item) => {
        return { label : `${item.userName} (${item.userId})`, value : item.userId, userSeq: item.userSeq};
    });
    setUserComboList(autoCompleteList);
};

const createMenuTree = (authMenuTree:UserMenuAuthMenuList[], parent:UserMenuAuthMenuTree) => {
    const menuTree:UserMenuAuthMenuTree[] = authMenuTree.filter((v)=>v.upMenuId === parent.menuId).map((v)=> {
        if(v.menuTypeCd === MenuType.D) {
            return {
                menuSeq: v.menuSeq,
                authGrpSeq: v.authGrpSeq,
                menuId: v.menuId,
                upMenuId: v.upMenuId,
                menuNm: v.menuNm,
                menuTypeCd:v.menuTypeCd,
                useFlag: v.useFlag,
                children: []
            };
        }
        else {
            return {
                menuSeq: v.menuSeq,
                authGrpSeq: v.authGrpSeq,
                menuId: v.menuId,
                upMenuId: v.upMenuId,
                menuNm: v.menuNm,
                menuTypeCd:v.menuTypeCd,
                useFlag: v.useFlag
            };
        }
    });

    if(menuTree&&menuTree.length) {
        menuTree.forEach((v)=>{
            parent.children?.push(v);
            v.menuTypeCd===MenuType.D&&createMenuTree(authMenuTree, v);
        });
    }

    return parent;
};

const makeTree = () =>{
    if(userAuthGroupMenuList) {
        const root:UserMenuAuthMenuTree[] = userAuthGroupMenuList.filter((v)=> v.upMenuId == null).map((v)=>{
            return {
                menuSeq: v.menuSeq,
                authGrpSeq: v.authGrpSeq,
                menuId: v.menuId,
                upMenuId: v.upMenuId,
                menuNm: v.menuNm,
                menuTypeCd: v.menuTypeCd,
                useFlag: v.useFlag,
                children: []
            };
        });
        const tree =  createMenuTree(userAuthGroupMenuList,root[0]);
        setUserAuthGroupMenuTree([tree]);
        setOrgUserAuthGroupMenuTree(JSON.parse(JSON.stringify([tree])));
        setDefaultExpandRowKeys(userAuthGroupMenuList.filter(v=>v.menuTypeCd==MenuType.D).map(v=>v.menuSeq));
    }
};

    useEffect(() => {
        handleSearchUserAuthGroupList();
    }, [selectedSearchUser]);

    useEffect(() => {
        makeTree();
    }, [userAuthGroupMenuList]);

    useEffect(() => {
        handleSearchUserComboList('');
    }, []);

return (
    <>
        <section className="search-wrap">
            <form>
                <span>사용자명</span>
                <CustomAutoComplete
                     placeholder={'사용자를 선택해 주세요.'}
                     options={userComboList}
                     onChange={(value) => {
                         if (!value) {
                             setSelectedSearchUser(null);
                         }
                     }}
                     onSelect={(value, item) => {
                         setSelectedSearchUser({
                             label: `${item.label}` ,
                             value:`${item.value}`,
                             userSeq: item.userSeq
                         });
                     }}
                     onSearch={handleSearchUserComboList}
                     label={selectedSearchUser?.label as string}
                     showName={true}
                     size="large">
                </CustomAutoComplete>
            </form>
        </section>
        <section className="board-wrap half-wrap type02">
            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        권한정보
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable onRow={(recode: any, index?: number) => {
                        return {
                            onClick: () => {
                                if (index !== selectedUserAuthGroupRowIndex) handleUserAuthGroupRowSelection(recode, index ?? -1).then();
                            },
                        };
                    }}
                     rowKey={'authGrpSeq'} pagination={false} rowNoFlag={true}
                     columns={authGroupColumn} dataSource={userAuthGroupDataSource}
                     selectedRowIndex={selectedUserAuthGroupRowIndex}/>
                </div>
            </div>

            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        메뉴정보
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable
                        columns={authMenuColumn}
                        dataSource={userAuthGroupMenuTree}
                        rowNoFlag={false}
                        pagination={false}
                        rowKey={'menuSeq'}
                        // defaultExpandAllRows={true}
                        expandedRowKeys={defaultExpandRowKeys}
                        onExpandedRowsChange={setDefaultExpandRowKeys}
                    />
                </div>
            </div>
        </section>
    </>
);
};

export default UserMenuAuthState;