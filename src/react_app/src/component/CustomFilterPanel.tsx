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
