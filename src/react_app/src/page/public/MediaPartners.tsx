'use client';

import React, { useEffect, useState } from 'react';
import HeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import BlobGraphic from '../../assets/images/saf-renewal/media-partners/blob.svg';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import { callGetPublicSponsors } from '@api/sponsor/SponsorApi';
import { callGetPublicDisplaySetting } from '@api/displaySetting/DisplaySettingApi';
import { SponsorListItem } from '@interface/admin/Sponsor';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

/* Media Partners 는 SPONSOR_TIER 의 'MEDIA_PARTNERS' 티어로 관리한다.
   설명/팝업 없이 로고 + 외부 website 링크만(클릭 시 새 탭). 공개 설정(노출/연도)을 따른다. */
const MediaPartners: React.FC = () => {
  const [partners, setPartners] = useState<SponsorListItem[]>([]);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let active = true;
    callGetPublicDisplaySetting()
      .then((res) => {
        const item = res?.item;
        if (item?.showSponsors === 'N') {
          if (active) {
            setAvailable(false);
            setPartners([]);
          }
          return undefined;
        }
        if (active) setAvailable(true);
        return callGetPublicSponsors(item?.editionYear ?? undefined, 'MEDIA_PARTNERS').then((sr) => {
          if (active) setPartners(sr?.item ?? []);
        });
      })
      .catch(() =>
        callGetPublicSponsors(undefined, 'MEDIA_PARTNERS')
          .then((sr) => {
            if (active) setPartners(sr?.item ?? []);
          })
          .catch(() => {}),
      );
    return () => {
      active = false;
    };
  }, []);

  return (
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

          {available ? (
            <div className="mp-logos">
              {partners.map((partner) => {
                const inner = partner.logoFileUrl ? (
                  <img src={partner.logoFileUrl} alt={partner.companyName} loading="lazy" />
                ) : (
                  <figcaption className="saf-sponsor-name">{partner.companyName}</figcaption>
                );
                return (
                  <figure className="mp-logo" key={partner.sponsorSeq}>
                    {partner.websiteUrl ? (
                      <a
                        className="mp-logo-link"
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={partner.companyName}
                        title={partner.companyName}
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </figure>
                );
              })}
            </div>
          ) : (
            <p className="saf-sponsors-unavailable">
              Media partner information for this edition is not available yet. Please check back soon.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default MediaPartners;
