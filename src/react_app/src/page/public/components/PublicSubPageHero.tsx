import React from 'react';
import HomeIcon from '../../../assets/images/saf-renewal/media-partners/home.svg';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

type PublicSubPageHeroProps = {
  title: string;
  section?: string;
  current?: string;
  backgroundImage: string | { src?: string };
  className?: string;
};

export default function PublicSubPageHero({
  title,
  section,
  current,
  backgroundImage,
  className = '',
}: PublicSubPageHeroProps) {
  return (
    <section
      className={`saf-subpage-hero ${className}`.trim()}
      style={{ backgroundImage: `url(${assetSrc(backgroundImage)})` }}
    >
      <div className="saf-renewal-shell saf-subpage-hero-inner">
        <nav className="saf-subpage-breadcrumb" aria-label="Breadcrumb">
          <HomeIcon className="saf-subpage-breadcrumb-home" aria-hidden="true" />
          {section && (
            <>
              <span aria-hidden="true">·</span>
              <span>{section}</span>
            </>
          )}
          {current && (
            <>
              <span aria-hidden="true">·</span>
              <span>{current}</span>
            </>
          )}
        </nav>
        <h1>{title}</h1>
      </div>
    </section>
  );
}
