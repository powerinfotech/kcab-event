'use client';

import React, { useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import SupportersHeroImage from '../../assets/images/saf-renewal/supporters-hero.jpg';
import SupportersBlob from '../../assets/images/saf-renewal/supporters-blob.png';
import SupporterAdgmLogo from '../../assets/images/saf-renewal/supporters/adgm.png';
import SupporterIcdrAaaLogo from '../../assets/images/saf-renewal/supporters/icdr-aaa-asia.png';
import SupporterArbitrateAdLogo from '../../assets/images/saf-renewal/supporters/arbitrate-ad.png';
import SupporterApcamLogo from '../../assets/images/saf-renewal/supporters/apcam.png';
import SupporterAiacLogo from '../../assets/images/saf-renewal/supporters/aiac.png';
import SupporterAcicaLogo from '../../assets/images/saf-renewal/supporters/acica.png';
import SupporterCiamCiarLogo from '../../assets/images/saf-renewal/supporters/ciam-ciar.png';
import SupporterDiacLogo from '../../assets/images/saf-renewal/supporters/diac.png';
import SupporterIbramLogo from '../../assets/images/saf-renewal/supporters/ibram.png';
import SupporterDisLogo from '../../assets/images/saf-renewal/supporters/dis.png';
import SupporterHkiacLogo from '../../assets/images/saf-renewal/supporters/hkiac.png';
import SupporterIhcfLogo from '../../assets/images/saf-renewal/supporters/ihcf.png';
import SupporterIcsidLogo from '../../assets/images/saf-renewal/supporters/icsid.png';
import SupporterIdraLogo from '../../assets/images/saf-renewal/supporters/idra.png';
import SupporterKicaLogo from '../../assets/images/saf-renewal/supporters/kica.png';
import SupporterKitlaLogo from '../../assets/images/saf-renewal/supporters/kitla.png';
import SupporterMilanCamLogo from '../../assets/images/saf-renewal/supporters/milan-cam.png';
import SupporterNyiacLogo from '../../assets/images/saf-renewal/supporters/nyiac.png';
import SupporterOmanOacLogo from '../../assets/images/saf-renewal/supporters/oman-oac.png';
import SupporterPcaLogo from '../../assets/images/saf-renewal/supporters/pca.png';
import SupporterShacLogo from '../../assets/images/saf-renewal/supporters/shac.png';
import SupporterShiacLogo from '../../assets/images/saf-renewal/supporters/shiac.png';
import SupporterSiacLogo from '../../assets/images/saf-renewal/supporters/siac.png';
import SupporterSimcLogo from '../../assets/images/saf-renewal/supporters/simc.png';
import SupporterSwissLogo from '../../assets/images/saf-renewal/supporters/swiss-arbitration-centre.png';
import SupporterTiacLogo from '../../assets/images/saf-renewal/supporters/tiac.png';
import SupporterFaiLogo from '../../assets/images/saf-renewal/supporters/fai.png';
import SupporterCrcicaLogo from '../../assets/images/saf-renewal/supporters/crcica.png';
import SupporterJcaaLogo from '../../assets/images/saf-renewal/supporters/jcaa.png';
import SupporterMciaLogo from '../../assets/images/saf-renewal/supporters/mcia.png';
import SupporterTurkishBlogLogo from '../../assets/images/saf-renewal/supporters/turkish-arbitration-blog.png';
import SupporterViacViennaLogo from '../../assets/images/saf-renewal/supporters/viac-vienna.png';
import SupporterViacVietnamLogo from '../../assets/images/saf-renewal/supporters/viac-vietnam.png';
import BusinessFooterInfo from './components/BusinessFooterInfo';

/* HomePage.tsx 의 SocialIcon / FestivalLogo / navItems 와 1:1 동일하게 둔다. (SponsorsPage.tsx 와 동일한 패턴) */

const assetSrc = (asset: string | { src?: string }) =>
  typeof asset === 'string' ? asset : asset.src ?? '';

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
  {
    label: 'Partners',
    href: '#partners',
    children: [
      { label: 'Organizer', href: '/#partners' },
      { label: 'Sponsors', href: '/sponsors-2025' },
      { label: 'Supporters', href: '/supporters' },
      { label: 'Media Partners', href: '/#partners', featured: true },
    ],
  },
  {
    label: 'Official Events',
    href: '/events',
    children: [
      { label: 'Register', href: '/event/asia-civil-law-summit-demo/register' },
    ],
  },
  { label: 'Calendar', href: '/#program' },
  { label: 'Visit Seoul', href: '/#visit' },
  { label: 'Archives', href: '/past-editions' },
  { label: 'Contact', href: '/#contact' },
];

