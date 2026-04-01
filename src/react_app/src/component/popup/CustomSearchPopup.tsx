/**
 * CustomSearchPopup - 검색 섹션 + 테이블 타이틀 + 건수 표시 팝업 컴포넌트
 *
 * [목적]
 * 조회 팝업의 공통 레이아웃(검색 조건 + 테이블 제목 + 조회 건수 + 테이블)을 제공한다.
 * CustomModal을 기반으로 하며 maskClosable=false가 기본 적용된다.
 *
 * @param searchSection - 검색 조건 영역 (ReactNode) — search-wrap 섹션으로 감싸짐
 * @param tableTitle    - 테이블 제목 텍스트
 * @param totalCount    - 조회 결과 건수 (표시 예: "10건")
 * @param children      - 테이블 컴포넌트
 *
 * [사용 방법]
 * @example
 * import CustomSearchPopup from '@component/popup/CustomSearchPopup';
 *
 * <CustomSearchPopup
 *   title="사용자 검색"
 *   open={isOpen}
 *   onOk={handleOk}
 *   onCancel={() => setIsOpen(false)}
 *   tableTitle="조회 결과"
 *   totalCount={userList.length}
 *   searchSection={
 *     <form>
 *       <CustomInput value={keyword} onChange={(e) => setKeyword(e.target.value)} />
 *       <CustomButton type="primary" onClick={handleSearch}>조회</CustomButton>
 *     </form>
 *   }
 * >
 *   <CustomTable columns={columns} dataSource={userList} pagination={false} scroll={{ y: 300 }} />
 * </CustomSearchPopup>
 *
 * // 사용자 검색 팝업은 UserSearchPopup을 직접 사용 권장
 */
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
            mask={{ closable: false }}
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
