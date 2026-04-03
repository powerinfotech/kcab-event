import React from 'react';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomValidFormCheckbox from '@component/form/CustomValidFormCheckbox';
import CustomTabs from '@component/navigation/CustomTabs';
import {useCmCode} from '@hook/useCmCode';
import {PageButtonHandlers} from '@interface/common';
import {usePageHandlers} from '@hook/usePageHandlers';
import {useMenuManagement} from './hooks/useMenuManagement';
import MenuTreePanel from './components/MenuTreePanel';
import MenuDetailTab from './components/MenuDetailTab';
import MenuButtonTab from './components/MenuButtonTab';

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
                    <CustomValidFormInput
                        name={'menuNm'}
                        placeholder="검색할 메뉴명을 입력해 주세요."
                        control={mgmt.searchForm.control}
                        onChangeValue={() => mgmt.handleFilter()}
                    />
                    <CustomValidFormCheckbox
                        name={'isExceptUnused'}
                        control={mgmt.searchForm.control}
                        onChange={() => mgmt.searchForm.handleSubmit(mgmt.handleFilter)}
                    />
                    <span>미사용제외</span>
                </form>
            </section>

            <section className="board-wrap half-wrap type02">
                <MenuTreePanel
                    treeData={mgmt.treeData}
                    expandedKey={mgmt.expandedKey}
                    selectedKeys={mgmt.selectedKeys}
                    selectable={mgmt.selectable}
                    onSelect={mgmt.onSelect}
                    onExpand={mgmt.onExpand}
                    onExpandAll={mgmt.expandTree}
                    onFoldAll={mgmt.foldTree}
                />

                <div className="right-panel">
                    <form onSubmit={mgmt.saveForm.handleSubmit(mgmt.handleSave)} className="h-full">
                        <CustomTabs
                            activeKey={mgmt.activeTab}
                            onChange={mgmt.setActiveTab}
                            items={[
                                {
                                    key: 'info',
                                    label: '기본정보',
                                    children: (
                                        <MenuDetailTab
                                            saveForm={mgmt.saveForm}
                                            isEditable={mgmt.isEditable}
                                            isViewMenu={mgmt.isViewMenu}
                                            parentMenuCombo={mgmt.parentMenuCombo}
                                            cmCode={cmCode}
                                            onDataChanged={mgmt.handleDataChanged}
                                            onCreateParentMenuCombo={mgmt.createParentMenuCombo}
                                        />
                                    ),
                                },
                                {
                                    key: 'button',
                                    label: '버튼설정',
                                    children: (
                                        <MenuButtonTab
                                            btnList={mgmt.btnList}
                                            menuBtnState={mgmt.menuBtnState}
                                            isEditable={mgmt.isEditable}
                                            onUpdateUseYn={mgmt.updateMenuBtnUseYn}
                                            onUpdateBtnNm={mgmt.updateMenuBtnNm}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </form>
                </div>
            </section>
        </>
    );
};

export default MenuManagement;
