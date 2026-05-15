'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  callGetEventPageBuilder,
  callGetEventPageBuilderCatalog,
  callSaveEventPageBuilder,
} from '@api/event/EventApi';
import {
  EventPageBlock,
  EventPageComponentCatalog,
  EventPageComponentTemplate,
  EventPageSection,
  PublicEventPage,
} from '@interface/event/EventManagement';

interface OfficialEventPageBuilderProps {
  eventSeq: number | null;
  canEdit: boolean;
}

const EMPTY_CATALOG: EventPageComponentCatalog = { categories: [], templates: [] };

const OfficialEventPageBuilder: React.FC<OfficialEventPageBuilderProps> = ({ eventSeq, canEdit }) => {
  const { message } = App.useApp();
  const tempSeqRef = useRef(-1);
  const [catalog, setCatalog] = useState<EventPageComponentCatalog>(EMPTY_CATALOG);
  const [page, setPage] = useState<PublicEventPage | null>(null);
  const [activeSectionSeq, setActiveSectionSeq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const sectionTemplates = useMemo(
    () => catalog.templates.filter((template) => template.componentScope === 'section'),
    [catalog.templates],
  );
  const blockTemplates = useMemo(
    () => catalog.templates.filter((template) => template.componentScope === 'block'),
    [catalog.templates],
  );
  const activeSection = useMemo(
    () => page?.sections.find((section) => section.sectionSeq === activeSectionSeq) ?? null,
    [page?.sections, activeSectionSeq],
  );

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!eventSeq) {
        setPage(null);
        setActiveSectionSeq(null);
        return;
      }

      setLoading(true);
      try {
        const [catalogRes, pageRes] = await Promise.all([
          callGetEventPageBuilderCatalog(),
          callGetEventPageBuilder(eventSeq),
        ]);
        if (!mounted) return;
        const nextCatalog = catalogRes?.item ?? EMPTY_CATALOG;
        const nextPage = normalizePage(pageRes?.item ?? null, eventSeq);
        setCatalog(nextCatalog);
        setPage(nextPage);
        setActiveSectionSeq(nextPage.sections[0]?.sectionSeq ?? null);
      } catch (err: any) {
        if (!mounted) return;
        setCatalog(EMPTY_CATALOG);
        setPage(null);
        message.error(err?.response?.data?.message ?? 'Failed to load official page builder.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [eventSeq, message]);

  const nextTempSeq = () => {
    const value = tempSeqRef.current;
    tempSeqRef.current -= 1;
    return value;
  };

  const updatePage = (patch: Partial<PublicEventPage>) => {
    setPage((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const updateSection = (sectionSeq: number, patch: Partial<EventPageSection>) => {
    setPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((section) => (
          section.sectionSeq === sectionSeq ? { ...section, ...patch } : section
        )),
      };
    });
  };

  const updateBlock = (sectionSeq: number, blockSeq: number, patch: Partial<EventPageBlock>) => {
    setPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((section) => {
          if (section.sectionSeq !== sectionSeq) return section;
          return {
            ...section,
            blocks: section.blocks.map((block) => (
              block.blockSeq === blockSeq ? { ...block, ...patch } : block
            )),
          };
        }),
      };
    });
  };

  const addSection = (template: EventPageComponentTemplate) => {
    if (!page || !canEdit) return;
    const sectionSeq = nextTempSeq();
    const sectionType = template.componentType || 'section';
    const sectionKey = buildKey(sectionType, page.sections.length + 1);
    const section: EventPageSection = {
      sectionSeq,
      eventPageSeq: page.eventPageSeq ?? 0,
      componentTemplateSeq: template.componentTemplateSeq,
      sectionKey,
      sectionType,
      title: template.defaultTitle || template.templateName,
      subtitle: template.defaultSubtitle || '',
      body: '',
      anchorId: sectionKey,
      navLabel: template.defaultTitle || template.templateName,
      showInNavYn: 'Y',
      layoutType: 'standard',
      columnCount: readColumnCount(template.defaultSettingsJson),
      sortSeq: page.sections.length + 1,
      useYn: 'Y',
      settingsJson: template.defaultSettingsJson || '{}',
      blocks: [],
    };
    setPage({ ...page, sections: [...page.sections, section] });
    setActiveSectionSeq(sectionSeq);
  };

  const removeSection = (sectionSeq: number) => {
    if (!page || !canEdit) return;
    const nextSections = page.sections.filter((section) => section.sectionSeq !== sectionSeq);
    setPage({ ...page, sections: resequenceSections(nextSections) });
    if (activeSectionSeq === sectionSeq) {
      setActiveSectionSeq(nextSections[0]?.sectionSeq ?? null);
    }
  };

  const moveSection = (sectionSeq: number, direction: -1 | 1) => {
    if (!page || !canEdit) return;
    const index = page.sections.findIndex((section) => section.sectionSeq === sectionSeq);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= page.sections.length) return;
    const nextSections = [...page.sections];
    [nextSections[index], nextSections[targetIndex]] = [nextSections[targetIndex], nextSections[index]];
    setPage({ ...page, sections: resequenceSections(nextSections) });
  };

  const addBlock = (template: EventPageComponentTemplate) => {
    if (!page || !activeSection || !canEdit) return;
    const blockSeq = nextTempSeq();
    const blockType = template.componentType || 'card';
    const block: EventPageBlock = {
      blockSeq,
      sectionSeq: activeSection.sectionSeq,
      componentTemplateSeq: template.componentTemplateSeq,
      blockKey: buildKey(blockType, activeSection.blocks.length + 1),
      blockType,
      title: template.defaultTitle || template.templateName,
      subtitle: template.defaultSubtitle || '',
      summary: '',
      body: '',
      linkTarget: '_self',
      featuredYn: 'N',
      sortSeq: activeSection.blocks.length + 1,
      useYn: 'Y',
      styleJson: template.defaultSettingsJson || '{}',
      contentJson: template.defaultContentJson || '{}',
    };
    updateSection(activeSection.sectionSeq, {
      blocks: resequenceBlocks([...activeSection.blocks, block]),
    });
  };

  const removeBlock = (sectionSeq: number, blockSeq: number) => {
    if (!page || !canEdit) return;
    const section = page.sections.find((item) => item.sectionSeq === sectionSeq);
    if (!section) return;
    const nextBlocks = section.blocks
      .filter((block) => block.blockSeq !== blockSeq && block.parentBlockSeq !== blockSeq)
      .map((block) => (block.parentBlockSeq === blockSeq ? { ...block, parentBlockSeq: null } : block));
    updateSection(sectionSeq, { blocks: resequenceBlocks(nextBlocks) });
  };

  const moveBlock = (sectionSeq: number, blockSeq: number, direction: -1 | 1) => {
    if (!page || !canEdit) return;
    const section = page.sections.find((item) => item.sectionSeq === sectionSeq);
    if (!section) return;
    const index = section.blocks.findIndex((block) => block.blockSeq === blockSeq);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= section.blocks.length) return;
    const nextBlocks = [...section.blocks];
    [nextBlocks[index], nextBlocks[targetIndex]] = [nextBlocks[targetIndex], nextBlocks[index]];
    updateSection(sectionSeq, { blocks: resequenceBlocks(nextBlocks) });
  };

  const saveBuilder = async () => {
    if (!page || !eventSeq) return;
    if (!page.pageTitle?.trim()) {
      message.warning('Please enter the page title.');
      return;
    }
    setSaving(true);
    try {
      const saveDto: PublicEventPage = {
        ...page,
        eventSeq,
        pageStatus: page.pageStatus || 'draft',
        languageCode: page.languageCode || 'en',
        sections: resequenceSections(page.sections).map((section) => ({
          ...section,
          blocks: resequenceBlocks(section.blocks),
        })),
      };
      const res = await callSaveEventPageBuilder(saveDto);
      const nextPage = normalizePage(res?.item ?? null, eventSeq);
      setPage(nextPage);
      setActiveSectionSeq(nextPage.sections[0]?.sectionSeq ?? null);
      message.success('Official page configuration has been saved.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Failed to save official page configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (!eventSeq) {
    return (
      <section className="saf-panel saf-page-builder">
        <BuilderHeader canEdit={false} saving={false} onSave={() => undefined} />
        <div className="saf-builder-empty">Save the official event before configuring its page.</div>
      </section>
    );
  }

  return (
    <section className="saf-panel saf-page-builder">
      <BuilderHeader canEdit={canEdit && !!page} saving={saving || loading} onSave={saveBuilder} />

      {loading || !page ? (
        <div className="saf-builder-empty">Loading official page configuration...</div>
      ) : (
        <>
          <div className="saf-builder-settings">
            <label>
              <span>Page Status</span>
              <select
                value={page.pageStatus || 'draft'}
                disabled={!canEdit}
                onChange={(e) => updatePage({ pageStatus: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label>
              <span>Page Title</span>
              <input
                value={page.pageTitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ pageTitle: e.target.value })}
              />
            </label>
            <label>
              <span>Hero Title</span>
              <input
                value={page.heroTitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ heroTitle: e.target.value })}
              />
            </label>
            <label className="is-wide">
              <span>Hero Subtitle</span>
              <textarea
                value={page.heroSubtitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ heroSubtitle: e.target.value })}
              />
            </label>
          </div>

          <div className="saf-builder-layout">
            <aside className="saf-builder-palette">
              <PaletteGroup
                title="Sections"
                catalog={catalog}
                templates={sectionTemplates}
                disabled={!canEdit}
                onAdd={addSection}
              />
              <PaletteGroup
                title="Cards"
                catalog={catalog}
                templates={blockTemplates}
                disabled={!canEdit || !activeSection}
                onAdd={addBlock}
              />
            </aside>

            <div className="saf-builder-sections">
              <div className="saf-builder-section-list">
                {page.sections.map((section, index) => (
                  <button
                    type="button"
                    key={section.sectionSeq}
                    className={`saf-builder-section-tab${activeSectionSeq === section.sectionSeq ? ' is-active' : ''}`}
                    onClick={() => setActiveSectionSeq(section.sectionSeq)}
                  >
                    <strong>{section.title || section.sectionType || `Section ${index + 1}`}</strong>
                    <span>{section.sectionType}</span>
                  </button>
                ))}
                {!page.sections.length && <div className="saf-builder-empty is-small">No sections yet.</div>}
              </div>

              {activeSection && (
                <SectionEditor
                  section={activeSection}
                  canEdit={canEdit}
                  onUpdate={(patch) => updateSection(activeSection.sectionSeq, patch)}
                  onRemove={() => removeSection(activeSection.sectionSeq)}
                  onMove={(direction) => moveSection(activeSection.sectionSeq, direction)}
                  onUpdateBlock={(blockSeq, patch) => updateBlock(activeSection.sectionSeq, blockSeq, patch)}
                  onRemoveBlock={(blockSeq) => removeBlock(activeSection.sectionSeq, blockSeq)}
                  onMoveBlock={(blockSeq, direction) => moveBlock(activeSection.sectionSeq, blockSeq, direction)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

const BuilderHeader: React.FC<{ canEdit: boolean; saving: boolean; onSave: () => void }> = ({ canEdit, saving, onSave }) => (
  <div className="saf-panel-title-row">
    <div className="saf-panel-title">
      <h2>Official Page Builder</h2>
      <p>Structured sections and cards for official KCAB International events.</p>
    </div>
    {canEdit && (
      <button type="button" className="saf-action-btn is-primary" onClick={onSave} disabled={saving}>
        <SaveOutlined />
        <span>{saving ? 'Saving' : 'Save Page'}</span>
      </button>
    )}
  </div>
);

const PaletteGroup: React.FC<{
  title: string;
  catalog: EventPageComponentCatalog;
  templates: EventPageComponentTemplate[];
  disabled: boolean;
  onAdd: (template: EventPageComponentTemplate) => void;
}> = ({ title, catalog, templates, disabled, onAdd }) => (
  <div className="saf-builder-palette-group">
    <h3>{title}</h3>
    {catalog.categories.map((category) => {
      const categoryTemplates = templates.filter((template) => template.componentCategorySeq === category.componentCategorySeq);
      if (!categoryTemplates.length) return null;
      return (
        <div className="saf-builder-template-group" key={`${title}-${category.componentCategorySeq}`}>
          <span>{category.categoryName}</span>
          {categoryTemplates.map((template) => (
            <button
              type="button"
              key={template.componentTemplateSeq}
              disabled={disabled}
              onClick={() => onAdd(template)}
            >
              <PlusOutlined />
              <strong>{template.templateName}</strong>
            </button>
          ))}
        </div>
      );
    })}
  </div>
);

const SectionEditor: React.FC<{
  section: EventPageSection;
  canEdit: boolean;
  onUpdate: (patch: Partial<EventPageSection>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onUpdateBlock: (blockSeq: number, patch: Partial<EventPageBlock>) => void;
  onRemoveBlock: (blockSeq: number) => void;
  onMoveBlock: (blockSeq: number, direction: -1 | 1) => void;
}> = ({ section, canEdit, onUpdate, onRemove, onMove, onUpdateBlock, onRemoveBlock, onMoveBlock }) => (
  <div className="saf-builder-editor">
    <div className="saf-builder-editor-actions">
      <button type="button" disabled={!canEdit} onClick={() => onMove(-1)} title="Move up">
        <ArrowUpOutlined />
      </button>
      <button type="button" disabled={!canEdit} onClick={() => onMove(1)} title="Move down">
        <ArrowDownOutlined />
      </button>
      <button type="button" disabled={!canEdit} onClick={onRemove} title="Delete">
        <DeleteOutlined />
      </button>
    </div>
    <div className="saf-builder-form">
      <label>
        <span>Section Type</span>
        <input value={section.sectionType ?? ''} disabled />
      </label>
      <label>
        <span>Section Key</span>
        <input
          value={section.sectionKey ?? ''}
          disabled={!canEdit}
          onChange={(e) => onUpdate({ sectionKey: e.target.value, anchorId: e.target.value })}
        />
      </label>
      <label>
        <span>Title</span>
        <input
          value={section.title ?? ''}
          disabled={!canEdit}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </label>
      <label>
        <span>Navigation Label</span>
        <input
          value={section.navLabel ?? ''}
          disabled={!canEdit}
          onChange={(e) => onUpdate({ navLabel: e.target.value })}
        />
      </label>
      <label>
        <span>Show in Nav</span>
        <select
          value={section.showInNavYn ?? 'Y'}
          disabled={!canEdit}
          onChange={(e) => onUpdate({ showInNavYn: e.target.value })}
        >
          <option value="Y">Show</option>
          <option value="N">Hide</option>
        </select>
      </label>
      <label>
        <span>Active</span>
        <select
          value={section.useYn ?? 'Y'}
          disabled={!canEdit}
          onChange={(e) => onUpdate({ useYn: e.target.value })}
        >
          <option value="Y">Active</option>
          <option value="N">Inactive</option>
        </select>
      </label>
      <label className="is-wide">
        <span>Subtitle</span>
        <textarea
          value={section.subtitle ?? ''}
          disabled={!canEdit}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
        />
      </label>
      <label className="is-wide">
        <span>Body</span>
        <textarea
          value={section.body ?? ''}
          disabled={!canEdit}
          onChange={(e) => onUpdate({ body: e.target.value })}
        />
      </label>
    </div>

    <div className="saf-builder-blocks">
      <div className="saf-builder-subtitle">
        <h3>Cards</h3>
        <span>{section.blocks.length}</span>
      </div>
      {section.blocks.map((block) => (
        <BlockEditor
          key={block.blockSeq}
          section={section}
          block={block}
          canEdit={canEdit}
          onUpdate={(patch) => onUpdateBlock(block.blockSeq, patch)}
          onRemove={() => onRemoveBlock(block.blockSeq)}
          onMove={(direction) => onMoveBlock(block.blockSeq, direction)}
        />
      ))}
      {!section.blocks.length && <div className="saf-builder-empty is-small">No cards in this section.</div>}
    </div>
  </div>
);

const BlockEditor: React.FC<{
  section: EventPageSection;
  block: EventPageBlock;
  canEdit: boolean;
  onUpdate: (patch: Partial<EventPageBlock>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}> = ({ section, block, canEdit, onUpdate, onRemove, onMove }) => {
  const agendaDays = section.blocks.filter((item) => item.blockType === 'agenda_day' && item.blockSeq !== block.blockSeq);

  return (
    <article className="saf-builder-block-editor">
      <div className="saf-builder-block-head">
        <div>
          <strong>{block.title || block.blockType}</strong>
          <span>{block.blockType}</span>
        </div>
        <div>
          <button type="button" disabled={!canEdit} onClick={() => onMove(-1)} title="Move up">
            <ArrowUpOutlined />
          </button>
          <button type="button" disabled={!canEdit} onClick={() => onMove(1)} title="Move down">
            <ArrowDownOutlined />
          </button>
          <button type="button" disabled={!canEdit} onClick={onRemove} title="Delete">
            <DeleteOutlined />
          </button>
        </div>
      </div>
      <div className="saf-builder-form is-compact">
        <label>
          <span>Title</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>Subtitle</span>
          <input value={block.subtitle ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ subtitle: e.target.value })} />
        </label>
        <label>
          <span>Start</span>
          <input type="datetime-local" value={toDatetimeInput(block.startAt)} disabled={!canEdit} onChange={(e) => onUpdate({ startAt: e.target.value || null })} />
        </label>
        <label>
          <span>End</span>
          <input type="datetime-local" value={toDatetimeInput(block.endAt)} disabled={!canEdit} onChange={(e) => onUpdate({ endAt: e.target.value || null })} />
        </label>
        <label>
          <span>Venue</span>
          <input value={block.venueName ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ venueName: e.target.value })} />
        </label>
        <label>
          <span>Speakers</span>
          <input value={block.speakerNames ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ speakerNames: e.target.value })} />
        </label>
        <label>
          <span>Organization</span>
          <input value={block.organizationName ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ organizationName: e.target.value })} />
        </label>
        <label>
          <span>Parent Day</span>
          <select
            value={block.parentBlockSeq ?? ''}
            disabled={!canEdit || !agendaDays.length}
            onChange={(e) => onUpdate({ parentBlockSeq: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">None</option>
            {agendaDays.map((item) => (
              <option key={item.blockSeq} value={item.blockSeq}>{item.title || item.blockKey}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Active</span>
          <select value={block.useYn ?? 'Y'} disabled={!canEdit} onChange={(e) => onUpdate({ useYn: e.target.value })}>
            <option value="Y">Active</option>
            <option value="N">Inactive</option>
          </select>
        </label>
        <label className="is-wide">
          <span>Summary</span>
          <textarea value={block.summary ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ summary: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Body</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
        <label>
          <span>Button Label</span>
          <input value={block.buttonLabel ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ buttonLabel: e.target.value })} />
        </label>
        <label>
          <span>Link URL</span>
          <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
        </label>
      </div>
    </article>
  );
};

function normalizePage(page: PublicEventPage | null, eventSeq: number): PublicEventPage {
  return {
    eventPageSeq: page?.eventPageSeq ?? 0,
    eventSeq,
    languageCode: page?.languageCode || 'en',
    urlSlug: page?.urlSlug || '',
    pageStatus: page?.pageStatus || 'draft',
    pageTitle: page?.pageTitle || page?.eventTitle || '',
    pageSubtitle: page?.pageSubtitle || '',
    heroTitle: page?.heroTitle || page?.eventTitle || '',
    heroSubtitle: page?.heroSubtitle || '',
    heroFileSeq: page?.heroFileSeq ?? null,
    themeCode: page?.themeCode || 'kcab',
    themeJson: page?.themeJson || '{}',
    settingsJson: page?.settingsJson || '{}',
    publishedAt: page?.publishedAt ?? null,
    eventTitle: page?.eventTitle || '',
    eventSummary: page?.eventSummary || '',
    eventStartDt: page?.eventStartDt || '',
    eventEndDt: page?.eventEndDt || '',
    location: page?.location || '',
    registrationType: page?.registrationType || 'none',
    registrationUrl: page?.registrationUrl || '',
    eventStatus: page?.eventStatus || '',
    eventType: page?.eventType || 'main',
    sections: (page?.sections ?? []).map((section) => ({
      ...section,
      blocks: section.blocks ?? [],
    })),
  };
}

function resequenceSections(sections: EventPageSection[]) {
  return sections.map((section, index) => ({
    ...section,
    sortSeq: index + 1,
    blocks: resequenceBlocks(section.blocks ?? []),
  }));
}

function resequenceBlocks(blocks: EventPageBlock[]) {
  return blocks.map((block, index) => ({
    ...block,
    sortSeq: index + 1,
  }));
}

function buildKey(type: string, index: number) {
  return `${type || 'item'}-${index}`.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
}

function readColumnCount(settingsJson?: string | null) {
  if (!settingsJson) return 1;
  try {
    const parsed = JSON.parse(settingsJson);
    const value = Number(parsed.columnCount);
    return Number.isFinite(value) && value > 0 ? value : 1;
  } catch {
    return 1;
  }
}

function toDatetimeInput(value?: string | null) {
  if (!value) return '';
  return value.replace(' ', 'T').slice(0, 16);
}

export default OfficialEventPageBuilder;
