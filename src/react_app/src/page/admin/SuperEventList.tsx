'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { Address } from 'react-daum-postcode';
import CustomRichEditor from '@component/special/CustomRichEditor';
import CustomAddressSearchModal from '@component/special/CustomAddressSearchModal';
import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
import { callGetFileList, callSaveFiles } from '@api/CommonApi';
import {
  callDeleteEvent,
  callGetEventDetail,
  callGetEventList,
  callSaveEvent,
} from '@api/event/EventApi';
import {
  EVENT_STATUS_LABELS,
  EVENT_STATUS_TONE,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_TONE,
  EventDetail,
  EventListItem,
  EventSaveRequest,
} from '@interface/event/EventManagement';

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TYPE_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Types' },
  { value: 'main', label: 'Official' },
  { value: 'side', label: 'Side Event' },
];

const TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'main', label: 'Official' },
  { value: 'side', label: 'Side Event' },
];

const URL_REGEXP = /^(https?:\/\/)[^\s]+$/i;

const emptyDetail: EventDetail = {
  eventSeq: 0,
  title: '',
  content: '',
  summary: '',
  thumbnailUrl: '',
  eventStartDt: '',
  eventEndDt: '',
  registrationStartDt: '',
  registrationEndDt: '',
  location: '',
  postalCode: '',
  venueAddress: '',
  addressDetail: '',
  registrationUrl: '',
  status: 'published',
  useYn: 'Y',
  fileSeq: null,
  attachmentFileSeq: null,
  eventType: 'main',
  organizationSeq: null,
  organizationName: '',
  maxParticipants: null,
  isPaid: false,
  rgstUserSeq: 0,
  rgstDateTime: '',
  uptDateTime: '',
};

/** ISO LocalDateTime ("2026-09-10T14:00:00...") → datetime-local input value ("2026-09-10T14:00") */
function toDateTimeLocal(value?: string | null): string {
  if (!value) return '';
  // 백엔드는 LocalDateTime → "2026-09-10T14:00:00" 형식. 또는 timestamptz 직렬화 시 "2026-09-10T14:00:00+09:00".
  // 둘 다 첫 16자가 "YYYY-MM-DDTHH:MM" 형태이므로 잘라내면 input value 로 사용 가능.
  return value.slice(0, 16);
}

/** datetime-local 입력값 ("2026-09-10T14:00") → 백엔드로 보낼 ISO LocalDateTime ("2026-09-10T14:00:00") */
function toIsoDateTime(value?: string | null): string {
  if (!value) return '';
  return value.length === 16 ? `${value}:00` : value;
}

