import {GetProps, message, Tree} from 'antd';
import React, {useEffect, useState} from 'react';
import {callDeleteMenu, callGetMenuInfo, callSaveMenu} from '@api/auth/MenuManagementApi';
import {EmptyMenu, FolderTree, MenuInfo, MenuListSearchParam, MenuTree, MenuType} from '@interface/auth/MenuManagement';
import {CheckCircleOutlined, FolderOpenOutlined, PlusCircleOutlined} from '@ant-design/icons';
import CustomInput from '@component/CustomInput';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';
import CustomButton from '@component/CustomButton';
import IconTitle from '@image/icon_title.svg';
import IconFile from '@icon/IconFile';
import IconFolder from '@icon/IconFolder';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import {useCmCode} from '@hook/useCmCode';
import {useForm} from 'react-hook-form';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormRadio from '@component/form/CustomSaveFormRadio';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
import {DefaultOptionType} from 'rc-select/lib/Select';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomValidFormCheckbox from '@component/form/CustomValidFormCheckbox';
import {IudType} from '@interface/common';
import {HttpStatusCode} from 'axios';
import {useMessage} from '@hook/useMessage';
import {User, UserList} from "@interface/master/UserManagement";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const emptyList:EmptyMenu[] = [
    {
        menuSeq: undefined,
        menuId: undefined,
        upMenuId: undefined,
        menuNm: '',
        menuTypeCd: undefined,
        menuViewPath: '',
        menuUri: '',
        useFlag: undefined,
        sortSeq: undefined
    }
];

