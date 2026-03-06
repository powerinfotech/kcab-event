import React, {useEffect, useState} from 'react';
import {Input, message} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {HttpStatusCode} from 'axios';
import IconTitle from '@icon/IconTitle';
import CustomTable from '@component/CustomTable';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomButton from '@component/CustomButton';
import {IudType, PageButtonHandlers} from '@interface/common';
import {useMessage} from '@hook/useMessage';
import {
    AuthMenuMgtAuth,
    AuthMenuBtnRow,
    AuthMenuBtnSaveItem,
} from '@interface/auth/AuthMenuManagement';
import {
    callGetAuthMenuMgtAuthList,
    callGetAuthMenuBtnList,
    callSaveAuthMenuBtn,
} from '@api/auth/AuthMenuManagementApi';
import {useMenuBtnTree} from '@hook/useMenuBtnTree';
import {usePageHandlers} from '@hook/usePageHandlers';

const AuthMenuManagement = ({handlersRef}: {
    onChange?: (flag: boolean) => void;
    menuInfo?: any;
    handlersRef?: React.MutableRefObject<PageButtonHandlers>;
}) => {
    const {confirm} = useMessage();

    // 좌측: 권한정보
    const [authDataSource, setAuthDataSource] = useState<AuthMenuMgtAuth[]>([]);
    const [selectedAuthRowIndex, setSelectedAuthRowIndex] = useState(-1);
    const [searchAuthNm, setSearchAuthNm] = useState('');

    // 우측: 메뉴버튼권한 (useMenuBtnTree 훅 사용)
    const {
        treeDataSource, setTreeDataSource,
        orgTreeDataSource,
        btnColumns,
        expandedRowKeys, setExpandedRowKeys,
        expandTree, foldTree,
        loadTreeWithOrg,
        buildDynamicColumns,
    } = useMenuBtnTree({trackIudType: true});

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
        {title: '설명', key: 'authExpl', dataIndex: 'authExpl', align: 'left', width: '45%'},
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 80,
            render: (value: string) => value === 'Y' ? '예' : '아니오',
        },
    ];

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
    const handleSearchAuthList = (authNm?: string) => {
        callGetAuthMenuMgtAuthList(authNm !== undefined ? authNm : searchAuthNm).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                setRowAuthSeq(-1);
                setRowAuthGrpSeq(-1);
                setAuthDataSource(res.item);
                setSelectedAuthRowIndex(-1);
            }
        });
    };

    // ──────────────────────────── 메뉴버튼 권한 조회 ────────────────────────────
    const handleSearchAuthMenuBtn = (authGrpSeq: number, authSeq: number) => {
        callGetAuthMenuBtnList(authGrpSeq, authSeq).then(res => {
            if (res.code === HttpStatusCode.Ok) {
                loadTreeWithOrg(res.item);
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
        setRowAuthGrpSeq(record.authGrpSeq);
        setRowAuthSeq(record.authSeq);
        handleSearchAuthMenuBtn(record.authGrpSeq, record.authSeq);
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
        setSearchAuthNm('');
        handleSearchAuthList('');
    };

    // ──────────────────────────── Effects ────────────────────────────

    // 초기 로드
    useEffect(() => {
        handleSearchAuthList();
    }, []);

    // 첫 렌더 시 0번째 행 자동 선택
    useEffect(() => {
        if (authDataSource.length > 0 && rowAuthSeq === -1) {
            handleAuthRowClick(authDataSource[0], 0).then(() => {});
        }
    }, [authDataSource]);

    // handlersRef 등록
    usePageHandlers(handlersRef, {
        cfmInit: handleReset,
        cfmSearch: handleSearch,
        cfmSave: handleSave,
    });

    // ──────────────────────────── Render ────────────────────────────
    return (
        <>
            {/* 조회조건: 권한명 검색 */}
            <section className="search-wrap">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <span>권한명</span>
                    <Input
                        placeholder="권한명을 입력해 주세요."
                        value={searchAuthNm}
                        onChange={(e) => setSearchAuthNm(e.target.value)}
                        className="w200"
                    />
                </form>
            </section>

            <section className="board-wrap half-wrap type03">
                {/* 좌측: 권한정보 */}
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
                        <div className="box-btn">
                            <CustomButton type="default" size="small" onClick={foldTree}>접기</CustomButton>
                            <CustomButton type="default" size="small" onClick={expandTree}>펼치기</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            columns={buildDynamicColumns((record, btn) => {
                                const checked = record[`btn_${btn.btnSeq}_checked`] as boolean;
                                return (
                                    <CustomCheckbox
                                        checked={!!checked}
                                        disabled={!isEditableAuth()}
                                        onChange={(e: any) => handleCheckboxChange(record.menuSeq, btn.btnSeq, e.target.checked)}
                                    />
                                );
                            })}
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

export default AuthMenuManagement;