/** 목록 테이블의 일자 표시 (MM.DD) — datetime/date 모두 처리 */
function formatMonthDay(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}.${dd}`;
}

export default function SuperEventList() {
  const { message, modal } = App.useApp();
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [eventType, setEventType] = useState('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<'list' | 'detail'>('list');
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [form, setForm] = useState<EventDetail>(emptyDetail);
  const [thumbnailFiles, setThumbnailFiles] = useState<FileDetailType[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<FileDetailType[]>([]);
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isNew = selectedSeq === null;
  const titleValue = form.title.trim();
  const startValue = form.eventStartDt?.trim() ?? '';
  const endValue = form.eventEndDt?.trim() ?? '';
  const regStartValue = form.registrationStartDt?.trim() ?? '';
  const regEndValue = form.registrationEndDt?.trim() ?? '';
  const registrationUrlValue = form.registrationUrl?.trim() ?? '';
  const postalCodeValue = form.postalCode?.trim() ?? '';
  const venueAddressValue = form.venueAddress?.trim() ?? '';
  const isRequiredEmpty = (value?: string | null) => submitAttempted && !value?.toString().trim();
  const isDateRangeInvalid = submitAttempted && !!startValue && !!endValue && startValue > endValue;
  const isRegRangeInvalid = submitAttempted && !!regStartValue && !!regEndValue && regStartValue > regEndValue;
  const isRegAfterEventInvalid = submitAttempted && !!regEndValue && !!startValue && regEndValue > startValue;
  const isUrlInvalid = submitAttempted && !!registrationUrlValue && !URL_REGEXP.test(registrationUrlValue);

  const selectedSummary = useMemo(
    () => events.find((event) => event.eventSeq === selectedSeq),
    [selectedSeq, events],
  );

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await callGetEventList({
        keyword: keyword.trim() || undefined,
        status: status || undefined,
        eventType: eventType || undefined,
      });
      setEvents(res?.item ?? []);
    } catch (err) {
      message.error('Failed to load event list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (eventSeq: number) => {
    setLoading(true);
    try {
      const res = await callGetEventDetail(eventSeq);
      const detail = res?.item ?? null;
      setForm({ ...emptyDetail, ...(detail ?? {}) });
      setSelectedSeq(eventSeq);
      setSubmitAttempted(false);
      setMode('detail');

      // 썸네일 파일 로드
      const fileSeq = detail?.fileSeq ?? null;
      if (fileSeq) {
        try {
          const fileRes = await callGetFileList(fileSeq);
          setThumbnailFiles(fileRes?.item ?? []);
        } catch {
          setThumbnailFiles([]);
        }
      } else {
        setThumbnailFiles([]);
      }

      // 일반 첨부파일 로드
      const attSeq = detail?.attachmentFileSeq ?? null;
      if (attSeq) {
        try {
          const attRes = await callGetFileList(attSeq);
          setAttachmentFiles(attRes?.item ?? []);
        } catch {
          setAttachmentFiles([]);
        }
      } else {
        setAttachmentFiles([]);
      }
    } catch (err) {
      message.error('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateForm = <K extends keyof EventDetail>(key: K, value: EventDetail[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressComplete = (data: Address) => {
    setForm((prev) => ({
      ...prev,
      postalCode: data.zonecode ?? '',
      venueAddress: data.roadAddress || data.jibunAddress || '',
    }));
    setAddrModalOpen(false);
  };

  const validateForm = () => {
    if (!titleValue) {
      message.warning('Please enter the event name.');
      return false;
    }
    if (!form.eventType) {
      message.warning('Please select the event type.');
      return false;
    }
    if (!startValue || !endValue) {
      message.warning('Please enter the start and end dates.');
      return false;
    }
    if (startValue > endValue) {
      message.warning('End date/time must be on or after the start date/time.');
      return false;
    }
    // 참가신청 일시 검증 (입력은 선택사항이지만 입력 시 짝/순서 체크)
    if ((regStartValue && !regEndValue) || (!regStartValue && regEndValue)) {
      message.warning('Please enter both registration start and end date/time.');
      return false;
    }
    if (regStartValue && regEndValue && regStartValue > regEndValue) {
      message.warning('Registration end must be on or after registration start.');
      return false;
    }
    if (regEndValue && startValue && regEndValue > startValue) {
      message.warning('Registration must close on or before the event start.');
      return false;
    }
    if (registrationUrlValue && !URL_REGEXP.test(registrationUrlValue)) {
      message.warning('Please enter a valid registration URL.');
      return false;
    }
    if (form.maxParticipants !== null && form.maxParticipants !== undefined && form.maxParticipants < 0) {
      message.warning('Max participants must be 0 or greater.');
      return false;
    }
    return true;
  };

  const buildSaveParam = (fileSeq: number | null, attachmentFileSeq: number | null): EventSaveRequest => ({
    eventSeq: isNew ? undefined : selectedSeq!,
    title: titleValue,
    content: form.content ?? '',
    summary: form.summary ?? '',
    thumbnailUrl: form.thumbnailUrl?.trim() ?? '',
    eventStartDt: toIsoDateTime(startValue),
    eventEndDt: toIsoDateTime(endValue),
    registrationStartDt: regStartValue ? toIsoDateTime(regStartValue) : null,
    registrationEndDt: regEndValue ? toIsoDateTime(regEndValue) : null,
    location: form.location?.trim() ?? '',
    postalCode: postalCodeValue || null,
    venueAddress: venueAddressValue || null,
    addressDetail: form.addressDetail?.trim() || null,
    registrationUrl: registrationUrlValue,
    // 사용자 요구: 등록·수정 모두 status는 'published'로 강제 (백엔드도 동일하게 강제하지만 명시)
    status: 'published',
    useYn: form.useYn || 'Y',
    fileSeq,
    attachmentFileSeq,
    eventType: form.eventType || 'main',
    organizationSeq: form.organizationSeq ?? null,
    maxParticipants: form.maxParticipants ?? null,
    isPaid: form.isPaid ?? false,
  });

  const persist = async () => {
    setSaving(true);
    try {
      // 1) 썸네일 파일 변경 사항 저장 → fileSeq 확보
      let resolvedFileSeq: number | null = form.fileSeq ?? null;
      if (thumbnailFiles.some((f) => f.iudType)) {
        const fileRes = await callSaveFiles(resolvedFileSeq, 0, thumbnailFiles);
        const newSeq = fileRes?.item?.fileSeq;
        if (newSeq) resolvedFileSeq = Number(newSeq);
        if (fileRes?.item?.fileList) {
          setThumbnailFiles(fileRes.item.fileList as FileDetailType[]);
        }
      }

      // 2) 일반 첨부파일 변경 사항 저장 → attachmentFileSeq 확보
      let resolvedAttSeq: number | null = form.attachmentFileSeq ?? null;
      if (attachmentFiles.some((f) => f.iudType)) {
        const attRes = await callSaveFiles(resolvedAttSeq, 0, attachmentFiles);
        const newSeq = attRes?.item?.fileSeq;
        if (newSeq) resolvedAttSeq = Number(newSeq);
        if (attRes?.item?.fileList) {
          setAttachmentFiles(attRes.item.fileList as FileDetailType[]);
        }
      }

      // 3) 행사 저장
      await callSaveEvent(buildSaveParam(resolvedFileSeq, resolvedAttSeq));
      message.success(isNew ? 'Event has been registered.' : 'Event information has been saved.');
      await fetchEvents();
      if (isNew) {
        setMode('list');
      } else {
        // 재조회하여 최신 상태 반영
        if (selectedSeq !== null) await fetchDetail(selectedSeq);
      }
    } catch (err) {
      message.error(isNew ? 'Failed to register event.' : 'Failed to save event information.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!validateForm()) return;
    modal.confirm({
      title: isNew ? 'Register Event' : 'Save Event Information',
      content: isNew ? 'Do you want to register this event?' : 'Do you want to save this event information?',
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk: persist,
    });
  };

  const handleDeleteSelected = () => {
    if (selectedSeq === null) return;
    modal.confirm({
      title: 'Delete Event',
      content: `Do you want to delete "${form.title}"? This action cannot be undone.`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          await callDeleteEvent(selectedSeq);
          message.success('Event has been deleted.');
          setMode('list');
          await fetchEvents();
        } catch (err) {
          message.error('Failed to delete event.');
        }
      },
    });
  };

  const handleDeleteFromList = (event: EventListItem) => {
    modal.confirm({
      title: 'Delete Event',
      content: `Do you want to delete "${event.title}"?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          await callDeleteEvent(event.eventSeq);
          message.success('Event has been deleted.');
          fetchEvents();
        } catch (err) {
          message.error('Failed to delete event.');
        }
      },
    });
  };

  const handleNew = () => {
    setForm({ ...emptyDetail });
    setThumbnailFiles([]);
    setAttachmentFiles([]);
    setSelectedSeq(null);
    setSubmitAttempted(false);
    setMode('detail');
  };

  if (mode === 'detail') {
    const detailStatusLabel = EVENT_STATUS_LABELS[form.status] ?? form.status ?? 'Published';
    const detailStatusTone = EVENT_STATUS_TONE[form.status] ?? 'green';

    return (
      <div className="saf-screen saf-event-admin-screen">
        <header className="saf-screen-header">
          <div>
            <h1>{isNew ? 'Register Event' : (form.title || selectedSummary?.title || 'Event Detail')}</h1>
            {!isNew && (
              <p>
                {EVENT_TYPE_LABELS[form.eventType] ?? form.eventType}
                {form.organizationName ? ` · ${form.organizationName}` : ''}
              </p>
            )}
          </div>
          <div className="saf-screen-actions">
            <button type="button" className="saf-action-btn is-secondary" onClick={() => setMode('list')}>
              <ArrowLeftOutlined />
              <span>List</span>
            </button>
            {!isNew && (
              <button type="button" className="saf-action-btn is-danger" onClick={handleDeleteSelected} disabled={saving}>
                <StopOutlined />
                <span>Delete</span>
              </button>
            )}
            <button type="button" className="saf-action-btn is-primary" onClick={handleSave} disabled={saving}>
              <SaveOutlined />
              <span>{isNew ? 'Register' : 'Save'}</span>
            </button>
          </div>
        </header>

        <div className="saf-event-detail-grid">
          <section className="saf-panel">
            <PanelTitle title="Basic Information" subtitle="Based on the events table." />
            <div className="saf-form-grid">
              <Field label="Event Name *" invalid={isRequiredEmpty(form.title)} wide>
                <input
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="e.g., Seoul International Arbitration Conference 2026"
                />
              </Field>
              <Field label="Event Type *" invalid={isRequiredEmpty(form.eventType)}>
                <select
                  value={form.eventType}
                  onChange={(e) => updateForm('eventType', e.target.value)}
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <div className="saf-status-readonly">
                  <span className={`saf-status is-${detailStatusTone}`}>{detailStatusLabel}</span>
                </div>
              </Field>
              <Field label="Start Date *" invalid={isRequiredEmpty(form.eventStartDt) || isDateRangeInvalid}>
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(form.eventStartDt)}
                  onChange={(e) => updateForm('eventStartDt', e.target.value)}
                />
              </Field>
              <Field label="End Date *" invalid={isRequiredEmpty(form.eventEndDt) || isDateRangeInvalid}>
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(form.eventEndDt)}
                  onChange={(e) => updateForm('eventEndDt', e.target.value)}
                />
              </Field>
              <Field label="Registration Open" invalid={isRegRangeInvalid}>
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(form.registrationStartDt)}
                  onChange={(e) => updateForm('registrationStartDt', e.target.value)}
                />
              </Field>
              <Field label="Registration Close" invalid={isRegRangeInvalid || isRegAfterEventInvalid}>
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(form.registrationEndDt)}
                  onChange={(e) => updateForm('registrationEndDt', e.target.value)}
                />
              </Field>
              <Field label="Max Participants">
                <input
                  type="number"
                  min={0}
                  value={form.maxParticipants ?? ''}
                  onChange={(e) => updateForm('maxParticipants', e.target.value === '' ? null : Number(e.target.value))}
                  placeholder="e.g., 300"
                />
              </Field>
              <Field label="Pricing">
                <select
                  value={form.isPaid ? 'Y' : 'N'}
                  onChange={(e) => updateForm('isPaid', e.target.value === 'Y')}
                >
                  <option value="N">Free</option>
                  <option value="Y">Paid</option>
                </select>
              </Field>
              <Field label="Venue Name" wide>
                <input
                  value={form.location ?? ''}
                  onChange={(e) => updateForm('location', e.target.value)}
                  placeholder="e.g., Conrad Seoul"
                />
              </Field>
              <Field label="Postal Code" wide>
                <div className="saf-address-row">
                  <input
                    value={form.postalCode ?? ''}
                    readOnly
                    placeholder="Search address →"
                    className="saf-address-zip"
                  />
                  <button
                    type="button"
                    className="saf-address-search-btn"
                    onClick={() => setAddrModalOpen(true)}
                  >
                    Search Address
                  </button>
                </div>
              </Field>
              <Field label="Address" wide>
                <input
                  value={form.venueAddress ?? ''}
                  readOnly
                  placeholder="Address will be filled by address search"
                />
              </Field>
              <Field label="Address Detail" wide>
                <input
                  value={form.addressDetail ?? ''}
                  onChange={(e) => updateForm('addressDetail', e.target.value)}
                  placeholder="e.g., Floor 5, Conference Hall A"
                />
              </Field>
              <Field label="Summary" wide>
                <input
                  value={form.summary ?? ''}
                  onChange={(e) => updateForm('summary', e.target.value)}
                  placeholder="One-line description shown on list cards and link previews"
                />
              </Field>
              <Field label="Registration URL" invalid={isUrlInvalid} wide>
                <input
                  value={form.registrationUrl ?? ''}
                  onChange={(e) => updateForm('registrationUrl', e.target.value)}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Thumbnail" wide>
                <div className="saf-thumbnail-uploader">
                  <CustomFile
                    fileList={thumbnailFiles}
                    onFileListChange={setThumbnailFiles}
                    isEditable
                    maxCount={1}
                    accept="image/*"
                  />
                  <p className="saf-hint-inline">1 thumbnail image only (JPG/PNG/GIF/WebP) · max 10MB.</p>
                </div>
              </Field>
              <Field label="Attachments" wide>
                <div className="saf-thumbnail-uploader">
                  <CustomFile
                    fileList={attachmentFiles}
                    onFileListChange={setAttachmentFiles}
                    isEditable
                  />
                  <p className="saf-hint-inline">Up to 5 files (PDF, DOCX, etc.) · max 10MB each · drag to reorder.</p>
                </div>
              </Field>
            </div>
          </section>

          <section className="saf-panel saf-event-description-panel">
            <PanelTitle title="Description" subtitle="Detailed event content displayed on the public page." />
            <div className="saf-event-description-editor">
              <CustomRichEditor
                value={form.content ?? ''}
                isEditable
                onChange={(html) => updateForm('content', html)}
                placeholder="Event overview, topics, target audience, agenda, speakers, etc."
                height={480}
              />
            </div>
          </section>
        </div>

        <CustomAddressSearchModal
          open={addrModalOpen}
          onCancel={() => setAddrModalOpen(false)}
          onAddrSearchComplete={handleAddressComplete}
        />
      </div>
    );
  }

  return (
    <div className="saf-screen saf-event-admin-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Event Management</h1>
          <p>Manage official conferences and approved side events.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchEvents} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={handleNew}>
            <PlusOutlined />
            <span>Register</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Search by event name or organization"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchEvents();
            }}
          />
        </div>
        <select className="saf-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select className="saf-filter-select" value={eventType} onChange={(e) => setEventType(e.target.value)}>
          {TYPE_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button type="button" onClick={fetchEvents}>Search</button>
      </section>

      <section className="saf-table-wrap">
        <table className="saf-table saf-event-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Type</th>
              <th>Organization</th>
              <th>Registrations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const typeLabel = EVENT_TYPE_LABELS[event.eventType] ?? event.eventType ?? '-';
              const typeTone = EVENT_TYPE_TONE[event.eventType] ?? 'gray';
              const statusLabel = EVENT_STATUS_LABELS[event.status] ?? event.status ?? '-';
              const statusTone = EVENT_STATUS_TONE[event.status] ?? 'gray';
              const cap = event.maxParticipants ?? 0;
              const reg = event.registrationCount ?? 0;
              return (
                <tr key={event.eventSeq} onClick={() => fetchDetail(event.eventSeq)}>
                  <td><strong>{event.title}</strong></td>
                  <td>{formatMonthDay(event.eventStartDt)}</td>
                  <td><span className={`saf-status is-${typeTone}`}>{typeLabel}</span></td>
                  <td>{event.organizationName || 'KCAB'}</td>
                  <td>{cap > 0 ? `${reg}/${cap}` : `${reg}`}</td>
                  <td><span className={`saf-status is-${statusTone}`}>{statusLabel}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="saf-row-action"
                      onClick={() => fetchDetail(event.eventSeq)}
                    >
                      <EditOutlined /> Edit
                    </button>
                    <span className="saf-row-action-sep">·</span>
                    <button
                      type="button"
                      className="saf-row-action is-danger"
                      onClick={() => handleDeleteFromList(event)}
                    >
                      <DeleteOutlined /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!events.length && (
              <tr>
                <td colSpan={7} className="saf-event-empty">
                  <CalendarOutlined />
                  <span>{loading ? 'Loading...' : 'No events found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="saf-table-footer">{events.length} record(s)</div>
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

function Field({
  label,
  children,
  wide,
  invalid,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  invalid?: boolean;
}) {
  const required = label.endsWith(' *');
  const labelText = required ? label.slice(0, -2) : label;
  return (
    <label className={`saf-form-field ${wide ? 'is-wide' : ''} ${invalid ? 'is-invalid' : ''}`}>
      <span>
        {labelText}
        {required && <em className="saf-required-mark">*</em>}
      </span>
      {children}
    </label>
  );
}
