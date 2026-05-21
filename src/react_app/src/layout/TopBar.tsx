'use client';

import { callLogout } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { useMessage } from '@hook/useMessage';
import { getAdminRole } from '@util/fixedAdminMenus';

export default function TopBar() {
  const sessionInfo = useAtomValue(sessionInfoAtom);
  const { confirm } = useMessage();
  const role = getAdminRole(sessionInfo.admYn);
  const roleLabel = role === 'ADMIN' ? 'Admin' : (sessionInfo.organizationName || 'Organization');
  const userLabel = sessionInfo.userName || (role === 'ADMIN' ? 'Admin' : 'Organization');

  const logout = async () => {
    if (!await confirm('Do you want to sign out?')) return;
    const data = await callLogout();
    if (data.code === HttpStatusCode.Ok) {
      sessionStorage.removeItem('tabList');
      sessionStorage.removeItem('activeTabKey');
      location.href = '/login';
    }
  };

  const toggleSidebar = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('saf-sidebar-toggle'));
    }
  };

  return (
    <div className="app_topbar">
      <div className="app_topbar_left">
        <button
          type="button"
          className="app_topbar_menu_toggle"
          aria-label="Open menu"
          onClick={toggleSidebar}
        >
          <MenuOutlined />
        </button>
      </div>
      <div className="app_topbar_right">
        <div className="app_topbar_user">
          <span className="app_topbar_identity">
            <span className={`app_topbar_scope ${role === 'ADMIN' ? 'is-admin' : 'is-organization'}`}>
              {roleLabel}
            </span>
            <span className="app_topbar_name">
              {userLabel}
            </span>
          </span>
        </div>
        <button type="button" className="app_topbar_logout" onClick={logout} aria-label="Sign out">
          <LogoutOutlined />
        </button>
      </div>
    </div>
  );
}
