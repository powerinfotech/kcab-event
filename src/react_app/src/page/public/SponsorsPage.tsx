'use client';

import React, { useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import SponsorsHeroImage from '../../assets/images/saf-renewal/sponsors-hero.jpg';
import SponsorsBlob from '../../assets/images/saf-renewal/sponsors-blob.png';
import SponsorAnalysisGroupLogo from '../../assets/images/saf-renewal/sponsors/analysis-group.png';
import SponsorBaeKimLeeLogo from '../../assets/images/saf-renewal/sponsors/bae-kim-lee.png';
import SponsorBakerMckenzieLogo from '../../assets/images/saf-renewal/sponsors/baker-mckenzie.png';
import SponsorDiacLogo from '../../assets/images/saf-renewal/sponsors/diac.png';
import SponsorHerbertSmithLogo from '../../assets/images/saf-renewal/sponsors/herbert-smith-freehills-kramer.png';
import SponsorHfwLogo from '../../assets/images/saf-renewal/sponsors/hfw.png';
import SponsorJipyongLogo from '../../assets/images/saf-renewal/sponsors/jipyong.png';
import SponsorJusMundiLogo from '../../assets/images/saf-renewal/sponsors/jus-mundi.png';
import SponsorKimChangLogo from '../../assets/images/saf-renewal/sponsors/kim-chang.png';
import SponsorLeeKoLogo from '../../assets/images/saf-renewal/sponsors/lee-ko.png';
import SponsorLitigLogo from '../../assets/images/saf-renewal/sponsors/litig.png';
import SponsorPeterKimLogo from '../../assets/images/saf-renewal/sponsors/peter-kim.png';
import SponsorQuinnEmanuelLogo from '../../assets/images/saf-renewal/sponsors/quinn-emanuel.png';
import SponsorSecretariatLogo from '../../assets/images/saf-renewal/sponsors/secretariat.png';
import SponsorSeoulMetropolitanLogo from '../../assets/images/saf-renewal/sponsors/seoul-metropolitan-government.png';
import SponsorShinKimLogo from '../../assets/images/saf-renewal/sponsors/shin-kim.png';
import SponsorSteptoeLogo from '../../assets/images/saf-renewal/sponsors/steptoe.png';
import SponsorStevensonWongLogo from '../../assets/images/saf-renewal/sponsors/stevenson-wong.png';
import SponsorVanguardLogo from '../../assets/images/saf-renewal/sponsors/vanguard.png';
import SponsorYendallHunterLogo from '../../assets/images/saf-renewal/sponsors/yendall-hunter.png';
import SponsorYoonYangLogo from '../../assets/images/saf-renewal/sponsors/yoon-yang.png';
import SponsorYulchonLogo from '../../assets/images/saf-renewal/sponsors/yulchon.png';
import BusinessFooterInfo from './components/BusinessFooterInfo';

/* HomePage.tsx 의 SocialIcon / FestivalLogo / navItems 와 1:1 동일하게 둔다. (PastEditions.tsx 와 동일한 패턴) */

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

/* Figma sub01_Sponsors 에 표기된 후원 등급만 노출한다. (Organizer / Supporters / Media Partners 는 별도 페이지) */
const sponsorGroups = [
  {
    title: 'Welcome Reception Sponsor',
    logos: [{ name: 'Jipyong', image: SponsorJipyongLogo }],
  },
  {
    title: 'Platinum Sponsors',
    logos: [
      { name: 'Bae, Kim & Lee', image: SponsorBaeKimLeeLogo },
      { name: 'Kim & Chang', image: SponsorKimChangLogo },
      { name: 'LITIG', image: SponsorLitigLogo },
      { name: 'Peter & Kim', image: SponsorPeterKimLogo },
    ],
  },
  {
    title: 'Gold Sponsor',
    logos: [
      { name: 'Analysis Group', image: SponsorAnalysisGroupLogo },
      { name: 'Baker McKenzie', image: SponsorBakerMckenzieLogo },
      { name: 'DIAC', image: SponsorDiacLogo },
      { name: 'HFW', image: SponsorHfwLogo },
      { name: 'Lee & Ko', image: SponsorLeeKoLogo },
      { name: 'Quinn Emanuel', image: SponsorQuinnEmanuelLogo },
      { name: 'Shin & Kim', image: SponsorShinKimLogo },
      { name: 'Yendall Hunter', image: SponsorYendallHunterLogo },
      { name: 'Yoon & Yang', image: SponsorYoonYangLogo },
      { name: 'Yulchon', image: SponsorYulchonLogo },
    ],
  },
  {
    title: 'Silver Sponsors',
    logos: [
      { name: 'Herbert Smith Freehills Kramer', image: SponsorHerbertSmithLogo },
      { name: 'Secretariat', image: SponsorSecretariatLogo },
      { name: 'Steptoe', image: SponsorSteptoeLogo },
      { name: 'Stevenson Wong & Co.', image: SponsorStevensonWongLogo },
      { name: 'Jus Mundi', image: SponsorJusMundiLogo },
      { name: 'Vanguard', image: SponsorVanguardLogo },
    ],
  },
  {
    title: 'Special Sponsor',
    logos: [{ name: 'Seoul Metropolitan Government', image: SponsorSeoulMetropolitanLogo }],
  },
];

export default function SponsorsPage() {
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
    <div className="saf-renewal-home saf-sponsors-page">
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
          style={{ backgroundImage: `url(${assetSrc(SponsorsHeroImage)})` }}
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
              <span className="is-current">Sponsors</span>
            </nav>
            <h1 className="saf-sub-hero-title">Sponsors</h1>
          </div>
        </section>

        <section className="saf-renewal-sponsors saf-sponsors-list">
          <img className="saf-sponsors-blob" src={assetSrc(SponsorsBlob)} alt="" aria-hidden="true" />
          <div className="saf-renewal-shell">
            <div className="saf-sponsors-intro">
              <h2>Sponsors</h2>
              <p>
                We are delighted to recognize and collaborate with our esteemed sponsors for the
                Seoul ADR Festival 2025.
                <br />
                Click on each sponsor logo to explore more about their work and contributions.
                <br />
                Our deepest appreciation goes to all sponsors and partners whose generous support
                makes SAF 2025 possible.
              </p>
            </div>
            {sponsorGroups.map((group) => (
              <div className="saf-renewal-sponsor-row" key={group.title}>
                <div className="saf-renewal-sponsor-title">
                  <span>{group.title}</span>
                </div>
                <div className="saf-renewal-logo-grid">
                  {group.logos.map((logo) => (
                    <figure className="saf-renewal-sponsor-logo" key={logo.name}>
                      <img src={assetSrc(logo.image)} alt={logo.name} loading="lazy" />
                    </figure>
                  ))}
                </div>
              </div>
            ))}
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
