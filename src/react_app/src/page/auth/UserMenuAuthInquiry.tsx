import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, message} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {HttpStatusCode} from 'axios';
import IconTitle from '@icon/IconTitle';
import IconBtnSearch from '@icon/IconBtnSearch';
import CustomTable from '@component/CustomTable';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomButton from '@component/CustomButton';
import UserSearchPopup from '@component/popup/UserSearchPopup';
import {PageButtonHandlers} from '@interface/common';
import {UserSearchResult} from '@interface/auth/AuthManagement';
import {
    AuthMenuMgtAuth,
    AuthMenuBtnItem,
    AuthMenuBtnRow,
    BtnColumnInfo,
} from '@interface/auth/AuthMenuManagement';
import {callGetAuthMenuBtnList} from '@api/auth/AuthMenuManagementApi';
import {callGetUserAuthList, callGetUserAllAuthMenuBtnList} from '@api/auth/UserMenuAuthInquiryApi';
import {callGetBtnList} from '@api/auth/MenuManagementApi';

const UserMenuAuthInquiry = ({handlersRef}: {
    onChange?: (flag: boolean) => void;
    menuInfo?: any;
    handlersRef?: React.MutableRefObject<PageButtonHandlers>;
}) => {
    const [searchUserId, setSearchUserId] = useState('');
    const [searchUserName, setSearchUserName] = useState('');
    const [showAllAuth, setShowAllAuth] = useState(false);
    const [userPopupOpen, setUserPopupOpen] = useState(false);

    const [authDataSource, setAuthDataSource] = useState<AuthMenuMgtAuth[]>([]);
    const [selectedAuthRowIndex, setSelectedAuthRowIndex] = useState(-1);

    const [treeDataSource, setTreeDataSource] = useState<AuthMenuBtnRow[]>([]);
    const [btnColumns, setBtnColumns] = useState<BtnColumnInfo[]>([]);
    const [defaultExpandRowKeys, setDefaultExpandRowKeys] = useState<React.Key[]>([]);

    const pendingSearchRef = useRef(false);
    const searchUserIdRef = useRef('');
    const showAllAuthRef = useRef(false);
    const initialBtnColumnsRef = useRef<BtnColumnInfo[]>([]);

    useEffect(() => {
        searchUserIdRef.current = searchUserId;
    }, [searchUserId]);

    useEffect(() => {
        showAllAuthRef.current = showAllAuth;
    }, [showAllAuth]);

    useEffect(() => {
        console.log('btnColumns', btnColumns);
    }, [btnColumns]);

    useEffect(() => {
        callGetBtnList().then(res => {
            console.log('res', res);
            if (res.code === HttpStatusCode.Ok && res.item) {
                const btnSortOrder = (seq: number) => (seq >= 11 && seq <= 15) ? 0 : 1;
                const cols: BtnColumnInfo[] = res.item
                    .filter(b => b.useYn === 'Y')
                    .map(b => ({btnSeq: b.btnSeq, btnSortSeq: b.sortSeq, btnNm: b.btnNm}))
                    .sort((a, b) => btnSortOrder(a.btnSortSeq) - btnSortOrder(b.btnSortSeq) || a.btnSortSeq - b.btnSortSeq);
                initialBtnColumnsRef.current = cols;
                setBtnColumns(cols);
            }
        });
    }, []);

    // ──────────────────────────── 좌측 grid 칼럼 ────────────────────────────
    const authColumns: ColumnsType<AuthMenuMgtAuth> = [
        {title: '권한그룹', key: 'authGrpNm', dataIndex: 'authGrpNm', align: 'center', width: '25%'},
        {title: '권한명', key: 'authNm', dataIndex: 'authNm', align: 'center', width: '35%'},
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '25%',
            render: (value: string) => <CustomCheckbox checked={value === 'Y'} disabled />,
        },
    ];

    // ──────────────────────────── flat → tree 변환 ────────────────────────────
    const buildMenuBtnTree = (flatList: AuthMenuBtnItem[]): AuthMenuBtnRow[] => {
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
        const btnSortOrder = (seq: number) => (seq >= 11 && seq <= 15) ? 0 : 1;
        const columns = Array.from(btnMap.values()).sort((a, b) =>
            btnSortOrder(a.btnSortSeq) - btnSortOrder(b.btnSortSeq) || a.btnSortSeq - b.btnSortSeq
        );
        setBtnColumns(columns);

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
        });

        const roots: AuthMenuBtnRow[] = [];
        menuMap.forEach(node => {
            if (node.upMenuSeq == null) {
                roots.push(node);
            } else {
                const parent = menuMap.get(node.upMenuSeq);
                if (parent) parent.children!.push(node);
            }
        });

        menuMap.forEach(node => {
            if (node.children && node.children.length === 0) {
                delete node.children;
            }
        });

        const expandKeys = Array.from(menuMap.values())
            .filter(n => n.menuTypeCd === 'D')
            .map(n => n.menuSeq);
        setDefaultExpandRowKeys(expandKeys);

        return roots;
    };

    // ──────────────────────────── 접기/펼치기 ────────────────────────────
    const getAllExpandKeys = (nodes: AuthMenuBtnRow[]): React.Key[] => {
        const keys: React.Key[] = [];
        nodes.forEach(n => {
            if (n.children && n.children.length > 0) {
                keys.push(n.menuSeq);
                keys.push(...getAllExpandKeys(n.children));
            }
        });
        return keys;
    };

    const foldLeafParents = (nodes: AuthMenuBtnRow[], currentKeys: React.Key[]): React.Key[] => {
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
    };

    const expandTree = () => setDefaultExpandRowKeys(getAllExpandKeys(treeDataSource));
    const foldTree = () => setDefaultExpandRowKeys(prev => foldLeafParents(treeDataSource, prev));

    // ──────────────────────────── 동적 칼럼 생성 (readonly) ────────────────────────────
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
                if (!enabled) return '';

                const checked = record[`btn_${btn.btnSeq}_checked`] as boolean;
                return <CustomCheckbox checked={!!checked} disabled />;
            },
        }));

        return [menuNmColumn, ...btnCols];
    };

    // ──────────────────────────── 메뉴버튼 권한 조회 (단일 권한) ────────────────────────────
    const handleSearchAuthMenuBtn = (authGrpSeq: number, authSeq: number) => {
        callGetAuthMenuBtnList(authGrpSeq, authSeq).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                const tree = buildMenuBtnTree(res.item);
                setTreeDataSource(tree);
            }
        });
    };

    // ──────────────────────────── 메뉴버튼 권한 조회 (모든 권한 통합) ────────────────────────────
    const handleSearchAllAuthMenuBtn = (userId: string) => {
        callGetUserAllAuthMenuBtnList(userId).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                const tree = buildMenuBtnTree(res.item);
                setTreeDataSource(tree);
            }
        });
    };

    // ──────────────────────────── 사용자 팝업에서 선택 ────────────────────────────
    const handleUserSelect = (user: UserSearchResult) => {
        setSearchUserId(user.userId);
        setSearchUserName(user.userName);
    };

    // ──────────────────────────── 권한 행 클릭 ────────────────────────────
    const handleAuthRowClick = (record: AuthMenuMgtAuth, index: number) => {
        if (index === selectedAuthRowIndex) return;
        setSelectedAuthRowIndex(index);

        if (showAllAuthRef.current) {
            handleSearchAllAuthMenuBtn(searchUserIdRef.current);
        } else {
            handleSearchAuthMenuBtn(record.authGrpSeq, record.authSeq);
        }
    };

    // ──────────────────────────── 조회 ────────────────────────────
    const handleSearch = () => {
        if (!searchUserIdRef.current) {
            message.info('사용자를 선택해 주세요.');
            return;
        }

        pendingSearchRef.current = true;
        setSelectedAuthRowIndex(-1);
        setTreeDataSource([]);
        setBtnColumns(initialBtnColumnsRef.current);

        callGetUserAuthList(searchUserIdRef.current).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                setAuthDataSource(res.item);
            }
        });
    };

    // ──────────────────────────── 초기화 ────────────────────────────
    const handleReset = () => {
        setSearchUserId('');
        setSearchUserName('');
        setShowAllAuth(false);
        setAuthDataSource([]);
        setSelectedAuthRowIndex(-1);
        setTreeDataSource([]);
        setBtnColumns(initialBtnColumnsRef.current);
    };

    // ──────────────────────────── Effects ────────────────────────────

    useEffect(() => {
        if (pendingSearchRef.current && authDataSource.length > 0 && selectedAuthRowIndex === -1) {
            pendingSearchRef.current = false;
            const firstAuth = authDataSource[0];
            setSelectedAuthRowIndex(0);

            if (showAllAuthRef.current) {
                handleSearchAllAuthMenuBtn(searchUserIdRef.current);
            } else {
                handleSearchAuthMenuBtn(firstAuth.authGrpSeq, firstAuth.authSeq);
            }
        }
    }, [authDataSource]);

    useEffect(() => {
        if (handlersRef) {
            handlersRef.current = {
                cfmInit: handleReset,
                cfmSearch: handleSearch,
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
            <section className="search-wrap">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <span>사용자</span>
                    <span style={{display: 'inline-flex', alignItems: 'center'}}>
                        <Input
                            readOnly
                            value={searchUserId}
                            placeholder="사용자를 선택해 주세요."
                            style={{width: 140, borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                        />
                        <Button
                            type="primary"
                            onClick={() => setUserPopupOpen(true)}
                            style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1}}
                        >
                            <IconBtnSearch />
                        </Button>
                    </span>
                    <Input
                        readOnly
                        value={searchUserName}
                        style={{width: 100}}
                    />
                    <CustomCheckbox
                        checked={showAllAuth}
                        onChange={(e: any) => setShowAllAuth(e.target.checked)}
                    />
                    <span>해당 사용자의 모든 권한 보기</span>
                </form>
            </section>

            <section className="board-wrap half-wrap type03">
                {/* 좌측: 권한(역할)정보 */}
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle />
                            권한정보
                        </h3>
                        <span className="total-count">Total {authDataSource.length}</span>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            onRow={(record: any, index?: number) => ({
                                onClick: () => {
                                    if (index !== selectedAuthRowIndex) {
                                        handleAuthRowClick(record, index ?? -1);
                                    }
                                },
                            })}
                            rowKey={'authSeq'}
                            pagination={false}
                            rowNoFlag={true}
                            columns={authColumns as ColumnsType<any>}
                            dataSource={authDataSource}
                            rowSelectedFlag={false}
                            selectedRowIndex={selectedAuthRowIndex}
                        />
                    </div>
                </div>

                {/* 우측: 사용자 메뉴권한 */}
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle />
                            사용자 메뉴권한
                        </h3>
                        <div className="box-btn">
                            <CustomButton type="default" size="small" onClick={foldTree}>접기</CustomButton>
                            <CustomButton type="default" size="small" onClick={expandTree}>펼치기</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            columns={buildDynamicColumns() as ColumnsType<any>}
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

            <UserSearchPopup
                open={userPopupOpen}
                onClose={() => setUserPopupOpen(false)}
                onSelect={handleUserSelect}
            />
        </>
    );
};

export default UserMenuAuthInquiry;