const MenuManagement = () => {
    const {confirm} = useMessage();
    const userInfo = useRecoilValue(sessionInfoAtom);
    const {register: searchFormRegister
        , control: searchFormControl
        , handleSubmit: searchFormHandleSubmit
        , watch: searchFormWatch
        , getValues: searchFormGetValues} = useForm<MenuListSearchParam>({mode:'all'});
    const {register: saveFormRegister
        , control: saveFormControl
        , handleSubmit: saveFormHandleSubmit
        , formState:{errors:saveFormErros}
        , reset: saveFormReset
        , getValues: saveFormGetValues
        , setValue: saveFormSetValue
    } = useForm<MenuInfo>({mode:'all'});

    const { DirectoryTree } = Tree;
    const cmCode = useCmCode(['MenuType']);
    const [treeData, setTreeData] = useState<MenuTree[]>();
    const [orgTreeData, setOrgTreeData] = useState<MenuTree[]>();
    const [parentMenuCombo, setParentMenuCombo] = useState<DefaultOptionType[]>([]);
    const [expandedKey, setExpandedKey] = useState<React.Key[]>();
    const isAdminUser = userInfo.admFlag;
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<MenuInfo[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<MenuInfo[]>([]);
    const [selectable, setSelectable] = useState<boolean>(true);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    const isEditable = isRowSelected && isAdminUser;
    const isViewMenu = saveFormGetValues('menuTypeCd') === 'V';
    const isSaveFormErrors =  Object.keys(saveFormErros).length > 0;
    const isChangedDataSource = dataSource.some((v)=>v.iudType);

    const [rowSeq,setRowSeq] = useState<any[]>([]);
    const [rowIndex,setRowIndex] = useState(-1);

    const onSelect: DirectoryTreeProps['onSelect'] = async (keys:any[], info?:any) => {
        if(isChangedDataSource)  {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if(!result) return;

            setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
        }
        setRowSeq(keys);
        onSelectChange(keys);
    };

    const onSelectChange = (keys:any[]) => {
        setSelectedKeys(keys);
        saveFormReset(getCurrentRowDataSourceById(keys[0]));
        setIsRowSelected(true);
        createParentMenuCombo();
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys:any[], info) => {
       !info.node.expanded && expandedKey&& setExpandedKey([...expandedKey, info.node.key]);
       info.node.expanded && expandedKey&& setExpandedKey(expandedKey.filter((v)=>v !== info.node.key));
    };

    const getCurrentRowDataSourceById = (menuId : number) => dataSource.filter((v)=>v.menuId === menuId)[0];

    const getOrgRowDataSourceById = (menuId : number) => orgDataSource.filter((v)=>v.menuId === menuId)[0];

    const handleDataChanged = () => {
        const formData  = saveFormGetValues();
        const changedDataSource = dataSource.map((item)=> {
            if (item.menuSeq === formData.menuSeq) {
                if(isItemChanged(item,formData)) {
                    const orgMenuTypeCd = item.menuTypeCd;
                    item = {...item, ...formData};
                    item.iudType = item.iudType ?? IudType.U;

                    if (orgMenuTypeCd !== formData.menuTypeCd) {
                        if (formData.menuTypeCd === 'D') {
                            item.upMenuId = 1000;
                        } else {
                            item.upMenuId = 1001;
                        }
                    }

                    if (item.menuTypeCd === MenuType.D) {
                        item.menuUri = '';
                        item.menuViewPath = '';
                    }
                }
                 //saveFormReset(item);
            }
            return item;
        });

       changedDataSource&&setDataSource(changedDataSource);
    };

    const isItemChanged = (originalItem: MenuInfo, newItem: MenuInfo): boolean => {
        for (const key of Object.keys(newItem) as (keyof MenuInfo)[]) {
            if (originalItem[key] !== newItem[key]) {
                return true;
            }
        }
        return false;
    };


    const handleSave = async (value: MenuInfo) => {
        if(!isChangedDataSource)
        {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        const result = await confirm('저장 하시겠습니까?');
        if(result) {
            const result = await callSaveMenu(getCurrentRowDataSourceById(value.menuId));
            if (result.code === HttpStatusCode.Ok)
                saveFormReset(emptyList[0]);
                // setSelectedKeys([]);
                // setSelectedKeys(rowSeq);

                callGetMenuInfo().then((res)=> {
                    setIsRowSelected(true);
                    setDataSource(JSON.parse(JSON.stringify(res.item)));
                    setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
                });
                onSelectChange(rowSeq);
        }
    };


    const handleSearch = async () => {
        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if(!result) return;
        }
        saveFormReset(emptyList[0]);
        setSelectedKeys([]);
        callGetMenuInfo().then((res)=> {
            setIsRowSelected(false);
            setDataSource(JSON.parse(JSON.stringify(res.item)));
            setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
        });
    };

    const handleAdd = async() => {
        if(isSaveFormErrors)
            return true;

        if(isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }

        const addList:MenuInfo[] = JSON.parse(JSON.stringify(emptyList));
        addList[0].menuSeq=orgDataSource&&orgDataSource.length>0 ? Math.max(...orgDataSource.map((v:MenuInfo) => v.menuSeq+1)):0;
        // addList[0].menuId=dataSource&&dataSource.length>0 ? Math.max(...dataSource.map((v:MenuInfo) => v.menuId+1)):0;
        addList[0].menuId=9999;
        addList[0].upMenuId=orgDataSource&&orgDataSource.length>0 ? orgDataSource?.filter((v)=>v.upMenuId=== null)[0].menuId:0;
        addList[0].menuNm='';
        addList[0].menuTypeCd=MenuType.D;
        addList[0].useFlag = true;
        addList[0].iudType = IudType.I;
        const addedDataSource = orgDataSource.concat(addList);
        setDataSource(addedDataSource);
        // handleRowSelection(addList[0], addedDataSource.length-1).then();
    };


    const handleDelete = async () => {
        if(!isRowSelected)
        {
            message.info('선택한 메뉴가 없습니다.');
            return;
        }
        if(saveFormGetValues('menuTypeCd') === MenuType.D
        && dataSource.filter((v)=>v.upMenuId===saveFormGetValues('menuId')).length > 0 )  {
            message.error('하위에 포함된 메뉴가 존재할 경우 삭제할 수 없습니다.');
            return;
        }

        const check = await confirm('삭제하시겠습니까?');
        if(!check) return;

        const menuSeq = saveFormGetValues('menuSeq');
        const result = await callDeleteMenu(menuSeq);
        if(result.code === HttpStatusCode.Ok)
            handleSearch();
    };

    const handleReset = async () => {
        const result = await confirm('저장하지 않은 정보는 초기화됩니다. 계속 하시겠습니까?');
        if (!result) return;

        const changedDataSource = dataSource.map((item)=> {
            if (item.menuSeq === saveFormGetValues('menuSeq')) {
                if(orgDataSource.some((v) => v.menuSeq === saveFormGetValues('menuSeq'))) {
                    const ret = orgDataSource.filter((v) => v.menuSeq === saveFormGetValues('menuSeq'))[0];
                    ret.iudType = item.iudType !== IudType.I ? undefined: item.iudType;
                    return ret;
                }
                else {
                    const ret = dataSource.filter((v) => v.menuSeq === saveFormGetValues('menuSeq'))[0];
                    ret.iudType = item.iudType !== IudType.I ? undefined: item.iudType;
                    return ret;
                }
            }
            return item;
        });
        setDataSource(changedDataSource);
        onSelectChange([]);
        saveFormReset(emptyList[0]);
        setIsRowSelected(false);
    };

    const resetSaveForm = () =>{
        saveFormReset(orgDataSource.filter((v)=>v.menuSeq===saveFormGetValues('menuSeq')??{})[0]);
    };
    const handleFilter =  () => {
        if(!searchFormGetValues('menuNm') && !searchFormGetValues('isExceptUnused')) {
            createMenuTree(orgDataSource);
            return;
        }
        const searchParam =  {menuNm:searchFormGetValues('menuNm'), isExceptUnused:searchFormGetValues('isExceptUnused')??false};
        const root:MenuTree[] = [];
        orgTreeData && root.push({...orgTreeData[0], icon: () => (<FolderOpenOutlined />), children:[]});
        orgTreeData &&  searchDirectory(root, JSON.parse(JSON.stringify(orgTreeData[0].children)), searchParam);
    };

    const searchDirectory = (root:MenuTree[], directoryTree:MenuTree[], searchParam?:MenuListSearchParam) => {
        directoryTree.forEach((item:MenuTree)=> {
          if(item) {
              if(searchParam && searchParam.isExceptUnused) {
                  if(item.useFlag)
                      searchView({...item, icon: () => (<IconFolder />), children:[]}, root[0], item.children as [], searchParam);
              }
              else {
                searchView({...item, icon: () => (<IconFolder />), children:[]}, root[0], item.children as [], searchParam);
              }
          }
        });
        setTreeData(root);
    };

    const searchView = (parent:MenuTree, root:MenuTree, viewList:MenuTree[], searchParam?:MenuListSearchParam) => {
          if(searchParam && searchParam.menuNm && viewList) {
               viewList.filter((v)=>v&&v.title&&v.title.toString().indexOf(searchParam?.menuNm) > -1) .map((v)=> {
                   if(searchParam.isExceptUnused && v.useFlag)
                       parent&& parent.children&&parent.children.push({...v,  icon: () => (<IconFile />)});
                   else if(!searchParam.isExceptUnused)
                       parent&& parent.children&&parent.children.push({...v,  icon: () => (<IconFile />)});
               });
          }
          else if(searchParam && searchParam.isExceptUnused && viewList){
              viewList.filter((v)=>v &&v.useFlag).map((v)=> {
                  parent&& parent.children&&parent.children.push({...v,  icon: () => (<IconFile />)});
              });
          }
           root&&root.children&&root.children.push(parent);
    };



    const findParentMenuNm = (menuList:MenuInfo[], menu:MenuInfo, menuPath: string):any => {
          const parent: MenuInfo =  menuList
              .filter((parent)=>parent.menuId === menu.upMenuId).map((parent) => parent)[0];
          if(parent) {
              return findParentMenuNm(menuList, parent, parent.menuNm + ' > '  + menuPath);
          }
          return menuPath;
    };

    const createMenuTree = (menuList:MenuInfo[]) => {
        if(menuList.length < 1) return;
        const menuTree:MenuTree = {title:menuList[0].menuNm, key:menuList[0].menuId , icon: () => (<FolderOpenOutlined />),  children:[]};
        setChild(menuTree,  menuList[0], menuList);
        setTreeData([menuTree]);
        setOrgTreeData([menuTree]);
    };

    const createExpandedKey = (menuList:MenuInfo[]) =>
        setExpandedKey(menuList.filter((v)=>v.menuTypeCd===MenuType.D).map((v)=>v.menuId));

    const expandTree = () => {
        setExpandedKey(dataSource.filter((v)=>v.menuTypeCd===MenuType.D).map((v)=>v.menuId));
    };

    const foldTree = () => {
        setExpandedKey(dataSource.filter((v)=>v.upMenuId===null).map((v)=>v.menuId));
    };
    const setChild = (parentTreeNode:MenuTree, parentMenuObject:MenuInfo, menuList:MenuInfo[]) => {
        menuList.map((v:MenuInfo)=> {
            if(parentMenuObject.menuId === v.upMenuId) {
                  let childTreeNode : MenuTree = {title:v.menuNm, key:v.menuId, useFlag: v.useFlag};
                 if(MenuType.V === v.menuTypeCd) {
                     childTreeNode = {
                         ...childTreeNode,
                         icon: () => (v.iudType===IudType.I?<PlusCircleOutlined />:v.iudType===IudType.U?<CheckCircleOutlined />:<IconFile />),
                     };
                     parentTreeNode.children?.push(childTreeNode);
                 }else if(MenuType.D === v.menuTypeCd) {

                     childTreeNode = {
                         ...childTreeNode,
                         icon: () => (v.iudType===IudType.I?<PlusCircleOutlined />:v.iudType===IudType.U?<CheckCircleOutlined />:<IconFolder />),
                         children: [],
                     };
                    parentTreeNode.children?.push(childTreeNode);
                    setChild(childTreeNode, v, menuList);
                }
            }
        });
    };

    const setFolderChild = (parentTreeNode:FolderTree, parentMenuObject:MenuInfo, menuList:MenuInfo[]) => {
        menuList.map((v:MenuInfo)=> {
            if(parentMenuObject.menuId === v.upMenuId) {
                  let childTreeNode : FolderTree = {label:v.menuNm, value:v.menuId+''};
                if(MenuType.D === v.menuTypeCd) {

                     childTreeNode = {
                         ...childTreeNode,
                         children: [],
                     };
                    parentTreeNode.children?.push(childTreeNode);
                    setFolderChild(childTreeNode, v, menuList);
                }
            }
        });
    };

    const createParentMenuCombo = () => {
         const directory = dataSource.filter((v)=>v.menuTypeCd == MenuType.D);
        const menuComboList:DefaultOptionType[]= directory.map((v)=>{
            const parentMenuNm = findParentMenuNm(directory, v, v.menuNm);
            return {value: v.menuId, label : parentMenuNm, level:v.level};
        });

         if(saveFormGetValues('menuTypeCd') === 'V') {
             setParentMenuCombo(menuComboList.filter((v)=>v['level'] >0));
             return;
         }

         setParentMenuCombo(menuComboList.filter((v)=>v['level'] < 1));
    };


    useEffect(() => {
        dataSource&&dataSource.length&&createMenuTree(dataSource);
        dataSource&&dataSource.length&&createParentMenuCombo();
        dataSource&&dataSource.length&&createExpandedKey(dataSource);

    }, [dataSource]);

    useEffect(() => {
       if(searchFormGetValues('menuNm')||searchFormGetValues('isExceptUnused'))
           handleFilter();
    }, [orgDataSource]);

    useEffect(() => {
       handleFilter();
    }, [searchFormWatch('menuNm'), searchFormWatch('isExceptUnused')]);

    useEffect(() => {
        if(dataSource.some((v)=>v.iudType===IudType.I) ){
            const menuId = dataSource.filter((v)=>v.iudType===IudType.I).map((v)=>v.menuId)[0];
            if(treeData && treeData.length>0 && treeData[0].children?.filter((v)=>v.key === menuId)) {
                onSelectChange(dataSource.filter((v)=>v.iudType === IudType.I).map((v)=>v.menuId));
                treeData&&treeData.length&&setSelectable(true);
            }
        }

    }, [treeData]);

    useEffect(() => {
        handleSearch();
    }, []);



    return Object.keys(cmCode).length > 0 && (
        <>
            <section className="button-wrap">
                <div className="box-btn">
                    <CustomButton type="primary" onClick={handleReset}><IconBtnRefresh/>초기화</CustomButton>
                    <CustomButton type="primary" onClick={()=>handleSearch().then(handleFilter)}><IconBtnSearch/>조회</CustomButton>
                    <CustomButton type="primary" onClick={handleAdd}>추가</CustomButton>
                    <CustomButton type="primary" onClick={handleDelete}>삭제</CustomButton>
                    <CustomButton type="primary" onClick={saveFormHandleSubmit(handleSave)}>{'저장'}</CustomButton>
                </div>
            </section>

            <section className="search-wrap">
                <form>
                    <span>메뉴명</span>
                    <CustomValidFormInput name={'menuNm'}
                                          placeholder="검색할 ID를 입력해 주세요."
                                          control={searchFormControl}
                                          onChangeValue={(v)=>{handleFilter();}}
                                            />
                    <CustomValidFormCheckbox name={'isExceptUnused'} control={searchFormControl}
                                             onChange={(v)=>searchFormHandleSubmit(handleFilter)} />
                    <span>미사용제외</span>
                </form>
            </section>

            <section className="board-wrap half-wrap type02">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            메뉴목록
                        </h3>
                        <div className="box-btn">
                            <CustomButton type="default" size="small" onClick={foldTree}>접기</CustomButton>
                            <CustomButton type="default" size="small" onClick={expandTree}>펼치기</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        {treeData ?
                            <DirectoryTree
                                showLine
                                multiple
                                defaultExpandAll
                                showIcon={true}
                                expandAction={'doubleClick'}
                                expandedKeys={expandedKey}
                                onSelect={onSelect}
                                onExpand={onExpand}
                                treeData={treeData}
                                selectable={selectable}
                                selectedKeys={selectedKeys}
                                // filterTreeNode={filterTreeNode}

                            />
                            : <></>}
                    </div>
                </div>

                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            상세정보
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <form onSubmit={saveFormHandleSubmit(handleSave)}>
                             <CustomInput style={{display: 'none'}} className={'hide'} {...saveFormRegister('menuSeq')}/>
                             <CustomInput style={{display: 'none'}} className={'hide'} {...saveFormRegister('iudType')}/>
                            <div className="board-detail-info">
                                <div>
                                    <CustomSaveFormInput
                                        title={'메뉴ID'}
                                        control={saveFormControl}
                                        name="menuId"
                                        disabled={true}
                                        onChange={handleDataChanged}
                                    />
                                    <CustomSaveFormSelect
                                        title={'상위메뉴'}
                                        control={saveFormControl}
                                        required={true}
                                        disabled={!isEditable}
                                        options={parentMenuCombo}
                                        style={{width:'200px'}}
                                       {...saveFormRegister('upMenuId', {required:'상위메뉴가 선택되지 않았습니다.', onChange:handleDataChanged})}
                                />
                                </div>

                                <div>
                                    <CustomSaveFormInput
                                        title={'메뉴명'}
                                        required={true}
                                        disabled={!isEditable}
                                        control={saveFormControl}
                                         {...saveFormRegister('menuNm', {required: '메뉴명이 입력되지 않았습니다.', onChange:handleDataChanged})}
                                    />

                                     <CustomSaveFormInput
                                        title={'URL'}
                                        required={isViewMenu}
                                        disabled={!isEditable || !isViewMenu}
                                        control={saveFormControl}
                                        {...saveFormRegister('menuUri',isViewMenu? {required: '메뉴 URL이 입력되지 않았습니다.', onChange:handleDataChanged}:{onChange:handleDataChanged})}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormRadio
                                        title={'메뉴타입'}
                                        required={true}
                                        disabled={!isEditable}
                                        control={saveFormControl}
                                        onChangeValue={createParentMenuCombo}
                                        options={Object.keys(cmCode['MenuType']).map((key)  => ({'value': key,'label':cmCode['MenuType'][key]}))}
                                         {...saveFormRegister('menuTypeCd', {required: '메뉴타입이 선택되지 않았습니다.', onChange:handleDataChanged})}
                                    />

                                    <CustomSaveFormInput
                                        title={'메뉴 View Path'}
                                        required={isViewMenu}
                                        disabled={!isEditable || !isViewMenu}
                                        control={saveFormControl}
                                        {...saveFormRegister('menuViewPath', isViewMenu ? {required: '메뉴 View Path가 입력되지 않았습니다.', onChange:handleDataChanged}:{onChange:handleDataChanged})}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormRadio
                                        title={'사용여부'}
                                        required={true}
                                        disabled={!isEditable}
                                        control={saveFormControl}
                                        options={[{value:true, label:'예'},{value:false, label:'아니오'}]}
                                         {...saveFormRegister('useFlag', {required: '사용여부가 선택되지 않았습니다.', onChange:handleDataChanged})}
                                    />

                                    <CustomSaveFormInput
                                        title={'조회순서'}
                                        required={true}
                                        disabled={!isEditable}
                                        control={saveFormControl}
                                        name="sortSeq"
                                        onChangeValue={handleDataChanged}
                                    />
                                </div>
                                <div>
                                     <CustomSaveFormInput
                                        title={'등록자'}
                                        control={saveFormControl}
                                        name="rgstUserName"
                                        disabled={true}
                                    />

                                    <CustomSaveFormInput
                                        title={'수정자'}
                                        control={saveFormControl}
                                        name="uptUserName"
                                        disabled={true}
                                    />
                                </div>
                                <div>
                                    <CustomSaveFormInput
                                        title={'등록일자'}
                                        control={saveFormControl}
                                        name={'rgstDate'}
                                        disabled={true}
                                    />

                                    <CustomSaveFormInput
                                        title={'수정일자'}
                                        control={saveFormControl}
                                        name={'uptDate'}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MenuManagement;