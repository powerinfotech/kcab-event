'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '@layout/Sidebar';
import TopBar from '@layout/TopBar';
import Footer from '@layout/Footer';
import Login from '@page/Login';
import PublicPage from '@page/public/PublicPage';
import PublicNotice from '@page/public/PublicNotice';
import PublicFaq from '@page/public/PublicFaq';
import PublicEvents from '@page/public/PublicEvents';
import SafSignup from '@page/saf/SafSignup';
import { getUserLoginInfo } from '@api/CommonApi';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { showErrorPageAtom } from '@atom/showErrorPageAtom';
import { currentPathAtom } from '@atom/currentPathAtom';
import { HttpStatusCode } from 'axios';
import { getFixedAdminMenuInfo } from '@util/fixedAdminMenus';

const MemoizedSidebar = React.memo(Sidebar);
const MemoizedTopBar = React.memo(TopBar);
const MemoizedFooter = React.memo(Footer);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sessionInfo, setSessionInfo] = useAtom(sessionInfoAtom);
  const setMenuInfo = useSetAtom(menuInfoAtom);
  const showErrorPage = useAtomValue(showErrorPageAtom);
  const currentPath = useAtomValue(currentPathAtom);
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined);
  const [sidebarSubpanelOpen, setSidebarSubpanelOpen] = useState(false);

  const isAdminPath = currentPath.startsWith('/admin');
  const isLoginPath = currentPath === '/login' || currentPath === '/admin/login';
  const isAdminSignupPath = currentPath === '/admin/signup';

  const getLoginUserInfo = useCallback(async () => {
    try {
      const res = await getUserLoginInfo();
      if (res != null && res.code === HttpStatusCode.Ok && res.item) {
        setIsLogin(true);
        setSessionInfo({
          userId: res.item.userId,
          userName: res.item.userName,
          admYn: res.item.admYn ?? 'N',
        });
        setMenuInfo(getFixedAdminMenuInfo(res.item.admYn));
      } else {
        setIsLogin(false);
      }
    } catch {
      setIsLogin(false);
    }
  }, [setSessionInfo, setMenuInfo]);

  useEffect(() => {
    if (isAdminPath && !isLoginPath && !isAdminSignupPath) {
      getLoginUserInfo();
    }
  }, [isAdminPath, isLoginPath, isAdminSignupPath]);

  const onSubpanelOpenChange = useCallback((open: boolean) => {
    setSidebarSubpanelOpen(open);
  }, []);

  if (isLoginPath) {
    return <Login />;
  }

  if (isAdminSignupPath) {
    return <SafSignup />;
  }

  if (!isAdminPath) {
    if (currentPath === '/') {
      return <>{children}</>;
    }
    if (currentPath === '/notice') return <PublicNotice />;
    if (currentPath === '/faq') return <PublicFaq />;
    if (currentPath === '/events') return <PublicEvents />;
    if (currentPath === '/saf/signup') return <SafSignup />;
    return <PublicPage pageUrl={currentPath} />;
  }

  if (isLogin === true || sessionInfo.userId) {
    return (
      <div className={`app_layout ${sidebarSubpanelOpen ? 'sidebar_subpanel_open' : ''}`}>
        {!showErrorPage && (
          <MemoizedSidebar onSubpanelOpenChange={onSubpanelOpenChange} />
        )}
        <div className="app_main">
          {!showErrorPage && <MemoizedTopBar />}
          {children}
          {!showErrorPage && <MemoizedFooter />}
        </div>
      </div>
    );
  }

  if (isLogin === false) {
    window.location.href = '/admin/login';
    return <></>;
  }

  return <></>;
}
