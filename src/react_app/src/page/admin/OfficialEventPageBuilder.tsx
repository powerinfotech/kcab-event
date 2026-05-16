'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Modal } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  callGetEventPageBuilder,
  callGetEventPageBuilderCatalog,
  callSaveEventPageBuilder,
} from '@api/event/EventApi';
import { callGetFileList, callSaveFiles } from '@api/CommonApi';
import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
import {
  EventPageBlock,
  EventPageComponentCatalog,
  EventPageSection,
  PublicEventPage,
} from '@interface/event/EventManagement';

interface OfficialEventPageBuilderProps {
  eventSeq: number | null;
  canEdit: boolean;
}

interface SectionPreset {
  sectionType: string;
  label: string;
  description: string;
  defaultTitle: string;
  defaultSubtitle?: string;
  blockType?: string;
  addLabel?: string;
}

interface PageTheme {
  heroBackgroundType: 'image' | 'color';
  heroOverlay: 'dark' | 'light' | 'none';
  themeColor: string;
  heroBackgroundColor: string;
}

const EMPTY_CATALOG: EventPageComponentCatalog = { categories: [], templates: [] };
const DEFAULT_THEME: PageTheme = {
  heroBackgroundType: 'color',
  heroOverlay: 'dark',
  themeColor: 'navy',
  heroBackgroundColor: '#102033',
};

const THEME_COLOR_OPTIONS = [
  { value: 'navy', label: 'KCAB Navy', color: '#102033' },
  { value: 'blue', label: 'Conference Blue', color: '#1f5b95' },
  { value: 'gold', label: 'Gold Accent', color: '#b88900' },
  { value: 'gray', label: 'Quiet Gray', color: '#475569' },
];

const HERO_COLOR_OPTIONS = [
  { value: '#102033', label: 'Deep Navy' },
  { value: '#1f5b95', label: 'Conference Blue' },
  { value: '#263238', label: 'Charcoal' },
  { value: '#f4f6f9', label: 'Light Gray' },
];

const SECTION_PRESETS: SectionPreset[] = [
  {
    sectionType: 'about',
    label: 'Event Overview',
    description: 'Purpose, audience, and key messages',
    defaultTitle: 'About',
  },
  {
    sectionType: 'program',
    label: 'Program',
    description: 'Agenda sessions and schedule',
    defaultTitle: 'Program',
    blockType: 'agenda_session',
    addLabel: 'Add Session',
  },
  {
    sectionType: 'speakers',
    label: 'Speakers',
    description: 'Speaker names, roles, and organizations',
    defaultTitle: 'Speakers',
    blockType: 'speaker_card',
    addLabel: 'Add Speaker',
  },
  {
    sectionType: 'supporting_organizations',
    label: 'Organizations',
    description: 'Supporting organizations and partners',
    defaultTitle: 'Supporting Organizations',
    blockType: 'organization_logo',
    addLabel: 'Add Organization',
  },
  {
    sectionType: 'venue',
    label: 'Venue',
    description: 'Venue, room, and access information',
    defaultTitle: 'Venue',
    blockType: 'card',
    addLabel: 'Add Venue Info',
  },
  {
    sectionType: 'notice',
    label: 'Notice',
    description: 'Important notices for participants',
    defaultTitle: 'Notice',
    blockType: 'notice_item',
    addLabel: 'Add Notice',
  },
];

