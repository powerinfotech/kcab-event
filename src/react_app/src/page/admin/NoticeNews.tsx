'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { App, DatePicker, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  PlusOutlined,
  PushpinOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  callCreateNoticeNews,
  callDeleteNoticeNews,
  callGetNoticeNewsDetail,
  callGetNoticeNewsList,
  callUpdateNoticeNews,
} from '@api/admin/NoticeNewsApi';
import { callGetFileList, callSaveFiles, UPLOAD_CONTEXT } from '@api/CommonApi';
import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
import CustomRichEditor from '@component/special/CustomRichEditor';
import {
  NOTICE_NEWS_POST_TYPE_LABEL,
  NOTICE_NEWS_POST_TYPE_TONE,
  NoticeNewsDetail,
  NoticeNewsListItem,
  NoticeNewsPostType,
  NoticeNewsSavePayload,
} from '@interface/admin/NoticeNews';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

type Mode = 'list' | 'edit';

const POST_TYPE_OPTIONS: { value: NoticeNewsPostType; label: string }[] = [
  { value: 'NOTICE', label: 'Notice' },
  { value: 'NEWS', label: 'News' },
];

const USE_YN_OPTIONS = [
  { value: 'Y', label: 'Published' },
  { value: 'N', label: 'Hidden' },
];

interface FormState {
  postType: NoticeNewsPostType;
  title: string;
  postDate: string;
  topYn: string;
  topStartDate: string;
  topEndDate: string;
  useYn: string;
  content: string;
  fileSeq: number | null;
}

const todayStr = (): string => dayjs().format('YYYY-MM-DD');

function toDayjs(value?: string | null): Dayjs | null {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d : null;
}

function fromDayjs(d: Dayjs | null): string {
  return d ? d.format('YYYY-MM-DD') : '';
}

const blankForm = (): FormState => ({
  postType: 'NOTICE',
  title: '',
  postDate: todayStr(),
  topYn: 'N',
  topStartDate: '',
  topEndDate: '',
  useYn: 'Y',
  content: '',
  fileSeq: null,
});

const formatDate = (value?: string | null): string => {
  if (!value) return '-';
  return value.length > 10 ? value.slice(0, 10) : value;
};

const formatDateTime = (value?: string | null): string => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const renderPostTypeChip = (postType: NoticeNewsPostType) => {
  const tone = NOTICE_NEWS_POST_TYPE_TONE[postType] ?? 'gray';
  const label = NOTICE_NEWS_POST_TYPE_LABEL[postType] ?? postType;
  return <span className={`saf-status is-${tone}`}>{label}</span>;
};

const isActiveTopPost = (item: NoticeNewsListItem): boolean => {
  const today = todayStr();
  return item.topYn === 'Y'
    && !!item.topStartDate
    && !!item.topEndDate
    && item.topStartDate <= today
    && today <= item.topEndDate;
};

