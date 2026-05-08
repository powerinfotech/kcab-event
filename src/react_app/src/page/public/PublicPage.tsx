import React, { useEffect, useState } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import SectionRenderer from './components/SectionRenderer';
import { callGetPublicPageList, callGetPublicPageDetail } from '@api/page/PageApi';
import { PageListItem, PageDetail } from '@interface/page/PageManagement';

interface PublicPageProps {
  pageUrl: string;
}

const PublicPage: React.FC<PublicPageProps> = ({ pageUrl }) => {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [pageDetail, setPageDetail] = useState<PageDetail | null>(null);
  const [currentUrl, setCurrentUrl] = useState(pageUrl);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callGetPublicPageList().then((res) => {
      if (res?.item) setPages(res.item);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    callGetPublicPageDetail(currentUrl).then((res) => {
      setPageDetail(res?.item ?? null);
      setLoading(false);
      window.scrollTo(0, 0);
    }).catch(() => {
      setPageDetail(null);
      setLoading(false);
    });
  }, [currentUrl]);

  useEffect(() => {
    if (pageDetail?.pageTitle) {
      document.title = pageDetail.pageTitle;
    }
  }, [pageDetail]);

  const handleNavigate = (url: string) => {
    setCurrentUrl(url);
    window.history.pushState(null, '', url);
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentUrl(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeSections = (pageDetail?.sections ?? []).filter((s) => s.useYn === 'Y');

  return (
    <div className="pub-layout">
      <PublicHeader pages={pages} currentUrl={currentUrl} onNavigate={handleNavigate} />

      <main className="pub-page-content">
        {loading && (
          <div style={{ padding: '120px 0', textAlign: 'center', color: '#999' }}>
            Loading...
          </div>
        )}

        {!loading && !pageDetail && (
          <div style={{ padding: '120px 0', textAlign: 'center', color: '#999' }}>
            Page not found.
          </div>
        )}

        {!loading && pageDetail && activeSections.map((section, i) => (
          <SectionRenderer key={section.sectionSeq ?? i} section={section} />
        ))}
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicPage;
