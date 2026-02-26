import React from 'react';
import CustomButton from '@component/CustomButton';
import IconBtnRefresh from '@icon/IconBtnRefresh';
import IconBtnSearch from '@icon/IconBtnSearch';
import {MenuBtnDetail, PageButtonHandlers} from '@interface/common';

interface MenuButtonBarProps {
    menuBtnList: MenuBtnDetail[];
    handlersRef: React.MutableRefObject<PageButtonHandlers>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    cfmInit: <IconBtnRefresh />,
    cfmSearch: <IconBtnSearch />,
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
