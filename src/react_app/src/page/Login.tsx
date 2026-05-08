'use client';

import React, { useEffect, useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import { useCookies } from 'react-cookie';
import { message } from 'antd';
import { useSetAtom } from 'jotai';
import { ApiResponse } from '@interface/common';
import { getUserLoginInfo } from '@api/CommonApi';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { getFixedAdminMenuInfo } from '@util/fixedAdminMenus';

const Login = () => {
  const setSessionInfo = useSetAtom(sessionInfoAtom);
  const setMenuInfo = useSetAtom(menuInfoAtom);
  const [cookies, setCookie, removeCookie] = useCookies(['id'], { doNotParse: true });
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [loading, setLoading] = useState(false);

  const ensureCsrfToken = async () => {
    await axios.get('/api/common/login-info', { headers: { showLoading: false } });
  };

  const completeLogin = async () => {
    const ret = await getUserLoginInfo();
    if (ret.code !== HttpStatusCode.Ok || !ret.item) return;

    if (rememberId) setCookie('id', userId);
    else removeCookie('id');

    setSessionInfo({
      userId: ret.item.userId,
      userName: ret.item.userName,
      admYn: ret.item.admYn ?? 'N',
    });
    setMenuInfo(getFixedAdminMenuInfo(ret.item.admYn));
    sessionStorage.removeItem('tabList');
    sessionStorage.removeItem('activeTabKey');
    window.location.href = '/admin';
  };

  const handleLogin = async (mode?: 'auto') => {
    if (!userId || (!password && mode !== 'auto')) {
      message.warning('Please enter your user ID and password.');
      return;
    }

    setLoading(true);
    try {
      await ensureCsrfToken();
      const { data } = await axios.post<ApiResponse<boolean>>('/api/login', {
        userId,
        password,
        mode,
      });
      if (data.code === HttpStatusCode.Ok) {
        await completeLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cookies.id) {
      setUserId(cookies.id);
      setRememberId(true);
    }

    let sso = location.pathname.replace(/^\/admin\/?/, '').replaceAll('/', '');
    const result = sso.split('987654321');
    if (result.length === 2) {
      setUserId(result[0]);
      setPassword(result[1]);
      ensureCsrfToken()
        .then(() => axios.post<ApiResponse<boolean>>('/api/login', {
          userId: result[0],
          password: result[1],
          mode: 'auto',
        }))
        .then(({ data }) => {
          if (data.code === HttpStatusCode.Ok) completeLogin();
        });
    }
  }, []);

  return (
    <main className="saf-login-page">
      <section className="saf-login-card" aria-label="Admin login">
        <div className="saf-login-brand">
          <span>KCAB International Arbitration</span>
          <strong>Admin Console</strong>
          <p>Access is limited to approved admins and organizations.</p>
        </div>

        <form
          className="saf-login-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <p className="saf-login-kicker">Admin / Organization Login</p>
          <h1>Sign in</h1>
          <p className="saf-login-desc">Enter your user ID and password.</p>

          <label>
            <span>User ID</span>
            <input
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
            />
          </label>

          <div className="saf-login-row">
            <label className="saf-login-check">
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(event) => setRememberId(event.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button type="button" onClick={() => message.info('Please contact the administrator.')}>
              Forgot password?
            </button>
          </div>

          <button className="saf-login-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <button
            className="saf-login-signup"
            type="button"
            onClick={() => { window.location.href = '/admin/signup'; }}
          >
            Organization Sign-up
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
