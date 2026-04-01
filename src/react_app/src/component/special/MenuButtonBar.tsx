/**
 * MenuButtonBar - 메뉴 권한 버튼 바 컴포넌트
 *
 * [목적]
 * menuBtnList(API에서 조회한 버튼 권한 목록)를 기반으로 버튼을 동적으로 렌더링한다.
 * 각 버튼 클릭 시 handlersRef에서 btnFuncCd에 해당하는 핸들러를 호출한다.
 *
 * [동작 방식]
 * 1. menuBtnList가 없거나 비어있으면 null 반환
 * 2. btnFuncCd를 ICON_MAP으로 조회하여 아이콘 자동 적용
 *    - cfmInit    → IconBtnRefresh  (초기화)
 *    - cfmSearch  → IconBtnSearch   (조회)
 *    - cfmAdd     → PlusOutlined    (추가)
 *    - cfmSave    → SaveOutlined    (저장)
 *    - cfmDelete  → DeleteOutlined  (삭제)
 *    - cfmExcel   → FileExcelOutlined (엑셀 다운로드)
 * 3. 버튼 클릭 → handlersRef.current[btnFuncCd]?.() 호출
 *
 * @param menuBtnList  - API에서 조회한 버튼 권한 목록
 * @param handlersRef  - 버튼 기능코드(btnFuncCd) → 핸들러 함수 맵 (useRef)
 *
 * [사용 방법]
 * @example
 * import MenuButtonBar from '@component/special/MenuButtonBar';
 *
 * const handlersRef = useRef<PageButtonHandlers>({
 *   cfmInit:   handleReset,
 *   cfmSearch: handleSearch,
 *   cfmAdd:    handleAdd,
 *   cfmSave:   handleSave,
 *   cfmDelete: handleDelete,
 * });
 *
 * // menuBtnList는 useMenuBtnTree 또는 usePermission으로 조회
 * const { menuBtnList } = useMenuBtnTree();
 *
 * <MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />
 */
import React from 'react';
import CustomButton from '@component/button/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import {DeleteOutlined, FileExcelOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons';
import {MenuBtnDetail, PageButtonHandlers} from '@interface/common';

interface MenuButtonBarProps {
    menuBtnList: MenuBtnDetail[];
    handlersRef: React.MutableRefObject<PageButtonHandlers>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    cfmInit:   <IconBtnRefresh />,
    cfmSearch: <IconBtnSearch />,
    cfmAdd:    <PlusOutlined />,
    cfmSave:   <SaveOutlined />,
    cfmDelete: <DeleteOutlined />,
    cfmExcel:  <FileExcelOutlined />,
};

const MenuButtonBar = ({menuBtnList, handlersRef}: MenuButtonBarProps) => {
    if (!menuBtnList || menuBtnList.length === 0) return null;

    return (
        <section className={'button-wrap'}>
            <div className="box-btn">
                {menuBtnList.map((btn) => (
                    <CustomButton
                        key={btn.btnSeq}
                        type="primary"
                        onClick={() => handlersRef.current[btn.btnFuncCd]?.()}
                    >
                        {ICON_MAP[btn.btnFuncCd] ?? null}
                        {btn.btnNm}
                    </CustomButton>
                ))}
            </div>
        </section>
    );
};

export default React.memo(MenuButtonBar);
