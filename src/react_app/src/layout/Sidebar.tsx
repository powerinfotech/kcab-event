'use client';

import React, { useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { FileTextOutlined, AppstoreOutlined } from '@ant-design/icons';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { tabModeAtom } from '@atom/tabModeAtom';
import { tabListAtom, activeTabKeyAtom } from '@atom/tabListAtom';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import useTabManager from '@hook/useTabManager';
import LogoImage from '@image/powerInfoTech_logo.png';

function SidebarSubpanel({
  menuInfo,
  selectedParentId,
  onMenuClick,
  tabMode,
  onTabOpen,
  setCurrentPath,
}: {
  menuInfo: MenuInfo[];
  selectedParentId: number | null;
  onMenuClick?: () => void;
  tabMode: boolean;
  onTabOpen: (menu: MenuInfo) => void;
  setCurrentPath: (path: string) => void;
}) {
  if (selectedParentId === null) return null;

  const parent = menuInfo.find((m) => m.menuSeq === selectedParentId && m.menuTypeCd === 'D');
  const children = parent
    ? menuInfo.filter((m) => m.upMenuSeq === parent.menuSeq && m.useYn === 'Y')
    : [];

  const handleClick = (e: React.MouseEvent, child: MenuInfo) => {
    e.preventDefault();
    if (tabMode) {
      onTabOpen(child);
    } else {
      pushPath(child.menuUrl, setCurrentPath);
    }
    onMenuClick?.();
  };

  return (
    <div className="sidebar_subpanel">
      <div className="sidebar_subpanel_header">
        <span className="sidebar_subpanel_title">{parent?.menuNm ?? ''}</span>
      </div>
      <nav className="sidebar_menu">
        {children.map((child) => (
          <a
            key={child.menuSeq}
            href={child.menuUrl}
            className="sidebar_menu_child"
            onClick={(e) => handleClick(e, child)}
          >
            {child.menuNm}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar({
  onSubpanelOpenChange,
}: {
  onSubpanelOpenChange?: (open: boolean) => void;
}) {
  const menuInfo = useAtomValue(menuInfoAtom);
  const [tabMode, setTabMode] = useAtom(tabModeAtom);
  const setTabList = useSetAtom(tabListAtom);
  const setActiveTabKey = useSetAtom(activeTabKeyAtom);
  const setCurrentPath = useSetAtom(currentPathAtom);
  const { openTab } = useTabManager();
  const [subpanelOpen, setSubpanelOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const sidebarWrapRef = useRef<HTMLElement>(null);

  const parentMenus = menuInfo.filter((item) => item.menuTypeCd === 'D' && item.useYn === 'Y');

  const handleParentHover = (menuId: number) => {
    setSelectedParentId(menuId);
    setSubpanelOpen(true);
    onSubpanelOpenChange?.(true);
  };

  const handleSubpanelClose = () => {
    setSubpanelOpen(false);
    setSelectedParentId(null);
    onSubpanelOpenChange?.(false);
  };

  return (
    <aside
      ref={sidebarWrapRef}
      className="sidebar_wrap"
      onMouseLeave={handleSubpanelClose}
    >
      <div className="sidebar_narrow">
        <div className="sidebar_logo" onClick={() => pushPath('/', setCurrentPath)}>
          <img src={typeof LogoImage === 'string' ? LogoImage : LogoImage.src} alt="Logo" />
        </div>
        <nav className="sidebar_narrow_menu">
          {parentMenus.map((parent) => (
            <button
              key={parent.menuSeq}
              type="button"
              className={`sidebar_narrow_item ${selectedParentId === parent.menuSeq ? 'is-active' : ''}`}
              onMouseEnter={() => handleParentHover(parent.menuSeq)}
            >
              <span className="sidebar_narrow_label">{parent.menuNm}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar_mode_toggle">
          <Tooltip title={tabMode ? '싱글 모드로 전환' : '멀티탭 모드로 전환'} placement="right">
            <button
              type="button"
              className={`sidebar_mode_btn ${tabMode ? 'is-multi' : ''}`}
              onClick={() => {
                const nextMode = !tabMode;
                if (!nextMode) {
                  // 멀티탭 → 싱글: 탭 전부 제거
                  setTabList([]);
                  setActiveTabKey(null);
                }
                setTabMode(nextMode);
              }}
            >
              <span className={`sidebar_mode_icon ${!tabMode ? 'is-selected' : ''}`}>
                <FileTextOutlined />
              </span>
              <span className={`sidebar_mode_icon ${tabMode ? 'is-selected' : ''}`}>
                <AppstoreOutlined />
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
      {subpanelOpen && (
        <SidebarSubpanel
          menuInfo={menuInfo}
          selectedParentId={selectedParentId}
          onMenuClick={handleSubpanelClose}
          tabMode={tabMode}
          onTabOpen={openTab}
          setCurrentPath={setCurrentPath}
        />
      )}
    </aside>
  );
}
