'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, DatePicker, Modal, Select } from 'antd';
import type { RcFile } from 'antd/es/upload';
import dayjs, { Dayjs } from 'dayjs';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
  SendOutlined,
  StopOutlined,
} from '@ant-design/icons';
import CustomRichEditor, { RichEditorTextColorOption } from '@component/special/CustomRichEditor';
import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
import { callGetFileList, callSaveFiles } from '@api/CommonApi';
import { callExcelDownload, type ExcelColumnDef } from '@api/CommonExcelApi';
import { callGetParticipantList } from '@api/admin/ParticipantManagementApi';
import {
  callApproveEvent,
  callCancelEventApproval,
  callDeleteEvent,
  callGetDiscountCodeUsage,
  callGetEventDetail,
  callGetEventList,
  callRejectEvent,
  callRequestEventApproval,
  callReviseRejectedEvent,
  callSaveEvent,
} from '@api/event/EventApi';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { getAdminRole } from '@util/fixedAdminMenus';
import { IudType } from '@interface/common';
import {
  DiscountCodeUsageItem,
  EVENT_STATUS_LABELS,
  EVENT_STATUS_TONE,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_TONE,
  EventDiscountCodeItem,
  EventDetail,
  EventListItem,
  EventPricingItem,
  EventSaveRequest,
  REGISTRATION_TYPE_LABELS,
  RegistrationType,
} from '@interface/event/EventManagement';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';
import OfficialEventPageBuilder from './OfficialEventPageBuilder';
import type { ParticipantListItem } from '@interface/admin/ParticipantManagement';

/** Status 멀티 셀렉트 옵션 (빈 항목 없이 실제 상태값만) */
const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
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

const REGISTRATION_TYPE_OPTIONS: Array<{ value: RegistrationType; label: string }> = [
  { value: 'direct', label: REGISTRATION_TYPE_LABELS.direct },
  { value: 'external', label: REGISTRATION_TYPE_LABELS.external },
  { value: 'none', label: REGISTRATION_TYPE_LABELS.none },
];

const PRICE_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'early_bird', label: 'Early Bird' },
  { value: 'regular', label: 'Regular' },
  { value: 'student', label: 'Student' },
  { value: 'member', label: 'Member' },
];

const CURRENCY_OPTIONS = ['USD', 'KRW'];

const DISCOUNT_TYPE_OPTIONS: Array<{ value: EventDiscountCodeItem['discountType']; label: string }> = [
  { value: 'percent', label: 'Percent' },
  { value: 'amount', label: 'Amount' },
];

const EVENT_EDITOR_TEXT_COLOR_OPTIONS: RichEditorTextColorOption[] = [
  { label: 'Black', value: '#111827' },
  { label: 'Red', value: '#b91c1c' },
  { label: 'Blue', value: '#1f5b95' },
  { label: 'Yellow', value: '#facc15' },
];

const EVENT_PARTICIPANT_EXCEL_COLUMNS: ExcelColumnDef[] = [
  { headerName: 'Name', dataIndex: 'name', width: 24 },
  { headerName: 'Email', dataIndex: 'email', width: 34 },
  { headerName: 'Organization', dataIndex: 'organization', width: 30 },
  { headerName: 'Position', dataIndex: 'position', width: 22 },
  { headerName: 'Country', dataIndex: 'country', width: 18 },
  { headerName: 'Status', dataIndex: 'status', width: 18 },
  { headerName: 'Registered At', dataIndex: 'registeredAt', width: 22 },
];

const EVENT_PARTICIPANT_PAID_EXCEL_COLUMNS: ExcelColumnDef[] = [
  { headerName: 'Name', dataIndex: 'name', width: 24 },
  { headerName: 'Email', dataIndex: 'email', width: 34 },
  { headerName: 'Organization', dataIndex: 'organization', width: 30 },
  { headerName: 'Position', dataIndex: 'position', width: 22 },
  { headerName: 'Country', dataIndex: 'country', width: 18 },
  { headerName: 'Payment Name', dataIndex: 'paymentName', width: 22 },
  { headerName: 'Status', dataIndex: 'status', width: 18 },
  { headerName: 'Registered At', dataIndex: 'registeredAt', width: 22 },
];

const URL_REGEXP = /^(https?:\/\/)[^\s]+$/i;
const EVENT_SLUG_REGEXP = /^[a-z0-9]([a-z0-9-]{0,198}[a-z0-9])?$/;
const DASHBOARD_EVENT_DETAIL_KEY = 'saf.admin.dashboardEventSeq';
const PARTICIPANT_DETAIL_KEY = 'saf.admin.participantDetailSeq';
const PARTICIPANT_DETAIL_ITEM_KEY = 'saf.admin.participantDetailItem';
const PARTICIPANT_RETURN_PATH_KEY = 'saf.admin.participantReturnPath';

const emptyDetail: EventDetail = {
  eventSeq: 0,
  slug: '',
  title: '',
  description: '',
  content: '',
  summary: '',
  eventStartDt: '',
  eventEndDt: '',
  registrationStartDt: '',
  registrationEndDt: '',
  location: '',
  registrationType: 'direct',
  registrationUrl: '',
  status: 'published',
  rejectionReason: '',
  useYn: 'Y',
  emailHeaderImageFileSeq: null,
  attachmentFileSeq: null,
  eventType: 'main',
  organizationSeq: null,
  organizationName: '',
  maxParticipants: null,
  isPaid: false,
  pricingList: [],
  discountCodes: [],
  rgstUserSeq: 0,
  rgstDateTime: '',
  uptDateTime: '',
};

/** Rich editor HTML이 실제 의미있는 텍스트를 가지는지 (빈 <p>, <br>만 있는 경우 false) */
function hasRichContent(html?: string | null): boolean {
  if (!html) return false;
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0;
}

/** ISO LocalDateTime 문자열 → Dayjs (DatePicker value 바인딩용) */
function toDayjs(value?: string | null): Dayjs | null {
  if (!value) return null;
  const d = dayjs(value);
  return d.isValid() ? d : null;
}

/** Dayjs → 백엔드 LocalDateTime 문자열 ("YYYY-MM-DDTHH:mm:ss") */
function fromDayjs(d: Dayjs | null): string {
  return d ? d.format('YYYY-MM-DDTHH:mm:ss') : '';
}

/** 목록 테이블의 일시 범위 표시: "2026-05-20 13:00 ~ 2026-05-20 18:00" */
function formatDateRange(start?: string | null, end?: string | null): string {
  const s = toDayjs(start);
  const e = toDayjs(end);
  if (!s && !e) return '-';
  const fmt = 'YYYY-MM-DD HH:mm';
  return `${s ? s.format(fmt) : '-'} ~ ${e ? e.format(fmt) : '-'}`;
}

function formatPricingAmount(value?: number | string | null): string {
  if (value === null || value === undefined || value === '') return '';
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(numberValue);
}

