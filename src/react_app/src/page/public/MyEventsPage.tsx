'use client';

import React, { useEffect, useState } from 'react';
import HeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import {
  callRequestMyEventsCode,
  callVerifyMyEventsCode,
  callGetMyEventsSession,
  callExtendMyEventsSession,
} from '@api/myEvents/MyEventsApi';
import { MyEvent, MyEventsSession } from '@interface/public/MyEvents';

const assetSrc = (asset: string | { src?: string }) =>
  typeof asset === 'string' ? asset : asset.src ?? '';

type Step = 'email' | 'code' | 'events';

const getErrorMessage = (err: any): string =>
  err?.response?.data?.message || 'Something went wrong. Please try again.';

const fmtDateRange = (start?: string | null, end?: string | null): string => {
  if (!start) return '';
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return '';
  const opt: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const ss = s.toLocaleDateString('en-GB', opt);
  if (end) {
    const e = new Date(end);
    if (!Number.isNaN(e.getTime()) && e.toDateString() !== s.toDateString()) {
      return `${ss} – ${e.toLocaleDateString('en-GB', opt)}`;
    }
  }
  return ss;
};

const fmtTime = (value?: string | null): string => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const fmtCountdown = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const statusTone = (status?: string | null): string => {
  const s = (status || '').toLowerCase();
  if (s === 'cancelled' || s === 'canceled' || s === 'refunded' || s === 'failed') return 'is-gray';
  if (s === 'pending' || s === 'waiting') return 'is-amber';
  return 'is-green';
};

