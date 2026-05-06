import React, { useEffect, useState } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import { callGetPublicFaqList } from '@api/faq/FaqApi';
import { callGetPublicPageList } from '@api/page/PageApi';
import { FaqItem } from '@interface/faq/FaqManagement';
import { PageListItem } from '@interface/page/PageManagement';

const PublicFaq: React.FC = () => {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    callGetPublicPageList().then((r) => { if (r?.item) setPages(r.item); });
    callGetPublicFaqList().then((r) => { if (r?.item) setFaqList(r.item); });
  }, []);

  const categories = Array.from(new Set(faqList.filter((f) => f.category).map((f) => f.category)));
  const filtered = faqList.filter((f) => f.useYn === 'Y' && (!activeCategory || f.category === activeCategory));

  const handleNavigate = (url: string) => { window.location.href = url; };

  return (
    <div className="pub-layout">
      <PublicHeader pages={pages} currentUrl="/faq" onNavigate={handleNavigate} />
      <main className="pub-page-content">
        <section className="pub-section section-hero size-small" style={{
          background: 'linear-gradient(135deg, #0f1b3d 0%, #294DC7 100%)',
        }}>
          <div className="hero-content">
            <h2 className="hero-title">FAQ</h2>
            <p className="hero-subtitle">자주 묻는 질문</p>
          </div>
        </section>

        <section className="pub-section section-text size-medium">
          <div className="pub-section-inner">
            {categories.length > 0 && (
              <div className="pub-faq-categories">
                <button
                  className={`pub-faq-cat-btn ${!activeCategory ? 'active' : ''}`}
                  onClick={() => setActiveCategory('')}
                >
                  전체
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`pub-faq-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="pub-faq-list">
              {filtered.map((faq, idx) => (
                <div key={faq.faqSeq ?? idx} className={`pub-faq-item ${openIdx === idx ? 'open' : ''}`}>
                  <div className="pub-faq-question" onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
                    <span className="pub-faq-q-mark">Q</span>
                    <span className="pub-faq-q-text">{faq.question}</span>
                    <span className="pub-faq-arrow">{openIdx === idx ? '−' : '+'}</span>
                  </div>
                  {openIdx === idx && (
                    <div className="pub-faq-answer">
                      <span className="pub-faq-a-mark">A</span>
                      <div className="pub-faq-a-text" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                  등록된 FAQ가 없습니다.
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

export default PublicFaq;
