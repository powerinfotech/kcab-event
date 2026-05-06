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
      {/* Header */}
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
            <a className="pub-btn-admin" href="/login">관리자</a>
          </div>

          <button className="pub-menu-toggle" aria-label="메뉴">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pub-section section-hero size-large" style={{
        background: 'linear-gradient(135deg, #0f1b3d 0%, #1a2f5e 40%, #294DC7 100%)',
      }}>
        <div className="hero-content">
          <h2 className="hero-title">KCAB INTERNATIONAL EVENT</h2>
          <p className="hero-subtitle">대한상사중재원 국제중재 행사 안내</p>
        </div>
      </section>

      {/* Cards */}
      {pages.length > 0 && (
        <section className="pub-section section-card-list">
          <div className="pub-section-inner">
            <h3 className="card-list-title">페이지</h3>
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

      {/* Default cards when no CMS pages exist yet */}
      {pages.length === 0 && (
        <section className="pub-section section-card-list">
          <div className="pub-section-inner">
            <div className="card-grid cols-3">
              <div className="card-item">
                <div className="card-body">
                  <h4 className="card-title">행사 안내</h4>
                  <p className="card-desc">예정된 국제중재 행사 일정과 상세 정보를 확인하세요.</p>
                </div>
              </div>
              <div className="card-item">
                <div className="card-body">
                  <h4 className="card-title">참가 신청</h4>
                  <p className="card-desc">행사 참가를 원하시면 온라인으로 신청하실 수 있습니다.</p>
                </div>
              </div>
              <div className="card-item">
                <div className="card-body">
                  <h4 className="card-title">공지사항</h4>
                  <p className="card-desc">최신 공지사항과 행사 관련 소식을 확인하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div>
            <div className="pub-footer-logo">KCAB INTERNATIONAL</div>
            <div className="pub-footer-info">
              대한상사중재원<br />
              서울특별시 강남구 테헤란로 606
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
