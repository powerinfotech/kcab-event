'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Popover, Select } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, CloseOutlined, CreditCardOutlined, ReloadOutlined, SaveOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import {
  callGetParticipantEventOptions,
  callGetParticipantList,
  callGetParticipantTypeOptions,
  callSaveParticipantEventTypes,
} from '@api/admin/ParticipantManagementApi';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import {
  ParticipantEventItem,
  ParticipantEventOption,
  ParticipantListItem,
  ParticipantTypeOption,
} from '@interface/admin/ParticipantManagement';
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONE,
  PaymentStatus,
} from '@interface/admin/PaymentManagement';
import { EVENT_TYPE_LABELS, EVENT_TYPE_TONE } from '@interface/event/EventManagement';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

const PARTICIPANT_DETAIL_KEY = 'saf.admin.participantDetailSeq';
const PARTICIPANT_DETAIL_ITEM_KEY = 'saf.admin.participantDetailItem';
const PARTICIPANT_RETURN_PATH_KEY = 'saf.admin.participantReturnPath';

const PARTICIPATION_STATUS_OPTIONS = [
  { value: 'registered', label: 'Registered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PARTICIPATION_STATUS_LABELS: Record<string, string> = {
  registered: 'Registered',
  cancelled: 'Cancelled',
};

const PARTICIPATION_STATUS_TONE: Record<string, 'green' | 'red' | 'gray' | 'yellow'> = {
  registered: 'green',
  cancelled: 'red',
};

function formatDateTime(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(amount?: string | number | null, currency?: string | null): string {
  const n = toNumber(amount);
  const cur = currency || 'KRW';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: cur === 'KRW' ? 0 : 2,
    }).format(n);
  } catch {
    return `${cur} ${n.toLocaleString()}`;
  }
}

