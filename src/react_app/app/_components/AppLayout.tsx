'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '@layout/Sidebar';
import TopBar from '@layout/TopBar';
import Footer from '@layout/Footer';
import PublicNotice from '@page/public/PublicNotice';
import PublicFaq from '@page/public/PublicFaq';
import PublicEvents from '@page/public/PublicEvents';
import Organizer from '@page/public/Organizer';
import MediaPartners from '@page/public/MediaPartners';
import PublicEventPage, { PublicEventRegistrationPage } from '@page/public/PublicEventPage';
import PastEditions, { PastEdition2020, PastEdition2021, PastEdition2022, PastEdition2023, PastEdition2024, PastEdition2024EventDetail, PastEdition2025, PastEdition2025EventDetail } from '@page/PastEditions';
import SafSignup from '@page/saf/SafSignup';
import SponsorsPage from '@page/public/SponsorsPage';
import SupportersPage from '@page/public/SupportersPage';
import HomePage from '@page/HomePage';
import PublicRenewalLayout from '@page/public/components/PublicRenewalLayout';
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

/**
 * Public SPA shell routing. Every renewal public route renders inside ONE persistent
 * <PublicRenewalLayout> (shared header navigator + footer) so that navigating between
 * these pages swaps only the inner content while the header/footer stay mounted.
 * Returns null for non-shell public routes (notice/faq/past-editions/saf-signup),
 * which keep rendering their own markup.
 */
function getPublicShellRoute(
  currentPath: string,
): { className: string; content: React.ReactNode } | null {
  // 홈은 다른 public 라우트와 동일하게 컴포넌트를 직접(eager) 렌더한다.
  // children(=MainContent)을 거치면 HomePage가 dynamic(ssr:false)로 lazy 로드되어
  // 첫 프레임에 빈 콘텐츠가 그려지고, absolute 헤더 아래로 footer가 붙어 잠깐 겹쳐 보인다.
  if (currentPath === '/') return { className: '', content: <HomePage /> };
  if (currentPath === '/organizer') return { className: 'organizer-page', content: <Organizer /> };
  if (currentPath === '/media-partners') {
    return { className: 'media-partners-page', content: <MediaPartners /> };
  }
  if (currentPath === '/sponsors-2025') return { className: 'saf-sponsors-page', content: <SponsorsPage /> };
  if (currentPath === '/supporters') {
    return { className: 'saf-sponsors-page saf-supporters-page', content: <SupportersPage /> };
  }
  if (currentPath === '/events') return { className: 'official-events-page', content: <PublicEvents /> };
  if (currentPath.startsWith('/event/')) {
    const eventPathParts = currentPath.replace(/^\/event\//, '').split('/');
    const urlSlug = decodeURIComponent(eventPathParts[0] ?? '');
    if (eventPathParts[1] === 'register') {
      return {
        className: 'pub-layout pub-event-renewal pub-event-registration-page',
        content: <PublicEventRegistrationPage urlSlug={urlSlug} />,
      };
    }
    return {
      className: 'official-event-detail-page pub-event-renewal',
      content: <PublicEventPage urlSlug={urlSlug} />,
    };
  }
  return null;
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
    const publicShellRoute = getPublicShellRoute(currentPath);
    if (publicShellRoute) {
      return (
        <PublicRenewalLayout className={publicShellRoute.className}>
          {publicShellRoute.content}
        </PublicRenewalLayout>
      );
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
