'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { callLogout } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import IconLogout from '@icon/IconLogout';
import IconAdmin from '@icon/IconAdmin';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { useRecoilValue } from 'recoil';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';

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
