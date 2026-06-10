'use client';

import React from 'react';
import SupportersHeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import SupportersBlob from '../../assets/images/saf-renewal/supporters-blob.png';
import SupporterAdgmLogo from '../../assets/images/saf-renewal/supporters/adgm.png';
import SupporterIcdrAaaLogo from '../../assets/images/saf-renewal/supporters/icdr-aaa-asia.png';
import SupporterArbitrateAdLogo from '../../assets/images/saf-renewal/supporters/arbitrate-ad.png';
import SupporterApcamLogo from '../../assets/images/saf-renewal/supporters/apcam.png';
import SupporterAiacLogo from '../../assets/images/saf-renewal/supporters/aiac.png';
import SupporterAcicaLogo from '../../assets/images/saf-renewal/supporters/acica.png';
import SupporterCiamCiarLogo from '../../assets/images/saf-renewal/supporters/ciam-ciar.png';
import SupporterDiacLogo from '../../assets/images/saf-renewal/supporters/diac.png';
import SupporterIbramLogo from '../../assets/images/saf-renewal/supporters/ibram.png';
import SupporterDisLogo from '../../assets/images/saf-renewal/supporters/dis.png';
import SupporterHkiacLogo from '../../assets/images/saf-renewal/supporters/hkiac.png';
import SupporterIhcfLogo from '../../assets/images/saf-renewal/supporters/ihcf.png';
import SupporterIcsidLogo from '../../assets/images/saf-renewal/supporters/icsid.png';
import SupporterIdraLogo from '../../assets/images/saf-renewal/supporters/idra.png';
import SupporterKicaLogo from '../../assets/images/saf-renewal/supporters/kica.png';
import SupporterKitlaLogo from '../../assets/images/saf-renewal/supporters/kitla.png';
import SupporterMilanCamLogo from '../../assets/images/saf-renewal/supporters/milan-cam.png';
import SupporterNyiacLogo from '../../assets/images/saf-renewal/supporters/nyiac.png';
import SupporterOmanOacLogo from '../../assets/images/saf-renewal/supporters/oman-oac.png';
import SupporterPcaLogo from '../../assets/images/saf-renewal/supporters/pca.png';
import SupporterShacLogo from '../../assets/images/saf-renewal/supporters/shac.png';
import SupporterShiacLogo from '../../assets/images/saf-renewal/supporters/shiac.png';
import SupporterSiacLogo from '../../assets/images/saf-renewal/supporters/siac.png';
import SupporterSimcLogo from '../../assets/images/saf-renewal/supporters/simc.png';
import SupporterSwissLogo from '../../assets/images/saf-renewal/supporters/swiss-arbitration-centre.png';
import SupporterTiacLogo from '../../assets/images/saf-renewal/supporters/tiac.png';
import SupporterFaiLogo from '../../assets/images/saf-renewal/supporters/fai.png';
import SupporterCrcicaLogo from '../../assets/images/saf-renewal/supporters/crcica.png';
import SupporterJcaaLogo from '../../assets/images/saf-renewal/supporters/jcaa.png';
import SupporterMciaLogo from '../../assets/images/saf-renewal/supporters/mcia.png';
import SupporterTurkishBlogLogo from '../../assets/images/saf-renewal/supporters/turkish-arbitration-blog.png';
import SupporterViacViennaLogo from '../../assets/images/saf-renewal/supporters/viac-vienna.png';
import SupporterViacVietnamLogo from '../../assets/images/saf-renewal/supporters/viac-vietnam.png';

const assetSrc = (asset: string | { src?: string }) =>
  typeof asset === 'string' ? asset : asset.src ?? '';

