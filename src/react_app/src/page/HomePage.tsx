'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="homepage-header-inner">
          <h1 className="homepage-logo">KCAB INTERNATIONAL</h1>
          <a href="/login" className="homepage-admin-link">
            관리자
          </a>
        </div>
      </header>

      <section className="homepage-hero">
        <div className="homepage-hero-inner">
          <h2 className="homepage-hero-title">KCAB INTERNATIONAL EVENT</h2>
          <p className="homepage-hero-desc">
            대한상사중재원 국제중재 행사 안내
          </p>
        </div>
      </section>

      <section className="homepage-content">
        <div className="homepage-content-inner">
          <div className="homepage-card-grid">
            <div className="homepage-card">
              <h3 className="homepage-card-title">행사 안내</h3>
              <p className="homepage-card-desc">
                예정된 국제중재 행사 일정과 상세 정보를 확인하세요.
              </p>
            </div>
            <div className="homepage-card">
              <h3 className="homepage-card-title">참가 신청</h3>
              <p className="homepage-card-desc">
                행사 참가를 원하시면 온라인으로 신청하실 수 있습니다.
              </p>
            </div>
            <div className="homepage-card">
              <h3 className="homepage-card-title">공지사항</h3>
              <p className="homepage-card-desc">
                최신 공지사항과 행사 관련 소식을 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="homepage-footer">
        <p>&copy; KCAB INTERNATIONAL. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
