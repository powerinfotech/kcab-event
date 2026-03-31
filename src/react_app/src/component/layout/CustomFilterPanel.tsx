/**
 * CustomFilterPanel - 접기/펼치기 가능한 검색 필터 패널 컴포넌트
 *
 * [목적]
 * 목록 화면의 검색 조건 영역을 접을 수 있는 Collapse로 감싼다.
 * 필터 아이콘과 제목이 자동으로 헤더에 표시된다.
 *
 * @param title       - 패널 헤더 제목 (기본: '상세 필터')
 * @param defaultOpen - 초기 펼침 여부 (기본: false)
 * @param children    - 필터 입력 영역
 *
 * [사용 방법]
 * @example
 * import CustomFilterPanel from '@component/layout/CustomFilterPanel';
 *
 * <CustomFilterPanel title="검색 조건" defaultOpen>
 *   <form>
 *     <span>사용자명</span>
 *     <CustomInput value={name} onChange={(e) => setName(e.target.value)} />
 *     <span>상태</span>
 *     <CustomSelect options={statusOptions} value={status} onChange={setStatus} />
 *     <CustomButton type="primary" onClick={handleSearch}>조회</CustomButton>
 *   </form>
 * </CustomFilterPanel>
 */
import React from 'react';
import { Collapse } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

interface CustomFilterPanelProps {
  title?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CustomFilterPanel = ({ title = '상세 필터', defaultOpen = false, children }: CustomFilterPanelProps) => {
  return (
    <Collapse
      defaultActiveKey={defaultOpen ? ['filter'] : []}
      items={[
        {
          key: 'filter',
          label: (
            <span>
              <FilterOutlined className="mr8" />
              {title}
            </span>
          ),
          children,
        },
      ]}
    />
  );
};

export default CustomFilterPanel;
