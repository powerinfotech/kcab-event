'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuInfo } from '@interface/auth/MenuManagement';
import { useRecoilValue } from 'recoil';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import LogoImage from '@image/powerInfoTech_logo.png';

function SidebarSubpanel({
  menuInfo,
  selectedParentId,
  onMenuClick,
}: {
  menuInfo: MenuInfo[];
  selectedParentId: number | null;
  onMenuClick?: () => void;
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
            onClick={onMenuClick}
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
  onSubpanelOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const menuInfo = useRecoilValue(menuInfoAtom);
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
        <div className="sidebar_logo" onClick={() => router.push('/')}>
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
      </div>
      {subpanelOpen && (
        <SidebarSubpanel
          menuInfo={menuInfo}
          selectedParentId={selectedParentId}
          onMenuClick={handleSubpanelClose}
        />
      )}
    </aside>
  );
}
