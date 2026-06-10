'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePublicNavigate } from '@hook/usePublicNavigate';
import { useCurrentOfficialEventPath } from '@hook/useCurrentOfficialEventPath';
import BusinessFooterInfo from './BusinessFooterInfo';
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

const createNavItems = (officialEventPath: string): NavItem[] => [
  { label: 'Home', href: '/' },
  {
    label: 'Partners',
    href: '/organizer',
    children: [
      { label: 'Organizer', href: '/organizer' },
      { label: 'Sponsors', href: '/sponsors' },
      { label: 'Supporters', href: '/supporters' },
      { label: 'Media Partners', href: '/media-partners', featured: true },
    ],
  },
  {
    label: 'Official Events',
    href: officialEventPath,
    children: [
      { label: 'Events', href: officialEventPath },
      { label: 'Register', href: `${officialEventPath}/register` },
    ],
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
  const pathname = usePathname();
  const officialEventPath = useCurrentOfficialEventPath();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navItems = createNavItems(officialEventPath);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setActiveMenu(null);
    if (href.startsWith('/') && !href.includes('#')) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <div className={`saf-renewal-home ${className}`}>
      <header
        className={`saf-renewal-header${activeMenu ? ' is-menu-open' : ''}`}
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

      <footer className="saf-renewal-footer">
        <div className="saf-renewal-shell">
          <div className="saf-renewal-footer-top">
            <div className="saf-renewal-footer-brand">
              <SafLogo className="mp-footer-logo" aria-hidden="true" />
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
          <small>{'\u00a9'} 2026 KCAB International. All rights reserved.</small>
          <div className="saf-renewal-footer-social" aria-label="Social links">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} aria-label={label}>
                <Icon className="mp-social-icon" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
