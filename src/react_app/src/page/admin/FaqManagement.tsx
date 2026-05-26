'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { callGetFaqList, callSaveFaq } from '@api/faq/FaqApi';
import { FaqAudience, FaqItem } from '@interface/faq/FaqManagement';
import { IudType } from '@interface/common';
import AdminGridPagination from './AdminGridPagination';

type Mode = 'list' | 'detail';
type DetailFaq = FaqItem & { faqSeq?: number };

const AUDIENCE_OPTIONS: { value: FaqAudience | ''; label: string }[] = [
  { value: '', label: 'All audiences' },
  { value: 'public', label: 'Public FAQ' },
  { value: 'organization', label: 'Organization FAQ' },
];

const DETAIL_AUDIENCE_OPTIONS: { value: FaqAudience; label: string }[] = [
  { value: 'public', label: 'Public FAQ' },
  { value: 'organization', label: 'Organization FAQ' },
];

const CATEGORY_PRESETS = [
  'Registration',
  'Fees',
  'Event Information',
  'Attendance',
  'Updates',
  'Account',
  'Event Submission',
  'Event Page',
  'Approval',
  'Published Events',
  'Participants',
];

const USE_OPTIONS = [
  { value: 'Y', label: 'Published' },
  { value: 'N', label: 'Hidden' },
];

const DEFAULT_PAGE_SIZE = 10;

const audienceLabel: Record<FaqAudience, string> = {
  public: 'Public',
  organization: 'Organization',
};

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  return value.length > 16 ? value.slice(0, 16) : value;
};

const makeBlankFaq = (audience: FaqAudience, category: string, sortSeq: number): DetailFaq => ({
  audience,
  category,
  question: '',
  answer: '',
  sortSeq,
  useYn: 'Y',
});

