'use client';

import { callLogout } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { useMessage } from '@hook/useMessage';
import { getAdminRole } from '@util/fixedAdminMenus';

export default function TopBar() {
  const sessionInfo = useAtomValue(sessionInfoAtom);
  const { confirm } = useMessage();
  const role = getAdminRole(sessionInfo.admYn);

  const logout = async () => {
    if (!await confirm('Do you want to sign out?')) return;
    const data = await callLogout();
    if (data.code === HttpStatusCode.Ok) {
      sessionStorage.removeItem('tabList');
      sessionStorage.removeItem('activeTabKey');
      location.href = '/login';
    }
  };

  return (
    <div className="app_topbar">
      <div className="app_topbar_left" />
      <div className="app_topbar_right">
        <div className="app_topbar_user">
          <div className="app_topbar_thumb">
            <UserOutlined />
          </div>
          <span className="app_topbar_name">
            {sessionInfo.userName || (role === 'ADMIN' ? 'Admin' : 'Organization')}
          </span>
        </div>
        <button type="button" className="app_topbar_logout" onClick={logout} aria-label="Sign out">
          <LogoutOutlined />
        </button>
      </div>
    </div>
  );
}
