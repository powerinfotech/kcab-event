import React, {JSX, useEffect, useState} from 'react';
import {callLogout} from '@api/CommonApi';
import {HttpStatusCode} from 'axios';

import IconAlarm from '@icon/IconAlarm';
import IconLogout from '@icon/IconLogout';
import IconAdmin from '@icon/IconAdmin';
import LogoImage from '../assets/images/logo.png';
import {MenuInfo} from '@interface/auth/MenuManagement';
import {useRecoilValue} from 'recoil';
import {sessionInfoAtom} from '@atom/sessionInfoAtom';
import {
    alarmItem
    ,alarmSearchCondition
} from "@interface/master/Alarm";
import {
    callUpdateAlarm, callUpdateAlarmAll,
    getSensorAlarmList
} from "@api/master/AlarmApi";

import IconHumidity from "@icon/IconHumidity";
import IconBattery from "@icon/IconBattery";
import IconGps from "@icon/IconGps";
import IconProtractor from "@icon/IconProtractor";
import IconShock from "@icon/IconShock";
import IconSound from "@icon/IconSound";
import IconEmergency from "@icon/IconEmergency";

function ParentMenu({parentMenu}:{parentMenu:MenuInfo}) {
    return (
        <p key={parentMenu.menuSeq} className='menu-main-link'><a href="#">{parentMenu.menuNm}</a></p>
    );
}

function ChildMenu({parentMenu, menuList}:{parentMenu:MenuInfo, menuList:MenuInfo[]}) {
    return (<div className='menu-sub-link'>
            {menuList.filter((menu) => menu.upMenuSeq === parentMenu.menuSeq && menu.useYn === 'Y').map((menu) => {
               return <p key={menu.menuSeq} style={{cursor:'pointer'}}><a onClick={()=>window.location.replace(menu.menuUrl)}>{menu.menuNm}</a></p>;
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

    const [sensorAlrmData, setSensorAlrmData] = useState<alarmItem[]>([]);
    const [alarmSearchCondition, setAlarmSearchCondition] = useState<alarmSearchCondition>({allFlag:false});
    const iconMap: { [key: string]: JSX.Element }= {
        'IconGps': <IconGps />,
        'IconHumidity': <IconHumidity />,
        'IconProtractor': <IconProtractor />,
        'IconShock': <IconShock />,
        'IconSound': <IconSound />,
        'IconBattery': <IconBattery />,
    };

    const logout = async () => {
       const data = await callLogout();
       if(data.code === HttpStatusCode.Ok)
           location.href = location.pathname;
    };

    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        if(!isOn)
        {
            getSensorAlarmList(false).then((res) => {
                if (res.code === HttpStatusCode.Ok && res.item) {
                    setSensorAlrmData(res.item);
                    setIsOn(!isOn);
                }
            });
        }
        else
        {
            setIsOn(!isOn);
        }
    };

    const dataSearch = async (allFlag:boolean) => {
        getSensorAlarmList(allFlag).then((res) => {
            if (res.code === HttpStatusCode.Ok && res.item) {
                setSensorAlrmData(res.item);
            }
        });
    };

    const updateChk = (snsrAlrmSeq: number) => {
        setSensorAlrmData(prevItems =>
            prevItems.map(item =>
                item.snsrAlrmSeq === snsrAlrmSeq ? { ...item, readCls: '', chkFlag : true } : item
            )
        );
        const saveSensorAlrmData = sensorAlrmData.find(item => item.snsrAlrmSeq === snsrAlrmSeq);
        if (saveSensorAlrmData) {
            callUpdateAlarm(saveSensorAlrmData).then(res => {
            });
        }
    };

    const readAll = () => {
        setSensorAlrmData(prevItems =>
            prevItems.map(item => ({ ...item, chkFlag: true, readCls: '' }))
        );
        callUpdateAlarmAll().then();
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

    useEffect(() => {
        dataSearch(false);
    }, []);

    return (
        <div className='header_wrap' >
            <div
                className={!isMenuHovered ? 'menu-dim' : 'menu-dim on'}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            ></div>

            <div className='inner'>
                <a className='logo'  style={{ cursor: 'pointer' }} onClick={()=>defaultMenu(menuInfo)}>
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

                    <div className='alarm' onClick={handleToggle}>
                        <IconAlarm />
                        <span className='num'>{sensorAlrmData.filter(item => !item.chkFlag).length}</span>
                    </div>

                    <div className={`alarm-pop ${isOn ? "on" : ""}`}>
                        <p className='tit'>
                            알림
                            <button className='btn btn-read' type='button'>전체 읽음</button>
                        </p>

                        {isOn && (
                            <ul className='list' >
                                {sensorAlrmData.map((item) => {
                                    return (
                                        <li key={item.snsrAlrmSeq}>
                                            <a className={item.readCls} onClick={() => {
                                                updateChk(item.snsrAlrmSeq);
                                            }}>
                                                    <span className={item.iconCls}>
                                                        {iconMap[item.iconImg]}
                                                    </span>
                                                <div>
                                                    <p>{item.alarmText1}</p>
                                                    <p>{item.alarmText2}</p>
                                                </div>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        <button className='btn btn-more'>이전 알람 보기</button>
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