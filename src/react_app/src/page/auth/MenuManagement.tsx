import {Tree} from 'antd';
import React from 'react';
import CustomButton from '@component/CustomButton';
import IconTitle from '@image/icon_title.svg';
import {useCmCode} from '@hook/useCmCode';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomValidFormCheckbox from '@component/form/CustomValidFormCheckbox';
import {PageButtonHandlers} from '@interface/common';
import {usePageHandlers} from '@hook/usePageHandlers';
import {useMenuManagement} from './hooks/useMenuManagement';
import MenuDetailForm from './components/MenuDetailForm';
import MenuButtonInfoPanel from './components/MenuButtonInfoPanel';

const {DirectoryTree} = Tree;

const MenuManagement = ({handlersRef}: {onChange?: (flag: boolean) => void; menuInfo?: any; handlersRef?: React.MutableRefObject<PageButtonHandlers>}) => {
    const cmCode = useCmCode(['MenuType']);
    const mgmt = useMenuManagement();

    usePageHandlers(handlersRef, {
        cfmInit: mgmt.handleReset,
        cfmSearch: () => mgmt.handleSearch().then(mgmt.handleFilter),
        cfmAdd: mgmt.handleAdd,
        cfmDelete: mgmt.handleDelete,
        cfmSave: mgmt.saveForm.handleSubmit(mgmt.handleSave),
    });

    if (Object.keys(cmCode).length === 0) return null;

    return (
        <>
            <section className="search-wrap">
                <form>
                    <span>메뉴명</span>
                    <CustomValidFormInput name={'menuNm'}
                                          placeholder="검색할 ID를 입력해 주세요."
                                          control={mgmt.searchForm.control}
                                          onChangeValue={() => mgmt.handleFilter()}
                    />
                    <CustomValidFormCheckbox name={'isExceptUnused'} control={mgmt.searchForm.control}
                                             onChange={() => mgmt.searchForm.handleSubmit(mgmt.handleFilter)} />
                    <span>미사용제외</span>
                </form>
            </section>

            <section className="board-wrap half-wrap type02">
                <div>
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle/>
                            메뉴목록
                        </h3>
                        <div className="box-btn">
                            <CustomButton type="default" size="small" onClick={mgmt.foldTree}>접기</CustomButton>
                            <CustomButton type="default" size="small" onClick={mgmt.expandTree}>펼치기</CustomButton>
                        </div>
                    </div>
                    <div className="board-cont-wrap">
                        {mgmt.treeData ? (
                            <DirectoryTree
                                showLine
                                multiple
                                defaultExpandAll
                                showIcon={true}
                                expandAction={'doubleClick'}
                                expandedKeys={mgmt.expandedKey}
                                onSelect={mgmt.onSelect}
                                onExpand={mgmt.onExpand}
                                treeData={mgmt.treeData}
                                selectable={mgmt.selectable}
                                selectedKeys={mgmt.selectedKeys}
                            />
                        ) : null}
                    </div>
                </div>

                <div className="right-panel">
                    <form onSubmit={mgmt.saveForm.handleSubmit(mgmt.handleSave)} style={{height: '100%'}}>
                        <MenuDetailForm
                            saveForm={mgmt.saveForm}
                            isEditable={mgmt.isEditable}
                            isViewMenu={mgmt.isViewMenu}
                            parentMenuCombo={mgmt.parentMenuCombo}
                            cmCode={cmCode}
                            onDataChanged={mgmt.handleDataChanged}
                            onCreateParentMenuCombo={mgmt.createParentMenuCombo}
                        />

                        <MenuButtonInfoPanel
                            btnList={mgmt.btnList}
                            menuBtnState={mgmt.menuBtnState}
                            isEditable={mgmt.isEditable}
                            onUpdateUseYn={mgmt.updateMenuBtnUseYn}
                            onUpdateBtnNm={mgmt.updateMenuBtnNm}
                        />
                    </form>
                </div>
            </section>
        </>
    );
};

export default MenuManagement;
