'use client';

import React, { useEffect, useState } from 'react';
import { callGetPublicPageList } from '@api/page/PageApi';
import { PageListItem } from '@interface/page/PageManagement';
import LogoImage from '../assets/images/logo.png';

export default function HomePage() {
  const [pages, setPages] = useState<PageListItem[]>([]);

  useEffect(() => {
    callGetPublicPageList().then((res) => {
      if (res?.item) setPages(res.item.filter((p) => p.useYn === 'Y'));
    }).catch(() => {});
  }, []);

  const logoSrc = typeof LogoImage === 'string' ? LogoImage : (LogoImage as { src?: string })?.src ?? '';

  const handleNavigate = (url: string) => {
    window.history.pushState(null, '', url);
    window.location.href = url;
  };

  return (
    <div className="pub-layout">
      <header className="pub-header">
        <div className="pub-header-inner">
          <a className="pub-logo" href="/">
            {logoSrc && <img src={logoSrc} alt="KCAB" />}
            <span>KCAB INTERNATIONAL</span>
          </a>

          <nav className="pub-nav">
            {pages.map((page) => (
              <a
                key={page.pageSeq}
                href={page.pageUrl}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(page.pageUrl);
                }}
              >
                {page.pageNm}
              </a>
            ))}
          </nav>

          <div className="pub-header-actions">
            <a className="pub-btn-admin" href="/login">Admin</a>
          </div>

          <button className="pub-menu-toggle" aria-label="Menu">
            <span /><span /><span />
          </button>
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

      {pages.length > 0 && (
        <section className="pub-section section-card-list">
          <div className="pub-section-inner">
            <h3 className="card-list-title">Pages</h3>
            <div className={`card-grid cols-${Math.min(pages.length, 3)}`}>
              {pages.map((page) => (
                <div key={page.pageSeq} className="card-item">
                  <a
                    href={page.pageUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(page.pageUrl);
                    }}
                  >
                    <div className="card-body">
                      <h4 className="card-title">{page.pageNm}</h4>
                      <p className="card-desc">{page.pageTitle || ''}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {pages.length === 0 && (
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
      )}

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
