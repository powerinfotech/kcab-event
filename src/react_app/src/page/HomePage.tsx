'use client';

import React, { useEffect, useState } from 'react';
import { BookOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { callGetPublicPopupList } from '@api/popup/PopupApi';
import { PopupItem } from '@interface/popup/PopupManagement';
import MainPopupOverlay from '@component/popup/MainPopupOverlay';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul.jpg';
import SeoulBannerImage from '../assets/images/saf-renewal/seoul-banner.jpg';
import GalleryConferenceImage from '../assets/images/saf-renewal/gallery-conference.jpg';
import GalleryReceptionImage from '../assets/images/saf-renewal/gallery-reception.jpg';
import GalleryNetworkImage from '../assets/images/saf-renewal/gallery-network.jpg';
import GalleryAudienceImage from '../assets/images/saf-renewal/gallery-audience.jpg';
import SponsorAnalysisGroupLogo from '../assets/images/saf-renewal/sponsors/analysis-group.png';
import SponsorAsiaBusinessLawJournalLogo from '../assets/images/saf-renewal/sponsors/asia-business-law-journal.png';
import SponsorBaeKimLeeLogo from '../assets/images/saf-renewal/sponsors/bae-kim-lee.png';
import SponsorBakerMckenzieLogo from '../assets/images/saf-renewal/sponsors/baker-mckenzie.png';
import SponsorDiacLogo from '../assets/images/saf-renewal/sponsors/diac.png';
import SponsorHankyungLogo from '../assets/images/saf-renewal/sponsors/hankyung-media-group.png';
import SponsorHerbertSmithLogo from '../assets/images/saf-renewal/sponsors/herbert-smith-freehills-kramer.png';
import SponsorHfwLogo from '../assets/images/saf-renewal/sponsors/hfw.png';
import SponsorIccLogo from '../assets/images/saf-renewal/sponsors/icc-dispute-resolution.png';
import SponsorJipyongLogo from '../assets/images/saf-renewal/sponsors/jipyong.png';
import SponsorJusMundiLogo from '../assets/images/saf-renewal/sponsors/jus-mundi.png';
import SponsorKcabLogo from '../assets/images/saf-renewal/sponsors/kcab-international.png';
import SponsorKimChangLogo from '../assets/images/saf-renewal/sponsors/kim-chang.png';
import SponsorLitigLogo from '../assets/images/saf-renewal/sponsors/litig.png';
import SponsorMinistryJusticeLogo from '../assets/images/saf-renewal/sponsors/ministry-of-justice.png';
import SponsorPeterKimLogo from '../assets/images/saf-renewal/sponsors/peter-kim.png';
import SponsorQuinnEmanuelLogo from '../assets/images/saf-renewal/sponsors/quinn-emanuel.png';
import SponsorSecretariatLogo from '../assets/images/saf-renewal/sponsors/secretariat.png';
import SponsorSeoulMetropolitanLogo from '../assets/images/saf-renewal/sponsors/seoul-metropolitan-government.png';
import SponsorShinKimLogo from '../assets/images/saf-renewal/sponsors/shin-kim.png';
import SponsorSteptoeLogo from '../assets/images/saf-renewal/sponsors/steptoe.png';
import SponsorStevensonWongLogo from '../assets/images/saf-renewal/sponsors/stevenson-wong.png';
import SponsorUncitralLogo from '../assets/images/saf-renewal/sponsors/uncitral.png';
import SponsorVanguardLogo from '../assets/images/saf-renewal/sponsors/vanguard.png';
import SponsorYendallHunterLogo from '../assets/images/saf-renewal/sponsors/yendall-hunter.png';
import SponsorYoonYangLogo from '../assets/images/saf-renewal/sponsors/yoon-yang.png';

const POPUP_DISMISS_COOKIE_PREFIX = 'popup_dismissed_';

function isPopupDismissedToday(popupSeq: number): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((entry) => {
    const trimmed = entry.trim();
    return trimmed.startsWith(`${POPUP_DISMISS_COOKIE_PREFIX}${popupSeq}=`);
  });
}

