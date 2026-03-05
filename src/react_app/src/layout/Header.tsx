import React, {useEffect, useState} from 'react';
import {callLogout} from '@api/CommonApi';
import {HttpStatusCode} from 'axios';

import IconLogout from '@icon/IconLogout';
import IconAdmin from '@icon/IconAdmin';
import LogoImage from '../assets/images/logo.png';
import {MenuInfo} from '@interface/auth/MenuManagement';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';

function ParentMenu({parentMenu}:{parentMenu:MenuInfo}) {
    return (
        <p key={parentMenu.menuSeq} className='menu-main-link'><a href="#">{parentMenu.menuNm}</a></p>
    );
}

function ChildMenu({parentMenu, menuList}:{parentMenu:MenuInfo, menuList:MenuInfo[]}) {
    return (<div className='menu-sub-link'>
            {menuList.filter((menu) => menu.upMenuSeq === parentMenu.menuSeq && menu.useYn === 'Y').map((menu) => {
               return <p key={menu.menuSeq} className="cursor-pointer"><a onClick={()=>window.location.replace(menu.menuUrl)}>{menu.menuNm}</a></p>;
            })}
        </div>
    );
}


function Menu({menuInfo}: { menuInfo: MenuInfo[] }) {
    return (
        <>
            {menuInfo.filter((item) => item.menuTypeCd === 'D').map((parentMenu) => {
                return <div key={parentMenu.menuSeq}>
                           <ParentMenu parentMenu={parentMenu}/>
                      </div>;
            })}

            <div className='menu-sub'>
            {menuInfo.filter((item) => item.menuTypeCd === 'D').map((parentMenu) => {
                return <div key={parentMenu.menuSeq}>
                    <div className='menu-sub-link'>
                        <ChildMenu parentMenu={parentMenu} menuList={menuInfo}/>
                    </div>
                </div>;
            })}
            </div>
        </>
    );
}

const Header = ({menuInfo}: { menuInfo: MenuInfo[] }) => {
    const sessionInfo = useRecoilValue(sessionInfoAtom);
    const [isMenuHovered, setIsMenuHovered] = useState(false);

    const handleMouseEnter = () => { setIsMenuHovered(true); };
    const handleMouseLeave = () => { setIsMenuHovered(false); };

    const logout = async () => {
       const data = await callLogout();
       if(data.code === HttpStatusCode.Ok)
           location.href = location.pathname;
    };

    const defaultMenu = (menuList: MenuInfo[]) => {
        const level2Menu = menuList.filter((item) => item.level === 2);

        if (level2Menu.length > 0) {
            const minumSeqMenu = level2Menu.reduce((minMenu, currentMenu) => {
                return currentMenu.menuSeq < minMenu.menuSeq ? currentMenu : minMenu;
            });

            const defaultUrl = location.origin + minumSeqMenu.menuUrl;
            location.href = defaultUrl;

        }
    };

    return (
        <div className='header_wrap' >
            <div
                className={!isMenuHovered ? 'menu-dim' : 'menu-dim on'}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            ></div>

            <div className='inner'>
                <a className='logo cursor-pointer' onClick={()=>defaultMenu(menuInfo)}>
                    <img src={typeof LogoImage === 'string' ? LogoImage : (LogoImage as { src?: string })?.src ?? ''} alt='서울특별시' />
                </a>

                <div
                    className="menu"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Menu menuInfo={menuInfo} />
                </div>

                <div className='login'>
                    <div className='user'>
                        <div className='thumb'>
                            <IconAdmin/>
                        </div>
                        <div className='name'>{(sessionInfo && sessionInfo.userName) ?? ''}님</div>
                    </div>

                    <div className='logout' onClick={logout}>
                        <IconLogout />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
