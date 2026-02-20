'use client';

import React, { useEffect, useState } from 'react';
import { produce } from 'immer';
import Header from '@layout/Header';
import Footer from '@layout/Footer';
import Login from '@page/Login';
import { getUserLoginInfo, getUserMenuInfo } from '@api/CommonApi';
import { useRecoilState } from 'recoil';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { HttpStatusCode } from 'axios';
import MainContent from './MainContent';

function defaultMenu(menuList: MenuInfo[]) {
  const level2Menu = menuList.filter((item) => item.level === 2);
  if (level2Menu.length > 0) {
    const minumSeqMenu = level2Menu.reduce((minMenu, currentMenu) =>
      currentMenu.menuId < minMenu.menuId ? currentMenu : minMenu
    );
    const defaultUrl = (typeof window !== 'undefined' ? window.location.origin : '') + minumSeqMenu.menuUri;
    if (typeof window !== 'undefined') window.location.href = defaultUrl;
  }
}

export default function ClientRoot() {
  const [sessionInfo, setSessionInfo] = useRecoilState(sessionInfoAtom);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined);
  const [menuInfo, setMenuInfo] = useState<MenuInfo[]>([]);

  const getLoginUserInfo = async () => {
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
          if (typeof window !== 'undefined' && window.location.href.includes('987654321')) {
            defaultMenu(menuRes.item);
          }
        }
      } else {
        setIsLogin(false);
      }
    } catch {
      // API 오류(500, 연결 실패 등) 시 로그인 화면 표시
      setIsLogin(false);
    }
  };

  useEffect(() => {
    getLoginUserInfo();
  }, []);

  useEffect(() => {
    if (isLogin === true && typeof window !== 'undefined' && window.location.pathname === '/') {
      defaultMenu(menuInfo);
    }
  }, [isLogin, menuInfo]);

  if (isLogin === true) {
    return (
      <>
        {!showErrorPage && <Header menuInfo={menuInfo} />}
        {isLogin && (
          <MainContent
            menuInfo={menuInfo}
            onChange={(flag: boolean) => setShowErrorPage(produce(showErrorPage, () => flag))}
          />
        )}
        {!showErrorPage && <Footer />}
      </>
    );
  }

  if (isLogin === false) {
    return <Login />;
  }

  return <></>;
}
