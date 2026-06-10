'use client';

import React, { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { useCurrentOfficialEventPath } from '@hook/useCurrentOfficialEventPath';
import { callGetPublicPopupList } from '@api/popup/PopupApi';
import { PopupItem } from '@interface/popup/PopupManagement';
import MainPopupOverlay from '@component/popup/MainPopupOverlay';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul-figma.jpg';
import StatementPhotoImage from '../assets/images/saf-renewal/main01/statement-photo.jpg';
import ExpectBandImage from '../assets/images/saf-renewal/main01/statement-photo2.png';
import GalleryConferenceImage from '../assets/images/saf-renewal/gallery-conference.jpg';
import GalleryReceptionImage from '../assets/images/saf-renewal/gallery-reception.jpg';
import GalleryNetworkImage from '../assets/images/saf-renewal/gallery-network.jpg';
import GalleryAudienceImage from '../assets/images/saf-renewal/gallery-audience.jpg';
import ExpectNetworkingImage from '../assets/images/saf-renewal/main01/expect-networking.png';
import ExpectCollaborationImage from '../assets/images/saf-renewal/main01/expect-collaboration.png';
import ExpectKnowledgeImage from '../assets/images/saf-renewal/main01/expect-knowledge.png';
import ExpectTrendsImage from '../assets/images/saf-renewal/main01/expect-trends.png';
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
import SponsorLeeKoLogo from '../assets/images/saf-renewal/sponsors/lee-ko.png';
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

// Figma main01 Figure 카드 원본 사진 (image 165~168, image-fills API에서 추출).
// bgSize/bgPos = Figma에서 이미지 rect가 카드 프레임보다 크게 배치된 오프셋(보이는 크롭) 그대로.
const expectationCards = [
  {
    no: '01',
    title: 'Networking',
    desc: 'Connect with global ADR leaders',
    image: ExpectNetworkingImage,
    bgSize: '114% auto',
    bgPos: '69% 50%',
  },
  {
    no: '02',
    title: 'Collaboration',
    desc: 'Cross-border partnerships',
    image: ExpectCollaborationImage,
    bgSize: '114% auto',
    bgPos: '69% 50%',
  },
  {
    no: '03',
    title: 'Knowledge',
    desc: 'Insights from top practitioners',
    image: ExpectKnowledgeImage,
    bgSize: '115.5% auto',
    bgPos: '6% 0%',
  },
  {
    no: '04',
    title: 'Trends',
    desc: 'Shaping the future of arbitration',
    image: ExpectTrendsImage,
    bgSize: '118.8% auto',
    bgPos: '0% 92%',
  },
];

const recapStats = [
  { value: '1,500+', label: 'Participants' },
  { value: '40+', label: 'Jurisdictions' },
  { value: '60', label: 'Sessions' },
  { value: '10', label: 'Years' },
  { value: '120+', label: 'Sessions held' },
  { value: '8K+', label: 'Alumni' },
];

const journeyCards = [
  { year: '2022', image: GalleryConferenceImage },
  { year: '2023', image: GalleryReceptionImage },
  { year: '2024', image: GalleryNetworkImage },
  { year: '2025', image: GalleryAudienceImage },
];

// Figma main01 'Our 2025 Sponsors' 기준: 등급 라벨/구성/배치(cols) 동일.
// cols = 한 줄당 로고 수 (Gold 10개=5×2줄, Silver 6개=1줄, 나머지는 개수≤4라 기본 그리드).
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
      { name: 'LITIG', image: SponsorLitigLogo },
      { name: 'Peter & Kim', image: SponsorPeterKimLogo },
    ],
  },
  {
    title: 'Gold',
    cols: 5,
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
    title: 'Silver',
    cols: 6,
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
    title: 'Special',
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
                Seoul
                <br />
                ADR
                <br />
                Festival 2026
              </h1>
              {/* Figma main01: \ub0a0\uc9dc\ub294 \ud669\uae08 \uadf8\ub77c\ub370\uc774\uc158 \uc0ac\uac01\ud615(346\u00d748)\uc5d0 \ubb38\uad6c\uac00 \uc0c8\uaca8\uc9c4(knockout) \ud615\ud0dc */}
              <svg
                className="saf-renewal-sunset-date-badge"
                width="346"
                height="48"
                viewBox="0 0 346 48"
                role="img"
                aria-label="26 \u2013 30 October 2026"
              >
                <defs>
                  <linearGradient id="safHeroDateGold" x1="0" y1="0.5" x2="1" y2="0.5">
                    <stop offset="0" stopColor="#d8d47f" />
                    <stop offset="0.37" stopColor="#fdffc6" />
                    <stop offset="1" stopColor="#d3e6ec" />
                  </linearGradient>
                  <mask id="safHeroDateCut">
                    <rect width="346" height="48" fill="#fff" />
                    <text
                      x="173"
                      y="25"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="Montserrat, sans-serif"
                      fontSize="20"
                      fontWeight="700"
                      letterSpacing="2"
                      fill="#000"
                    >
                      {'26 \u2013 30 October 2026'}
                    </text>
                  </mask>
                </defs>
                <rect width="346" height="48" fill="url(#safHeroDateGold)" mask="url(#safHeroDateCut)" />
              </svg>
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
                <span className="saf-renewal-hero-readmore-chevron" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="saf-renewal-expect" id="program">
          {/* Figma main01 밴드 배경 — 사용자 제공 PNG export(1920×463, 'Gradient'+'Mask group' 원본) */}
          <div
            className="saf-renewal-expect-band"
            style={{ backgroundImage: `url(${assetSrc(ExpectBandImage)})` }}
            aria-hidden="true"
          />
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
                    style={{
                      backgroundImage: `url(${assetSrc(card.image)})`,
                      backgroundSize: card.bgSize,
                      backgroundPosition: card.bgPos,
                    }}
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
          style={{ backgroundImage: `url(${assetSrc(StatementPhotoImage)})` }}
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
                <svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true">
                  <path d="M5 1 L1 5 L5 9" fill="none" stroke="#233b5c" strokeWidth="2" />
                </svg>
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
                <svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true">
                  <path d="M1 1 L5 5 L1 9" fill="none" stroke="#233b5c" strokeWidth="2" />
                </svg>
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
                <div
                  className="saf-renewal-logo-grid"
                  style={{ '--logo-cols': group.cols ?? group.logos.length } as React.CSSProperties}
                >
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
