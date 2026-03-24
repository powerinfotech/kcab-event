import React, {useEffect, useRef, useState} from 'react';
import {message} from 'antd';
import {useForm} from 'react-hook-form';
import {HttpStatusCode} from 'axios';
import {DefaultOptionType} from 'rc-select/lib/Select';
import {FolderOpenOutlined, PlusCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import {callDeleteMenu, callGetBtnList, callGetMenuBtnList, callGetMenuInfo, callSaveMenu} from '@api/auth/MenuManagementApi';
import {BtnInfo, EmptyMenu, MenuBtnInfo, MenuInfo, MenuListSearchParam, MenuTree, MenuType} from '@interface/auth/MenuManagement';
import {IudType} from '@interface/common';
import {useMessage} from '@hook/useMessage';
import IconFile from '@icon/IconFile';
import IconFolder from '@icon/IconFolder';

const EMPTY_MENU: EmptyMenu = {
    menuSeq: undefined,
    upMenuSeq: undefined,
    menuNm: '',
    menuTypeCd: undefined,
    menuViewPath: '',
    menuUrl: '',
    useYn: undefined,
    sortSeq: undefined,
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
                parent?.children?.push({...v, icon: () => <IconFile />});
            });
    } else if (searchParam?.isExceptUnused && viewList) {
        viewList
            .filter(v => v?.useYn === 'Y')
            .forEach(v => {
                parent?.children?.push({...v, icon: () => <IconFile />});
            });
    }
    root?.children?.push(parent);
};

export interface MenuBtnState {
    btnSeq: number;
    sortSeq: number;
    btnNm: string;
    useYn: string;
}

