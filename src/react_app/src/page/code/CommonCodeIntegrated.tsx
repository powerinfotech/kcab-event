import React from 'react';
import {Controller} from 'react-hook-form';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import {PageButtonHandlers} from '@interface/common';
import {usePageHandlers} from '@hook/usePageHandlers';
import {useCommonCodeIntegrated} from './hooks/useCommonCodeIntegrated';
import GrpCodeTable from './components/GrpCodeTable';
import GrpCodeDetailForm from './components/GrpCodeDetailForm';
import ComCodeTable from './components/ComCodeTable';

const CommonCodeIntegrated = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const mgmt = useCommonCodeIntegrated();

    usePageHandlers(handlersRef, {
        cfmInit: mgmt.handleReset,
        cfmSearch: mgmt.handleSearch,
        cfmSave: mgmt.grpForm.handleSubmit(mgmt.handleSave),
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
                    <GrpCodeTable
                        dataSource={mgmt.grpDataSource}
                        columns={mgmt.grpColumns}
                        selectedRowIndex={mgmt.selectedGrpRowIndex}
                        selectedRowKeys={mgmt.selectedGrpRowKeys}
                        onSelectedRowKeysChange={mgmt.setSelectedGrpRowKeys}
                        onRowClick={mgmt.handleGrpRowClick}
                        onAddRow={mgmt.handleAddGrp}
                        onDeleteRow={mgmt.handleDeleteGrp}
                    />

                    <GrpCodeDetailForm
                        selectedGrpCd={mgmt.selectedGrpCd}
                        onDetailChange={mgmt.handleGrpDetailChange}
                    />
                </div>

                <div>
                    <ComCodeTable
                        dataSource={mgmt.comCdDataSource}
                        columns={mgmt.dynamicComCdColumns}
                        scrollX={mgmt.comCdScrollX}
                        selectedRowKeys={mgmt.selectedComCdRowKeys}
                        onSelectedRowKeysChange={mgmt.setSelectedComCdRowKeys}
                        onAddRow={mgmt.handleAddComCd}
                        onDeleteRow={mgmt.handleDeleteComCd}
                        selectedGrpName={mgmt.selectedGrpCd?.comGrpCdNm}
                    />
                </div>
            </section>
        </>
    );
};

export default CommonCodeIntegrated;