const OfficialEventPageBuilder: React.FC<OfficialEventPageBuilderProps> = ({ eventSeq, canEdit }) => {
  const { message } = App.useApp();
  const tempSeqRef = useRef(-1);
  const [catalog, setCatalog] = useState<EventPageComponentCatalog>(EMPTY_CATALOG);
  const [page, setPage] = useState<PublicEventPage | null>(null);
  const [activeSectionSeq, setActiveSectionSeq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [heroFiles, setHeroFiles] = useState<FileDetailType[]>([]);
  const [blockImageFiles, setBlockImageFiles] = useState<Record<number, FileDetailType[]>>({});

  const activeSection = useMemo(
    () => page?.sections.find((section) => section.sectionSeq === activeSectionSeq) ?? null,
    [page?.sections, activeSectionSeq],
  );
  const activePreset = useMemo(() => getPreset(activeSection), [activeSection]);
  const theme = useMemo(() => parseTheme(page?.themeJson), [page?.themeJson]);

  const nextTempSeq = () => {
    const value = tempSeqRef.current;
    tempSeqRef.current -= 1;
    return value;
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!eventSeq) {
        setPage(null);
        setActiveSectionSeq(null);
        setPreviewOpen(false);
        setHeroFiles([]);
        setBlockImageFiles({});
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
        const nextPage = ensureSimpleSections(normalizePage(pageRes?.item ?? null, eventSeq), nextCatalog, nextTempSeq);
        const nextImages = await loadPageImageFiles(nextPage);
        setCatalog(nextCatalog);
        setPage(nextPage);
        setHeroFiles(nextImages.heroFiles);
        setBlockImageFiles(nextImages.blockImageFiles);
        setActiveSectionSeq(nextPage.sections[0]?.sectionSeq ?? null);
      } catch (err: any) {
        if (!mounted) return;
        setCatalog(EMPTY_CATALOG);
        setPage(null);
        message.error(err?.response?.data?.message ?? 'Failed to load official page setup.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [eventSeq, message]);

  const updatePage = (patch: Partial<PublicEventPage>) => {
    setPage((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const updateTheme = (patch: Partial<PageTheme>) => {
    const nextTheme = { ...theme, ...patch };
    updatePage({ themeJson: JSON.stringify(nextTheme) });
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

  const addItem = (section: EventPageSection, preset: SectionPreset) => {
    if (!page || !canEdit || !preset.blockType) return;
    const block = createBlock(section, preset, catalog, nextTempSeq());
    updateSection(section.sectionSeq, {
      blocks: resequenceBlocks([...(section.blocks ?? []), block]),
    });
  };

  const removeItem = (sectionSeq: number, blockSeq: number) => {
    if (!page || !canEdit) return;
    const section = page.sections.find((item) => item.sectionSeq === sectionSeq);
    if (!section) return;
    updateSection(sectionSeq, {
      blocks: resequenceBlocks((section.blocks ?? []).filter((block) => block.blockSeq !== blockSeq)),
    });
    setBlockImageFiles((prev) => {
      const next = { ...prev };
      delete next[blockSeq];
      return next;
    });
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
      const imageResult = await resolveImageFileSeqs(page, heroFiles, blockImageFiles);
      const saveDto: PublicEventPage = {
        ...imageResult.page,
        eventSeq,
        pageStatus: imageResult.page.pageStatus || 'draft',
        languageCode: imageResult.page.languageCode || 'en',
        sections: prepareSectionsForSave(imageResult.page.sections),
      };
      const res = await callSaveEventPageBuilder(saveDto);
      const nextPage = ensureSimpleSections(normalizePage(res?.item ?? null, eventSeq), catalog, nextTempSeq);
      const nextImages = await loadPageImageFiles(nextPage);
      setPage(nextPage);
      setHeroFiles(nextImages.heroFiles);
      setBlockImageFiles(nextImages.blockImageFiles);
      setActiveSectionSeq(nextPage.sections[0]?.sectionSeq ?? null);
      message.success('Official event homepage has been saved.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Failed to save official event homepage.');
    } finally {
      setSaving(false);
    }
  };

  if (!eventSeq) {
    return (
      <section className="saf-panel saf-page-builder">
        <BuilderHeader
          canEdit={false}
          canPreview={false}
          saving={false}
          onSave={() => undefined}
          onPreview={() => undefined}
        />
        <div className="saf-builder-empty">Save the official event first, then fill in its homepage.</div>
      </section>
    );
  }

  return (
    <section className="saf-panel saf-page-builder">
      <BuilderHeader
        canEdit={canEdit && !!page}
        canPreview={!!page}
        saving={saving || loading}
        onSave={saveBuilder}
        onPreview={() => setPreviewOpen(true)}
      />

      {loading || !page ? (
        <div className="saf-builder-empty">Loading official event homepage...</div>
      ) : (
        <>
          <div className="saf-simple-basics">
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
                placeholder="Event homepage title"
              />
            </label>
            <label>
              <span>Main Heading</span>
              <input
                value={page.heroTitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ heroTitle: e.target.value })}
                placeholder="Main headline shown at the top"
              />
            </label>
            <label className="is-wide">
              <span>Top Summary</span>
              <textarea
                value={page.heroSubtitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ heroSubtitle: e.target.value })}
                placeholder="One or two sentences introducing the event"
              />
            </label>
          </div>

          <div className="saf-visual-settings">
            <div className="saf-simple-editor-title">
              <div>
                <h3>Visual Style</h3>
                <p>Choose the event mood without editing code.</p>
              </div>
            </div>
            <div className="saf-simple-form">
              <label>
                <span>Top Background</span>
                <select
                  value={theme.heroBackgroundType}
                  disabled={!canEdit}
                  onChange={(e) => updateTheme({ heroBackgroundType: e.target.value as PageTheme['heroBackgroundType'] })}
                >
                  <option value="color">Color</option>
                  <option value="image">Image</option>
                </select>
              </label>
              <label>
                <span>Image Overlay</span>
                <select
                  value={theme.heroOverlay}
                  disabled={!canEdit}
                  onChange={(e) => updateTheme({ heroOverlay: e.target.value as PageTheme['heroOverlay'] })}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="none">None</option>
                </select>
              </label>
              <label>
                <span>Theme Color</span>
                <select
                  value={theme.themeColor}
                  disabled={!canEdit}
                  onChange={(e) => updateTheme({ themeColor: e.target.value })}
                >
                  {THEME_COLOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Background Color</span>
                <select
                  value={theme.heroBackgroundColor}
                  disabled={!canEdit}
                  onChange={(e) => updateTheme({ heroBackgroundColor: e.target.value })}
                >
                  {HERO_COLOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <div className="saf-simple-file-field is-wide">
                <span>Background Image</span>
                <CustomFile
                  fileList={heroFiles}
                  onFileListChange={setHeroFiles}
                  isEditable={canEdit}
                  maxCount={1}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="saf-simple-builder">
            <aside className="saf-simple-section-list">
              <h3>Homepage Sections</h3>
              <p>Turn sections on or off, reorder them, then fill in the selected section.</p>
              {page.sections.map((section) => {
                const preset = getPreset(section);
                const isActive = section.sectionSeq === activeSectionSeq;
                const isShown = section.useYn !== 'N';
                return (
                  <article
                    key={section.sectionSeq}
                    className={`saf-simple-section-card${isActive ? ' is-active' : ''}${!isShown ? ' is-muted' : ''}`}
                  >
                    <button
                      type="button"
                      className="saf-simple-section-main"
                      onClick={() => setActiveSectionSeq(section.sectionSeq)}
                    >
                      <strong>{preset.label}</strong>
                      <span>{preset.description}</span>
                    </button>
                    <div className="saf-simple-section-tools">
                      <label className="saf-simple-toggle">
                        <input
                          type="checkbox"
                          checked={isShown}
                          disabled={!canEdit}
                          onChange={(e) => updateSection(section.sectionSeq, {
                            useYn: e.target.checked ? 'Y' : 'N',
                            showInNavYn: e.target.checked ? (section.showInNavYn || 'Y') : section.showInNavYn,
                          })}
                        />
                        <span>Show</span>
                      </label>
                      <button type="button" disabled={!canEdit} onClick={() => moveSection(section.sectionSeq, -1)} title="Move up">
                        <ArrowUpOutlined />
                      </button>
                      <button type="button" disabled={!canEdit} onClick={() => moveSection(section.sectionSeq, 1)} title="Move down">
                        <ArrowDownOutlined />
                      </button>
                    </div>
                  </article>
                );
              })}
            </aside>

            <div className="saf-simple-editor">
              {activeSection && activePreset ? (
                <SectionEditor
                  section={activeSection}
                  preset={activePreset}
                  canEdit={canEdit}
                  onUpdate={(patch) => updateSection(activeSection.sectionSeq, patch)}
                  onAddItem={() => addItem(activeSection, activePreset)}
                  onUpdateBlock={(blockSeq, patch) => updateBlock(activeSection.sectionSeq, blockSeq, patch)}
                  onRemoveBlock={(blockSeq) => removeItem(activeSection.sectionSeq, blockSeq)}
                  onMoveBlock={(blockSeq, direction) => moveBlock(activeSection.sectionSeq, blockSeq, direction)}
                  blockImageFiles={blockImageFiles}
                  onBlockImageFilesChange={(blockSeq, files) => setBlockImageFiles((prev) => ({ ...prev, [blockSeq]: files }))}
                />
              ) : (
                <div className="saf-builder-empty">Select a section to edit.</div>
              )}
            </div>
          </div>
        </>
      )}

      <Modal
        title="Homepage Preview"
        open={previewOpen}
        footer={null}
        width={1120}
        centered
        className="saf-builder-preview-modal"
        onCancel={() => setPreviewOpen(false)}
      >
        {page && (
          <OfficialPagePreview
            page={page}
            theme={theme}
            heroImageUrl={getFilePreviewUrl(heroFiles)}
            blockImageFiles={blockImageFiles}
          />
        )}
      </Modal>
    </section>
  );
};

const BuilderHeader: React.FC<{
  canEdit: boolean;
  canPreview: boolean;
  saving: boolean;
  onSave: () => void;
  onPreview: () => void;
}> = ({ canEdit, canPreview, saving, onSave, onPreview }) => (
  <div className="saf-panel-title-row">
    <div className="saf-panel-title">
      <h2>Official Event Homepage</h2>
      <p>Fill in each homepage section. Technical page settings are handled automatically.</p>
    </div>
    {(canEdit || canPreview) && (
      <div className="saf-builder-header-actions">
        {canPreview && (
          <button type="button" className="saf-action-btn is-secondary" onClick={onPreview} disabled={saving}>
            <EyeOutlined />
            <span>Preview</span>
          </button>
        )}
        {canEdit && (
          <button type="button" className="saf-action-btn is-primary" onClick={onSave} disabled={saving}>
            <SaveOutlined />
            <span>{saving ? 'Saving' : 'Save'}</span>
          </button>
        )}
      </div>
    )}
  </div>
);

const SectionEditor: React.FC<{
  section: EventPageSection;
  preset: SectionPreset;
  canEdit: boolean;
  onUpdate: (patch: Partial<EventPageSection>) => void;
  onAddItem: () => void;
  onUpdateBlock: (blockSeq: number, patch: Partial<EventPageBlock>) => void;
  onRemoveBlock: (blockSeq: number) => void;
  onMoveBlock: (blockSeq: number, direction: -1 | 1) => void;
  blockImageFiles: Record<number, FileDetailType[]>;
  onBlockImageFilesChange: (blockSeq: number, files: FileDetailType[]) => void;
}> = ({
  section,
  preset,
  canEdit,
  onUpdate,
  onAddItem,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  blockImageFiles,
  onBlockImageFilesChange,
}) => {
  const visibleItems = section.blocks ?? [];

  return (
    <>
      <div className="saf-simple-editor-title">
        <div>
          <h3>{preset.label}</h3>
          <p>{preset.description}</p>
        </div>
        <label className="saf-simple-toggle">
          <input
            type="checkbox"
            checked={section.useYn !== 'N'}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ useYn: e.target.checked ? 'Y' : 'N' })}
          />
          <span>Show on homepage</span>
        </label>
      </div>

      <div className="saf-simple-form">
        <label>
          <span>Menu Name</span>
          <input
            value={section.navLabel ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ navLabel: e.target.value })}
            placeholder={preset.label}
          />
        </label>
        <label>
          <span>Section Title</span>
          <input
            value={section.title ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder={preset.defaultTitle}
          />
        </label>
        <label className="is-wide">
          <span>Intro Text</span>
          <textarea
            value={section.subtitle ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="Short text shown below the section title"
          />
        </label>
        {(preset.sectionType === 'about' || preset.sectionType === 'venue') && (
          <label className="is-wide">
            <span>Main Content</span>
            <textarea
              value={section.body ?? ''}
              disabled={!canEdit}
              onChange={(e) => onUpdate({ body: e.target.value })}
              placeholder="Write the content for this section"
            />
          </label>
        )}
      </div>

      {preset.blockType && (
        <div className="saf-simple-items">
          <div className="saf-simple-items-head">
            <div>
              <h4>{preset.addLabel?.replace('Add ', '') ?? 'Items'}</h4>
              <p>Add and edit the rows shown in this section.</p>
            </div>
            {canEdit && (
              <button type="button" className="saf-action-btn is-secondary" onClick={onAddItem}>
                <PlusOutlined />
                <span>{preset.addLabel}</span>
              </button>
            )}
          </div>
          {visibleItems.map((block) => (
            <SectionItemEditor
              key={block.blockSeq}
              preset={preset}
              block={block}
              canEdit={canEdit}
              onUpdate={(patch) => onUpdateBlock(block.blockSeq, patch)}
              onRemove={() => onRemoveBlock(block.blockSeq)}
              onMove={(direction) => onMoveBlock(block.blockSeq, direction)}
              imageFiles={blockImageFiles[block.blockSeq] ?? []}
              onImageFilesChange={(files) => onBlockImageFilesChange(block.blockSeq, files)}
            />
          ))}
          {!visibleItems.length && (
            <div className="saf-builder-empty is-small">No items yet.</div>
          )}
        </div>
      )}
    </>
  );
};

const SectionItemEditor: React.FC<{
  preset: SectionPreset;
  block: EventPageBlock;
  canEdit: boolean;
  onUpdate: (patch: Partial<EventPageBlock>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  imageFiles: FileDetailType[];
  onImageFilesChange: (files: FileDetailType[]) => void;
}> = ({ preset, block, canEdit, onUpdate, onRemove, onMove, imageFiles, onImageFilesChange }) => (
  <article className="saf-simple-item">
    <div className="saf-simple-item-head">
      <strong>{getItemHeading(preset, block)}</strong>
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
    {renderItemFields(preset, block, canEdit, onUpdate, imageFiles, onImageFilesChange)}
  </article>
);

function renderItemFields(
  preset: SectionPreset,
  block: EventPageBlock,
  canEdit: boolean,
  onUpdate: (patch: Partial<EventPageBlock>) => void,
  imageFiles: FileDetailType[],
  onImageFilesChange: (files: FileDetailType[]) => void,
) {
  if (preset.sectionType === 'program') {
    return (
      <div className="saf-simple-form is-compact">
        <label>
          <span>Start</span>
          <input type="datetime-local" value={toDatetimeInput(block.startAt)} disabled={!canEdit} onChange={(e) => onUpdate({ startAt: e.target.value || null })} />
        </label>
        <label>
          <span>End</span>
          <input type="datetime-local" value={toDatetimeInput(block.endAt)} disabled={!canEdit} onChange={(e) => onUpdate({ endAt: e.target.value || null })} />
        </label>
        <label>
          <span>Session Title</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>Room</span>
          <input value={block.venueName ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ venueName: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Speakers</span>
          <input value={block.speakerNames ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ speakerNames: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Description</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
      </div>
    );
  }

  if (preset.sectionType === 'speakers') {
    return (
      <div className="saf-simple-form is-compact">
        <div className="saf-simple-file-field is-wide">
          <span>Photo</span>
          <CustomFile
            fileList={imageFiles}
            onFileListChange={onImageFilesChange}
            isEditable={canEdit}
            maxCount={1}
            accept="image/*"
          />
        </div>
        <label>
          <span>Name</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>Role / Title</span>
          <input value={block.subtitle ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ subtitle: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Organization</span>
          <input value={block.organizationName ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ organizationName: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Bio</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
      </div>
    );
  }

  if (preset.sectionType === 'supporting_organizations') {
    return (
      <div className="saf-simple-form is-compact">
        <div className="saf-simple-file-field is-wide">
          <span>Logo</span>
          <CustomFile
            fileList={imageFiles}
            onFileListChange={onImageFilesChange}
            isEditable={canEdit}
            maxCount={1}
            accept="image/*"
          />
        </div>
        <label className="is-wide">
          <span>Organization Name</span>
          <input value={block.organizationName ?? block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ organizationName: e.target.value, title: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Website Link</span>
          <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
        </label>
      </div>
    );
  }

  if (preset.sectionType === 'notice') {
    return (
      <div className="saf-simple-form is-compact">
        <label>
          <span>Notice Title</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>Link</span>
          <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Short Summary</span>
          <textarea value={block.summary ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ summary: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>Details</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
      </div>
    );
  }

  return (
    <div className="saf-simple-form is-compact">
      <label>
        <span>Title</span>
        <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
      </label>
      <label>
        <span>Link</span>
        <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
      </label>
      <label className="is-wide">
        <span>Summary</span>
        <textarea value={block.summary ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ summary: e.target.value })} />
      </label>
      <label className="is-wide">
        <span>Details</span>
        <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
      </label>
    </div>
  );
}

const OfficialPagePreview: React.FC<{
  page: PublicEventPage;
  theme: PageTheme;
  heroImageUrl?: string;
  blockImageFiles: Record<number, FileDetailType[]>;
}> = ({ page, theme, heroImageUrl, blockImageFiles }) => {
  const sections = (page.sections ?? []).filter((section) => section.useYn !== 'N');
  const navSections = sections.filter((section) => section.showInNavYn !== 'N' && (section.navLabel || section.title));
  const accentColor = getThemeColor(theme.themeColor);
  const heroStyle = buildHeroStyle(theme, heroImageUrl);

  return (
    <div className="saf-builder-preview" style={{ '--preview-accent': accentColor } as React.CSSProperties}>
      <section className="saf-builder-preview-hero" style={heroStyle}>
        <span style={{ color: accentColor }}>KCAB International</span>
        <h1>{page.heroTitle || page.pageTitle || page.eventTitle || 'Official Event'}</h1>
        {(page.heroSubtitle || page.pageSubtitle || page.location) && (
          <p>{page.heroSubtitle || page.pageSubtitle || page.location}</p>
        )}
        <div className="saf-builder-preview-meta">
          {formatPreviewDate(page.eventStartDt) && <strong>{formatPreviewDate(page.eventStartDt)}</strong>}
          {page.location && <strong>{page.location}</strong>}
        </div>
      </section>

      {navSections.length > 0 && (
        <nav className="saf-builder-preview-nav">
          {navSections.map((section) => (
            <a key={section.sectionSeq} href={`#preview-${section.sectionSeq}`}>
              {section.navLabel || section.title}
            </a>
          ))}
        </nav>
      )}

      <div className="saf-builder-preview-body">
        {sections.map((section) => (
          <PreviewSection key={section.sectionSeq} section={section} blockImageFiles={blockImageFiles} />
        ))}
        {!sections.length && (
          <div className="saf-builder-empty is-small">No active sections to preview.</div>
        )}
      </div>
    </div>
  );
};

const PreviewSection: React.FC<{
  section: EventPageSection;
  blockImageFiles: Record<number, FileDetailType[]>;
}> = ({ section, blockImageFiles }) => {
  const blocks = (section.blocks ?? []).filter((block) => block.useYn !== 'N');

  if (section.sectionType === 'program') {
    return (
      <section id={`preview-${section.sectionSeq}`} className="saf-builder-preview-section">
        <PreviewSectionTitle section={section} />
        <div className="saf-builder-preview-program">
          {blocks.map((block) => <PreviewProgramSession key={block.blockSeq} block={block} />)}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'speakers') {
    return (
      <section id={`preview-${section.sectionSeq}`} className="saf-builder-preview-section">
        <PreviewSectionTitle section={section} />
        <div className="saf-builder-preview-speakers">
          {blocks.map((block) => (
            <article key={block.blockSeq}>
              {getFilePreviewUrl(blockImageFiles[block.blockSeq]) ? (
                <img
                  className="saf-builder-preview-speaker-photo"
                  src={getFilePreviewUrl(blockImageFiles[block.blockSeq])}
                  alt={block.title || 'Speaker'}
                />
              ) : (
                <div className="saf-builder-preview-avatar">{(block.title || 'S').slice(0, 1)}</div>
              )}
              <h4>{block.title || 'Speaker'}</h4>
              {block.subtitle && <p>{block.subtitle}</p>}
              {block.organizationName && <span>{block.organizationName}</span>}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'supporting_organizations') {
    return (
      <section id={`preview-${section.sectionSeq}`} className="saf-builder-preview-section">
        <PreviewSectionTitle section={section} />
        <div className="saf-builder-preview-logo-grid">
          {blocks.map((block) => (
            <article key={block.blockSeq}>
              {getFilePreviewUrl(blockImageFiles[block.blockSeq]) ? (
                <img src={getFilePreviewUrl(blockImageFiles[block.blockSeq])} alt={block.organizationName || block.title || 'Organization'} />
              ) : (
                block.organizationName || block.title || 'Organization'
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={`preview-${section.sectionSeq}`} className="saf-builder-preview-section">
      <PreviewSectionTitle section={section} />
      {section.body && <div className="saf-builder-preview-copy">{section.body}</div>}
      {blocks.length > 0 && (
        <div className="saf-builder-preview-card-grid">
          {blocks.map((block) => (
            <PreviewCard key={block.blockSeq} block={block} imageUrl={getFilePreviewUrl(blockImageFiles[block.blockSeq])} />
          ))}
        </div>
      )}
    </section>
  );
};

const PreviewSectionTitle: React.FC<{ section: EventPageSection }> = ({ section }) => (
  <header className="saf-builder-preview-section-title">
    {section.eyebrow && <span>{section.eyebrow}</span>}
    {section.title && <h2>{section.title}</h2>}
    {section.subtitle && <p>{section.subtitle}</p>}
  </header>
);

const PreviewCard: React.FC<{ block: EventPageBlock; imageUrl?: string }> = ({ block, imageUrl }) => (
  <article className="saf-builder-preview-card">
    {imageUrl && <img src={imageUrl} alt={block.title || block.organizationName || 'Event item'} />}
    {block.badgeText && <span>{block.badgeText}</span>}
    <h4>{block.title || block.organizationName || block.buttonLabel || block.blockType}</h4>
    {block.subtitle && <p className="saf-builder-preview-card-subtitle">{block.subtitle}</p>}
    {block.summary && <p>{block.summary}</p>}
    {block.body && <div className="saf-builder-preview-copy">{block.body}</div>}
    {block.buttonLabel && <em>{block.buttonLabel}</em>}
  </article>
);

const PreviewProgramSession: React.FC<{ block: EventPageBlock }> = ({ block }) => (
  <article className="saf-builder-preview-session">
    <time>{formatPreviewRange(block.startAt, block.endAt) || 'TBD'}</time>
    <div>
      <h4>{block.title || 'Session'}</h4>
      {block.speakerNames && <p>{block.speakerNames}</p>}
      {block.venueName && <span>{block.venueName}</span>}
      {block.body && <div className="saf-builder-preview-copy">{block.body}</div>}
    </div>
  </article>
);

async function loadPageImageFiles(page: PublicEventPage) {
  const heroFiles = page.heroFileSeq ? await loadFiles(page.heroFileSeq) : [];
  const blockImageEntries = await Promise.all(
    page.sections
      .flatMap((section) => section.blocks ?? [])
      .filter((block) => block.imageFileSeq)
      .map(async (block) => [block.blockSeq, await loadFiles(block.imageFileSeq ?? null)] as const),
  );
  const blockImageFiles = blockImageEntries.reduce<Record<number, FileDetailType[]>>((acc, [blockSeq, files]) => {
    acc[blockSeq] = files;
    return acc;
  }, {});
  return { heroFiles, blockImageFiles };
}

async function loadFiles(fileSeq?: number | null) {
  if (!fileSeq) return [];
  try {
    const res = await callGetFileList(fileSeq);
    return res?.item ?? [];
  } catch {
    return [];
  }
}

async function resolveImageFileSeqs(
  page: PublicEventPage,
  heroFiles: FileDetailType[],
  blockImageFiles: Record<number, FileDetailType[]>,
) {
  const heroFileSeq = await resolveFileSeq(page.heroFileSeq ?? null, heroFiles);
  const sections: EventPageSection[] = [];

  for (const section of page.sections) {
    const blocks: EventPageBlock[] = [];
    for (const block of section.blocks ?? []) {
      const files = blockImageFiles[block.blockSeq];
      const imageFileSeq = files === undefined
        ? (block.imageFileSeq ?? null)
        : await resolveFileSeq(block.imageFileSeq ?? null, files);
      blocks.push({ ...block, imageFileSeq });
    }
    sections.push({ ...section, blocks });
  }

  return {
    page: {
      ...page,
      heroFileSeq,
      sections,
    },
  };
}

async function resolveFileSeq(currentFileSeq: number | null, files: FileDetailType[]) {
  const visibleFiles = getVisibleFiles(files);
  if (files.some((file) => !!file.iudType)) {
    const res = await callSaveFiles(currentFileSeq, 0, files);
    const nextFileSeq = Number(res?.item?.fileSeq || currentFileSeq || 0) || null;
    return visibleFiles.length ? nextFileSeq : null;
  }
  return visibleFiles.length ? currentFileSeq : null;
}

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
    heroSubtitle: page?.heroSubtitle || page?.eventSummary || '',
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
      blocks: simplifyBlocks(section),
    })),
  };
}

function ensureSimpleSections(
  page: PublicEventPage,
  catalog: EventPageComponentCatalog,
  nextTempSeq: () => number,
): PublicEventPage {
  const existingByType = new Map(page.sections.map((section) => [section.sectionType, section]));
  const presetSections = SECTION_PRESETS.map((preset, index) => {
    const existing = existingByType.get(preset.sectionType);
    if (existing) {
      return {
        ...existing,
        componentTemplateSeq: existing.componentTemplateSeq ?? findTemplateSeq(catalog, 'section', preset.sectionType),
        sectionKey: existing.sectionKey || preset.sectionType,
        anchorId: existing.anchorId || preset.sectionType,
        navLabel: existing.navLabel || preset.label,
        title: existing.title || preset.defaultTitle,
        useYn: existing.useYn || 'Y',
        showInNavYn: existing.showInNavYn || 'Y',
        sortSeq: index + 1,
        blocks: simplifyBlocks(existing),
      };
    }
    return createSection(page, preset, catalog, nextTempSeq(), index + 1);
  });

  const knownTypes = new Set(SECTION_PRESETS.map((preset) => preset.sectionType));
  const customSections = page.sections
    .filter((section) => !knownTypes.has(section.sectionType))
    .map((section, index) => ({
      ...section,
      sortSeq: presetSections.length + index + 1,
      blocks: simplifyBlocks(section),
    }));

  return {
    ...page,
    sections: resequenceSections([...presetSections, ...customSections]),
  };
}

function createSection(
  page: PublicEventPage,
  preset: SectionPreset,
  catalog: EventPageComponentCatalog,
  sectionSeq: number,
  sortSeq: number,
): EventPageSection {
  return {
    sectionSeq,
    eventPageSeq: page.eventPageSeq ?? 0,
    componentTemplateSeq: findTemplateSeq(catalog, 'section', preset.sectionType),
    sectionKey: preset.sectionType,
    sectionType: preset.sectionType,
    title: preset.defaultTitle,
    subtitle: preset.defaultSubtitle || '',
    body: preset.sectionType === 'about' ? (page.eventSummary || '') : (preset.sectionType === 'venue' ? (page.location || '') : ''),
    anchorId: preset.sectionType,
    navLabel: preset.label,
    showInNavYn: 'Y',
    layoutType: 'standard',
    columnCount: preset.sectionType === 'speakers' ? 4 : 1,
    sortSeq,
    useYn: 'Y',
    settingsJson: '{}',
    blocks: [],
  };
}

function createBlock(
  section: EventPageSection,
  preset: SectionPreset,
  catalog: EventPageComponentCatalog,
  blockSeq: number,
): EventPageBlock {
  const blockType = preset.blockType || 'card';
  const sortSeq = (section.blocks?.length ?? 0) + 1;
  return {
    blockSeq,
    sectionSeq: section.sectionSeq,
    componentTemplateSeq: findTemplateSeq(catalog, 'block', blockType),
    blockKey: `${blockType}-${sortSeq}`,
    blockType,
    title: getNewItemTitle(preset, sortSeq),
    subtitle: '',
    summary: '',
    body: '',
    linkTarget: '_self',
    featuredYn: 'N',
    sortSeq,
    useYn: 'Y',
    styleJson: '{}',
    contentJson: '{}',
  };
}

function simplifyBlocks(section: EventPageSection) {
  if (section.sectionType === 'program') {
    return (section.blocks ?? [])
      .filter((block) => block.blockType !== 'agenda_day')
      .map((block) => ({
        ...block,
        parentBlockSeq: null,
        blockType: 'agenda_session',
      }));
  }
  return section.blocks ?? [];
}

function prepareSectionsForSave(sections: EventPageSection[]) {
  return resequenceSections(sections).map((section) => ({
    ...section,
    sectionKey: section.sectionKey || section.sectionType,
    anchorId: section.anchorId || section.sectionKey || section.sectionType,
    navLabel: section.navLabel || getPreset(section).label,
    showInNavYn: section.useYn === 'N' ? 'N' : (section.showInNavYn || 'Y'),
    layoutType: section.layoutType || 'standard',
    useYn: section.useYn || 'Y',
    settingsJson: section.settingsJson || '{}',
    blocks: resequenceBlocks(section.blocks ?? []).map((block) => ({
      ...block,
      sectionSeq: section.sectionSeq,
      parentBlockSeq: null,
      blockKey: block.blockKey || `${block.blockType || 'item'}-${block.sortSeq || 1}`,
      blockType: block.blockType || getPreset(section).blockType || 'card',
      linkTarget: block.linkTarget || '_self',
      featuredYn: block.featuredYn || 'N',
      useYn: block.useYn || 'Y',
      styleJson: block.styleJson || '{}',
      contentJson: block.contentJson || '{}',
    })),
  }));
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

function getPreset(section?: EventPageSection | null): SectionPreset {
  if (!section) return SECTION_PRESETS[0];
  return SECTION_PRESETS.find((preset) => preset.sectionType === section.sectionType) ?? {
    sectionType: section.sectionType || 'custom',
    label: section.title || 'Additional Section',
    description: 'Optional custom content',
    defaultTitle: section.title || 'Additional Section',
    blockType: 'card',
    addLabel: 'Add Item',
  };
}

function findTemplateSeq(catalog: EventPageComponentCatalog, scope: 'section' | 'block', componentType: string) {
  return catalog.templates.find((template) => (
    template.componentScope === scope && template.componentType === componentType
  ))?.componentTemplateSeq ?? null;
}

function getNewItemTitle(preset: SectionPreset, index: number) {
  if (preset.sectionType === 'program') return `Session ${index}`;
  if (preset.sectionType === 'speakers') return `Speaker ${index}`;
  if (preset.sectionType === 'supporting_organizations') return `Organization ${index}`;
  if (preset.sectionType === 'notice') return `Notice ${index}`;
  return `Item ${index}`;
}

function getItemHeading(preset: SectionPreset, block: EventPageBlock) {
  if (preset.sectionType === 'supporting_organizations') {
    return block.organizationName || block.title || 'Organization';
  }
  return block.title || getNewItemTitle(preset, block.sortSeq || 1);
}

function parseTheme(themeJson?: string | null): PageTheme {
  if (!themeJson) return DEFAULT_THEME;
  try {
    return {
      ...DEFAULT_THEME,
      ...JSON.parse(themeJson),
    };
  } catch {
    return DEFAULT_THEME;
  }
}

function getThemeColor(themeColor: string) {
  return THEME_COLOR_OPTIONS.find((option) => option.value === themeColor)?.color ?? THEME_COLOR_OPTIONS[0].color;
}

function buildHeroStyle(theme: PageTheme, heroImageUrl?: string): React.CSSProperties {
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

function getVisibleFiles(files?: FileDetailType[]) {
  return (files ?? []).filter((file) => file.iudType !== 'D');
}

function getFilePreviewUrl(files?: FileDetailType[]) {
  const file = getVisibleFiles(files)[0];
  return file?.fileUrl || file?.filePath || '';
}

function toDatetimeInput(value?: string | null) {
  if (!value) return '';
  return value.replace(' ', 'T').slice(0, 16);
}

function formatPreviewDate(value?: string | null) {
  if (!value) return '';
  return value.replace('T', ' ').slice(0, 16);
}

function formatPreviewRange(start?: string | null, end?: string | null) {
  const startText = formatPreviewDate(start);
  const endText = formatPreviewDate(end);
  if (startText && endText) return `${startText} - ${endText}`;
  return startText || endText;
}

export default OfficialEventPageBuilder;
