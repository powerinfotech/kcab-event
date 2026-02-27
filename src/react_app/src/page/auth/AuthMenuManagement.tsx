import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {HttpStatusCode} from 'axios';
import IconTitle from '@icon/IconTitle';
import CustomTable from '@component/CustomTable';
import CustomCheckbox from '@component/CustomCheckbox';
import {IudType, PageButtonHandlers} from '@interface/common';
import {useMessage} from '@hook/useMessage';
import {
    AuthMenuMgtAuth,
    AuthMenuBtnItem,
    AuthMenuBtnRow,
    BtnColumnInfo,
    AuthMenuBtnSaveItem,
} from '@interface/auth/AuthMenuManagement';
import {
    callGetAuthMenuMgtAuthList,
    callGetAuthMenuBtnList,
    callSaveAuthMenuBtn,
} from '@api/auth/AuthMenuManagementApi';

const AuthMenuManagement = ({handlersRef}: {
    onChange?: (flag: boolean) => void;
    menuInfo?: any;
    handlersRef?: React.MutableRefObject<PageButtonHandlers>;
}) => {
    const {confirm} = useMessage();

    // 좌측: 권한정보
    const [authDataSource, setAuthDataSource] = useState<AuthMenuMgtAuth[]>([]);
    const [orgAuthDataSource, setOrgAuthDataSource] = useState<AuthMenuMgtAuth[]>([]);
    const [selectedAuthRowIndex, setSelectedAuthRowIndex] = useState(-1);
    const [isIncludeUnusableAuth, setIsIncludeUnusableAuth] = useState(false);

    // 우측: 메뉴버튼권한
    const [treeDataSource, setTreeDataSource] = useState<AuthMenuBtnRow[]>([]);
    const [orgTreeDataSource, setOrgTreeDataSource] = useState<AuthMenuBtnRow[]>([]);
    const [btnColumns, setBtnColumns] = useState<BtnColumnInfo[]>([]);
    const [defaultExpandRowKeys, setDefaultExpandRowKeys] = useState<React.Key[]>([]);

    const [rowIndex, setRowIndex] = useState(-1);
    const [rowAuthGrpSeq, setRowAuthGrpSeq] = useState(-1);
    const [rowAuthSeq, setRowAuthSeq] = useState(-1);

    const selectedAuthRecord = () => authDataSource?.[selectedAuthRowIndex];
    const isEditableAuth = () => {
        const rec = selectedAuthRecord();
        return rec && rec.useYn === 'Y';
    };

    const isChanged = (): boolean => {
        return JSON.stringify(treeDataSource) !== JSON.stringify(orgTreeDataSource);
    };

    // ──────────────────────────── 좌측 grid 칼럼 ────────────────────────────
    const authColumns: ColumnsType<AuthMenuMgtAuth> = [
        {title: '권한그룹명', key: 'authGrpNm', dataIndex: 'authGrpNm', align: 'center', width: '20%'},
        {title: '권한명', key: 'authNm', dataIndex: 'authNm', align: 'center', width: '20%'},
        {title: '설명', key: 'authExpl', dataIndex: 'authExpl', align: 'center', width: '45%'},
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '15%',
            render: (value: string) => value === 'Y' ? '예' : '아니오',
        },
    ];

    // ──────────────────────────── flat → tree 변환 ────────────────────────────
    const buildMenuBtnTree = (flatList: AuthMenuBtnItem[]): AuthMenuBtnRow[] => {
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
        const columns = Array.from(btnMap.values()).sort((a, b) => a.btnSortSeq - b.btnSortSeq);
        setBtnColumns(columns);

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
            node[`btn_${item.btnSeq}_authMenuBtnSeq`] = item.authMenuBtnSeq;
            node[`btn_${item.btnSeq}_iudType`] = undefined;
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
        setDefaultExpandRowKeys(expandKeys);

        return roots;
    };

    // ──────────────────────────── 동적 칼럼 생성 ────────────────────────────
    const buildDynamicColumns = (): ColumnsType<AuthMenuBtnRow> => {
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
                const checked = record[`btn_${btn.btnSeq}_checked`] as boolean;
                const disabled = !enabled || !isEditableAuth();

                return (
                    <CustomCheckbox
                        checked={!!checked}
                        disabled={disabled}
                        onChange={(e: any) => handleCheckboxChange(record.menuSeq, btn.btnSeq, e.target.checked)}
                    />
                );
            },
        }));

        return [menuNmColumn, ...btnCols];
    };

    // ──────────────────────────── 체크박스 변경 ────────────────────────────
    const handleCheckboxChange = (menuSeq: number, btnSeq: number, checked: boolean) => {
        const updateNodes = (nodes: AuthMenuBtnRow[]): AuthMenuBtnRow[] => {
            return nodes.map(node => {
                if (node.menuSeq === menuSeq) {
                    const authMenuBtnSeq = node[`btn_${btnSeq}_authMenuBtnSeq`];
                    const iudType = authMenuBtnSeq ? IudType.U : IudType.I;
                    return {
                        ...node,
                        [`btn_${btnSeq}_checked`]: checked,
                        [`btn_${btnSeq}_iudType`]: iudType,
                        children: node.children ? [...node.children] : undefined,
                    };
                }
                if (node.children) {
                    return {...node, children: updateNodes(node.children)};
                }
                return node;
            });
        };
        setTreeDataSource(updateNodes(treeDataSource));
    };

    // ──────────────────────────── 변경사항 수집 ────────────────────────────
    const collectChanges = (): AuthMenuBtnSaveItem[] => {
        const saveList: AuthMenuBtnSaveItem[] = [];
        const auth = selectedAuthRecord();
        if (!auth) return saveList;

        const collect = (nodes: AuthMenuBtnRow[], orgNodes: AuthMenuBtnRow[]) => {
            nodes.forEach(node => {
                const orgNode = orgNodes.find(n => n.menuSeq === node.menuSeq);
                if (!orgNode) return;

                btnColumns.forEach(btn => {
                    const checked = node[`btn_${btn.btnSeq}_checked`] as boolean;
                    const orgChecked = orgNode[`btn_${btn.btnSeq}_checked`] as boolean;
                    if (checked === orgChecked) return;

                    const authMenuBtnSeq = node[`btn_${btn.btnSeq}_authMenuBtnSeq`] as number | null;
                    saveList.push({
                        authMenuBtnSeq,
                        authGrpSeq: auth.authGrpSeq,
                        authSeq: auth.authSeq,
                        menuSeq: node.menuSeq,
                        btnSeq: btn.btnSeq,
                        useYn: checked ? 'Y' : 'N',
                        iudType: authMenuBtnSeq ? IudType.U : IudType.I,
                    });
                });

                if (node.children && orgNode.children) {
                    collect(node.children, orgNode.children);
                }
            });
        };

        collect(treeDataSource, orgTreeDataSource);
        return saveList;
    };

    // ──────────────────────────── 권한 목록 조회 ────────────────────────────
    const handleSearchAuthList = () => {
        callGetAuthMenuMgtAuthList().then(res => {
            if (res.code === HttpStatusCode.Ok) {
                setRowAuthSeq(-1);
                setRowAuthGrpSeq(-1);
                setOrgAuthDataSource(JSON.parse(JSON.stringify(res.item)));
            }
        });
    };

    // ──────────────────────────── 메뉴버튼 권한 조회 ────────────────────────────
    const handleSearchAuthMenuBtn = (authGrpSeq: number, authSeq: number) => {
        callGetAuthMenuBtnList(authGrpSeq, authSeq).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                const tree = buildMenuBtnTree(res.item);
                setTreeDataSource(tree);
                setOrgTreeDataSource(JSON.parse(JSON.stringify(tree)));
            }
        });
    };

    // ──────────────────────────── 권한 행 클릭 ────────────────────────────
    const handleAuthRowClick = async (record: AuthMenuMgtAuth, index: number) => {
        if (index === selectedAuthRowIndex) return;

        if (isChanged()) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }

        setSelectedAuthRowIndex(index);
        setRowIndex(index);
        setRowAuthGrpSeq(record.authGrpSeq);
        setRowAuthSeq(record.authSeq);
        handleSearchAuthMenuBtn(record.authGrpSeq, record.authSeq);
    };

    // ──────────────────────────── 미사용 권한포함 토글 ────────────────────────────
    const handleToggleUnusable = async (checked: boolean) => {
        if (isChanged()) {
            const result = await confirm('저장하지 않은 정보는 초기화 됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }
        setIsIncludeUnusableAuth(checked);
    };

    // ──────────────────────────── 저장 ────────────────────────────
    const handleSave = async () => {
        if (selectedAuthRowIndex < 0) {
            message.info('선택한 권한이 없습니다.');
            return;
        }

        const saveList = collectChanges();
        if (saveList.length === 0) {
            message.info('변경된 내용이 없습니다.');
            return;
        }

        if (!await confirm('저장 하시겠습니까?')) return;

        const auth = selectedAuthRecord();
        if (!auth) return;

        const res = await callSaveAuthMenuBtn({
            authGrpSeq: auth.authGrpSeq,
            authSeq: auth.authSeq,
            saveList,
        });

        if (res.code === HttpStatusCode.Ok) {
            message.success('저장되었습니다.');
            handleSearchAuthMenuBtn(auth.authGrpSeq, auth.authSeq);
        }
    };

    // ──────────────────────────── 조회 ────────────────────────────
    const handleSearch = async () => {
        if (isChanged()) {
            const result = await confirm('저장하지 않은 내용은 초기화 됩니다. 조회 하시겠습니까?');
            if (!result) return;
        }
        handleSearchAuthList();
    };

    // ──────────────────────────── 초기화 ────────────────────────────
    const handleReset = async () => {
        if (isChanged()) {
            const result = await confirm('저장하지 않은 정보는 초기화됩니다. 계속 하시겠습니까?');
            if (!result) return;
        }
        setTreeDataSource(JSON.parse(JSON.stringify(orgTreeDataSource)));
    };

    // ──────────────────────────── Effects ────────────────────────────

    // 권한 원본 데이터 → 필터 적용
    useEffect(() => {
        if (orgAuthDataSource) {
            if (isIncludeUnusableAuth) {
                setAuthDataSource(JSON.parse(JSON.stringify(orgAuthDataSource)));
            } else {
                setAuthDataSource(
                    JSON.parse(JSON.stringify(orgAuthDataSource)).filter((v: any) => v.useYn === 'Y')
                );
            }
        }
        setSelectedAuthRowIndex(-1);
    }, [orgAuthDataSource, isIncludeUnusableAuth]);

    // 초기 로드
    useEffect(() => {
        handleSearchAuthList();
    }, []);

    // 첫 렌더 시 0번째 행 자동 선택
    useEffect(() => {
        if (orgAuthDataSource.length > 0 && rowAuthSeq === -1) {
            handleAuthRowClick(orgAuthDataSource[0], 0).then(() => {});
        }
    }, [orgAuthDataSource]);

    // 미사용 권한포함 토글 시 0번째 행 자동 선택
    useEffect(() => {
        if (authDataSource && authDataSource.length > 0) {
            handleAuthRowClick(authDataSource[0], 0).then(() => {});
        }
    }, [isIncludeUnusableAuth]);

    // handlersRef 등록
    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: handleSearch,
                cfmSave: handleSave,
            };
        }
    });

    useEffect(() => {
        return () => {
            if (handlersRef) handlersRef.current = {};
        };
    }, []);

    // ──────────────────────────── Render ────────────────────────────
    return (
        <>
            <section className="board-wrap half-wrap type03">
                {/* 좌측: 권한정보 */}
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle />
                            권한정보
                        </h3>
                        <div className="box-btn">
                            <span>
                                <CustomCheckbox
                                    name={'isIncludeUnused'}
                                    checked={isIncludeUnusableAuth}
                                    onChange={(v: any) => handleToggleUnusable(v.target.checked)}
                                />미사용 권한포함
                            </span>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            onRow={(record: any, index?: number) => ({
                                onClick: () => {
                                    if (index !== selectedAuthRowIndex) {
                                        handleAuthRowClick(record, index ?? -1).then();
                                    }
                                },
                            })}
                            rowKey={'authSeq'}
                            pagination={false}
                            rowNoFlag={true}
                            columns={authColumns}
                            dataSource={authDataSource}
                            rowSelectedFlag={false}
                            selectedRowIndex={selectedAuthRowIndex}
                        />
                    </div>
                </div>

                {/* 우측: 메뉴버튼권한 */}
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle />
                            메뉴권한
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            columns={buildDynamicColumns()}
                            dataSource={treeDataSource}
                            rowNoFlag={false}
                            pagination={false}
                            rowKey={'menuSeq'}
                            expandedRowKeys={defaultExpandRowKeys}
                            onExpandedRowsChange={setDefaultExpandRowKeys}
                            scroll={{x: 'max-content'}}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default AuthMenuManagement;
