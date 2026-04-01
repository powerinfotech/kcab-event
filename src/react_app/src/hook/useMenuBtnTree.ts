/**
 * useMenuBtnTree - 메뉴-버튼 권한 트리 테이블 관리 훅
 *
 * [목적]
 * 권한 관리 화면에서 사용하는 메뉴-버튼 트리 테이블의 상태와 동작을 통합 관리.
 * API에서 받은 flat 데이터를 트리로 변환하고, 펼치기/접기, 동적 컬럼 생성,
 * 원본 데이터 보관(변경 감지용) 등을 처리한다.
 *
 * [사용 방법]
 * @example
 * const {
 *   treeDataSource,         // 트리 테이블 dataSource
 *   expandedRowKeys,        // 현재 펼쳐진 행 키
 *   setExpandedRowKeys,     // 펼침 키 직접 설정
 *   loadTreeWithOrg,        // API 데이터 → 트리 변환 + 원본 보관
 *   expandTree,             // 전체 펼치기
 *   foldTree,               // 말단 접기
 *   buildDynamicColumns,    // 체크박스 컬럼 동적 생성
 * } = useMenuBtnTree({ trackIudType: true });
 *
 * // API 조회 후 트리 로드
 * const res = await callGetAuthMenuBtnList(authGrpSeq);
 * loadTreeWithOrg(res.item);
 *
 * // 동적 컬럼 생성 (체크박스 렌더러 전달)
 * const columns = buildDynamicColumns((record, btn) => (
 *   <Checkbox
 *     checked={record[`btn_${btn.btnSeq}_checked`]}
 *     onChange={(e) => handleCheckChange(record, btn, e.target.checked)}
 *   />
 * ));
 *
 * // 테이블에 적용
 * <Table
 *   dataSource={treeDataSource}
 *   columns={columns}
 *   expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
 *   rowKey="menuSeq"
 * />
 */
import React, {useState, useCallback} from 'react';
import type { TableColumnsType } from 'antd';
import {AuthMenuBtnItem, AuthMenuBtnRow, BtnColumnInfo} from '@interface/auth/AuthMenuManagement';
import {buildMenuBtnTree, getAllExpandKeys, foldLeafParents} from '@util/menuBtnTreeUtils';

interface UseMenuBtnTreeOptions {
    /** true이면 각 버튼에 authMenuBtnSeq, iudType 필드를 추가하여 변경 추적 */
    trackIudType?: boolean;
}

interface UseMenuBtnTreeReturn {
    /** 트리 구조로 변환된 테이블 dataSource */
    treeDataSource: AuthMenuBtnRow[];
    setTreeDataSource: React.Dispatch<React.SetStateAction<AuthMenuBtnRow[]>>;
    /** 원본 트리 데이터 (변경 감지용, loadTreeWithOrg 호출 시 저장) */
    orgTreeDataSource: AuthMenuBtnRow[];
    setOrgTreeDataSource: React.Dispatch<React.SetStateAction<AuthMenuBtnRow[]>>;
    /** 버튼 컬럼 정보 (동적 컬럼 생성에 사용) */
    btnColumns: BtnColumnInfo[];
    setBtnColumns: React.Dispatch<React.SetStateAction<BtnColumnInfo[]>>;
    /** 현재 펼쳐진 행의 키 목록 */
    expandedRowKeys: React.Key[];
    setExpandedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
    /** 전체 펼치기 */
    expandTree: () => void;
    /** 말단 부모 노드만 접기 (한 단계씩 축소) */
    foldTree: () => void;
    /** flat 데이터 → 트리 변환 후 상태 설정 (반환값: 트리 데이터) */
    loadTree: (flatList: AuthMenuBtnItem[]) => AuthMenuBtnRow[];
    /** flat 데이터 → 트리 변환 + 원본 deep copy 보관 (변경 감지용) */
    loadTreeWithOrg: (flatList: AuthMenuBtnItem[]) => void;
    /** 메뉴명 + 버튼 체크박스 동적 컬럼 생성 */
    buildDynamicColumns: (checkboxRenderer: (record: AuthMenuBtnRow, btn: BtnColumnInfo) => React.ReactNode) => TableColumnsType<AuthMenuBtnRow>;
}

/**
 * 메뉴-버튼 권한 트리 테이블 관리 훅
 *
 * @param options - { trackIudType: true } 시 변경 추적 필드 추가
 * @returns 트리 상태, 로드/펼치기/접기/컬럼 생성 함수
 */
export function useMenuBtnTree(options?: UseMenuBtnTreeOptions): UseMenuBtnTreeReturn {
    const [treeDataSource, setTreeDataSource] = useState<AuthMenuBtnRow[]>([]);
    const [orgTreeDataSource, setOrgTreeDataSource] = useState<AuthMenuBtnRow[]>([]);
    const [btnColumns, setBtnColumns] = useState<BtnColumnInfo[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    /**
     * flat 데이터를 트리로 변환하여 상태에 설정
     * @returns 변환된 트리 데이터
     */
    const loadTree = useCallback((flatList: AuthMenuBtnItem[]): AuthMenuBtnRow[] => {
        const result = buildMenuBtnTree(flatList, {trackIudType: options?.trackIudType});
        setBtnColumns(result.columns);
        setExpandedRowKeys(result.expandKeys);
        setTreeDataSource(result.tree);
        return result.tree;
    }, [options?.trackIudType]);

    /**
     * flat 데이터를 트리로 변환 + 원본 deep copy 보관
     * - 저장 시 원본(orgTreeDataSource)과 비교하여 변경된 항목만 추출할 때 사용
     */
    const loadTreeWithOrg = useCallback((flatList: AuthMenuBtnItem[]) => {
        const result = buildMenuBtnTree(flatList, {trackIudType: options?.trackIudType});
        setBtnColumns(result.columns);
        setExpandedRowKeys(result.expandKeys);
        setTreeDataSource(result.tree);
        setOrgTreeDataSource(JSON.parse(JSON.stringify(result.tree)));
    }, [options?.trackIudType]);

    /** 모든 노드 펼치기 */
    const expandTree = useCallback(() => {
        setExpandedRowKeys(getAllExpandKeys(treeDataSource));
    }, [treeDataSource]);

    /** 말단 부모 노드만 접기 (자식은 있지만 손자가 없는 노드) */
    const foldTree = useCallback(() => {
        setExpandedRowKeys(prev => foldLeafParents(treeDataSource, prev));
    }, [treeDataSource]);

    /**
     * 메뉴명 컬럼 + 버튼별 체크박스 컬럼을 동적으로 생성
     * - 첫 번째 컬럼: 메뉴명 (고정)
     * - 이후 컬럼: 각 버튼별 체크박스 (btnColumns 기반)
     * - 루트 메뉴(upMenuSeq==null)와 비활성 버튼은 빈칸 처리
     *
     * @param checkboxRenderer - 체크박스 렌더링 함수 (record, btn) => ReactNode
     */
    const buildDynamicColumns = useCallback((
        checkboxRenderer: (record: AuthMenuBtnRow, btn: BtnColumnInfo) => React.ReactNode,
    ): TableColumnsType<AuthMenuBtnRow> => {
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
                // 루트 메뉴는 체크박스 표시 안 함
                if (record.upMenuSeq == null) return '';
                // 해당 메뉴에서 이 버튼이 비활성이면 표시 안 함
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
