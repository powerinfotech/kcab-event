'use client';

import React, { useEffect, useState } from 'react';
import LogoImage from '../assets/images/logo.png';
import { callGetPublicPopupList } from '@api/popup/PopupApi';
import { PopupItem } from '@interface/popup/PopupManagement';
import MainPopupOverlay from '@component/popup/MainPopupOverlay';

const POPUP_DISMISS_COOKIE_PREFIX = 'popup_dismissed_';

function isPopupDismissedToday(popupSeq: number): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((entry) => {
    const trimmed = entry.trim();
    return trimmed.startsWith(`${POPUP_DISMISS_COOKIE_PREFIX}${popupSeq}=`);
  });
}

function dismissPopupForToday(popupSeq: number): void {
  if (typeof document === 'undefined') return;
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  document.cookie = `${POPUP_DISMISS_COOKIE_PREFIX}${popupSeq}=Y; expires=${endOfDay.toUTCString()}; path=/`;
}

export default function HomePage() {
  const logoSrc = typeof LogoImage === 'string' ? LogoImage : (LogoImage as { src?: string })?.src ?? '';
  const [popups, setPopups] = useState<PopupItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await callGetPublicPopupList();
        if (cancelled) return;
        const list = (res?.item ?? []).filter((popup) => {
          if (!popup.popupSeq) return true;
          return !isPopupDismissedToday(popup.popupSeq);
        });
        setPopups(list);
      } catch {
        // Silent: popup is non-critical content.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePopupClose = (popup: PopupItem) => {
    setPopups((prev) => prev.filter((item) => item.popupSeq !== popup.popupSeq));
  };

  const handlePopupDismissToday = (popup: PopupItem) => {
    if (popup.popupSeq) {
      dismissPopupForToday(popup.popupSeq);
    }
    handlePopupClose(popup);
  };

  const handleNavigate = (url: string) => {
    window.history.pushState(null, '', url);
    window.location.href = url;
  };

  return (
    <div className="pub-layout">
      <header className="pub-header">
        <div className="pub-header-inner">
          <a className="pub-logo" href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }}>
            {logoSrc && <img src={logoSrc} alt="KCAB" />}
            <span>KCAB INTERNATIONAL</span>
          </a>

          <div className="pub-header-actions">
            <a className="pub-btn-admin" href="/login">Admin</a>
          </div>
        </div>
      </header>

      <section className="pub-section section-hero size-large" style={{
        background: 'linear-gradient(135deg, #0f1b3d 0%, #1a2f5e 40%, #294DC7 100%)',
      }}>
        <div className="hero-content">
          <h2 className="hero-title">KCAB INTERNATIONAL EVENT</h2>
          <p className="hero-subtitle">Official guide to KCAB international arbitration events</p>
        </div>
      </section>

      <section className="pub-section section-card-list">
        <div className="pub-section-inner">
          <div className="card-grid cols-3">
            <div className="card-item">
              <div className="card-body">
                <h4 className="card-title">Event Guide</h4>
                <p className="card-desc">Check schedules and details for upcoming international arbitration events.</p>
              </div>
            </div>
            <div className="card-item">
              <div className="card-body">
                <h4 className="card-title">Registration</h4>
                <p className="card-desc">Apply online to join event programs.</p>
              </div>
            </div>
            <div className="card-item">
              <div className="card-body">
                <h4 className="card-title">Notices</h4>
                <p className="card-desc">View the latest notices and event updates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MainPopupOverlay
        popups={popups}
        onClose={handlePopupClose}
        onDismissToday={handlePopupDismissToday}
      />

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div>
            <div className="pub-footer-logo">KCAB INTERNATIONAL</div>
            <div className="pub-footer-info">
              Korean Commercial Arbitration Board<br />
              606 Teheran-ro, Gangnam-gu, Seoul, Korea
            </div>
            <div className="pub-footer-copyright">
              &copy; {new Date().getFullYear()} KCAB INTERNATIONAL. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
