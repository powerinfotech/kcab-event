import {GetProps, message, Tree} from 'antd';
import React, {useEffect, useState} from 'react';
import {callDeleteMenu, callGetBtnList, callGetMenuBtnList, callGetMenuInfo, callSaveMenu} from '@api/auth/MenuManagementApi';
import {BtnInfo, EmptyMenu, FolderTree, MenuBtnInfo, MenuInfo, MenuListSearchParam, MenuTree, MenuType} from '@interface/auth/MenuManagement';
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
import {IudType, PageButtonHandlers} from '@interface/common';
import {HttpStatusCode} from 'axios';
import {useMessage} from '@hook/useMessage';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const emptyList:EmptyMenu[] = [
    {
        menuSeq: undefined,
        upMenuSeq: undefined,
        menuNm: '',
        menuTypeCd: undefined,
        menuViewPath: '',
        menuUrl: '',
        useYn: undefined,
        sortSeq: undefined
    }
];

const MenuManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
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
        , clearErrors: saveFormClearErrors
        , watch: saveFormWatch
    } = useForm<MenuInfo>({mode:'all'});

    const { DirectoryTree } = Tree;
    const cmCode = useCmCode(['MenuType']);
    const [treeData, setTreeData] = useState<MenuTree[]>();
    const [orgTreeData, setOrgTreeData] = useState<MenuTree[]>();
    const [parentMenuCombo, setParentMenuCombo] = useState<DefaultOptionType[]>([]);
    const [expandedKey, setExpandedKey] = useState<React.Key[]>();
    const isAdminUser = userInfo.admYn === 'Y';
    const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<MenuInfo[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<MenuInfo[]>([]);
    const [selectable, setSelectable] = useState<boolean>(true);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    const isEditable = isRowSelected && isAdminUser;
    const isViewMenu = saveFormWatch('menuTypeCd') === 'V';
    const isSaveFormErrors =  Object.keys(saveFormErros).length > 0;
    const isChangedDataSource = dataSource.some((v)=>v.iudType);

    const [rowSeq, setRowSeq] = useState<any[]>([]);
    const [rowIndex, setRowIndex] = useState(-1);
    const [btnList, setBtnList] = useState<BtnInfo[]>([]);
    const [menuBtnState, setMenuBtnState] = useState<Array<{ btnSeq: number; sortSeq: number; btnNm: string; useYn: string }>>([]);

    const onSelect: DirectoryTreeProps['onSelect'] = async (keys:any[], info?:any) => {
        if(isChangedDataSource)  {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if(!result) return;

            setDataSource(JSON.parse(JSON.stringify(orgDataSource)));
        }
        setRowSeq(keys);
        onSelectChange(keys);
    };

    const onSelectChange = async (keys: any[]) => {
        setSelectedKeys(keys);
        const row = getCurrentRowDataSourceBySeq(keys[0]);
        saveFormReset(row);
        setIsRowSelected(true);
        createParentMenuCombo();

        // 기존 메뉴 선택 시: tb_menu_btn 기준으로 버튼 정보 세팅
        if (row?.menuSeq != null && row.menuSeq > 0 && row.iudType !== IudType.I) {
            const res = await callGetMenuBtnList(row.menuSeq);
            const list = res?.item ?? [];
            const merged = (btnList.length ? btnList : []).map((btn) => {
                const found = list.find((mb: MenuBtnInfo) => Number(mb.btnSeq) === Number(btn.btnSeq));
                return {
                    btnSeq: btn.btnSeq,
                    sortSeq: btn.sortSeq,
                    btnNm: found?.btnNm ?? '',
                    useYn: found?.useYn ?? '',
                };
            });
            setMenuBtnState(merged.length ? merged : []);
        } else if (row?.iudType === IudType.I) {
            // 추가버튼으로 생성된 신규 메뉴 선택 시
            // - 모든 버튼 기본값: 미사용(N)
            // - 커스텀 버튼 입력란 기본값: 공백('')
            const defaultBtns = btnList.map((btn) => ({
                btnSeq: btn.btnSeq,
                sortSeq: btn.sortSeq,
                btnNm: '',
                useYn: 'N',
            }));
            setMenuBtnState(defaultBtns);
        }
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys:any[], info) => {
       !info.node.expanded && expandedKey&& setExpandedKey([...expandedKey, info.node.key]);
       info.node.expanded && expandedKey&& setExpandedKey(expandedKey.filter((v)=>v !== info.node.key));
    };

    const getCurrentRowDataSourceBySeq = (menuSeq : number | React.Key) => {
        if (typeof menuSeq === 'string' && menuSeq.startsWith('_new_')) {
            const parts = menuSeq.split('_');
            const idx = parts[3] !== undefined ? Number(parts[3]) : -1;
            if (idx >= 0 && dataSource[idx]?.menuSeq == null) return dataSource[idx];
            const upMenuSeq = parts[2] !== undefined ? Number(parts[2]) : undefined;
            return dataSource.filter((v) => v.menuSeq == null && v.upMenuSeq === upMenuSeq)[0];
        }
        return dataSource.filter((v)=>v.menuSeq === menuSeq)[0];
    };

    const handleDataChanged = () => {
        const formData  = saveFormGetValues();
        const changedDataSource = dataSource.map((item)=> {
            if (item.menuSeq === formData.menuSeq) {
                if(isItemChanged(item,formData)) {
                    item = {...item, ...formData};
                    item.iudType = item.iudType ?? IudType.U;

                    if (item.menuTypeCd === MenuType.D) {
                        item.menuUrl = '';
                        item.menuViewPath = '';
                    }
                }
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

    /**
     * 버튼정보가 변경된 경우, 현재 선택된 메뉴의 IUD 타입을 업데이트(U)로 설정한다.
     * - 신규(I) 상태인 메뉴는 그대로 두고, 기존 메뉴(undefined 또는 U 등)만 U로 변경한다.
     */
    const markMenuUpdatedByButtonChange = () => {
        const selectedKey = rowSeq?.[0] ?? selectedKeys?.[0];
        if (selectedKey == null) return;

        const current = getCurrentRowDataSourceBySeq(selectedKey);
        if (!current) return;
        if (current.iudType === IudType.I) return;

        setDataSource((prev) =>
            prev.map((item) =>
                item.menuSeq === current.menuSeq
                    ? {
                          ...item,
                          iudType: IudType.U,
                      }
                    : item
            )
        );
    };

    const updateMenuBtnUseYn = (btnSeq: number, useYn: string, prevUseYn: string) => {
        if (prevUseYn === useYn) return;

        setMenuBtnState((prev) =>
            prev.map((b) =>
                Number(b.btnSeq) === Number(btnSeq) ? { ...b, useYn } : b
            )
        );

        markMenuUpdatedByButtonChange();
    };

    const updateMenuBtnNm = (btnSeq: number, btnNm: string, prevBtnNm: string) => {
        if (prevBtnNm === btnNm) return;

        setMenuBtnState((prev) =>
            prev.map((b) =>
                Number(b.btnSeq) === Number(btnSeq) ? { ...b, btnNm } : b
            )
        );

        markMenuUpdatedByButtonChange();
    };

    const handleSave = async (value: MenuInfo) => {
        if (!isRowSelected) {
            message.info('선택한 메뉴가 없습니다.');
            return;
        }
        if (!isChangedDataSource && menuBtnState.length === 0) {
            message.info('변경된 내용이 없습니다.');
            return;
        }
        const result = await confirm('저장 하시겠습니까?');
        if (result) {
            const selectedKey = rowSeq?.[0] ?? selectedKeys?.[0];
            const menu = selectedKey != null ? getCurrentRowDataSourceBySeq(selectedKey) : undefined;
            if (!menu) {
                message.info('선택한 메뉴 정보를 찾을 수 없습니다.');
                return;
            }
            const menuBtnList = menuBtnState.map((b) => ({
                btnSeq: b.btnSeq,
                btnNm: b.btnNm,
                useYn: b.useYn,
            }));
            const payload = { ...menu, menuBtnList };
            const res = await callSaveMenu(payload);
            if (res.code === HttpStatusCode.Ok) {
                message.success('저장이 완료되었습니다.');
                saveFormReset(emptyList[0]);
                callGetMenuInfo().then((res) => {
                    setIsRowSelected(true);
                    setDataSource(JSON.parse(JSON.stringify(res.item)));
                    setOrgDataSource(JSON.parse(JSON.stringify(res.item)));
                });
                onSelectChange(rowSeq);
            }
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
        addList[0].upMenuSeq=orgDataSource&&orgDataSource.length>0 ? orgDataSource?.filter((v)=>v.upMenuSeq=== null)[0].menuSeq:0;
        addList[0].menuNm='';
        addList[0].menuTypeCd=MenuType.D;
        addList[0].useYn = 'Y';
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
        && dataSource.filter((v)=>v.upMenuSeq===saveFormGetValues('menuSeq')).length > 0 )  {
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

    const resetSaveForm = () => {
        saveFormReset(orgDataSource.filter((v) => v.menuSeq === saveFormGetValues('menuSeq'))[0] ?? emptyList[0]);
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
                  if(item.useYn === 'Y')
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
                   if(searchParam.isExceptUnused && v.useYn === 'Y')
                       parent&& parent.children&&parent.children.push({...v,  icon: () => (<IconFile />)});
                  else if(!searchParam.isExceptUnused)
                       parent&& parent.children&&parent.children.push({...v,  icon: () => (<IconFile />)});
              });
          }
          else if(searchParam && searchParam.isExceptUnused && viewList){
              viewList.filter((v)=>v &&v.useYn === 'Y').map((v)=> {
                  parent&& parent.children&&parent.children.push({...v,  icon: () => (<IconFile />)});
              });
          }
           root&&root.children&&root.children.push(parent);
    };



    const findParentMenuNm = (menuList:MenuInfo[], menu:MenuInfo, menuPath: string):any => {
          const parent: MenuInfo =  menuList
              .filter((parent)=>parent.menuSeq === menu.upMenuSeq).map((parent) => parent)[0];
          if(parent) {
              return findParentMenuNm(menuList, parent, parent.menuNm + ' > '  + menuPath);
          }
          return menuPath;
    };

    const createMenuTree = (menuList:MenuInfo[]) => {
        if(menuList.length < 1) return;
        const rootKey = menuList[0].menuSeq ?? 0;
        const menuTree:MenuTree = {title:menuList[0].menuNm, key: rootKey, icon: () => (<FolderOpenOutlined />),  children:[]};
        setChild(menuTree,  menuList[0], menuList);
        setTreeData([menuTree]);
        setOrgTreeData([menuTree]);
    };

    const createExpandedKey = (menuList:MenuInfo[]) =>
        setExpandedKey(menuList.filter((v)=>v.menuTypeCd===MenuType.D && v.menuSeq != null).map((v)=>v.menuSeq as React.Key));

    const expandTree = () => {
        setExpandedKey(dataSource.filter((v)=>v.menuTypeCd===MenuType.D && v.menuSeq != null).map((v)=>v.menuSeq as React.Key));
    };

    const foldTree = () => {
        setExpandedKey(dataSource.filter((v)=>v.upMenuSeq===null && v.menuSeq != null).map((v)=>v.menuSeq as React.Key));
    };
    const getTreeKey = (v: MenuInfo, menuList: MenuInfo[]) =>
        v.menuSeq != null ? v.menuSeq : (`_new_${v.upMenuSeq}_${menuList.indexOf(v)}` as React.Key);

    const setChild = (parentTreeNode:MenuTree, parentMenuObject:MenuInfo, menuList:MenuInfo[]) => {
        menuList.map((v:MenuInfo)=> {
            if(parentMenuObject.menuSeq === v.upMenuSeq) {
                  const nodeKey = getTreeKey(v, menuList);
                  let childTreeNode : MenuTree = {title:v.menuNm, key: nodeKey, useYn: v.useYn};
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
            if(parentMenuObject.menuSeq === v.upMenuSeq) {
                  let childTreeNode : FolderTree = {label:v.menuNm, value:v.menuSeq+''};
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
        const menuComboList: DefaultOptionType[] = dataSource.filter((v) => {return v.menuSeq != null;})
                                                                .map((v) => ({
                                                                    value: v.menuSeq as any,
                                                                    label: v.menuNm,
                                                                    level: v.level,
                                                                }));

        setParentMenuCombo(menuComboList);
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
            const newItems = dataSource.filter((v)=>v.iudType===IudType.I);
            if(treeData && treeData.length > 0 && newItems.length > 0) {
                const keysToSelect = newItems.map((v) => getTreeKey(v, dataSource));
                onSelectChange(keysToSelect);
                setSelectable(true);
            }
        }

    }, [treeData]);

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        callGetBtnList().then((res) => {
            if (res?.item?.length) setBtnList(res.item);
        });
    }, []);

    useEffect(() => {
        if (btnList.length > 0 && selectedKeys?.length > 0 && menuBtnState.length === 0) {
            onSelectChange(selectedKeys);
        }
    }, [btnList.length]);


    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: () => handleSearch().then(handleFilter),
                cfmAdd: handleAdd,
                cfmDelete: handleDelete,
                cfmSave: saveFormHandleSubmit(handleSave),
            };
        }
    });

    useEffect(() => {
        return () => { if (handlersRef) handlersRef.current = {}; };
    }, []);

    return Object.keys(cmCode).length > 0 && (
        <>
            <section className="search-wrap">
                <form>
                    <span>메뉴명</span>
                    <CustomValidFormInput name={'menuNm'}
                                          placeholder="검색할 ID를 입력해 주세요."
                                          control={searchFormControl}
                                          onChangeValue={(_v: string) => { handleFilter(); }}
                                            />
                    <CustomValidFormCheckbox name={'isExceptUnused'} control={searchFormControl}
                                             onChange={() => searchFormHandleSubmit(handleFilter)} />
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

                <div className="right-panel">
                    <form onSubmit={saveFormHandleSubmit(handleSave)} style={{ height: '100%' }}>
                        <div className="top-right">
                            <div className="board-title-wrap">
                                <h3 className="title">
                                    <IconTitle/>
                                    상세정보
                                </h3>
                            </div>
                            <div className="board-cont-wrap">
                                <CustomInput style={{display: 'none'}} className={'hide'} {...saveFormRegister('menuSeq')}/>
                                <CustomInput style={{display: 'none'}} className={'hide'} {...saveFormRegister('iudType')}/>
                                <div className="board-detail-info menu-detail-two-column">
                                        <div>
                                            <CustomSaveFormInput
                                                title={'메뉴일련번호'}
                                                control={saveFormControl}
                                                name="menuSeq"
                                                disabled={true}
                                                onChange={handleDataChanged}
                                            />
                                            <CustomSaveFormSelect
                                                title={'상위메뉴'}
                                                name="upMenuSeq"
                                                control={saveFormControl}
                                                rules={{ required: '상위메뉴를 선택해 주세요.' }}
                                                required={true}
                                                disabled={!isEditable}
                                                options={parentMenuCombo}
                                                style={{width: '200px'}}
                                                showSearch
                                                optionFilterProp="label"
                                                onChangeValueback={() => handleDataChanged()}
                                            />
                                        </div>

                                        <div>
                                            <CustomSaveFormInput
                                                title={'메뉴명'}
                                                required={true}
                                                disabled={!isEditable}
                                                control={saveFormControl}
                                                name="menuNm"
                                                rules={{ required: '메뉴명이 입력되지 않았습니다.' }}
                                                onChangeValue={handleDataChanged}
                                            />
                                            <CustomSaveFormInput
                                                title={'URL'}
                                                required={isViewMenu}
                                                disabled={!isEditable || !isViewMenu}
                                                control={saveFormControl}
                                                name="menuUrl"
                                                rules={{
                                                    validate: (value: string) => {
                                                        const type = saveFormGetValues('menuTypeCd');
                                                        if (type === MenuType.V && (!value || value.trim() === '')) {
                                                            return '메뉴 URL이 입력되지 않았습니다.';
                                                        }
                                                        return true;
                                                    },
                                                }}
                                                onChangeValue={handleDataChanged}
                                            />
                                        </div>

                                        <div>
                                            <CustomSaveFormRadio
                                                title={'메뉴타입'}
                                                required={true}
                                                disabled={!isEditable}
                                                control={saveFormControl}
                                                name="menuTypeCd"
                                                rules={{ required: '메뉴타입이 선택되지 않았습니다.' }}
                                                onChangeValue={(value: MenuType) => {
                                                    if (value === MenuType.D) {
                                                        saveFormClearErrors(['menuUrl', 'menuViewPath']);
                                                    }
                                                    setTimeout(() => {
                                                        handleDataChanged();
                                                        createParentMenuCombo();
                                                    }, 0);
                                                }}
                                                options={Object.keys(cmCode['MenuType']).map((key)  => ({'value': key,'label':cmCode['MenuType'][key]}))}
                                            />
                                            <CustomSaveFormInput
                                                title={'메뉴 View Path'}
                                                required={isViewMenu}
                                                disabled={!isEditable || !isViewMenu}
                                                control={saveFormControl}
                                                name="menuViewPath"
                                                rules={{
                                                    validate: (value: string) => {
                                                        const type = saveFormGetValues('menuTypeCd');
                                                        if (type === MenuType.V && (!value || value.trim() === '')) {
                                                            return '메뉴 View Path가 입력되지 않았습니다.';
                                                        }
                                                        return true;
                                                    },
                                                }}
                                                onChangeValue={handleDataChanged}
                                            />
                                        </div>

                                        <div>
                                            <CustomSaveFormRadio
                                                title={'사용여부'}
                                                required={true}
                                                disabled={!isEditable}
                                                control={saveFormControl}
                                                name="useYn"
                                                rules={{ required: '사용여부가 선택되지 않았습니다.' }}
                                                onChangeValue={() => setTimeout(handleDataChanged, 0)}
                                                options={[{value:'Y', label:'예'},{value:'N', label:'아니오'}]}
                                            />

                                            <CustomSaveFormInput
                                                title={'조회순서'}
                                                required={true}
                                                disabled={!isEditable}
                                                control={saveFormControl}
                                                name="sortSeq"
                                                regExp={{ value: /^\d*$/, message: '숫자만 입력 가능합니다.' }}
                                                rules={{ required: '조회순서를 입력해 주세요.' }}
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
                                                name={'rgstDateTime'}
                                                disabled={true}
                                            />

                                            <CustomSaveFormInput
                                                title={'수정일자'}
                                                control={saveFormControl}
                                                name={'uptDateTime'}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        <div className="bottom-right">
                            <div className="board-title-wrap" style={{ marginTop: 16 }}>
                                <h3 className="title">
                                    <IconTitle />
                                    버튼정보
                                </h3>
                            </div>
                            <div className="board-cont-wrap button-info-two-column">
                                <div className="button-info-box">
                                    <div className="button-info-header">기본버튼(권한설정)</div>
                                    <table className="tbl type02">
                                        <colgroup>
                                            <col style={{ width: '120px' }} />
                                            <col style={{ width: '80px' }} />
                                            <col style={{ width: '80px' }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>버튼명</th>
                                                <th>사용</th>
                                                <th>미사용</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(btnList.filter((b) => b.sortSeq >= 11 && b.sortSeq <= 15)).map((btn) => {
                                                const state = menuBtnState.find((s) => Number(s.btnSeq) === Number(btn.btnSeq));
                                                const useYn = state?.useYn ?? 'N';
                                                return (
                                                    <tr key={btn.btnSeq}>
                                                        <td>{btn.btnNm}</td>
                                                        <td>
                                                            <input
                                                                type="radio"
                                                                name={`btn_use_${btn.btnSeq}`}
                                                                checked={useYn === 'Y'}
                                                                onChange={() => updateMenuBtnUseYn(btn.btnSeq, 'Y', useYn)}
                                                                disabled={!isEditable}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="radio"
                                                                name={`btn_use_${btn.btnSeq}`}
                                                                checked={useYn === 'N'}
                                                                onChange={() => updateMenuBtnUseYn(btn.btnSeq, 'N', useYn)}
                                                                disabled={!isEditable}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="button-info-box">
                                    <div className="button-info-header">커스텀버튼(권한설정)</div>
                                    <table className="tbl type02">
                                        <colgroup>
                                            <col style={{ width: '120px' }} />
                                            <col style={{ width: '200px' }} />
                                            <col style={{ width: '80px' }} />
                                            <col style={{ width: '80px' }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>버튼명</th>
                                                <th></th>
                                                <th>사용</th>
                                                <th>미사용</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(btnList.filter((b) => b.sortSeq >= 1 && b.sortSeq <= 9)).map((btn) => {
                                                const state = menuBtnState.find((s) => Number(s.btnSeq) === Number(btn.btnSeq));
                                                const btnNm = state?.btnNm ?? '';
                                                const useYn = state?.useYn ?? 'N';
                                                return (
                                                    <tr key={btn.btnSeq}>
                                                        <td>{btn.btnNm}</td>
                                                        <td>
                                                            <CustomInput
                                                                value={btnNm}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMenuBtnNm(btn.btnSeq, e.target.value, btnNm)}
                                                                disabled={!isEditable}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="radio"
                                                                name={`btn_custom_use_${btn.btnSeq}`}
                                                                checked={useYn === 'Y'}
                                                                onChange={() => updateMenuBtnUseYn(btn.btnSeq, 'Y', useYn)}
                                                                disabled={!isEditable}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="radio"
                                                                name={`btn_custom_use_${btn.btnSeq}`}
                                                                checked={useYn === 'N'}
                                                                onChange={() => updateMenuBtnUseYn(btn.btnSeq, 'N', useYn)}
                                                                disabled={!isEditable}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default MenuManagement;