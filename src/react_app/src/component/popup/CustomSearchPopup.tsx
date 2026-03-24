import React, { ReactNode } from 'react';
import CustomModal, { CustomModalProps } from '@component/feedback/CustomModal';
import IconTitle from '@icon/IconTitle';

export interface CustomSearchPopupProps extends CustomModalProps {
    searchSection?: ReactNode;
    tableTitle?: string;
    totalCount?: number;
}

const CustomSearchPopup = ({ searchSection, tableTitle, totalCount, children, ...modalProps }: CustomSearchPopupProps) => {
    return (
        <CustomModal
            width={650}
            maskClosable={false}
            {...modalProps}
        >
            {searchSection && (
                <section className="search-wrap">
                    {searchSection}
                </section>
            )}
            {tableTitle && (
                <section className="board-wrap type03">
                    <div className="board-title-wrap">
                        <h3 className="title">
                            <IconTitle />
                            {tableTitle}
                            {totalCount !== undefined && (
                                <span className="total-count">{totalCount}건</span>
                            )}
                        </h3>
                    </div>
                    {children}
                </section>
            )}
            {!tableTitle && children}
        </CustomModal>
    );
};

export default CustomSearchPopup;
