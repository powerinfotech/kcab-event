'use client';

import React from 'react';
import HeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import BlobGraphic from '../../assets/images/saf-renewal/media-partners/blob.svg';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import LogoAblj from '../../assets/images/saf-renewal/media-partners/logo-ablj.png';
import LogoHankyung from '../../assets/images/saf-renewal/media-partners/logo-hankyung.png';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

const mediaPartners = [
  { name: 'Asia Business Law Journal', image: LogoAblj },
  { name: 'Hankyung Media Group', image: LogoHankyung },
];

const MediaPartners: React.FC = () => (
  <main className="mp-main">
      <section
        className="mp-hero"
        style={{ backgroundImage: `url(${assetSrc(HeroImage)})` }}
      >
        <div className="mp-hero-content">
          <nav className="mp-breadcrumb" aria-label="Breadcrumb">
            <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
            <span className="mp-breadcrumb-dot" aria-hidden="true" />
            <span>Partners</span>
            <span className="mp-breadcrumb-dot" aria-hidden="true" />
            <span className="mp-breadcrumb-current">Media Partners</span>
          </nav>
          <h1 className="mp-hero-title">Media Partners</h1>
        </div>
      </section>

      <BlobGraphic className="mp-blob" aria-hidden="true" />

      <div className="mp-body">
        <div className="saf-renewal-shell">
          <h2 className="mp-heading">Media Partners</h2>

          <div className="saf-renewal-sponsor-title">
            <span>Supporting Organization</span>
          </div>

          <div className="mp-logos">
            {mediaPartners.map((partner) => (
              <figure className="mp-logo" key={partner.name}>
                <img src={assetSrc(partner.image)} alt={partner.name} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </main>
);

export default MediaPartners;
