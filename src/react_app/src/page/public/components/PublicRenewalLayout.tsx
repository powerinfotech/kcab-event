'use client';

import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { usePublicNavigate } from '@hook/usePublicNavigate';
import { usePublishedOfficialEvents, DEFAULT_OFFICIAL_EVENT_PATH } from '@hook/useCurrentOfficialEventPath';
import { currentPathAtom } from '@atom/currentPathAtom';
import SafLogo from '../../../assets/images/saf-renewal/header/logo.svg';
import Social1 from '../../../assets/images/saf-renewal/header/social-1.svg';
import Social2 from '../../../assets/images/saf-renewal/header/social-2.svg';
import Social3 from '../../../assets/images/saf-renewal/header/social-3.svg';

type NavItem = {
  label: string;
  href: string;
  featured?: boolean;
  children?: NavItem[];
};

const createNavItems = (officialEventPath: string, officialEventChildren: NavItem[]): NavItem[] => [
  { label: 'Home', href: '/' },
  {
    label: 'Partners',
    href: '/organizer',
    children: [
      { label: 'Organizer', href: '/organizer' },
      { label: 'Sponsors', href: '/sponsors-2025' },
      { label: 'Supporters', href: '/supporters' },
      { label: 'Media Partners', href: '/media-partners' },
    ],
  },
  {
    label: 'Official Events',
    href: officialEventPath,
    // events 테이블 status='published' 행의 slug 로 동적 구성 (정적 Events/Register 대체).
    // 목록이 비면 hasChildren 가드로 드롭다운 없이 일반 링크로 동작한다.
    children: officialEventChildren,
  },
  { label: 'Calendar', href: '#program' },
  { label: 'Visit Seoul', href: '#visit-seoul' },
  { label: 'Archives', href: '/past-editions' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'Artstation', href: '#', Icon: Social1 },
  { label: 'LinkedIn', href: '#', Icon: Social2 },
  { label: 'YouTube', href: '#', Icon: Social3 },
];

type PublicRenewalLayoutProps = {
  className: string;
  children: React.ReactNode;
};

export default function PublicRenewalLayout({ className, children }: PublicRenewalLayoutProps) {
  const navigate = usePublicNavigate();
  // SPA 내비게이션(pushState)은 next/navigation usePathname 을 갱신하지 않으므로
  // is-current 비교는 셸 라우팅의 source of truth 인 currentPathAtom 을 쓴다
  const pathname = useAtomValue(currentPathAtom);
  const publishedEvents = usePublishedOfficialEvents();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const officialEventChildren = publishedEvents.map((event) => ({
    label: event.slug,
    href: `/event/${encodeURIComponent(event.slug)}`,
  }));
  const officialEventPath = officialEventChildren[0]?.href ?? DEFAULT_OFFICIAL_EVENT_PATH;
  const navItems = createNavItems(officialEventPath, officialEventChildren);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    if (href.startsWith('/') && !href.includes('#')) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <div className={`saf-renewal-home saf-public-shell ${className}`}>
      <header
        className={`saf-renewal-header${activeMenu ? ' is-menu-open' : ''}${mobileMenuOpen ? ' is-mobile-menu-open is-menu-open' : ''}`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a
            className="saf-renewal-brand"
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            aria-label="Seoul ADR Festival home"
          >
            <SafLogo className="mp-brand-logo" aria-hidden="true" />
          </a>
          <button
            className="saf-renewal-menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <div className="mp-header-right">
            <div className="saf-renewal-social" aria-label="Social links">
              {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} href={href} aria-label={label}>
                  <Icon className="mp-social-icon" aria-hidden="true" />
                </a>
              ))}
            </div>
            <nav className="saf-renewal-nav" aria-label="Main navigation">
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isActive = activeMenu === item.label;
                return (
                  <div
                    className={`saf-renewal-nav-item${isActive ? ' is-active' : ''}${hasChildren ? ' has-submenu' : ''}`}
                    key={item.label}
                    onMouseEnter={() => setActiveMenu(hasChildren ? item.label : null)}
                  >
                    <a href={item.href} onClick={(e) => handleNavClick(e, item.href)}>
                      {item.label}
                    </a>
                    {hasChildren && (
                      <div className="saf-renewal-menu-panel" role="menu">
                        {item.children?.map((child) => {
                          const childPath = child.href.split('#')[0];
                          const isCurrent = pathname === childPath;
                          return (
                          <a
                            className={`${child.featured ? 'is-featured' : ''}${isCurrent ? ' is-current' : ''}`.trim() || undefined}
                            href={child.href}
                            key={child.label}
                            role="menuitem"
                            onClick={(e) => handleNavClick(e, child.href)}
                          >
                            {child.label}
                          </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {children}

      {/* Figma main01 footer: navy 2\ub2e8 \u2014 \uc88c(\ub85c\uace0/\uc601\ubb38 \ub2e8\ub77d/\uce74\ud53c\ub77c\uc774\ud2b8) \u00b7 \uc6b0(Privacy \uc0c1\u00b7\uc18c\uc15c \ud558). */}
      <footer className="saf-renewal-footer">
        <div className="saf-renewal-shell">
          <div className="saf-renewal-footer-left">
            <div className="saf-renewal-footer-brand">
              <SafLogo className="mp-footer-logo" aria-hidden="true" />
            </div>
            <p>
              Seoul ADR Festival (SAF) is organized by KCAB International.
              <br />
              Office: Trade Tower, 511 Yeongdong-daero, Gangnam-gu, Seoul
              <br />
              Contact: saf@kcab.or.kr
            </p>
            <small>{'\u00a9'} 2026 KCAB International. All rights reserved.</small>
          </div>
          <div className="saf-renewal-footer-right">
            <a
              className="saf-renewal-footer-privacy"
              href="#privacy"
              onClick={(e) => handleNavClick(e, '#privacy')}
            >
              Privacy
            </a>
            <div className="saf-renewal-social" aria-label="Social links">
              {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} href={href} aria-label={label}>
                  <Icon className="mp-social-icon" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
