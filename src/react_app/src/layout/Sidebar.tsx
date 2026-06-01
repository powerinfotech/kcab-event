'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  CalendarOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  HistoryOutlined,
  MailOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,

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
  '/events/new': <FormOutlined />,
  '/side-events': <FormOutlined />,
  '/participants': <TeamOutlined />,
  '/payments': <CreditCardOutlined />,
  '/email-cms/registration-confirm': <MailOutlined />,
  '/email-logs': <HistoryOutlined />,
  '/notice-news': <ReadOutlined />,
  '/gallery': <PictureOutlined />,
  '/users': <UserOutlined />,
  '/faq': <QuestionCircleOutlined />,
  '/popups': <PictureOutlined />,
  '/settings': <SettingOutlined />,
  '/profile': <ProfileOutlined />,
};

/** ADMIN 메뉴를 4개 그룹으로 묶는다. URL 매칭. 그룹에 없는 URL은 'SYSTEM'으로 폴백. */
const ADMIN_GROUP_BY_URL: Record<string, 'OVERVIEW' | 'EVENTS' | 'CONTENT' | 'SYSTEM'> = {
  '/': 'OVERVIEW',
  '/events': 'EVENTS',
  '/events/new': 'EVENTS',
  '/participants': 'EVENTS',
  '/payments': 'EVENTS',
  '/email-cms/registration-confirm': 'CONTENT',
  '/email-logs': 'CONTENT',
  '/notice-news': 'CONTENT',
  '/gallery': 'CONTENT',
  '/popups': 'CONTENT',
  '/users': 'SYSTEM',
  '/faq': 'SYSTEM',
  '/settings': 'SYSTEM',
};

const ADMIN_GROUP_ORDER: ('OVERVIEW' | 'EVENTS' | 'CONTENT' | 'SYSTEM')[] = [
  'OVERVIEW',
  'EVENTS',
  'CONTENT',
  'SYSTEM',
];

const ADMIN_GROUP_LABEL: Record<'OVERVIEW' | 'EVENTS' | 'CONTENT' | 'SYSTEM', string> = {
  OVERVIEW: 'Overview',
  EVENTS: 'Events',
  CONTENT: 'Content',
  SYSTEM: 'System',
};

const ORG_GROUP_BY_URL: Record<string, 'OVERVIEW' | 'EVENTS' | 'SYSTEM'> = {
  '/': 'OVERVIEW',
  '/events': 'EVENTS',
  '/participants': 'EVENTS',
  '/faq': 'SYSTEM',
  '/profile': 'SYSTEM',
};

const ORG_GROUP_ORDER: ('OVERVIEW' | 'EVENTS' | 'SYSTEM')[] = ['OVERVIEW', 'EVENTS', 'SYSTEM'];

const ORG_GROUP_LABEL: Record<'OVERVIEW' | 'EVENTS' | 'SYSTEM', string> = {
  OVERVIEW: 'Overview',
  EVENTS: 'Events',
  SYSTEM: 'System',
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

  type MenuItem = (typeof visibleMenus)[number];

  // 메뉴를 그룹으로 묶는다. 메뉴 순서(sortSeq)는 그룹 내부에서 유지.
  const groupedMenus = (() => {
    if (role === 'ADMIN') {
      const buckets: Record<string, MenuItem[]> = {
        OVERVIEW: [],
        EVENTS: [],
        CONTENT: [],
        SYSTEM: [],
      };
      for (const menu of visibleMenus) {
        const group = ADMIN_GROUP_BY_URL[menu.menuUrl] ?? 'SYSTEM';
        buckets[group].push(menu);
      }
      return ADMIN_GROUP_ORDER
        .map((key) => ({ key, label: ADMIN_GROUP_LABEL[key], items: buckets[key] }))
        .filter((group) => group.items.length > 0);
    }
    const buckets: Record<string, MenuItem[]> = {
      OVERVIEW: [],
      EVENTS: [],
      SYSTEM: [],
    };
    for (const menu of visibleMenus) {
      const group = ORG_GROUP_BY_URL[menu.menuUrl] ?? 'SYSTEM';
      buckets[group].push(menu);
    }
    return ORG_GROUP_ORDER
      .map((key) => ({ key, label: ORG_GROUP_LABEL[key], items: buckets[key] }))
      .filter((group) => group.items.length > 0);
  })();

  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);

  // 좁은 화면에서 열린 상태로 라우트가 바뀌면 자동 닫힘 + ESC 닫힘 처리.
  useEffect(() => {
    setIsOpenOnMobile(false);
  }, [currentPath]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isOpenOnMobile) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpenOnMobile(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpenOnMobile]);

  // TopBar의 햄버거 버튼이 invoke하는 toggle. window 이벤트로 가볍게 연결.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onToggle = () => setIsOpenOnMobile((prev) => !prev);
    window.addEventListener('saf-sidebar-toggle', onToggle);
    return () => window.removeEventListener('saf-sidebar-toggle', onToggle);
  }, []);

  const close = useCallback(() => setIsOpenOnMobile(false), []);

  return (
    <>
      <div
        className={`saf-sidebar-scrim ${isOpenOnMobile ? 'is-open' : ''}`}
        aria-hidden="true"
        onClick={close}
      />
      <aside className={`saf-sidebar ${isOpenOnMobile ? 'is-open' : ''}`} aria-hidden={!isOpenOnMobile && undefined}>
        <button className="saf-sidebar-brand" type="button" onClick={() => move('/')}>
          <span>{role === 'ADMIN' ? 'KCAB Admin' : 'Organization'}</span>
          <strong>{role === 'ADMIN' ? 'Admin Console' : 'Organization Console'}</strong>
        </button>

        <button
          type="button"
          className="saf-sidebar-close"
          aria-label="Close menu"
          onClick={close}
        >
          <CloseOutlined />
        </button>

        <nav className="saf-sidebar-menu" aria-label="Admin menu">
          {groupedMenus.map((group) => (
            <div className="saf-sidebar-group" key={group.key}>
              <p className="saf-sidebar-group-label">{group.label}</p>
              {group.items.map((menu) => (
                <button
                  key={menu.menuSeq}
                  type="button"
                  className={`saf-sidebar-item ${isActive(menu.menuUrl) ? 'is-active' : ''}`}
                  onClick={() => move(menu.menuUrl)}
                >
                  <span className="saf-sidebar-icon">{iconByUrl[menu.menuUrl] ?? <DashboardOutlined />}</span>
                  <span>{menu.menuNm}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