export default function FaqManagement() {
  const { message, modal } = App.useApp();

  const [mode, setMode] = useState<Mode>('list');
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [detail, setDetail] = useState<DetailFaq | null>(null);
  const [audienceFilter, setAudienceFilter] = useState<FaqAudience | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const fetchFaqList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callGetFaqList();
      setFaqList((res?.item ?? []).map((item) => ({
        ...item,
        audience: item.audience || 'public',
        useYn: item.useYn || 'Y',
        sortSeq: item.sortSeq ?? 0,
      })));
    } catch {
      message.error('Failed to load FAQ.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchFaqList();
  }, [fetchFaqList]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>(CATEGORY_PRESETS);
    faqList.forEach((item) => {
      if (item.category?.trim()) categories.add(item.category.trim());
    });
    return Array.from(categories);
  }, [faqList]);

  const visibleRows = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return faqList.filter((item) => {
      if (audienceFilter && item.audience !== audienceFilter) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (!normalizedKeyword) return true;
      return [
        item.category,
        item.question,
        item.answer,
      ].some((value) => (value || '').toLowerCase().includes(normalizedKeyword));
    });
  }, [audienceFilter, categoryFilter, faqList, keyword]);

  const total = visibleRows.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const pageStart = total === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const pageEnd = Math.min(currentPage * pageSize, total);
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return visibleRows.slice(start, start + pageSize);
  }, [currentPage, pageSize, visibleRows]);

  useEffect(() => {
    setCurrentPage(1);
  }, [audienceFilter, categoryFilter, keyword]);

  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, maxPage]);

  const handlePageChange = (page: number, nextPageSize?: number) => {
    if (nextPageSize && nextPageSize !== pageSize) {
      setPageSize(nextPageSize);
      setCurrentPage(1);
      return;
    }
    setCurrentPage(page);
  };

  const nextSortSeq = (audience: FaqAudience) => {
    const maxSortSeq = faqList
      .filter((item) => item.audience === audience)
      .reduce((max, item) => Math.max(max, item.sortSeq ?? 0), 0);
    return maxSortSeq + 1;
  };

  const openNew = () => {
    const nextAudience: FaqAudience = audienceFilter || 'public';
    setDetail(makeBlankFaq(nextAudience, categoryFilter, nextSortSeq(nextAudience)));
    setSubmitAttempted(false);
    setMode('detail');
  };

  const openDetail = (row: FaqItem) => {
    setDetail({ ...row });
    setSubmitAttempted(false);
    setMode('detail');
  };

  const backToList = () => {
    setMode('list');
    setDetail(null);
    setSubmitAttempted(false);
  };

  const updateDetail = <K extends keyof DetailFaq>(field: K, value: DetailFaq[K]) => {
    setDetail((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const isInvalid = (value: string | undefined) => submitAttempted && !value?.trim();

  const validateDetail = () => {
    if (!detail) return false;
    return !!detail.audience
      && !!detail.category?.trim()
      && !!detail.question?.trim()
      && !!detail.answer?.trim();
  };

  const saveDetail = async () => {
    setSubmitAttempted(true);
    if (!detail) return;
    if (!validateDetail()) {
      message.warning('Please select audience and category, then enter question and answer.');
      return;
    }

    setSaving(true);
    try {
      const payload: FaqItem = {
        ...detail,
        category: detail.category.trim(),
        question: detail.question.trim(),
        answer: detail.answer.trim(),
        sortSeq: Number(detail.sortSeq) || 0,
        useYn: detail.useYn || 'Y',
        iudType: detail.faqSeq ? IudType.U : IudType.I,
      };
      const res = await callSaveFaq({ faqList: [payload] });
      if (res?.code === 200) {
        message.success('FAQ has been saved.');
        await fetchFaqList();
        backToList();
      }
    } catch {
      message.error('Failed to save FAQ.');
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = (row: FaqItem) => {
    if (!row.faqSeq) return;
    modal.confirm({
      title: 'Delete FAQ',
      content: 'Do you want to delete this FAQ?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        setSaving(true);
        try {
          const res = await callSaveFaq({ faqList: [{ ...row, iudType: IudType.D }] });
          if (res?.code === 200) {
            message.success('FAQ has been deleted.');
            await fetchFaqList();
            backToList();
          }
        } catch {
          message.error('Failed to delete FAQ.');
        } finally {
          setSaving(false);
        }
      },
    });
  };

  if (mode === 'detail' && detail) {
    const isNew = !detail.faqSeq;

    return (
      <section className="saf-screen saf-faq-admin-screen">
        <div className="saf-screen-header">
          <div>
            <span className="saf-kicker">Content</span>
            <h1>{isNew ? 'New FAQ' : 'FAQ Detail'}</h1>
            <p>{isNew ? 'Create a new FAQ item.' : 'Edit the selected FAQ item.'}</p>
          </div>
          <div className="saf-screen-actions">
            <button className="saf-action-btn" type="button" onClick={backToList} disabled={saving}>
              <ArrowLeftOutlined />
              List
            </button>
            {!isNew && (
              <button className="saf-action-btn is-danger" type="button" onClick={() => deleteFaq(detail)} disabled={saving}>
                <DeleteOutlined />
                Delete
              </button>
            )}
            <button className="saf-action-btn is-primary" type="button" onClick={saveDetail} disabled={saving}>
              <SaveOutlined />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <section className="saf-panel saf-form-panel">
          <div className="saf-panel-title">
            <h2>Basic Information</h2>
            <p>Choose where this FAQ appears and how it is ordered.</p>
          </div>
          <div className="saf-form-grid">
            <Field label="Audience *" invalid={submitAttempted && !detail.audience}>
              <select
                value={detail.audience}
                onChange={(event) => updateDetail('audience', event.target.value as FaqAudience)}
                disabled={saving}
              >
                {DETAIL_AUDIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Category *" invalid={isInvalid(detail.category)}>
              <select
                value={detail.category}
                onChange={(event) => updateDetail('category', event.target.value)}
                disabled={saving}
              >
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={detail.useYn}
                onChange={(event) => updateDetail('useYn', event.target.value)}
                disabled={saving}
              >
                {USE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Sort">
              <input
                type="number"
                value={detail.sortSeq}
                onChange={(event) => updateDetail('sortSeq', Number(event.target.value))}
                disabled={saving}
              />
            </Field>
            <Field label="Question *" invalid={isInvalid(detail.question)} wide>
              <textarea
                value={detail.question}
                onChange={(event) => updateDetail('question', event.target.value)}
                placeholder="Enter the question"
                rows={4}
                disabled={saving}
              />
            </Field>
            <Field label="Answer *" invalid={isInvalid(detail.answer)} wide>
              <textarea
                value={detail.answer}
                onChange={(event) => updateDetail('answer', event.target.value)}
                placeholder="Enter the answer."
                rows={8}
                disabled={saving}
              />
            </Field>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="saf-screen saf-faq-admin-screen">
      <div className="saf-screen-header">
        <div>
          <span className="saf-kicker">Content</span>
          <h1>FAQ Management</h1>
          <p>Search FAQ items in the list, then open a detail page to edit.</p>
        </div>
        <div className="saf-screen-actions">
          <button className="saf-action-btn" type="button" onClick={fetchFaqList} disabled={loading || saving}>
            <ReloadOutlined />
            Refresh
          </button>
          <button className="saf-action-btn is-primary" type="button" onClick={openNew} disabled={saving}>
            <PlusOutlined />
            New FAQ
          </button>
        </div>
      </div>

      <div className="saf-filter-row">
        <select
          className="saf-filter-select"
          value={audienceFilter}
          onChange={(event) => {
            setAudienceFilter(event.target.value as FaqAudience | '');
            setCategoryFilter('');
          }}
        >
          {AUDIENCE_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          className="saf-filter-select"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="">All categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <label className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search question, answer, or category..."
          />
        </label>
      </div>

      <div className="saf-faq-summary">
        <span>{visibleRows.length} FAQ(s)</span>
        <span><b>{audienceLabel.public}</b> is public. <b>{audienceLabel.organization}</b> is organization-only.</span>
      </div>

      <div className="saf-table-wrap saf-faq-table-wrap">
        <table className="saf-table saf-faq-table saf-faq-list-table">
          <thead>
            <tr>
              <th style={{ width: 130 }}>Audience</th>
              <th style={{ width: 160 }}>Category</th>
              <th>Question</th>
              <th>Answer</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 80 }}>Sort</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.faqSeq} onClick={() => openDetail(row)}>
                <td>
                  <span className={`saf-status is-${row.audience === 'public' ? 'blue' : 'green'}`}>
                    {audienceLabel[row.audience]}
                  </span>
                </td>
                <td>{row.category}</td>
                <td><strong>{row.question}</strong></td>
                <td className="saf-faq-answer-preview">{row.answer}</td>
                <td>
                  <span className={`saf-status is-${row.useYn === 'Y' ? 'green' : 'gray'}`}>
                    {row.useYn === 'Y' ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>{row.sortSeq}</td>
              </tr>
            ))}
            {total === 0 && (
              <tr>
                <td className="saf-user-empty" colSpan={6}>
                  <QuestionCircleOutlined />
                  <span>No FAQ found.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          pageStart={pageStart}
          pageEnd={pageEnd}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  invalid?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}

function Field({ label, invalid, wide, children }: FieldProps) {
  const required = label.endsWith(' *');
  const labelText = required ? label.slice(0, -2) : label;
  return (
    <label className={`saf-form-field${wide ? ' is-wide' : ''}${invalid ? ' is-invalid' : ''}`}>
      <span>
        {labelText}
        {required && <em className="saf-required-mark">*</em>}
      </span>
      {children}
    </label>
  );
}
