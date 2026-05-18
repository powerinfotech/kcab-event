import React, { useEffect, useState } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import { callGetPublicNoticeNewsList, callGetPublicNoticeNewsDetail } from '@api/noticenews/PublicNoticeNewsApi';
import {
  NOTICE_NEWS_POST_TYPE_LABEL,
  NoticeNewsDetail,
  NoticeNewsListItem,
} from '@interface/admin/NoticeNews';

const PublicNotice: React.FC = () => {
  const [noticeList, setNoticeList] = useState<NoticeNewsListItem[]>([]);
  const [selected, setSelected] = useState<NoticeNewsDetail | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    callGetPublicNoticeNewsList().then((r) => { if (r?.item) setNoticeList(r.item); });
  }, []);

  const handleSearch = () => {
    callGetPublicNoticeNewsList({ keyword: searchText }).then((r) => { if (r?.item) setNoticeList(r.item); });
  };

  const handleSelect = async (seq: number) => {
    const res = await callGetPublicNoticeNewsDetail(seq);
    if (res?.item) setSelected(res.item);
  };

  const handleBack = () => setSelected(null);

  const handleNavigate = (url: string) => { window.location.href = url; };

  if (selected) {
    return (
      <div className="pub-layout">
        <PublicHeader currentUrl="/notice" onNavigate={handleNavigate} />
        <main className="pub-page-content">
          <section className="pub-section section-text size-medium">
            <div className="pub-section-inner">
              <div style={{ marginBottom: 24 }}>
                <button onClick={handleBack} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, color: '#294DC7', padding: 0,
                }}>
                  &larr; Back to list
                </button>
              </div>
              <h3 className="text-title" style={{ paddingLeft: 0 }}>{selected.title}</h3>
              <div style={{ fontSize: 13, color: '#999', marginBottom: 24, display: 'flex', gap: 16 }}>
                <span>{selected.postDate?.substring(0, 10)}</span>
                <span>{NOTICE_NEWS_POST_TYPE_LABEL[selected.postType]}</span>
                <span>Views {selected.viewCount}</span>
              </div>
              <div className="text-content" dangerouslySetInnerHTML={{ __html: selected.content ?? '' }} />
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="pub-layout">
      <PublicHeader currentUrl="/notice" onNavigate={handleNavigate} />
      <main className="pub-page-content">
        <section className="pub-section section-hero size-small" style={{
          background: 'linear-gradient(135deg, #0f1b3d 0%, #294DC7 100%)',
        }}>
          <div className="hero-content">
            <h2 className="hero-title">Notices</h2>
          </div>
        </section>

        <section className="pub-section section-text size-medium">
          <div className="pub-section-inner">
            <div className="pub-search-bar" style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter a search term"
                className="pub-search-input"
              />
              <button onClick={handleSearch} className="pub-search-btn">Search</button>
            </div>

            <div className="pub-notice-list">
              {noticeList.map((notice) => (
                <div
                  key={notice.noticeNewsSeq}
                  className={`pub-notice-item ${notice.topYn === 'Y' ? 'is-top' : ''}`}
                  onClick={() => handleSelect(notice.noticeNewsSeq)}
                >
                  <span className="pub-notice-badge">{NOTICE_NEWS_POST_TYPE_LABEL[notice.postType]}</span>
                  <span className="pub-notice-title">{notice.title}</span>
                  <span className="pub-notice-date">{notice.postDate?.substring(0, 10)}</span>
                  <span className="pub-notice-views">Views {notice.viewCount}</span>
                </div>
              ))}
              {noticeList.length === 0 && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                  No notices found.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicNotice;
