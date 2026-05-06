'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '@layout/Sidebar';
import TopBar from '@layout/TopBar';
import Footer from '@layout/Footer';
import Login from '@page/Login';
import { getUserLoginInfo, getUserMenuInfo } from '@api/CommonApi';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { showErrorPageAtom } from '@atom/showErrorPageAtom';
import { currentPathAtom } from '@atom/currentPathAtom';
import { HttpStatusCode } from 'axios';

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
  const isLoginPath = currentPath === '/login';

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

        const menuRes = await getUserMenuInfo();
        if (menuRes?.code === HttpStatusCode.Ok && menuRes.item) {
          setMenuInfo(menuRes.item);
        }
      } else {
        setIsLogin(false);
      }
    } catch {
      setIsLogin(false);
    }
  }, [setSessionInfo, setMenuInfo]);

  useEffect(() => {
    if (isAdminPath) {
      getLoginUserInfo();
    }
  }, [isAdminPath]);

  const onSubpanelOpenChange = useCallback((open: boolean) => {
    setSidebarSubpanelOpen(open);
  }, []);

  if (isLoginPath) {
    return <Login />;
  }

  if (!isAdminPath) {
    return <>{children}</>;
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
    window.location.href = '/login';
    return <></>;
  }

  return <></>;
}
