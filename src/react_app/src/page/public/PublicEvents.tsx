import React, { useEffect, useState } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import { callGetPublicEventList, callGetPublicEventDetail } from '@api/event/EventApi';
import { callGetPublicPageList } from '@api/page/PageApi';
import { EventListItem, EventDetail, EVENT_STATUS_LABELS, EventStatus } from '@interface/event/EventManagement';
import { PageListItem } from '@interface/page/PageManagement';

const PublicEvents: React.FC = () => {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [eventList, setEventList] = useState<EventListItem[]>([]);
  const [selected, setSelected] = useState<EventDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    callGetPublicPageList().then((r) => { if (r?.item) setPages(r.item); });
    callGetPublicEventList().then((r) => { if (r?.item) setEventList(r.item); });
  }, []);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    callGetPublicEventList(status || undefined).then((r) => {
      if (r?.item) setEventList(r.item);
    });
  };

  const handleSelect = async (seq: number) => {
    const res = await callGetPublicEventDetail(seq);
    if (res?.item) { setSelected(res.item); window.scrollTo(0, 0); }
  };

  const handleBack = () => setSelected(null);
  const handleNavigate = (url: string) => { window.location.href = url; };

  if (selected) {
    const statusLabel = EVENT_STATUS_LABELS[selected.status as EventStatus] ?? selected.status;
    return (
      <div className="pub-layout">
        <PublicHeader pages={pages} currentUrl="/events" onNavigate={handleNavigate} />
        <main className="pub-page-content">
          <section className="pub-section section-text size-medium">
            <div className="pub-section-inner">
              <div style={{ marginBottom: 24 }}>
                <button onClick={handleBack} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, color: '#294DC7', padding: 0,
                }}>
                  &larr; Back to list
                </button>
              </div>
              <h3 className="text-title" style={{ paddingLeft: 0 }}>{selected.title}</h3>
              <div className="pub-event-detail-meta">
                <span className={`pub-event-status-badge status-${selected.status?.toLowerCase()}`}>
                  {statusLabel}
                </span>
                {selected.eventStartDt && (
                  <span>{selected.eventStartDt}{selected.eventEndDt ? ` ~ ${selected.eventEndDt}` : ''}</span>
                )}
                {selected.location && <span>{selected.location}</span>}
              </div>
              {selected.registrationUrl && (
                <a href={selected.registrationUrl} target="_blank" rel="noopener noreferrer"
                  className="pub-event-register-link">
                  Register &rarr;
                </a>
              )}
              <div className="text-content" style={{ marginTop: 32 }}
                dangerouslySetInnerHTML={{ __html: selected.content ?? '' }} />
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const filtered = eventList.filter((e) => e.useYn === 'Y');

  return (
    <div className="pub-layout">
      <PublicHeader pages={pages} currentUrl="/events" onNavigate={handleNavigate} />
      <main className="pub-page-content">
        <section className="pub-section section-hero size-small" style={{
          background: 'linear-gradient(135deg, #0f1b3d 0%, #294DC7 100%)',
        }}>
          <div className="hero-content">
            <h2 className="hero-title">Events</h2>
            <p className="hero-subtitle">Event Guide</p>
          </div>
        </section>

        <section className="pub-section section-text size-medium">
          <div className="pub-section-inner">
            <div className="pub-event-filter">
              {['', 'UPCOMING', 'ONGOING', 'ENDED'].map((s) => (
                <button
                  key={s}
                  className={`pub-event-filter-btn ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => handleFilter(s)}
                >
                  {s ? EVENT_STATUS_LABELS[s as EventStatus] : 'All'}
                </button>
              ))}
            </div>

            <div className="pub-event-grid">
              {filtered.map((event) => {
                const statusLabel = EVENT_STATUS_LABELS[event.status as EventStatus] ?? event.status;
                return (
                  <div key={event.eventSeq} className="pub-event-card" onClick={() => handleSelect(event.eventSeq)}>
                    <div className="pub-event-card-body">
                      <span className={`pub-event-status-badge status-${event.status?.toLowerCase()}`}>
                        {statusLabel}
                      </span>
                      <h4 className="pub-event-card-title">{event.title}</h4>
                      {event.summary && <p className="pub-event-card-desc">{event.summary}</p>}
                      <div className="pub-event-card-meta">
                        {event.eventStartDt && <span>{event.eventStartDt}</span>}
                        {event.location && <span>{event.location}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ padding: '60px 0', textAlign: 'center', color: '#999', gridColumn: '1 / -1' }}>
                  No events found.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicEvents;
