import { useEffect, useState } from 'react';
import { callGetPublicEventList } from '@api/event/EventApi';
import { EventListItem } from '@interface/event/EventManagement';

const FALLBACK_OFFICIAL_EVENT_SLUG = 'asia-civil-law-summit-demo';

export const DEFAULT_OFFICIAL_EVENT_PATH = `/event/${FALLBACK_OFFICIAL_EVENT_SLUG}`;

/** events 테이블 status='published' 인 공식(main) 이벤트 목록을 노출 순서로 정렬해 조회 */
async function fetchPublishedOfficialEvents() {
  const res = await callGetPublicEventList('published');
  return (res?.item ?? [])
    .filter((event) => event.useYn === 'Y' && event.eventType === 'main' && event.status === 'published' && event.slug)
    .sort((a, b) => {
      if (a.slug === FALLBACK_OFFICIAL_EVENT_SLUG) return -1;
      if (b.slug === FALLBACK_OFFICIAL_EVENT_SLUG) return 1;
      return parseEventTime(a.eventStartDt) - parseEventTime(b.eventStartDt);
    });
}

/** 네비게이션 하위 메뉴 등에서 쓰는 published 공식 이벤트 전체 목록 (실패/없음 → 빈 배열) */
export function usePublishedOfficialEvents() {
  const [events, setEvents] = useState<EventListItem[]>([]);

  useEffect(() => {
    let mounted = true;

    fetchPublishedOfficialEvents()
      .then((list) => {
        if (mounted) setEvents(list);
      })
      .catch(() => {
        if (mounted) setEvents([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return events;
}

export function useCurrentOfficialEventPath() {
  const [path, setPath] = useState(DEFAULT_OFFICIAL_EVENT_PATH);

  useEffect(() => {
    let mounted = true;

    fetchPublishedOfficialEvents()
      .then((events) => {
        if (!mounted) return;
        const slug = events[0]?.slug || FALLBACK_OFFICIAL_EVENT_SLUG;
        setPath(`/event/${encodeURIComponent(slug)}`);
      })
      .catch(() => {
        if (mounted) setPath(DEFAULT_OFFICIAL_EVENT_PATH);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return path;
}

function parseEventTime(value?: string | null) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const date = new Date(value.includes('T') ? value : value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? Number.MAX_SAFE_INTEGER : date.getTime();
}
