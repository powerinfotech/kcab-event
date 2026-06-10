'use client';

import React, { useEffect, useState } from 'react';
import { callGetPublicEventList, callGetPublicEventPage } from '@api/event/EventApi';
import { EventListItem, PublicEventPage as PublicEventPageModel } from '@interface/event/EventManagement';
import { usePublicNavigate } from '@hook/usePublicNavigate';
import { useSetAtom } from 'jotai';
import { currentPathAtom, replacePath } from '@atom/currentPathAtom';
import { useCurrentOfficialEventPath } from '@hook/useCurrentOfficialEventPath';
import HeroImage from '../../assets/images/saf-renewal/media-partners/hero.png';
import BlobGraphic from '../../assets/images/saf-renewal/media-partners/blob.svg';
import HomeIcon from '../../assets/images/saf-renewal/media-partners/home.svg';

const FEATURED_EVENT_SLUG = 'asia-civil-law-summit-demo';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

type OfficialEventCard = {
  event: EventListItem;
  page?: PublicEventPageModel | null;
};

const PublicEvents: React.FC = () => {
  const [events, setEvents] = useState<OfficialEventCard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = usePublicNavigate();
  const setCurrentPath = useSetAtom(currentPathAtom);
  const officialEventPath = useCurrentOfficialEventPath();

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      setLoading(true);
      try {
        const listRes = await callGetPublicEventList();
        const officialEvents = (listRes?.item ?? [])
          .filter((event) => event.useYn === 'Y' && event.eventType === 'main')
          .sort((a, b) => {
            if (a.slug === FEATURED_EVENT_SLUG) return -1;
            if (b.slug === FEATURED_EVENT_SLUG) return 1;
            return compareDate(a.eventStartDt, b.eventStartDt);
          });

        const pageResults = await Promise.allSettled(
          officialEvents.map((event) => (
            event.slug ? callGetPublicEventPage(event.slug) : Promise.resolve(null)
          )),
        );

        if (!mounted) return;

        setEvents(officialEvents.map((event, index) => ({
          event,
          page: pageResults[index]?.status === 'fulfilled' ? pageResults[index].value?.item ?? null : null,
        })));
      } catch {
        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const featured = events[0];
  const remainingEvents = events.slice(1);
  const pageTitle = featured ? getEventTitle(featured) : 'Official Events';
  const heroSubtitle = featured ? getEventMeta(featured) : 'Seoul ADR Festival official events';

  useEffect(() => {
    if (loading || !featured?.event.slug) return;
    replacePath(`/event/${encodeURIComponent(featured.event.slug)}`, setCurrentPath);
  }, [featured?.event.slug, loading, setCurrentPath]);

  useEffect(() => {
    if (!officialEventPath || officialEventPath === '/events') return;
    replacePath(officialEventPath, setCurrentPath);
  }, [officialEventPath, setCurrentPath]);

  return (
    <main className="mp-main official-events-main">
        <section
          className="mp-hero official-events-hero"
          style={{ backgroundImage: `url(${assetSrc(HeroImage)})` }}
        >
          <div className="mp-hero-content">
            <nav className="mp-breadcrumb" aria-label="Breadcrumb">
              <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span>Official Events</span>
            </nav>
            <h1 className="mp-hero-title">Official Events</h1>
          </div>
        </section>

        <BlobGraphic className="mp-blob official-events-blob" aria-hidden="true" />

        <div className="mp-body official-events-body">
          <div className="saf-renewal-shell">
            <div className="official-events-heading">
              <h2 className="mp-heading">Official Events</h2>
              <p>{pageTitle}</p>
            </div>

            {loading && <div className="official-events-empty">Loading events...</div>}

            {!loading && featured && (
              <OfficialEventFeature
                card={featured}
                subtitle={heroSubtitle}
                onOpen={() => navigate(`/event/${encodeURIComponent(featured.event.slug)}`)}
              />
            )}

            {!loading && remainingEvents.length > 0 && (
              <div className="official-events-list" aria-label="More official events">
                {remainingEvents.map((card) => (
                  <OfficialEventTile
                    key={card.event.eventSeq}
                    card={card}
                    onOpen={() => navigate(`/event/${encodeURIComponent(card.event.slug)}`)}
                  />
                ))}
              </div>
            )}

            {!loading && events.length === 0 && (
              <div className="official-events-empty">No official events found.</div>
            )}
          </div>
        </div>
      </main>
  );
};

function OfficialEventFeature({
  card,
  subtitle,
  onOpen,
}: {
  card: OfficialEventCard;
  subtitle: string;
  onOpen: () => void;
}) {
  const title = getEventTitle(card);
  const imageUrl = getEventImage(card);
  const summary = getEventSummary(card);
  const statusLabel = normalizeStatus(card.event.status);

  return (
    <article className="official-event-feature">
      <button
        type="button"
        className="official-event-feature-media"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
        aria-label={`Open ${title}`}
        onClick={onOpen}
      />
      <div className="official-event-feature-copy">
        <span className="official-event-status">{statusLabel}</span>
        <h3>{title}</h3>
        {subtitle && <p className="official-event-meta">{subtitle}</p>}
        {summary && <p className="official-event-summary">{summary}</p>}
        <button type="button" className="official-event-link" onClick={onOpen}>
          View Details
          <span aria-hidden="true">{'\u203a'}</span>
        </button>
      </div>
    </article>
  );
}

function OfficialEventTile({ card, onOpen }: { card: OfficialEventCard; onOpen: () => void }) {
  const title = getEventTitle(card);
  const imageUrl = getEventImage(card);
  const summary = getEventSummary(card);

  return (
    <article className="official-event-tile">
      <button
        type="button"
        className="official-event-tile-media"
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
        aria-label={`Open ${title}`}
        onClick={onOpen}
      />
      <div className="official-event-tile-body">
        <span>{getEventMeta(card)}</span>
        <h3>{title}</h3>
        {summary && <p>{summary}</p>}
      </div>
    </article>
  );
}

function getEventTitle(card: OfficialEventCard) {
  return card.page?.pageTitle || card.page?.heroTitle || card.page?.eventTitle || card.event.title;
}

function getEventSummary(card: OfficialEventCard) {
  return stripHtml(card.page?.eventSummary || card.page?.pageSubtitle || card.event.summary || '');
}

function getEventImage(card: OfficialEventCard) {
  return card.page?.heroImageUrl || '';
}

function getEventMeta(card: OfficialEventCard) {
  const date = formatDateRange(card.page?.eventStartDt || card.event.eventStartDt, card.page?.eventEndDt || card.event.eventEndDt);
  const location = card.page?.location || card.event.location;
  return [date, location].filter(Boolean).join(' | ');
}

function normalizeStatus(status?: string | null) {
  if (!status) return 'Official Event';
  return status
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(' ');
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function compareDate(first?: string | null, second?: string | null) {
  return parseTime(first) - parseTime(second);
}

function parseTime(value?: string | null) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const date = new Date(value.includes('T') ? value : value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? Number.MAX_SAFE_INTEGER : date.getTime();
}

function formatDateRange(start?: string | null, end?: string | null) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (startDate && endDate) {
    if (isSameDay(startDate, endDate)) {
      return formatDateOnly(startDate);
    }
    return `${formatDateOnly(startDate)} - ${formatDateOnly(endDate)}`;
  }

  if (startDate) return formatDateOnly(startDate);
  if (endDate) return formatDateOnly(endDate);
  return '';
}

function parseDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value.includes('T') ? value : value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

export default PublicEvents;
