'use client';

import React, { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  MoreOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  SendOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { sessionInfoAtom } from '@atom/sessionInfoAtom';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import { getAdminRole } from '@util/fixedAdminMenus';
import { callGetAdminDashboardMetrics, callGetOrgDashboardMetrics } from '@api/admin/DashboardApi';
import type { AdminDashboardMetrics } from '@interface/admin/Dashboard';
import type { OrgDashboardEvent, OrgDashboardMetrics } from '@interface/admin/OrgDashboard';
import { EVENT_STATUS_LABELS, EVENT_STATUS_TONE } from '@interface/event/EventManagement';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

type Metric = {
  label: string;
  value: string;
  help?: string;
  tone?: 'yellow' | 'blue' | 'green' | 'red';
};

type TableColumn = {
  key: string;
  label: string;
};

type TableRow = Record<string, React.ReactNode>;

const orgMetrics: Metric[] = [
  { label: 'My Events', value: '2', tone: 'blue' },
  { label: 'Pending Approval', value: '1', tone: 'yellow' },
  { label: 'Total Applicants', value: '32', tone: 'green' },
];

const eventRows: TableRow[] = [
  { name: 'Seoul International Arbitration Conference', date: '09.10', type: <Status tone="blue">Official</Status>, host: 'KCAB', count: '215 / 300', status: <Status tone="green">Published</Status>, action: 'Edit / Delete' },
  { name: 'ADR Networking Reception', date: '09.11', type: <Status tone="blue">Official</Status>, host: 'KCAB', count: '412 / 500', status: <Status tone="green">Published</Status>, action: 'Edit / Delete' },
  { name: 'Closing Ceremony & Gala', date: '09.14', type: <Status tone="blue">Official</Status>, host: 'KCAB', count: '180 / 300', status: <Status tone="green">Published</Status>, action: 'Edit / Delete' },
  { name: 'ABC Law Seminar', date: '09.12', type: <Status tone="orange">Side Event</Status>, host: 'ABC Law', count: '0 / 80', status: <Status tone="yellow">Pending Approval</Status>, action: 'Edit / Delete' },
  { name: 'XYZ Roundtable', date: '09.13', type: <Status tone="orange">Side Event</Status>, host: 'XYZ Law', count: '32 / 60', status: <Status tone="green">Published</Status>, action: 'Edit / Delete' },
  { name: 'DEF Reception', date: '09.11', type: <Status tone="orange">Side Event</Status>, host: 'DEF Law', count: '0 / 100', status: <Status>Draft</Status>, action: 'Edit / Delete' },
];

const participantRows: TableRow[] = [
  { check: '☐', name: 'Gildong Hong', email: 'hong@kcab.or.kr', org: 'KCAB', event: 'Conference', payment: 'KRW 275,000', action: <MoreOutlined /> },
  { check: '☐', name: 'Minsu Kim', email: 'minsoo@law.com', org: 'Lee & Co. Law', event: 'Conference', payment: 'KRW 200,000', action: <MoreOutlined /> },
  { check: '☐', name: 'Younghee Lee', email: 'yhlee@xyz.law', org: 'XYZ Law', event: 'Side Event: XYZ', payment: 'Free', action: <MoreOutlined /> },
  { check: '☐', name: 'John Smith', email: 'john@global.com', org: 'Global Inc.', event: 'Conference', payment: '$ 200', action: <MoreOutlined /> },
  { check: '☐', name: 'Eunju Park', email: 'park@aaa.com', org: 'AAA Group', event: 'Reception', payment: 'Free', action: <MoreOutlined /> },
  { check: '☐', name: 'Taro Yamada', email: 'yamada@jp.com', org: 'JP Arbitration', event: 'Conference', payment: 'JPY 25,000', action: <MoreOutlined /> },
  { check: '☐', name: 'Wei Chen', email: 'chen@cn.law', org: 'CN Lawyers', event: 'Reception', payment: 'Free', action: <MoreOutlined /> },
];

const orgParticipantRows: TableRow[] = [
  { check: '☐', name: 'Minsu Kim', email: 'kim@abc.law', org: 'Hanul Law', event: 'ABC Cocktail Reception', payment: '04.25', action: <MoreOutlined /> },
  { check: '☐', name: 'Younghee Lee', email: 'yhlee@xx.com', org: 'XYZ Group', event: 'ABC Cocktail Reception', payment: '04.24', action: <MoreOutlined /> },
  { check: '☐', name: 'Cheolsu Park', email: 'park@aaa.com', org: 'KCAB', event: 'ABC Cocktail Reception', payment: '04.24', action: <MoreOutlined /> },
  { check: '☐', name: 'John Smith', email: 'john@global.com', org: 'Global Corp', event: 'ABC Cocktail Reception', payment: '04.23', action: <MoreOutlined /> },
  { check: '☐', name: 'Sujin Jung', email: 'jung@dev.com', org: 'Korea Research Institute', event: 'Cross-Border Seminar', payment: '04.22', action: <MoreOutlined /> },
  { check: '☐', name: 'Yamada', email: 'yamada@jp.com', org: 'JP Arbitration', event: 'Cross-Border Seminar', payment: '04.20', action: <MoreOutlined /> },
];

const paymentRows: TableRow[] = [
  { id: 'TX-9F4A21', date: '04.28', payer: 'Gildong Hong', event: 'Conference', method: 'Card', amount: 'KRW 275,000', status: <Status tone="green">Paid</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A20', date: '04.28', payer: 'Younghee Lee', event: 'Conference', method: 'Card', amount: 'KRW 200,000', status: <Status tone="green">Paid</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A19', date: '04.27', payer: 'John Smith', event: 'Conference', method: 'PayPal', amount: '$ 200', status: <Status tone="green">Paid</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A18', date: '04.27', payer: 'Eunju Park', event: 'Reception', method: 'Free', amount: '-', status: <Status>Free</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A17', date: '04.26', payer: 'Yamada', event: 'Conference', method: 'Eximbay', amount: 'JPY 25,000', status: <Status tone="red">Refunded</Status>, action: <MoreOutlined /> },
  { id: 'TX-9F4A16', date: '04.26', payer: 'Wei Chen', event: 'Conference', method: 'Card', amount: 'KRW 200,000', status: <Status tone="red">Failed</Status>, action: <MoreOutlined /> },
];

const DASHBOARD_EVENT_DETAIL_KEY = 'saf.admin.dashboardEventSeq';

function useMove() {
  const setCurrentPath = useSetAtom(currentPathAtom);
  return (url: string) => pushPath(url, setCurrentPath);
}

function useRole() {
  const sessionInfo = useAtomValue(sessionInfoAtom);
  return getAdminRole(sessionInfo.admYn);
}

function ScreenHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="saf-screen-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="saf-screen-actions">{actions}</div>}
    </header>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  variant = 'secondary',
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button type="button" className={`saf-action-btn is-${variant}`} onClick={onClick}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

function Status({ children, tone = 'gray' }: { children: React.ReactNode; tone?: 'gray' | 'green' | 'yellow' | 'blue' | 'orange' | 'red' }) {
  return <span className={`saf-status is-${tone}`}>{children}</span>;
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="saf-metric-grid">
      {metrics.map((metric) => (
        <article className={`saf-metric-card is-${metric.tone ?? 'gray'}`} key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          {metric.help && <p>{metric.help}</p>}
        </article>
      ))}
    </section>
  );
}