const socialLinks = [
  { label: 'Artstation', href: '#', icon: 'A' },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'YouTube', href: '#', icon: 'YT' },
];

/* Figma sub01_Supporters 의 "Supporting Organizations" 로고 그리드(11행 x 3열). 좌→우, 상→하 순서 그대로. */
const supporterLogos = [
  { name: 'ADGM Arbitration Centre', image: SupporterAdgmLogo },
  { name: 'ICDR–AAA Asia Case Management Centre', image: SupporterIcdrAaaLogo },
  { name: 'arbitrateAD', image: SupporterArbitrateAdLogo },
  { name: 'APCAM', image: SupporterApcamLogo },
  { name: 'AIAC', image: SupporterAiacLogo },
  { name: 'ACICA', image: SupporterAcicaLogo },
  { name: 'CIAM–CIAR', image: SupporterCiamCiarLogo },
  { name: 'DIAC', image: SupporterDiacLogo },
  { name: 'IBRAM', image: SupporterIbramLogo },
  { name: 'DIS – German Arbitration Institute', image: SupporterDisLogo },
  { name: 'HKIAC', image: SupporterHkiacLogo },
  { name: 'In-House Counsel Forum (IHCF)', image: SupporterIhcfLogo },
  { name: 'ICSID', image: SupporterIcsidLogo },
  { name: 'IDRA', image: SupporterIdraLogo },
  { name: 'KICA', image: SupporterKicaLogo },
  { name: 'KITLA', image: SupporterKitlaLogo },
  { name: 'Milan Chamber of Arbitration', image: SupporterMilanCamLogo },
  { name: 'NYIAC', image: SupporterNyiacLogo },
  { name: 'Oman Commercial Arbitration Centre', image: SupporterOmanOacLogo },
  { name: 'Permanent Court of Arbitration', image: SupporterPcaLogo },
  { name: 'Shanghai Arbitration Commission', image: SupporterShacLogo },
  { name: 'SHIAC', image: SupporterShiacLogo },
  { name: 'Singapore International Arbitration Centre', image: SupporterSiacLogo },
  { name: 'Singapore International Mediation Centre', image: SupporterSimcLogo },
  { name: 'Swiss Arbitration Centre', image: SupporterSwissLogo },
  { name: 'TIAC', image: SupporterTiacLogo },
  { name: 'Finland Arbitration Institute', image: SupporterFaiLogo },
  { name: 'CRCICA', image: SupporterCrcicaLogo },
  { name: 'JCAA', image: SupporterJcaaLogo },
  { name: 'MCIA', image: SupporterMciaLogo },
  { name: 'Turkish Arbitration Blog', image: SupporterTurkishBlogLogo },
  { name: 'Vienna International Arbitral Centre (VIAC)', image: SupporterViacViennaLogo },
  { name: 'Vietnam International Arbitration Centre (VIAC)', image: SupporterViacVietnamLogo },
];

