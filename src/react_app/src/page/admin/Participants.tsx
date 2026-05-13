'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Select } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ReloadOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import {
  callGetParticipantEventOptions,
  callGetParticipantList,
} from '@api/admin/ParticipantManagementApi';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import {
  ParticipantEventItem,
  ParticipantEventOption,
  ParticipantListItem,
} from '@interface/admin/ParticipantManagement';
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

function renderStatus(status?: string | null) {
  const value = status ?? 'unknown';
  const label = PARTICIPATION_STATUS_LABELS[value] ?? value;
  const tone = PARTICIPATION_STATUS_TONE[value] ?? 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function eventOptionLabel(option: ParticipantEventOption): string {
  const typeLabel = EVENT_TYPE_LABELS[option.eventType] ?? option.eventType;
  return `${option.title} · ${typeLabel}`;
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
  const { message } = App.useApp();
  const setCurrentPath = useSetAtom(currentPathAtom);
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [eventOptions, setEventOptions] = useState<ParticipantEventOption[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedEventSeqs, setSelectedEventSeqs] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantListItem | null>(null);
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

  useEffect(() => {
    fetchEventOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    const pendingParticipant = readPendingParticipantDetailItem();
    setReturnPath(readParticipantReturnPath());
    if (pendingParticipant) {
      setSelectedParticipant(pendingParticipant);
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
  const participantPagination = useClientGridPagination(participants);

  const handleDetailBack = () => {
    if (returnPath) {
      pushPath(returnPath, setCurrentPath);
      return;
    }
    setSelectedParticipant(null);
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
                  <th>Status</th>
                  <th>Registered At</th>
                  <th>Cancelled At</th>
                </tr>
              </thead>
              <tbody>
                {selectedParticipant.events.map((event) => (
                  <tr key={event.eventParticipantSeq}>
                    <td title={event.eventTitle}>{event.eventTitle}</td>
                    <td>{renderEventType(event.eventType)}</td>
                    <td>{renderStatus(event.status)}</td>
                    <td>{formatDateTime(event.registeredAt)}</td>
                    <td>{formatDateTime(event.cancelledAt)}</td>
                  </tr>
                ))}
                {!selectedParticipant.events.length && (
                  <tr>
                    <td colSpan={5} className="saf-participant-empty">
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
          allowClear
          className="saf-filter-select saf-participant-event-select"
          placeholder="Events"
          value={selectedEventSeqs}
          onChange={(values) => setSelectedEventSeqs(values)}
          options={eventOptions.map((option) => ({
            value: option.eventSeq,
            label: eventOptionLabel(option),
          }))}
          maxTagCount="responsive"
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
              <tr key={participant.participantSeq} onClick={() => setSelectedParticipant(participant)}>
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

function PanelTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="saf-panel-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
