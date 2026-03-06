import React, {useEffect, useRef, useState} from 'react';
import {message} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {HttpStatusCode} from 'axios';
import IconTitle from '@icon/IconTitle';
import CustomTable from '@component/CustomTable';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomButton from '@component/CustomButton';
import UserSearchInput from '@component/UserSearchInput';
import {PageButtonHandlers} from '@interface/common';
import {UserSearchResult} from '@interface/auth/AuthManagement';
import {AuthMenuMgtAuth, BtnColumnInfo} from '@interface/auth/AuthMenuManagement';
import {callGetAuthMenuBtnList} from '@api/auth/AuthMenuManagementApi';
import {callGetUserAuthList, callGetUserAllAuthMenuBtnList} from '@api/auth/UserMenuAuthInquiryApi';
import {callGetBtnList} from '@api/auth/MenuManagementApi';
import {useMenuBtnTree} from '@hook/useMenuBtnTree';
import {usePageHandlers} from '@hook/usePageHandlers';

const btnSortOrder = (seq: number) => (seq >= 11 && seq <= 15) ? 0 : 1;

const UserMenuAuthInquiry = ({handlersRef}: {
    onChange?: (flag: boolean) => void;
    menuInfo?: any;
    handlersRef?: React.MutableRefObject<PageButtonHandlers>;
}) => {
    const [searchUserId, setSearchUserId] = useState('');
    const [searchUserName, setSearchUserName] = useState('');
    const [showAllAuth, setShowAllAuth] = useState(false);
    const [authDataSource, setAuthDataSource] = useState<AuthMenuMgtAuth[]>([]);
    const [selectedAuthRowIndex, setSelectedAuthRowIndex] = useState(-1);

    const {
        treeDataSource,
        setBtnColumns,
        expandedRowKeys, setExpandedRowKeys,
        expandTree, foldTree,
        loadTree,
        buildDynamicColumns,
    } = useMenuBtnTree();

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
        callGetBtnList().then(res => {
            if (res.code === HttpStatusCode.Ok && res.item) {
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
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 80,
            render: (value: string) => <CustomCheckbox checked={value === 'Y'} disabled />,
        },
    ];

    // ──────────────────────────── 메뉴버튼 권한 조회 (단일 권한) ────────────────────────────
    const handleSearchAuthMenuBtn = (authGrpSeq: number, authSeq: number) => {
        callGetAuthMenuBtnList(authGrpSeq, authSeq).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                loadTree(res.item);
            }
        });
    };

    // ──────────────────────────── 메뉴버튼 권한 조회 (모든 권한 통합) ────────────────────────────
    const handleSearchAllAuthMenuBtn = (userId: string) => {
        callGetUserAllAuthMenuBtnList(userId).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                loadTree(res.item);
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
        loadTree([]);
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
        loadTree([]);
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

    usePageHandlers(handlersRef, {
        cfmInit: handleReset,
        cfmSearch: handleSearch,
    });

    // ──────────────────────────── Render ────────────────────────────
    return (
        <>
            <section className="search-wrap">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <span>사용자</span>
                    <UserSearchInput
                        value={searchUserId}
                        onChange={handleUserSelect}
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
                            <span className="total-count">{authDataSource.length}건</span>
                        </h3>
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
                            columns={buildDynamicColumns((record, btn) => {
                                const checked = record[`btn_${btn.btnSeq}_checked`] as boolean;
                                return <CustomCheckbox checked={!!checked} disabled />;
                            }) as ColumnsType<any>}
                            dataSource={treeDataSource}
                            rowNoFlag={false}
                            pagination={false}
                            rowKey={'menuSeq'}
                            expandedRowKeys={expandedRowKeys}
                            onExpandedRowsChange={setExpandedRowKeys}
                            scroll={{x: 'max-content'}}
                        />
                    </div>
                </div>
            </section>

        </>
    );
};

export default UserMenuAuthInquiry;
