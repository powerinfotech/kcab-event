'use client';

import { callLogout } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import IconLogout from '@icon/IconLogout';
import IconAdmin from '@icon/IconAdmin';
import { useAtomValue } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import TabBar from '../../app/_components/TabBar';

export default function TopBar() {
  const sessionInfo = useAtomValue(sessionInfoAtom);

  const logout = async () => {
    const data = await callLogout();
    if (data.code === HttpStatusCode.Ok) {
      sessionStorage.removeItem('tabList');
      sessionStorage.removeItem('activeTabKey');
      location.href = location.pathname;
    }
  };

  return (
    <div className="app_topbar">
      <div className="app_topbar_left">
        <TabBar />
      </div>
      <div className="app_topbar_right">
        <div className="app_topbar_user">
          <div className="app_topbar_thumb">
            <IconAdmin />
          </div>
          <span className="app_topbar_name">
            {(sessionInfo && sessionInfo.userName) ?? ''}님
          </span>
        </div>
        <button type="button" className="app_topbar_logout" onClick={logout}>
          <IconLogout />
        </button>
      </div>
    </div>
  );
}