function renderStatus(status?: string | null) {
  const value = status ?? 'unknown';
  const label = PARTICIPATION_STATUS_LABELS[value] ?? value;
  const tone = PARTICIPATION_STATUS_TONE[value] ?? 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function renderPaymentStatus(status?: string | null) {
  if (!status) return <span className="saf-status is-gray">No Payment</span>;
  const value = status as PaymentStatus;
  const label = PAYMENT_STATUS_LABELS[value] ?? status;
  const tone = PAYMENT_STATUS_TONE[value] ?? 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function eventOptionLabel(option: ParticipantEventOption): string {
  const typeLabel = EVENT_TYPE_LABELS[option.eventType] ?? option.eventType;
  return `${option.title} · ${typeLabel}`;
}

function selectedEventSummaryLabel(selectedEventSeqs: number[], eventOptions: ParticipantEventOption[]): string {
  if (selectedEventSeqs.length === 1) {
    const selectedOption = eventOptions.find((option) => option.eventSeq === selectedEventSeqs[0]);
    return selectedOption ? eventOptionLabel(selectedOption) : '1 event selected';
  }
  return `+${selectedEventSeqs.length} selected`;
}

function selectedEventSummaryTitle(selectedEventSeqs: number[], eventOptions: ParticipantEventOption[]): string {
  return selectedEventSeqs
    .map((eventSeq) => eventOptions.find((option) => option.eventSeq === eventSeq))
    .filter((option): option is ParticipantEventOption => Boolean(option))
    .map(eventOptionLabel)
    .join('\n');
}

function readPendingParticipantDetailSeq(): number | null {
  if (typeof window === 'undefined') return null;
  let value = window.sessionStorage.getItem(PARTICIPANT_DETAIL_KEY);
  if (value) {
    window.sessionStorage.removeItem(PARTICIPANT_DETAIL_KEY);
  } else {
    value = new URLSearchParams(window.location.search).get('participantSeq');
  }
  if (!value) return null;
  const participantSeq = Number(value);
  if (Number.isFinite(participantSeq) && participantSeq > 0 && window.location.search) {
    window.history.replaceState(null, '', window.location.pathname);
  }
  return Number.isFinite(participantSeq) && participantSeq > 0 ? participantSeq : null;
}

function readPendingParticipantDetailItem(): ParticipantListItem | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(PARTICIPANT_DETAIL_ITEM_KEY);
  window.sessionStorage.removeItem(PARTICIPANT_DETAIL_ITEM_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as ParticipantListItem;
  } catch {
    return null;
  }
}

function readParticipantReturnPath(): string | null {
  if (typeof window === 'undefined') return null;
  const value = window.sessionStorage.getItem(PARTICIPANT_RETURN_PATH_KEY);
  if (value) {
    window.sessionStorage.removeItem(PARTICIPANT_RETURN_PATH_KEY);
  }
  return value || null;
}

export default function Participants() {
  const { message, modal } = App.useApp();
  const setCurrentPath = useSetAtom(currentPathAtom);
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [eventOptions, setEventOptions] = useState<ParticipantEventOption[]>([]);
  const [participantTypeOptions, setParticipantTypeOptions] = useState<ParticipantTypeOption[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedEventSeqs, setSelectedEventSeqs] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantListItem | null>(null);
  const [participantTypeDirty, setParticipantTypeDirty] = useState(false);
  const [savingParticipantTypes, setSavingParticipantTypes] = useState(false);
  const [returnPath, setReturnPath] = useState<string | null>(null);
  const initialLoadRef = useRef(false);

  const fetchParticipants = async (pendingParticipantSeq?: number | null) => {
    setLoading(true);
    try {
      const res = await callGetParticipantList(pendingParticipantSeq ? {} : {
        keyword: keyword.trim() || undefined,
        eventSeqs: selectedEventSeqs,
        statuses: selectedStatuses,
      });
      const list = res?.item ?? [];
      if (pendingParticipantSeq) {
        setKeyword('');
        setSelectedEventSeqs([]);
        setSelectedStatuses([]);
      }
      setParticipants(list);
      if (pendingParticipantSeq) {
        const target = list.find((participant) => participant.participantSeq === pendingParticipantSeq);
        if (target) {
          setSelectedParticipant(target);
          setParticipantTypeDirty(false);
        } else {
          message.warning('Participant was not found.');
        }
      }
    } catch (err) {
      message.error('Failed to load participants.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventOptions = async () => {
    try {
      const res = await callGetParticipantEventOptions();
      setEventOptions(res?.item ?? []);
    } catch {
      setEventOptions([]);
    }
  };

  const fetchParticipantTypeOptions = async () => {
    try {
      const res = await callGetParticipantTypeOptions();
      setParticipantTypeOptions(res?.item ?? []);
    } catch {
      setParticipantTypeOptions([]);
    }
  };

  useEffect(() => {
    fetchEventOptions();
    fetchParticipantTypeOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    const pendingParticipant = readPendingParticipantDetailItem();
    setReturnPath(readParticipantReturnPath());
    if (pendingParticipant) {
      setSelectedParticipant(pendingParticipant);
      setParticipantTypeDirty(false);
    }
    fetchParticipants(readPendingParticipantDetailSeq() ?? pendingParticipant?.participantSeq ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    const totalEvents = participants.reduce((sum, participant) => sum + (participant.eventCount ?? 0), 0);
    const registered = participants.reduce(
      (sum, participant) => sum + participant.events.filter((event) => event.status === 'registered').length,
      0,
    );
    return `${participants.length} participant(s) · ${totalEvents} event registration(s) · ${registered} active`;
  }, [participants]);
  const selectedEventLabel = useMemo(
    () => selectedEventSummaryLabel(selectedEventSeqs, eventOptions),
    [eventOptions, selectedEventSeqs],
  );
  const selectedEventTitle = useMemo(
    () => selectedEventSummaryTitle(selectedEventSeqs, eventOptions),
    [eventOptions, selectedEventSeqs],
  );
  const participantPagination = useClientGridPagination(participants);

  const handleDetailBack = () => {
    if (returnPath) {
      pushPath(returnPath, setCurrentPath);
      return;
    }
    setSelectedParticipant(null);
    setParticipantTypeDirty(false);
  };

  const openParticipantDetail = (participant: ParticipantListItem) => {
    setSelectedParticipant(participant);
    setParticipantTypeDirty(false);
  };

  const handleParticipantTypeChange = (eventParticipantSeq: number, participantTypeCd: string) => {
    const normalizedValue = participantTypeCd || null;
    const selectedOption = participantTypeOptions.find((option) => option.value === normalizedValue);
    setSelectedParticipant((current) => {
      if (!current) return current;
      return {
        ...current,
        events: current.events.map((event) => (
          event.eventParticipantSeq === eventParticipantSeq
            ? {
                ...event,
                participantTypeCd: normalizedValue,
                participantTypeName: normalizedValue ? (selectedOption?.label ?? normalizedValue) : null,
              }
            : event
        )),
      };
    });
    setParticipantTypeDirty(true);
  };

  const persistParticipantTypes = async (participantSnapshot: ParticipantListItem) => {
    setSavingParticipantTypes(true);
    try {
      await callSaveParticipantEventTypes(
        participantSnapshot.participantSeq,
        participantSnapshot.events.map((event) => ({
          eventParticipantSeq: event.eventParticipantSeq,
          participantTypeCd: event.participantTypeCd || null,
        })),
      );
      setParticipants((current) => current.map((participant) => (
        participant.participantSeq === participantSnapshot.participantSeq ? participantSnapshot : participant
      )));
      setParticipantTypeDirty(false);
      message.success('Participant type saved.');
    } catch {
      message.error('Failed to save participant type.');
    } finally {
      setSavingParticipantTypes(false);
    }
  };

  const handleSaveParticipantTypes = () => {
    if (!selectedParticipant || !participantTypeDirty || savingParticipantTypes) return;
    const participantSnapshot = selectedParticipant;
    modal.confirm({
      title: 'Save Participant Type',
      content: 'Do you want to save participant type changes?',
      okText: 'Save',
      cancelText: 'Cancel',
      centered: true,
      onOk: () => persistParticipantTypes(participantSnapshot),
    });
  };

  if (selectedParticipant) {
    return (
      <div className="saf-screen saf-participant-admin-screen">
        <header className="saf-screen-header">
          <div>
            <h1>{formatParticipantName(selectedParticipant)}</h1>
            <p>{selectedParticipant.email}</p>
          </div>
          <div className="saf-screen-actions">
            <button
              type="button"
              className="saf-action-btn is-primary"
              onClick={handleSaveParticipantTypes}
              disabled={!participantTypeDirty || savingParticipantTypes || !selectedParticipant.events.length}
            >
              <SaveOutlined />
              <span>{savingParticipantTypes ? 'Saving...' : 'Save'}</span>
            </button>
            <button type="button" className="saf-action-btn is-secondary" onClick={handleDetailBack}>
              <ArrowLeftOutlined />
              <span>{returnPath ? 'Back' : 'List'}</span>
            </button>
          </div>
        </header>

        <div className="saf-participant-detail-grid">
          <section className="saf-panel">
            <PanelTitle title="Participant Information" />
            <dl className="saf-participant-meta">
              <div><dt>Name</dt><dd>{selectedParticipant.fullName || '-'}</dd></div>
              <div><dt>Email</dt><dd>{selectedParticipant.email || '-'}</dd></div>
              <div><dt>Organization</dt><dd>{selectedParticipant.organizationName || '-'}</dd></div>
              <div><dt>Position</dt><dd>{selectedParticipant.position || '-'}</dd></div>
              <div><dt>Country</dt><dd>{selectedParticipant.country || '-'}</dd></div>
              <div><dt>Latest Registration</dt><dd>{formatDateTime(selectedParticipant.latestRegisteredAt)}</dd></div>
            </dl>
          </section>

          <section className="saf-panel saf-participant-events-panel">
            <PanelTitle title="Participating Events" subtitle={`${selectedParticipant.eventCount ?? 0} event(s)`} />
            <table className="saf-table saf-participant-detail-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Type</th>
                  <th>Participant Type</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Registered At</th>
                  <th>Cancelled At</th>
                </tr>
              </thead>
              <tbody>
                {selectedParticipant.events.map((event) => (
                  <tr key={event.eventParticipantSeq}>
                    <td title={event.eventTitle}>{event.eventTitle}</td>
                    <td>{renderEventType(event.eventType)}</td>
                    <td>
                      <select
                        className="saf-participant-type-select"
                        value={event.participantTypeCd ?? ''}
                        onClick={(clickEvent) => clickEvent.stopPropagation()}
                        onChange={(changeEvent) => handleParticipantTypeChange(
                          event.eventParticipantSeq,
                          changeEvent.target.value,
                        )}
                        disabled={savingParticipantTypes}
                      >
                        <option value="">-</option>
                        {participantTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{renderStatus(event.status)}</td>
                    <td>{renderPaymentInfo(event)}</td>
                    <td>{formatDateTime(event.registeredAt)}</td>
                    <td>{formatDateTime(event.cancelledAt)}</td>
                  </tr>
                ))}
                {!selectedParticipant.events.length && (
                  <tr>
                    <td colSpan={7} className="saf-participant-empty">
                      <CalendarOutlined />
                      <span>No event registrations found.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="saf-screen saf-participant-admin-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Participant Management</h1>
          <p>Participants are grouped by person, with their participating events summarized in the grid.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={() => fetchParticipants()} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row saf-participant-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Search by name or email"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchParticipants();
            }}
          />
        </div>
        <Select
          mode="multiple"
          className="saf-filter-select saf-participant-event-select"
          placeholder="Events"
          value={selectedEventSeqs}
          onChange={(values) => setSelectedEventSeqs(values)}
          options={eventOptions.map((option) => ({
            value: option.eventSeq,
            label: eventOptionLabel(option),
          }))}
          maxTagCount={0}
          maxTagPlaceholder={() => (
            <span
              className={`saf-participant-event-summary ${
                selectedEventSeqs.length === 1 ? 'is-single' : 'is-multiple'
              }`}
              title={selectedEventTitle || selectedEventLabel}
            >
              <span className="saf-participant-event-summary-text">{selectedEventLabel}</span>
              <button
                type="button"
                className="saf-participant-event-clear"
                aria-label="Clear selected events"
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedEventSeqs([]);
                }}
              >
                <CloseOutlined />
              </button>
            </span>
          )}
        />
        <Select
          mode="multiple"
          allowClear
          className="saf-filter-select"
          placeholder="Status"
          value={selectedStatuses}
          onChange={(values) => setSelectedStatuses(values)}
          options={PARTICIPATION_STATUS_OPTIONS}
          maxTagCount="responsive"
        />
        <button type="button" onClick={() => fetchParticipants()}>Search</button>
      </section>

      <p className="saf-summary-line">{summary}</p>

      <section className="saf-table-wrap">
        <table className="saf-table saf-participant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Participating Events</th>
              <th>Event Count</th>
              <th>Status Summary</th>
              <th>Latest Registered At</th>
            </tr>
          </thead>
          <tbody>
            {participantPagination.pagedItems.map((participant) => (
              <tr key={participant.participantSeq} onClick={() => openParticipantDetail(participant)}>
                <td>
                  <strong>{formatParticipantName(participant)}</strong>
                  <span className="saf-participant-position">{participant.position || '-'}</span>
                </td>
                <td>{participant.email}</td>
                <td>{participant.organizationName || '-'}</td>
                <td>{renderEventSummary(participant.events)}</td>
                <td>{participant.eventCount ?? 0}</td>
                <td>{participant.statusSummary || '-'}</td>
                <td>{formatDateTime(participant.latestRegisteredAt)}</td>
              </tr>
            ))}
            {!participants.length && (
              <tr>
                <td colSpan={7} className="saf-participant-empty">
                  <TeamOutlined />
                  <span>{loading ? 'Loading...' : 'No participants found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination {...participantPagination} />
      </section>
    </div>
  );
}

function formatParticipantName(participant: Pick<ParticipantListItem, 'fullName' | 'email' | 'position'>) {
  return participant.fullName || participant.email || '-';
}

function renderEventSummary(events: ParticipantEventItem[]) {
  if (!events.length) return <span className="saf-muted-text">-</span>;
  const latestEvent = [...events].sort((a, b) => {
    const aTime = a.registeredAt ? new Date(a.registeredAt).getTime() : 0;
    const bTime = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
    return bTime - aTime;
  })[0];
  const allTitles = events.map((event) => event.eventTitle).join('\n');

  return (
    <div className="saf-participant-event-list" title={allTitles}>
      <span key={latestEvent.eventParticipantSeq} className="saf-participant-event-chip">
        <span className="saf-participant-event-title">{latestEvent.eventTitle}</span>
        {renderStatus(latestEvent.status)}
      </span>
    </div>
  );
}

function renderEventType(eventType?: string | null) {
  const value = eventType ?? '';
  const label = EVENT_TYPE_LABELS[value] ?? (value || '-');
  const tone = EVENT_TYPE_TONE[value] ?? 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function renderPaymentInfo(event: ParticipantEventItem) {
  if (!event.paymentSeq) {
    return <span className="saf-muted-text">-</span>;
  }

  const content = (
    <div className="saf-payment-popover">
      <div className="saf-payment-popover-header">
        <strong>Payment #{event.paymentSeq}</strong>
        {renderPaymentStatus(event.paymentStatus)}
      </div>
      <dl>
        <div><dt>Ticket</dt><dd>{event.paymentName || '-'}</dd></div>
        <div><dt>Amount</dt><dd>{formatMoney(event.paymentAmount, event.paymentCurrency)}</dd></div>
        <div><dt>Refunded</dt><dd>{formatMoney(event.paymentRefundedAmount ?? 0, event.paymentCurrency)}</dd></div>
        <div><dt>Method</dt><dd>{event.paymentMethod || '-'}</dd></div>
        <div><dt>Order ID</dt><dd>{event.paymentOrderId || '-'}</dd></div>
        <div><dt>Transaction</dt><dd>{event.paymentTransactionId || '-'}</dd></div>
        <div><dt>Paid At</dt><dd>{formatDateTime(event.paymentPaidAt)}</dd></div>
        <div><dt>Cancelled At</dt><dd>{formatDateTime(event.paymentCancelledAt)}</dd></div>
      </dl>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="leftTop">
      <button
        type="button"
        className="saf-payment-popover-trigger"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <CreditCardOutlined />
        {renderPaymentStatus(event.paymentStatus)}
      </button>
    </Popover>
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
