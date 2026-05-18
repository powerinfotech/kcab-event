'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { callGetOrganizationFaqList } from '@api/faq/FaqApi';
import { FaqItem } from '@interface/faq/FaqManagement';

export default function OrganizationFaq() {
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [openSeq, setOpenSeq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFaqList = async () => {
    setLoading(true);
    try {
      const res = await callGetOrganizationFaqList();
      setFaqList(res?.item ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqList();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqList.forEach((faq) => {
      if (faq.category) set.add(faq.category);
    });
    return Array.from(set);
  }, [faqList]);

  const filteredFaqList = faqList.filter((faq) => !activeCategory || faq.category === activeCategory);

  return (
    <section className="saf-screen saf-org-faq-screen">
      <div className="saf-screen-header">
        <div>
          <span className="saf-kicker">Support</span>
          <h1>FAQ</h1>
          <p>Frequently asked questions for organization users.</p>
        </div>
        <div className="saf-screen-actions">
          <button className="saf-action-btn" type="button" onClick={fetchFaqList} disabled={loading}>
            <ReloadOutlined />
            Refresh
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="saf-faq-category-tabs">
          <button
            className={!activeCategory ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveCategory('')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'is-active' : ''}
              type="button"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="saf-faq-list-card">
        {filteredFaqList.map((faq, index) => {
          const key = faq.faqSeq ?? index;
          const open = openSeq === key;
          return (
            <article key={key} className={`saf-faq-read-item ${open ? 'is-open' : ''}`}>
              <button type="button" onClick={() => setOpenSeq(open ? null : key)}>
                <span>Q</span>
                <strong>{faq.question}</strong>
                <em>{open ? '-' : '+'}</em>
              </button>
              {open && (
                <div className="saf-faq-read-answer">
                  <span>A</span>
                  <div>{faq.answer}</div>
                </div>
              )}
            </article>
          );
        })}
        {filteredFaqList.length === 0 && (
          <div className="saf-faq-empty">
            <QuestionCircleOutlined />
            <span>No FAQ found.</span>
          </div>
        )}
      </div>
    </section>
  );
}
