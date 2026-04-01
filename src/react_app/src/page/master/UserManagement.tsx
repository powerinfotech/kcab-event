import React from 'react';
import {Controller} from 'react-hook-form';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomTable from '@component/display/CustomTable';
import IconTitle from '@icon/IconTitle';
import {PageButtonHandlers} from '@interface/common';
import {useCmCode} from '@hook/useCmCode';
import {usePageHandlers} from '@hook/usePageHandlers';
import ChangePasswordPopup from '@page/auth/ChangePasswordPopup';
import {useUserManagement, columns} from './hooks/useUserManagement';
import UserDetailForm from './components/UserDetailForm';

const UserManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const cmCode = useCmCode(['UserClass']);
    const mgmt = useUserManagement();

    usePageHandlers(handlersRef, {
        cfmInit: mgmt.handleReset,
        cfmSearch: mgmt.handleSearchList,
        cfmAdd: () => mgmt.handleAdd(),
        cfmDelete: () => mgmt.handleDelete(),
        cfmSave: mgmt.saveForm.handleSubmit(mgmt.handleSave),
    });

    return (
        <>
        <section className="search-wrap">
            <form onSubmit={mgmt.searchForm.handleSubmit(mgmt.handleSearchList)}>
                <span>ID/성명</span>
                <Controller
                    name={'idOrName'}
                    defaultValue={''}
                    control={mgmt.searchForm.control}
                    render={({field}) => (
                        <CustomInput
                            placeholder="ID 또는 성명을 입력해 주세요."
                            value={field.value}
                            onChange={field.onChange}
                            className="search-input-w250"
                            onKeyDown={mgmt.handleKeyDown}
                        />
                    )}
                />
                <Controller
                    name={'isCheck'}
                    defaultValue={false}
                    control={mgmt.searchForm.control}
                    render={({field}) => (
                        <CustomCheckbox checked={field.value} onChange={field.onChange} />
                    )}
                />
                <span>전체보기</span>
            </form>
        </section>

            <section className="board-wrap half-wrap type03">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            사용자 목록
                            <span className="total-count">{mgmt.dataSource.length}건</span>
                        </h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable onRow={(recode: any, index?: number) => {
                            return {
                                onClick: () => {
                                    mgmt.handleRowChanged(recode, index ?? -1).then(res => {
                                        if (res)
                                            mgmt.handleRowSelection(recode, index ?? -1).then();
                                    });
                                },
                            };
                        }} scroll={{x: 1400, y: undefined}} rowKey={'userSeq'} pagination={false} rowNoFlag={true} columns={columns} selectedRowIndex={mgmt.selectedRowIndex}
                                     dataSource={mgmt.dataSource}/>
                    </div>
                </div>
                <UserDetailForm
                    saveForm={mgmt.saveForm}
                    isEditable={mgmt.isEditable}
                    currentDataSource={mgmt.currentDataSource}
                    cmCode={cmCode}
                    onDataChanged={mgmt.handleDataChanged}
                    onOpenPasswordPopup={() => mgmt.setIsOpen(true)}
                />
            </section>
            <ChangePasswordPopup
                userInfo={mgmt.currentDataSource}
                open={mgmt.isOpen}
                title={'비밀번호 변경'}
                className="modal-min-w400"
                mask={{ closable: false }}
                onOk={() => mgmt.setIsOpen(false)}
                onCancel={() => mgmt.setIsOpen(false)}
            />
        </>
    );
};

export default UserManagement;
