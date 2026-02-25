'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { callLogout } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import IconAlarm from '@icon/IconAlarm';
import IconLogout from '@icon/IconLogout';
import IconAdmin from '@icon/IconAdmin';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { useRecoilValue } from 'recoil';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { alarmItem } from '@interface/master/Alarm';
import {
  callUpdateAlarm,
  callUpdateAlarmAll,
  getSensorAlarmList,
} from '@api/master/AlarmApi';
import IconHumidity from '@icon/IconHumidity';
import IconBattery from '@icon/IconBattery';
import IconGps from '@icon/IconGps';
import IconProtractor from '@icon/IconProtractor';
import IconShock from '@icon/IconShock';
import IconSound from '@icon/IconSound';
import IconEmergency from '@icon/IconEmergency';

const iconMap: { [key: string]: JSX.Element } = {
  IconGps: <IconGps />,
  IconHumidity: <IconHumidity />,
  IconProtractor: <IconProtractor />,
  IconShock: <IconShock />,
  IconSound: <IconSound />,
  IconBattery: <IconBattery />,
  IconEmergency: <IconEmergency />,
};


function SidebarSubpanel({
  menuInfo,
  selectedParentId,
}: {
  menuInfo: MenuInfo[];
  selectedParentId: number | null;
}) {
  if (selectedParentId === null) return null;

  const parent = menuInfo.find((m) => m.menuSeq === selectedParentId && m.menuTypeCd === 'D');
  const children = parent
    ? menuInfo.filter((m) => m.upMenuSeq === parent.menuSeq && m.useYn === 'Y')
    : [];

  return (
    <div className="sidebar_subpanel">
      <div className="sidebar_subpanel_header">
        <span className="sidebar_subpanel_title">{parent?.menuNm ?? ''}</span>
      </div>
      <nav className="sidebar_menu">
        {children.map((child) => (
          <Link
            key={child.menuSeq}
            href={child.menuUrl}
            className="sidebar_menu_child"
          >
            {child.menuNm}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar({
  onSubpanelOpenChange,
}: {
  menuInfo?: MenuInfo[];
  onSubpanelOpenChange?: (open: boolean) => void;
}) {
  const sessionInfo = useRecoilValue(sessionInfoAtom);
  const menuInfo = useRecoilValue(menuInfoAtom);
  const [sensorAlrmData, setSensorAlrmData] = useState<alarmItem[]>([]);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [subpanelOpen, setSubpanelOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const sidebarWrapRef = useRef<HTMLElement>(null);

  const parentMenus = menuInfo.filter((item) => item.menuTypeCd === 'D' && item.useYn === 'Y');

  const handleParentClick = (menuId: number) => {
    if (selectedParentId === menuId) {
      setSubpanelOpen(false);
      setSelectedParentId(null);
      onSubpanelOpenChange?.(false);
    } else {
      setSelectedParentId(menuId);
      setSubpanelOpen(true);
      onSubpanelOpenChange?.(true);
    }
  };

  const handleSubpanelClose = () => {
    setSubpanelOpen(false);
    setSelectedParentId(null);
    onSubpanelOpenChange?.(false);
  };

  const logout = async () => {
    const data = await callLogout();
    if (data.code === HttpStatusCode.Ok) location.href = location.pathname;
  };

  const handleAlarmToggle = () => {
    if (!alarmOpen) {
      getSensorAlarmList(false).then((res) => {
        if (res.code === HttpStatusCode.Ok && res.item) {
          setSensorAlrmData(res.item);
          setAlarmOpen(true);
        }
      });
    } else {
      setAlarmOpen(false);
    }
  };

  const updateChk = (snsrAlrmSeq: number) => {
    setSensorAlrmData((prevItems) =>
      prevItems.map((item) =>
        item.snsrAlrmSeq === snsrAlrmSeq ? { ...item, readCls: '', chkFlag: true } : item
      )
    );
    const saveSensorAlrmData = sensorAlrmData.find((item) => item.snsrAlrmSeq === snsrAlrmSeq);
    if (saveSensorAlrmData) {
      callUpdateAlarm(saveSensorAlrmData).then(() => {});
    }
  };

  const readAll = () => {
    setSensorAlrmData((prevItems) =>
      prevItems.map((item) => ({ ...item, chkFlag: true, readCls: '' }))
    );
    callUpdateAlarmAll().then();
  };

  const defaultMenu = (menuList: MenuInfo[]) => {
    const level2Menu = menuList.filter((item) => item.level === 2);
    if (level2Menu.length > 0) {
      const minumSeqMenu = level2Menu.reduce((minMenu, currentMenu) =>
        currentMenu.menuSeq < minMenu.menuSeq ? currentMenu : minMenu
      );
      const defaultUrl = location.origin + minumSeqMenu.menuUrl;
      location.href = defaultUrl;
    }
  };

  useEffect(() => {
    getSensorAlarmList(false).then((res) => {
      if (res.code === HttpStatusCode.Ok && res.item) setSensorAlrmData(res.item);
    });
  }, []);

  useEffect(() => {
    if (!subpanelOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (sidebarWrapRef.current && !sidebarWrapRef.current.contains(target)) {
        handleSubpanelClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [subpanelOpen]);

  return (
    <aside ref={sidebarWrapRef} className="sidebar_wrap">
      <div className="sidebar_narrow">
        <nav className="sidebar_narrow_menu">
          {parentMenus.map((parent) => (
            <button
              key={parent.menuSeq}
              type="button"
              className={`sidebar_narrow_item ${selectedParentId === parent.menuSeq ? 'is-active' : ''}`}
              onClick={() => handleParentClick(parent.menuSeq)}
            >
              <span className="sidebar_narrow_label">{parent.menuNm}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar_footer">
          <div className="sidebar_user">
            <div className="sidebar_user_thumb">
              <IconAdmin />
            </div>
            <span className="sidebar_user_name">
              {(sessionInfo && sessionInfo.userName) ?? ''}님
            </span>
          </div>
          <div className="sidebar_alarm_wrap">
            <button type="button" className="sidebar_alarm_btn" onClick={handleAlarmToggle}>
              <IconAlarm />
              <span className="sidebar_alarm_num">
                {sensorAlrmData.filter((item) => !item.chkFlag).length}
              </span>
            </button>
            {alarmOpen && (
              <div className="sidebar_alarm_pop">
                <p className="sidebar_alarm_pop_tit">
                  알림
                  <button
                    type="button"
                    className="sidebar_alarm_pop_read"
                    onClick={() => {
                      readAll();
                    }}
                  >
                    전체 읽음
                  </button>
                </p>
                <ul className="sidebar_alarm_list">
                  {sensorAlrmData.map((item) => (
                    <li key={item.snsrAlrmSeq}>
                      <a
                        className={item.readCls}
                        onClick={() => updateChk(item.snsrAlrmSeq)}
                        role="button"
                        tabIndex={0}
                      >
                        <span className={item.iconCls}>{iconMap[item.iconImg]}</span>
                        <div>
                          <p>{item.alarmText1}</p>
                          <p>{item.alarmText2}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
                <button type="button" className="sidebar_alarm_more">
                  이전 알람 보기
                </button>
              </div>
            )}
          </div>
          <button type="button" className="sidebar_logout" onClick={logout}>
            <IconLogout />
          </button>
        </div>
      </div>
      {subpanelOpen && (
        <SidebarSubpanel
          menuInfo={menuInfo}
          selectedParentId={selectedParentId}
        />
      )}
    </aside>
  );
}
