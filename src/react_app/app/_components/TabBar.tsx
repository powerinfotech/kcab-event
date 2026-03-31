'use client';

import React, { useCallback } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useRecoilValue } from 'recoil';
import { tabModeAtom } from '@atom/tabModeAtom';
import useTabManager from '@hook/useTabManager';

export default function TabBar() {
  const tabMode = useRecoilValue(tabModeAtom);
  const { tabList, activeTabKey, activateTab, closeTab, closeOtherTabs, closeAllTabs } =
    useTabManager();

  const getContextMenuItems = useCallback(
    (key: string): MenuProps['items'] => [
      { key: 'close', label: '닫기', onClick: () => closeTab(key) },
      { key: 'closeOthers', label: '다른 탭 닫기', onClick: () => closeOtherTabs(key) },
      { key: 'closeAll', label: '모두 닫기', onClick: () => closeAllTabs() },
    ],
    [closeTab, closeOtherTabs, closeAllTabs],
  );

  if (!tabMode || tabList.length === 0) return null;

  return (
    <div className="tab_bar">
      {tabList.map((tab) => (
        <Dropdown
          key={tab.key}
          menu={{ items: getContextMenuItems(tab.key) }}
          trigger={['contextMenu']}
        >
          <div
            className={`tab_item ${tab.key === activeTabKey ? 'is-active' : ''}`}
            onClick={() => activateTab(tab.key)}
          >
            <span className="tab_label">{tab.menuNm}</span>
            <button
              type="button"
              className="tab_close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.key);
              }}
            >
              &times;
            </button>
          </div>
        </Dropdown>
      ))}
    </div>
  );
}
