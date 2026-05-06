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
      message.warning('아이디와 비밀번호를 입력하세요.');
      return;
    }

    setLoading(true);
    try {
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
      axios.post<ApiResponse<boolean>>('/api/login', {
        userId: result[0],
        password: result[1],
        mode: 'auto',
      }).then(({ data }) => {
        if (data.code === HttpStatusCode.Ok) completeLogin();
      });
    }
  }, []);

  return (
    <main className="saf-login-page">
      <section className="saf-login-card" aria-label="관리자 로그인">
        <div className="saf-login-brand">
          <span>KCAB 국제중재</span>
          <strong>관리자 콘솔</strong>
          <p>승인된 관리자만 접근할 수 있습니다.</p>
        </div>

        <form
          className="saf-login-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <p className="saf-login-kicker">슈퍼관리자 / 로펌 관리자 통합 로그인</p>
          <h1>로그인</h1>
          <p className="saf-login-desc">아이디와 비밀번호를 입력하세요.</p>

          <label>
            <span>아이디</span>
            <input
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="kcab/admin"
              autoComplete="username"
            />
          </label>

          <label>
            <span>비밀번호</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
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
              <span>로그인 상태 유지</span>
            </label>
            <button type="button" onClick={() => message.info('관리자에게 문의해 주세요.')}>
              비밀번호 찾기
            </button>
          </div>

          <button className="saf-login-submit" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            className="saf-login-signup"
            type="button"
            onClick={() => { window.location.href = '/admin/signup'; }}
          >
            기업 회원가입
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
