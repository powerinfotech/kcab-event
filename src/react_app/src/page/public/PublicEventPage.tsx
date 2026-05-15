import React, { useEffect, useMemo, useState } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import { callGetPublicEventPage } from '@api/event/EventApi';
import { EventPageBlock, EventPageSection, PublicEventPage as PublicEventPageModel } from '@interface/event/EventManagement';

interface PublicEventPageProps {
  urlSlug: string;
}

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
        <section className="pub-section section-hero size-medium" style={{
          background: 'linear-gradient(135deg, #0f1b3d 0%, #294DC7 100%)',
        }}>
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
          <EventPageSectionRenderer key={section.sectionSeq} section={section} />
        ))}
      </main>
      <PublicFooter />
    </div>
  );
};

const EventPageSectionRenderer: React.FC<{ section: EventPageSection }> = ({ section }) => {
  const anchor = section.anchorId || section.sectionKey;
  const blocks = section.blocks ?? [];

  if (section.sectionType === 'speakers') {
    return (
      <section id={anchor} className="pub-section section-speaker-list">
        <div className="pub-section-inner">
          <h3 className="speaker-title">{section.title || 'Speakers'}</h3>
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          <div className="speaker-grid">
            {blocks.map((block) => (
              <article className="speaker-item" key={block.blockSeq}>
                <div className="speaker-photo" />
                <h4 className="speaker-name">{block.title}</h4>
                {block.subtitle && <p className="speaker-role">{block.subtitle}</p>}
                {block.organizationName && <p className="speaker-org">{block.organizationName}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.sectionType === 'program') {
    return (
      <section id={anchor} className="pub-section section-text size-medium">
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
      <section id={anchor} className="pub-section section-banner-list">
        <div className="pub-section-inner">
          <h3 className="card-list-title">{section.title || 'Supporting Organizations'}</h3>
          <div className="banner-grid">
            {blocks.map((block) => renderLinkedBlock(block, 'pub-event-logo-card'))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={anchor} className="pub-section section-text size-medium">
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
  const topLevelBlocks = blocks.filter((block) => !block.parentBlockSeq);
  const childrenByParent = blocks.reduce<Record<number, EventPageBlock[]>>((acc, block) => {
    if (block.parentBlockSeq) {
      acc[block.parentBlockSeq] = [...(acc[block.parentBlockSeq] ?? []), block];
    }
    return acc;
  }, {});

  return topLevelBlocks.map((block) => {
    const children = childrenByParent[block.blockSeq] ?? [];
    if (children.length > 0 || block.blockType === 'agenda_day') {
      return (
        <div className="pub-event-program-day" key={block.blockSeq}>
          <h4>{block.title}</h4>
          {children.map((child) => renderProgramSession(child))}
        </div>
      );
    }
    return renderProgramSession(block);
  });
}

function renderProgramSession(block: EventPageBlock) {
  return (
    <article className="pub-event-program-session" key={block.blockSeq}>
      <div className="pub-event-program-time">{formatBlockTime(block)}</div>
      <div>
        <h5>{block.title}</h5>
        {block.speakerNames && <p className="pub-event-program-speakers">{block.speakerNames}</p>}
        {block.venueName && <p className="pub-event-program-venue">{block.venueName}</p>}
        {block.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: block.body }} />}
      </div>
    </article>
  );
}

function renderLinkedBlock(block: EventPageBlock, className: string) {
  const content = (
    <>
      {block.badgeText && <span className="pub-event-page-badge">{block.badgeText}</span>}
      <h4>{block.title || block.organizationName || block.buttonLabel}</h4>
      {block.subtitle && <p className="pub-event-page-subtitle">{block.subtitle}</p>}
      {block.summary && <p>{block.summary}</p>}
      {block.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: block.body }} />}
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

export default PublicEventPage;
