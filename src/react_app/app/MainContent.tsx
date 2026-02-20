'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from 'antd';
import IconStepArrow from '@icon/IconStepArrow';
import IconHome from '@icon/IconHome';
import ErrorPage404 from '@error/ErrorPage404';
import { getPageComponent, getStaticRouteKey } from '@util/PageRegistry';
import { MenuInfo } from '@interface/auth/MenuManagement';

export default function MainContent({
  menuInfo,
  onChange,
}: {
  menuInfo: MenuInfo[];
  onChange: (flag: boolean) => void;
}) {
  const pathname = usePathname() ?? '/';

  const staticKey = getStaticRouteKey(pathname);
  const menu = menuInfo.find((m) => m.menuTypeCd === 'V' && m.useFlag && m.menuUri === pathname);

  let Comp: React.ComponentType<{ onChange: (flag: boolean) => void; menuInfo?: MenuInfo }> | null = null;
  let menuItem: MenuInfo | null = null;

  if (pathname === '/') {
    Comp = getPageComponent('Dashboard');
  } else if (staticKey) {
    Comp = getPageComponent(staticKey);
  } else if (menu) {
    menuItem = menu;
    const viewPath = menu.menuViewPath.replace(/^\//, '');
    Comp = getPageComponent(viewPath);
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
