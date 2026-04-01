'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Breadcrumb } from 'antd';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import ErrorPage404 from '@error/ErrorPage404';
import { getPageComponent, getStaticRouteKey } from '@util/PageRegistry';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { MenuBtnDetail, PageButtonHandlers } from '@interface/common';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { showErrorPageAtom } from '@atom/showErrorPageAtom';
import { tabModeAtom } from '@atom/tabModeAtom';
import { tabListAtom, activeTabKeyAtom, TabItem } from '@atom/tabListAtom';
import { callGetMenuBtnList } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import MenuButtonBar from '@component/special/MenuButtonBar';

/** 개별 탭 페이지 렌더링 (멀티탭 모드에서 사용) */
function TabPage({
  tab,
  menuInfo,
  isActive,
  onChange,
}: {
  tab: TabItem;
  menuInfo: MenuInfo[];
  isActive: boolean;
  onChange: (flag: boolean) => void;
}) {
  const handlersRef = useRef<PageButtonHandlers>({});
  const [menuBtnList, setMenuBtnList] = useState<MenuBtnDetail[]>([]);

  const menu = menuInfo.find(
    (m) => m.menuTypeCd === 'V' && m.useYn === 'Y' && m.menuUrl === tab.menuUrl,
  );

  useEffect(() => {
    handlersRef.current = {};
    if (tab.menuSeq) {
      callGetMenuBtnList(tab.menuSeq)
        .then((res) => {
          if (res?.code === HttpStatusCode.Ok && res.item) {
            setMenuBtnList(res.item);
          } else {
            setMenuBtnList([]);
          }
        })
        .catch(() => setMenuBtnList([]));
    }
  }, [tab.menuSeq]);

  const viewPath = tab.menuViewPath.replace(/^\//, '');
  const Comp = getPageComponent(viewPath);

  if (!Comp) return null;

  return (
    <div style={{ display: isActive ? 'block' : 'none' }}>
      <div className="container_wrap">
        <div className="container_inner">
          <Suspense fallback={<></>}>
            <section className="title-wrap">
              <div className="box-flex">
                <h2 className="title">{tab.menuNm}</h2>
                <Breadcrumb
                  separator={[<IconStepArrow key="sep" />]}
                  className="bread-crumb"
                  items={[
                    {
                      title: (
                        <>
                          <IconHome />
                          <span className="txt">
                            {tab.menuNamePath.split('>')[1]?.trim() ?? tab.menuNm}
                          </span>
                        </>
                      ),
                    },
                    {
                      title: <span className="txt">{tab.menuNm}</span>,
                    },
                  ]}
                />
              </div>
            </section>
            <MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />
            <Comp onChange={onChange} menuInfo={menu} handlersRef={handlersRef} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/** 싱글 페이지 모드 컴포넌트 */
function SinglePageContent({
  menuInfo,
  onChange,
}: {
  menuInfo: MenuInfo[];
  onChange: (flag: boolean) => void;
}) {
  const pathname = usePathname() ?? '/';
  const handlersRef = useRef<PageButtonHandlers>({});
  const [menuBtnList, setMenuBtnList] = useState<MenuBtnDetail[]>([]);

  const menu = menuInfo.find(
    (m) => m.menuTypeCd === 'V' && m.useYn === 'Y' && m.menuUrl === pathname,
  );

  useEffect(() => {
    handlersRef.current = {};
    if (menu?.menuSeq) {
      callGetMenuBtnList(menu.menuSeq)
        .then((res) => {
          if (res?.code === HttpStatusCode.Ok && res.item) {
            setMenuBtnList(res.item);
          } else {
            setMenuBtnList([]);
          }
        })
        .catch(() => setMenuBtnList([]));
    } else {
      setMenuBtnList([]);
    }
  }, [menu?.menuSeq]);

  const staticKey = getStaticRouteKey(pathname);

  let Comp: React.ComponentType<{
    onChange: (flag: boolean) => void;
    menuInfo?: MenuInfo;
    handlersRef?: React.MutableRefObject<PageButtonHandlers>;
  }> | null = null;
  let menuItem: MenuInfo | null = null;

  const isDashboard = pathname === '/';

  if (isDashboard) {
    Comp = getPageComponent('DashBoard');
  } else if (menu?.menuViewPath) {
    menuItem = menu;
    const viewPath = menu.menuViewPath.replace(/^\//, '');
    Comp = getPageComponent(viewPath);
  } else if (staticKey) {
    Comp = getPageComponent(staticKey);
  }

  if (menuInfo.length && !Comp && pathname !== '/') {
    return <ErrorPage404 onChange={onChange} />;
  }

  if (!Comp) {
    return <div className="container_wrap" />;
  }

  if (menuItem) {
    return (
      <div className="container_wrap">
        <div className="container_inner">
          <Suspense fallback={<></>}>
            <section className="title-wrap">
              <div className="box-flex">
                <h2 className="title">{menuItem.menuNm}</h2>
                <Breadcrumb
                  separator={[<IconStepArrow key="sep" />]}
                  className="bread-crumb"
                  items={[
                    {
                      title: (
                        <>
                          <IconHome />
                          <span className="txt">
                            {menuItem.menuNamePath.split('>')[1]?.trim() ?? menuItem.menuNm}
                          </span>
                        </>
                      ),
                    },
                    {
                      title: <span className="txt">{menuItem.menuNm}</span>,
                    },
                  ]}
                />
              </div>
            </section>
            <MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />
            <Comp onChange={onChange} menuInfo={menuItem} handlersRef={handlersRef} />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="container_wrap">
      <div className="container_inner">
        <Suspense fallback={<></>}>
          {isDashboard && (
            <section className="title-wrap">
              <div className="box-flex">
                <h2 className="title">대시보드</h2>
              </div>
            </section>
          )}
          <Comp onChange={onChange} />
        </Suspense>
      </div>
    </div>
  );
}

/** 멀티탭 모드 컴포넌트 */
function MultiTabContent({
  menuInfo,
  onChange,
}: {
  menuInfo: MenuInfo[];
  onChange: (flag: boolean) => void;
}) {
  const [tabList, setTabList] = useAtom(tabListAtom);
  const [activeTabKey, setActiveTabKey] = useAtom(activeTabKeyAtom);

  // 현재 URL에 해당하는 탭이 없으면 자동 오픈하는 헬퍼
  const ensureTabForPath = useCallback(
    (path: string) => {
      if (path === '/') return;
      const menu = menuInfo.find(
        (m) => m.menuTypeCd === 'V' && m.useYn === 'Y' && m.menuUrl === path,
      );
      if (!menu) return;

      const newTab = {
        key: menu.menuUrl,
        menuSeq: menu.menuSeq,
        menuNm: menu.menuNm,
        menuUrl: menu.menuUrl,
        menuViewPath: menu.menuViewPath,
        menuNamePath: menu.menuNamePath,
      };

      setTabList((prev) => {
        if (prev.find((t) => t.key === path)) return prev;
        // 5개 초과 시 첫번째 탭 제거 후 추가
        if (prev.length >= 10) {
          return [...prev.slice(1), newTab];
        }
        return [...prev, newTab];
      });
      setActiveTabKey(path);
    },
    [menuInfo, setTabList, setActiveTabKey],
  );

  // 최초 마운트 시 현재 URL에 해당하는 탭이 없으면 자동 오픈
  useEffect(() => {
    if (typeof window === 'undefined' || menuInfo.length === 0) return;
    const currentPath = window.location.pathname;
    ensureTabForPath(currentPath);
  }, [menuInfo, ensureTabForPath]);

  // 브라우저 뒤로/앞으로 버튼 처리
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        setActiveTabKey(null);
        return;
      }
      ensureTabForPath(currentPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [ensureTabForPath, setActiveTabKey]);

  // activeTabKey 기반으로 대시보드 여부 판단 (pathname 의존 X)
  const showDashboard = activeTabKey === null || tabList.length === 0;

  if (showDashboard) {
    const DashBoard = getPageComponent('DashBoard');
    return (
      <div className="container_wrap">
        <div className="container_inner">
          <Suspense fallback={<></>}>
            <section className="title-wrap">
              <div className="box-flex">
                <h2 className="title">대시보드</h2>
              </div>
            </section>
            {DashBoard && <DashBoard onChange={onChange} />}
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <>
      {tabList.map((tab) => (
        <TabPage
          key={tab.key}
          tab={tab}
          menuInfo={menuInfo}
          isActive={tab.key === activeTabKey}
          onChange={onChange}
        />
      ))}
    </>
  );
}

export default function MainContent() {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const menuInfo = useAtomValue(menuInfoAtom);
  const setShowErrorPage = useSetAtom(showErrorPageAtom);
  const tabMode = useAtomValue(tabModeAtom);
  const hasRedirected = useRef(false);

  // 리다이렉트 처리
  useEffect(() => {
    if (menuInfo.length === 0) return;
    if (typeof window !== 'undefined' && window.location.href.includes('987654321')) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace('/');
      }
    }
  }, [pathname, menuInfo, router]);

  const onChange = useCallback(
    (flag: boolean) => {
      setShowErrorPage(flag);
    },
    [setShowErrorPage],
  );

  if (tabMode) {
    return <MultiTabContent menuInfo={menuInfo} onChange={onChange} />;
  }

  return <SinglePageContent menuInfo={menuInfo} onChange={onChange} />;
}
