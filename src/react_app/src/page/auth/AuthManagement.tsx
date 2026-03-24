import React from 'react';
import UserSearchPopup from '@component/popup/search/UserSearchPopup';
import {PageButtonHandlers} from '@interface/common';
import {usePageHandlers} from '@hook/usePageHandlers';
import {useAuthManagement} from './hooks/useAuthManagement';
import AuthGroupTable from './components/AuthGroupTable';
import AuthTable from './components/AuthTable';
import AuthUserTable from './components/AuthUserTable';

const AuthManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const mgmt = useAuthManagement();

    usePageHandlers(handlersRef, {
        cfmInit: mgmt.handleReset,
        cfmSearch: mgmt.handleSearchAuthGrpList,
        cfmSave: mgmt.form.handleSubmit(mgmt.handleSave),
    });

    return (
        <>
            <section className="board-wrap auth-mgmt-layout">
                <AuthGroupTable
                    dataSource={mgmt.authGrpDataSource}
                    selectedRowIndex={mgmt.selectedAuthGrpRowIndex}
                    selectedRowKeys={mgmt.selectedAuthGrpRowKeys}
                    onSelectedRowKeysChange={mgmt.setSelectedAuthGrpRowKeys}
                    onRowClick={mgmt.handleAuthGrpRowClick}
                    onAddRow={mgmt.handleAddRowAuthGrp}
                    onDeleteRow={mgmt.handleDeleteRowAuthGrp}
                    onDataChange={mgmt.handleDataChangeAuthGrp}
                    form={mgmt.form}
                />

                <div className="auth-mgmt-right">
                    <AuthTable
                        dataSource={mgmt.authDataSource}
                        selectedRowIndex={mgmt.selectedAuthRowIndex}
                        selectedRowKeys={mgmt.selectedAuthRowKeys}
                        onSelectedRowKeysChange={mgmt.setSelectedAuthRowKeys}
                        onRowClick={mgmt.handleAuthRowClick}
                        onAddRow={mgmt.handleAddRowAuth}
                        onDeleteRow={mgmt.handleDeleteRowAuth}
                        onDataChange={mgmt.handleDataChangeAuth}
                        form={mgmt.form}
                    />

                    <AuthUserTable
                        dataSource={mgmt.authUserDataSource}
                        selectedRowKeys={mgmt.selectedAuthUserRowKeys}
                        onSelectedRowKeysChange={mgmt.setSelectedAuthUserRowKeys}
                        onOpenUserPopup={mgmt.handleOpenUserPopup}
                        onDeleteRow={mgmt.handleDeleteRowAuthUser}
                        onDataChange={mgmt.handleDataChangeAuthUser}
                    />
                </div>
            </section>

            <UserSearchPopup
                open={mgmt.isUserPopupOpen}
                onClose={() => mgmt.setIsUserPopupOpen(false)}
                onSelect={mgmt.handleAddUserFromPopup}
            />
        </>
    );
};

export default AuthManagement;
