'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Breadcrumb } from 'antd';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import ErrorPage404 from '@error/ErrorPage404';
import { getPageComponent, getStaticRouteKey } from '@util/PageRegistry';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { showErrorPageAtom } from '@atom/showErrorPageAtom';

function getDefaultMenuPath(menuList: MenuInfo[]): string | null {
  const level2Menu = menuList.filter((item) => item.level === 2);
  if (level2Menu.length === 0) return null;
  const minumSeqMenu = level2Menu.reduce((minMenu, currentMenu) =>
    currentMenu.menuSeq < minMenu.menuSeq ? currentMenu : minMenu
  );
  const path = minumSeqMenu.menuUrl?.startsWith('/') ? minumSeqMenu.menuUrl : `/${minumSeqMenu.menuUrl || ''}`;
  return path && path !== '/' ? path : null;
}

export default function MainContent() {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const menuInfo = useRecoilValue(menuInfoAtom);
  const setShowErrorPage = useSetRecoilState(showErrorPageAtom);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (menuInfo.length === 0) return;
    const shouldRedirect =
      pathname === '/' ||
      (typeof window !== 'undefined' && window.location.href.includes('987654321'));
    if (!shouldRedirect) return;

    const defaultPath = getDefaultMenuPath(menuInfo);
    if (defaultPath && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(defaultPath);
    }
  }, [pathname, menuInfo, router]);

  const onChange = React.useCallback((flag: boolean) => {
    setShowErrorPage(flag);
  }, [setShowErrorPage]);

  const staticKey = getStaticRouteKey(pathname);
  const menu = menuInfo.find((m) => m.menuTypeCd === 'V' && m.useYn === 'Y' && m.menuUrl === pathname);

  let Comp: React.ComponentType<{ onChange: (flag: boolean) => void; menuInfo?: MenuInfo }> | null = null;
  let menuItem: MenuInfo | null = null;

  if (pathname === '/') {
    Comp = getPageComponent('Dashboard');
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
                      href: '',
                      title: (
                        <>
                          <IconHome />
                          <span className="txt">{menuItem.menuNamePath.split('>')[1]?.trim() ?? menuItem.menuNm}</span>
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
            <Comp onChange={onChange} menuInfo={menuItem} />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="container_wrap">
      <div className="container_inner">
        <Suspense fallback={<></>}>
          <Comp onChange={onChange} />
        </Suspense>
      </div>
    </div>
  );
}
