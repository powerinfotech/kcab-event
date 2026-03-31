/**
 * CustomTreeSelect - 전체 펼침 + 전체 선택 해제 기본 적용 트리 셀렉트 컴포넌트
 *
 * [목적]
 * Ant Design TreeSelect를 래핑하여 treeDefaultExpandAll, allowClear를 기본 적용한다.
 * 계층 구조(카테고리, 메뉴, 부서 등)를 선택할 때 사용한다.
 *
 * [특징]
 * - treeDefaultExpandAll=true 고정 (초기에 모든 노드 펼침)
 * - allowClear=true 고정 (선택 해제 가능)
 *
 * [사용 방법]
 * @example
 * import CustomTreeSelect from '@component/select/CustomTreeSelect';
 *
 * const treeData = [
 *   {
 *     title: '전체',
 *     value: '0',
 *     children: [
 *       { title: '인사팀', value: '1' },
 *       { title: '개발팀', value: '2' },
 *     ],
 *   },
 * ];
 *
 * <CustomTreeSelect
 *   treeData={treeData}
 *   value={selectedDept}
 *   onChange={setSelectedDept}
 *   placeholder="부서 선택"
 *   style={{ width: 200 }}
 * />
 */
import React from 'react';
import {TreeSelect, TreeSelectProps} from 'antd';

interface CustomTreeSelectProps extends TreeSelectProps {}

const CustomTreeSelect = (props: CustomTreeSelectProps) => {
    return (
        <TreeSelect
            treeDefaultExpandAll
            allowClear
            {...props}
        />
    );
};

export default CustomTreeSelect;