function dismissPopupForToday(popupSeq: number): void {
  if (typeof document === 'undefined') return;
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  document.cookie = `${POPUP_DISMISS_COOKIE_PREFIX}${popupSeq}=Y; expires=${endOfDay.toUTCString()}; path=/`;
}

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

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
  { label: 'Partners', href: '#partners' },
  { label: 'Official Events', href: '/events' },
  { label: 'Calendar', href: '#program' },
  { label: 'Visit Seoul', href: '#visit' },
  { label: 'Archives', href: '/past-editions' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'Artstation', href: '#', icon: 'A' },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'YouTube', href: '#', icon: 'YT' },
];

const expectationCards = [
  {
    no: '01',
    title: 'Conference',
    desc: 'Global ADR leaders',
    image: GalleryConferenceImage,
  },
  {
    no: '02',
    title: 'Networking',
    desc: 'Lifelong connections',
    image: GalleryReceptionImage,
  },
  {
    no: '03',
    title: 'Collaboration',
    desc: 'Cross-border partnerships',
    image: GalleryNetworkImage,
  },
  {
    no: '04',
    title: 'Knowledge',
    desc: 'Insights from top practitioners',
    image: GalleryAudienceImage,
  },
];

const recapStats = [
  { value: '1,500+', label: 'Attendees' },
  { value: '40+', label: 'Jurisdictions' },
  { value: '120+', label: 'Sessions' },
];

const journeyCards = [
  { year: '2022', image: GalleryConferenceImage },
  { year: '2023', image: GalleryNetworkImage },
  { year: '2024', image: GalleryAudienceImage },
];

