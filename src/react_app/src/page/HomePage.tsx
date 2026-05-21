'use client';

import React, { useEffect, useState } from 'react';
import { callGetPublicPopupList } from '@api/popup/PopupApi';
import { PopupItem } from '@interface/popup/PopupManagement';
import MainPopupWindowLauncher from '@component/popup/MainPopupWindowLauncher';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul.jpg';
import WaveBgImage from '../assets/images/saf-renewal/wave-bg.png';
import SeoulBannerImage from '../assets/images/saf-renewal/seoul-banner.jpg';
import ThreadNetworkingImage from '../assets/images/saf-renewal/thread-networking.png';
import ThreadCollaborationImage from '../assets/images/saf-renewal/thread-collaboration.png';
import ThreadKnowledgeImage from '../assets/images/saf-renewal/thread-knowledge.png';
import RecapWaveImage from '../assets/images/saf-renewal/recap-wave.png';
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
import SponsorLeeKoLogo from '../assets/images/saf-renewal/sponsors/lee-ko.png';
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
import SponsorYulchonLogo from '../assets/images/saf-renewal/sponsors/yulchon.png';

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

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Partners', href: '#partners' },
  { label: 'Official Events', href: '/events' },
  { label: 'Calendar', href: '#program' },
];

const threadCards = [
  {
    no: '01',
    title: 'Networking',
    desc: 'Connect with global ADR leaders',
    image: ThreadNetworkingImage,
  },
  {
    no: '02',
    title: 'Collaboration',
    desc: 'Cross-border partnerships',
    image: ThreadCollaborationImage,
  },
  {
    no: '03',
    title: 'Knowledge',
    desc: 'Insights from top practitioners',
    image: ThreadKnowledgeImage,
  },
];

const galleryImages = [
  GalleryConferenceImage,
  GalleryReceptionImage,
  GalleryNetworkImage,
  GalleryAudienceImage,
];

const sponsorGroups = [
  {
    title: 'Organized',
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
    title: 'Platinum',
    logos: [
      { name: 'Bae, Kim & Lee', image: SponsorBaeKimLeeLogo },
      { name: 'Kim & Chang', image: SponsorKimChangLogo },
      { name: 'Lee & Ko', image: SponsorLeeKoLogo },
      { name: 'LITIG', image: SponsorLitigLogo },
      { name: 'Peter & Kim', image: SponsorPeterKimLogo },
      { name: 'Shin & Kim', image: SponsorShinKimLogo },
    ],
  },
  {
    title: 'Gold',
    logos: [
      { name: 'Analysis Group', image: SponsorAnalysisGroupLogo },
      { name: 'Baker McKenzie', image: SponsorBakerMckenzieLogo },
      { name: 'DIAC', image: SponsorDiacLogo },
      { name: 'Herbert Smith Freehills Kramer', image: SponsorHerbertSmithLogo },
      { name: 'HFW', image: SponsorHfwLogo },
      { name: 'Quinn Emanuel', image: SponsorQuinnEmanuelLogo },
      { name: 'Yoon & Yang', image: SponsorYoonYangLogo },
      { name: 'Yulchon', image: SponsorYulchonLogo },
    ],
  },
  {
    title: 'Silver',
    logos: [
      { name: 'Jus Mundi', image: SponsorJusMundiLogo },
      { name: 'Secretariat', image: SponsorSecretariatLogo },
      { name: 'Steptoe', image: SponsorSteptoeLogo },
      { name: 'Stevenson Wong & Co.', image: SponsorStevensonWongLogo },
      { name: 'Vanguard', image: SponsorVanguardLogo },
      { name: 'Yendall Hunter', image: SponsorYendallHunterLogo },
    ],
  },
  {
    title: 'Special Sponsor',
    logos: [{ name: 'Seoul Metropolitan Government', image: SponsorSeoulMetropolitanLogo }],
  },
];

