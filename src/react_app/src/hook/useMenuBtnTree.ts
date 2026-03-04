import React, {useState, useCallback} from 'react';
import {ColumnsType} from 'antd/es/table';
import {AuthMenuBtnItem, AuthMenuBtnRow, BtnColumnInfo} from '@interface/auth/AuthMenuManagement';
import {buildMenuBtnTree, getAllExpandKeys, foldLeafParents} from '@util/menuBtnTreeUtils';

interface UseMenuBtnTreeOptions {
    trackIudType?: boolean;
}

interface UseMenuBtnTreeReturn {
    treeDataSource: AuthMenuBtnRow[];
    setTreeDataSource: React.Dispatch<React.SetStateAction<AuthMenuBtnRow[]>>;
    orgTreeDataSource: AuthMenuBtnRow[];
    setOrgTreeDataSource: React.Dispatch<React.SetStateAction<AuthMenuBtnRow[]>>;
    btnColumns: BtnColumnInfo[];
    setBtnColumns: React.Dispatch<React.SetStateAction<BtnColumnInfo[]>>;
    expandedRowKeys: React.Key[];
    setExpandedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
    expandTree: () => void;
    foldTree: () => void;
    loadTree: (flatList: AuthMenuBtnItem[]) => AuthMenuBtnRow[];
    loadTreeWithOrg: (flatList: AuthMenuBtnItem[]) => void;
    buildDynamicColumns: (checkboxRenderer: (record: AuthMenuBtnRow, btn: BtnColumnInfo) => React.ReactNode) => ColumnsType<AuthMenuBtnRow>;
}

export function useMenuBtnTree(options?: UseMenuBtnTreeOptions): UseMenuBtnTreeReturn {
    const [treeDataSource, setTreeDataSource] = useState<AuthMenuBtnRow[]>([]);
    const [orgTreeDataSource, setOrgTreeDataSource] = useState<AuthMenuBtnRow[]>([]);
    const [btnColumns, setBtnColumns] = useState<BtnColumnInfo[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    const loadTree = useCallback((flatList: AuthMenuBtnItem[]): AuthMenuBtnRow[] => {
        const result = buildMenuBtnTree(flatList, {trackIudType: options?.trackIudType});
        setBtnColumns(result.columns);
        setExpandedRowKeys(result.expandKeys);
        setTreeDataSource(result.tree);
        return result.tree;
    }, [options?.trackIudType]);

    const loadTreeWithOrg = useCallback((flatList: AuthMenuBtnItem[]) => {
        const result = buildMenuBtnTree(flatList, {trackIudType: options?.trackIudType});
        setBtnColumns(result.columns);
        setExpandedRowKeys(result.expandKeys);
        setTreeDataSource(result.tree);
        setOrgTreeDataSource(JSON.parse(JSON.stringify(result.tree)));
    }, [options?.trackIudType]);

    const expandTree = useCallback(() => {
        setExpandedRowKeys(getAllExpandKeys(treeDataSource));
    }, [treeDataSource]);

    const foldTree = useCallback(() => {
        setExpandedRowKeys(prev => foldLeafParents(treeDataSource, prev));
    }, [treeDataSource]);

    const buildDynamicColumns = useCallback((
        checkboxRenderer: (record: AuthMenuBtnRow, btn: BtnColumnInfo) => React.ReactNode,
    ): ColumnsType<AuthMenuBtnRow> => {
        const menuNmColumn = {
            title: '메뉴명',
            dataIndex: 'menuNm',
            key: 'menuNm',
            width: 200,
        };

        const btnCols = btnColumns.map(btn => ({
            title: btn.btnNm,
            key: `btn_${btn.btnSeq}`,
            width: 80,
            align: 'center' as const,
            render: (_: any, record: AuthMenuBtnRow) => {
                if (record.upMenuSeq == null) return '';
                const enabled = record[`btn_${btn.btnSeq}_enabled`] as boolean;
                if (!enabled) return '';
                return checkboxRenderer(record, btn);
            },
        }));

        return [menuNmColumn, ...btnCols];
    }, [btnColumns]);

    return {
        treeDataSource,
        setTreeDataSource,
        orgTreeDataSource,
        setOrgTreeDataSource,
        btnColumns,
        setBtnColumns,
        expandedRowKeys,
        setExpandedRowKeys,
        expandTree,
        foldTree,
        loadTree,
        loadTreeWithOrg,
        buildDynamicColumns,
    };
}