const sponsorGroups = [
  {
    title: 'Organized By',
    logos: [{ name: 'KCAB International', image: SponsorKcabLogo }],
  },
  {
    title: 'In Association With',
    logos: [
      { name: 'United Nations UNCITRAL', image: SponsorUncitralLogo },
      { name: 'Ministry of Justice', image: SponsorMinistryJusticeLogo },
      { name: 'ICC Dispute Resolution Services', image: SponsorIccLogo },
    ],
  },
  {
    title: 'Media Partners',
    logos: [
      { name: 'Asia Business Law Journal', image: SponsorAsiaBusinessLawJournalLogo },
      { name: 'Hankyung Media Group', image: SponsorHankyungLogo },
    ],
  },
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
    title: 'Gold Sponsors',
    logos: [
      { name: 'Analysis Group', image: SponsorAnalysisGroupLogo },
      { name: 'Baker McKenzie', image: SponsorBakerMckenzieLogo },
      { name: 'DIAC', image: SponsorDiacLogo },
      { name: 'HFW', image: SponsorHfwLogo },
      { name: 'Quinn Emanuel', image: SponsorQuinnEmanuelLogo },
      { name: 'Shin & Kim', image: SponsorShinKimLogo },
      { name: 'Yendall Hunter', image: SponsorYendallHunterLogo },
      { name: 'Yoon & Yang', image: SponsorYoonYangLogo },
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

export default function HomePage() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const setCurrentPath = useSetAtom(currentPathAtom);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/') || href.includes('#')) return;
    e.preventDefault();
    pushPath(href, setCurrentPath);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await callGetPublicPopupList();
        if (cancelled) return;
        const list = (res?.item ?? []).filter((popup) => {
          if (!popup.popupSeq) return true;
          return !isPopupDismissedToday(popup.popupSeq);
        });
        setPopups(list);
      } catch {
        // Silent: popup is non-critical content.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePopupClose = (popup: PopupItem) => {
    setPopups((prev) => prev.filter((item) => item.popupSeq !== popup.popupSeq));
  };

  const handlePopupDismissToday = (popup: PopupItem) => {
    if (popup.popupSeq) {
      dismissPopupForToday(popup.popupSeq);
    }
    handlePopupClose(popup);
  };

  return (
    <div className="saf-renewal-home">
      <header className="saf-renewal-header">
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a className="saf-renewal-brand" href="/" aria-label="Seoul ADR Festival home">
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
        <section
          className="saf-renewal-sunset-hero"
          style={{ backgroundImage: `url(${assetSrc(HeroSeoulImage)})` }}
        >
          <div className="saf-renewal-sunset-hero-overlay" aria-hidden="true" />
          <div className="saf-renewal-sunset-hero-inner">
            <div className="saf-renewal-sunset-hero-content">
              <p className="saf-renewal-sunset-eyebrow">26 — 30 October 2026 · Seoul</p>
              <h1 className="saf-renewal-sunset-title">
                Unveiling
                <br />
                Excellence
                <br />
                <span>in Arbitration.</span>
              </h1>
              <div className="saf-renewal-sunset-meta">
                <div className="saf-renewal-sunset-pager" aria-hidden="true">
                  <span className="saf-renewal-sunset-pager-arrow">←</span>
                  <span className="saf-renewal-sunset-pager-num">01</span>
                  <span className="saf-renewal-sunset-pager-sep">/</span>
                  <span className="saf-renewal-sunset-pager-num">03</span>
                  <span className="saf-renewal-sunset-pager-arrow">→</span>
                </div>
                <p className="saf-renewal-sunset-copy">
                  The Seoul ADR Festival brings together leading arbitrators, practitioners,
                  and industry experts from across the Asia-Pacific region for five days of
                  dialogue, collaboration, and discovery.
                </p>
              </div>
              <a className="saf-renewal-sunset-cta" href="#program">
                Explore Program
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="saf-renewal-expect" id="program">
          <div className="saf-renewal-shell">
            <div className="saf-renewal-section-heading">
              <span className="saf-renewal-expect-kicker">SAF 2026</span>
              <h2>
                Where we connect
                <br />
                across borders.
              </h2>
              <div className="saf-renewal-expect-divider" aria-hidden="true" />
              <p>
                Four threads running through every session, every conversation,
                and every corner of the festival.
              </p>
            </div>
            <div className="saf-renewal-expect-grid">
              {expectationCards.map((card) => (
                <article className="saf-renewal-expect-card" key={card.title}>
                  <div
                    className="saf-renewal-expect-card-media"
                    style={{ backgroundImage: `url(${assetSrc(card.image)})` }}
                    aria-hidden="true"
                  />
                  <span className="saf-renewal-expect-card-num">{card.no}</span>
                  <div className="saf-renewal-expect-card-body">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="saf-renewal-statement"
          style={{ backgroundImage: `url(${assetSrc(SeoulBannerImage)})` }}
        >
          <div className="saf-renewal-statement-overlay" aria-hidden="true" />
          <div className="saf-renewal-shell saf-renewal-statement-inner">
            <p className="saf-renewal-statement-kicker">A New Chapter Begins</p>
            <h2 className="saf-renewal-statement-title">
              Seoul ADR Festival will become a cornerstone
              <br />
              of the international arbitration calendar.
            </h2>
            <a className="saf-renewal-statement-cta" href="/events" aria-label="View official events">
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="saf-renewal-recap">
          <div className="saf-renewal-shell saf-renewal-recap-grid">
            <article className="saf-renewal-recap-card">
              <span>SAF 2025 Recap</span>
              <div>
                <small>27-31 October</small>
                <small>Seoul · Korea</small>
              </div>
            </article>
            <div className="saf-renewal-recap-copy">
              <span className="saf-renewal-recap-kicker">Looking Back</span>
              <h2>
                A landmark year,
                <br />
                a decade in the making.
              </h2>
              <p>
                Held over five days in October 2025, SAF gathered more than
                1,500 practitioners from over 40 jurisdictions. The ADR Conference
                anchored a week of seminars, gatherings and cultural side events at
                the centre of international dispute resolution.
              </p>
              <dl>
                {recapStats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.value}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="saf-renewal-journey">
          <div className="saf-renewal-shell">
            <div className="saf-renewal-journey-heading">
              <span>Est. 2013</span>
              <h2>
                A Decade of Dialogue
              </h2>
              <p>
                To celebrate its 13th anniversary, SAF returns to Seoul this October
                with a renewed programme, new partners and a wider stage for the next
                generation of ADR practitioners.
              </p>
            </div>
            <div className="saf-renewal-journey-grid">
              {journeyCards.map((card) => (
                <article
                  className="saf-renewal-journey-card"
                  key={card.year}
                  style={{ backgroundImage: `url(${assetSrc(card.image)})` }}
                >
                  <span>{card.year}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="saf-renewal-sponsors" id="partners">
          <div className="saf-renewal-shell">
            <h2>
              <span>Our 2025 Sponsors</span>
            </h2>
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

      <MainPopupOverlay
        popups={popups}
        onClose={handlePopupClose}
        onDismissToday={handlePopupDismissToday}
      />
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
