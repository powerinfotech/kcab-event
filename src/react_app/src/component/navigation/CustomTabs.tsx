/**
 * CustomTabs - Ant Design Tabs 래퍼 컴포넌트
 *
 * [목적]
 * 동일 화면 내에서 여러 카테고리/섹션을 탭으로 전환할 때 사용한다.
 * 멀티 탭 레이아웃(전체 화면 탭 바)은 별도의 탭 관리 시스템을 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomTabs from '@component/navigation/CustomTabs';
 *
 * // 기본 탭
 * <CustomTabs
 *   activeKey={activeTab}
 *   onChange={setActiveTab}
 *   items={[
 *     { key: 'info', label: '기본 정보', children: <InfoPanel /> },
 *     { key: 'history', label: '변경 이력', children: <HistoryPanel /> },
 *   ]}
 * />
 *
 * // 카드형 탭
 * <CustomTabs
 *   type="card"
 *   activeKey={activeTab}
 *   onChange={setActiveTab}
 *   items={[
 *     { key: '1', label: '대기', children: <WaitingList /> },
 *     { key: '2', label: '처리', children: <ProcessingList /> },
 *     { key: '3', label: '완료', children: <DoneList /> },
 *   ]}
 * />
 *
 * // 비활성 탭 + 아이콘
 * <CustomTabs
 *   items={[
 *     { key: '1', label: '정보', icon: <InfoCircleOutlined /> },
 *     { key: '2', label: '설정', icon: <SettingOutlined />, disabled: true },
 *   ]}
 * />
 *
 * // 탭 우측 부가 액션
 * <CustomTabs
 *   tabBarExtraContent={<CustomButton size="small">+ 추가</CustomButton>}
 *   items={[...]}
 * />
 */
import React from 'react';
import {Tabs, TabsProps} from 'antd';

interface CustomTabsProps extends TabsProps {}

const CustomTabs = (props: CustomTabsProps) => {
    return (
        <Tabs {...props} />
    );
};

export default CustomTabs;
