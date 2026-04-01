/**
 * CustomMenu - Ant Design Menu 래퍼 컴포넌트
 *
 * [목적]
 * 사이드바 네비게이션, 드롭다운 메뉴, 컨텍스트 메뉴에 사용한다.
 * 관리자 화면의 좌측 사이드 메뉴, 상단 GNB 드롭다운 등에 활용한다.
 *
 * [사용 방법]
 * @example
 * import CustomMenu from '@component/navigation/CustomMenu';
 * import type { MenuProps } from 'antd';
 *
 * type MenuItem = Required<MenuProps>['items'][number];
 *
 * // 사이드바 인라인 메뉴
 * const items: MenuItem[] = [
 *   {
 *     key: 'user',
 *     icon: <UserOutlined />,
 *     label: '사용자 관리',
 *     children: [
 *       { key: 'user-list', label: '사용자 목록' },
 *       { key: 'user-create', label: '사용자 등록' },
 *     ],
 *   },
 *   {
 *     key: 'setting',
 *     icon: <SettingOutlined />,
 *     label: '시스템 설정',
 *   },
 * ];
 *
 * <CustomMenu
 *   mode="inline"
 *   selectedKeys={[currentPath]}
 *   defaultOpenKeys={['user']}
 *   items={items}
 *   onClick={({ key }) => router.push(`/${key}`)}
 * />
 *
 * // 수평 메뉴 (GNB)
 * <CustomMenu
 *   mode="horizontal"
 *   selectedKeys={[activeMenu]}
 *   items={items}
 * />
 *
 * // 접힌 사이드바 (아이콘만)
 * <CustomMenu
 *   mode="inline"
 *   inlineCollapsed={collapsed}
 *   items={items}
 * />
 *
 * // 비활성 항목
 * const items: MenuItem[] = [
 *   { key: '1', label: '허용 메뉴' },
 *   { key: '2', label: '비허용 메뉴', disabled: true },
 * ];
 */
import React from 'react';
import {Menu, MenuProps} from 'antd';

interface CustomMenuProps extends MenuProps {}

const CustomMenu = (props: CustomMenuProps) => {
    return (
        <Menu {...props} />
    );
};

export default CustomMenu;
