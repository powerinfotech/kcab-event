import React from 'react';
import {Controller} from 'react-hook-form';
import CustomButton from '@component/button/CustomButton';
import CustomTable from '@component/display/CustomTable';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import IconTitle from '@icon/IconTitle';
import {PageButtonHandlers} from '@interface/common';
import {usePageHandlers} from '@hook/usePageHandlers';
import {useCommonCodeManagement} from './hooks/useCommonCodeManagement';

const CommonCodeManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const mgmt = useCommonCodeManagement();

    usePageHandlers(handlersRef, {
        cfmInit: mgmt.handleReset,
        cfmSearch: mgmt.handleSearch,
        cfmSave: mgmt.form.handleSubmit(mgmt.handleSave),
    });

    return (
        <>
            <section className="search-wrap">
                <form>
                    <span>공통그룹코드/명</span>
                    <Controller
                        name={'searchText'}
                        defaultValue={''}
                        control={mgmt.searchForm.control}
                        render={({field}) => (
                            <CustomInput
                                value={field.value}
                                onChange={field.onChange}
                                onKeyDown={mgmt.handleKeyDown}
                                className="w200"
                            />
                        )}
                    />
                    <Controller
                        name={'showAll'}
                        defaultValue={false}
                        control={mgmt.searchForm.control}
                        render={({field}) => (
                            <span className="ml10">
                                <CustomCheckbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >전체보기</CustomCheckbox>
                            </span>
                        )}
                    />
                </form>
            </section>

            <section className="board-wrap half-wrap type02">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title"><IconTitle/>그룹코드목록<span className="total-count">{mgmt.grpDataSource.length}건</span></h3>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            onRow={(record: any, index?: number) => ({
                                onClick: () => mgmt.handleGrpRowClick(record, index ?? -1),
                            })}
                            rowKey={'comGrpCdSeq'}
                            pagination={false}
                            rowNoFlag={true}
                            columns={mgmt.grpColumns}
                            dataSource={mgmt.grpDataSource}
                            rowSelectedFlag={true}
                            selectedRowIndex={mgmt.selectedGrpRowIndex}
                        />
                    </div>
                </div>

                <div>
                    <div className="board-title-wrap">
                        <h3 className="title"><IconTitle/>공통코드목록<span className="total-count">{mgmt.comCdDataSource.length}건</span></h3>
                        <div className="box-btn">
                            <CustomButton type="default" size="small" onClick={mgmt.handleAddRow}>+행추가</CustomButton>
                            <CustomButton type="default" size="small" onClick={mgmt.handleDeleteRow}>-행삭제</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        <CustomTable
                            rowSelection={{
                                selectedRowKeys: mgmt.selectedRowKeys,
                                onChange: (keys: React.Key[]) => mgmt.setSelectedRowKeys(keys),
                            }}
                            rowKey={'comCdSeq'}
                            pagination={false}
                            rowNoFlag={true}
                            columns={mgmt.comCdColumns}
                            dataSource={mgmt.comCdDataSource}
                            scroll={{x: 2000, y: undefined}}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default CommonCodeManagement;
