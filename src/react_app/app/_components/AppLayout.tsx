'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '@layout/Sidebar';
import TopBar from '@layout/TopBar';
import Footer from '@layout/Footer';
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
import { usePathname } from 'next/navigation';

const AUTH_MESSAGE_STORAGE_KEY = 'kcab-auth-message';

const MemoizedSidebar = React.memo(Sidebar);
const MemoizedTopBar = React.memo(TopBar);
const MemoizedFooter = React.memo(Footer);

function getAdminMenuPath(path: string): string {
  const withoutAdmin = path.replace(/^\/admin/, '') || '/';
  const withoutTrailingSlash = withoutAdmin.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sessionInfo, setSessionInfo] = useAtom(sessionInfoAtom);
  const setMenuInfo = useSetAtom(menuInfoAtom);
  const menuInfo = useAtomValue(menuInfoAtom);
  const setCurrentPath = useSetAtom(currentPathAtom);
  const showErrorPage = useAtomValue(showErrorPageAtom);
  const atomCurrentPath = useAtomValue(currentPathAtom);
  const pathname = usePathname();
  const [browserPath, setBrowserPath] = useState('');
  const currentPath = browserPath || pathname || atomCurrentPath;
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined);
  const [sidebarSubpanelOpen, setSidebarSubpanelOpen] = useState(false);
  const redirectingRef = useRef(false);

  const isAdminPath = currentPath.startsWith('/admin');
  const isLoginPath = currentPath === '/login' || currentPath === '/admin/login';
  const isAdminSignupPath = currentPath === '/admin/signup';
  const isProtectedAdminPath = isAdminPath && !isLoginPath && !isAdminSignupPath;
  const currentAdminMenuPath = getAdminMenuPath(currentPath);
  const currentMenuInfo = menuInfo.length ? menuInfo : getFixedAdminMenuInfo(sessionInfo.admYn);
  const hasAdminPathAccess = currentMenuInfo.some(
    (menuItem) => menuItem.useYn === 'Y' && getAdminMenuPath(`/admin${menuItem.menuUrl}`) === currentAdminMenuPath,
  );
  const shouldDenyAccess = isProtectedAdminPath && (
    isLogin === false || ((isLogin === true || !!sessionInfo.userId) && !hasAdminPathAccess)
  );

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
    const syncCurrentPath = () => {
      const nextPath = window.location.pathname;
      setBrowserPath(nextPath);
      setCurrentPath(nextPath);
    };

    syncCurrentPath();
    window.addEventListener('popstate', syncCurrentPath);
    window.addEventListener('pageshow', syncCurrentPath);
    return () => {
      window.removeEventListener('popstate', syncCurrentPath);
      window.removeEventListener('pageshow', syncCurrentPath);
    };
  }, [setCurrentPath]);

  useEffect(() => {
    if (pathname && pathname !== browserPath) {
      setBrowserPath(pathname);
    }
    if (pathname && pathname !== atomCurrentPath) {
      setCurrentPath(pathname);
    }
  }, [pathname, browserPath, atomCurrentPath, setCurrentPath]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (atomCurrentPath === window.location.pathname && atomCurrentPath !== browserPath) {
      setBrowserPath(atomCurrentPath);
    }
  }, [atomCurrentPath, browserPath]);

  useEffect(() => {
    if (isAdminPath && !isLoginPath && !isAdminSignupPath) {
      getLoginUserInfo();
    }
  }, [isAdminPath, isLoginPath, isAdminSignupPath]);

  useEffect(() => {
    if (!shouldDenyAccess || redirectingRef.current) return;

    redirectingRef.current = true;
    try {
      sessionStorage.setItem(AUTH_MESSAGE_STORAGE_KEY, '권한이 없습니다.');
      sessionStorage.removeItem('tabList');
      sessionStorage.removeItem('activeTabKey');
    } catch {
      // sessionStorage may be unavailable in private browsing modes.
    }
    window.location.replace('/login');
  }, [shouldDenyAccess]);

  const onSubpanelOpenChange = useCallback((open: boolean) => {
    setSidebarSubpanelOpen(open);
  }, []);

  if (isLoginPath || isAdminSignupPath) {
    return <>{children}</>;
  }

  if (!isAdminPath) {
    if (currentPath === '/') {
      return <>{children}</>;
    }
    if (currentPath === '/notice') return <PublicNotice />;
    if (currentPath === '/faq') return <PublicFaq />;
    if (currentPath === '/events') return <PublicEvents />;
    if (currentPath === '/saf/signup') return <SafSignup />;
    // 알 수 없는 공개 경로는 홈으로 fallback
    return <>{children}</>;
  }

  if (shouldDenyAccess) {
    return <></>;
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
    try {
      sessionStorage.setItem(AUTH_MESSAGE_STORAGE_KEY, '권한이 없습니다.');
    } catch {
      // sessionStorage may be unavailable in private browsing modes.
    }
    window.location.replace('/login');
    return <></>;
  }

  return <></>;
}