function DataTable({ columns, rows }: { columns: TableColumn[]; rows: TableRow[]; footer?: string }) {
  const pagination = useClientGridPagination(rows);

  return (
    <section className="saf-table-wrap">
      <table className="saf-table">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {pagination.pagedItems.map((row, idx) => (
            <tr key={idx}>
              {columns.map((column) => <td key={column.key}>{row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <AdminGridPagination {...pagination} />
    </section>
  );
}

function SearchFilters({ orgOnly = false, variant = 'events' }: { orgOnly?: boolean; variant?: 'events' | 'participants' }) {
  const isParticipants = variant === 'participants';
  return (
    <section className="saf-filter-row">
      <div className="saf-search">
        <SearchOutlined />
        <input placeholder={isParticipants ? 'Search by name, email, or organization...' : 'Search by event name or host organization...'} />
      </div>
      <button type="button">{isParticipants ? (orgOnly ? 'All My Events (2)' : 'All Events') : 'All Statuses'}</button>
      <button type="button">{isParticipants ? (orgOnly ? 'Payment' : 'Paid') : 'All Types'}</button>
    </section>
  );
}

export function SuperDashboard() {
  const move = useMove();
  const [dashboardMetrics, setDashboardMetrics] = useState<AdminDashboardMetrics | null>(null);

  useEffect(() => {
    callGetAdminDashboardMetrics()
      .then((res) => setDashboardMetrics(res.item ?? null))
      .catch(() => setDashboardMetrics(null));
  }, []);

  const openUpcomingEvent = (eventSeq: number) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(DASHBOARD_EVENT_DETAIL_KEY, String(eventSeq));
    }
    move('/admin/events');
  };

  return (
    <div className="saf-screen">
      <ScreenHeader
        title="Welcome, Admin"
      />
      <MetricGrid metrics={buildSuperMetrics(dashboardMetrics)} />
      <div className="saf-dashboard-grid">
        <section className="saf-panel is-wide">
          <PanelTitle title="Side Events Awaiting Review" />
          {[
            ['#SE-0042', 'Submitted 2 days ago', 'Cross-Border Arbitration Trends Seminar', 'ABC Law · 09.12 · Lotte Hotel · Capacity 80', '#arbitration #seminar'],
            ['#SE-0043', 'Submitted 1 day ago', 'Emerging Markets Dispute Resolution Roundtable', 'XYZ Law · 09.13 · Shilla Hotel · Capacity 60', '#arbitration'],
            ['#SE-0044', 'Submitted 5 hours ago', 'Construction Dispute Resolution Workshop', 'DEF Law · 09.11 · DEF Office · Capacity 100', '#construction #networking'],
          ].map(([id, time, title, meta, tags]) => (
            <article className="saf-review-card" key={id}>
              <div>
                <span>{id}</span>
                <em>{time}</em>
              </div>
              <strong>{title}</strong>
              <p>{meta}</p>
              <small>{tags}</small>
              <button type="button" onClick={() => move('/admin/side-events/SE-0042')}>Review →</button>
            </article>
          ))}
        </section>
        <section className="saf-panel">
          <PanelTitle title="Upcoming Events (D-day)" />
          <ol className="saf-date-list">
            {dashboardMetrics?.upcomingEvents?.length ? (
              dashboardMetrics.upcomingEvents.map((event) => (
                <li key={event.eventSeq}>
                  <button type="button" onClick={() => openUpcomingEvent(event.eventSeq)}>
                    <CalendarOutlined />
                    <span>{formatUpcomingEvent(event)}</span>
                  </button>
                </li>
              ))
            ) : (
              <li><CalendarOutlined /> No upcoming events.</li>
            )}
          </ol>
        </section>
        <section className="saf-panel">
          <PanelTitle title="Recent Activity" />
          <ol className="saf-activity-list">
            <li><strong>ABC Law submitted a side event</strong><span>10 minutes ago</span></li>
            <li><strong>XYZ Law sign-up is awaiting approval</strong><span>2 hours ago</span></li>
            <li><strong>Official event 'ADR Reception' was updated</strong><span>Yesterday</span></li>
          </ol>
        </section>
      </div>
    </div>
  );
}

function buildSuperMetrics(metrics: AdminDashboardMetrics | null): Metric[] {
  const pendingEvents = metrics?.pendingEventApprovalCount ?? 0;
  const registeredEvents = metrics?.registeredEventCount ?? 0;
  const officialEvents = metrics?.officialEventCount ?? 0;
  const sideEvents = metrics?.sideEventCount ?? 0;
  const totalParticipants = metrics?.totalParticipantCount ?? 0;
  const recentParticipants = metrics?.recentParticipantCount ?? 0;
  const pendingOrganizations = metrics?.pendingOrganizationApprovalCount ?? 0;

  return [
    { label: 'Pending Approval (Events)', value: formatCount(pendingEvents), help: 'Side events awaiting review', tone: 'yellow' },
    { label: 'Registered Events', value: formatCount(registeredEvents), help: `${formatCount(officialEvents)} official · ${formatCount(sideEvents)} side events`, tone: 'blue' },
    { label: 'Total Participants', value: formatCount(totalParticipants), help: `+${formatCount(recentParticipants)} in the last 7 days`, tone: 'green' },
    { label: 'Pending Approval (Organizations)', value: formatCount(pendingOrganizations), help: 'Organization sign-ups awaiting review', tone: 'yellow' },
  ];
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatUpcomingEvent(event: AdminDashboardMetrics['upcomingEvents'][number]) {
  const eventType = event.eventType === 'main' ? 'Official' : event.eventType === 'side' ? 'Side Event' : event.eventType || '-';
  const pendingSuffix = event.status === 'pending_approval' ? ' (Pending)' : '';
  const dDay = typeof event.daysUntilEvent === 'number' ? (event.daysUntilEvent === 0 ? 'D-day' : `D-${event.daysUntilEvent}`) : '';

  return `${formatMonthDay(event.startAt)} ${event.title} · ${eventType}${pendingSuffix}${dDay ? ` · ${dDay}` : ''}`;
}

function formatMonthDay(dateTime: string) {
  const match = dateTime?.match(/^\d{4}-(\d{2})-(\d{2})/);
  return match ? `${match[1]}.${match[2]}` : '--.--';
}

export function OrgDashboard() {
  const move = useMove();
  const sessionInfo = useAtomValue(sessionInfoAtom);
  const [metrics, setMetrics] = useState<OrgDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    callGetOrgDashboardMetrics()
      .then((res) => {
        if (!cancelled) setMetrics(res?.item ?? null);
      })
      .catch(() => {
        if (!cancelled) setMetrics(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const welcomeName = sessionInfo?.userName || 'Organization';
  const myEvents = metrics?.myEvents ?? [];

  return (
    <div className="saf-screen">
      <ScreenHeader
        title={`Welcome, ${welcomeName}`}
        actions={<ActionButton icon={<PlusOutlined />} variant="primary" onClick={() => move('/admin/events')}>Apply for Side Event</ActionButton>}
      />
      <MetricGrid metrics={buildOrgMetrics(metrics)} />
      <section className="saf-card-list">
        {loading && <p className="saf-empty">Loading...</p>}
        {!loading && myEvents.length === 0 && (
          <p className="saf-empty">No events yet. Click "Apply for Side Event" to create one.</p>
        )}
        {myEvents.map((event) => (
          <OrgEventCard
            key={event.eventSeq}
            title={event.title}
            meta={formatOrgEventMeta(event)}
            status={
              <Status tone={EVENT_STATUS_TONE[event.status] ?? 'gray'}>
                {EVENT_STATUS_LABELS[event.status] ?? event.status}
              </Status>
            }
            caption={formatOrgEventParticipants(event)}
          />
        ))}
      </section>
    </div>
  );
}

function buildOrgMetrics(metrics: OrgDashboardMetrics | null): Metric[] {
  return [
    { label: 'My Events', value: formatCount(metrics?.myEventCount ?? 0), tone: 'blue' },
    { label: 'Pending Approval', value: formatCount(metrics?.pendingApprovalCount ?? 0), tone: 'yellow' },
    { label: 'Total Applicants', value: formatCount(metrics?.totalApplicantCount ?? 0), tone: 'green' },
  ];
}

function formatOrgEventMeta(event: OrgDashboardEvent): string {
  const parts: string[] = [];
  if (event.startAt) parts.push(formatMonthDay(event.startAt));
  if (event.venueName) parts.push(event.venueName);
  if (event.maxParticipants != null) parts.push(`Capacity ${event.maxParticipants}`);
  return parts.join(' · ') || '-';
}

function formatOrgEventParticipants(event: OrgDashboardEvent): string | undefined {
  if (event.maxParticipants != null && event.maxParticipants > 0) {
    return `Participants: ${event.registrationCount} / ${event.maxParticipants}`;
  }
  if (event.registrationCount > 0) {
    return `Participants: ${event.registrationCount}`;
  }
  return undefined;
}

export function DashboardByRole() {
  return useRole() === 'ADMIN' ? <SuperDashboard /> : <OrgDashboard />;
}

export function SuperEventList() {
  const move = useMove();
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="Event Management"
        actions={<ActionButton icon={<PlusOutlined />} variant="primary" onClick={() => move('/admin/events/new')}>New Event</ActionButton>}
      />
      <SearchFilters />
      <DataTable
        columns={[
          { key: 'name', label: 'Event Name' },
          { key: 'date', label: 'Date' },
          { key: 'type', label: 'Type' },
          { key: 'host', label: 'Host' },
          { key: 'count', label: 'Applications' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: 'Actions' },
        ]}
        rows={eventRows}
        footer="1-6 / 18 · ‹ 1 2 3 ›"
      />
    </div>
  );
}

export function EventEditor() {
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="Create New Event"
        actions={<><ActionButton icon={<SaveOutlined />}>Save Draft</ActionButton><ActionButton variant="primary" icon={<SendOutlined />}>Publish</ActionButton></>}
      />
      <div className="saf-editor-layout">
        <section className="saf-panel">
          <nav className="saf-editor-tabs">
            {['Basic Info', 'Description', 'Schedule', 'Fees', 'Capacity', 'SEO'].map((tab, idx) => (
              <button className={idx === 0 ? 'is-active' : ''} type="button" key={tab}>{tab}</button>
            ))}
          </nav>
          <div className="saf-lang-tabs">
            <button className="is-active" type="button">English</button>
          </div>
          <FormGrid>
            <Field label="Event Name *"><input defaultValue="Seoul International Arbitration Conference 2026" /></Field>
            <Field label="Subtitle (Optional)"><input defaultValue="Korean Commercial Arbitration Board" /></Field>
            <Field label="Description *" wide><textarea defaultValue="Event overview, topic, target audience... (edited in the WYSIWYG tab)" /></Field>
          </FormGrid>
          <p className="saf-hint">Enter all event information in English before publishing.</p>
        </section>
        <section className="saf-panel">
          <PanelTitle title="Shared Information" subtitle="Entered once for all displays." />
          <FormGrid>
            <Field label="Event Type *"><select defaultValue="official"><option value="official">Official</option><option>Side Event</option></select></Field>
            <Field label="Host *"><input defaultValue="KCAB International" /></Field>
            <Field label="Date *"><input defaultValue="2026-09-10" /></Field>
            <Field label="Venue *"><input defaultValue="Conrad Seoul" /></Field>
            <UploadBox />
            <Field label="Visibility"><select><option>Public</option><option>Members Only</option><option>Invitation Only</option></select></Field>
            <Field label="Tags" wide><input defaultValue="# Conference  # ADR  # English" /></Field>
          </FormGrid>
          <p className="saf-warning">This event will be visible publicly after publishing.</p>
        </section>
      </div>
    </div>
  );
}

export function SideEventReview() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="Side Event Review" subtitle="#SE-0042 · Applicant ABC Law · 2026.04.22" />
      <div className="saf-editor-layout">
        <section className="saf-panel">
          <PanelTitle title="Application Details" />
          <DetailList items={[
            ['Event Name', 'Cross-Border Arbitration Trends Seminar'],
            ['Host', 'ABC Law · Contact: kim@abc.law'],
            ['Date & Time', '2026.09.12 · 14:00 - 17:00'],
            ['Venue', 'Lotte Hotel Seoul, Crystal Ballroom'],
            ['Capacity', '80 (Free)'],
            ['Language', 'Korean / English simultaneous interpretation'],
            ['Description', 'Cross-border dispute trends and response strategies / 3 speakers + panel discussion + networking'],
            ['Attachments', 'agenda.pdf · speakers.pdf · venue-map.png'],
          ]} />
        </section>
        <section className="saf-panel">
          <PanelTitle title="Approval Decision" />
          <Field label="Comment to Applicant"><textarea placeholder="Comments will be included in the applicant notification email." /></Field>
          <label className="saf-check-line"><input type="checkbox" defaultChecked /> Publish automatically after approval</label>
          <label className="saf-check-line"><input type="checkbox" defaultChecked /> Notify applicant by email</label>
          <div className="saf-decision-actions">
            <button type="button" className="is-approve">Approve</button>
            <button type="button" className="is-reject">Reject</button>
            <button type="button">Request Changes</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Participants() {
  const role = useRole();
  const orgOnly = role !== 'ADMIN';
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="Participant Management"
        subtitle={orgOnly ? 'Participants registered for your side events.' : undefined}
        actions={<><ActionButton icon={<DownloadOutlined />}>Export CSV</ActionButton><ActionButton icon={<MailOutlined />}>Send Email</ActionButton></>}
      />
      <SearchFilters orgOnly={orgOnly} variant="participants" />
      {orgOnly && <p className="saf-summary-line">32 total participants · 0 paid · 32 free</p>}
      <DataTable
        columns={[
          { key: 'check', label: '☐' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'org', label: 'Organization' },
          { key: 'event', label: 'Event Name' },
          { key: 'payment', label: orgOnly ? 'Applied At' : 'Payment' },
          { key: 'action', label: '···' },
        ]}
        rows={orgOnly ? orgParticipantRows : participantRows}
        footer={orgOnly ? '1-6 / 32 · ‹ 1 2 3 4 5 6 ›' : '1-7 / 1,247 · ‹ 1 2 3 ... 178 ›'}
      />
    </div>
  );
}

export function Payments() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="Payment Management" />
      <MetricGrid metrics={[
        { label: 'Total Revenue', value: 'KRW 145M', tone: 'green' },
        { label: 'This Week', value: 'KRW 8.25M', tone: 'blue' },
        { label: 'Refunds', value: 'KRW 1.42M', tone: 'yellow' },
        { label: 'Failures', value: '12', tone: 'red' },
      ]} />
      <DataTable
        columns={[
          { key: 'id', label: 'Transaction ID' },
          { key: 'date', label: 'Date' },
          { key: 'payer', label: 'Payer' },
          { key: 'event', label: 'Event' },
          { key: 'method', label: 'Method' },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: '···' },
        ]}
        rows={paymentRows}
      />
      <p className="saf-footnote">Refunds are processed under the refund policy. PG settlement, overseas PG fees such as Eximbay, and receipt PDFs are handled separately.</p>
    </div>
  );
}

export function EmailCms() {
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="Email Template Editor"
        actions={<><ActionButton icon={<SendOutlined />}>Send Test</ActionButton><ActionButton variant="primary" icon={<SaveOutlined />}>Save & Publish</ActionButton></>}
      />
      <div className="saf-email-layout">
        <aside className="saf-template-list">
          {['Registration Confirmation', 'Payment Receipt', 'Side Event Approval', 'Side Event Rejection', 'Reminder (D-1)', 'Cancellation Notice'].map((item, idx) => (
            <button type="button" className={idx === 0 ? 'is-active' : ''} key={item}>{item}</button>
          ))}
        </aside>
        <section className="saf-panel">
          <div className="saf-editor-toolbar">B&nbsp;&nbsp; I&nbsp;&nbsp; U&nbsp;&nbsp; # &nbsp;&nbsp;Link&nbsp;&nbsp; Image &nbsp;&nbsp; Variables ▾</div>
          <Field label="Subject"><input defaultValue="[SAF 2026] {{event_name}} registration confirmed" /></Field>
          <Field label="Body (WYSIWYG Editor)"><textarea rows={12} defaultValue={'[ Banner Image ]\n\nHello {{name}},\nYour registration for {{event_name}} has been confirmed.\n\n[QR]\n- {{my_page_url}}\n- Receipt PDF'} /></Field>
        </section>
        <aside className="saf-panel">
          <PanelTitle title="Available Variables" />
          <div className="saf-token-grid">
            {['{{name}}', '{{event_name}}', '{{date}}', '{{venue}}', '{{qr_url}}', '{{receipt_url}}', '{{my_page_url}}', '{{amount}}', '{{order_id}}'].map((token) => (
              <button type="button" key={token}>{token}</button>
            ))}
          </div>
          <div className="saf-lang-tabs">
            <button className="is-active" type="button">English</button>
          </div>
          <p className="saf-hint">Send a preview to verify the final rendering.</p>
        </aside>
      </div>
    </div>
  );
}

export function OrgSideEvents() {
  const move = useMove();
  return (
    <div className="saf-screen">
      <ScreenHeader
        title="Event Management"
        subtitle="Manage side events submitted by your organization."
        actions={<ActionButton icon={<PlusOutlined />} variant="primary" onClick={() => move('/admin/events')}>Apply for Side Event</ActionButton>}
      />
      <section className="saf-card-list">
        <OrgEventCard title="Cross-Border Arbitration Trends Seminar" meta="09.12 · Lotte Hotel · Capacity 80" status={<Status tone="yellow">Pending Approval</Status>} />
        <OrgEventCard title="ABC Cocktail Reception" meta="09.13 · ABC Office · Capacity 50" status={<Status tone="green">Published</Status>} caption="Participants: 32 / 50" />
      </section>
    </div>
  );
}

export function OrgSideEventForm() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="Apply for Side Event" subtitle="After submission, KCAB will review it and publish it once approved." />
      <section className="saf-panel saf-form-panel">
        <FormGrid>
          <Field label="Event Name *"><input placeholder="Example: Cross-Border Arbitration Seminar" /></Field>
          <Field label="Date & Time *"><input placeholder="2026-09-12  14:00" /></Field>
          <Field label="Venue *"><input placeholder="Lotte Hotel Seoul" /></Field>
          <Field label="Capacity *"><input placeholder="80" /></Field>
          <Field label="Language"><select><option>Korean / English simultaneous interpretation</option><option>Korean</option><option>English</option></select></Field>
          <Field label="Event Description *" wide><textarea placeholder="This seminar will cover ..." /></Field>
          <UploadBox />
          <Field label="Attachments" wide><div className="saf-attach-list">agenda.pdf · speakers.pdf <button type="button">+ Add File</button></div></Field>
        </FormGrid>
        <footer className="saf-form-footer">
          <p>Submitted content can be edited only before approval.</p>
          <ActionButton variant="primary" icon={<SendOutlined />}>Submit for Review</ActionButton>
        </footer>
      </section>
    </div>
  );
}