/* Figma sub01_Supporters 의 "Supporting Organizations" 로고 그리드(11행 x 3열). 좌→우, 상→하 순서 그대로. */
const supporterLogos = [
  { name: 'ADGM Arbitration Centre', image: SupporterAdgmLogo },
  { name: 'ICDR–AAA Asia Case Management Centre', image: SupporterIcdrAaaLogo },
  { name: 'arbitrateAD', image: SupporterArbitrateAdLogo },
  { name: 'APCAM', image: SupporterApcamLogo },
  { name: 'AIAC', image: SupporterAiacLogo },
  { name: 'ACICA', image: SupporterAcicaLogo },
  { name: 'CIAM–CIAR', image: SupporterCiamCiarLogo },
  { name: 'DIAC', image: SupporterDiacLogo },
  { name: 'IBRAM', image: SupporterIbramLogo },
  { name: 'DIS – German Arbitration Institute', image: SupporterDisLogo },
  { name: 'HKIAC', image: SupporterHkiacLogo },
  { name: 'In-House Counsel Forum (IHCF)', image: SupporterIhcfLogo },
  { name: 'ICSID', image: SupporterIcsidLogo },
  { name: 'IDRA', image: SupporterIdraLogo },
  { name: 'KICA', image: SupporterKicaLogo },
  { name: 'KITLA', image: SupporterKitlaLogo },
  { name: 'Milan Chamber of Arbitration', image: SupporterMilanCamLogo },
  { name: 'NYIAC', image: SupporterNyiacLogo },
  { name: 'Oman Commercial Arbitration Centre', image: SupporterOmanOacLogo },
  { name: 'Permanent Court of Arbitration', image: SupporterPcaLogo },
  { name: 'Shanghai Arbitration Commission', image: SupporterShacLogo },
  { name: 'SHIAC', image: SupporterShiacLogo },
  { name: 'Singapore International Arbitration Centre', image: SupporterSiacLogo },
  { name: 'Singapore International Mediation Centre', image: SupporterSimcLogo },
  { name: 'Swiss Arbitration Centre', image: SupporterSwissLogo },
  { name: 'TIAC', image: SupporterTiacLogo },
  { name: 'Finland Arbitration Institute', image: SupporterFaiLogo },
  { name: 'CRCICA', image: SupporterCrcicaLogo },
  { name: 'JCAA', image: SupporterJcaaLogo },
  { name: 'MCIA', image: SupporterMciaLogo },
  { name: 'Turkish Arbitration Blog', image: SupporterTurkishBlogLogo },
  { name: 'Vienna International Arbitral Centre (VIAC)', image: SupporterViacViennaLogo },
  { name: 'Vietnam International Arbitration Centre (VIAC)', image: SupporterViacVietnamLogo },
];

export default function SupportersPage() {
  return (
    <main>
        <section
          className="mp-hero"
          style={{ backgroundImage: `url(${assetSrc(SupportersHeroImage)})` }}
        >
          <div className="mp-hero-content">
            <nav className="mp-breadcrumb" aria-label="Breadcrumb">
              <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span>Partners</span>
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span className="mp-breadcrumb-current">Supporters</span>
            </nav>
            <h1 className="mp-hero-title">Supporters</h1>
          </div>
        </section>

        <section className="saf-renewal-sponsors saf-sponsors-list">
          <img className="saf-sponsors-blob" src={assetSrc(SupportersBlob)} alt="" aria-hidden="true" />
          <div className="saf-renewal-shell">
            <div className="saf-sponsors-intro">
              <h2>Supporters</h2>
              <p>
                The Seoul ADR Festival 2025 is proud to be supported by leading arbitration
                institutions from around the world. Their collaboration and promotion play a vital
                role in making this global gathering a success.
                <br />
                Please click on each logo to learn more about our valued supporters.
              </p>
            </div>
            <div className="saf-renewal-sponsor-row">
              <div className="saf-renewal-sponsor-title">
                <span>Supporting Organizations</span>
              </div>
              <div className="saf-renewal-logo-grid">
                {supporterLogos.map((logo) => (
                  <figure className="saf-renewal-sponsor-logo" key={logo.name}>
                    <img src={assetSrc(logo.image)} alt={logo.name} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
