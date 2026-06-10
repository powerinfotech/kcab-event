'use client';

import React from 'react';
import HeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import BlobGraphic from '../../assets/images/saf-renewal/media-partners/blob.svg';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import KcabLogo from '../../assets/images/saf-renewal/sponsors/kcab-international.png';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

const organizers = [
  { name: 'KCAB International', image: KcabLogo },
];

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
          <h1 className="mp-hero-title">Organizer</h1>
        </div>
      </section>

      <BlobGraphic className="mp-blob organizer-blob" aria-hidden="true" />

      <div className="mp-body organizer-body">
        <div className="saf-renewal-shell">
          <h2 className="mp-heading">Organizer</h2>

          <div className="mp-support">
            <span className="mp-support-label">Organizer</span>
            <div className="mp-support-line" aria-hidden="true" />
          </div>

          <div className="mp-logos organizer-logos">
            {organizers.map((organizer) => (
              <figure className="mp-logo organizer-logo" key={organizer.name}>
                <img src={assetSrc(organizer.image)} alt={organizer.name} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </main>
);

export default Organizer;
