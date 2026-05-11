'use client';

import React from 'react';
import LogoImage from '../assets/images/logo.png';

export default function HomePage() {
  const logoSrc = typeof LogoImage === 'string' ? LogoImage : (LogoImage as { src?: string })?.src ?? '';

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