const titleCase = (value?: string | null): string => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export default function MyEventsPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [session, setSession] = useState<MyEventsSession | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [extending, setExtending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // 새로고침 시 유효 세션이 있으면 복원 (없으면 조용히 이메일 단계 유지)
  useEffect(() => {
    let active = true;
    callGetMyEventsSession()
      .then((res) => {
        if (!active || res?.code !== 200 || !res.item) return;
        setSession(res.item);
        setEmail(res.item.email);
        setRemaining(res.item.expiresInSeconds);
        setStep('events');
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // 카운트다운: events 단계에서 1초마다 감소
  useEffect(() => {
    if (step !== 'events') return;
    const timer = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(timer);
  }, [step]);

  // 만료 처리
  useEffect(() => {
    if (step === 'events' && remaining <= 0) {
      setSession(null);
      setStep('email');
      setCode('');
      setError('Your session has expired. Please verify your email again.');
    }
  }, [step, remaining]);

  const requestCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    const em = email.trim();
    if (!em) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await callRequestMyEventsCode(em);
      if (res?.code !== 200) {
        setError(res?.message || 'We could not send the verification code. Please try again.');
        return;
      }
      setInfo(`We sent a 6-digit verification code to ${em}. It expires in 10 minutes.`);
      setCode('');
      setStep('code');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    const c = code.trim();
    if (!c) {
      setError('Please enter the verification code.');
      return;
    }
    setLoading(true);
    try {
      const res = await callVerifyMyEventsCode(email.trim(), c);
      if (res?.code !== 200 || !res.item) {
        setError(res?.message || 'The verification code is invalid or expired. Please try again.');
        return;
      }
      setSession(res.item);
      setRemaining(res.item.expiresInSeconds);
      setStep('events');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const extendSession = async () => {
    setExtending(true);
    try {
      const res = await callExtendMyEventsSession();
      if (res?.code !== 200 || !res.item) {
        // 만료 등 — 만료 effect 가 처리하도록 남은 시간 0
        setRemaining(0);
        return;
      }
      setSession(res.item);
      setRemaining(res.item.expiresInSeconds);
    } catch {
      setRemaining(0);
    } finally {
      setExtending(false);
    }
  };

  const restart = () => {
    setStep('email');
    setCode('');
    setError('');
    setInfo('');
    setSession(null);
    setRemaining(0);
  };

  const profile = session?.profile;
  const events: MyEvent[] = session?.events ?? [];
  const lowRemaining = remaining > 0 && remaining <= 60;

  return (
    <main className="mp-main saf-myevents">
      <section
        className="mp-hero"
        style={{ backgroundImage: `url(${assetSrc(HeroImage)})` }}
      >
        <div className="mp-hero-content">
          <nav className="mp-breadcrumb" aria-label="Breadcrumb">
            <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
            <span className="mp-breadcrumb-dot" aria-hidden="true" />
            <span className="mp-breadcrumb-current">My Events</span>
          </nav>
          <h1 className="mp-hero-title">My Events</h1>
        </div>
      </section>

      <div className="mp-body">
        <div className="saf-renewal-shell">
          {step === 'email' && (
            <form className="saf-myevents-panel" onSubmit={requestCode}>
              <h2 className="saf-myevents-title">Find your registered events</h2>
              <p className="saf-myevents-desc">
                Enter the email address you used when registering. We&apos;ll send you a
                verification code to confirm it&apos;s you.
              </p>
              <label className="saf-myevents-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </label>
              {error && <p className="saf-myevents-error">{error}</p>}
              <button type="submit" className="saf-myevents-submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send verification code'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form className="saf-myevents-panel" onSubmit={verifyCode}>
              <h2 className="saf-myevents-title">Enter verification code</h2>
              {info && <p className="saf-myevents-info">{info}</p>}
              <label className="saf-myevents-field">
                <span>6-digit code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  placeholder="000000"
                  className="saf-myevents-code-input"
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={loading}
                  autoFocus
                />
              </label>
              {error && <p className="saf-myevents-error">{error}</p>}
              <button type="submit" className="saf-myevents-submit" disabled={loading}>
                {loading ? 'Verifying…' : 'View my events'}
              </button>
              <div className="saf-myevents-links">
                <button type="button" onClick={() => requestCode()} disabled={loading}>
                  Resend code
                </button>
                <span aria-hidden="true">·</span>
                <button type="button" onClick={restart} disabled={loading}>
                  Use a different email
                </button>
              </div>
            </form>
          )}

          {step === 'events' && (
            <div className="saf-myevents-result">
              {/* 세션 바: 남은 시간 + 연장 */}
              <div className={`saf-myevents-sessionbar${lowRemaining ? ' is-low' : ''}`}>
                <div className="saf-myevents-timer">
                  <span className="saf-myevents-timer-dot" aria-hidden="true" />
                  <span>
                    Session expires in <strong>{fmtCountdown(remaining)}</strong>
                  </span>
                </div>
                <div className="saf-myevents-sessionbar-actions">
                  <button type="button" className="saf-myevents-extend" onClick={extendSession} disabled={extending}>
                    {extending ? 'Extending…' : 'Extend session'}
                  </button>
                  <button type="button" className="saf-myevents-signout" onClick={restart}>
                    Sign out
                  </button>
                </div>
              </div>

              {/* 내 정보 */}
              <section className="saf-myevents-profile">
                <div className="saf-myevents-profile-head">
                  <div>
                    <h2 className="saf-myevents-profile-name">{profile?.fullName || '—'}</h2>
                    <p className="saf-myevents-profile-sub">{session?.email}</p>
                  </div>
                </div>
                <dl className="saf-myevents-profile-grid">
                  {profile?.organizationName && (
                    <div><dt>Organization</dt><dd>{profile.organizationName}</dd></div>
                  )}
                  {profile?.position && <div><dt>Position</dt><dd>{profile.position}</dd></div>}
                  {profile?.country && <div><dt>Country</dt><dd>{profile.country}</dd></div>}
                  {profile?.nationality && <div><dt>Nationality</dt><dd>{profile.nationality}</dd></div>}
                  {profile?.phone && <div><dt>Phone</dt><dd>{profile.phone}</dd></div>}
                  <div>
                    <dt>Registered events</dt>
                    <dd>{profile?.totalEventCount ?? events.length}</dd>
                  </div>
                </dl>
              </section>

              {/* 내 행사 */}
              <div className="saf-myevents-events-head">
                <h2 className="saf-myevents-title">Registered events</h2>
              </div>

              {events.length === 0 ? (
                <div className="saf-myevents-empty">
                  <p>No event registrations were found for this email.</p>
                </div>
              ) : (
                <ul className="saf-myevents-list">
                  {events.map((ev) => (
                    <li className="saf-myevents-card" key={ev.eventParticipantSeq}>
                      <div className="saf-myevents-card-top">
                        {ev.eventType && (
                          <span className="saf-myevents-type">
                            {ev.eventType === 'side' ? 'Side event' : 'Official'}
                          </span>
                        )}
                        {ev.participationStatus && (
                          <span className={`saf-myevents-status ${statusTone(ev.participationStatus)}`}>
                            {titleCase(ev.participationStatus)}
                          </span>
                        )}
                      </div>
                      <h3 className="saf-myevents-event-title">{ev.eventTitle}</h3>
                      <dl className="saf-myevents-meta">
                        {fmtDateRange(ev.eventStartDt, ev.eventEndDt) && (
                          <div>
                            <dt>Date</dt>
                            <dd>
                              {fmtDateRange(ev.eventStartDt, ev.eventEndDt)}
                              {fmtTime(ev.eventStartDt) && <span> · {fmtTime(ev.eventStartDt)}</span>}
                            </dd>
                          </div>
                        )}
                        {ev.location && (
                          <div><dt>Venue</dt><dd>{ev.location}</dd></div>
                        )}
                        {ev.participantTypeName && (
                          <div><dt>Type</dt><dd>{ev.participantTypeName}</dd></div>
                        )}
                        {ev.paymentStatus && (
                          <div>
                            <dt>Payment</dt>
                            <dd>
                              {titleCase(ev.paymentStatus)}
                              {ev.paymentStatus.toLowerCase() === 'paid' && ev.paymentAmount != null && (
                                <span>
                                  {' · '}
                                  {ev.paymentCurrency ? `${ev.paymentCurrency} ` : ''}
                                  {Number(ev.paymentAmount).toLocaleString()}
                                </span>
                              )}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