export default function HomePage() {
  const [popups, setPopups] = useState<PopupItem[]>([]);

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
        <div className="saf-renewal-header-inner">
          <a className="saf-renewal-brand" href="/" aria-label="Seoul ADR Festival home">
            <FestivalLogo />
            <span className="saf-renewal-brand-text">Seoul ADR Festival</span>
          </a>
          <nav className="saf-renewal-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section
          className="saf-renewal-hero"
          style={{ backgroundImage: `url("${assetSrc(HeroSeoulImage)}")` }}
        >
          <div className="saf-renewal-hero-content">
            <p className="saf-renewal-eyebrow">26 - 30 October 2026 · Seoul</p>
            <h1>
              Unveiling
              <br />
              Excellence
              <br />
              in <span>Arbitration.</span>
            </h1>
            <p className="saf-renewal-hero-copy">
              The Seoul ADR Festival brings together leading arbitrators, practitioners,
              and industry experts from across the Asia-Pacific region for five days of
              dialogue, collaboration, and discovery.
            </p>
            <a className="saf-renewal-primary-btn" href="#program">
              Explore Program
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="saf-renewal-hero-control" aria-hidden="true">
            <span>01</span>
            <span>/</span>
            <span>03</span>
          </div>
        </section>

        <section
          className="saf-renewal-threads"
          id="program"
          style={{ backgroundImage: `url("${assetSrc(WaveBgImage)}")` }}
        >
          <div className="saf-renewal-section-inner saf-renewal-threads-inner">
            <div className="saf-renewal-section-copy">
              <p className="saf-renewal-kicker">SAF 2026</p>
              <h2>Where we connect across borders.</h2>
              <div className="saf-renewal-title-line" />
              <p>
                Four threads running through every session, every conversation,
                and every corner of the festival.
              </p>
            </div>
            <div className="saf-renewal-thread-grid">
              {threadCards.map((card) => (
                <article className="saf-renewal-thread-card" key={card.title}>
                  <img src={assetSrc(card.image)} alt="" />
                  <div className="saf-renewal-thread-caption">
                    <span>{card.no}</span>
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
          style={{ backgroundImage: `url("${assetSrc(SeoulBannerImage)}")` }}
        >
          <div className="saf-renewal-section-inner">
            <h2>
              Seoul ADR Festival will become
              <br />
              a cornerstone of the international
              <br />
              arbitration calendar.
            </h2>
            <a href="/events" aria-label="View official events">↗</a>
          </div>
        </section>

        <section className="saf-renewal-recap">
          <div className="saf-renewal-section-inner">
            <p className="saf-renewal-kicker">Looking Back</p>
            <h2>A landmark year, a decade in the making.</h2>
            <div className="saf-renewal-recap-grid">
              <article
                className="saf-renewal-recap-card"
                style={{ backgroundImage: `url("${assetSrc(RecapWaveImage)}")` }}
              >
                <p>Recap</p>
                <h3>Seoul ADR Festival 2025</h3>
                <a href="/gallery">Watch Highlights</a>
              </article>
              <div className="saf-renewal-recap-copy">
                <p>
                  The 2025 edition convened over <strong>1,500 participants</strong>,
                  marking a defining moment for the regional ADR community.
                </p>
                <p>
                  Building on that momentum, SAF 2026 will gather practitioners
                  across jurisdictions for deeper dialogue and broader exchange.
                </p>
                <dl>
                  <div>
                    <dt>1,500+</dt>
                    <dd>Participants</dd>
                  </div>
                  <div>
                    <dt>40+</dt>
                    <dd>Jurisdictions</dd>
                  </div>
                  <div>
                    <dt>10</dt>
                    <dd>Years</dd>
                  </div>
                  <div>
                    <dt>120+</dt>
                    <dd>Sessions Held</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="saf-renewal-gallery-heading">
              <span>A Decade of Dialogue</span>
            </div>
            <div className="saf-renewal-gallery-strip" aria-label="A decade of dialogue">
              {galleryImages.map((image, index) => (
                <img key={assetSrc(image)} src={assetSrc(image)} alt={`Seoul ADR Festival scene ${index + 1}`} />
              ))}
            </div>
          </div>
        </section>

        <section className="saf-renewal-sponsors" id="partners">
          <div className="saf-renewal-section-inner">
            <h2>Our 2025 Sponsors</h2>
            {sponsorGroups.map((group) => (
              <div className="saf-renewal-sponsor-row" key={group.title}>
                <h3>{group.title}</h3>
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
        <div className="saf-renewal-section-inner">
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

      <MainPopupWindowLauncher
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
      <svg viewBox="0 0 88 54" focusable="false">
        <path d="M8 26c12 2 23-1 36-12 13 11 24 14 36 12" />
        <path d="M14 32h60M20 38h48M25 44h38" />
        <path d="M22 31v13M33 29v15M44 26v18M55 29v15M66 31v13" />
        <path d="M29 20h30M34 16h20M38 12h12" />
      </svg>
    </span>
  );
}