export function OrgProfile() {
  return (
    <div className="saf-screen">
      <ScreenHeader title="Profile" subtitle="Manage organization and account information." />
      <div className="saf-editor-layout">
        <section className="saf-panel">
          <PanelTitle title="Organization Information" subtitle="Based on the organizations table." />
          <FormGrid>
            <Field label="Organization Name *"><input defaultValue="ABC Law" /></Field>
            <Field label="Business Registration No."><input defaultValue="123-45-67890 (Locked)" disabled /></Field>
            <Field label="Organization Type *"><select><option>Law Firm</option></select></Field>
            <Field label="Representative Name *"><input defaultValue="Minsu Kim" /></Field>
            <Field label="Representative Email *"><input defaultValue="contact@abc.law" /></Field>
            <Field label="Representative Phone"><input defaultValue="02-1234-5678" /></Field>
            <Field label="Address" wide><input defaultValue="100 Teheran-ro, Gangnam-gu, Seoul" /></Field>
          </FormGrid>
          <ActionButton icon={<SaveOutlined />} variant="primary">Save Organization Information</ActionButton>
        </section>
        <section className="saf-panel">
          <PanelTitle title="My Account" subtitle="Based on the users table." />
          <FormGrid>
            <Field label="Name"><input defaultValue="Minsu Kim" /></Field>
            <Field label="User ID"><input defaultValue="kim.minsoo (Locked)" disabled /></Field>
            <Field label="Email"><input defaultValue="kim@abc.law" /></Field>
            <Field label="Preferred Language"><select><option>English</option></select></Field>
            <Field label="Current Password"><input type="password" /></Field>
            <Field label="New Password"><input type="password" /></Field>
            <Field label="Confirm New Password"><input type="password" /></Field>
          </FormGrid>
          <ActionButton icon={<SaveOutlined />} variant="primary">Save Changes</ActionButton>
        </section>
      </div>
    </div>
  );
}

