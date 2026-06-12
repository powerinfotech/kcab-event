'use client';

import React, { useEffect, useMemo, useState } from 'react';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';
import SponsorsHeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import SponsorsBlob from '../../assets/images/saf-renewal/sponsors-blob.png';
import { callGetPublicSponsors } from '@api/sponsor/SponsorApi';
import { SponsorListItem } from '@interface/admin/Sponsor';

const assetSrc = (asset: string | { src?: string }) =>
  typeof asset === 'string' ? asset : asset.src ?? '';

/* SPONSOR_TIER 공통코드 → 공개 페이지 표기 (Figma sub01_Sponsors 등급/순서).
   여기 정의된 5개 티어는 항상 노출하고, 등록된 스폰서를 그 아래에 채운다. */
const TIER_DISPLAY: { code: string; title: string }[] = [
  { code: 'WELCOME_RECEPTION', title: 'Welcome Reception Sponsor' },
  { code: 'PLATINUM', title: 'Platinum Sponsors' },
  { code: 'GOLD', title: 'Gold Sponsor' },
  { code: 'SILVER', title: 'Silver Sponsors' },
  { code: 'SPECIAL', title: 'Special Sponsor' },
];

const htmlHasContent = (html?: string | null): boolean => {
  if (!html) return false;
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text.length > 0 || /<(img|iframe|video|embed|source)\b/i.test(html);
};

interface SelectedSponsor {
  sponsor: SponsorListItem;
  tierTitle: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<SponsorListItem[]>([]);
  const [selected, setSelected] = useState<SelectedSponsor | null>(null);

  useEffect(() => {
    let active = true;
    callGetPublicSponsors()
      .then((res) => {
        if (active) setSponsors(res?.item ?? []);
      })
      .catch(() => {
        if (active) setSponsors([]);
      });
    return () => {
      active = false;
    };
  }, []);

  // 모달 열림 동안 ESC 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  const groups = useMemo(() => {
    const byTier: Record<string, SponsorListItem[]> = {};
    sponsors.forEach((sponsor) => {
      (byTier[sponsor.tierCd] = byTier[sponsor.tierCd] ?? []).push(sponsor);
    });
    Object.values(byTier).forEach((list) =>
      list.sort((a, b) => (a.sortSeq ?? 0) - (b.sortSeq ?? 0)),
    );
    // 5개 티어(Welcome Reception / Platinum / Gold / Silver / Special)는 항상 노출.
    return TIER_DISPLAY.map((tier) => ({
      code: tier.code,
      title: tier.title,
      logos: byTier[tier.code] ?? [],
    }));
  }, [sponsors]);

  const editionYear = sponsors[0]?.editionYear;
  const yearLabel = editionYear ? ` ${editionYear}` : '';

  // 팝업으로 보여줄 상세가 있으면(설명/대표인사말/웹사이트) 클릭 가능
  const hasDetail = (s: SponsorListItem) =>
    htmlHasContent(s.description) || htmlHasContent(s.representativeRemarks) || !!s.websiteUrl;

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

      {/* organizer와 공통 class(.mp-blob): list(overflow:hidden) 밖 hero의 형제로 두어 잘리지 않게. */}
      <img className="mp-blob" src={assetSrc(SponsorsBlob)} alt="" aria-hidden="true" />

      {/* media-partners .mp-body 와 동일한 배치/글꼴: 공통 class(mp-body, mp-heading) 사용 */}
      <section className="saf-renewal-sponsors saf-sponsors-list mp-body">
        <div className="saf-renewal-shell">
          <div className="saf-sponsors-intro">
            <h2 className="mp-heading">Sponsors</h2>
            <p>
              We are delighted to recognize and collaborate with our esteemed sponsors for the
              Seoul ADR Festival{yearLabel}.
              <br />
              Click on each sponsor logo to explore more about their work and contributions.
              <br />
              Our deepest appreciation goes to all sponsors and partners whose generous support
              makes SAF{yearLabel} possible.
            </p>
          </div>
          {groups.map((group) => (
            <div className="saf-renewal-sponsor-row" key={group.code}>
              <div className="saf-renewal-sponsor-title">
                <span>{group.title}</span>
              </div>
              <div className="saf-renewal-logo-grid">
                {group.logos.map((logo) => {
                  const clickable = hasDetail(logo);
                  return (
                    <figure
                      className={`saf-renewal-sponsor-logo${clickable ? ' is-clickable' : ''}`}
                      key={logo.sponsorSeq}
                      role={clickable ? 'button' : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onClick={clickable ? () => setSelected({ sponsor: logo, tierTitle: group.title }) : undefined}
                      onKeyDown={
                        clickable
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelected({ sponsor: logo, tierTitle: group.title });
                              }
                            }
                          : undefined
                      }
                    >
                      {logo.logoFileUrl ? (
                        <img src={logo.logoFileUrl} alt={logo.companyName} loading="lazy" />
                      ) : (
                        <figcaption className="saf-sponsor-name">{logo.companyName}</figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <SponsorModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}

function SponsorModal({ entry, onClose }: { entry: SelectedSponsor; onClose: () => void }) {
  const { sponsor, tierTitle } = entry;
  const showDesc = htmlHasContent(sponsor.description);
  const showRemarks = htmlHasContent(sponsor.representativeRemarks);

  return (
    <div className="saf-sponsor-modal-overlay" onClick={onClose}>
      <div
        className="saf-sponsor-modal"
        role="dialog"
        aria-modal="true"
        aria-label={sponsor.companyName}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="saf-sponsor-modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="saf-sponsor-modal-tier">{tierTitle}</div>

        <div className="saf-sponsor-modal-body">
          <div className="saf-sponsor-modal-head">
            {sponsor.logoFileUrl && (
              <div className="saf-sponsor-modal-logo">
                <img src={sponsor.logoFileUrl} alt={sponsor.companyName} />
              </div>
            )}
            <h2 className="saf-sponsor-modal-name">{sponsor.companyName}</h2>
          </div>

          {showDesc && (
            <div
              className="saf-sponsor-modal-desc"
              dangerouslySetInnerHTML={{ __html: sponsor.description ?? '' }}
            />
          )}

          {showRemarks && (
            <div className="saf-sponsor-modal-remarks">
              <h3>Representative&apos;s Remarks</h3>
              <div
                className="saf-sponsor-modal-remarks-body"
                dangerouslySetInnerHTML={{ __html: sponsor.representativeRemarks ?? '' }}
              />
            </div>
          )}

          {sponsor.websiteUrl && (
            <div className="saf-sponsor-modal-footer">
              <a
                className="saf-sponsor-modal-link"
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
