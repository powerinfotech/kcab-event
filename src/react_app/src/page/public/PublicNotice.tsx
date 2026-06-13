import React, { useEffect, useMemo, useState } from 'react';
import { callGetPublicNoticeNewsDetail, callGetPublicNoticeNewsList } from '@api/noticenews/PublicNoticeNewsApi';
import { NoticeNewsDetail, NoticeNewsListItem } from '@interface/admin/NoticeNews';
import { usePublicNavigate } from '@hook/usePublicNavigate';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-notice.png';
import SeoulFallback from '../../assets/images/saf-renewal/0612/notice-card-sponsor.png';
import VenueFallback from '../../assets/images/saf-renewal/0612/notice-card-side-event.png';
import DetailFallback from '../../assets/images/saf-renewal/0612/notice-detail-hero.png';

type PublicNoticeProps = {
  noticeNewsSeq?: number | null;
};

const fallbackImages = [SeoulFallback, VenueFallback];
const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

export default function PublicNotice({ noticeNewsSeq }: PublicNoticeProps) {
  const [noticeList, setNoticeList] = useState<NoticeNewsListItem[]>([]);
  const [selected, setSelected] = useState<NoticeNewsDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = usePublicNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    callGetPublicNoticeNewsList()
      .then((res) => {
        if (!active) return;
        const list = res?.item ?? [];
        setNoticeList(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!noticeNewsSeq) {
      setSelected(null);
      return () => {
        active = false;
      };
    }
    setLoading(true);
    callGetPublicNoticeNewsDetail(noticeNewsSeq)
      .then((res) => {
        if (active) setSelected(res?.item ?? null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [noticeNewsSeq]);

  const selectedImage = useMemo(() => {
    if (!selected) return '';
    return assetSrc(DetailFallback);
  }, [selected]);

  if (noticeNewsSeq) {
    return (
      <main className="saf-subpage saf-notice-page">
        <PublicSubPageHero
          title="Contact"
          section="Contact"
          current="Notice & News"
          backgroundImage={HeroImage}
          className="is-contact"
        />
        <section className="saf-news-detail saf-subpage-body">
          <div className="saf-renewal-shell">
            <button type="button" className="saf-text-link" onClick={() => navigate('/notice')}>
              Back to Newsroom
            </button>
            {loading && !selected && <div className="saf-subpage-empty">Loading notice...</div>}
            {!loading && !selected && <div className="saf-subpage-empty">Notice not found.</div>}
            {selected && (
              <article className="saf-news-detail-grid">
                <aside className="saf-news-detail-meta">
                  <MetaBlock label="Issued" value={formatIssuedDate(selected.postDate)} />
                  <MetaBlock label="Source" value="SAF Secretariat" />
                  <MetaBlock label="Contact" value="saf@kcab.or.kr" asLink />
                </aside>
                <div className="saf-news-detail-main">
                  <h2>{selected.title}</h2>
                  <figure>
                    <img src={selectedImage} alt="" />
                    <figcaption>Image · 01 / {selected.postType === 'NOTICE' ? 'Notice' : 'Newsroom'}</figcaption>
                  </figure>
                  <div className="saf-news-detail-lead" dangerouslySetInnerHTML={{ __html: selected.content ?? '' }} />
                  <a className="saf-dark-action" href="mailto:saf@kcab.or.kr">
                    For More Information
                  </a>
                </div>
              </article>
            )}
            <div className="saf-news-detail-pager">
              <button type="button" onClick={() => navigate('/notice')}>Previous</button>
              <button type="button" onClick={() => navigate('/notice')}>Next</button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="saf-subpage saf-notice-page">
      <PublicSubPageHero
        title="Contact"
        section="Contact"
        current="Notice & News"
        backgroundImage={HeroImage}
        className="is-contact"
      />
      <section className="saf-news-list saf-subpage-body">
        <div className="saf-renewal-shell">
          <div className="saf-section-heading">
            <span>Newsroom</span>
            <h2>Notice & News</h2>
          </div>
          {loading && noticeList.length === 0 && <div className="saf-subpage-empty">Loading newsroom...</div>}
          {!loading && noticeList.length === 0 && <div className="saf-subpage-empty">No notices have been published yet.</div>}
          <div className="saf-news-grid">
            {noticeList.map((notice, index) => {
              const cardImage = assetSrc(fallbackImages[index % fallbackImages.length]);
              return (
                <article className="saf-news-card" key={notice.noticeNewsSeq}>
                  <button
                    type="button"
                    className="saf-news-card-image"
                    onClick={() => navigate(`/notice/${notice.noticeNewsSeq}`)}
                  >
                    <img src={cardImage} alt="" />
                    <span>{formatCardDate(notice.postDate)}</span>
                  </button>
                  <div className="saf-news-card-body">
                    <time>{formatCompactDate(notice.postDate)}</time>
                    <h3>{notice.title}</h3>
                    <p>{notice.postType === 'NOTICE' ? 'Important updates from the SAF Secretariat.' : 'Latest stories from Seoul ADR Festival.'}</p>
                    <button type="button" onClick={() => navigate(`/notice/${notice.noticeNewsSeq}`)}>
                      Read More
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function MetaBlock({ label, value, asLink = false }: { label: string; value: string; asLink?: boolean }) {
  return (
    <div>
      <span>{label}</span>
      {asLink ? <a href={`mailto:${value}`}>{value}</a> : <strong>{value}</strong>}
    </div>
  );
}

function parseDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value.includes('T') ? value : value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatIssuedDate(value?: string | null) {
  const date = parseDate(value);
  if (!date) return '-';
  return `${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${String(date.getDate()).padStart(2, '0')} // ${date.getFullYear()}`;
}

function formatCompactDate(value?: string | null) {
  const date = parseDate(value);
  if (!date) return '-';
  return `${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${String(date.getDate()).padStart(2, '0')} // ${date.getFullYear()}`;
}

function formatCardDate(value?: string | null) {
  const date = parseDate(value);
  if (!date) return '-';
  return `${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${date.getDate()}, ${date.getFullYear()}`;
}