export function SimpleAdminPage({ title }: { title: string }) {
  return (
    <div className="saf-screen">
      <ScreenHeader title={title} subtitle="This area will be expanded according to the next screen specification." />
      <section className="saf-panel saf-empty-panel">
        <CheckCircleOutlined />
        <strong>{title}</strong>
        <p>This page is included in the fixed menu and will use the same screen system once detailed specifications are added.</p>
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

function OrgEventCard({ title, meta, status, caption }: { title: string; meta: string; status: React.ReactNode; caption?: string }) {
  return (
    <article className="saf-org-event-card">
      <div className="saf-event-thumb">Image</div>
      <div>
        <h2>{title}</h2>
        <p>{meta}</p>
        {caption && <span>{caption}</span>}
      </div>
      <footer>
        {status}
        <button type="button"><EditOutlined /> Edit</button>
        <button type="button"><EyeOutlined /> View</button>
      </footer>
    </article>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`saf-form-field ${wide ? 'is-wide' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="saf-form-grid">{children}</div>;
}

function UploadBox() {
  return (
    <div className="saf-upload-box">
      <UploadOutlined />
      <span>Drag & Drop<br />or Select File</span>
    </div>
  );
}

function DetailList({ items }: { items: [string, string][] }) {
  return (
    <dl className="saf-detail-list">
      {items.map(([label, value]) => (
        <React.Fragment key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
