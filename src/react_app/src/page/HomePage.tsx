'use client';

import React, { useEffect, useState } from 'react';
import { callGetPublicPopupList } from '@api/popup/PopupApi';
import { PopupItem } from '@interface/popup/PopupManagement';
import MainPopupOverlay from '@component/popup/MainPopupOverlay';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul.jpg';

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

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'A') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M12 4 4 20h3l1.5-3h7L17 20h3L12 4Zm-2 10 2-4 2 4h-4Z" fill="currentColor" />
      </svg>
    );
  }
  if (icon === 'in') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M6.94 7.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88Zm-1.7 1.7h3.4V20h-3.4V9.2Zm6.07 0h3.26v1.5h.04a3.57 3.57 0 0 1 3.21-1.76c3.44 0 4.07 2.26 4.07 5.2V20H18.5v-4.85c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.27-1.87 2.57V20h-3.39V9.2Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.24 5 12 5 12 5s-6.24 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.76 19 12 19 12 19s6.24 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" fill="currentColor" />
    </svg>
  );
}

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Partners', href: '#partners' },
  { label: 'Official Events', href: '/events' },
  { label: 'Calendar', href: '#program' },
  { label: 'Visit Seoul', href: '#visit' },
  { label: 'Archives', href: '#archives' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'Artstation', href: '#', icon: 'A' },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'YouTube', href: '#', icon: 'YT' },
];

export default function HomePage() {
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

  return (
    <div className="saf-renewal-home">
      <header className="saf-renewal-header">
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a className="saf-renewal-brand" href="/" aria-label="Seoul ADR Festival home">
            <FestivalLogo />
          </a>
          <div className="saf-renewal-header-right">
            <div className="saf-renewal-social">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} aria-label={item.label}>
                  <SocialIcon icon={item.icon} />
                </a>
              ))}
            </div>
            <nav className="saf-renewal-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <a key={item.label} href={item.href}>{item.label}</a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section
          className="saf-renewal-sunset-hero"
          style={{ backgroundImage: `url(${assetSrc(HeroSeoulImage)})` }}
        >
          <div className="saf-renewal-sunset-hero-overlay" aria-hidden="true" />
          <div className="saf-renewal-sunset-hero-inner">
            <div className="saf-renewal-sunset-hero-content">
              <p className="saf-renewal-sunset-eyebrow">26 — 30 October 2026 · Seoul</p>
              <h1 className="saf-renewal-sunset-title">
                Unveiling
                <br />
                Excellence
                <br />
                <span>in Arbitration.</span>
              </h1>
              <div className="saf-renewal-sunset-meta">
                <div className="saf-renewal-sunset-pager" aria-hidden="true">
                  <span className="saf-renewal-sunset-pager-arrow">←</span>
                  <span className="saf-renewal-sunset-pager-num">01</span>
                  <span className="saf-renewal-sunset-pager-sep">/</span>
                  <span className="saf-renewal-sunset-pager-num">03</span>
                  <span className="saf-renewal-sunset-pager-arrow">→</span>
                </div>
                <p className="saf-renewal-sunset-copy">
                  The Seoul ADR Festival brings together leading arbitrators, practitioners,
                  and industry experts from across the Asia-Pacific region for five days of
                  dialogue, collaboration, and discovery.
                </p>
              </div>
              <a className="saf-renewal-sunset-cta" href="#program">
                Explore Program
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <MainPopupOverlay
        popups={popups}
        onClose={handlePopupClose}
        onDismissToday={handlePopupDismissToday}
      />
    </div>
  );
}

function FestivalLogo() {
  return (
    <span className="saf-renewal-logo" aria-hidden="true">
      <svg viewBox="0 0 110 60" focusable="false">
        <path d="M5 20 L55 6 L105 20" />
        <path d="M9 22 L101 22" />
        <path d="M14 22 L14 24 L18 24 L18 22 M24 22 L24 24 L28 24 L28 22 M34 22 L34 24 L38 24 L38 22 M44 22 L44 24 L48 24 L48 22 M54 22 L54 24 L58 24 L58 22 M64 22 L64 24 L68 24 L68 22 M74 22 L74 24 L78 24 L78 22 M84 22 L84 24 L88 24 L88 22 M94 22 L94 24 L98 24 L98 22" />
        <path d="M12 26 L98 26 L98 44 L12 44 Z" fill="none" />
        <path d="M22 26 L22 44 M32 26 L32 44 M42 26 L42 44 M52 26 L52 44 M62 26 L62 44 M72 26 L72 44 M82 26 L82 44 M92 26 L92 44" />
        <path d="M12 32 L98 32 M12 38 L98 38" />
        <path d="M8 44 L102 44 L102 48 L8 48 Z" fill="none" />
      </svg>
      <span className="saf-renewal-logo-title">SEOUL ADR FESTIVAL</span>
    </span>
  );
}