export default function SupportersPage() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const setCurrentPath = useSetAtom(currentPathAtom);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    if (href.startsWith('/') && !href.includes('#')) {
      e.preventDefault();
      pushPath(href, setCurrentPath);
    }
  };

  const handleHeaderBlur = (event: React.FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (!nextTarget || !event.currentTarget.contains(nextTarget as Node)) {
      setActiveMenu(null);
    }
  };

  return (
    <div className="saf-renewal-home saf-sponsors-page saf-supporters-page">
      <header
        className={`saf-renewal-header${activeMenu ? ' is-menu-open' : ''}${mobileMenuOpen ? ' is-mobile-menu-open is-menu-open' : ''}`}
        onMouseLeave={() => setActiveMenu(null)}
        onBlur={handleHeaderBlur}
      >
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a
            className="saf-renewal-brand"
            href="/"
            aria-label="Seoul ADR Festival home"
            onClick={(e) => handleNavClick(e, '/')}
          >
            <FestivalLogo />
            <span className="saf-renewal-brand-wordmark">
              Seoul
              <br />
              ADR
              <br />
              Festival
            </span>
          </a>
          <button
            className="saf-renewal-menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className="saf-renewal-nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isActive = activeMenu === item.label;
              return (
                <div
                  className={`saf-renewal-nav-item${isActive ? ' is-active' : ''}${hasChildren ? ' has-submenu' : ''}`}
                  key={item.label}
                  onMouseEnter={() => setActiveMenu(hasChildren ? item.label : null)}
                  onFocus={() => {
                    if (hasChildren) setActiveMenu(item.label);
                  }}
                >
                  <a
                    href={item.href}
                    aria-haspopup={hasChildren ? 'true' : undefined}
                    aria-expanded={hasChildren ? isActive || mobileMenuOpen : undefined}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                  {hasChildren && (
                    <div className="saf-renewal-menu-panel" role="menu">
                      {item.children?.map((child) => (
                        <a
                          className={child.featured ? 'is-featured' : undefined}
                          href={child.href}
                          key={child.label}
                          role="menuitem"
                          onClick={(e) => handleNavClick(e, child.href)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="saf-renewal-social" aria-label="Social links">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label}>
                <SocialIcon icon={item.icon} />
              </a>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section
          className="saf-sub-hero"
          style={{ backgroundImage: `url(${assetSrc(SupportersHeroImage)})` }}
        >
          <div className="saf-sub-hero-overlay" aria-hidden="true" />
          <div className="saf-renewal-shell saf-sub-hero-inner">
            <nav className="saf-sub-breadcrumb" aria-label="Breadcrumb">
              <a
                className="saf-sub-breadcrumb-home"
                href="/"
                onClick={(e) => handleNavClick(e, '/')}
                aria-label="Home"
              >
                <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                  <path
                    d="M8 1.5 1.5 6.7V14a.6.6 0 0 0 .6.6h3.5V10a.6.6 0 0 1 .6-.6h3.6a.6.6 0 0 1 .6.6v4.6h3.5a.6.6 0 0 0 .6-.6V6.7L8 1.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <span className="saf-sub-breadcrumb-sep" aria-hidden="true" />
              <a href="/#partners" onClick={(e) => handleNavClick(e, '/#partners')}>
                Partners
              </a>
              <span className="saf-sub-breadcrumb-sep" aria-hidden="true" />
              <span className="is-current">Supporters</span>
            </nav>
            <h1 className="saf-sub-hero-title">Supporters</h1>
          </div>
        </section>

        <section className="saf-renewal-sponsors saf-sponsors-list">
          <img className="saf-sponsors-blob" src={assetSrc(SupportersBlob)} alt="" aria-hidden="true" />
          <div className="saf-renewal-shell">
            <div className="saf-sponsors-intro">
              <h2>Supporters</h2>
              <p>
                The Seoul ADR Festival 2025 is proud to be supported by leading arbitration
                institutions from around the world. Their collaboration and promotion play a vital
                role in making this global gathering a success.
                <br />
                Please click on each logo to learn more about our valued supporters.
              </p>
            </div>
            <div className="saf-renewal-sponsor-row">
              <div className="saf-renewal-sponsor-title">
                <span>Supporting Organizations</span>
              </div>
              <div className="saf-renewal-logo-grid">
                {supporterLogos.map((logo) => (
                  <figure className="saf-renewal-sponsor-logo" key={logo.name}>
                    <img src={assetSrc(logo.image)} alt={logo.name} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="saf-renewal-footer">
        <div className="saf-renewal-shell">
          <div className="saf-renewal-footer-top">
            <div className="saf-renewal-footer-brand">
              <FestivalLogo />
              <strong>
                Seoul
                <br />
                ADR
                <br />
                Festival
              </strong>
            </div>
            <a
              className="saf-renewal-footer-privacy"
              href="#privacy"
              onClick={(e) => handleNavClick(e, '#privacy')}
            >
              Privacy
            </a>
          </div>
          <p>
            Seoul ADR Festival (SAF) is organized by KCAB International.
            <br />
            Office Trade Tower, 511 Yeongdong-daero, Gangnam-gu, Seoul
            <br />
            Contact: saf@kcab.or.kr
          </p>
          <BusinessFooterInfo />
          <small>© 2026 KCAB International. All rights reserved.</small>
          <div className="saf-renewal-footer-social" aria-label="Social links">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label}>
                <SocialIcon icon={item.icon} />
              </a>
            ))}
          </div>
        </div>
      </footer>
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
