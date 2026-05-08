'use client';

import React, { useCallback } from 'react';
import { Dropdown, Tooltip } from 'antd';
import { CloseSquareOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAtomValue } from 'jotai';
import { tabModeAtom } from '@atom/tabModeAtom';
import useTabManager from '@hook/useTabManager';
import { useMessage } from '@hook/useMessage';

export default function TabBar() {
  const tabMode = useAtomValue(tabModeAtom);
  const { tabList, activeTabKey, activateTab, closeTab, closeOtherTabs, closeAllTabs } =
    useTabManager();
  const { confirm } = useMessage();

  const getContextMenuItems = useCallback(
    (key: string): MenuProps['items'] => [
      { key: 'close', label: 'Close', onClick: () => closeTab(key) },
      { key: 'closeOthers', label: 'Close Others', onClick: () => closeOtherTabs(key) },
      { key: 'closeAll', label: 'Close All', onClick: () => closeAllTabs() },
    ],
    [closeTab, closeOtherTabs, closeAllTabs],
  );

  const handleCloseAll = useCallback(async () => {
    const confirmed = await confirm(
      'This will close all open screens.\nDo you want to continue?',
    );
    if (confirmed) {
      closeAllTabs();
    }
  }, [confirm, closeAllTabs]);

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
      <Tooltip title="Close all screens">
        <button
          type="button"
          className="tab_close_all"
          onClick={handleCloseAll}
        >
          <CloseSquareOutlined />
        </button>
      </Tooltip>
    </div>
  );
}