export function useMenuManagement() {
    const {confirm} = useMessage();

    const searchForm = useForm<MenuListSearchParam>({mode: 'all'});
    const saveForm = useForm<MenuInfo>({mode: 'all'});

    const [treeData, setTreeData] = useState<MenuTree[]>();
    const [orgTreeData, setOrgTreeData] = useState<MenuTree[]>();
    const [parentMenuCombo, setParentMenuCombo] = useState<DefaultOptionType[]>([]);
    const [expandedKey, setExpandedKey] = useState<React.Key[]>();
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [dataSource, setDataSource] = useState<MenuInfo[]>([]);
    const [orgDataSource, setOrgDataSource] = useState<MenuInfo[]>([]);
    const [selectable, setSelectable] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

    const isEditable = isRowSelected;
    const isViewMenu = saveForm.watch('menuTypeCd') === 'V';
    const isSaveFormErrors = Object.keys(saveForm.formState.errors).length > 0;
    const isChangedDataSource = dataSource.some(v => v.iudType);

    const [rowSeq, setRowSeq] = useState<any[]>([]);
    const [btnList, setBtnList] = useState<BtnInfo[]>([]);
    const [menuBtnState, setMenuBtnState] = useState<MenuBtnState[]>([]);
    const newItemBtnInitializedRef = useRef(false);

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
                .filter(v => v.menuSeq != null && v.menuTypeCd === 'D')
                .map(v => ({value: v.menuSeq as any, label: v.menuNm, level: v.level}))
        );
    };

    const onSelectChange = async (keys: any[]) => {
        setSelectedKeys(keys);
        const row = getCurrentRowDataSourceBySeq(keys[0]);
        saveForm.reset(row);
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
            if (!newItemBtnInitializedRef.current) {
                newItemBtnInitializedRef.current = true;
                setMenuBtnState(
                    btnList.map(btn => ({
                        btnSeq: btn.btnSeq,
                        sortSeq: btn.sortSeq,
                        btnNm: '',
                        useYn: 'N',
                    }))
                );
            }
        }
    };

    const onSelect = async (keys: any[]) => {
        if (isChangedDataSource) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
            setDataSource(structuredClone(orgDataSource));
        }
        newItemBtnInitializedRef.current = false;
        setRowSeq(keys);
        onSelectChange(keys);
    };

    const onExpand = (keys: any[], info: any) => {
        if (!info.node.expanded && expandedKey) {
            setExpandedKey([...expandedKey, info.node.key]);
        }
        if (info.node.expanded && expandedKey) {
            setExpandedKey(expandedKey.filter(v => v !== info.node.key));
        }
    };

    const handleDataChanged = () => {
        const formData = saveForm.getValues();
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
            saveForm.reset(EMPTY_MENU);
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
        saveForm.reset(EMPTY_MENU);
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
        newItemBtnInitializedRef.current = false;
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
        const menuSeq = saveForm.getValues('menuSeq');
        if (saveForm.getValues('menuTypeCd') === MenuType.D && dataSource.some(v => v.upMenuSeq === menuSeq)) {
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
        const currentMenuSeq = saveForm.getValues('menuSeq');
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
        saveForm.reset(EMPTY_MENU);
        setIsRowSelected(false);
        setRowSeq([]);
    };

    // --- Tree building & filtering ---

    const createMenuTree = (menuList: MenuInfo[]) => {
        if (menuList.length < 1) return;
        const rootKey = menuList[0].menuSeq ?? 0;
        const menuTree: MenuTree = {title: menuList[0].menuNm, key: rootKey, icon: () => <FolderOpenOutlined />, children: []};
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

    const searchDirectory = (root: MenuTree[], directoryTree: MenuTree[], searchParam?: MenuListSearchParam) => {
        directoryTree.forEach((item: MenuTree) => {
            if (!item) return;
            if (searchParam?.isExceptUnused && item.useYn !== 'Y') return;
            filterSearchView(
                {...item, icon: () => <IconFolder />, children: []},
                root[0],
                item.children as MenuTree[],
                searchParam
            );
        });
        setTreeData(root);
    };

    const handleFilter = () => {
        const menuNm = searchForm.getValues('menuNm');
        const isExceptUnused = searchForm.getValues('isExceptUnused');
        if (!menuNm && !isExceptUnused) {
            createMenuTree(orgDataSource);
            return;
        }
        const searchParam: MenuListSearchParam = {menuNm, isExceptUnused: isExceptUnused ?? false};
        const root: MenuTree[] = [];
        if (orgTreeData?.length) {
            root.push({...orgTreeData[0], icon: () => <FolderOpenOutlined />, children: []});
            searchDirectory(root, cloneTreeWithoutIcon(orgTreeData[0].children as MenuTree[]), searchParam);
        }
    };

    // --- Effects ---

    useEffect(() => {
        if (!dataSource.length) return;
        createMenuTree(dataSource);
        createParentMenuCombo();
        createExpandedKey(dataSource);
    }, [dataSource]);

    useEffect(() => {
        if (searchForm.getValues('menuNm') || searchForm.getValues('isExceptUnused'))
            handleFilter();
    }, [orgDataSource]);

    useEffect(() => {
        handleFilter();
    }, [searchForm.watch('menuNm'), searchForm.watch('isExceptUnused')]);

    useEffect(() => {
        if (!dataSource.some(v => v.iudType === IudType.I)) return;
        const newItems = dataSource.filter(v => v.iudType === IudType.I);
        if (treeData?.length && newItems.length > 0) {
            const keysToSelect = newItems.map(v => getTreeKey(v, dataSource));
            setRowSeq(keysToSelect);
            onSelectChange(keysToSelect);
            setSelectable(true);
        }
    }, [treeData]);

    useEffect(() => { handleSearch(); }, []);
    useEffect(() => { callGetBtnList().then(res => { if (res?.item?.length) setBtnList(res.item); }); }, []);

    useEffect(() => {
        if (btnList.length > 0 && selectedKeys?.length > 0 && menuBtnState.length === 0) {
            onSelectChange(selectedKeys);
        }
    }, [btnList.length]);

    return {
        // Forms
        searchForm,
        saveForm,

        // Tree state
        treeData,
        expandedKey,
        selectable,
        selectedKeys,

        // Data state
        dataSource,
        parentMenuCombo,

        // UI state
        isEditable,
        isViewMenu,

        // Button state
        btnList,
        menuBtnState,

        // Handlers
        onSelect,
        onExpand,
        expandTree,
        foldTree,
        handleDataChanged,
        handleFilter,
        handleSearch,
        handleAdd,
        handleDelete,
        handleReset,
        handleSave,
        updateMenuBtnUseYn,
        updateMenuBtnNm,
        createParentMenuCombo,
    };
}
