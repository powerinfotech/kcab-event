'use client';

import React, { useEffect } from 'react';
import {
  CalendarOutlined,
  CheckSquareOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  MailOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
  ProfileOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { getAdminRole } from '@util/fixedAdminMenus';

const iconByUrl: Record<string, React.ReactNode> = {
  '/': <DashboardOutlined />,
  '/events': <CalendarOutlined />,
  '/side-events/SE-0042': <CheckSquareOutlined />,
  '/side-events': <FormOutlined />,
  '/participants': <TeamOutlined />,
  '/payments': <CreditCardOutlined />,
  '/email-cms/registration-confirm': <MailOutlined />,
  '/organizations': <BankOutlined />,
  '/users': <UserOutlined />,
  '/settings': <SettingOutlined />,
  '/profile': <ProfileOutlined />,
};

export default function Sidebar({
  onSubpanelOpenChange,
}: {
  onSubpanelOpenChange?: (open: boolean) => void;
}) {
  const menuInfo = useAtomValue(menuInfoAtom);
  const sessionInfo = useAtomValue(sessionInfoAtom);
  const currentPath = useAtomValue(currentPathAtom);
  const setCurrentPath = useSetAtom(currentPathAtom);
  const role = getAdminRole(sessionInfo.admYn);
  const visibleMenus = menuInfo
    .filter((item) => item.menuTypeCd === 'V' && item.useYn === 'Y' && item.level === 1)
    .sort((a, b) => a.sortSeq - b.sortSeq);

  useEffect(() => {
    onSubpanelOpenChange?.(false);
  }, [onSubpanelOpenChange]);

  const move = (menuUrl: string) => {
    pushPath(menuUrl === '/' ? '/admin' : `/admin${menuUrl}`, setCurrentPath);
  };

  const isActive = (menuUrl: string) => {
    if (menuUrl === '/') return currentPath === '/admin' || currentPath === '/admin/';
    return currentPath.startsWith(`/admin${menuUrl}`);
  };

  return (
    <aside className="saf-sidebar">
      <button className="saf-sidebar-brand" type="button" onClick={() => move('/')}>
        <span>{role === 'ADMIN' ? 'KCAB 관리자' : '기관'}</span>
        <strong>{role === 'ADMIN' ? '관리자 콘솔' : '기관 콘솔'}</strong>
      </button>

      <nav className="saf-sidebar-menu" aria-label="관리자 메뉴">
        {visibleMenus.map((menu) => (
          <button
            key={menu.menuSeq}
            type="button"
            className={`saf-sidebar-item ${isActive(menu.menuUrl) ? 'is-active' : ''}`}
            onClick={() => move(menu.menuUrl)}
          >
            <span className="saf-sidebar-icon">{iconByUrl[menu.menuUrl] ?? <DashboardOutlined />}</span>
            <span>{menu.menuNm}</span>
            {role === 'ADMIN' && menu.menuUrl === '/side-events/SE-0042' && (
              <em>3</em>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
