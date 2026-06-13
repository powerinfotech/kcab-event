import React, { useEffect, useMemo, useState } from 'react';
import { callGetPublicEventDetail, callGetPublicEventList } from '@api/event/EventApi';
import { EventDetail, EventListItem } from '@interface/event/EventManagement';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-calendar.png';
import KcabLogo from '../../assets/images/saf-renewal/sponsors/kcab-international.png';

type CalendarView = 'weekly' | 'list';

const DEFAULT_DAYS = [
  '2026-10-25T00:00:00',
  '2026-10-26T00:00:00',
  '2026-10-27T00:00:00',
  '2026-10-28T00:00:00',
  '2026-10-29T00:00:00',
  '2026-10-30T00:00:00',
];

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

export default function PublicCalendar() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<CalendarView>('weekly');
  // Weekly 뷰가 표시하는 주의 월요일. 첫 진입은 오늘이 속한 주.
  const [anchorMonday, setAnchorMonday] = useState(() => mondayOf(new Date()));
  // 선택된 요일. 첫 진입은 오늘, 주를 바꾸면 그 주 월요일.
  const [activeDateKey, setActiveDateKey] = useState(() => toLocalKey(new Date()));
  const [detail, setDetail] = useState<EventDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    callGetPublicEventList({ status: 'published,closed', eventType: 'side' })
      .then((res) => setEvents(sortEvents(res?.item ?? [])))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => groupEventsByDate(events), [events]);

  // Weekly 뷰: anchorMonday 기준 월~일 7일.
  const weekKeys = useMemo(() => weekDaysFrom(anchorMonday), [anchorMonday]);
  // 년/월 드롭다운 컨텍스트는 그 주 목요일이 속한 달 기준(ISO식) — 월 경계 모호성 제거.
  const thursday = addDays(anchorMonday, 3);
  const viewYear = thursday.getFullYear();
  const viewMonth = thursday.getMonth();
  const weeksInMonth = useMemo(() => weeksOfMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const weekIndex = weeksInMonth.findIndex((m) => toLocalKey(m) === toLocalKey(anchorMonday));
  const yearOptions = useMemo(() => {
    const ys = new Set<number>([new Date().getFullYear(), viewYear]);
    events.forEach((e) => {
      const d = new Date(e.eventStartDt);
      if (!Number.isNaN(d.getTime())) ys.add(d.getFullYear());
    });
    return Array.from(ys).sort((a, b) => a - b);
  }, [events, viewYear]);

  // List 뷰: 등록된 이벤트가 있는 날짜 전체 (없으면 기본 행사일).
  const dayKeys = useMemo(() => {
    const keys = Object.keys(grouped).sort();
    return keys.length ? keys : DEFAULT_DAYS.map((day) => toDateKey(day));
  }, [grouped]);

  // 주 이동 시 그 주 월요일을 선택일로 (즉시 조회).
  const goToWeek = (monday: Date) => {
    setAnchorMonday(monday);
    setActiveDateKey(toLocalKey(monday));
  };
  const handleYearChange = (y: number) => {
    const ws = weeksOfMonth(y, viewMonth);
    goToWeek(ws[Math.min(Math.max(weekIndex, 0), ws.length - 1)]);
  };
  const handleMonthChange = (m: number) => {
    const ws = weeksOfMonth(viewYear, m);
    goToWeek(ws[Math.min(Math.max(weekIndex, 0), ws.length - 1)]);
  };
  const handleWeekChange = (i: number) => goToWeek(weeksInMonth[i]);
  const goPrevWeek = () => goToWeek(addDays(anchorMonday, -7));
  const goNextWeek = () => goToWeek(addDays(anchorMonday, 7));

  const activeEvents = activeDateKey ? grouped[activeDateKey] ?? [] : [];

  const openDetail = (eventSeq: number) => {
    setDetailLoading(true);
    callGetPublicEventDetail(eventSeq)
      .then((res) => setDetail(res?.item ?? null))
      .finally(() => setDetailLoading(false));
  };

  return (
    <main className="saf-subpage saf-calendar-page">
      <PublicSubPageHero
        title="Calendar"
        section="Calendar"
        current={view === 'weekly' ? 'Weekly Calendar' : 'List Calendar'}
        backgroundImage={HeroImage}
        className="saf-calendar-hero"
      />

      <section className="saf-subpage-section saf-calendar-section">
        <div className="saf-renewal-shell">
          <SectionLead eyebrow="Calendar" title={view === 'weekly' ? 'Weekly Calendar' : 'List Calendar'}>
            <div className="saf-calendar-view-toggle" aria-label="Calendar view">
              <button type="button" className={view === 'weekly' ? 'is-active' : ''} onClick={() => setView('weekly')}>
                Weekly
              </button>
              <button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')}>
                List
              </button>
            </div>
          </SectionLead>

          {view === 'weekly' ? (
            <>
              <div className="saf-weekly-days" aria-label="Event days">
                {weekKeys.map((dateKey) => (
                  <button
                    type="button"
                    key={dateKey}
                    className={dateKey === activeDateKey ? 'is-active' : ''}
                    onClick={() => setActiveDateKey(dateKey)}
                  >
                    <strong>{formatWeekday(dateKey)}</strong>
                    <span>{formatMonthDay(dateKey)}<br />{formatYearOf(dateKey)}</span>
                  </button>
                ))}
              </div>
              <div className="saf-week-nav">
                <button type="button" className="saf-week-nav-arrow" aria-label="이전 주" onClick={goPrevWeek}>‹</button>
                <select aria-label="연도" value={viewYear} onChange={(e) => handleYearChange(Number(e.target.value))}>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select aria-label="월" value={viewMonth} onChange={(e) => handleMonthChange(Number(e.target.value))}>
                  {MONTH_NAMES.map((name, i) => (
                    <option key={name} value={i}>{name}</option>
                  ))}
                </select>
                <select aria-label="주차" value={weekIndex} onChange={(e) => handleWeekChange(Number(e.target.value))}>
                  {weeksInMonth.map((m, i) => (
                    <option key={toLocalKey(m)} value={i}>{weekRangeLabel(i, m)}</option>
                  ))}
                </select>
                <button type="button" className="saf-week-nav-arrow" aria-label="다음 주" onClick={goNextWeek}>›</button>
              </div>
              <div className="saf-calendar-event-list">
                {loading && <div className="saf-subpage-empty">Loading side events...</div>}
                {!loading && activeEvents.length === 0 && (
                  <div className="saf-subpage-empty">No side events are registered for this day.</div>
                )}
                {activeEvents.map((event) => (
                  <CalendarEventRow key={event.eventSeq} event={event} onOpen={() => openDetail(event.eventSeq)} />
                ))}
              </div>
            </>
          ) : (
            <div className="saf-calendar-list-groups">
              {loading && <div className="saf-subpage-empty">Loading side events...</div>}
              {!loading && events.length === 0 && <div className="saf-subpage-empty">No side events have been published yet.</div>}
              {dayKeys.map((dateKey) => {
                const dateEvents = grouped[dateKey] ?? [];
                if (!dateEvents.length) return null;
                return (
                  <section className="saf-calendar-day-group" key={dateKey}>
                    <div className="saf-calendar-date-divider">
                      <span>{formatLongDate(dateKey)}</span>
                    </div>
                    {dateEvents.map((event) => (
                      <CalendarEventCard key={event.eventSeq} event={event} onOpen={() => openDetail(event.eventSeq)} />
                    ))}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {(detail || detailLoading) && (
        <CalendarDetailModal detail={detail} loading={detailLoading} onClose={() => setDetail(null)} />
      )}
    </main>
  );
}

function SectionLead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="saf-section-lead">
      <span>{eyebrow}</span>
      <div className="saf-section-lead-row">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function CalendarEventRow({ event, onOpen }: { event: EventListItem; onOpen: () => void }) {
  return (
    <article className="saf-calendar-event-row">
      <div className="saf-calendar-time">
        <strong>{formatTimeRange(event.eventStartDt, event.eventEndDt)}</strong>
        <span>Side Event</span>
      </div>
      <div className="saf-calendar-logo">
        <img src={event.organizationImageUrl || assetSrc(KcabLogo)} alt={event.organizationName || 'Organizer'} />
      </div>
      <div className="saf-calendar-event-copy">
        <p>{event.organizationName || 'Seoul ADR Festival'}</p>
        <h3>{event.title}</h3>
        <span>{event.location || 'In-person'}</span>
        <button type="button" onClick={onOpen}>Read More</button>
      </div>
    </article>
  );
}

function CalendarEventCard({ event, onOpen }: { event: EventListItem; onOpen: () => void }) {
  return (
    <article className="saf-calendar-event-card">
      <div className="saf-calendar-date-box">
        <span>{formatShortWeekday(event.eventStartDt)}</span>
        <strong>{formatDateNumber(event.eventStartDt)}</strong>
        <small>{formatMonthYear(event.eventStartDt)}</small>
      </div>
      <div className="saf-calendar-card-time">
        <strong>{formatTimeRange(event.eventStartDt, event.eventEndDt)}</strong>
        <span>Side Event</span>
      </div>
      <div className="saf-calendar-logo">
        <img src={event.organizationImageUrl || assetSrc(KcabLogo)} alt={event.organizationName || 'Organizer'} />
      </div>
      <div className="saf-calendar-event-copy">
        <p>{event.organizationName || 'Seoul ADR Festival'}</p>
        <h3>{event.title}</h3>
        <span>{event.location || 'In-person'}</span>
        <button type="button" onClick={onOpen}>Read More</button>
      </div>
    </article>
  );
}

function CalendarDetailModal({ detail, loading, onClose }: { detail: EventDetail | null; loading: boolean; onClose: () => void }) {
  return (
    <div className="saf-calendar-modal" role="dialog" aria-modal="true" aria-label="Event detail">
      <button type="button" className="saf-calendar-modal-backdrop" aria-label="Close detail" onClick={onClose} />
      <article className="saf-calendar-modal-card">
        <button type="button" className="saf-calendar-modal-close" aria-label="Close detail" onClick={onClose}>×</button>
        {loading && <div className="saf-subpage-empty">Loading event detail...</div>}
        {!loading && detail && (
          <>
            <h2>{detail.title}</h2>
            <p className="saf-calendar-modal-date">{formatDetailDate(detail.eventStartDt, detail.eventEndDt)}</p>
            <div className="saf-calendar-modal-logo">
              <img src={assetSrc(KcabLogo)} alt={detail.organizationName || 'Organizer'} />
            </div>
            <dl>
              <dt>Format</dt>
              <dd>{detail.registrationType === 'external' ? 'Registration by external link' : 'In-person only'}</dd>
              <dt>Venue</dt>
              <dd>{detail.location || 'To be announced'}</dd>
              <dt>Organizer</dt>
              <dd>{detail.organizationName || 'Seoul ADR Festival'}</dd>
              <dt>Overview</dt>
              <dd>
                <div
                  className="saf-rich-text"
                  dangerouslySetInnerHTML={{ __html: detail.content || detail.summary || detail.description || '' }}
                />
              </dd>
            </dl>
            {detail.registrationUrl && (
              <a className="saf-black-link" href={detail.registrationUrl} target="_blank" rel="noopener noreferrer">
                Registration
              </a>
            )}
          </>
        )}
      </article>
    </div>
  );
}

function sortEvents(items: EventListItem[]) {
  return [...items].sort((a, b) => new Date(a.eventStartDt).getTime() - new Date(b.eventStartDt).getTime());
}

function groupEventsByDate(items: EventListItem[]) {
  return items.reduce<Record<string, EventListItem[]>>((acc, event) => {
    const key = toDateKey(event.eventStartDt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});
}

function toLocalKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toDateKey(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return toLocalKey(date);
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// 주어진 날짜가 속한 주의 월요일.
function mondayOf(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

// 월요일 기준 월~일 7일치 날짜 키.
function weekDaysFrom(monday: Date) {
  return Array.from({ length: 7 }, (_, i) => toLocalKey(addDays(monday, i)));
}

// 해당 월의 주(월요일 시작) 목록 — 목요일이 그 달에 속하는 주 = N주차 (월 경계 모호성 제거).
function weeksOfMonth(year: number, month: number) {
  const weeks: Date[] = [];
  let monday = mondayOf(new Date(year, month, 1));
  for (let guard = 0; guard < 7; guard += 1) {
    const thu = addDays(monday, 3);
    if (thu.getFullYear() > year || (thu.getFullYear() === year && thu.getMonth() > month)) break;
    if (thu.getFullYear() === year && thu.getMonth() === month) weeks.push(monday);
    monday = addDays(monday, 7);
  }
  return weeks;
}

// "N주차 · MM.DD–MM.DD"
function weekRangeLabel(index: number, monday: Date) {
  const sunday = addDays(monday, 6);
  const f = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  return `Week ${index + 1} · ${f(monday)}–${f(sunday)}`;
}

function formatTimeRange(start?: string | null, end?: string | null) {
  const startText = formatTime(start);
  const endText = formatTime(end);
  return endText ? `${startText} - ${endText}` : startText;
}

function formatTime(value?: string | null) {
  if (!value) return 'TBA';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatWeekday(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' });
}

function formatShortWeekday(value: string) {
  return new Date(value).toLocaleDateString('en-US', { weekday: 'short' }).replace('.', '');
}

function formatMonthDay(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', { day: '2-digit', month: 'long' });
}

function formatYearOf(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).getFullYear();
}

function formatLongDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateNumber(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : String(date.getDate()).padStart(2, '0');
}

function formatMonthYear(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDetailDate(start?: string | null, end?: string | null) {
  if (!start) return 'Schedule to be announced';
  const date = new Date(start);
  const dateText = Number.isNaN(date.getTime())
    ? start
    : date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${dateText}, ${formatTimeRange(start, end)}`;
}
