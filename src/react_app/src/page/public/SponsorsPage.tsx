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
/* size: 로고별 대각선 정규화(에셋 실측 종횡비 유지, 대각선 √(w²+h²)≈300px 균등, h≤140 클램프)
   — 면적 균등은 가로형 로고의 폭을 키워(420px) 체감 크기가 커지는 문제가 있어,
   눈이 크기를 읽는 "최장축" 기준(대각선)으로 맞춰 모든 로고가 비슷한 크기로 보이게 한다.
   세로형(HFW/Lee&Ko/Shin&Kim/Vanguard)만 h=140 클램프로 대각선이 약간 짧다.
   사용자 요청 개별 보정(종횡비 유지): Jipyong·Seoul Metropolitan ×1.1,
   Baker McKenzie·Yoon & Yang·Steptoe·Jus Mundi ×0.9 */
const sponsorGroups = [
  {
    title: 'Welcome Reception Sponsor',
    logos: [{ name: 'Jipyong', image: SponsorJipyongLogo, size: { w: 307, h: 121 } }],
  },
  {
    title: 'Platinum Sponsors',
    logos: [
      { name: 'Bae, Kim & Lee', image: SponsorBaeKimLeeLogo, size: { w: 275, h: 120 } },
      { name: 'Kim & Chang', image: SponsorKimChangLogo, size: { w: 298, h: 33 } },
      { name: 'LITIG', image: SponsorLitigLogo, size: { w: 282, h: 104 } },
      { name: 'Peter & Kim', image: SponsorPeterKimLogo, size: { w: 277, h: 115 } },
    ],
  },
  {
    title: 'Gold Sponsor',
    logos: [
      { name: 'Analysis Group', image: SponsorAnalysisGroupLogo, size: { w: 297, h: 40 } },
      { name: 'Baker McKenzie', image: SponsorBakerMckenzieLogo, size: { w: 250, h: 102 } },
      { name: 'DIAC', image: SponsorDiacLogo, size: { w: 281, h: 104 } },
      { name: 'HFW', image: SponsorHfwLogo, size: { w: 195, h: 140 } },
      { name: 'Lee & Ko', image: SponsorLeeKoLogo, size: { w: 209, h: 140 } },
      { name: 'Quinn Emanuel', image: SponsorQuinnEmanuelLogo, size: { w: 298, h: 34 } },
      { name: 'Shin & Kim', image: SponsorShinKimLogo, size: { w: 210, h: 140 } },
      { name: 'Yendall Hunter', image: SponsorYendallHunterLogo, size: { w: 297, h: 39 } },
      { name: 'Yoon & Yang', image: SponsorYoonYangLogo, size: { w: 257, h: 84 } },
      { name: 'Yulchon', image: SponsorYulchonLogo, size: { w: 285, h: 95 } },
    ],
  },
  {
    title: 'Silver Sponsors',
    logos: [
      { name: 'Herbert Smith Freehills Kramer', image: SponsorHerbertSmithLogo, size: { w: 288, h: 84 } },
      { name: 'Secretariat', image: SponsorSecretariatLogo, size: { w: 293, h: 65 } },
      { name: 'Steptoe', image: SponsorSteptoeLogo, size: { w: 256, h: 88 } },
      { name: 'Stevenson Wong & Co.', image: SponsorStevensonWongLogo, size: { w: 288, h: 83 } },
      { name: 'Jus Mundi', image: SponsorJusMundiLogo, size: { w: 253, h: 94 } },
      { name: 'Vanguard', image: SponsorVanguardLogo, size: { w: 169, h: 140 } },
    ],
  },
  {
    title: 'Special Sponsor',
    logos: [{ name: 'Seoul Metropolitan Government', image: SponsorSeoulMetropolitanLogo, size: { w: 321, h: 75 } }],
  },
];

export default function SponsorsPage() {
  return (
    <main className="mp-main">
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

        {/* organizer와 공통 class(.mp-blob): list(overflow:hidden) 밖 hero의 형제로 두어 잘리지 않게.
            사이즈/위치는 .mp-blob 공통 규칙(MediaPartners.scss) — .mp-hero 와 50px 간격. */}
        <img className="mp-blob" src={assetSrc(SponsorsBlob)} alt="" aria-hidden="true" />

        {/* media-partners .mp-body 와 동일한 배치/글꼴: 공통 class(mp-body, mp-heading) 사용 */}
        <section className="saf-renewal-sponsors saf-sponsors-list mp-body">
          <div className="saf-renewal-shell">
            <div className="saf-sponsors-intro">
              <h2 className="mp-heading">Sponsors</h2>
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
                      <img
                        src={assetSrc(logo.image)}
                        alt={logo.name}
                        loading="lazy"
                        style={{ width: logo.size.w, height: logo.size.h }}
                      />
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
