/**
 * CustomCollapse / CustomCollapsePanel - Ant Design Collapse 래퍼 컴포넌트
 *
 * [목적]
 * 아코디언 방식으로 섹션을 접었다 펼 때 사용한다.
 * 상세 필터 영역, 도움말, 설정 섹션 등에 활용한다.
 *
 * [exports]
 * - default: CustomCollapse       (Collapse)
 * - named:   CustomCollapsePanel  (Collapse.Panel) — antd v4 스타일 지원용
 *
 * [사용 방법]
 * @example
 * import CustomCollapse, { CustomCollapsePanel } from '@component/display/CustomCollapse';
 *
 * // items API (antd v5 권장)
 * const items = [
 *   {
 *     key: '1',
 *     label: '검색 필터',
 *     children: <SearchForm />,
 *   },
 *   {
 *     key: '2',
 *     label: '고급 설정',
 *     children: <AdvancedSettings />,
 *   },
 * ];
 *
 * <CustomCollapse items={items} defaultActiveKey={['1']} />
 *
 * // accordion 모드 (하나만 열림)
 * <CustomCollapse items={items} accordion />
 *
 * // Panel 방식 (antd v4 스타일)
 * <CustomCollapse defaultActiveKey={['1']}>
 *   <CustomCollapsePanel key="1" header="기본 정보">
 *     <p>내용</p>
 *   </CustomCollapsePanel>
 *   <CustomCollapsePanel key="2" header="추가 정보">
 *     <p>내용</p>
 *   </CustomCollapsePanel>
 * </CustomCollapse>
 *
 * // 테두리 없음
 * <CustomCollapse bordered={false} items={items} />
 */
import React from 'react';
import {Collapse, CollapseProps} from 'antd';

interface CustomCollapseProps extends CollapseProps {}

const CustomCollapse = (props: CustomCollapseProps) => {
    return (
        <Collapse {...props} />
    );
};

export const CustomCollapsePanel = Collapse.Panel;

export default CustomCollapse;
