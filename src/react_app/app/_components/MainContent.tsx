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
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { showErrorPageAtom } from '@atom/showErrorPageAtom';
import { callGetMenuBtnList } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import MenuButtonBar from '@component/MenuButtonBar';

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
  const handlersRef = useRef<PageButtonHandlers>({});
  const [menuBtnList, setMenuBtnList] = useState<MenuBtnDetail[]>([]);

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

  const menu = menuInfo.find((m) => m.menuTypeCd === 'V' && m.useYn === 'Y' && m.menuUrl === pathname);

  useEffect(() => {
    handlersRef.current = {};
    if (menu?.menuSeq) {
      callGetMenuBtnList(menu.menuSeq).then((res) => {
        if (res?.code === HttpStatusCode.Ok && res.item) {
          setMenuBtnList(res.item);
        } else {
          setMenuBtnList([]);
        }
      }).catch(() => setMenuBtnList([]));
    } else {
      setMenuBtnList([]);
    }
  }, [menu?.menuSeq]);

  const onChange = useCallback((flag: boolean) => {
    setShowErrorPage(flag);
  }, [setShowErrorPage]);

  const staticKey = getStaticRouteKey(pathname);

  let Comp: React.ComponentType<{ onChange: (flag: boolean) => void; menuInfo?: MenuInfo; handlersRef?: React.MutableRefObject<PageButtonHandlers> }> | null = null;
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
          <Comp onChange={onChange} />
        </Suspense>
      </div>
    </div>
  );
}