function normalizePricingAmountText(value: string): string {
  const cleaned = value.replace(/,/g, '').replace(/[^\d.]/g, '');
  const hasDot = cleaned.includes('.');
  const [integerRaw, ...decimalParts] = cleaned.split('.');
  const integerPart = integerRaw.replace(/^0+(?=\d)/, '');
  const decimalPart = decimalParts.join('').slice(0, 1);
  const formattedInteger = integerPart ? Number(integerPart).toLocaleString('en-US') : (hasDot ? '0' : '');
  return hasDot ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

function parsePricingAmountText(value: string): number | null {
  const normalized = value.replace(/,/g, '');
  if (!normalized || normalized === '.') return null;
  const numberValue = Number(normalized.endsWith('.') ? normalized.slice(0, -1) : normalized);
  if (!Number.isFinite(numberValue)) return null;
  return Math.trunc(numberValue * 10) / 10;
}

function getPriceTypeLabel(priceType?: string | null): string {
  return PRICE_TYPE_OPTIONS.find((option) => option.value === priceType)?.label ?? 'Regular';
}

function createPricingRow(sortSeq: number): EventPricingItem {
  return {
    eventPricingSeq: null,
    priceType: 'regular',
    priceName: 'Regular',
    currencyCode: 'USD',
    amount: null,
    salesStartAt: '',
    salesEndAt: '',
    useYn: 'Y',
    sortSeq,
  };
}

function createDiscountCodeRow(sortSeq: number): EventDiscountCodeItem {
  return {
    discountCodeSeq: null,
    discountCode: '',
    discountType: 'percent',
    discountValue: null,
    currencyCode: null,
    appliesToPriceType: '',
    usageLimit: null,
    usedCount: 0,
    validFromAt: '',
    validToAt: '',
    useYn: 'Y',
    sortSeq,
  };
}

export default function SuperEventList() {
  const { message, modal } = App.useApp();
  const sessionInfo = useAtomValue(sessionInfoAtom);
  const setCurrentPath = useSetAtom(currentPathAtom);
  const isOrganizationRole = getAdminRole(sessionInfo.admYn) === 'ORGANIZATION';
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string[]>([]);
  const [eventType, setEventType] = useState('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<'list' | 'detail'>('list');
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [form, setForm] = useState<EventDetail>(emptyDetail);
  const [emailHeaderImageFiles, setEmailHeaderImageFiles] = useState<FileDetailType[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<FileDetailType[]>([]);
  const [eventParticipants, setEventParticipants] = useState<ParticipantListItem[]>([]);
  const [eventParticipantKeyword, setEventParticipantKeyword] = useState('');
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [pricingAmountDrafts, setPricingAmountDrafts] = useState<Record<string, string>>({});
  const [discountUsageModal, setDiscountUsageModal] = useState<{
    open: boolean;
    loading: boolean;
    code: string;
    items: DiscountCodeUsageItem[];
  }>({ open: false, loading: false, code: '', items: [] });

  const isNew = selectedSeq === null;
  const titleValue = form.title.trim();
  const slugValue = form.slug?.trim().toLowerCase() ?? '';
  const startValue = form.eventStartDt?.trim() ?? '';
  const endValue = form.eventEndDt?.trim() ?? '';
  const regStartValue = form.registrationStartDt?.trim() ?? '';
  const regEndValue = form.registrationEndDt?.trim() ?? '';
  const registrationUrlValue = form.registrationUrl?.trim() ?? '';
  const locationValue = form.location?.trim() ?? '';
  const hasContent = hasRichContent(form.content);
  const isSideEvent = form.eventType === 'side';
  const isOfficialEvent = form.eventType === 'main';
  const isRequiredEmpty = (value?: string | null) => submitAttempted && !value?.toString().trim();
  const isContentRequiredEmpty = submitAttempted && isSideEvent && !hasContent;
  const isDateRangeInvalid = submitAttempted && !!startValue && !!endValue && startValue > endValue;
  const isRegRangeInvalid = submitAttempted && !!regStartValue && !!regEndValue && regStartValue > regEndValue;
  const isRegAfterEventInvalid = submitAttempted && !!regEndValue && !!startValue && regEndValue > startValue;
  const isExternalRegistration = form.registrationType === 'external';
  const isNoRegistration = form.registrationType === 'none';
  const showRegistrationDates = !isNoRegistration;
  const isUrlRequiredEmpty = submitAttempted && isExternalRegistration && !registrationUrlValue;
  const isUrlFormatInvalid = submitAttempted && isExternalRegistration && !!registrationUrlValue && !URL_REGEXP.test(registrationUrlValue);
  const isUrlInvalid = isUrlRequiredEmpty || isUrlFormatInvalid;
  const isRegStartRequiredEmpty = submitAttempted && showRegistrationDates && !regStartValue;
  const isRegEndRequiredEmpty = submitAttempted && showRegistrationDates && !regEndValue;
  const isSlugRequiredEmpty = submitAttempted && isOfficialEvent && !slugValue;
  const isSlugFormatInvalid = submitAttempted && !!slugValue && !EVENT_SLUG_REGEXP.test(slugValue);
  const isSlugInvalid = isSlugRequiredEmpty || isSlugFormatInvalid;
  const canUsePaidPricing = !isOrganizationRole && !isSideEvent;
  const requiredGridClass = (invalid: boolean) => (submitAttempted && invalid ? 'is-required-error' : undefined);
  const isMissingText = (value?: string | null) => !value?.trim();
  const isInvalidPositiveAmount = (value?: number | string | null) => (
    value === null || value === undefined || value === '' || Number(value) <= 0
  );
  const isDiscountValueInvalid = (discount: EventDiscountCodeItem) => (
    isInvalidPositiveAmount(discount.discountValue)
    || (discount.discountType === 'percent' && Number(discount.discountValue) > 100)
  );
  const isDiscountCurrencyInvalid = (discount: EventDiscountCodeItem) => (
    discount.discountType === 'amount'
    && !CURRENCY_OPTIONS.includes((discount.currencyCode ?? '').trim().toUpperCase())
  );
  const getPricingAmountKey = (pricing: EventPricingItem, index: number) => `${pricing.eventPricingSeq ?? 'new'}-${index}`;
  const canReviewApproval = !isOrganizationRole && !isNew && form.status === 'pending_approval';
  const canCancelApproval = isOrganizationRole && !isNew && form.status === 'pending_approval';
  const canReviseRejected = isOrganizationRole && !isNew && form.status === 'rejected';
  const canOrganizationEdit = form.status === 'draft' || form.status === 'published';
  const isLockedByApproval = !isNew && (
    (isOrganizationRole && !canOrganizationEdit)
    || (!isOrganizationRole && (form.status === 'pending_approval' || form.status === 'rejected'))
  );
  const canRequestApproval = isOrganizationRole && !isNew && form.status === 'draft';
  const canEdit = !isLockedByApproval;
  const canDelete = !isNew && (
    !isOrganizationRole
      ? form.status !== 'pending_approval' && form.status !== 'rejected'
      : form.status === 'draft'
  );

  const selectedSummary = useMemo(
    () => events.find((event) => event.eventSeq === selectedSeq),
    [selectedSeq, events],
  );
  const filteredEventParticipants = useMemo(() => {
    const searchKeyword = eventParticipantKeyword.trim().toLowerCase();
    if (!searchKeyword) return eventParticipants;
    return eventParticipants.filter((participant) => participantMatchesKeyword(participant, searchKeyword));
  }, [eventParticipantKeyword, eventParticipants]);
  const participantSubtitle = eventParticipantKeyword.trim()
    ? `${filteredEventParticipants.length} of ${eventParticipants.length} participant(s) matched.`
    : `${eventParticipants.length} participant(s) registered for this event.`;
  const eventPagination = useClientGridPagination(events);
  const eventParticipantPagination = useClientGridPagination(filteredEventParticipants);
  const showPaymentNameColumn = !!form.isPaid;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await callGetEventList({
        keyword: keyword.trim() || undefined,
        // 멀티 셀렉트 → 콤마 조인 ("draft,published"); 빈 배열이면 전송 안 함
        status: status.length ? status.join(',') : undefined,
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
      // 백엔드가 registrationType을 누락한 레거시 데이터 호환: URL 유무로 추론
      const description = detail?.description ?? detail?.content ?? detail?.summary ?? '';
      const merged: EventDetail = {
        ...emptyDetail,
        ...(detail ?? {}),
        description,
        content: detail?.content ?? description,
        pricingList: detail?.pricingList ?? [],
        discountCodes: detail?.discountCodes ?? [],
      };
      if (merged.eventType === 'side') {
        merged.isPaid = false;
        merged.pricingList = [];
        merged.discountCodes = [];
      }
      if (!merged.registrationType) {
        merged.registrationType = (merged.registrationUrl ?? '').trim() ? 'external' : 'direct';
      }
      setForm(merged);
      setSelectedSeq(eventSeq);
      setSubmitAttempted(false);
      setPricingAmountDrafts({});
      setEventParticipantKeyword('');
      setMode('detail');
      fetchEventParticipants(eventSeq);

      // 이메일 상단 이미지 로드
      const emailHeaderImageSeq = detail?.emailHeaderImageFileSeq ?? null;
      if (emailHeaderImageSeq) {
        try {
          const imageRes = await callGetFileList(emailHeaderImageSeq);
          setEmailHeaderImageFiles(imageRes?.item ?? []);
        } catch {
          setEmailHeaderImageFiles([]);
        }
      } else {
        setEmailHeaderImageFiles([]);
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

  const fetchEventParticipants = async (eventSeq: number) => {
    setParticipantsLoading(true);
    try {
      const res = await callGetParticipantList({ eventSeqs: [eventSeq] });
      setEventParticipants(res?.item ?? []);
    } catch {
      setEventParticipants([]);
      message.error('Failed to load event participants.');
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    const pendingEventSeq = readPendingDashboardEventSeq();
    fetchEvents().then(() => {
      if (pendingEventSeq !== null) {
        fetchDetail(pendingEventSeq);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateForm = <K extends keyof EventDetail>(key: K, value: EventDetail[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePricingMode = (isPaid: boolean) => {
    setForm((prev) => {
      const nextIsPaid = prev.eventType === 'side' ? false : isPaid;
      return {
        ...prev,
        isPaid: nextIsPaid,
        pricingList: nextIsPaid && !prev.pricingList?.length ? [createPricingRow(1)] : (nextIsPaid ? (prev.pricingList ?? []) : []),
        discountCodes: nextIsPaid ? (prev.discountCodes ?? []) : [],
      };
    });
  };

  const updateEventType = (eventType: string) => {
    setForm((prev) => ({
      ...prev,
      eventType,
      isPaid: eventType === 'side' ? false : prev.isPaid,
      pricingList: eventType === 'side' ? [] : (prev.pricingList ?? []),
      discountCodes: eventType === 'side' ? [] : (prev.discountCodes ?? []),
    }));
  };

  const addPricingRow = () => {
    setForm((prev) => ({
      ...prev,
      pricingList: [...(prev.pricingList ?? []), createPricingRow((prev.pricingList?.length ?? 0) + 1)],
    }));
  };

  const updatePricingRow = (index: number, patch: Partial<EventPricingItem>) => {
    setForm((prev) => ({
      ...prev,
      pricingList: (prev.pricingList ?? []).map((row, rowIndex) => (
        rowIndex === index ? { ...row, ...patch } : row
      )),
    }));
  };

  const updatePricingAmountInput = (index: number, pricing: EventPricingItem, value: string) => {
    const amountText = normalizePricingAmountText(value);
    const amount = parsePricingAmountText(amountText);
    setPricingAmountDrafts((prev) => ({
      ...prev,
      [getPricingAmountKey(pricing, index)]: amountText,
    }));
    updatePricingRow(index, { amount });
  };

  const finalizePricingAmountInput = (index: number, pricing: EventPricingItem) => {
    const key = getPricingAmountKey(pricing, index);
    const amount = parsePricingAmountText(pricingAmountDrafts[key] ?? formatPricingAmount(pricing.amount));
    setPricingAmountDrafts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    updatePricingRow(index, { amount });
  };

  const updatePricingType = (index: number, priceType: string) => {
    const pricing = form.pricingList?.[index];
    if (pricing && isPricingLocked(pricing)) {
      message.warning('This price type has payment history and cannot be changed.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      pricingList: (prev.pricingList ?? []).map((row, rowIndex) => {
        if (rowIndex !== index) return row;
        const previousLabel = getPriceTypeLabel(row.priceType);
        const nextLabel = getPriceTypeLabel(priceType);
        const shouldRefreshName = !row.priceName || row.priceName === previousLabel;
        return {
          ...row,
          priceType,
          priceName: shouldRefreshName ? nextLabel : row.priceName,
        };
      }),
    }));
  };

  const removePricingRow = (index: number) => {
    const pricing = form.pricingList?.[index];
    if (pricing && isPricingLocked(pricing)) {
      message.warning('This price has payment history and cannot be deleted.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      pricingList: (prev.pricingList ?? []).filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const addDiscountCodeRow = () => {
    setForm((prev) => ({
      ...prev,
      discountCodes: [...(prev.discountCodes ?? []), createDiscountCodeRow((prev.discountCodes?.length ?? 0) + 1)],
    }));
  };

  const updateDiscountCodeRow = (index: number, patch: Partial<EventDiscountCodeItem>) => {
    const discountCode = form.discountCodes?.[index];
    if (discountCode && isDiscountCodeLocked(discountCode) && Object.prototype.hasOwnProperty.call(patch, 'discountCode')) {
      message.warning('This discount code has usage history and cannot be changed.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      discountCodes: (prev.discountCodes ?? []).map((row, rowIndex) => (
        rowIndex === index ? { ...row, ...patch } : row
      )),
    }));
  };

  const updateDiscountType = (index: number, discountType: EventDiscountCodeItem['discountType']) => {
    updateDiscountCodeRow(index, {
      discountType,
      currencyCode: discountType === 'amount' ? (form.discountCodes?.[index]?.currencyCode || 'USD') : null,
    });
  };

  const removeDiscountCodeRow = (index: number) => {
    const discountCode = form.discountCodes?.[index];
    if (discountCode && isDiscountCodeLocked(discountCode)) {
      message.warning('This discount code has usage history and cannot be deleted.');
      return;
    }
    setForm((prev) => ({
      ...prev,
      discountCodes: (prev.discountCodes ?? []).filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const openDiscountUsageModal = async (discount: EventDiscountCodeItem) => {
    if (!discount.discountCodeSeq) {
      message.info('Save the event before viewing usage history.');
      return;
    }
    const code = discount.discountCode || '';
    setDiscountUsageModal({ open: true, loading: true, code, items: [] });
    try {
      const res = await callGetDiscountCodeUsage(discount.discountCodeSeq);
      setDiscountUsageModal({ open: true, loading: false, code, items: res?.item ?? [] });
    } catch {
      message.error('Failed to load discount code usage.');
      setDiscountUsageModal({ open: false, loading: false, code: '', items: [] });
    }
  };

  const closeDiscountUsageModal = () => {
    setDiscountUsageModal({ open: false, loading: false, code: '', items: [] });
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
    if (isOfficialEvent && !slugValue) {
      message.warning('Please enter the event URL key.');
      return false;
    }
    if (slugValue && !EVENT_SLUG_REGEXP.test(slugValue)) {
      message.warning('Event URL key can only contain lowercase letters, numbers, and hyphens.');
      return false;
    }
    if (!locationValue) {
      message.warning('Please enter the venue.');
      return false;
    }
    if (isSideEvent && !hasContent) {
      message.warning('Please enter the description.');
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
    // 참가신청 일시 검증: 'none'이 아니면 시작/종료 둘 다 필수
    if (showRegistrationDates) {
      if (!regStartValue || !regEndValue) {
        message.warning('Please enter both registration start and end date/time.');
        return false;
      }
      if (regStartValue > regEndValue) {
        message.warning('Registration end must be on or after registration start.');
        return false;
      }
      if (startValue && regEndValue > startValue) {
        message.warning('Registration must close on or before the event start.');
        return false;
      }
    }
    if (isExternalRegistration) {
      if (!registrationUrlValue) {
        message.warning('Please enter the external registration URL.');
        return false;
      }
      if (!URL_REGEXP.test(registrationUrlValue)) {
        message.warning('Please enter a valid registration URL.');
        return false;
      }
    }
    if (form.maxParticipants !== null && form.maxParticipants !== undefined && form.maxParticipants < 0) {
      message.warning('Max participants must be 0 or greater.');
      return false;
    }
    if (form.isPaid && isSideEvent) {
      message.warning('Side events must be free.');
      return false;
    }
    if (form.isPaid) {
      const pricingList = form.pricingList ?? [];
      if (!pricingList.length) {
        message.warning('Please add at least one pricing tier.');
        return false;
      }
      for (const pricing of pricingList) {
        if (!pricing.priceType) {
          message.warning('Please select a pricing type.');
          return false;
        }
        if (!pricing.priceName?.trim()) {
          message.warning('Please enter a pricing name.');
          return false;
        }
        if (!pricing.currencyCode?.trim()) {
          message.warning('Please select a currency.');
          return false;
        }
        if (pricing.amount === null || pricing.amount === undefined || Number(pricing.amount) <= 0) {
          message.warning('Pricing amount must be greater than 0.');
          return false;
        }
        if ((pricing.salesStartAt ?? '') && (pricing.salesEndAt ?? '') && String(pricing.salesStartAt) > String(pricing.salesEndAt)) {
          message.warning('Pricing sales end must be on or after sales start.');
          return false;
        }
      }

      const priceTypes = new Set(pricingList.map((pricing) => pricing.priceType).filter(Boolean));
      const discountCodes = form.discountCodes ?? [];
      const uniqueDiscountCodes = new Set<string>();
      for (const discount of discountCodes) {
        const code = discount.discountCode?.trim().toUpperCase() ?? '';
        if (!code) {
          message.warning('Please enter a discount code.');
          return false;
        }
        if (uniqueDiscountCodes.has(code)) {
          message.warning('Discount codes must be unique per event.');
          return false;
        }
        uniqueDiscountCodes.add(code);
        if (!discount.discountType) {
          message.warning('Please select a discount type.');
          return false;
        }
        if (discount.discountValue === null || discount.discountValue === undefined || Number(discount.discountValue) <= 0) {
          message.warning('Discount value must be greater than 0.');
          return false;
        }
        if (discount.discountType === 'percent' && Number(discount.discountValue) > 100) {
          message.warning('Percent discount cannot exceed 100.');
          return false;
        }
        const discountCurrency = (discount.currencyCode ?? '').trim().toUpperCase();
        if (discount.discountType === 'amount' && !CURRENCY_OPTIONS.includes(discountCurrency)) {
          message.warning('Please select a discount currency.');
          return false;
        }
        if (discount.appliesToPriceType && !priceTypes.has(discount.appliesToPriceType)) {
          message.warning('Discount code applies to a pricing type that does not exist.');
          return false;
        }
        if (discount.usageLimit !== null && discount.usageLimit !== undefined && discount.usageLimit < 0) {
          message.warning('Usage limit must be 0 or greater.');
          return false;
        }
        if ((discount.validFromAt ?? '') && (discount.validToAt ?? '') && String(discount.validFromAt) > String(discount.validToAt)) {
          message.warning('Discount valid-to date must be on or after valid-from date.');
          return false;
        }
      }
    }
    return true;
  };

  const normalizePricingForSave = (): EventPricingItem[] => {
    if (!form.isPaid || isSideEvent) return [];
    return (form.pricingList ?? []).map((pricing, index) => ({
      ...pricing,
      priceType: pricing.priceType,
      priceName: pricing.priceName?.trim() ?? '',
      currencyCode: pricing.currencyCode?.trim().toUpperCase() ?? '',
      amount: pricing.amount === null || pricing.amount === undefined ? null : Math.trunc(Number(pricing.amount) * 10) / 10,
      salesStartAt: pricing.salesStartAt || null,
      salesEndAt: pricing.salesEndAt || null,
      useYn: pricing.useYn || 'Y',
      sortSeq: index + 1,
    }));
  };

  const normalizeDiscountCodesForSave = (): EventDiscountCodeItem[] => {
    if (!form.isPaid || isSideEvent) return [];
    return (form.discountCodes ?? []).map((discount, index) => ({
      ...discount,
      discountCode: discount.discountCode?.trim().toUpperCase() ?? '',
      discountType: discount.discountType || 'percent',
      discountValue: discount.discountValue === null || discount.discountValue === undefined ? null : Number(discount.discountValue),
      currencyCode: discount.discountType === 'amount' ? (discount.currencyCode?.trim().toUpperCase() || null) : null,
      appliesToPriceType: discount.appliesToPriceType || null,
      usageLimit: discount.usageLimit === null || discount.usageLimit === undefined ? null : Number(discount.usageLimit),
      usedCount: discount.usedCount ?? 0,
      validFromAt: discount.validFromAt || null,
      validToAt: discount.validToAt || null,
      useYn: discount.useYn || 'Y',
      sortSeq: index + 1,
    }));
  };

  const buildSaveParam = (emailHeaderImageFileSeq: number | null, attachmentFileSeq: number | null): EventSaveRequest => ({
    eventSeq: isNew ? undefined : selectedSeq!,
    slug: slugValue,
    title: titleValue,
    description: form.description ?? form.content ?? '',
    content: form.description ?? form.content ?? '',
    summary: form.summary ?? '',
    eventStartDt: startValue,
    eventEndDt: endValue,
    registrationStartDt: isNoRegistration ? null : (regStartValue || null),
    registrationEndDt: isNoRegistration ? null : (regEndValue || null),
    location: form.location?.trim() ?? '',
    registrationType: form.registrationType,
    registrationUrl: isExternalRegistration ? registrationUrlValue : '',
    status: isOrganizationRole ? (form.status || 'draft') : 'published',
    useYn: form.useYn || 'Y',
    emailHeaderImageFileSeq,
    attachmentFileSeq,
    eventType: form.eventType || 'main',
    organizationSeq: form.organizationSeq ?? null,
    maxParticipants: form.maxParticipants ?? null,
    isPaid: isSideEvent ? false : (form.isPaid ?? false),
    pricingList: normalizePricingForSave(),
    discountCodes: normalizeDiscountCodesForSave(),
  });

  const persist = async () => {
    setSaving(true);
    try {
      // 1) 이메일 상단 이미지 저장 → emailHeaderImageFileSeq 확보
      let resolvedEmailHeaderImageSeq: number | null = form.emailHeaderImageFileSeq ?? null;
      if (emailHeaderImageFiles.some((f) => f.iudType)) {
        const imageRes = await callSaveFiles(resolvedEmailHeaderImageSeq, 0, emailHeaderImageFiles);
        const newImageSeq = imageRes?.item?.fileSeq;
        if (newImageSeq) resolvedEmailHeaderImageSeq = Number(newImageSeq);
        if (imageRes?.item?.fileList) {
          setEmailHeaderImageFiles(imageRes.item.fileList as FileDetailType[]);
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
      const eventRes = await callSaveEvent(buildSaveParam(resolvedEmailHeaderImageSeq, resolvedAttSeq));
      message.success(isNew ? 'Event has been registered.' : 'Event information has been saved.');
      await fetchEvents();
      if (isNew) {
        const savedEventSeq = Number(eventRes?.item);
        if (savedEventSeq) {
          await fetchDetail(savedEventSeq);
        } else {
          setMode('list');
        }
      } else {
        // 재조회하여 최신 상태 반영
        if (selectedSeq !== null) await fetchDetail(selectedSeq);
      }
    } catch (err: any) {
      // 백엔드가 메시지를 보냈으면 그대로 노출 (IllegalArgumentException 등 원인 파악용)
      const backendMsg = err?.response?.data?.message;
      const fallback = isNew ? 'Failed to register event.' : 'Failed to save event information.';
      message.error(backendMsg ? `${fallback} (${backendMsg})` : fallback);
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

  const handleRequestApproval = () => {
    if (selectedSeq === null) return;
    modal.confirm({
      title: 'Request Approval',
      content: 'Do you want to submit this event for approval? You cannot edit it after submitting.',
      okText: 'Request',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        setSaving(true);
        try {
          await callRequestEventApproval(selectedSeq);
          message.success('Approval has been requested.');
          await fetchEvents();
          await fetchDetail(selectedSeq);
        } catch (err: any) {
          message.error(err?.response?.data?.message ?? 'Failed to request approval.');
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleCancelApproval = () => {
    if (selectedSeq === null) return;
    modal.confirm({
      title: 'Move to Draft',
      content: 'Do you want to move this event back to Draft?',
      okText: 'Move to Draft',
      cancelText: 'Close',
      centered: true,
      onOk: async () => {
        setSaving(true);
        try {
          await callCancelEventApproval(selectedSeq);
          message.success('Event has been moved to Draft.');
          await fetchEvents();
          await fetchDetail(selectedSeq);
        } catch (err: any) {
          message.error(err?.response?.data?.message ?? 'Failed to move event to Draft.');
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleReviseRejected = () => {
    if (selectedSeq === null) return;
    modal.confirm({
      title: 'Revise Event',
      content: 'Do you want to move this rejected event back to Draft? You can edit it and request approval again.',
      okText: 'Move to Draft',
      cancelText: 'Close',
      centered: true,
      onOk: async () => {
        setSaving(true);
        try {
          await callReviseRejectedEvent(selectedSeq);
          message.success('Event has been moved to Draft.');
          await fetchEvents();
          await fetchDetail(selectedSeq);
        } catch (err: any) {
          message.error(err?.response?.data?.message ?? 'Failed to move event to Draft.');
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleReviewApproval = (approved: boolean) => {
    if (selectedSeq === null) return;
    const actionLabel = approved ? 'Approve' : 'Reject';
    let rejectionReason = '';
    modal.confirm({
      title: `${actionLabel} Event`,
      content: approved
        ? `Do you want to approve "${form.title}"? The event will be published.`
        : (
          <div className="saf-modal-form">
            <p>Do you want to reject "{form.title}"? The organization will no longer be able to edit it.</p>
            <textarea
              autoFocus
              rows={5}
              placeholder="Enter the rejection reason."
              onChange={(e) => {
                rejectionReason = e.currentTarget.value;
              }}
              style={{
                width: '100%',
                marginTop: 12,
                border: '1px solid #d7dee8',
                borderRadius: 6,
                padding: '10px 12px',
                resize: 'vertical',
              }}
            />
          </div>
        ),
      okText: actionLabel,
      cancelText: 'Cancel',
      okButtonProps: approved ? undefined : { danger: true },
      centered: true,
      onOk: async () => {
        const reason = rejectionReason.trim();
        if (!approved && !reason) {
          message.warning('Please enter the rejection reason.');
          return Promise.reject(new Error('Rejection reason is required.'));
        }
        setSaving(true);
        try {
          if (approved) {
            await callApproveEvent(selectedSeq);
            message.success('Event has been approved.');
          } else {
            await callRejectEvent(selectedSeq, reason);
            message.success('Event has been rejected.');
          }
          await fetchEvents();
          await fetchDetail(selectedSeq);
        } catch (err: any) {
          message.error(err?.response?.data?.message ?? `Failed to ${actionLabel.toLowerCase()} event.`);
          return Promise.reject(err);
        } finally {
          setSaving(false);
        }
        return undefined;
      },
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

  const handleExportParticipants = async () => {
    if (!filteredEventParticipants.length) {
      message.warning('No participants to export.');
      return;
    }

    try {
      await callExcelDownload(
        showPaymentNameColumn ? EVENT_PARTICIPANT_PAID_EXCEL_COLUMNS : EVENT_PARTICIPANT_EXCEL_COLUMNS,
        buildParticipantExcelRows(filteredEventParticipants),
        `${sanitizeFileName(form.title || 'event')}_participants`,
      );
      message.success('Participant list has been exported.');
    } catch (err) {
      message.error('Failed to export participants.');
    }
  };

  const handleOpenParticipantDetail = (participant: ParticipantListItem) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PARTICIPANT_DETAIL_KEY, String(participant.participantSeq));
      window.sessionStorage.setItem(PARTICIPANT_DETAIL_ITEM_KEY, JSON.stringify(participant));
      window.sessionStorage.setItem(PARTICIPANT_RETURN_PATH_KEY, window.location.pathname + window.location.search);
      if (selectedSeq !== null) {
        window.sessionStorage.setItem(DASHBOARD_EVENT_DETAIL_KEY, String(selectedSeq));
      }
      pushPath(`/admin/participants?participantSeq=${participant.participantSeq}`, setCurrentPath);
    }
  };

  const handleNew = () => {
    setForm({
      ...emptyDetail,
      status: isOrganizationRole ? 'draft' : 'published',
      eventType: isOrganizationRole ? 'side' : 'main',
    });
    setAttachmentFiles([]);
    setEventParticipants([]);
    setEventParticipantKeyword('');
    setSelectedSeq(null);
    setSubmitAttempted(false);
    setPricingAmountDrafts({});
    setMode('detail');
  };

  if (mode === 'detail') {
    const detailStatusLabel = EVENT_STATUS_LABELS[form.status] ?? form.status ?? 'Published';
    const detailStatusTone = EVENT_STATUS_TONE[form.status] ?? 'green';
    const rejectionReason = form.rejectionReason?.trim();
    const discountPriceTypeOptions = PRICE_TYPE_OPTIONS.filter((option) => (
      (form.pricingList ?? []).some((pricing) => pricing.priceType === option.value)
    ));

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
            {canDelete && (
              <button type="button" className="saf-action-btn is-danger" onClick={handleDeleteSelected} disabled={saving}>
                <StopOutlined />
                <span>Delete</span>
              </button>
            )}
            {canRequestApproval && (
              <button type="button" className="saf-action-btn is-approve" onClick={handleRequestApproval} disabled={saving}>
                <SendOutlined />
                <span>Request Approval</span>
              </button>
            )}
            {canCancelApproval && (
              <button type="button" className="saf-action-btn is-secondary" onClick={handleCancelApproval} disabled={saving}>
                <RollbackOutlined />
                <span>Move to Draft</span>
              </button>
            )}
            {canReviseRejected && (
              <button type="button" className="saf-action-btn is-secondary" onClick={handleReviseRejected} disabled={saving}>
                <RollbackOutlined />
                <span>Revise</span>
              </button>
            )}
            {canReviewApproval && (
              <>
                <button type="button" className="saf-action-btn is-approve" onClick={() => handleReviewApproval(true)} disabled={saving}>
                  <CheckCircleOutlined />
                  <span>Approve</span>
                </button>
                <button type="button" className="saf-action-btn is-danger" onClick={() => handleReviewApproval(false)} disabled={saving}>
                  <CloseCircleOutlined />
                  <span>Reject</span>
                </button>
              </>
            )}
            {canEdit && (
              <button type="button" className="saf-action-btn is-primary" onClick={handleSave} disabled={saving}>
                <SaveOutlined />
                <span>{isNew ? 'Register' : 'Save'}</span>
              </button>
            )}
          </div>
        </header>

        {form.status === 'rejected' && (
          <section className="saf-event-rejection-notice">
            <span className="saf-status is-red">Rejected</span>
            <p>{rejectionReason || 'No rejection reason was provided.'}</p>
          </section>
        )}

        <div className={`saf-event-detail-grid${isOfficialEvent ? ' is-single' : ''}`}>
          <section className="saf-panel">
            <PanelTitle title="Basic Information" subtitle="Based on the events table." />
            <div className="saf-form-grid">
              <Field label="Event Name *" invalid={isRequiredEmpty(form.title)} wide>
                <input
                  value={form.title}
                  disabled={!canEdit}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="e.g., Seoul International Arbitration Conference 2026"
                />
              </Field>
              <Field label={`Event URL Key${isOfficialEvent ? ' *' : ''}`} invalid={isSlugInvalid} wide>
                <input
                  value={form.slug ?? ''}
                  disabled={!canEdit}
                  onChange={(e) => updateForm('slug', e.target.value.toLowerCase())}
                  placeholder="event1"
                />
              </Field>
              <Field label="Event Type *" invalid={isRequiredEmpty(form.eventType)}>
                <select
                  value={form.eventType}
                  disabled={!canEdit || isOrganizationRole}
                  onChange={(e) => updateEventType(e.target.value)}
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
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  minuteStep={5}
                  needConfirm={false}
                  style={{ width: '100%' }}
                  placeholder="Select start date & time"
                  value={toDayjs(form.eventStartDt)}
                  disabled={!canEdit}
                  onChange={(d) => updateForm('eventStartDt', fromDayjs(d))}
                />
              </Field>
              <Field label="End Date *" invalid={isRequiredEmpty(form.eventEndDt) || isDateRangeInvalid}>
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  minuteStep={5}
                  needConfirm={false}
                  style={{ width: '100%' }}
                  placeholder="Select end date & time"
                  value={toDayjs(form.eventEndDt)}
                  disabled={!canEdit}
                  onChange={(d) => updateForm('eventEndDt', fromDayjs(d))}
                />
              </Field>
              <Field label="Registration Type *" wide>
                <select
                  value={form.registrationType}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const next = e.target.value as RegistrationType;
                    setForm((prev) => ({
                      ...prev,
                      registrationType: next,
                      // External 외에는 URL 비움, none이면 등록 시작/종료도 비움
                      registrationUrl: next === 'external' ? prev.registrationUrl : '',
                      registrationStartDt: next === 'none' ? '' : prev.registrationStartDt,
                      registrationEndDt: next === 'none' ? '' : prev.registrationEndDt,
                    }));
                  }}
                >
                  {REGISTRATION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>
              {isExternalRegistration && (
                <Field label="Registration URL *" invalid={isUrlInvalid} wide>
                  <input
                    value={form.registrationUrl ?? ''}
                    disabled={!canEdit}
                    onChange={(e) => updateForm('registrationUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              )}
              {showRegistrationDates && (
                <Field label="Registration Open *" invalid={isRegStartRequiredEmpty || isRegRangeInvalid}>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    minuteStep={5}
                    needConfirm={false}
                    style={{ width: '100%' }}
                    placeholder="Select registration open date & time"
                    value={toDayjs(form.registrationStartDt)}
                    disabled={!canEdit}
                    onChange={(d) => updateForm('registrationStartDt', fromDayjs(d))}
                  />
                </Field>
              )}
              {showRegistrationDates && (
                <Field label="Registration Close *" invalid={isRegEndRequiredEmpty || isRegRangeInvalid || isRegAfterEventInvalid}>
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    minuteStep={5}
                    needConfirm={false}
                    style={{ width: '100%' }}
                    placeholder="Select registration close date & time"
                    value={toDayjs(form.registrationEndDt)}
                    disabled={!canEdit}
                    onChange={(d) => updateForm('registrationEndDt', fromDayjs(d))}
                  />
                </Field>
              )}
              <Field label="Max Participants">
                <input
                  type="number"
                  min={0}
                  value={form.maxParticipants ?? ''}
                  disabled={!canEdit}
                  onChange={(e) => updateForm('maxParticipants', e.target.value === '' ? null : Number(e.target.value))}
                  placeholder="e.g., 300"
                />
              </Field>
              <Field label="Pricing">
                <select
                  value={form.isPaid ? 'Y' : 'N'}
                  disabled={!canEdit || !canUsePaidPricing}
                  onChange={(e) => updatePricingMode(e.target.value === 'Y')}
                >
                  <option value="N">Free</option>
                  <option value="Y">Paid</option>
                </select>
              </Field>
              <Field label="Venue *" invalid={isRequiredEmpty(form.location)} wide>
                <input
                  value={form.location ?? ''}
                  disabled={!canEdit}
                  onChange={(e) => updateForm('location', e.target.value)}
                  placeholder="e.g., Conrad Seoul · 511 Yeongdong-daero, Gangnam-gu, Seoul"
                />
              </Field>
              <Field label="Email Top Image" wide>
                <div className="saf-thumbnail-uploader">
                  <EventEmailImageUpload
                    fileList={emailHeaderImageFiles}
                    onChange={setEmailHeaderImageFiles}
                    disabled={!canEdit}
                  />
                  <p className="saf-hint-inline">1 image only (JPG/PNG/GIF/WebP/SVG) · used at the top of event emails.</p>
                </div>
              </Field>
              <Field label="Attachments" wide>
                <div className="saf-thumbnail-uploader">
                  <CustomFile
                    fileList={attachmentFiles}
                    onFileListChange={setAttachmentFiles}
                    isEditable={canEdit}
                  />
                  <p className="saf-hint-inline">Up to 5 files (PDF, DOCX, etc.) · max 30MB each · drag to reorder.</p>
                </div>
              </Field>
            </div>
          </section>

          {isSideEvent && (
            <section className="saf-panel saf-event-description-panel">
              <PanelTitle title="Description *" subtitle="Detailed event content displayed on the public page." />
              <div className={`saf-event-description-editor${isContentRequiredEmpty ? ' is-invalid' : ''}`}>
                <CustomRichEditor
                  key={selectedSeq ?? 'new'}
                  value={form.description ?? form.content ?? ''}
                  isEditable={canEdit}
                  onChange={(html) => setForm((prev) => ({ ...prev, description: html, content: html }))}
                  placeholder="Event overview, topics, target audience, agenda, speakers, etc."
                  height={480}
                  textColorOptions={EVENT_EDITOR_TEXT_COLOR_OPTIONS}
                />
              </div>
            </section>
          )}
        </div>

        {isOfficialEvent && (
          <OfficialEventPageBuilder
            eventSeq={isNew ? null : selectedSeq}
            canEdit={canEdit}
          />
        )}

        {form.isPaid && (
          <section className="saf-panel saf-event-pricing-panel">
            <PanelTitle title="Pricing" subtitle="Manage event-specific price tiers and discount codes." />

            <div className="saf-pricing-block">
              <div className="saf-panel-title-row">
                <PanelTitle title="Pricing Tiers" subtitle="Early Bird, Regular, Student, and Member pricing for this event." />
                {canEdit && (
                  <button type="button" className="saf-action-btn is-secondary" onClick={addPricingRow}>
                    <PlusOutlined />
                    <span>Add Price</span>
                  </button>
                )}
              </div>
              <div className="saf-table-wrap saf-pricing-table-wrap">
                <table className="saf-table saf-pricing-table">
                  <thead>
                    <tr>
                      <th><GridRequiredHeader>Type</GridRequiredHeader></th>
                      <th><GridRequiredHeader>Name</GridRequiredHeader></th>
                      <th><GridRequiredHeader>Currency</GridRequiredHeader></th>
                      <th><GridRequiredHeader>Amount</GridRequiredHeader></th>
                      <th>Sales Start</th>
                      <th>Sales End</th>
                      <th>Active</th>
                      <th>Sold</th>
                      {canEdit && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(form.pricingList ?? []).map((pricing, index) => {
                      const locked = isPricingLocked(pricing);
                      return (
                      <tr key={pricing.eventPricingSeq ?? `pricing-${index}`}>
                        <td>
                          <select
                            value={pricing.priceType || ''}
                            className={requiredGridClass(isMissingText(pricing.priceType))}
                            aria-invalid={submitAttempted && isMissingText(pricing.priceType)}
                            disabled={!canEdit || locked}
                            title={locked ? 'This price type has payment history and cannot be changed.' : undefined}
                            onChange={(e) => updatePricingType(index, e.target.value)}
                          >
                            <option value="">Select</option>
                            {PRICE_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            value={pricing.priceName ?? ''}
                            className={requiredGridClass(isMissingText(pricing.priceName))}
                            aria-invalid={submitAttempted && isMissingText(pricing.priceName)}
                            disabled={!canEdit}
                            onChange={(e) => updatePricingRow(index, { priceName: e.target.value })}
                            placeholder="Display name"
                          />
                        </td>
                        <td>
                          <select
                            value={pricing.currencyCode || ''}
                            className={requiredGridClass(isMissingText(pricing.currencyCode))}
                            aria-invalid={submitAttempted && isMissingText(pricing.currencyCode)}
                            disabled={!canEdit}
                            onChange={(e) => updatePricingRow(index, { currencyCode: e.target.value })}
                          >
                            <option value="">Select</option>
                            {CURRENCY_OPTIONS.map((currency) => (
                              <option key={currency} value={currency}>{currency}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={pricingAmountDrafts[getPricingAmountKey(pricing, index)] ?? formatPricingAmount(pricing.amount)}
                            className={requiredGridClass(isInvalidPositiveAmount(pricing.amount))}
                            aria-invalid={submitAttempted && isInvalidPositiveAmount(pricing.amount)}
                            disabled={!canEdit}
                            onChange={(e) => updatePricingAmountInput(index, pricing, e.target.value)}
                            onBlur={() => finalizePricingAmountInput(index, pricing)}
                            placeholder="0.0"
                          />
                        </td>
                        <td>
                          <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            minuteStep={5}
                            needConfirm={false}
                            style={{ width: '100%' }}
                            value={toDayjs(pricing.salesStartAt)}
                            disabled={!canEdit}
                            onChange={(d) => updatePricingRow(index, { salesStartAt: fromDayjs(d) })}
                          />
                        </td>
                        <td>
                          <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            minuteStep={5}
                            needConfirm={false}
                            style={{ width: '100%' }}
                            value={toDayjs(pricing.salesEndAt)}
                            disabled={!canEdit}
                            onChange={(d) => updatePricingRow(index, { salesEndAt: fromDayjs(d) })}
                          />
                        </td>
                        <td>
                          <select
                            value={pricing.useYn || 'Y'}
                            disabled={!canEdit}
                            onChange={(e) => updatePricingRow(index, { useYn: e.target.value })}
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </td>
                        <td className="saf-pricing-count-cell">
                          {pricing.soldCount ?? 0}
                        </td>
                        {canEdit && (
                          <td className="saf-pricing-action-cell">
                            <button
                              type="button"
                              className="saf-table-icon-btn is-danger"
                              onClick={() => removePricingRow(index)}
                              disabled={locked}
                              title={locked ? 'This price has payment history and cannot be deleted.' : 'Delete price'}
                            >
                              <DeleteOutlined />
                            </button>
                          </td>
                        )}
                      </tr>
                      );
                    })}
                    {!(form.pricingList ?? []).length && (
                      <tr>
                        <td colSpan={canEdit ? 9 : 8} className="saf-event-empty">
                          <CalendarOutlined />
                          <span>No pricing tiers. Add at least one price for paid events.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="saf-pricing-block">
              <div className="saf-panel-title-row">
                <PanelTitle title="Discount Codes" subtitle="Optional coupon codes for this event." />
                {canEdit && (
                  <button type="button" className="saf-action-btn is-secondary" onClick={addDiscountCodeRow}>
                    <PlusOutlined />
                    <span>Add Discount Code</span>
                  </button>
                )}
              </div>
              <div className="saf-table-wrap saf-pricing-table-wrap">
                <table className="saf-table saf-discount-table">
                  <thead>
                    <tr>
                      <th><GridRequiredHeader>Code</GridRequiredHeader></th>
                      <th><GridRequiredHeader>Type</GridRequiredHeader></th>
                      <th><GridRequiredHeader>Value</GridRequiredHeader></th>
                      <th><GridRequiredHeader>Currency</GridRequiredHeader></th>
                      <th>Applies To</th>
                      <th>Usage Limit</th>
                      <th>Valid From</th>
                      <th>Valid To</th>
                      <th>Active</th>
                      <th>Used</th>
                      {canEdit && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(form.discountCodes ?? []).map((discount, index) => {
                      const locked = isDiscountCodeLocked(discount);
                      return (
                      <tr key={discount.discountCodeSeq ?? `discount-${index}`}>
                        <td>
                          <input
                            value={discount.discountCode ?? ''}
                            className={requiredGridClass(isMissingText(discount.discountCode))}
                            aria-invalid={submitAttempted && isMissingText(discount.discountCode)}
                            disabled={!canEdit || locked}
                            title={locked ? 'This discount code has usage history and cannot be changed.' : undefined}
                            onChange={(e) => updateDiscountCodeRow(index, { discountCode: e.target.value.toUpperCase() })}
                            placeholder="EARLY10"
                          />
                        </td>
                        <td>
                          <select
                            value={discount.discountType || ''}
                            className={requiredGridClass(isMissingText(discount.discountType))}
                            aria-invalid={submitAttempted && isMissingText(discount.discountType)}
                            disabled={!canEdit}
                            onChange={(e) => updateDiscountType(index, e.target.value)}
                          >
                            <option value="">Select</option>
                            {DISCOUNT_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={discount.discountValue ?? ''}
                            className={requiredGridClass(isDiscountValueInvalid(discount))}
                            aria-invalid={submitAttempted && isDiscountValueInvalid(discount)}
                            disabled={!canEdit}
                            onChange={(e) => updateDiscountCodeRow(index, { discountValue: e.target.value === '' ? null : Number(e.target.value) })}
                            placeholder={discount.discountType === 'amount' ? '50.00' : '10'}
                          />
                        </td>
                        <td>
                          <select
                            value={discount.discountType === 'amount' ? (discount.currencyCode || '') : ''}
                            className={requiredGridClass(isDiscountCurrencyInvalid(discount))}
                            aria-invalid={submitAttempted && isDiscountCurrencyInvalid(discount)}
                            disabled={!canEdit || discount.discountType !== 'amount'}
                            onChange={(e) => updateDiscountCodeRow(index, { currencyCode: e.target.value })}
                          >
                            <option value="">-</option>
                            {CURRENCY_OPTIONS.map((currency) => (
                              <option key={currency} value={currency}>{currency}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={discount.appliesToPriceType ?? ''}
                            disabled={!canEdit}
                            onChange={(e) => updateDiscountCodeRow(index, { appliesToPriceType: e.target.value })}
                          >
                            <option value="">All Pricing</option>
                            {discountPriceTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            value={discount.usageLimit ?? ''}
                            disabled={!canEdit}
                            onChange={(e) => updateDiscountCodeRow(index, { usageLimit: e.target.value === '' ? null : Number(e.target.value) })}
                            placeholder="No limit"
                          />
                        </td>
                        <td>
                          <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            minuteStep={5}
                            needConfirm={false}
                            style={{ width: '100%' }}
                            value={toDayjs(discount.validFromAt)}
                            disabled={!canEdit}
                            onChange={(d) => updateDiscountCodeRow(index, { validFromAt: fromDayjs(d) })}
                          />
                        </td>
                        <td>
                          <DatePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            minuteStep={5}
                            needConfirm={false}
                            style={{ width: '100%' }}
                            value={toDayjs(discount.validToAt)}
                            disabled={!canEdit}
                            onChange={(d) => updateDiscountCodeRow(index, { validToAt: fromDayjs(d) })}
                          />
                        </td>
                        <td>
                          <select
                            value={discount.useYn || 'Y'}
                            disabled={!canEdit}
                            onChange={(e) => updateDiscountCodeRow(index, { useYn: e.target.value })}
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </td>
                        <td className="saf-pricing-count-cell">
                          {(discount.usedCount ?? 0) > 0 && discount.discountCodeSeq ? (
                            <button
                              type="button"
                              className="saf-link-button"
                              onClick={() => openDiscountUsageModal(discount)}
                              title="View users who used this code"
                            >
                              {formatDiscountUsage(discount)}
                            </button>
                          ) : (
                            formatDiscountUsage(discount)
                          )}
                        </td>
                        {canEdit && (
                          <td className="saf-pricing-action-cell">
                            <button
                              type="button"
                              className="saf-table-icon-btn is-danger"
                              onClick={() => removeDiscountCodeRow(index)}
                              disabled={locked}
                              title={locked ? 'This discount code has usage history and cannot be deleted.' : 'Delete discount code'}
                            >
                              <DeleteOutlined />
                            </button>
                          </td>
                        )}
                      </tr>
                      );
                    })}
                    {!(form.discountCodes ?? []).length && (
                      <tr>
                        <td colSpan={canEdit ? 11 : 10} className="saf-event-empty">
                          <CalendarOutlined />
                          <span>No discount codes. Add codes only when a coupon is needed.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {!isNew && (
          <section className="saf-panel saf-event-participants-panel">
            <div className="saf-panel-title-row">
              <PanelTitle
                title="Participants"
                subtitle={participantSubtitle}
              />
              <button
                type="button"
                className="saf-action-btn is-secondary"
                onClick={handleExportParticipants}
                disabled={participantsLoading || !filteredEventParticipants.length}
              >
                <DownloadOutlined />
                <span>Export Participants</span>
              </button>
            </div>
            <div className="saf-event-participants-search-row">
              <div className="saf-search saf-event-participants-search">
                <SearchOutlined />
                <input
                  value={eventParticipantKeyword}
                  placeholder={`Search by name, email, organization, position, country${showPaymentNameColumn ? ', or payment name' : ''}`}
                  onChange={(event) => setEventParticipantKeyword(event.target.value)}
                />
              </div>
            </div>
            <div className="saf-table-wrap">
              <table className={`saf-table saf-event-participants-table${showPaymentNameColumn ? ' is-paid' : ''}`}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Position</th>
                    <th>Country</th>
                    {showPaymentNameColumn && <th>Payment Name</th>}
                    <th>Status</th>
                    <th>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {eventParticipantPagination.pagedItems.map((participant) => {
                    const registration = participant.events[0];
                    return (
                      <tr
                        key={participant.participantSeq}
                        className="saf-clickable-row"
                        tabIndex={0}
                        onClick={() => handleOpenParticipantDetail(participant)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleOpenParticipantDetail(participant);
                          }
                        }}
                      >
                        <td><strong>{participant.fullName || '-'}</strong></td>
                        <td>{participant.email}</td>
                        <td>{participant.organizationName || '-'}</td>
                        <td>{participant.position || '-'}</td>
                        <td>{participant.country || '-'}</td>
                        {showPaymentNameColumn && <td>{registration?.paymentName || '-'}</td>}
                        <td>{renderParticipationStatus(registration?.status)}</td>
                        <td>{formatDateTime(registration?.registeredAt)}</td>
                      </tr>
                    );
                  })}
                  {!filteredEventParticipants.length && (
                    <tr>
                      <td colSpan={showPaymentNameColumn ? 8 : 7} className="saf-event-empty">
                        <CalendarOutlined />
                        <span>
                          {participantsLoading
                            ? 'Loading...'
                            : eventParticipantKeyword.trim()
                              ? 'No participants matched your search.'
                              : 'No participants registered for this event.'}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <AdminGridPagination {...eventParticipantPagination} />
            </div>
          </section>
        )}

        <Modal
          title={discountUsageModal.code ? `Discount Code Usage · ${discountUsageModal.code}` : 'Discount Code Usage'}
          open={discountUsageModal.open}
          onCancel={closeDiscountUsageModal}
          footer={null}
          width={960}
          destroyOnHidden
        >
          <div className="saf-table-wrap">
            <table className="saf-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Position</th>
                  <th>Country</th>
                  <th>Payment Name</th>
                  <th>Status</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {discountUsageModal.items.map((row, idx) => (
                  <tr key={`${row.email ?? 'row'}-${idx}`}>
                    <td><strong>{row.name || '-'}</strong></td>
                    <td>{row.email || '-'}</td>
                    <td>{row.organization || '-'}</td>
                    <td>{row.position || '-'}</td>
                    <td>{row.country || '-'}</td>
                    <td>{row.paymentName || '-'}</td>
                    <td>{renderParticipationStatus(row.status)}</td>
                    <td>{formatDateTime(row.registeredAt)}</td>
                  </tr>
                ))}
                {!discountUsageModal.loading && !discountUsageModal.items.length && (
                  <tr>
                    <td colSpan={8} className="saf-event-empty">
                      <CalendarOutlined />
                      <span>No usage history for this discount code yet.</span>
                    </td>
                  </tr>
                )}
                {discountUsageModal.loading && (
                  <tr>
                    <td colSpan={8} className="saf-event-empty">
                      <span>Loading...</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>

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
            <span>New Event</span>
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
        <Select
          className="saf-filter-select"
          mode="multiple"
          value={status}
          onChange={(values: string[]) => setStatus(values)}
          options={STATUS_FILTERS}
          placeholder="All Status"
          maxTagCount="responsive"
          allowClear
          style={{ minWidth: 220 }}
        />
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
            </tr>
          </thead>
          <tbody>
            {eventPagination.pagedItems.map((event) => {
              const typeLabel = EVENT_TYPE_LABELS[event.eventType] ?? event.eventType ?? '-';
              const typeTone = EVENT_TYPE_TONE[event.eventType] ?? 'gray';
              const statusLabel = EVENT_STATUS_LABELS[event.status] ?? event.status ?? '-';
              const statusTone = EVENT_STATUS_TONE[event.status] ?? 'gray';
              const cap = event.maxParticipants ?? 0;
              const reg = event.registrationCount ?? 0;
              return (
                <tr key={event.eventSeq} onClick={() => fetchDetail(event.eventSeq)}>
                  <td><strong>{event.title}</strong></td>
                  <td>{formatDateRange(event.eventStartDt, event.eventEndDt)}</td>
                  <td><span className={`saf-status is-${typeTone}`}>{typeLabel}</span></td>
                  <td>{event.organizationName || 'KCAB'}</td>
                  <td>{cap > 0 ? `${reg}/${cap}` : `${reg}`}</td>
                  <td><span className={`saf-status is-${statusTone}`}>{statusLabel}</span></td>
                </tr>
              );
            })}
            {!events.length && (
              <tr>
                <td colSpan={6} className="saf-event-empty">
                  <CalendarOutlined />
                  <span>{loading ? 'Loading...' : 'No events found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination {...eventPagination} />
      </section>
    </div>
  );
}

function readPendingDashboardEventSeq(): number | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(DASHBOARD_EVENT_DETAIL_KEY);
  window.sessionStorage.removeItem(DASHBOARD_EVENT_DETAIL_KEY);
  if (!value) return null;
  const eventSeq = Number(value);
  return Number.isFinite(eventSeq) && eventSeq > 0 ? eventSeq : null;
}

function formatDateTime(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatParticipationStatusText(status?: string | null): string {
  const value = status ?? 'unknown';
  const statusLabels: Record<string, string> = {
    registered: 'Registered',
    cancelled: 'Cancelled',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return statusLabels[value] ?? value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildParticipantExcelRows(participants: ParticipantListItem[]) {
  return participants.map((participant) => {
    const registration = participant.events[0];
    return {
      name: participant.fullName || '',
      email: participant.email || '',
      organization: participant.organizationName || '',
      position: participant.position || '',
      country: participant.country || '',
      paymentName: registration?.paymentName || '',
      status: formatParticipationStatusText(registration?.status),
      registeredAt: formatDateTime(registration?.registeredAt),
    };
  });
}

function sanitizeFileName(value: string): string {
  return (value || 'event')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 80);
}

function participantMatchesKeyword(participant: ParticipantListItem, keyword: string): boolean {
  const registration = participant.events[0];
  return [
    participant.fullName,
    participant.email,
    participant.organizationName,
    participant.position,
    participant.country,
    registration?.paymentName,
    formatParticipationStatusText(registration?.status),
    formatDateTime(registration?.registeredAt),
  ].some((value) => (value ?? '').toLowerCase().includes(keyword));
}

function renderParticipationStatus(status?: string | null) {
  const value = status ?? 'unknown';
  const label = formatParticipationStatusText(value);
  const tone = value === 'registered' ? 'green' : value === 'cancelled' ? 'red' : 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function formatDiscountUsage(discount: EventDiscountCodeItem): string {
  const used = discount.usedCount ?? 0;
  return discount.usageLimit !== null && discount.usageLimit !== undefined ? `${used} / ${discount.usageLimit}` : String(used);
}

function isPricingLocked(pricing: EventPricingItem): boolean {
  return (pricing.soldCount ?? 0) > 0 || (pricing.paymentCount ?? 0) > 0;
}

function isDiscountCodeLocked(discount: EventDiscountCodeItem): boolean {
  return (discount.usedCount ?? 0) > 0 || (discount.paymentCount ?? 0) > 0;
}

function GridRequiredHeader({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <span className="saf-grid-required-mark" aria-hidden="true">*</span>
    </>
  );
}

const IMAGE_MAX_SIZE = 30 * 1024 * 1024;

const getFileUid = (file: FileDetailType) => (
  file.fileDtlSeq ? String(file.fileDtlSeq) : file.uid ?? `${file.fileNm}-${file.sortSeq}`
);

const isBrowserReadableUrl = (url?: string): boolean => {
  if (!url) return false;
  return /^(https?:|data:|blob:|\/api\/|\/_next\/|\/images\/|\/uploads?\/)/i.test(url);
};

const getImagePreviewUrl = (file: Partial<FileDetailType>): string | undefined => {
  const directUrl = file.fileUrl ?? file.filePath;
  if (!directUrl) return undefined;
  if (isBrowserReadableUrl(directUrl)) return directUrl;
  if (file.filePath) return `/api/download-file?filePath=${encodeURIComponent(file.filePath)}`;
  return undefined;
};

const revokeLocalPreview = (file: FileDetailType) => {
  const previewUrl = file.fileUrl ?? file.filePath;
  if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
};

const reindexImageFiles = (files: FileDetailType[]) => {
  let nextSortSeq = 1;
  return files.map((file) => {
    if (file.iudType === IudType.D) return { ...file, sortSeq: 0 };
    return { ...file, sortSeq: nextSortSeq++ };
  });
};

function EventEmailImageUpload({
  fileList,
  onChange,
  disabled,
}: {
  fileList: FileDetailType[];
  onChange: (files: FileDetailType[]) => void;
  disabled?: boolean;
}) {
  const { message } = App.useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const visibleFile = fileList.find((file) => file.iudType !== IudType.D);
  const previewUrl = visibleFile ? getImagePreviewUrl(visibleFile) : undefined;

  const createImageFileDetail = (file: File): FileDetailType | null => {
    if (!file.type?.startsWith('image/')) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return null;
    }
    if (file.size > IMAGE_MAX_SIZE) {
      message.error('Only images up to 30MB can be uploaded.');
      return null;
    }

    const uploadFile = file as RcFile;
    uploadFile.uid = uploadFile.uid ?? `event-email-image-${Date.now()}`;
    const localPreviewUrl = URL.createObjectURL(uploadFile);
    return {
      uid: uploadFile.uid,
      fileNm: uploadFile.name,
      filePath: localPreviewUrl,
      fileUrl: localPreviewUrl,
      sortSeq: 1,
      originFileObj: uploadFile,
      iudType: IudType.I,
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    event.target.value = '';
    if (!nextFile) return;

    const nextImage = createImageFileDetail(nextFile);
    if (!nextImage) return;

    const retainedFiles = fileList.flatMap((file) => {
      if (file.iudType === IudType.D) return [file];
      if (file.iudType === IudType.I) {
        revokeLocalPreview(file);
        return [];
      }
      return [{ ...file, iudType: IudType.D }];
    });

    onChange(reindexImageFiles([...retainedFiles, nextImage]));
  };

  const handleRemove = () => {
    if (!visibleFile) return;

    const nextFiles = fileList.flatMap((file) => {
      if (getFileUid(file) !== getFileUid(visibleFile)) return [file];
      if (file.iudType === IudType.I) {
        revokeLocalPreview(file);
        return [];
      }
      return [{ ...file, iudType: IudType.D }];
    });

    onChange(reindexImageFiles(nextFiles));
  };

  const openFileDialog = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handlePreview = () => {
    if (!previewUrl) return;
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };

  useEffect(() => () => {
    for (const file of fileList) {
      if (file.iudType === IudType.I) revokeLocalPreview(file);
    }
  }, []);

  return (
    <>
      <div className="saf-organization-image-upload">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
        {visibleFile && previewUrl ? (
          <div className="saf-organization-image-card">
            <img src={previewUrl} alt="Email top" />
            <div className="saf-organization-image-actions">
              <button type="button" aria-label="Preview image" onClick={handlePreview}>
                <EyeOutlined />
              </button>
              <button type="button" aria-label="Replace image" onClick={openFileDialog} disabled={disabled}>
                <PlusOutlined />
              </button>
              <button type="button" aria-label="Remove image" onClick={handleRemove} disabled={disabled}>
                <DeleteOutlined />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="saf-organization-image-empty"
            onClick={openFileDialog}
            disabled={disabled}
          >
            <PlusOutlined />
            <span>Upload</span>
          </button>
        )}
      </div>
      <Modal
        open={previewOpen}
        title="Email Top Image"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Email top preview" src={previewImage} style={{ width: '100%' }} />
      </Modal>
    </>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const required = title.endsWith(' *');
  const titleText = required ? title.slice(0, -2) : title;
  return (
    <div className="saf-panel-title">
      <h2>
        {titleText}
        {required && <em className="saf-required-mark">*</em>}
      </h2>
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
