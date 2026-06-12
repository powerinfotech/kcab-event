'use client';

import React, { useEffect, useState } from 'react';
import SupportersHeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import SupportersBlob from '../../assets/images/saf-renewal/supporters-blob.png';
import { callGetPublicSponsors } from '@api/sponsor/SponsorApi';
import { SponsorListItem } from '@interface/admin/Sponsor';

const assetSrc = (asset: string | { src?: string }) =>
  typeof asset === 'string' ? asset : asset.src ?? '';

/* Supporters 는 SPONSOR_TIER 의 'SUPPORTERS' 티어로 관리한다.
   설명/팝업 없이 로고 + 외부 website 링크만(클릭 시 새 탭). */
export default function SupportersPage() {
  const [supporters, setSupporters] = useState<SponsorListItem[]>([]);

  useEffect(() => {
    let active = true;
    callGetPublicSponsors(undefined, 'SUPPORTERS')
      .then((res) => {
        if (active) setSupporters(res?.item ?? []);
      })
      .catch(() => {
        if (active) setSupporters([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const editionYear = supporters[0]?.editionYear;
  const yearLabel = editionYear ? ` ${editionYear}` : '';

  return (
    <main className="mp-main">
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

      {/* organizer와 공통 class(.mp-blob): list(overflow:hidden) 밖 hero의 형제로 두어 잘리지 않게. */}
      <img className="mp-blob" src={assetSrc(SupportersBlob)} alt="" aria-hidden="true" />

      {/* media-partners .mp-body 와 동일한 배치/글꼴: 공통 class(mp-body, mp-heading) 사용 */}
      <section className="saf-renewal-sponsors saf-sponsors-list mp-body">
        <div className="saf-renewal-shell">
          <div className="saf-sponsors-intro">
            <h2 className="mp-heading">Supporters</h2>
            <p>
              The Seoul ADR Festival{yearLabel} is proud to be supported by leading arbitration
              institutions from around the world.
              <br />
              Their collaboration and promotion play a vital role in making this global
              gathering a success.
              <br />
              Please click on each logo to learn more about our valued supporters.
            </p>
          </div>
          <div className="saf-renewal-sponsor-row">
            <div className="saf-renewal-sponsor-title">
              <span>Supporting Organization</span>
            </div>
            <div className="saf-renewal-logo-grid">
              {supporters.map((supporter) => {
                const inner = supporter.logoFileUrl ? (
                  <img src={supporter.logoFileUrl} alt={supporter.companyName} loading="lazy" />
                ) : (
                  <figcaption className="saf-sponsor-name">{supporter.companyName}</figcaption>
                );
                return (
                  <figure className="saf-renewal-sponsor-logo" key={supporter.sponsorSeq}>
                    {supporter.websiteUrl ? (
                      <a
                        className="saf-supporter-link"
                        href={supporter.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={supporter.companyName}
                        title={supporter.companyName}
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
          </div>
        </div>
      </section>
    </main>
  );
}
