'use client';

import React, { useEffect, useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import { useCookies } from 'react-cookie';
import { App, Modal } from 'antd';
import { useSetAtom } from 'jotai';
import { ApiResponse } from '@interface/common';
import { getUserLoginInfo } from '@api/CommonApi';
import {
  callChangeForgotPassword,
  callSendPasswordResetCode,
  callVerifyPasswordResetCode,
} from '@api/auth/PasswordResetApi';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { menuInfoAtom } from '@atom/menuInfoAtom';
import { getFixedAdminMenuInfo } from '@util/fixedAdminMenus';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTH_MESSAGE_STORAGE_KEY = 'kcab-auth-message';
const PASSWORD_RESET_EXPIRE_SECONDS = 5 * 60;
type ForgotStep = 'request' | 'verify' | 'reset';

const forgotLabelStyle = {
  display: 'block',
  marginBottom: 6,
  color: '#334155',
  fontWeight: 700,
  fontSize: 13,
};

const forgotInputStyle = {
  width: '100%',
  height: 40,
  border: '1px solid #d7dee8',
  borderRadius: 6,
  padding: '0 12px',
  fontSize: 14,
};

const formatRemainingTime = (seconds: number) => {
  const safeSeconds = Math.max(seconds, 0);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const remainSeconds = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainSeconds}`;
};

const Login = () => {
  const { message } = App.useApp();
  const setSessionInfo = useSetAtom(sessionInfoAtom);
  const setMenuInfo = useSetAtom(menuInfoAtom);
  const [cookies, setCookie, removeCookie] = useCookies(['id'], { doNotParse: true });
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [loading, setLoading] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>('request');
  const [forgotUserId, setForgotUserId] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const [forgotRemainingSec, setForgotRemainingSec] = useState(0);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const openForgotPassword = () => {
    setForgotStep('request');
    setForgotUserId('');
    setForgotEmail('');
    setForgotCode('');
    setResetPassword('');
    setResetPasswordConfirm('');
    setForgotRemainingSec(0);
    setForgotOpen(true);
  };

  const closeForgotPassword = () => {
    if (forgotSubmitting) return;
    setForgotOpen(false);
  };

  const handleForgotSubmit = async () => {
    const resetUserId = forgotUserId.trim();
    const email = forgotEmail.trim();

    if (!resetUserId) {
      message.warning('Please enter your user ID.');
      return;
    }
    if (!email) {
      message.warning('Please enter your email.');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      message.warning('Please enter a valid email address.');
      return;
    }

    setForgotSubmitting(true);
    try {
      if (forgotStep === 'request') {
        await ensureCsrfToken();
        const sendResult = await callSendPasswordResetCode({userId: resetUserId, email});
        if (sendResult.code !== HttpStatusCode.Ok) return;

        message.success('Verification code has been sent to your email.');
        setForgotRemainingSec(PASSWORD_RESET_EXPIRE_SECONDS);
        setForgotStep('verify');
        return;
      }

      if (forgotStep === 'verify') {
        if (forgotRemainingSec <= 0) {
          message.warning('Verification code has expired. Please request a new code.');
          setForgotStep('request');
          setForgotCode('');
          return;
        }
        if (!/^\d{6}$/.test(forgotCode)) {
          message.warning('Please enter the 6-digit verification code.');
          return;
        }

        await ensureCsrfToken();
        const verifyResult = await callVerifyPasswordResetCode({code: forgotCode});
        if (verifyResult.code !== HttpStatusCode.Ok) return;

        message.success('Verification code confirmed.');
        setForgotRemainingSec(0);
        setForgotStep('reset');
        return;
      }

      if (!resetPassword) {
        message.warning('Please enter a new password.');
        return;
      }
      if (resetPassword !== resetPasswordConfirm) {
        message.warning('Password and Confirm Password do not match.');
        return;
      }

      await ensureCsrfToken();
      const changeResult = await callChangeForgotPassword({password: resetPassword, passwordConfirm: resetPasswordConfirm});
      if (changeResult.code !== HttpStatusCode.Ok) return;

      message.success('Password has been changed. Please sign in with your new password.');
      setForgotRemainingSec(0);
      setForgotOpen(false);
    } finally {
      setForgotSubmitting(false);
    }
  };

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
    if (!forgotOpen || forgotStep !== 'verify' || forgotRemainingSec <= 0) return;

    const timerId = window.setTimeout(() => {
      setForgotRemainingSec((remainingSec) => {
        if (remainingSec <= 1) {
          setForgotCode('');
          setForgotStep('request');
          return 0;
        }
        return remainingSec - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [forgotOpen, forgotRemainingSec, forgotStep]);

  useEffect(() => {
    const authMessage = sessionStorage.getItem(AUTH_MESSAGE_STORAGE_KEY);
    if (authMessage) {
      sessionStorage.removeItem(AUTH_MESSAGE_STORAGE_KEY);
      message.warning(authMessage);
    }

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

  const forgotOkText = forgotStep === 'request'
    ? 'Send verification code'
    : forgotStep === 'verify'
      ? 'Verify code'
      : 'Reset password';

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
            <button type="button" onClick={openForgotPassword}>
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

      <Modal
        title="Forgot password"
        open={forgotOpen}
        onOk={handleForgotSubmit}
        onCancel={closeForgotPassword}
        okText={forgotOkText}
        cancelText="Cancel"
        confirmLoading={forgotSubmitting}
        mask={{ closable: !forgotSubmitting }}
        destroyOnHidden
      >
        <p style={{ marginBottom: 16, color: '#64748b' }}>
          {forgotStep === 'request'
            ? 'Enter your user ID and email. We will send a verification code to your email.'
            : forgotStep === 'verify'
              ? 'Enter the 6-digit verification code from your email.'
              : 'Enter your new password.'}
        </p>
        <form
          className="saf-forgot-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleForgotSubmit();
          }}
        >
          {forgotStep === 'request' && (
            <>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <span style={forgotLabelStyle}>User ID</span>
                <input
                  value={forgotUserId}
                  onChange={(event) => setForgotUserId(event.target.value)}
                  placeholder="User ID"
                  autoComplete="username"
                  style={forgotInputStyle}
                />
              </label>
              <label style={{ display: 'block' }}>
                <span style={forgotLabelStyle}>Email</span>
                <input
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                  style={forgotInputStyle}
                />
              </label>
            </>
          )}
          {forgotStep === 'verify' && (
            <>
              <label style={{ display: 'block' }}>
                <span style={forgotLabelStyle}>Verification code</span>
                <input
                  value={forgotCode}
                  onChange={(event) => setForgotCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  style={{
                    ...forgotInputStyle,
                    letterSpacing: 4,
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                />
              </label>
              <div
                role="timer"
                aria-live="polite"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginTop: 12,
                  padding: '10px 12px',
                  borderRadius: 6,
                  background: forgotRemainingSec > 0 ? '#f8fafc' : '#fff1f2',
                  border: `1px solid ${forgotRemainingSec > 0 ? '#e2e8f0' : '#fecdd3'}`,
                  color: forgotRemainingSec > 0 ? '#475569' : '#be123c',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <span>{forgotRemainingSec > 0 ? 'Code expires in' : 'Code expired'}</span>
                <strong style={{ fontVariantNumeric: 'tabular-nums', fontSize: 16 }}>
                  {formatRemainingTime(forgotRemainingSec)}
                </strong>
              </div>
            </>
          )}
          {forgotStep === 'reset' && (
            <>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <span style={forgotLabelStyle}>New password</span>
                <input
                  value={resetPassword}
                  onChange={(event) => setResetPassword(event.target.value)}
                  placeholder="New password"
                  type="password"
                  autoComplete="new-password"
                  style={forgotInputStyle}
                />
              </label>
              <label style={{ display: 'block' }}>
                <span style={forgotLabelStyle}>Confirm password</span>
                <input
                  value={resetPasswordConfirm}
                  onChange={(event) => setResetPasswordConfirm(event.target.value)}
                  placeholder="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  style={forgotInputStyle}
                />
              </label>
            </>
          )}
          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </form>
      </Modal>
    </main>
  );
};

export default Login;
