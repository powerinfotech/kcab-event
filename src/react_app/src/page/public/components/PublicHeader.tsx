import React, { useState, useEffect } from 'react';
import { PageListItem } from '@interface/page/PageManagement';
import LogoImage from '../../../assets/images/logo.png';

interface Props {
  pages: PageListItem[];
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const PublicHeader: React.FC<Props> = ({ pages, currentUrl, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activePages = pages.filter((p) => p.useYn === 'Y');
  const logoSrc = typeof LogoImage === 'string' ? LogoImage : (LogoImage as { src?: string })?.src ?? '';

  return (
    <>
      <header className={`pub-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="pub-header-inner">
          <a className="pub-logo" href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>
            {logoSrc && <img src={logoSrc} alt="KCAB" />}
            <span>KCAB INTERNATIONAL</span>
          </a>

          <nav className="pub-nav">
            {activePages.map((page) => (
              <a
                key={page.pageSeq}
                href={page.pageUrl}
                className={currentUrl === page.pageUrl ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(page.pageUrl);
                }}
              >
                {page.pageNm}
              </a>
            ))}
          </nav>

          <div className="pub-header-actions">
            <a className="pub-btn-admin" href="/login">관리자</a>
          </div>

          <button
            className="pub-menu-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`pub-mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {activePages.map((page) => (
          <a
            key={page.pageSeq}
            href={page.pageUrl}
            className={currentUrl === page.pageUrl ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              onNavigate(page.pageUrl);
            }}
          >
            {page.pageNm}
          </a>
        ))}
        <a href="/login">관리자</a>
      </div>
    </>
  );
};

export default PublicHeader;