export default function NoticeNews() {
  const { message, modal } = App.useApp();

  const [items, setItems] = useState<NoticeNewsListItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState<NoticeNewsPostType | ''>('');
  const [useYnFilter, setUseYnFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<Mode>('list');
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [detailMeta, setDetailMeta] = useState<NoticeNewsDetail | null>(null);
  const [attachments, setAttachments] = useState<FileDetailType[]>([]);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callGetNoticeNewsList({
        keyword: keyword.trim() || undefined,
        postType: postTypeFilter || undefined,
        useYn: useYnFilter || undefined,
      });
      setItems(res?.item ?? []);
    } catch {
      message.error('Failed to load Notice & News.');
    } finally {
      setLoading(false);
    }
  }, [keyword, postTypeFilter, useYnFilter, message]);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pagination = useClientGridPagination(items);

  const handleOpenNew = () => {
    setSelectedSeq(null);
    setDetailMeta(null);
    setForm(blankForm());
    setAttachments([]);
    setSubmitAttempted(false);
    setMode('edit');
  };

  const handleOpenEdit = async (row: NoticeNewsListItem) => {
    setLoading(true);
    try {
      const res = await callGetNoticeNewsDetail(row.noticeNewsSeq);
      const detail = res?.item;
      if (!detail) {
        message.warning('Notice/News was not found.');
        return;
      }
      setSelectedSeq(detail.noticeNewsSeq);
      setDetailMeta(detail);
      setForm({
        postType: detail.postType,
        title: detail.title,
        postDate: detail.postDate,
        topYn: detail.topYn || 'N',
        topStartDate: detail.topStartDate ?? '',
        topEndDate: detail.topEndDate ?? '',
        useYn: detail.useYn || 'Y',
        content: detail.content ?? '',
        fileSeq: detail.fileSeq ?? null,
      });
      if (detail.fileSeq) {
        try {
          const fileRes = await callGetFileList(detail.fileSeq);
          setAttachments((fileRes?.item as FileDetailType[]) ?? []);
        } catch {
          setAttachments([]);
        }
      } else {
        setAttachments([]);
      }
      setSubmitAttempted(false);
      setMode('edit');
    } catch {
      message.error('Failed to load Notice/News.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setMode('list');
    setSelectedSeq(null);
    setDetailMeta(null);
    setAttachments([]);
    setForm(blankForm());
    setSubmitAttempted(false);
  };

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isInvalid = (val: string) => submitAttempted && !val.trim();
  const titleInvalid = isInvalid(form.title);
  const postDateInvalid = submitAttempted && !form.postDate;
  const isTopPinned = form.topYn === 'Y';
  const topStartDateInvalid = submitAttempted && isTopPinned && !form.topStartDate;
  const topEndDateInvalid = submitAttempted && isTopPinned && !form.topEndDate;
  const topDateRangeInvalid = submitAttempted
    && isTopPinned
    && !!form.topStartDate
    && !!form.topEndDate
    && form.topStartDate > form.topEndDate;

  const validate = (): boolean => {
    if (!form.title.trim()) {
      message.warning('Please enter a title.');
      return false;
    }
    if (!form.postDate) {
      message.warning('Please pick a post date.');
      return false;
    }
    if (!form.postType) {
      message.warning('Please choose a post type.');
      return false;
    }
    if (isTopPinned) {
      if (!form.topStartDate || !form.topEndDate) {
        message.warning('Please pick both top start and end dates.');
        return false;
      }
      if (form.topStartDate > form.topEndDate) {
        message.warning('Top end date must be on or after top start date.');
        return false;
      }
    }
    return true;
  };

  const persist = async () => {
    setSaving(true);
    try {
      let resolvedFileSeq: number | null = form.fileSeq;
      if (attachments.some((f) => f.iudType)) {
        const res = await callSaveFiles(resolvedFileSeq, 0, attachments, UPLOAD_CONTEXT.NOTICE_NEWS_ATTACHMENT);
        const newSeq = res?.item?.fileSeq;
        if (newSeq) resolvedFileSeq = Number(newSeq);
        if (res?.item?.fileList) {
          setAttachments(res.item.fileList as FileDetailType[]);
        }
      }

      const payload: NoticeNewsSavePayload = {
        postType: form.postType,
        title: form.title.trim(),
        content: form.content ?? '',
        postDate: form.postDate,
        topYn: form.topYn || 'N',
        topStartDate: form.topYn === 'Y' ? form.topStartDate : null,
        topEndDate: form.topYn === 'Y' ? form.topEndDate : null,
        useYn: form.useYn || 'Y',
        fileSeq: resolvedFileSeq,
      };

      if (selectedSeq == null) {
        await callCreateNoticeNews(payload);
        message.success('Notice/News has been registered.');
      } else {
        await callUpdateNoticeNews(selectedSeq, payload);
        message.success('Notice/News has been saved.');
      }
      await fetchList();
      handleBackToList();
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message;
      message.error(backendMsg ? `Failed to save. (${backendMsg})` : 'Failed to save Notice/News.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!validate()) return;
    modal.confirm({
      title: selectedSeq == null ? 'Register Notice/News' : 'Save Notice/News',
      content:
        selectedSeq == null
          ? 'Do you want to register this post?'
          : 'Do you want to save changes?',
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk: persist,
    });
  };

  const handleDelete = () => {
    if (selectedSeq == null) return;
    modal.confirm({
      title: 'Delete Notice/News',
      content: 'Once deleted, this post will no longer be visible. Continue?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          await callDeleteNoticeNews(selectedSeq);
          message.success('Notice/News has been deleted.');
          await fetchList();
          handleBackToList();
        } catch (err: any) {
          const backendMsg = err?.response?.data?.message;
          message.error(backendMsg ? `Failed to delete. (${backendMsg})` : 'Failed to delete Notice/News.');
        }
      },
    });
  };

  if (mode === 'edit') {
    const isNew = selectedSeq == null;
    return (
      <div className="saf-screen saf-notice-news-screen">
        <header className="saf-screen-header">
          <div>
            <h1>{isNew ? 'New Notice / News' : 'Edit Notice / News'}</h1>
            <p>
              {isNew
                ? 'Create a new announcement or news post.'
                : `Last updated by ${detailMeta?.uptUserName ?? '-'} · ${formatDateTime(detailMeta?.uptDateTime)}`}
            </p>
          </div>
          <div className="saf-screen-actions">
            <button
              type="button"
              className="saf-action-btn is-secondary"
              onClick={handleBackToList}
              disabled={saving}
            >
              <ArrowLeftOutlined />
              <span>List</span>
            </button>
            {!isNew && (
              <button
                type="button"
                className="saf-action-btn is-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                <DeleteOutlined />
                <span>Delete</span>
              </button>
            )}
            <button
              type="button"
              className="saf-action-btn is-primary"
              onClick={handleSave}
              disabled={saving}
            >
              <SaveOutlined />
              <span>{isNew ? 'Register' : 'Save'}</span>
            </button>
          </div>
        </header>

        <div className="saf-notice-news-editor">
          <section className="saf-panel">
            <PanelTitle title="Basic Information" />
            <div className="saf-form-grid">
              <Field label="Post Type *">
                <select
                  value={form.postType}
                  onChange={(e) => updateForm('postType', e.target.value as NoticeNewsPostType)}
                  disabled={saving}
                >
                  {POST_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Post Date *" invalid={postDateInvalid}>
                <DatePicker
                  format="YYYY-MM-DD"
                  needConfirm={false}
                  style={{ width: '100%' }}
                  placeholder="Select post date"
                  value={toDayjs(form.postDate)}
                  onChange={(d) => updateForm('postDate', fromDayjs(d))}
                  disabled={saving}
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.useYn}
                  onChange={(e) => updateForm('useYn', e.target.value)}
                  disabled={saving}
                >
                  {USE_YN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pin to Top">
                <select
                  value={form.topYn}
                  onChange={(e) => {
                    const nextTopYn = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      topYn: nextTopYn,
                      topStartDate: nextTopYn === 'Y' ? prev.topStartDate : '',
                      topEndDate: nextTopYn === 'Y' ? prev.topEndDate : '',
                    }));
                  }}
                  disabled={saving}
                >
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </select>
              </Field>
              {isTopPinned && (
                <Field label="Top Start Date *" invalid={topStartDateInvalid || topDateRangeInvalid}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    needConfirm={false}
                    style={{ width: '100%' }}
                    placeholder="Select top start date"
                    value={toDayjs(form.topStartDate)}
                    onChange={(d) => updateForm('topStartDate', fromDayjs(d))}
                    disabled={saving}
                  />
                </Field>
              )}
              {isTopPinned && (
                <Field label="Top End Date *" invalid={topEndDateInvalid || topDateRangeInvalid}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    needConfirm={false}
                    style={{ width: '100%' }}
                    placeholder="Select top end date"
                    value={toDayjs(form.topEndDate)}
                    onChange={(d) => updateForm('topEndDate', fromDayjs(d))}
                    disabled={saving}
                  />
                </Field>
              )}
              <Field label="Title *" invalid={titleInvalid} wide>
                <input
                  value={form.title}
                  maxLength={500}
                  placeholder="Enter a title"
                  onChange={(e) => updateForm('title', e.target.value)}
                  disabled={saving}
                />
              </Field>
              <Field label="Attachments" wide>
                <div className="saf-thumbnail-uploader">
                  <CustomFile
                    fileList={attachments}
                    onFileListChange={setAttachments}
                    isEditable={!saving}
                  />
                  <p className="saf-hint-inline">Up to 5 files · max 30MB each · drag to reorder.</p>
                </div>
              </Field>
            </div>
          </section>

          <section className="saf-panel">
            <PanelTitle title="Content" subtitle="Rich text body shown on the post page." />
            <div className="saf-event-description-editor">
              <CustomRichEditor
                key={selectedSeq ?? 'new'}
                value={form.content}
                isEditable={!saving}
                onChange={(html) => updateForm('content', html)}
                placeholder="Write the announcement or news body."
                height={420}
                uploadContext={UPLOAD_CONTEXT.EDITOR_NOTICE_NEWS}
              />
            </div>
          </section>

          {!isNew && detailMeta && (
            <section className="saf-panel">
              <PanelTitle title="Audit" subtitle="Tracking information for this post." />
              <dl className="saf-participant-meta">
                <div><dt>View Count</dt><dd>{detailMeta.viewCount ?? 0}</dd></div>
                <div><dt>Created By</dt><dd>{detailMeta.rgstUserName ?? '-'}</dd></div>
                <div><dt>Created At</dt><dd>{formatDateTime(detailMeta.rgstDateTime)}</dd></div>
                <div><dt>Updated By</dt><dd>{detailMeta.uptUserName ?? '-'}</dd></div>
                <div><dt>Updated At</dt><dd>{formatDateTime(detailMeta.uptDateTime)}</dd></div>
              </dl>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="saf-screen saf-notice-news-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Notice &amp; News</h1>
          <p>Manage announcements (Notice) and news articles published on the site.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchList} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={handleOpenNew} disabled={loading}>
            <PlusOutlined />
            <span>New Post</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Search by title"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchList();
            }}
          />
        </div>
        <Select
          allowClear
          className="saf-filter-select"
          placeholder="Post Type"
          value={postTypeFilter || undefined}
          onChange={(value) => setPostTypeFilter((value as NoticeNewsPostType) ?? '')}
          options={POST_TYPE_OPTIONS}
        />
        <Select
          allowClear
          className="saf-filter-select"
          placeholder="Status"
          value={useYnFilter || undefined}
          onChange={(value) => setUseYnFilter(value ?? '')}
          options={USE_YN_OPTIONS}
        />
        <button type="button" onClick={fetchList}>Search</button>
      </section>

      <section className="saf-table-wrap">
        <table className="saf-table saf-notice-news-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Type</th>
              <th>Title</th>
              <th style={{ width: 130 }}>Post Date</th>
              <th style={{ width: 90 }}>Views</th>
              <th style={{ width: 90 }}>Files</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 140 }}>Author</th>
              <th style={{ width: 150 }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pagedItems.map((item) => (
              <tr key={item.noticeNewsSeq} onClick={() => handleOpenEdit(item)}>
                <td>{renderPostTypeChip(item.postType)}</td>
                <td className="saf-notice-news-title-cell">
                  {isActiveTopPost(item) && (
                    <span className="saf-notice-news-pin" title="Pinned">
                      <PushpinOutlined />
                    </span>
                  )}
                  <span>{item.title}</span>
                </td>
                <td>{formatDate(item.postDate)}</td>
                <td>
                  <span className="saf-muted-inline">
                    <EyeOutlined /> {item.viewCount ?? 0}
                  </span>
                </td>
                <td>
                  {item.attachmentCount > 0 ? (
                    <span className="saf-muted-inline">
                      <PaperClipOutlined /> {item.attachmentCount}
                    </span>
                  ) : (
                    <span className="saf-muted-text">-</span>
                  )}
                </td>
                <td>
                  <span className={`saf-status is-${item.useYn === 'Y' ? 'green' : 'gray'}`}>
                    {item.useYn === 'Y' ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>{item.rgstUserName || '-'}</td>
                <td>{formatDateTime(item.uptDateTime ?? item.rgstDateTime)}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={8} className="saf-participant-empty">
                  <FileTextOutlined />
                  <span>{loading ? 'Loading...' : 'No posts found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination {...pagination} />
      </section>
    </div>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="saf-panel-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
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
