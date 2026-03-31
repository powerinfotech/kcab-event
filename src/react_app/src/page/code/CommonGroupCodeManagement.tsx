import React from 'react';
import CustomTable from '@component/display/CustomTable';
import CustomInput from '@component/input/CustomInput';
import IconTitle from '@icon/IconTitle';
import {PageButtonHandlers} from '@interface/common';
import {usePageHandlers} from '@hook/usePageHandlers';
import {useCommonGroupCodeManagement} from './hooks/useCommonGroupCodeManagement';

const CommonGroupCodeManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const mgmt = useCommonGroupCodeManagement();

    usePageHandlers(handlersRef, {
        cfmInit: mgmt.handleReset,
        cfmSearch: mgmt.handleSearch,
        cfmAdd: mgmt.handleAddRow,
        cfmDelete: mgmt.handleDeleteRow,
        cfmSave: mgmt.form.handleSubmit(mgmt.handleSave),
    });

    return (
        <>
            <section className="search-wrap">
                <form>
                    <span>공통그룹코드/명</span>
                    <CustomInput
                        value={mgmt.searchText}
                        onChange={(e) => mgmt.setSearchText(e.target.value)}
                        onKeyDown={mgmt.handleKeyDown}
                        className="w200"
                    />
                </form>
            </section>

            <section className="board-wrap">
                <div className="board-title-wrap">
                    <h3 className="title"><IconTitle/>공통그룹코드목록<span className="total-count">{mgmt.dataSource.length}건</span></h3>
                </div>
                <div className="board-cont-wrap">
                    <CustomTable
                        rowSelection={{
                            selectedRowKeys: mgmt.selectedRowKeys,
                            onChange: (keys: React.Key[]) => mgmt.setSelectedRowKeys(keys),
                            getCheckboxProps: (record: any) => ({
                                disabled: !!record.rgstUserSeq,
                                style: record.rgstUserSeq ? { display: 'none' } : undefined,
                            }),
                        }}
                        rowKey={'comGrpCdSeq'}
                        pagination={false}
                        rowNoFlag={true}
                        columns={mgmt.columns}
                        dataSource={mgmt.dataSource}
                        scroll={{x: 2000, y: undefined}}
                    />
                </div>
            </section>
        </>
    );
};

export default CommonGroupCodeManagement;
