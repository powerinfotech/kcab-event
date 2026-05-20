'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { App, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  NotificationOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { callGetPopupList, callSavePopup } from '@api/popup/PopupApi';
import { PopupItem, PopupStatus } from '@interface/popup/PopupManagement';
import { IudType } from '@interface/common';
import CustomRichEditor from '@component/special/CustomRichEditor';
import MainPopupWindowLauncher from '@component/popup/MainPopupWindowLauncher';
import AdminGridPagination from './AdminGridPagination';

function toDayjs(value?: string | null): Dayjs | null {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d : null;
}

function fromDayjs(d: Dayjs | null): string | null {
  return d ? d.format('YYYY-MM-DDTHH:mm:ss') : null;
}

function formatDateRange(start?: string | null, end?: string | null): string {
  const s = toDayjs(start);
  const e = toDayjs(end);
  if (!s && !e) return 'Always';
  const fmt = 'YYYY-MM-DD HH:mm';
  return `${s ? s.format(fmt) : '-'} ~ ${e ? e.format(fmt) : '-'}`;
}

type Mode = 'list' | 'detail';
type DetailPopup = PopupItem;

const STATUS_OPTIONS: { value: PopupStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

const DETAIL_STATUS_OPTIONS: { value: PopupStatus; label: string }[] = [
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

const DEFAULT_PAGE_SIZE = 10;

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  return value.length > 16 ? value.slice(0, 16) : value;
};

const makeBlankPopup = (sortSeq: number): DetailPopup => ({
  title: '',
  content: '',
  status: 'hidden',
  sortSeq,
  startAt: null,
  endAt: null,
});

export default function PopupManagement() {
  const { message, modal } = App.useApp();

  const [mode, setMode] = useState<Mode>('list');
  const [popupList, setPopupList] = useState<PopupItem[]>([]);
  const [detail, setDetail] = useState<DetailPopup | null>(null);
  const [statusFilter, setStatusFilter] = useState<PopupStatus | ''>('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const fetchPopupList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callGetPopupList();
      setPopupList((res?.item ?? []).map((item) => ({
        ...item,
        status: (item.status as PopupStatus) || 'hidden',
        sortSeq: item.sortSeq ?? 0,
      })));
    } catch {
      message.error('Failed to load popups.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchPopupList();
  }, [fetchPopupList]);

  const visibleRows = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return popupList.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (!normalizedKeyword) return true;
      return [item.title, item.content]
        .some((value) => (value || '').toLowerCase().includes(normalizedKeyword));
    });
  }, [popupList, statusFilter, keyword]);

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
  }, [statusFilter, keyword]);

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

  const nextSortSeq = () => {
    const maxSortSeq = popupList.reduce((max, item) => Math.max(max, item.sortSeq ?? 0), 0);
    return maxSortSeq + 1;
  };

  const openNew = () => {
    setDetail(makeBlankPopup(nextSortSeq()));
    setSubmitAttempted(false);
    setMode('detail');
  };

  const openDetail = (row: PopupItem) => {
    setDetail({ ...row });
    setSubmitAttempted(false);
    setMode('detail');
  };

  const backToList = () => {
    setMode('list');
    setDetail(null);
    setSubmitAttempted(false);
    setPreviewOpen(false);
  };

  const updateDetail = <K extends keyof DetailPopup>(field: K, value: DetailPopup[K]) => {
    setDetail((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const isInvalid = (value: string | undefined) => submitAttempted && !value?.trim();

  const validateDetail = () => {
    if (!detail) return false;
    return !!detail.title?.trim();
  };

  const handleOpenPreview = () => {
    if (!detail) return;
    if (!detail.title?.trim()) {
      message.info('Enter a title to preview.');
      return;
    }
    setPreviewKey((prev) => prev + 1);
    setPreviewOpen(true);
  };

  const saveDetail = async () => {
    setSubmitAttempted(true);
    if (!detail) return;
    if (!validateDetail()) {
      message.warning('Please enter the popup title.');
      return;
    }

    setSaving(true);
    try {
      const payload: PopupItem = {
        ...detail,
        title: detail.title.trim(),
        content: detail.content ?? '',
        status: detail.status || 'hidden',
        sortSeq: Number(detail.sortSeq) || 0,
        startAt: detail.startAt || null,
        endAt: detail.endAt || null,
        iudType: detail.popupSeq ? IudType.U : IudType.I,
      };
      const res = await callSavePopup({ popupList: [payload] });
      if (res?.code === 200) {
        message.success('Popup has been saved.');
        await fetchPopupList();
        backToList();
      }
    } catch {
      message.error('Failed to save popup.');
    } finally {
      setSaving(false);
    }
  };

  const deletePopup = (row: PopupItem) => {
    if (!row.popupSeq) return;
    modal.confirm({
      title: 'Delete Popup',
      content: 'Do you want to delete this popup?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        setSaving(true);
        try {
          const res = await callSavePopup({ popupList: [{ ...row, iudType: IudType.D }] });
          if (res?.code === 200) {
            message.success('Popup has been deleted.');
            await fetchPopupList();
            backToList();
          }
        } catch {
          message.error('Failed to delete popup.');
        } finally {
          setSaving(false);
        }
      },
    });
  };

  if (mode === 'detail' && detail) {
    const isNew = !detail.popupSeq;

    return (
      <section className="saf-screen saf-popup-admin-screen">
        <div className="saf-screen-header">
          <div>
            <span className="saf-kicker">Content</span>
            <h1>{isNew ? 'New Popup' : 'Popup Detail'}</h1>
            <p>{isNew ? 'Create a new popup that appears on the main page.' : 'Edit the selected popup.'}</p>
          </div>
          <div className="saf-screen-actions">
            <button className="saf-action-btn" type="button" onClick={backToList} disabled={saving}>
              <ArrowLeftOutlined />
              List
            </button>
            <button className="saf-action-btn" type="button" onClick={handleOpenPreview} disabled={saving}>
              <EyeOutlined />
              Preview
            </button>
            {!isNew && (
              <button className="saf-action-btn is-danger" type="button" onClick={() => deletePopup(detail)} disabled={saving}>
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

        <div className="saf-popup-detail-grid">
        <section className="saf-panel saf-form-panel">
          <div className="saf-panel-title">
            <h2>Basic Information</h2>
            <p>Title is required. Status decides whether it is shown on the main page.</p>
          </div>
          <div className="saf-form-grid">
            <Field label="Title *" invalid={isInvalid(detail.title)} wide>
              <input
                type="text"
                value={detail.title}
                maxLength={500}
                placeholder="Enter popup title"
                onChange={(event) => updateDetail('title', event.target.value)}
                disabled={saving}
              />
            </Field>
            <Field label="Status">
              <select
                value={detail.status}
                onChange={(event) => updateDetail('status', event.target.value as PopupStatus)}
                disabled={saving}
              >
                {DETAIL_STATUS_OPTIONS.map((option) => (
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
            <Field label="Display Start Date">
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                minuteStep={5}
                needConfirm={false}
                style={{ width: '100%' }}
                value={toDayjs(detail.startAt)}
                disabled={saving}
                onChange={(d) => updateDetail('startAt', fromDayjs(d))}
                placeholder="Empty = show immediately"
              />
            </Field>
            <Field label="Display End Date">
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                minuteStep={5}
                needConfirm={false}
                style={{ width: '100%' }}
                value={toDayjs(detail.endAt)}
                disabled={saving}
                onChange={(d) => updateDetail('endAt', fromDayjs(d))}
                placeholder="Empty = no end"
              />
            </Field>
          </div>
        </section>

        <section className="saf-panel">
          <div className="saf-panel-title">
            <h2>Content</h2>
            <p>Rich-text body shown inside the popup.</p>
          </div>
          <div className="saf-event-description-editor saf-popup-content-editor">
            <CustomRichEditor
              key={detail.popupSeq ?? 'new'}
              value={detail.content ?? ''}
              isEditable={!saving}
              onChange={(html) => updateDetail('content', html)}
              placeholder="Write the popup body."
              height={360}
            />
          </div>
        </section>
        </div>

        {previewOpen && (
          <MainPopupWindowLauncher
            key={previewKey}
            popups={[detail]}
            showDismissToday={false}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </section>
    );
  }

  return (
    <section className="saf-screen saf-popup-admin-screen">
      <div className="saf-screen-header">
        <div>
          <span className="saf-kicker">Content</span>
          <h1>Popup Management</h1>
          <p>Manage popups that appear on the public main page.</p>
        </div>
        <div className="saf-screen-actions">
          <button className="saf-action-btn" type="button" onClick={fetchPopupList} disabled={loading || saving}>
            <ReloadOutlined />
            Refresh
          </button>
          <button className="saf-action-btn is-primary" type="button" onClick={openNew} disabled={saving}>
            <PlusOutlined />
            New Popup
          </button>
        </div>
      </div>

      <div className="saf-filter-row">
        <select
          className="saf-filter-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as PopupStatus | '')}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value}>{option.label}</option>
          ))}
        </select>
        <label className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search title or content..."
          />
        </label>
      </div>

      <div className="saf-faq-summary">
        <span>{visibleRows.length} popup(s)</span>
        <span><b>Published</b> popups appear on the main page until users dismiss them.</span>
      </div>

      <div className="saf-table-wrap saf-faq-table-wrap">
        <table className="saf-table saf-faq-table saf-faq-list-table">
          <thead>
            <tr>
              <th>Title</th>
              <th style={{ width: 120 }}>Status</th>
              <th style={{ width: 80 }}>Sort</th>
              <th style={{ width: 260 }}>Display Period</th>
              <th style={{ width: 160 }}>Updated</th>
              <th style={{ width: 120 }} />
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.popupSeq} onClick={() => openDetail(row)}>
                <td><strong>{row.title}</strong></td>
                <td>
                  <span className={`saf-status is-${row.status === 'published' ? 'green' : 'gray'}`}>
                    {row.status === 'published' ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>{row.sortSeq}</td>
                <td>{formatDateRange(row.startAt, row.endAt)}</td>
                <td>{formatDateTime(row.updatedAt)}</td>
                <td onClick={(event) => event.stopPropagation()}>
                  <button
                    className="saf-table-icon-btn"
                    type="button"
                    onClick={() => openDetail(row)}
                    title="Edit popup"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    className="saf-table-icon-btn is-danger"
                    type="button"
                    onClick={() => deletePopup(row)}
                    title="Delete popup"
                  >
                    <DeleteOutlined />
                  </button>
                </td>
              </tr>
            ))}
            {total === 0 && (
              <tr>
                <td className="saf-user-empty" colSpan={6}>
                  <NotificationOutlined />
                  <span>No popups yet.</span>
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
