import { useEffect, useState } from 'react';
import { callGetPublicEventList } from '@api/event/EventApi';

const FALLBACK_OFFICIAL_EVENT_SLUG = 'asia-civil-law-summit-demo';

export const DEFAULT_OFFICIAL_EVENT_PATH = `/event/${FALLBACK_OFFICIAL_EVENT_SLUG}`;

export function useCurrentOfficialEventPath() {
  const [path, setPath] = useState(DEFAULT_OFFICIAL_EVENT_PATH);

  useEffect(() => {
    let mounted = true;

    callGetPublicEventList()
      .then((res) => {
        if (!mounted) return;
        const events = (res?.item ?? [])
          .filter((event) => event.useYn === 'Y' && event.eventType === 'main' && event.status === 'published')
          .sort((a, b) => {
            if (a.slug === FALLBACK_OFFICIAL_EVENT_SLUG) return -1;
            if (b.slug === FALLBACK_OFFICIAL_EVENT_SLUG) return 1;
            return parseEventTime(a.eventStartDt) - parseEventTime(b.eventStartDt);
          });
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
