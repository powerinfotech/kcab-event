'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '@layout/Sidebar';
import TopBar from '@layout/TopBar';
import Footer from '@layout/Footer';
import PublicNotice from '@page/public/PublicNotice';
import PublicFaq from '@page/public/PublicFaq';
import PublicEvents from '@page/public/PublicEvents';
import PublicEventPage, { PublicEventRegistrationPage } from '@page/public/PublicEventPage';
import PastEditions, { PastEdition2020, PastEdition2021, PastEdition2022, PastEdition2023, PastEdition2024, PastEdition2024EventDetail, PastEdition2025, PastEdition2025EventDetail } from '@page/PastEditions';
import SafSignup from '@page/saf/SafSignup';
import { getUserLoginInfo } from '@api/CommonApi';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { showErrorPageAtom } from '@atom/showErrorPageAtom';
import { KCAB_PATH_CHANGE_EVENT, currentPathAtom } from '@atom/currentPathAtom';
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
  const [browserPath, setBrowserPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '',
  );
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
          organizationName: res.item.organizationName ?? '',
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
    window.addEventListener(KCAB_PATH_CHANGE_EVENT, syncCurrentPath);
    return () => {
      window.removeEventListener('popstate', syncCurrentPath);
      window.removeEventListener('pageshow', syncCurrentPath);
      window.removeEventListener(KCAB_PATH_CHANGE_EVENT, syncCurrentPath);
    };
  }, [setCurrentPath]);

  useEffect(() => {
    const actualPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    if (pathname && pathname === actualPath && pathname !== browserPath) {
      setBrowserPath(pathname);
    }
    if (pathname && pathname === actualPath && pathname !== atomCurrentPath) {
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
      sessionStorage.setItem(AUTH_MESSAGE_STORAGE_KEY, 'You do not have permission.');
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
    if (currentPath === '/past-editions') return <PastEditions />;
    if (currentPath === '/past-editions/2020') return <PastEdition2020 />;
    if (currentPath === '/past-editions/2021') return <PastEdition2021 />;
    if (currentPath === '/past-editions/2022') return <PastEdition2022 />;
    if (currentPath === '/past-editions/2023') return <PastEdition2023 />;
    if (currentPath === '/past-editions/2024') return <PastEdition2024 />;
    if (currentPath.startsWith('/past-editions/2024/events/')) {
      const eventSlug = decodeURIComponent(currentPath.replace(/^\/past-editions\/2024\/events\//, '').split('/')[0] ?? '');
      return <PastEdition2024EventDetail slug={eventSlug} />;
    }
    if (currentPath === '/past-editions/2025') return <PastEdition2025 />;
    if (currentPath.startsWith('/past-editions/2025/events/')) {
      const eventSlug = decodeURIComponent(currentPath.replace(/^\/past-editions\/2025\/events\//, '').split('/')[0] ?? '');
      return <PastEdition2025EventDetail slug={eventSlug} />;
    }
    if (currentPath === '/events') return <PublicEvents />;
    if (currentPath.startsWith('/event/')) {
      const eventPathParts = currentPath.replace(/^\/event\//, '').split('/');
      const urlSlug = decodeURIComponent(eventPathParts[0] ?? '');
      if (eventPathParts[1] === 'register') {
        return <PublicEventRegistrationPage urlSlug={urlSlug} />;
      }
      return <PublicEventPage urlSlug={urlSlug} />;
    }
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
      sessionStorage.setItem(AUTH_MESSAGE_STORAGE_KEY, 'You do not have permission.');
    } catch {
      // sessionStorage may be unavailable in private browsing modes.
    }
    window.location.replace('/login');
    return <></>;
  }

  return <></>;
}
