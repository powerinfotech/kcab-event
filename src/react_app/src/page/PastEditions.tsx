'use client';

/**
 * PastEditions - Past SAF Editions 페이지 (Seoul ADR Festival 아카이브)
 *
 * 홈페이지(/)와 동일한 saf-renewal 톤 + 동일한 헤더/푸터.
 * 헤더/푸터는 HomePage 의 마크업과 1:1 로 동일하게 유지한다.
 */
import React, { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul.jpg';

interface PastEdition {
  year: number;
  dateRange: string;
  theme?: string;
  badge?: string;
  /** PDF / 외부 브로셔 URL. 있으면 카드 클릭 시 새 창에서 열린다. */
  archiveUrl?: string;
  /** 내부 아카이브 상세 경로. 있으면 SPA 내부 화면으로 이동한다. */
  detailPath?: string;
}

interface Saf2020Host {
  name: string;
  logo: string;
}

interface Saf2020Event {
  time: string;
  title: string;
  format?: string;
  venue?: string;
  hosts: Saf2020Host[];
}

interface Saf2020Day {
  label: string;
  date: string;
  events: Saf2020Event[];
}

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Partners', href: '/#partners' },
  { label: 'Official Events', href: '/events' },
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

const saf2020HostBasePath = '/archives/2020/hosts';

const saf2020Hosts: Record<string, Saf2020Host> = {
  kaa: {
    name: 'The Korean Arbitrators Association',
    logo: `${saf2020HostBasePath}/kaa.jpg`,
  },
  siac: {
    name: 'SIAC',
    logo: `${saf2020HostBasePath}/siac.png`,
  },
  kcab: {
    name: 'KCAB INTERNATIONAL',
    logo: `${saf2020HostBasePath}/kcab-international.png`,
  },
  uncitral: {
    name: 'UNCITRAL',
    logo: `${saf2020HostBasePath}/uncitral.png`,
  },
  moj: {
    name: 'Ministry of Justice',
    logo: `${saf2020HostBasePath}/moj.png`,
  },
  kocia: {
    name: 'KOCIA',
    logo: `${saf2020HostBasePath}/kocia.jpg`,
  },
  kica: {
    name: 'KICA',
    logo: `${saf2020HostBasePath}/kica.jpg`,
  },
  simc: {
    name: 'SIMC',
    logo: `${saf2020HostBasePath}/simc.jpg`,
  },
  hsf: {
    name: 'Herbert Smith Freehills',
    logo: `${saf2020HostBasePath}/hsf.png`,
  },
  kimChang: {
    name: 'Kim & Chang',
    logo: `${saf2020HostBasePath}/kim-chang.png`,
  },
  kcabNext: {
    name: 'KCAB NEXT',
    logo: `${saf2020HostBasePath}/kcab-next.png`,
  },
  brg: {
    name: 'Berkeley Research Group',
    logo: `${saf2020HostBasePath}/brg.png`,
  },
  ysiac: {
    name: 'YSIAC',
    logo: `${saf2020HostBasePath}/ysiac.jpg`,
  },
  yconstruction: {
    name: 'YConstruction',
    logo: `${saf2020HostBasePath}/yconstruction.png`,
  },
  peterKim: {
    name: 'Peter & Kim',
    logo: `${saf2020HostBasePath}/peter-kim.png`,
  },
  hk45: {
    name: 'HK45',
    logo: `${saf2020HostBasePath}/hk45.png`,
  },
  hkiac: {
    name: 'HKIAC',
    logo: `${saf2020HostBasePath}/hkiac.png`,
  },
  icc: {
    name: 'ICC',
    logo: `${saf2020HostBasePath}/icc.png`,
  },
  seoulIdrc: {
    name: 'Seoul IDRC',
    logo: `${saf2020HostBasePath}/seoul-idrc.png`,
  },
  kaas: {
    name: 'The Korean Association of Arbitration Studies',
    logo: `${saf2020HostBasePath}/kaas.png`,
  },
};

const editions: PastEdition[] = [
  { year: 2025, dateRange: 'Oct 27 - Oct 31, 2025', theme: 'Unveiling Excellence in Arbitration', badge: 'Latest' },
  { year: 2024, dateRange: 'Oct 28 - Nov 1, 2024', theme: 'ADR Reborn' },
  { year: 2023, dateRange: 'Oct 30 - Nov 3, 2023', theme: 'New World No Map' },
  { year: 2022, dateRange: 'Nov 7 - Nov 11, 2022', theme: 'Solidarity for Recovery' },
  { year: 2021, dateRange: 'Nov 1 - Nov 5, 2021', theme: 'Innovating the Future of Dispute Resolution Beyond 2021' },
  {
    year: 2020,
    dateRange: 'Nov 2 - Nov 7, 2020',
    theme: 'The New Arbitration Landscape: 2020 and Beyond',
    detailPath: '/past-editions/2020',
  },
  {
    year: 2019,
    dateRange: 'Sep 17 - Sep 21, 2019',
    theme: 'Resilience for Recovery',
    archiveUrl: 'http://www.safkcab.com/',
  },
  {
    year: 2018,
    dateRange: 'Nov 4 - Nov 9, 2018',
    theme: 'Innovating the Future of Dispute Resolution',
    archiveUrl: 'http://saf2018.safkcab.com/index.html',
  },
  {
    year: 2017,
    dateRange: 'Nov 6 - Nov 11, 2017',
    theme: 'Access to Justice Innovations in Transnational Trade and Investment',
    archiveUrl: '/archives/SAF2017.pdf',
  },
  { year: 2016, dateRange: 'Oct 10 - Oct 14, 2016', archiveUrl: '/archives/SAF2016.pdf' },
  {
    year: 2015,
    dateRange: 'Nov 2 - Nov 6, 2015',
    archiveUrl: '/archives/SAF2015.pdf',
  },
];

const saf2020Days: Saf2020Day[] = [
  {
    label: 'Mon',
    date: '2 November',
    events: [
      {
        time: '13:00 - 15:00',
        title: 'The Korean Arbitrators Association Seminar',
        venue: 'Seoul IDRC, Hearing Room 1',
        hosts: [saf2020Hosts.kaa],
      },
      {
        time: '16:00 - 17:30',
        title: 'SIAC - KCAB INTERNATIONAL Joint Webinar',
        format: 'Virtual',
        hosts: [saf2020Hosts.siac, saf2020Hosts.kcab],
      },
    ],
  },
  {
    label: 'Tue',
    date: '3 November',
    events: [
      {
        time: '09:00 - 17:00',
        title: 'UNCITRAL - MOJ Workshop - Day 1',
        format: 'Hybrid',
        hosts: [saf2020Hosts.uncitral, saf2020Hosts.moj],
      },
      {
        time: '10:00 - 12:00',
        title: 'KOCIA-KICA Webinar',
        format: 'Virtual',
        hosts: [saf2020Hosts.kocia, saf2020Hosts.kica],
      },
      {
        time: '16:00 - 17:20',
        title: 'SIMC - KCAB INTERNATIONAL Joint Event',
        format: 'Virtual',
        hosts: [saf2020Hosts.simc, saf2020Hosts.kcab],
      },
      {
        time: '18:30 - 21:30',
        title: 'The 3rd Women in Arbitration Networking Event',
        format: 'Virtual',
        hosts: [saf2020Hosts.hsf, saf2020Hosts.kimChang, saf2020Hosts.kcab],
      },
    ],
  },
  {
    label: 'Wed',
    date: '4 November',
    events: [
      {
        time: '09:00 - 17:00',
        title: 'UNCITRAL - MOJ Workshop - Day 2',
        format: 'Hybrid',
        hosts: [saf2020Hosts.uncitral, saf2020Hosts.moj],
      },
      {
        time: '11:00 - 12:00',
        title: 'KCAB NEXT SAF Event',
        hosts: [saf2020Hosts.kcabNext, saf2020Hosts.kcab],
      },
      {
        time: '16:00 - 17:30',
        title: 'Webinar on Legal and Practical Issues on Valuation',
        format: 'Virtual',
        hosts: [saf2020Hosts.kimChang, saf2020Hosts.brg],
      },
      {
        time: '17:00 - 18:15',
        title: 'YSIAC Seoul Debate',
        format: 'Virtual',
        hosts: [saf2020Hosts.ysiac],
      },
      {
        time: '19:00 - 20:00',
        title: 'YConstruction Virtual Discussion Round',
        format: 'Virtual',
        hosts: [saf2020Hosts.yconstruction, saf2020Hosts.peterKim],
      },
    ],
  },
  {
    label: 'Thu',
    date: '5 November',
    events: [
      {
        time: '13:00 - 14:00',
        title: 'HK45 SAF Seminar',
        format: 'Virtual',
        hosts: [saf2020Hosts.hk45, saf2020Hosts.hkiac],
      },
      {
        time: '14:00 - 15:30',
        title: 'HKIAC SAF Seminar',
        format: 'Virtual',
        hosts: [saf2020Hosts.hkiac],
      },
      {
        time: '16:00 - 19:00',
        title: 'The 9th Asia-Pacific ADR Conference - Day 1',
        format: 'Virtual',
        hosts: [
          saf2020Hosts.kcab,
          saf2020Hosts.uncitral,
          saf2020Hosts.moj,
          saf2020Hosts.icc,
          saf2020Hosts.seoulIdrc,
        ],
      },
    ],
  },
  {
    label: 'Fri',
    date: '6 November',
    events: [
      {
        time: '16:00 - 19:00',
        title: 'The 9th Asia-Pacific ADR Conference - Day 2',
        format: 'Virtual',
        hosts: [
          saf2020Hosts.kcab,
          saf2020Hosts.uncitral,
          saf2020Hosts.moj,
          saf2020Hosts.icc,
          saf2020Hosts.seoulIdrc,
        ],
      },
    ],
  },
  {
    label: 'Sat',
    date: '7 November',
    events: [
      {
        time: '14:00 - 17:00',
        title: 'The Korean Association of Arbitration Studies',
        format: 'Hybrid',
        hosts: [saf2020Hosts.kaas],
      },
    ],
  },
];

/* HomePage.tsx 의 SocialIcon / FestivalLogo 와 1:1 동일하게 둔다. */
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

const ALL_FILTER = 'ALL';
const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');
const saf2020DayId = (label: string) => `saf-2020-${label.toLowerCase()}`;

export default function PastEditions() {
  const setCurrentPath = useSetAtom(currentPathAtom);
  const [filter, setFilter] = useState<string>(ALL_FILTER);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/') || href.includes('#')) return;
    e.preventDefault();
    pushPath(href, setCurrentPath);
  };

  const decades = ['ALL', '2020s', '2010s'];
  const filteredEditions = editions.filter((edition) => {
    if (filter === ALL_FILTER) return true;
    if (filter === '2020s') return edition.year >= 2020;
    if (filter === '2010s') return edition.year >= 2010 && edition.year < 2020;
    return true;
  });

  return (
    <div className="saf-renewal-home saf-past-home">
      {/* === 메인(/)과 1:1 동일한 헤더 === */}
      <header className="saf-renewal-header">
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a
            className="saf-renewal-brand"
            href="/"
            aria-label="Seoul ADR Festival home"
            onClick={(e) => handleNavClick(e, '/')}
          >
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
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="saf-past-hero">
          <div className="saf-renewal-shell">
            <p className="saf-renewal-eyebrow">Archives · 2015 — 2025</p>
            <h1>
              A decade of <span>dialogue.</span>
            </h1>
            <p className="saf-past-hero-copy">
              Since 2015, the Seoul ADR Festival has gathered arbitrators, practitioners,
              and global experts every autumn. Browse the eleven editions that shaped the
              conversation.
            </p>
            <div className="saf-past-metrics">
              <div>
                <strong>11</strong>
                <span>editions hosted</span>
              </div>
              <div>
                <strong>2015</strong>
                <span>inaugural year</span>
              </div>
              <div>
                <strong>Seoul</strong>
                <span>permanent host city</span>
              </div>
            </div>
          </div>
        </section>

        <section className="saf-past-listing">
          <div className="saf-renewal-shell">
            <div className="saf-past-filter">
              {decades.map((decade) => (
                <button
                  key={decade}
                  type="button"
                  className={`saf-past-filter-btn ${filter === decade ? 'is-active' : ''}`}
                  onClick={() => setFilter(decade)}
                >
                  {decade === 'ALL' ? 'All editions' : decade}
                </button>
              ))}
            </div>

            <ol className="saf-past-grid">
              {filteredEditions.map((edition) => {
                const hasArchive = Boolean(edition.archiveUrl || edition.detailPath);
                const className = [
                  'saf-past-card',
                  edition.badge ? 'is-featured' : '',
                  hasArchive ? 'is-clickable' : '',
                ].filter(Boolean).join(' ');

                const handleClick = () => {
                  if (edition.detailPath) {
                    pushPath(edition.detailPath, setCurrentPath);
                    return;
                  }
                  if (edition.archiveUrl && typeof window !== 'undefined') {
                    window.open(edition.archiveUrl, '_blank', 'noopener,noreferrer');
                  }
                };

                const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
                  if (!hasArchive) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                };

                return (
                  <li
                    key={edition.year}
                    className={className}
                    onClick={hasArchive ? handleClick : undefined}
                    onKeyDown={hasArchive ? handleKeyDown : undefined}
                    role={hasArchive ? 'link' : undefined}
                    tabIndex={hasArchive ? 0 : undefined}
                    aria-label={hasArchive
                      ? edition.detailPath
                        ? `Open SAF ${edition.year} archive`
                        : `Open SAF ${edition.year} archive (opens in new tab)`
                      : undefined}
                  >
                    <div className="saf-past-card-year">
                      <span>{edition.year}</span>
                      {edition.badge && <em>{edition.badge}</em>}
                    </div>
                    <div className="saf-past-card-body">
                      {edition.theme && (
                        <h3 className="saf-past-card-theme">{edition.theme}</h3>
                      )}
                      <p className="saf-past-card-date">{edition.dateRange}</p>
                    </div>
                    <div className="saf-past-card-meta">
                      <span>Seoul · Republic of Korea</span>
                    </div>
                  </li>
                );
              })}
            </ol>

            {filteredEditions.length === 0 && (
              <p className="saf-past-empty">No editions match this filter.</p>
            )}
          </div>
        </section>

        <section className="saf-past-cta">
          <div className="saf-renewal-shell">
            <div>
              <p className="saf-renewal-kicker">SAF 2026</p>
              <h2>The next chapter starts in October.</h2>
            </div>
            <a
              className="saf-renewal-primary-btn"
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
            >
              Visit SAF 2026
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      {/* === 메인(/)과 1:1 동일한 푸터 === */}
      <footer className="saf-renewal-footer">
        <div className="saf-renewal-shell">
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
          <p>
            Seoul ADR Festival (SAF) is organized by KCAB International.
            <br />
            Office Trade Tower, 511 Yeongdong-daero, Gangnam-gu, Seoul
            <br />
            Contact: saf@kcab.or.kr
          </p>
          <small>© 2026 KCAB International. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export function PastEdition2020() {
  const setCurrentPath = useSetAtom(currentPathAtom);
  const totalEvents = saf2020Days.reduce((sum, day) => sum + day.events.length, 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/') || href.includes('#')) return;
    e.preventDefault();
    pushPath(href, setCurrentPath);
  };

  const handleDayJump = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const id = saf2020DayId(label);
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="saf-renewal-home saf-past-home saf-archive-detail-home">
      <header className="saf-renewal-header">
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a
            className="saf-renewal-brand"
            href="/"
            aria-label="Seoul ADR Festival home"
            onClick={(e) => handleNavClick(e, '/')}
          >
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
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="saf-archive-detail-hero">
          <div className="saf-renewal-shell saf-archive-detail-hero-inner">
            <div className="saf-archive-detail-hero-copy">
              <a
                href="/past-editions"
                className="saf-archive-back-link"
                onClick={(e) => handleNavClick(e, '/past-editions')}
              >
                Back to Archives
              </a>
              <p className="saf-renewal-eyebrow">SAF Archive · 2020</p>
              <h1>The New Arbitration Landscape: 2020 and Beyond</h1>
              <p>
                Seoul ADR Festival 2020 ran from 2 to 7 November in Korea Standard Time.
                This page combines the original day-by-day archive into one continuous schedule.
              </p>
              <div className="saf-archive-detail-stats">
                <div>
                  <strong>6</strong>
                  <span>festival days</span>
                </div>
                <div>
                  <strong>{totalEvents}</strong>
                  <span>listed events</span>
                </div>
                <div>
                  <strong>UTC+9</strong>
                  <span>Korea time</span>
                </div>
              </div>
            </div>
            <div
              className="saf-archive-detail-visual"
              style={{ backgroundImage: `url(${assetSrc(HeroSeoulImage)})` }}
              aria-hidden="true"
            >
              <div>
                <span>2-7 Nov</span>
                <strong>SAF 2020</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="saf-archive-detail-body">
          <div className="saf-renewal-shell">
            <nav className="saf-archive-day-nav" aria-label="SAF 2020 days">
              {saf2020Days.map((day) => (
                <a
                  key={day.label}
                  href={`#${saf2020DayId(day.label)}`}
                  onClick={(e) => handleDayJump(e, day.label)}
                >
                  <strong>{day.label}</strong>
                  <span>{day.date}</span>
                </a>
              ))}
            </nav>

            <div className="saf-archive-timeline">
              {saf2020Days.map((day) => (
                <section
                  key={day.label}
                  id={saf2020DayId(day.label)}
                  className="saf-archive-day-section"
                >
                  <div className="saf-archive-day-heading">
                    <span>{day.label}</span>
                    <div>
                      <h2>{day.date}</h2>
                      <p>{day.events.length} event{day.events.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <ol className="saf-archive-event-list">
                    {day.events.map((event) => (
                      <li key={`${day.label}-${event.time}-${event.title}`} className="saf-archive-event-item">
                        <time>{event.time}</time>
                        <div className="saf-archive-event-card">
                          <div>
                            <h3>{event.title}</h3>
                            {(event.format || event.venue) && (
                              <dl>
                                {event.format && (
                                  <>
                                    <dt>Format</dt>
                                    <dd>{event.format}</dd>
                                  </>
                                )}
                                {event.venue && (
                                  <>
                                    <dt>Venue</dt>
                                    <dd>{event.venue}</dd>
                                  </>
                                )}
                              </dl>
                            )}
                          </div>
                          <div className="saf-archive-hosts">
                            <span>{event.hosts.length > 1 ? 'Hosts' : 'Host'}</span>
                            <div>
                              {event.hosts.map((host) => (
                                <figure key={`${event.title}-${host.name}`} className="saf-archive-host-logo">
                                  <img src={host.logo} alt={`${host.name} logo`} loading="lazy" />
                                </figure>
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="saf-renewal-footer">
        <div className="saf-renewal-shell">
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
          <p>
            Seoul ADR Festival (SAF) is organized by KCAB International.
            <br />
            Office Trade Tower, 511 Yeongdong-daero, Gangnam-gu, Seoul
            <br />
            Contact: saf@kcab.or.kr
          </p>
          <small>© 2026 KCAB International. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
