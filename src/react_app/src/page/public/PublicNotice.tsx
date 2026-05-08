import React, { useEffect, useState } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import { callGetPublicNoticeList, callGetPublicNoticeDetail } from '@api/notice/NoticeApi';
import { callGetPublicPageList } from '@api/page/PageApi';
import { NoticeListItem, NoticeDetail } from '@interface/notice/NoticeManagement';
import { PageListItem } from '@interface/page/PageManagement';

const PublicNotice: React.FC = () => {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [noticeList, setNoticeList] = useState<NoticeListItem[]>([]);
  const [selected, setSelected] = useState<NoticeDetail | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    callGetPublicPageList().then((r) => { if (r?.item) setPages(r.item); });
    callGetPublicNoticeList().then((r) => { if (r?.item) setNoticeList(r.item); });
  }, []);

  const handleSearch = () => {
    callGetPublicNoticeList(searchText).then((r) => { if (r?.item) setNoticeList(r.item); });
  };

  const handleSelect = async (seq: number) => {
    const res = await callGetPublicNoticeDetail(seq);
    if (res?.item) setSelected(res.item);
  };

  const handleBack = () => setSelected(null);

  const handleNavigate = (url: string) => { window.location.href = url; };

  if (selected) {
    return (
      <div className="pub-layout">
        <PublicHeader pages={pages} currentUrl="/notice" onNavigate={handleNavigate} />
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
                <span>{selected.rgstDateTime?.substring(0, 10)}</span>
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
      <PublicHeader pages={pages} currentUrl="/notice" onNavigate={handleNavigate} />
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
              {noticeList.filter((n) => n.useYn === 'Y').map((notice) => (
                <div
                  key={notice.noticeSeq}
                  className={`pub-notice-item ${notice.topYn === 'Y' ? 'is-top' : ''}`}
                  onClick={() => handleSelect(notice.noticeSeq)}
                >
                  {notice.topYn === 'Y' && <span className="pub-notice-badge">Notice</span>}
                  <span className="pub-notice-title">{notice.title}</span>
                  <span className="pub-notice-date">{notice.rgstDateTime?.substring(0, 10)}</span>
                  <span className="pub-notice-views">Views {notice.viewCount}</span>
                </div>
              ))}
              {noticeList.filter((n) => n.useYn === 'Y').length === 0 && (
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
