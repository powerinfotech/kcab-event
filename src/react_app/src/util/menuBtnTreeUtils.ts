import React from 'react';
import {AuthMenuBtnItem, AuthMenuBtnRow, BtnColumnInfo} from '@interface/auth/AuthMenuManagement';

const btnSortOrder = (seq: number) => (seq >= 11 && seq <= 15) ? 0 : 1;

export interface BuildMenuBtnTreeResult {
    tree: AuthMenuBtnRow[];
    columns: BtnColumnInfo[];
    expandKeys: React.Key[];
}

export function buildMenuBtnTree(
    flatList: AuthMenuBtnItem[],
    options?: { trackIudType?: boolean },
): BuildMenuBtnTreeResult {
    const trackIudType = options?.trackIudType ?? false;

    // 1. 버튼 칼럼 정보 추출
    const btnMap = new Map<number, BtnColumnInfo>();
    flatList.forEach(item => {
        if (!btnMap.has(item.btnSeq)) {
            btnMap.set(item.btnSeq, {
                btnSeq: item.btnSeq,
                btnSortSeq: item.btnSortSeq,
                btnNm: item.btnNm,
            });
        }
    });
    const columns = Array.from(btnMap.values()).sort((a, b) =>
        btnSortOrder(a.btnSortSeq) - btnSortOrder(b.btnSortSeq) || a.btnSortSeq - b.btnSortSeq
    );

    // 2. menuSeq별 그룹핑
    const menuMap = new Map<number, AuthMenuBtnRow>();
    flatList.forEach(item => {
        if (!menuMap.has(item.menuSeq)) {
            menuMap.set(item.menuSeq, {
                menuSeq: item.menuSeq,
                upMenuSeq: item.upMenuSeq,
                menuNm: item.menuNm,
                menuTypeCd: item.menuTypeCd,
                children: [],
            });
        }
        const node = menuMap.get(item.menuSeq)!;
        node[`btn_${item.btnSeq}_enabled`] = item.menuBtnUseYn === 'Y';
        node[`btn_${item.btnSeq}_checked`] = item.authMenuBtnUseYn === 'Y';
        if (trackIudType) {
            node[`btn_${item.btnSeq}_authMenuBtnSeq`] = item.authMenuBtnSeq;
            node[`btn_${item.btnSeq}_iudType`] = undefined;
        }
    });

    // 3. 트리 구조 빌드
    const roots: AuthMenuBtnRow[] = [];
    menuMap.forEach(node => {
        if (node.upMenuSeq == null) {
            roots.push(node);
        } else {
            const parent = menuMap.get(node.upMenuSeq);
            if (parent) parent.children!.push(node);
        }
    });

    // children이 비어있으면 제거 (leaf 노드)
    menuMap.forEach(node => {
        if (node.children && node.children.length === 0) {
            delete node.children;
        }
    });

    // 4. expand keys
    const expandKeys = Array.from(menuMap.values())
        .filter(n => n.menuTypeCd === 'D')
        .map(n => n.menuSeq);

    return {tree: roots, columns, expandKeys};
}

export function getAllExpandKeys(nodes: AuthMenuBtnRow[]): React.Key[] {
    const keys: React.Key[] = [];
    nodes.forEach(n => {
        if (n.children && n.children.length > 0) {
            keys.push(n.menuSeq);
            keys.push(...getAllExpandKeys(n.children));
        }
    });
    return keys;
}

export function foldLeafParents(nodes: AuthMenuBtnRow[], currentKeys: React.Key[]): React.Key[] {
    const keysToRemove = new Set<React.Key>();
    const findLeafParents = (items: AuthMenuBtnRow[]) => {
        items.forEach(n => {
            if (n.children && n.children.length > 0) {
                const hasGrandChildren = n.children.some(c => c.children && c.children.length > 0);
                if (!hasGrandChildren) {
                    keysToRemove.add(n.menuSeq);
                } else {
                    findLeafParents(n.children);
                }
            }
        });
    };
    findLeafParents(nodes);
    return currentKeys.filter(k => !keysToRemove.has(k));
}
