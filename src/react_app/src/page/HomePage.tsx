'use client';

import React, { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { useCurrentOfficialEventPath } from '@hook/useCurrentOfficialEventPath';
import { callGetPublicPopupList } from '@api/popup/PopupApi';
import { PopupItem } from '@interface/popup/PopupManagement';
import MainPopupOverlay from '@component/popup/MainPopupOverlay';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul-figma.jpg';
import StatementPatternImage from '../assets/images/saf-renewal/statement-pattern-figma.jpg';
import GalleryConferenceImage from '../assets/images/saf-renewal/gallery-conference.jpg';
import GalleryReceptionImage from '../assets/images/saf-renewal/gallery-reception.jpg';
import GalleryNetworkImage from '../assets/images/saf-renewal/gallery-network.jpg';
import GalleryAudienceImage from '../assets/images/saf-renewal/gallery-audience.jpg';
import GalleryNetworkingFigmaImage from '../assets/images/saf-renewal/gallery-networking-figma.jpg';
import GalleryCollaborationFigmaImage from '../assets/images/saf-renewal/gallery-collaboration-figma.jpg';
import GalleryKnowledgeFigmaImage from '../assets/images/saf-renewal/gallery-knowledge-figma.jpg';
import GalleryTrendsFigmaCardImage from '../assets/images/saf-renewal/gallery-trends-figma-card.jpg';
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

const expectationCards = [
  {
    no: '01',
    title: 'Networking',
    desc: 'Connect with global ADR leaders',
    image: GalleryNetworkingFigmaImage,
  },
  {
    no: '02',
    title: 'Collaboration',
    desc: 'Cross-border partnerships',
    image: GalleryCollaborationFigmaImage,
  },
  {
    no: '03',
    title: 'Knowledge',
    desc: 'Insights from top practitioners',
    image: GalleryKnowledgeFigmaImage,
  },
  {
    no: '04',
    title: 'Trends',
    desc: 'Shaping the future of arbitration',
    image: GalleryTrendsFigmaCardImage,
    precomposed: true,
  },
];

const recapStats = [
  { value: '1,500+', label: 'Participants' },
  { value: '40+', label: 'Jurisdictions' },
  { value: '60', label: 'Sessions' },
  { value: '10', label: 'Years' },
  { value: '120+', label: 'Sessions Held' },
  { value: '8K+', label: 'Alumni' },
];

const journeyCards = [
  { year: '2022', image: GalleryConferenceImage },
  { year: '2023', image: GalleryReceptionImage },
  { year: '2024', image: GalleryNetworkImage },
  { year: '2025', image: GalleryAudienceImage },
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
  const officialEventPath = useCurrentOfficialEventPath();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/') && !href.includes('#')) {
      e.preventDefault();
      pushPath(href, setCurrentPath);
    }
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
    <>
      <main>
        <section
          className="saf-renewal-sunset-hero"
          style={{ backgroundImage: `url(${assetSrc(HeroSeoulImage)})` }}
        >
          <div className="saf-renewal-sunset-hero-overlay" aria-hidden="true" />
          <div className="saf-renewal-sunset-hero-inner">
            <div className="saf-renewal-sunset-hero-content">
              <h1 className="saf-renewal-sunset-title">
                Unveiling
                <br />
                Excellence
                <br />
                in Arbitration.
              </h1>
              <p className="saf-renewal-sunset-date">{'26 \u2013 30 October 2026 \u00b7 Seoul'}</p>
              <p className="saf-renewal-sunset-lede">
                The Seoul ADR Festival brings together leading arbitrators, practitioners, and industry
                experts from across the Asia-Pacific region for five days of dialogue, collaboration,
                and discovery.
              </p>
              <div className="saf-renewal-sunset-meta">
                <button type="button" className="saf-renewal-sunset-arrow" aria-label="Previous hero slide">
                  {'\u2190'}
                </button>
                <span className="saf-renewal-sunset-pager-num">01</span>
                <span className="saf-renewal-sunset-pager-sep">/</span>
                <span className="saf-renewal-sunset-pager-num">03</span>
                <button type="button" className="saf-renewal-sunset-arrow" aria-label="Next hero slide">
                  {'\u2192'}
                </button>
              </div>
              <a className="saf-renewal-hero-readmore" href="#program">
                Read More
                <span aria-hidden="true">{'\u203a'}</span>
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
                <article
                  className={`saf-renewal-expect-card${card.precomposed ? ' is-precomposed' : ''}`}
                  key={card.title}
                >
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
          style={{ backgroundImage: `url(${assetSrc(StatementPatternImage)})` }}
        >
          <div className="saf-renewal-shell saf-renewal-statement-inner">
            <h2 className="saf-renewal-statement-title">
              Seoul ADR Festival will become
              <br />
              a cornerstone of the international
              <br />
              arbitration calendar.
            </h2>
            <a
              className="saf-renewal-statement-cta"
              href={officialEventPath}
              aria-label="View official events"
              onClick={(e) => handleNavClick(e, officialEventPath)}
            >
              <span aria-hidden="true">{'\u2197'}</span>
            </a>
          </div>
        </section>

        <section className="saf-renewal-recap">
          <div className="saf-renewal-shell">
            <div className="saf-renewal-recap-heading">
              <span className="saf-renewal-recap-kicker">Looking Back</span>
              <h2>
                A landmark year,
                <br />
                a decade in the making.
              </h2>
            </div>
            <div className="saf-renewal-recap-grid">
              <article className="saf-renewal-recap-card">
                <span>Recap</span>
                <strong>Seoul ADR Festival 2025</strong>
                <a href="/past-editions/2025" onClick={(e) => handleNavClick(e, '/past-editions/2025')}>
                  Watch Highlights
                </a>
              </article>
              <div className="saf-renewal-recap-copy">
                <p>
                  The 2025 edition convened over <strong>1,500 participants from 40+ jurisdictions</strong>,
                  marking a defining moment for the region's dispute resolution community.
                </p>
                <p>
                  Building on that momentum, SAF 2026 will go further{'\u2014'}broadening voices,
                  deepening dialogue, and elevating the standard for cross-border practice.
                  The latest chapter in a journey ten years in the making.
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
          </div>
        </section>

        <section className="saf-renewal-journey">
          <div className="saf-renewal-shell">
            <div className="saf-renewal-journey-heading">
              <span>A Decade of Dialogue</span>
            </div>
            <div className="saf-renewal-journey-grid">
              <button type="button" className="saf-renewal-journey-arrow" aria-label="Previous gallery image">
                {'\u2039'}
              </button>
              {journeyCards.map((card) => (
                <article
                  className="saf-renewal-journey-card"
                  key={card.year}
                  style={{ backgroundImage: `url(${assetSrc(card.image)})` }}
                >
                  <span>{card.year}</span>
                </article>
              ))}
              <button type="button" className="saf-renewal-journey-arrow is-next" aria-label="Next gallery image">
                {'\u203a'}
              </button>
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

      <MainPopupOverlay
        popups={popups}
        onClose={handlePopupClose}
        onDismissToday={handlePopupDismissToday}
      />
    </>
  );
}
