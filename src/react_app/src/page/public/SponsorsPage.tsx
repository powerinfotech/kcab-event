'use client';

import React from 'react';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import SponsorsHeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
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

const assetSrc = (asset: string | { src?: string }) =>
  typeof asset === 'string' ? asset : asset.src ?? '';

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
  return (
    <main>
        <section
          className="mp-hero"
          style={{ backgroundImage: `url(${assetSrc(SponsorsHeroImage)})` }}
        >
          <div className="mp-hero-content">
            <nav className="mp-breadcrumb" aria-label="Breadcrumb">
              <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span>Partners</span>
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span className="mp-breadcrumb-current">Sponsors</span>
            </nav>
            <h1 className="mp-hero-title">Sponsors</h1>
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
  );
}
