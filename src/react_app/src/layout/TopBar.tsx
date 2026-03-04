'use client';

import { callLogout } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import IconLogout from '@icon/IconLogout';
import IconAdmin from '@icon/IconAdmin';
import { useRecoilValue } from 'recoil';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';

export default function TopBar() {
  const sessionInfo = useRecoilValue(sessionInfoAtom);

  const logout = async () => {
    const data = await callLogout();
    if (data.code === HttpStatusCode.Ok) location.href = location.pathname;
  };

  return (
    <div className="app_topbar">
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
  );
}
