import CustomButton from '@component/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import React, {useEffect, useState} from 'react';
import IconTitle from '@icon/IconTitle';
import CustomTable from '@component/CustomTable';
import {ColumnsType} from 'antd/es/table';
import {AuthGroupList} from '@interface/auth/AuthGroupManagement';
import CustomCheckbox from '@component/CustomCheckbox';
import {IudType, PageButtonHandlers} from '@interface/common';
import {MenuType} from '@interface/auth/MenuManagement';
import {callGetAuthGroupList} from '@api/auth/AuthGroupManagementApi';
import {AuthGroupMenuList, AuthGroupMenuTree} from '@interface/auth/AuthGroupMenuManagement';
import {callGetAuthGroupMenuList, callSaveAuthGroupMenu} from '@api/auth/AuthGroupMenuManagementApi';
import {HttpStatusCode} from 'axios';
import {message} from 'antd';


const AuthGroupMenuManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const [selectedAuthGroupRowIndex, setSelectedAuthGroupRowIndex] = useState(-1);
    const [authGroupDataSource, setAuthGroupDataSource] = useState<AuthGroupList[]>([]);
    const [orgAuthGroupDataSource, setOrgAuthGroupDataSource] = useState<AuthGroupList[]>([]);
    const [authGroupMenuList, setAuthGroupMenuList] = useState<AuthGroupMenuList[]>();
    const [authGroupMenuTree, setAuthGroupMenuTree] = useState<AuthGroupMenuTree[]>([]);
    const [orgAuthGroupMenuTree, setOrgAuthGroupMenuTree] = useState<AuthGroupMenuTree[]>([]);
    const [defaultExpandRowKeys, setDefaultExpandRowKeys] = useState<React.Key[]>([]);
    const [isIncludeUnusableAuth, setIsIncludeUnusableAuth] = useState<boolean>(false);
    const isChangedDataSource = authGroupDataSource.some((v)=>v.iudType);
    const editCheckIud = (data:AuthGroupMenuTree) => data.rgstUserId ? IudType.U :  IudType.I;
    const selectedAuthGroupRecord = ()=> {return authGroupDataSource&&authGroupDataSource.filter((v)=>v?.rowNo === selectedAuthGroupRowIndex+1)[0];};
    const isEditableAuthGroup = () => {return selectedAuthGroupRecord()?.rgstUserId && selectedAuthGroupRecord()?.useFlag;};

    const [rowIndex,setRowIndex] = useState(-1);
    const [rowSeq,setRowSeq]=useState(-1);
    const [resetAuthGroupMenuList, setResetAuthGroupMenuList] = useState<AuthGroupMenuList[]>();

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
            width: '45%'
        },
        {
            title: '사용여부',
            key:'useFlag',
            dataIndex: 'useFlag',
            align:'center',
            width: '15%',
            render: (value:boolean, record:AuthGroupList) => {
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

                 if (!record || record.upMenuSeq == null) return '';

                 const disabled = !isEditableAuthGroup(); // 편집 불가면 비활성화만
                 return (
                     <CustomCheckbox
                         checked={!!value}
                         disabled={disabled}
                         onChange={(e) => {
                             const next = e.target.checked;
                             handleChangeUseFlagAuthGroupMenu(authGroupMenuTree, record, next);

                             // 디렉토리일 때 하위까지 같은 플래그로
                             if (record.menuTypeCd === MenuType.D) {
                                 if (!next) {
                                     record.children?.forEach(ch => ch.useFlag && handleChangeUseFlagAuthGroupMenu(authGroupMenuTree, ch, false));
                                 } else {
                                     record.children?.forEach(ch => handleChangeUseFlagAuthGroupMenu(authGroupMenuTree, ch, true));
                                 }
                             }

                             if (record.menuTypeCd === MenuType.V && next) {
                                 findParent(authGroupMenuTree, record.upMenuSeq);
                             }
                         }}
                     />
                 );
             }

         }
    ];

    const findParent = (authGroupMenuTree:AuthGroupMenuTree[], upMenuSeq:number) :any=> {
        if(!authGroupMenuTree.some(v=>v.menuSeq === upMenuSeq))
            return authGroupMenuTree.forEach((v)=>{
               return v?.children&&findParent(v?.children, upMenuSeq);
          });

        const parent =authGroupMenuTree.filter(v=>v.menuSeq === upMenuSeq)[0];
        const child = parent.children;
        if(child && child.every(item => item.useFlag)) {
            !parent.useFlag && handleChangeUseFlagAuthGroupMenu(authGroupMenuTree, authGroupMenuTree.filter(v => v.menuSeq === upMenuSeq)[0], true);
        }
    };

    const handleSearchAuthGroupList = () => {
        callGetAuthGroupList().then((res)=> {
            if(res.code === HttpStatusCode.Ok){
                setRowSeq(-1);
                setOrgAuthGroupDataSource(JSON.parse(JSON.stringify(res.item)));
            }
        });
    };

     const handleChangeUseFlagAuthGroupMenu = (dataSource:AuthGroupMenuTree[], record:AuthGroupMenuTree, value:boolean) => {
       if(!dataSource.some(v=>v.authGrpMenuSeq === record.authGrpMenuSeq)) {
          dataSource.forEach((v)=>{
              v.children&& handleChangeUseFlagAuthGroupMenu(v.children, record, value);
          });
       }
       else {
            dataSource.map((item:any) => {
                if (record.menuSeq === item.menuSeq) {
                    item.useFlag = value;
                    item.iudType = editCheckIud(record);
                }
                return item;
            });
            return;
       }
       setAuthGroupMenuTree([...dataSource]);
    };

    const createMenuTree = (authMenuTree:AuthGroupMenuList[], parent:AuthGroupMenuTree) => {
        const menuTree:AuthGroupMenuTree[] = authMenuTree.filter((v)=>v.upMenuSeq === parent.menuSeq).map((v)=> {
            if(v.menuTypeCd === MenuType.D) {
                return {
                    authGrpMenuSeq: v.authGrpMenuSeq,
                    menuSeq: v.menuSeq,
                    upMenuSeq: v.upMenuSeq,
                    menuNm: v.menuNm,
                    menuTypeCd:v.menuTypeCd,
                    useFlag: v.useFlag,
                    rgstUserId: v.rgstUserId,
                    children: []
                };
            }
            else {
                return {
                    authGrpMenuSeq: v.authGrpMenuSeq,
                    menuSeq: v.menuSeq,
                    upMenuSeq: v.upMenuSeq,
                    menuNm: v.menuNm,
                    menuTypeCd:v.menuTypeCd,
                    useFlag: v.useFlag,
                    rgstUserId: v.rgstUserId
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

    const handleReset = async() => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }
       authGroupMenuTree&&authGroupMenuTree.length&& setAuthGroupMenuTree(JSON.parse(JSON.stringify(orgAuthGroupMenuTree)));
        setSelectedAuthGroupRowIndex(-1);
        //setAuthGroupMenuTree([]);
        setAuthGroupMenuList(resetAuthGroupMenuList);
        // setAuthGroupMenuList({
        //     upMenuId: 0,
        //     menuNm: '',
        //     menuTypeCd: 'D'
        // });


    };

    const makeTree = () =>{
         if(authGroupMenuList) {
            const root:AuthGroupMenuTree[] = authGroupMenuList.filter((v)=> v.upMenuSeq == null).map((v)=>{
                return { authGrpMenuSeq: v.authGrpMenuSeq,
                        menuSeq: v.menuSeq,
                        upMenuSeq: v.upMenuSeq,
                        menuNm: v.menuNm,
                        menuTypeCd: v.menuTypeCd,
                        useFlag: v.useFlag,
                        rgstUserId: v.rgstUserId,
                        children: []
                };
            });
            const tree =  createMenuTree(authGroupMenuList,root[0]);
            setAuthGroupMenuTree([tree]);
            setOrgAuthGroupMenuTree(JSON.parse(JSON.stringify([tree])));
            setDefaultExpandRowKeys(authGroupMenuList.filter(v=>v.menuTypeCd==MenuType.D).map(v=>v.authGrpMenuSeq));
        }
    };
    const checkAllUseFlagUnchecked = (nodes: AuthGroupMenuTree[]): boolean => {
        for (const node of nodes) {
            if (node.useFlag) return false;
            if (node.children && node.children.length > 0) {
                if (!checkAllUseFlagUnchecked(node.children)) return false;
            }
        }
        return true;
    };


    const handleSave = () => {
        if(checkAllUseFlagUnchecked(authGroupMenuTree)){
            message.info('메뉴 권한을 하나 이상 설정해주세요');
            return;
        }
        if(JSON.stringify(orgAuthGroupMenuTree) === JSON.stringify(authGroupMenuTree)) {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        const authGrpSeq = authGroupDataSource.at(selectedAuthGroupRowIndex)?.authGrpSeq;

        callSaveAuthGroupMenu(authGroupMenuTree[0], authGrpSeq).then((res)=> {
            if(res.code === HttpStatusCode.Ok)  {
                message.info("저장되었습니다.");
                setAuthGroupMenuTree([]);
                setSelectedAuthGroupRowIndex(rowIndex);
                callGetAuthGroupMenuList(rowSeq).then((res)=>{
                    if(res.code === HttpStatusCode.Ok) {
                        setAuthGroupMenuList(JSON.parse(JSON.stringify(res.item)));
                    }
                });
            }

        });
    };

    const handleAuthGroupRowSelection = async (recode:AuthGroupList, index:number) => {
        callGetAuthGroupMenuList(recode.authGrpSeq).then((res)=>{
            if(res.code === HttpStatusCode.Ok) {
                setAuthGroupMenuList(JSON.parse(JSON.stringify(res.item)));
            }
        });
        setSelectedAuthGroupRowIndex(index);
        setRowSeq(recode.authGrpSeq);
        setRowIndex(index);
    };


    const checkUnusableEditingConfirmMessage =  async (value:boolean) => {

        if(authGroupDataSource.some((v)=>v.iudType !== null)) {
             const result =  await confirm('작성중이던 내용이 존재합니다. 계속 진행하시겠습니까?');
           if(!result) return;
        }

        setIsIncludeUnusableAuth(value);
    };

   useEffect(() => {
        if(orgAuthGroupDataSource) {
             if(isIncludeUnusableAuth) setAuthGroupDataSource(JSON.parse(JSON.stringify(orgAuthGroupDataSource)));
             else setAuthGroupDataSource(JSON.parse(JSON.stringify(orgAuthGroupDataSource)).filter((v:any)=>v.useFlag));
        }

        setSelectedAuthGroupRowIndex(-1);
        //setAuthGroupMenuTree([]);
    }, [orgAuthGroupDataSource, isIncludeUnusableAuth]);

    useEffect(() => {
        handleSearchAuthGroupList();
    }, []);

    useEffect(() => {
        makeTree();
    }, [authGroupMenuList]);

    // 첫 렌더시 데이터소스의 0번째 행 하위 검색
    useEffect(() => {
        if (orgAuthGroupDataSource.length > 0 && rowSeq === -1) {
            handleAuthGroupRowSelection(orgAuthGroupDataSource[0], 0).then(()=>{});
        }
    }, [orgAuthGroupDataSource]);

    // 미사용 권한포함 토글 시 0번째 행 하위 검색
    useEffect(() => {
        if (authGroupDataSource && authGroupDataSource.length > 0) {
            handleAuthGroupRowSelection(orgAuthGroupDataSource[0], 0).then(()=>{});
        }
    }, [isIncludeUnusableAuth]);


    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: () => { handleReset(); handleSearchAuthGroupList(); },
                cfmSave: handleSave,
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
                        권한정보1
                    </h3>
                    <div className="box-btn">
                        <span>
                            <CustomCheckbox name={'isExceptUnused'}
                                            checked={isIncludeUnusableAuth}
                                            onChange={(v) => checkUnusableEditingConfirmMessage(v.target.checked)}/>미사용 권한포함
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
                                 rowKey={'authGrpSeq'} pagination={false}
                                 rowNoFlag={true} columns={authGroupColumn} dataSource={authGroupDataSource} rowSelectedFlag={false}
                                 selectedRowIndex={selectedAuthGroupRowIndex}/>
                </div>
            </div>

            <div>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>
                        메뉴권한
                    </h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable
                        columns={authMenuColumn}
                        dataSource={authGroupMenuTree}
                        rowNoFlag={false}
                        pagination={false}
                        rowKey={'authGrpMenuSeq'}
                        expandedRowKeys={defaultExpandRowKeys}
                        onExpandedRowsChange={setDefaultExpandRowKeys}
                    />
                </div>
            </div>
        </section>
    </>
    );
};

export default AuthGroupMenuManagement;