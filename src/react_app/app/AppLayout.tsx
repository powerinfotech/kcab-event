'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '@layout/Sidebar';
import Footer from '@layout/Footer';
import Login from '@page/Login';
import { getUserLoginInfo, getUserMenuInfo } from '@api/CommonApi';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { showErrorPageAtom } from '@atom/showErrorPageAtom';
import { HttpStatusCode } from 'axios';

const MemoizedSidebar = React.memo(Sidebar);
const MemoizedFooter = React.memo(Footer);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sessionInfo, setSessionInfo] = useRecoilState(sessionInfoAtom);
  const setMenuInfo = useSetRecoilState(menuInfoAtom);
  const showErrorPage = useRecoilValue(showErrorPageAtom);
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined);
  const [sidebarSubpanelOpen, setSidebarSubpanelOpen] = useState(false);

  const getLoginUserInfo = useCallback(async () => {
    try {
      const res = await getUserLoginInfo();
      if (res != null && res.code === HttpStatusCode.Ok && res.item) {
        setIsLogin(true);
        if (sessionInfo.userId !== res.item.userId)
          setSessionInfo({
            userId: res.item.userId,
            userName: res.item.userName,
            admFlag: res.item.admFlag,
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
  }, [sessionInfo.userId, setSessionInfo, setMenuInfo]);

  useEffect(() => {
    getLoginUserInfo();
  }, [getLoginUserInfo]);

  const onSubpanelOpenChange = useCallback((open: boolean) => {
    setSidebarSubpanelOpen(open);
  }, []);

  if (isLogin === true) {
    return (
      <div className={`app_layout ${sidebarSubpanelOpen ? 'sidebar_subpanel_open' : ''}`}>
        {!showErrorPage && (
          <MemoizedSidebar onSubpanelOpenChange={onSubpanelOpenChange} />
        )}
        <div className="app_main">
          {children}
          {!showErrorPage && <MemoizedFooter />}
        </div>
      </div>
    );
  }

  if (isLogin === false) {
    return <Login />;
  }

  return <></>;
}
