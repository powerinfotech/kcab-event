import React, { useEffect, useMemo, useState } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import { callGetPublicEventPage } from '@api/event/EventApi';
import { EventPageBlock, EventPageSection, PublicEventPage as PublicEventPageModel } from '@interface/event/EventManagement';

interface PublicEventPageProps {
  urlSlug: string;
}

interface PageTheme {
  heroBackgroundType: 'image' | 'color';
  heroOverlay: 'dark' | 'light' | 'none';
  themeColor: string;
  heroBackgroundColor: string;
}

interface SectionSettings {
  backgroundStyle?: 'white' | 'soft' | 'navy' | 'gold';
  width?: 'normal' | 'wide';
  spacing?: 'compact' | 'normal' | 'spacious';
}

const DEFAULT_THEME: PageTheme = {
  heroBackgroundType: 'color',
  heroOverlay: 'dark',
  themeColor: 'navy',
  heroBackgroundColor: '#102033',
};

const THEME_COLOR_MAP: Record<string, string> = {
  navy: '#102033',
  blue: '#1f5b95',
  gold: '#b88900',
  gray: '#475569',
};

const PublicEventPage: React.FC<PublicEventPageProps> = ({ urlSlug }) => {
  const [page, setPage] = useState<PublicEventPageModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    callGetPublicEventPage(urlSlug)
      .then((res) => {
        if (!mounted) return;
        setPage(res?.item ?? null);
      })
      .catch(() => {
        if (mounted) setPage(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [urlSlug]);

  const navSections = useMemo(
    () => (page?.sections ?? []).filter((section) => section.showInNavYn !== 'N' && (section.navLabel || section.title)),
    [page],
  );
  const theme = useMemo(() => parseTheme(page?.themeJson), [page?.themeJson]);
  const accentColor = getThemeColor(theme.themeColor);

  const handleNavigate = (url: string) => { window.location.href = url; };

  if (loading) {
    return (
      <div className="pub-layout">
        <PublicHeader currentUrl="/events" onNavigate={handleNavigate} />
        <main className="pub-page-content">
          <section className="pub-section section-text size-medium">
            <div className="pub-section-inner">Loading event...</div>
          </section>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="pub-layout">
        <PublicHeader currentUrl="/events" onNavigate={handleNavigate} />
        <main className="pub-page-content">
          <section className="pub-section section-text size-medium">
            <div className="pub-section-inner">
              <h3 className="text-title" style={{ paddingLeft: 0 }}>Event not found</h3>
              <p className="text-content">The event page is not published or the URL is incorrect.</p>
            </div>
          </section>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const heroTitle = page.heroTitle || page.pageTitle || page.eventTitle;
  const heroSubtitle = page.heroSubtitle || page.pageSubtitle || formatEventMeta(page);

  return (
    <div className="pub-layout">
      <PublicHeader currentUrl="/events" onNavigate={handleNavigate} />
      <main className="pub-page-content">
        <section className="pub-section section-hero size-medium pub-event-builder-hero" style={buildHeroStyle(theme, page.heroImageUrl)}>
          <div className="hero-content">
            <h2 className="hero-title">{heroTitle}</h2>
            {heroSubtitle && <p className="hero-subtitle">{heroSubtitle}</p>}
            {page.registrationUrl && (
              <a className="pub-event-register-link" href={page.registrationUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 24 }}>
                Register
              </a>
            )}
          </div>
        </section>

        {navSections.length > 0 && (
          <nav className="pub-event-page-nav">
            {navSections.map((section) => (
              <a key={section.sectionSeq} href={`#${section.anchorId || section.sectionKey}`}>
                {section.navLabel || section.title}
              </a>
            ))}
          </nav>
        )}

        {page.sections.map((section) => (
          <EventPageSectionRenderer key={section.sectionSeq} section={section} accentColor={accentColor} />
        ))}
      </main>
      <PublicFooter />
    </div>
  );
};

const EventPageSectionRenderer: React.FC<{ section: EventPageSection; accentColor: string }> = ({ section, accentColor }) => {
  const anchor = section.anchorId || section.sectionKey;
  const blocks = section.blocks ?? [];
  const sectionSettings = parseSectionSettings(section.settingsJson);
  const sectionStyle = { '--pub-event-accent': accentColor } as React.CSSProperties;
  const sectionClassName = [
    'pub-event-builder-section',
    `pub-event-bg-${sectionSettings.backgroundStyle || 'white'}`,
    `pub-event-width-${sectionSettings.width || 'normal'}`,
    `pub-event-spacing-${sectionSettings.spacing || 'normal'}`,
  ].join(' ');

  if (section.sectionType === 'speakers') {
    return (
      <section id={anchor} className={`pub-section section-speaker-list ${sectionClassName}`} style={sectionStyle}>
        <div className="pub-section-inner">
          <h3 className="speaker-title">{section.title || 'Speakers'}</h3>
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          <div className="speaker-grid">
            {blocks.map((block) => renderSpeakerCard(block))}
          </div>
        </div>
      </section>
    );
  }

  if (section.sectionType === 'program') {
    return (
      <section id={anchor} className={`pub-section section-text size-medium ${sectionClassName} pub-event-builder-program`} style={sectionStyle}>
        <div className="pub-section-inner">
          <h3 className="text-title">{section.title || 'Program'}</h3>
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          <div className="pub-event-program-list">
            {renderProgramBlocks(blocks)}
          </div>
        </div>
      </section>
    );
  }

  if (section.sectionType === 'supporting_organizations') {
    return (
      <section id={anchor} className={`pub-section section-banner-list ${sectionClassName}`} style={sectionStyle}>
        <div className="pub-section-inner">
          <h3 className="card-list-title">{section.title || 'Supporting Organizations'}</h3>
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          {renderSupportingOrganizations(blocks)}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'visit_seoul') {
    return (
      <section id={anchor} className={`pub-section section-text size-medium ${sectionClassName}`} style={sectionStyle}>
        <div className="pub-section-inner">
          {section.title && <h3 className="text-title">{section.title}</h3>}
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          {section.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: section.body }} />}
          {blocks.length > 0 && (
            <div className="pub-event-subsection">
              <h4>Partner Hotels</h4>
              <div className="pub-event-page-card-grid pub-event-hotel-grid">
                {blocks.map((block) => renderLinkedBlock(block, 'pub-event-page-card pub-event-hotel-card'))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id={anchor} className={`pub-section section-text size-medium ${sectionClassName}`} style={sectionStyle}>
      <div className="pub-section-inner">
        {section.title && <h3 className="text-title">{section.title}</h3>}
        {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
        {section.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: section.body }} />}
        {blocks.length > 0 && (
          <div className="pub-event-page-card-grid">
            {blocks.map((block) => renderLinkedBlock(block, 'pub-event-page-card'))}
          </div>
        )}
      </div>
    </section>
  );
};

function renderProgramBlocks(blocks: EventPageBlock[]) {
  const topLevelBlocks = blocks.filter((block) => !block.parentBlockSeq && block.useYn !== 'N');
  const childrenByParent = blocks.reduce<Record<number, EventPageBlock[]>>((acc, block) => {
    if (block.parentBlockSeq && block.useYn !== 'N') {
      acc[block.parentBlockSeq] = [...(acc[block.parentBlockSeq] ?? []), block];
    }
    return acc;
  }, {});

  const sessions = topLevelBlocks.flatMap((block) => {
    const children = childrenByParent[block.blockSeq] ?? [];
    if (children.length > 0 || block.blockType === 'agenda_day') {
      return children;
    }
    return [block];
  });

  return groupProgramBlocks(sessions).map(([track, trackSessions]) => (
    <section className="pub-event-program-track" key={track}>
      <div className="pub-event-program-track-head">
        <span>{track}</span>
      </div>
      <div className="pub-event-program-track-sessions">
        {trackSessions.map((block) => renderProgramSession(block))}
      </div>
    </section>
  ));
}

function renderProgramSession(block: EventPageBlock) {
  return (
    <article className="pub-event-program-session" key={block.blockSeq}>
      <div className="pub-event-program-time">{formatBlockTime(block)}</div>
      <div>
        {block.linkUrl ? (
          <h5>
            <a className="pub-event-program-link" href={block.linkUrl} target={block.linkTarget || '_self'} rel="noopener noreferrer">
              {block.title}
            </a>
          </h5>
        ) : (
          <h5>{block.title}</h5>
        )}
        {block.speakerNames && <p className="pub-event-program-speakers">{block.speakerNames}</p>}
        {block.venueName && <p className="pub-event-program-venue">{block.venueName}</p>}
        {block.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: block.body }} />}
      </div>
    </article>
  );
}

function renderSpeakerCard(block: EventPageBlock) {
  const content = (
    <>
      {getBlockImageUrl(block) ? (
        <img className="speaker-photo" src={getBlockImageUrl(block)} alt={block.title || 'Speaker'} />
      ) : (
        <div className="speaker-photo speaker-photo-fallback">{(block.title || 'S').slice(0, 1)}</div>
      )}
      <h4 className="speaker-name">{block.title}</h4>
      {block.subtitle && <p className="speaker-role">{block.subtitle}</p>}
      {block.organizationName && <p className="speaker-org">{block.organizationName}</p>}
    </>
  );

  if (block.linkUrl) {
    return (
      <a key={block.blockSeq} className="speaker-item pub-event-speaker-link" href={block.linkUrl} target={block.linkTarget || '_self'} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <article className="speaker-item" key={block.blockSeq}>{content}</article>;
}

function renderSupportingOrganizations(blocks: EventPageBlock[]) {
  const shownBlocks = blocks.filter((block) => block.useYn !== 'N');
  const organizers = shownBlocks.filter((block) => getOrganizationGroup(block) === 'Organizers');
  const supporters = shownBlocks.filter((block) => getOrganizationGroup(block) !== 'Organizers');

  return (
    <div className="pub-event-org-wrap">
      {organizers.length > 0 && (
        <div className="pub-event-org-group is-organizers">
          <h4>Organizers</h4>
          <div className="pub-event-org-grid">
            {organizers.map((block) => renderLinkedBlock(block, 'pub-event-logo-card is-large'))}
          </div>
        </div>
      )}
      {supporters.length > 0 && (
        <div className="pub-event-org-group is-supporters">
          <h4>Supporters</h4>
          <div className="pub-event-org-grid">
            {supporters.map((block) => renderLinkedBlock(block, 'pub-event-logo-card'))}
          </div>
        </div>
      )}
    </div>
  );
}

function renderLinkedBlock(block: EventPageBlock, className: string) {
  const imageUrl = getBlockImageUrl(block);
  const extraContent = parseBlockContent(block.contentJson);
  const roomRates = typeof extraContent.roomRates === 'string' ? extraContent.roomRates : '';
  const content = (
    <>
      {imageUrl && (
        <img
          className={className.includes('pub-event-logo-card') ? 'pub-event-logo-image' : 'pub-event-page-card-image'}
          src={imageUrl}
          alt={block.organizationName || block.title || 'Event content'}
        />
      )}
      {block.badgeText && <span className="pub-event-page-badge">{block.badgeText}</span>}
      {(block.title || block.organizationName || block.buttonLabel) && (
        <h4>{block.title || block.organizationName || block.buttonLabel}</h4>
      )}
      {block.subtitle && <p className="pub-event-page-subtitle">{block.subtitle}</p>}
      {block.summary && <p>{block.summary}</p>}
      {block.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: block.body }} />}
      {roomRates && <div className="text-content"><strong>Room Rates</strong><br />{roomRates}</div>}
      {block.buttonLabel && <span className="pub-event-page-button">{block.buttonLabel}</span>}
    </>
  );

  if (block.linkUrl) {
    return (
      <a key={block.blockSeq} className={className} href={block.linkUrl} target={block.linkTarget || '_self'} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <article key={block.blockSeq} className={className}>{content}</article>;
}

function formatEventMeta(page: PublicEventPageModel) {
  const parts = [formatDate(page.eventStartDt), page.location].filter(Boolean);
  return parts.join(' | ');
}

function formatDate(value?: string | null) {
  if (!value) return '';
  return value.replace('T', ' ').slice(0, 16);
}

function formatBlockTime(block: EventPageBlock) {
  const start = formatDate(block.startAt);
  const end = formatDate(block.endAt);
  if (start && end) return `${start} - ${end}`;
  return start || end || '';
}

function parseTheme(themeJson?: unknown): PageTheme {
  if (!themeJson) return DEFAULT_THEME;
  if (typeof themeJson === 'object' && !Array.isArray(themeJson)) {
    return {
      ...DEFAULT_THEME,
      ...(themeJson as Partial<PageTheme>),
    };
  }
  if (typeof themeJson !== 'string') return DEFAULT_THEME;
  try {
    return {
      ...DEFAULT_THEME,
      ...JSON.parse(themeJson),
    };
  } catch {
    return DEFAULT_THEME;
  }
}

function parseSectionSettings(settingsJson?: unknown): SectionSettings {
  if (!settingsJson) return {};
  if (typeof settingsJson === 'object' && !Array.isArray(settingsJson)) {
    return settingsJson as SectionSettings;
  }
  if (typeof settingsJson !== 'string') return {};
  try {
    return JSON.parse(settingsJson);
  } catch {
    return {};
  }
}

function parseBlockContent(contentJson?: unknown): Record<string, unknown> {
  if (!contentJson) return {};
  if (typeof contentJson === 'object' && !Array.isArray(contentJson)) {
    return contentJson as Record<string, unknown>;
  }
  if (typeof contentJson !== 'string') return {};
  try {
    return JSON.parse(contentJson);
  } catch {
    return {};
  }
}

function getProgramTrack(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const track = typeof content.track === 'string' ? content.track : '';
  return track || block.subtitle || 'Main Schedule';
}

function getBlockImageUrl(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const externalImageUrl = typeof content.imageUrl === 'string' ? content.imageUrl : '';
  return block.imageUrl || externalImageUrl;
}

function getOrganizationGroup(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const category = typeof content.category === 'string' ? content.category : block.badgeText || '';
  return category.toLowerCase().includes('organizer') ? 'Organizers' : 'Supporters';
}

function groupProgramBlocks(blocks: EventPageBlock[]) {
  const orderedTracks: string[] = [];
  const grouped = blocks.reduce<Record<string, EventPageBlock[]>>((acc, block) => {
    const track = getProgramTrack(block);
    if (!acc[track]) {
      acc[track] = [];
      orderedTracks.push(track);
    }
    acc[track].push(block);
    return acc;
  }, {});
  return orderedTracks.map((track) => [track, grouped[track]] as const);
}

function getThemeColor(themeColor: string) {
  return THEME_COLOR_MAP[themeColor] ?? THEME_COLOR_MAP.navy;
}

function buildHeroStyle(theme: PageTheme, heroImageUrl?: string | null): React.CSSProperties {
  if (theme.heroBackgroundType === 'image' && heroImageUrl) {
    return {
      backgroundImage: `${getOverlayGradient(theme.heroOverlay)}, url("${heroImageUrl}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    };
  }

  const baseColor = theme.heroBackgroundColor || DEFAULT_THEME.heroBackgroundColor;
  const accentColor = getThemeColor(theme.themeColor);
  return {
    background: `linear-gradient(135deg, ${baseColor} 0%, ${accentColor} 100%)`,
  };
}

function getOverlayGradient(overlay: PageTheme['heroOverlay']) {
  if (overlay === 'light') {
    return 'linear-gradient(135deg, rgba(255,255,255,.78), rgba(255,255,255,.38))';
  }
  if (overlay === 'none') {
    return 'linear-gradient(135deg, rgba(0,0,0,0), rgba(0,0,0,0))';
  }
  return 'linear-gradient(135deg, rgba(16,32,51,.84), rgba(16,32,51,.48))';
}

export default PublicEventPage;
