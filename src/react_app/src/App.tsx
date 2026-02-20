import React, {useEffect, useState} from 'react';
import './App.css';
import {ConfigProvider} from 'antd';
import locale from 'antd/lib/locale/ko_KR';
import Container from '@layout/Container';
import {produce} from 'immer';
import Header from '@layout/Header';
import Footer from '@layout/Footer';
import '@scss/Common.scss';
import Login from '@page/Login';
import {getUserLoginInfo, getUserMenuInfo} from '@api/CommonApi';
import {useRecoilState} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';
import {MenuInfo} from '@interface/auth/MenuManagement';
import {HttpStatusCode} from 'axios';

function App() {
    const [sessionInfo, setSessionInfo] = useRecoilState(sessionInfoAtom);
    const [showErrorPage, setShowErrorPage] = useState(false);
    const [isLogin, setIsLogin] = useState<boolean|undefined>(undefined);
    const [menuInfo, setMenuInfo] = useState<MenuInfo[]>([]);

    const getLoginUserInfo = async() => {
        getUserLoginInfo().then((res)=> {
             if(res != null) {
                if(res.code === HttpStatusCode.Ok && res.item) {
                    setIsLogin(true);
                    if( sessionInfo.userId !== res.item.userId)
                        setSessionInfo({userId:res.item.userId
                                    , userName:res.item.userName
                                    , admFlag:res.item.admFlag});

                    getUserMenuInfo().then((res)=> {
                        if(res.code === HttpStatusCode.Ok )
                            if(res.item) {
                                setMenuInfo(res.item);
                                if(location.href.includes("987654321"))
                                {
                                    defaultMenu(res.item);
                                }
                            }
                    });
                }
                else {
                     setIsLogin(false);
                }
            }
        });

    };

    const defaultMenu = (menuList: MenuInfo[]) => {
        const level2Menu = menuList.filter((item) => item.level === 2);

        if (level2Menu.length > 0) {
            const minumSeqMenu = level2Menu.reduce((minMenu, currentMenu) => {
                return currentMenu.menuId < minMenu.menuId ? currentMenu : minMenu;
            });

            const defaultUrl = location.origin + minumSeqMenu.menuUri;
            location.href = defaultUrl;

        }
    };

    useEffect(() => {
        getLoginUserInfo();
    }, []);

    useEffect(() => {
        if (isLogin === true && location.pathname === '/') {
            defaultMenu(menuInfo);
        }
    }, [isLogin, menuInfo]);

    return (
          <ConfigProvider locale={locale} >
              {isLogin ? (
                  <>
                      {!showErrorPage && <Header menuInfo={menuInfo} />}
                      {isLogin && <Container menuInfo={menuInfo} onChange={(flag:boolean)=> setShowErrorPage(produce(showErrorPage, ()=> flag))} />}
                      {!showErrorPage && <Footer />}
                  </>
              ) : isLogin === false ? (
                  <Login />
              ) : (
                  <></>
              )}
          </ConfigProvider>
    );
}

export default App;
