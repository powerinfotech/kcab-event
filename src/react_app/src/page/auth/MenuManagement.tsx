import {GetProps, message, Tree} from 'antd';
import React, {useEffect, useState} from 'react';
import {callDeleteMenu, callGetBtnList, callGetMenuBtnList, callGetMenuInfo, callSaveMenu} from '@api/auth/MenuManagementApi';
import {BtnInfo, EmptyMenu, MenuBtnInfo, MenuInfo, MenuListSearchParam, MenuTree, MenuType} from '@interface/auth/MenuManagement';
import {CheckCircleOutlined, FolderOpenOutlined, PlusCircleOutlined} from '@ant-design/icons';
import CustomInput from '@component/CustomInput';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';
import CustomButton from '@component/CustomButton';
import IconTitle from '@image/icon_title.svg';
import IconFile from '@icon/IconFile';
import IconFolder from '@icon/IconFolder';
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
const {DirectoryTree} = Tree;

const EMPTY_MENU: EmptyMenu = {
    menuSeq: undefined,
    upMenuSeq: undefined,
    menuNm: '',
    menuTypeCd: undefined,
    menuViewPath: '',
    menuUrl: '',
    useYn: undefined,
    sortSeq: undefined
};

const getTreeKey = (v: MenuInfo, menuList: MenuInfo[]): React.Key =>
    v.menuSeq != null ? v.menuSeq : `_new_${v.upMenuSeq}_${menuList.indexOf(v)}`;

const isItemChanged = (originalItem: MenuInfo, newItem: MenuInfo): boolean => {
    for (const key of Object.keys(newItem) as (keyof MenuInfo)[]) {
        if (originalItem[key] !== newItem[key]) return true;
    }
    return false;
};

const cloneTreeWithoutIcon = (nodes: MenuTree[]): MenuTree[] =>
    nodes.map(({icon, children, ...rest}) => ({
        ...rest,
        ...(children ? {children: cloneTreeWithoutIcon(children)} : {}),
    }));

const getMenuIcon = (v: MenuInfo, isLeaf: boolean) => {
    if (v.iudType === IudType.I) return () => <PlusCircleOutlined />;
    if (v.iudType === IudType.U) return () => <CheckCircleOutlined />;
    return isLeaf ? () => <IconFile /> : () => <IconFolder />;
};

const buildChildNodes = (parentTreeNode: MenuTree, parentMenuObject: MenuInfo, menuList: MenuInfo[]) => {
    menuList.forEach((v: MenuInfo) => {
        if (parentMenuObject.menuSeq !== v.upMenuSeq) return;

        const nodeKey = getTreeKey(v, menuList);
        const baseNode: MenuTree = {title: v.menuNm, key: nodeKey, useYn: v.useYn};

        if (v.menuTypeCd === MenuType.V) {
            parentTreeNode.children?.push({...baseNode, icon: getMenuIcon(v, true)});
        } else if (v.menuTypeCd === MenuType.D) {
            const dirNode: MenuTree = {...baseNode, icon: getMenuIcon(v, false), children: []};
            parentTreeNode.children?.push(dirNode);
            buildChildNodes(dirNode, v, menuList);
        }
    });
};

const filterSearchView = (parent: MenuTree, root: MenuTree, viewList: MenuTree[], searchParam?: MenuListSearchParam) => {
    if (searchParam?.menuNm && viewList) {
        viewList
            .filter(v => v?.title?.toString().includes(searchParam.menuNm))
            .forEach(v => {
                if (searchParam.isExceptUnused && v.useYn !== 'Y') return;
                parent?.children?.push({...v, icon: () => (<IconFile />)});
            });
    } else if (searchParam?.isExceptUnused && viewList) {
        viewList
            .filter(v => v?.useYn === 'Y')
            .forEach(v => {
                parent?.children?.push({...v, icon: () => (<IconFile />)});
            });
    }
    root?.children?.push(parent);
};

const MenuManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const {confirm} = useMessage();
    const userInfo = useRecoilValue(sessionInfoAtom);
    const {
        control: searchFormControl,
        handleSubmit: searchFormHandleSubmit,
        watch: searchFormWatch,
        getValues: searchFormGetValues,
    } = useForm<MenuListSearchParam>({mode: 'all'});
    const {
        register: saveFormRegister,
        control: saveFormControl,
        handleSubmit: saveFormHandleSubmit,
        formState: {errors: saveFormErrors},
        reset: saveFormReset,
        getValues: saveFormGetValues,
        setValue: saveFormSetValue,
        clearErrors: saveFormClearErrors,
        watch: saveFormWatch,
    } = useForm<MenuInfo>({mode: 'all'});

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
    const isSaveFormErrors = Object.keys(saveFormErrors).length > 0;
    const isChangedDataSource = dataSource.some(v => v.iudType);

    const [rowSeq, setRowSeq] = useState<any[]>([]);
    const [btnList, setBtnList] = useState<BtnInfo[]>([]);
    const [menuBtnState, setMenuBtnState] = useState<Array<{btnSeq: number; sortSeq: number; btnNm: string; useYn: string}>>([]);

    const getCurrentRowDataSourceBySeq = (menuSeq: number | React.Key) => {
        if (typeof menuSeq === 'string' && menuSeq.startsWith('_new_')) {
            const parts = menuSeq.split('_');
            const idx = parts[3] !== undefined ? Number(parts[3]) : -1;
            if (idx >= 0 && dataSource[idx]?.menuSeq == null) return dataSource[idx];
            const upMenuSeq = parts[2] !== undefined ? Number(parts[2]) : undefined;
            return dataSource.find(v => v.menuSeq == null && v.upMenuSeq === upMenuSeq);
        }
        return dataSource.find(v => v.menuSeq === menuSeq);
    };

    const createParentMenuCombo = () => {
        setParentMenuCombo(
            dataSource
                .filter(v => v.menuSeq != null)
                .map(v => ({value: v.menuSeq as any, label: v.menuNm, level: v.level}))
        );
    };

    const onSelectChange = async (keys: any[]) => {
        setSelectedKeys(keys);
        const row = getCurrentRowDataSourceBySeq(keys[0]);
        saveFormReset(row);
        setIsRowSelected(true);
        createParentMenuCombo();

        if (row?.menuSeq != null && row.menuSeq > 0 && row.iudType !== IudType.I) {
            const res = await callGetMenuBtnList(row.menuSeq);
            const list = res?.item ?? [];
            const merged = (btnList.length ? btnList : []).map(btn => {
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
            setMenuBtnState(
                btnList.map(btn => ({
                    btnSeq: btn.btnSeq,
                    sortSeq: btn.sortSeq,
                    btnNm: '',
                    useYn: 'N',
                }))
            );
        }
    };

    const onSelect: DirectoryTreeProps['onSelect'] = async (keys: any[]) => {
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
            setDataSource(structuredClone(orgDataSource));
        }
        setRowSeq(keys);
        onSelectChange(keys);
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys: any[], info) => {
        if (!info.node.expanded && expandedKey) {
            setExpandedKey([...expandedKey, info.node.key]);
        }
        if (info.node.expanded && expandedKey) {
            setExpandedKey(expandedKey.filter(v => v !== info.node.key));
        }
    };

    const handleDataChanged = () => {
        const formData = saveFormGetValues();
        const changedDataSource = dataSource.map(item => {
            if (item.menuSeq !== formData.menuSeq) return item;
            if (!isItemChanged(item, formData)) return item;

            const updated = {...item, ...formData, iudType: item.iudType ?? IudType.U};
            if (updated.menuTypeCd === MenuType.D) {
                updated.menuUrl = '';
                updated.menuViewPath = '';
            }
            return updated;
        });
        setDataSource(changedDataSource);
    };

    const markMenuUpdatedByButtonChange = () => {
        const selectedKey = rowSeq?.[0] ?? selectedKeys?.[0];
        if (selectedKey == null) return;

        const current = getCurrentRowDataSourceBySeq(selectedKey);
        if (!current || current.iudType === IudType.I) return;

        setDataSource(prev =>
            prev.map(item =>
                item.menuSeq === current.menuSeq ? {...item, iudType: IudType.U} : item
            )
        );
    };

    const updateMenuBtnUseYn = (btnSeq: number, useYn: string, prevUseYn: string) => {
        if (prevUseYn === useYn) return;
        setMenuBtnState(prev =>
            prev.map(b => Number(b.btnSeq) === Number(btnSeq) ? {...b, useYn} : b)
        );
        markMenuUpdatedByButtonChange();
    };

    const updateMenuBtnNm = (btnSeq: number, btnNm: string, prevBtnNm: string) => {
        if (prevBtnNm === btnNm) return;
        setMenuBtnState(prev =>
            prev.map(b => Number(b.btnSeq) === Number(btnSeq) ? {...b, btnNm} : b)
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
        if (!await confirm('저장 하시겠습니까?')) return;

        const selectedKey = rowSeq?.[0] ?? selectedKeys?.[0];
        const menu = selectedKey != null ? getCurrentRowDataSourceBySeq(selectedKey) : undefined;
        if (!menu) {
            message.info('선택한 메뉴 정보를 찾을 수 없습니다.');
            return;
        }

        const menuBtnList = menuBtnState.map(b => ({
            btnSeq: b.btnSeq,
            btnNm: b.btnNm,
            useYn: b.useYn,
        }));
        const res = await callSaveMenu({...menu, menuBtnList});
        if (res.code === HttpStatusCode.Ok) {
            message.success('저장이 완료되었습니다.');
            saveFormReset(EMPTY_MENU);
            callGetMenuInfo().then(menuRes => {
                setIsRowSelected(true);
                setDataSource(structuredClone(menuRes.item));
                setOrgDataSource(structuredClone(menuRes.item));
            });
            onSelectChange(rowSeq);
        }
    };

    const handleSearch = async () => {
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if (!result) return;
        }
        saveFormReset(EMPTY_MENU);
        setSelectedKeys([]);
        setRowSeq([]);
        const res = await callGetMenuInfo();
        setIsRowSelected(false);
        setDataSource(structuredClone(res.item));
        setOrgDataSource(structuredClone(res.item));
    };

    const handleAdd = async () => {
        if (isSaveFormErrors) return true;

        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }

        const newMenu: MenuInfo = {
            ...structuredClone(EMPTY_MENU),
            upMenuSeq: orgDataSource.length > 0
                ? orgDataSource.find(v => v.upMenuSeq === null)?.menuSeq ?? 0
                : 0,
            menuNm: '',
            menuTypeCd: MenuType.D,
            useYn: 'Y',
            iudType: IudType.I,
        } as MenuInfo;
        setDataSource(orgDataSource.concat([newMenu]));
    };

    const handleDelete = async () => {
        if (!isRowSelected) {
            message.info('선택한 메뉴가 없습니다.');
            return;
        }
        const menuSeq = saveFormGetValues('menuSeq');
        if (saveFormGetValues('menuTypeCd') === MenuType.D && dataSource.some(v => v.upMenuSeq === menuSeq)) {
            message.error('하위에 포함된 메뉴가 존재할 경우 삭제할 수 없습니다.');
            return;
        }

        if (!await confirm('삭제하시겠습니까?')) return;

        const result = await callDeleteMenu(menuSeq);
        if (result.code === HttpStatusCode.Ok) {
            handleSearch();
        }
    };

    const handleReset = async () => {
        if (!await confirm('저장하지 않은 정보는 초기화됩니다. 계속 하시겠습니까?')) return;

        const currentMenuSeq = saveFormGetValues('menuSeq');
        const changedDataSource = dataSource.map(item => {
            if (item.menuSeq !== currentMenuSeq) return item;
            const original = orgDataSource.find(v => v.menuSeq === currentMenuSeq);
            if (original) {
                return {...original, iudType: item.iudType !== IudType.I ? undefined : item.iudType};
            }
            return {...item, iudType: item.iudType !== IudType.I ? undefined : item.iudType};
        });
        setDataSource(changedDataSource);
        onSelectChange([]);
        saveFormReset(EMPTY_MENU);
        setIsRowSelected(false);
        setRowSeq([]);
    };

    const handleFilter = () => {
        const menuNm = searchFormGetValues('menuNm');
        const isExceptUnused = searchFormGetValues('isExceptUnused');

        if (!menuNm && !isExceptUnused) {
            createMenuTree(orgDataSource);
            return;
        }

        const searchParam: MenuListSearchParam = {menuNm, isExceptUnused: isExceptUnused ?? false};
        const root: MenuTree[] = [];
        if (orgTreeData?.length) {
            root.push({...orgTreeData[0], icon: () => (<FolderOpenOutlined />), children: []});
            searchDirectory(root, cloneTreeWithoutIcon(orgTreeData[0].children as MenuTree[]), searchParam);
        }
    };

    const searchDirectory = (root: MenuTree[], directoryTree: MenuTree[], searchParam?: MenuListSearchParam) => {
        directoryTree.forEach((item: MenuTree) => {
            if (!item) return;
            if (searchParam?.isExceptUnused && item.useYn !== 'Y') return;

            filterSearchView(
                {...item, icon: () => (<IconFolder />), children: []},
                root[0],
                item.children as MenuTree[],
                searchParam
            );
        });
        setTreeData(root);
    };

    const createMenuTree = (menuList: MenuInfo[]) => {
        if (menuList.length < 1) return;
        const rootKey = menuList[0].menuSeq ?? 0;
        const menuTree: MenuTree = {title: menuList[0].menuNm, key: rootKey, icon: () => (<FolderOpenOutlined />), children: []};
        buildChildNodes(menuTree, menuList[0], menuList);
        setTreeData([menuTree]);
        setOrgTreeData([menuTree]);
    };

    const createExpandedKey = (menuList: MenuInfo[]) =>
        setExpandedKey(menuList.filter(v => v.menuTypeCd === MenuType.D && v.menuSeq != null).map(v => v.menuSeq as React.Key));

    const expandTree = () =>
        setExpandedKey(dataSource.filter(v => v.menuTypeCd === MenuType.D && v.menuSeq != null).map(v => v.menuSeq as React.Key));

    const foldTree = () =>
        setExpandedKey(dataSource.filter(v => v.upMenuSeq === null && v.menuSeq != null).map(v => v.menuSeq as React.Key));

    useEffect(() => {
        if (!dataSource.length) return;
        createMenuTree(dataSource);
        createParentMenuCombo();
        createExpandedKey(dataSource);
    }, [dataSource]);

    useEffect(() => {
        if (searchFormGetValues('menuNm') || searchFormGetValues('isExceptUnused'))
            handleFilter();
    }, [orgDataSource]);

    useEffect(() => {
        handleFilter();
    }, [searchFormWatch('menuNm'), searchFormWatch('isExceptUnused')]);

    useEffect(() => {
        if (!dataSource.some(v => v.iudType === IudType.I)) return;
        const newItems = dataSource.filter(v => v.iudType === IudType.I);
        if (treeData?.length && newItems.length > 0) {
            const keysToSelect = newItems.map(v => getTreeKey(v, dataSource));
            onSelectChange(keysToSelect);
            setSelectable(true);
        }
    }, [treeData]);

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        callGetBtnList().then(res => {
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

    if (Object.keys(cmCode).length === 0) return null;

    return (
        <>
            <section className="search-wrap">
                <form>
                    <span>메뉴명</span>
                    <CustomValidFormInput name={'menuNm'}
                                          placeholder="검색할 ID를 입력해 주세요."
                                          control={searchFormControl}
                                          onChangeValue={() => handleFilter()}
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
                        {treeData ? (
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
                            />
                        ) : null}
                    </div>
                </div>

                <div className="right-panel">
                    <form onSubmit={saveFormHandleSubmit(handleSave)} style={{height: '100%'}}>
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
                                                rules={{required: '상위메뉴를 선택해 주세요.'}}
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
                                                rules={{required: '메뉴명이 입력되지 않았습니다.'}}
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
                                                rules={{required: '메뉴타입이 선택되지 않았습니다.'}}
                                                onChangeValue={(value: MenuType) => {
                                                    if (value === MenuType.D) {
                                                        saveFormClearErrors(['menuUrl', 'menuViewPath']);
                                                    }
                                                    setTimeout(() => {
                                                        handleDataChanged();
                                                        createParentMenuCombo();
                                                    }, 0);
                                                }}
                                                options={Object.keys(cmCode['MenuType']).map(key => ({value: key, label: cmCode['MenuType'][key]}))}
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
                                                rules={{required: '사용여부가 선택되지 않았습니다.'}}
                                                onChangeValue={() => setTimeout(handleDataChanged, 0)}
                                                options={[{value: 'Y', label: '예'}, {value: 'N', label: '아니오'}]}
                                            />

                                            <CustomSaveFormInput
                                                title={'조회순서'}
                                                required={true}
                                                disabled={!isEditable}
                                                control={saveFormControl}
                                                name="sortSeq"
                                                regExp={{value: /^\d*$/, message: '숫자만 입력 가능합니다.'}}
                                                rules={{required: '조회순서를 입력해 주세요.'}}
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
                            <div className="board-title-wrap" style={{marginTop: 16}}>
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
                                            <col style={{width: '120px'}} />
                                            <col style={{width: '80px'}} />
                                            <col style={{width: '80px'}} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>버튼명</th>
                                                <th>사용</th>
                                                <th>미사용</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {btnList.filter(b => b.sortSeq >= 11 && b.sortSeq <= 15).map(btn => {
                                                const state = menuBtnState.find(s => Number(s.btnSeq) === Number(btn.btnSeq));
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
                                            <col style={{width: '120px'}} />
                                            <col style={{width: '200px'}} />
                                            <col style={{width: '80px'}} />
                                            <col style={{width: '80px'}} />
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
                                            {btnList.filter(b => b.sortSeq >= 1 && b.sortSeq <= 9).map(btn => {
                                                const state = menuBtnState.find(s => Number(s.btnSeq) === Number(btn.btnSeq));
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
                                                                style={{width: '100%'}}
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
