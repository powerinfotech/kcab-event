'use client';

import React from 'react';
import HeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import KcabLogo from '../../assets/images/saf-renewal/sponsors/kcab-international.png';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

const Organizer: React.FC = () => (
  <main className="mp-main organizer-main">
      <section
        className="mp-hero organizer-hero"
        style={{ backgroundImage: `url(${assetSrc(HeroImage)})` }}
      >
        <div className="mp-hero-content">
          <nav className="mp-breadcrumb" aria-label="Breadcrumb">
            <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
            <span className="mp-breadcrumb-dot" aria-hidden="true" />
            <span>Partners</span>
            <span className="mp-breadcrumb-dot" aria-hidden="true" />
            <span className="mp-breadcrumb-current">Organizer</span>
          </nav>
          <h1 className="mp-hero-title">KCAB International</h1>
        </div>
      </section>

      <div className="mp-body organizer-body">
        <div className="saf-renewal-shell">
          {/* Figma sub01_organizer: KCAB International 소개 — 헤딩 + 2단(로고 | 설명 단락) */}
          <div className="organizer-about">
            <h2 className="mp-heading organizer-about-title">KCAB International</h2>

            <div className="organizer-about-body">
              <figure className="organizer-about-logo">
                <img src={assetSrc(KcabLogo)} alt="KCAB International" loading="lazy" />
              </figure>

              <div className="organizer-about-text">
                <p>
                  As the sole arbitral institution statutorily empowered to deal with cross-border
                  disputes, KCAB International specializes in providing flexible, efficient, and
                  cost-effective arbitration and other dispute resolution services.
                </p>
                <p>
                  KCAB International was established on 20 April 2018 as an independent division of
                  the Korean Commercial Arbitration Board to meet the growing demand for cross-border
                  commercial dispute resolution. KCAB International specializes in international
                  arbitration to ensure that disputes are resolved in a cost-effective and
                  time-efficient manner within a streamlined process. Enlisted with leading experts
                  and professionals with abundant experience and expertise in international dispute
                  resolution, KCAB International will further enhance the standing of Korea as a
                  premier international dispute resolution center in Asia and beyond.
                </p>
                <p>
                  Founded in 1966, the Korean Commercial Arbitration Board is the sole arbitral
                  institution in Korea that is statutorily authorized to settle disputes under the
                  Korean Arbitration Act, under the auspices of the Ministry of Justice. Over the
                  past 50 years, the Korean Commercial Arbitration Board has handled about 7,000
                  arbitration cases and 15,000 conciliation cases marking itself as a leading
                  alternative dispute resolution center.
                </p>
                <p>
                  For more information, please visit KCAB International&apos;s website{' '}
                  <a href="https://www.kcabinternational.or.kr/" target="_blank" rel="noreferrer">
                    here
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
);

export default Organizer;
