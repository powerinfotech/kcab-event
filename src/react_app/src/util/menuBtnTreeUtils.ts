/**
 * menuBtnTreeUtils - 메뉴-버튼 권한 트리 구성 유틸
 *
 * [목적]
 * 백엔드에서 받아온 평탄화(flat)된 메뉴-버튼 권한 목록을
 * Ant Design Table(트리 테이블)에서 사용할 수 있는 계층 구조로 변환한다.
 * 권한 관리 화면(AuthMenuManagement)에서 메뉴별 버튼 권한을 체크박스로 관리할 때 사용.
 *
 * [사용 방법]
 * @example
 * import { buildMenuBtnTree, getAllExpandKeys, foldLeafParents } from '@util/menuBtnTreeUtils';
 *
 * // 1. API에서 받은 flat 데이터를 트리로 변환
 * const { tree, columns, expandKeys } = buildMenuBtnTree(flatList, { trackIudType: true });
 *
 * // 2. 트리 테이블에 적용
 * <Table dataSource={tree} expandedRowKeys={expandKeys} ... />
 *
 * // 3. 전체 펼치기
 * setExpandedKeys(getAllExpandKeys(tree));
 *
 * // 4. 말단 메뉴만 접기
 * setExpandedKeys(foldLeafParents(tree, currentExpandedKeys));
 */
import React from 'react';
import {AuthMenuBtnItem, AuthMenuBtnRow, BtnColumnInfo} from '@interface/auth/AuthMenuManagement';

/**
 * 버튼 정렬 우선순위 결정
 * - btnSortSeq 11~15: 기본 버튼 (조회, 저장 등) → 우선 표시
 * - 그 외: 커스텀 버튼 → 후순위 표시
 */
const btnSortOrder = (seq: number) => (seq >= 11 && seq <= 15) ? 0 : 1;

/** buildMenuBtnTree 반환 타입 */
export interface BuildMenuBtnTreeResult {
    /** 계층 구조의 트리 데이터 (Table dataSource용) */
    tree: AuthMenuBtnRow[];
    /** 버튼 컬럼 정보 (동적 컬럼 생성용) */
    columns: BtnColumnInfo[];
    /** 기본 펼침 키 목록 (menuTypeCd가 'D'인 디렉토리 메뉴) */
    expandKeys: React.Key[];
}

/**
 * 평탄화된 메뉴-버튼 권한 목록을 트리 구조로 변환
 *
 * [처리 과정]
 * 1단계: 버튼 컬럼 정보 추출 및 정렬
 * 2단계: menuSeq 기준으로 그룹핑, 각 버튼의 활성화/체크 상태를 동적 필드로 매핑
 * 3단계: upMenuSeq(상위메뉴)를 기준으로 부모-자식 트리 구조 빌드
 * 4단계: 기본 펼침 대상 키 추출 (디렉토리 타입 메뉴)
 *
 * @param flatList      - 백엔드에서 받은 평탄화된 메뉴-버튼 권한 목록
 * @param options       - 옵션
 * @param options.trackIudType - true이면 각 버튼에 authMenuBtnSeq, iudType 필드 추가 (저장 시 변경 추적용)
 * @returns { tree, columns, expandKeys }
 *
 * @example
 * // 기본 사용 (조회 전용)
 * const { tree, columns, expandKeys } = buildMenuBtnTree(flatList);
 *
 * // 변경 추적 포함 (저장 기능이 있는 화면)
 * const { tree, columns, expandKeys } = buildMenuBtnTree(flatList, { trackIudType: true });
 */
export function buildMenuBtnTree(
    flatList: AuthMenuBtnItem[],
    options?: { trackIudType?: boolean },
): BuildMenuBtnTreeResult {
    const trackIudType = options?.trackIudType ?? false;

    // 1단계: 버튼 칼럼 정보 추출 (중복 제거 후 정렬)
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

    // 2단계: menuSeq별 그룹핑 및 버튼 상태 매핑
    //   - btn_{btnSeq}_enabled  : 해당 메뉴에서 이 버튼이 사용 가능한지 (메뉴-버튼 매핑 여부)
    //   - btn_{btnSeq}_checked  : 현재 권한그룹에 이 버튼 권한이 부여되었는지
    //   - btn_{btnSeq}_authMenuBtnSeq : 권한 레코드 시퀀스 (trackIudType일 때)
    //   - btn_{btnSeq}_iudType  : 변경 추적 상태 (trackIudType일 때)
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

    // 3단계: 부모-자식 관계로 트리 구조 빌드
    //   - upMenuSeq가 없는 항목 → 루트 노드
    //   - upMenuSeq가 있는 항목 → 부모 노드의 children에 추가
    const roots: AuthMenuBtnRow[] = [];
    menuMap.forEach(node => {
        if (node.upMenuSeq == null) {
            roots.push(node);
        } else {
            const parent = menuMap.get(node.upMenuSeq);
            if (parent) parent.children!.push(node);
        }
    });

    // children이 비어있으면 제거 (leaf 노드 - Ant Table에서 확장 아이콘 미표시)
    menuMap.forEach(node => {
        if (node.children && node.children.length === 0) {
            delete node.children;
        }
    });

    // 4단계: 디렉토리 타입(menuTypeCd === 'D') 메뉴를 기본 펼침 대상으로 설정
    const expandKeys = Array.from(menuMap.values())
        .filter(n => n.menuTypeCd === 'D')
        .map(n => n.menuSeq);

    return {tree: roots, columns, expandKeys};
}

/**
 * 트리의 모든 펼침 가능한 노드의 키를 재귀적으로 수집
 * - children이 있는 노드만 포함 (leaf 노드 제외)
 * - "전체 펼치기" 기능에 사용
 *
 * @param nodes - 트리 데이터
 * @returns 펼침 가능한 모든 노드의 menuSeq 배열
 *
 * @example
 * // 전체 펼치기 버튼 클릭 시
 * setExpandedRowKeys(getAllExpandKeys(treeData));
 */
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

/**
 * 말단 부모 노드(자식은 있지만 손자는 없는 노드)를 접기
 * - 최하위 depth의 폴더만 접어서 한 단계씩 축소하는 효과
 * - "접기" 버튼에 사용
 *
 * @param nodes       - 트리 데이터
 * @param currentKeys - 현재 펼쳐진 키 목록
 * @returns 말단 부모를 제외한 나머지 펼침 키 목록
 *
 * @example
 * // 접기 버튼 클릭 시
 * setExpandedRowKeys(foldLeafParents(treeData, expandedRowKeys));
 */
export function foldLeafParents(nodes: AuthMenuBtnRow[], currentKeys: React.Key[]): React.Key[] {
    const keysToRemove = new Set<React.Key>();
    const findLeafParents = (items: AuthMenuBtnRow[]) => {
        items.forEach(n => {
            if (n.children && n.children.length > 0) {
                // 자식 중 손자를 가진 노드가 없으면 → 말단 부모
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
