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

interface PageSettings {
  registrationStatusLabel?: string;
  contactEmail?: string;
  contactPhone?: string;
  organizerName?: string;
  infoNote?: string;
  [key: string]: unknown;
}

interface SectionSettings {
  backgroundStyle?: 'white' | 'soft' | 'navy' | 'gold';
  width?: 'normal' | 'wide';
  spacing?: 'compact' | 'normal' | 'spacious';
  [key: string]: unknown;
}

const EMPTY_CATALOG: EventPageComponentCatalog = { categories: [], templates: [] };
const DEFAULT_THEME: PageTheme = {
  heroBackgroundType: 'color',
  heroOverlay: 'dark',
  themeColor: 'navy',
  heroBackgroundColor: '#102033',
};

const THEME_COLOR_OPTIONS = [
  { value: 'navy', label: '남색', color: '#102033' },
  { value: 'blue', label: '파란색', color: '#1f5b95' },
  { value: 'gold', label: '골드', color: '#b88900' },
  { value: 'gray', label: '회색', color: '#475569' },
];

const HERO_COLOR_OPTIONS = [
  { value: '#102033', label: '짙은 남색' },
  { value: '#1f5b95', label: '회의 파란색' },
  { value: '#263238', label: '차분한 검정' },
  { value: '#f4f6f9', label: '밝은 회색' },
];

const SECTION_BACKGROUND_OPTIONS = [
  { value: 'white', label: '흰색' },
  { value: 'soft', label: '연한 회색' },
  { value: 'navy', label: '짙은 남색' },
  { value: 'gold', label: '골드 포인트' },
] as const;

const SECTION_WIDTH_OPTIONS = [
  { value: 'normal', label: '기본' },
  { value: 'wide', label: '넓게' },
] as const;

const SECTION_SPACING_OPTIONS = [
  { value: 'compact', label: '좁게' },
  { value: 'normal', label: '보통' },
  { value: 'spacious', label: '넓게' },
] as const;

const PROGRAM_TRACK_OPTIONS = [
  'Main Schedule',
  'Open Session',
  'Institutions Session',
  'Break',
  'Reception',
] as const;

const PROGRAM_SESSION_TYPE_OPTIONS = [
  { value: 'session', label: '일반 세션' },
  { value: 'opening', label: '개회/환영사' },
  { value: 'keynote', label: '키노트' },
  { value: 'panel', label: '패널 토론' },
  { value: 'break', label: '휴식/점심' },
  { value: 'networking', label: '네트워킹' },
] as const;

const ORGANIZATION_GROUP_OPTIONS = [
  { value: 'Organizers', label: '주최기관' },
  { value: 'Supporting Organizations', label: '지원기관' },
  { value: 'Supporters', label: '후원기관' },
  { value: 'Sponsors', label: '스폰서' },
  { value: 'Media Partners', label: '미디어 파트너' },
  { value: 'Partners', label: '파트너' },
] as const;

const REGISTRATION_STATUS_OPTIONS = [
  'Registration Open',
  'Registration is now closed',
  'Coming Soon',
  'Waitlist Open',
  'Invite Only',
] as const;

const SECTION_PRESETS: SectionPreset[] = [
  {
    sectionType: 'about',
    label: '행사 소개',
    description: '행사의 목적과 주요 안내 문구',
    defaultTitle: 'About',
  },
  {
    sectionType: 'program',
    label: '프로그램',
    description: '시간표와 세션 정보',
    defaultTitle: 'Program',
    blockType: 'agenda_session',
    addLabel: '세션 추가',
  },
  {
    sectionType: 'speakers',
    label: '연사',
    description: '연사 사진, 직책, 소속 정보',
    defaultTitle: 'Speakers',
    blockType: 'speaker_card',
    addLabel: '연사 추가',
  },
  {
    sectionType: 'supporting_organizations',
    label: '주최/후원기관',
    description: '주최기관과 후원기관 로고',
    defaultTitle: 'Supporting Organizations',
    blockType: 'organization_logo',
    addLabel: '기관 추가',
  },
  {
    sectionType: 'venue',
    label: '장소',
    description: '행사장, 회의실, 오시는 길',
    defaultTitle: 'Venue',
    blockType: 'card',
    addLabel: '장소 안내 추가',
  },
  {
    sectionType: 'visit_seoul',
    label: '서울 방문',
    description: '파트너 호텔과 방문 안내',
    defaultTitle: 'Visit Seoul',
    blockType: 'card',
    addLabel: '호텔 추가',
  },
  {
    sectionType: 'notice',
    label: '공지',
    description: '참가자에게 필요한 안내 사항',
    defaultTitle: 'Notice',
    blockType: 'notice_item',
    addLabel: '공지 추가',
  },
  {
    sectionType: 'contact',
    label: '문의',
    description: '담당 부서, 이메일, 연락처',
    defaultTitle: 'Contact',
    blockType: 'card',
    addLabel: '문의처 추가',
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
  const pageSettings = useMemo(() => parsePageSettings(page?.settingsJson), [page?.settingsJson]);

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

  const updatePageSettings = (patch: Partial<PageSettings>) => {
    const nextSettings = { ...pageSettings, ...patch };
    updatePage({ settingsJson: JSON.stringify(nextSettings) });
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
      message.success('행사 페이지가 저장되었습니다.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? '행사 페이지 저장에 실패했습니다.');
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
        <div className="saf-builder-empty">먼저 행사를 저장한 뒤 페이지 내용을 입력해주세요.</div>
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
        <div className="saf-builder-empty">행사 페이지를 불러오는 중입니다...</div>
      ) : (
        <>
          <div className="saf-simple-basics">
            <label>
              <span>공개 상태</span>
              <select
                value={page.pageStatus || 'draft'}
                disabled={!canEdit}
                onChange={(e) => updatePage({ pageStatus: e.target.value })}
              >
                <option value="draft">임시저장</option>
                <option value="published">공개</option>
              </select>
            </label>
            <label>
              <span>페이지 제목</span>
              <input
                value={page.pageTitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ pageTitle: e.target.value })}
                placeholder="행사 페이지 제목"
              />
            </label>
            <label>
              <span>상단 큰 제목</span>
              <input
                value={page.heroTitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ heroTitle: e.target.value })}
                placeholder="상단에 크게 보이는 제목"
              />
            </label>
            <label className="is-wide">
              <span>상단 소개 문구</span>
              <textarea
                value={page.heroSubtitle ?? ''}
                disabled={!canEdit}
                onChange={(e) => updatePage({ heroSubtitle: e.target.value })}
                placeholder="행사를 소개하는 짧은 문구"
              />
            </label>
          </div>

          <div className="saf-visual-settings">
            <div className="saf-simple-editor-title">
              <div>
                <h3>행사 정보 카드</h3>
                <p>공개 화면 상단에 날짜, 장소, 등록 상태, 문의처가 함께 표시됩니다.</p>
              </div>
            </div>
            <div className="saf-simple-form">
              <label>
                <span>등록 상태</span>
                <select
                  value={pageSettings.registrationStatusLabel || ''}
                  disabled={!canEdit}
                  onChange={(e) => updatePageSettings({ registrationStatusLabel: e.target.value })}
                >
                  <option value="">자동/미표시</option>
                  {REGISTRATION_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>주최/담당 기관</span>
                <input
                  value={pageSettings.organizerName || ''}
                  disabled={!canEdit}
                  onChange={(e) => updatePageSettings({ organizerName: e.target.value })}
                  placeholder="KCAB International"
                />
              </label>
              <label>
                <span>문의 이메일</span>
                <input
                  value={pageSettings.contactEmail || ''}
                  disabled={!canEdit}
                  onChange={(e) => updatePageSettings({ contactEmail: e.target.value })}
                  placeholder="event@kcab.or.kr"
                />
              </label>
              <label>
                <span>문의 전화</span>
                <input
                  value={pageSettings.contactPhone || ''}
                  disabled={!canEdit}
                  onChange={(e) => updatePageSettings({ contactPhone: e.target.value })}
                  placeholder="+82-2-0000-0000"
                />
              </label>
              <label className="is-wide">
                <span>상단 안내 메모</span>
                <textarea
                  value={pageSettings.infoNote || ''}
                  disabled={!canEdit}
                  onChange={(e) => updatePageSettings({ infoNote: e.target.value })}
                  placeholder="예: Registration closes when seats are full."
                />
              </label>
            </div>
          </div>

          <div className="saf-visual-settings">
            <div className="saf-simple-editor-title">
              <div>
                <h3>상단 화면 꾸미기</h3>
                <p>대표 이미지와 색상을 선택하면 화면에 자동으로 반영됩니다.</p>
              </div>
            </div>
            <div className="saf-simple-form">
              <label>
                <span>상단 배경</span>
                <select
                  value={theme.heroBackgroundType}
                  disabled={!canEdit}
                  onChange={(e) => updateTheme({ heroBackgroundType: e.target.value as PageTheme['heroBackgroundType'] })}
                >
                  <option value="color">색상</option>
                  <option value="image">이미지</option>
                </select>
              </label>
              <label>
                <span>이미지 밝기</span>
                <select
                  value={theme.heroOverlay}
                  disabled={!canEdit}
                  onChange={(e) => updateTheme({ heroOverlay: e.target.value as PageTheme['heroOverlay'] })}
                >
                  <option value="dark">어둡게</option>
                  <option value="light">밝게</option>
                  <option value="none">그대로</option>
                </select>
              </label>
              <label>
                <span>포인트 색상</span>
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
                <span>배경 색상</span>
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
                <span>대표 이미지</span>
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
              <h3>화면 구성</h3>
              <p>필요한 항목만 켜고, 내용을 입력하면 화면은 자동으로 정리됩니다.</p>
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
                        <span>사용</span>
                      </label>
                      <button type="button" disabled={!canEdit} onClick={() => moveSection(section.sectionSeq, -1)} title="위로 이동">
                        <ArrowUpOutlined />
                      </button>
                      <button type="button" disabled={!canEdit} onClick={() => moveSection(section.sectionSeq, 1)} title="아래로 이동">
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
                <div className="saf-builder-empty">수정할 항목을 선택해주세요.</div>
              )}
            </div>
          </div>
        </>
      )}

      <Modal
        title="미리보기"
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
      <h2>공식 행사 페이지 만들기</h2>
      <p>행사 정보를 입력하면 공식 행사 안내 화면으로 자동 구성됩니다.</p>
    </div>
    {(canEdit || canPreview) && (
      <div className="saf-builder-header-actions">
        {canPreview && (
          <button type="button" className="saf-action-btn is-secondary" onClick={onPreview} disabled={saving}>
            <EyeOutlined />
            <span>미리보기</span>
          </button>
        )}
        {canEdit && (
          <button type="button" className="saf-action-btn is-primary" onClick={onSave} disabled={saving}>
            <SaveOutlined />
            <span>{saving ? '저장 중' : '저장'}</span>
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
  const sectionSettings = parseSectionSettings(section.settingsJson);
  const updateSectionSettings = (patch: Partial<SectionSettings>) => {
    onUpdate({ settingsJson: JSON.stringify({ ...sectionSettings, ...patch }) });
  };

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
          <span>화면에 보이기</span>
        </label>
      </div>

      <div className="saf-simple-form">
        <label>
          <span>메뉴 이름</span>
          <input
            value={section.navLabel ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ navLabel: e.target.value })}
            placeholder={preset.label}
          />
        </label>
        <label>
          <span>화면 제목</span>
          <input
            value={section.title ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder={preset.defaultTitle}
          />
        </label>
        <label>
          <span>배경</span>
          <select
            value={sectionSettings.backgroundStyle || 'white'}
            disabled={!canEdit}
            onChange={(e) => updateSectionSettings({ backgroundStyle: e.target.value as SectionSettings['backgroundStyle'] })}
          >
            {SECTION_BACKGROUND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>가로폭</span>
          <select
            value={sectionSettings.width || 'normal'}
            disabled={!canEdit}
            onChange={(e) => updateSectionSettings({ width: e.target.value as SectionSettings['width'] })}
          >
            {SECTION_WIDTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>여백</span>
          <select
            value={sectionSettings.spacing || 'normal'}
            disabled={!canEdit}
            onChange={(e) => updateSectionSettings({ spacing: e.target.value as SectionSettings['spacing'] })}
          >
            {SECTION_SPACING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="is-wide">
          <span>소개 문구</span>
          <textarea
            value={section.subtitle ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="제목 아래에 보이는 짧은 문구"
          />
        </label>
        {(preset.sectionType === 'about' || preset.sectionType === 'venue' || preset.sectionType === 'contact') && (
          <label className="is-wide">
            <span>상세 설명</span>
            <textarea
              value={section.body ?? ''}
              disabled={!canEdit}
              onChange={(e) => onUpdate({ body: e.target.value })}
              placeholder="이 항목에 들어갈 내용을 입력해주세요"
            />
          </label>
        )}
      </div>

      {preset.blockType && (
        <div className="saf-simple-items">
          <div className="saf-simple-items-head">
            <div>
              <h4>{preset.addLabel?.replace('Add ', '') ?? 'Items'}</h4>
              <p>아래 정보를 입력하면 공개 화면에 자동으로 정리되어 보입니다.</p>
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
            <div className="saf-builder-empty is-small">아직 입력된 내용이 없습니다.</div>
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
        <button type="button" disabled={!canEdit} onClick={() => onMove(-1)} title="위로 이동">
          <ArrowUpOutlined />
        </button>
        <button type="button" disabled={!canEdit} onClick={() => onMove(1)} title="아래로 이동">
          <ArrowDownOutlined />
        </button>
        <button type="button" disabled={!canEdit} onClick={onRemove} title="삭제">
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
    const programContent = parseBlockContent(block.contentJson);
    const currentTrack = getProgramTrack(block);
    const sessionType = typeof programContent.sessionType === 'string' ? programContent.sessionType : 'session';
    const moderator = typeof programContent.moderator === 'string' ? programContent.moderator : '';
    const dayLabel = typeof programContent.dayLabel === 'string' ? programContent.dayLabel : '';
    const updateProgramTrack = (track: string) => {
      onUpdate({
        subtitle: track,
        contentJson: JSON.stringify({ ...programContent, track }),
      });
    };
    const updateProgramContent = (patch: Record<string, unknown>) => {
      onUpdate({ contentJson: JSON.stringify({ ...programContent, ...patch }) });
    };

    return (
      <div className="saf-simple-form is-compact">
        <label>
          <span>세션 형태</span>
          <select
            value={sessionType}
            disabled={!canEdit}
            onChange={(e) => updateProgramContent({ sessionType: e.target.value })}
          >
            {PROGRAM_SESSION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>프로그램 구분</span>
          <select
            value={currentTrack}
            disabled={!canEdit}
            onChange={(e) => updateProgramTrack(e.target.value)}
          >
            {!PROGRAM_TRACK_OPTIONS.some((track) => track === currentTrack) && (
              <option value={currentTrack}>{currentTrack}</option>
            )}
            {PROGRAM_TRACK_OPTIONS.map((track) => (
              <option key={track} value={track}>{track}</option>
            ))}
          </select>
        </label>
        <label>
          <span>날짜/일차 표시</span>
          <input
            value={dayLabel}
            disabled={!canEdit}
            onChange={(e) => updateProgramContent({ dayLabel: e.target.value })}
            placeholder="Day 1 또는 2025.10.28"
          />
        </label>
        <label>
          <span>시작 시간</span>
          <input type="datetime-local" value={toDatetimeInput(block.startAt)} disabled={!canEdit} onChange={(e) => onUpdate({ startAt: e.target.value || null })} />
        </label>
        <label>
          <span>종료 시간</span>
          <input type="datetime-local" value={toDatetimeInput(block.endAt)} disabled={!canEdit} onChange={(e) => onUpdate({ endAt: e.target.value || null })} />
        </label>
        <label>
          <span>세션 제목</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>장소</span>
          <input value={block.venueName ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ venueName: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>상세 링크(선택)</span>
          <input
            value={block.linkUrl ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ linkUrl: e.target.value, linkTarget: '_blank' })}
          />
        </label>
        <label className="is-wide">
          <span>발표자</span>
          <input value={block.speakerNames ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ speakerNames: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>좌장/모더레이터</span>
          <input value={moderator} disabled={!canEdit} onChange={(e) => updateProgramContent({ moderator: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>설명</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
      </div>
    );
  }

  if (preset.sectionType === 'speakers') {
    const speakerContent = parseBlockContent(block.contentJson);
    const speakerImageUrl = typeof speakerContent.imageUrl === 'string' ? speakerContent.imageUrl : '';
    const linkedInUrl = typeof speakerContent.linkedInUrl === 'string' ? speakerContent.linkedInUrl : '';
    const updateSpeakerContent = (patch: Record<string, unknown>) => {
      onUpdate({ contentJson: JSON.stringify({ ...speakerContent, ...patch }) });
    };

    return (
      <div className="saf-simple-form is-compact">
        <div className="saf-simple-file-field is-wide">
          <span>사진</span>
          <CustomFile
            fileList={imageFiles}
            onFileListChange={onImageFilesChange}
            isEditable={canEdit}
            maxCount={1}
            accept="image/*"
          />
        </div>
        <label className="is-wide">
          <span>사진 이미지 주소(선택)</span>
          <input value={speakerImageUrl} disabled={!canEdit} onChange={(e) => updateSpeakerContent({ imageUrl: e.target.value })} />
        </label>
        <label>
          <span>이름</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>직책</span>
          <input value={block.subtitle ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ subtitle: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>소속</span>
          <input value={block.organizationName ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ organizationName: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>프로필/상세 링크(선택)</span>
          <input
            value={block.linkUrl ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ linkUrl: e.target.value, linkTarget: '_blank' })}
          />
        </label>
        <label className="is-wide">
          <span>LinkedIn / SNS 링크(선택)</span>
          <input
            value={linkedInUrl}
            disabled={!canEdit}
            onChange={(e) => updateSpeakerContent({ linkedInUrl: e.target.value })}
          />
        </label>
        <label className="is-wide">
          <span>약력</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
      </div>
    );
  }

  if (preset.sectionType === 'supporting_organizations') {
    const organizationContent = parseBlockContent(block.contentJson);
    const currentGroup = getOrganizationGroup(block);
    const logoImageUrl = typeof organizationContent.imageUrl === 'string' ? organizationContent.imageUrl : '';
    const updateOrganizationGroup = (group: string) => {
      onUpdate({
        badgeText: group,
        contentJson: JSON.stringify({ ...organizationContent, category: group }),
      });
    };
    const updateOrganizationContent = (patch: Record<string, unknown>) => {
      onUpdate({ contentJson: JSON.stringify({ ...organizationContent, ...patch }) });
    };

    return (
      <div className="saf-simple-form is-compact">
        <label className="is-wide">
          <span>기관 구분</span>
          <select
            value={currentGroup}
            disabled={!canEdit}
            onChange={(e) => updateOrganizationGroup(e.target.value)}
          >
            {!ORGANIZATION_GROUP_OPTIONS.some((option) => option.value === currentGroup) && (
              <option value={currentGroup}>{currentGroup}</option>
            )}
            {ORGANIZATION_GROUP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="is-wide">
          <span>기관 구분 직접 입력</span>
          <input
            value={currentGroup}
            disabled={!canEdit}
            onChange={(e) => updateOrganizationGroup(e.target.value)}
            placeholder="예: Knowledge Partners"
          />
        </label>
        <div className="saf-simple-file-field is-wide">
          <span>로고</span>
          <CustomFile
            fileList={imageFiles}
            onFileListChange={onImageFilesChange}
            isEditable={canEdit}
            maxCount={1}
            accept="image/*"
          />
        </div>
        <label className="is-wide">
          <span>로고 이미지 주소(선택)</span>
          <input value={logoImageUrl} disabled={!canEdit} onChange={(e) => updateOrganizationContent({ imageUrl: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>기관명</span>
          <input value={block.organizationName ?? block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ organizationName: e.target.value, title: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>홈페이지 주소</span>
          <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
        </label>
      </div>
    );
  }

  if (preset.sectionType === 'visit_seoul') {
    const hotelContent = parseBlockContent(block.contentJson);
    const roomRates = typeof hotelContent.roomRates === 'string' ? hotelContent.roomRates : '';
    const mapUrl = typeof hotelContent.mapUrl === 'string' ? hotelContent.mapUrl : '';
    const bookingDeadline = typeof hotelContent.bookingDeadline === 'string' ? hotelContent.bookingDeadline : '';
    const updateHotelContent = (patch: Record<string, unknown>) => {
      onUpdate({ contentJson: JSON.stringify({ ...hotelContent, ...patch }) });
    };

    return (
      <div className="saf-simple-form is-compact">
        <label>
          <span>호텔명</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>웹사이트</span>
          <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
        </label>
        <label>
          <span>버튼 문구</span>
          <input
            value={block.buttonLabel ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ buttonLabel: e.target.value })}
            placeholder="Book / View Hotel"
          />
        </label>
        <label>
          <span>지도 링크</span>
          <input value={mapUrl} disabled={!canEdit} onChange={(e) => updateHotelContent({ mapUrl: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>주소 / 행사장까지 이동 시간</span>
          <textarea value={block.summary ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ summary: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>연락처</span>
          <input value={block.subtitle ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ subtitle: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>예약 안내</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>객실 요금 안내(선택)</span>
          <textarea value={roomRates} disabled={!canEdit} onChange={(e) => updateHotelContent({ roomRates: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>예약 마감일/조건(선택)</span>
          <input value={bookingDeadline} disabled={!canEdit} onChange={(e) => updateHotelContent({ bookingDeadline: e.target.value })} />
        </label>
      </div>
    );
  }

  if (preset.sectionType === 'notice') {
    return (
      <div className="saf-simple-form is-compact">
        <label>
          <span>공지 제목</span>
          <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
        </label>
        <label>
          <span>첨부/안내 링크</span>
          <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
        </label>
        <label>
          <span>버튼 문구</span>
          <input
            value={block.buttonLabel ?? ''}
            disabled={!canEdit}
            onChange={(e) => onUpdate({ buttonLabel: e.target.value })}
            placeholder="Download / View Notice"
          />
        </label>
        <label className="is-wide">
          <span>짧은 설명</span>
          <textarea value={block.summary ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ summary: e.target.value })} />
        </label>
        <label className="is-wide">
          <span>상세 내용</span>
          <textarea value={block.body ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ body: e.target.value })} />
        </label>
      </div>
    );
  }

  return (
    <div className="saf-simple-form is-compact">
      <label>
        <span>제목</span>
        <input value={block.title ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ title: e.target.value })} />
      </label>
      <label>
        <span>링크</span>
        <input value={block.linkUrl ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ linkUrl: e.target.value })} />
      </label>
      <label>
        <span>버튼 문구</span>
        <input value={block.buttonLabel ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ buttonLabel: e.target.value })} />
      </label>
      <label className="is-wide">
        <span>짧은 설명</span>
        <textarea value={block.summary ?? ''} disabled={!canEdit} onChange={(e) => onUpdate({ summary: e.target.value })} />
      </label>
      <label className="is-wide">
        <span>상세 내용</span>
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
  const pageSettings = parsePageSettings(page.settingsJson);

  return (
    <div className="saf-builder-preview" style={{ '--preview-accent': accentColor } as React.CSSProperties}>
      <section className="saf-builder-preview-hero" style={heroStyle}>
        <div className="saf-builder-preview-hero-copy">
          <span style={{ color: accentColor }}>KCAB International</span>
          <h1>{page.heroTitle || page.pageTitle || page.eventTitle || 'Official Event'}</h1>
          {(page.heroSubtitle || page.pageSubtitle || page.location) && (
            <p>{page.heroSubtitle || page.pageSubtitle || page.location}</p>
          )}
        </div>
        <div className="saf-builder-preview-info-card">
          {renderPreviewInfoRow('Date', formatPreviewRange(page.eventStartDt, page.eventEndDt))}
          {renderPreviewInfoRow('Venue', page.location)}
          {renderPreviewInfoRow('Registration', pageSettings.registrationStatusLabel)}
          {renderPreviewInfoRow('Organizer', pageSettings.organizerName)}
          {renderPreviewInfoRow('Contact', [pageSettings.contactEmail, pageSettings.contactPhone].filter(Boolean).join(' / '))}
          {pageSettings.infoNote && <p>{pageSettings.infoNote}</p>}
          {page.registrationUrl && <em>Register</em>}
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
          <div className="saf-builder-empty is-small">미리볼 수 있는 항목이 없습니다.</div>
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
  const sectionSettings = parseSectionSettings(section.settingsJson);
  const sectionClassName = [
    'saf-builder-preview-section',
    `is-bg-${sectionSettings.backgroundStyle || 'white'}`,
    `is-width-${sectionSettings.width || 'normal'}`,
    `is-spacing-${sectionSettings.spacing || 'normal'}`,
  ].join(' ');

  if (section.sectionType === 'program') {
    return (
      <section id={`preview-${section.sectionSeq}`} className={sectionClassName}>
        <PreviewSectionTitle section={section} />
        <PreviewProgramGroups blocks={blocks} />
      </section>
    );
  }

  if (section.sectionType === 'speakers') {
    return (
      <section id={`preview-${section.sectionSeq}`} className={sectionClassName}>
        <PreviewSectionTitle section={section} />
        <div className="saf-builder-preview-speakers">
          {blocks.map((block) => (
            <article key={block.blockSeq}>
              {getBlockPreviewImageUrl(block, blockImageFiles) ? (
                <img
                  className="saf-builder-preview-speaker-photo"
                  src={getBlockPreviewImageUrl(block, blockImageFiles)}
                  alt={block.title || 'Speaker'}
                />
              ) : (
                <div className="saf-builder-preview-avatar">{(block.title || 'S').slice(0, 1)}</div>
              )}
              <h4>{block.title || 'Speaker'}</h4>
              {block.subtitle && <p>{block.subtitle}</p>}
              {block.organizationName && <span>{block.organizationName}</span>}
              {block.body && <small>{stripHtml(block.body)}</small>}
              {block.linkUrl && <em>Profile</em>}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'supporting_organizations') {
    return (
      <section id={`preview-${section.sectionSeq}`} className={sectionClassName}>
        <PreviewSectionTitle section={section} />
        <PreviewOrganizationGroups blocks={blocks} blockImageFiles={blockImageFiles} />
      </section>
    );
  }

  if (section.sectionType === 'visit_seoul') {
    return (
      <section id={`preview-${section.sectionSeq}`} className={sectionClassName}>
        <PreviewSectionTitle section={section} />
        {section.body && <div className="saf-builder-preview-copy" dangerouslySetInnerHTML={{ __html: section.body }} />}
        {blocks.length > 0 && (
          <>
            <h3 className="saf-builder-preview-subtitle">Partner Hotels</h3>
            <div className="saf-builder-preview-card-grid">
              {blocks.map((block) => (
                <PreviewCard key={block.blockSeq} block={block} imageUrl={getBlockPreviewImageUrl(block, blockImageFiles)} />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <section id={`preview-${section.sectionSeq}`} className={sectionClassName}>
      <PreviewSectionTitle section={section} />
      {section.body && <div className="saf-builder-preview-copy" dangerouslySetInnerHTML={{ __html: section.body }} />}
      {blocks.length > 0 && (
        <div className="saf-builder-preview-card-grid">
          {blocks.map((block) => (
            <PreviewCard key={block.blockSeq} block={block} imageUrl={getBlockPreviewImageUrl(block, blockImageFiles)} />
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

function renderPreviewInfoRow(label: string, value?: string | null) {
  if (!value) return null;
  return (
    <dl>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

const PreviewCard: React.FC<{ block: EventPageBlock; imageUrl?: string }> = ({ block, imageUrl }) => {
  const content = parseBlockContent(block.contentJson);
  const roomRates = typeof content.roomRates === 'string' ? content.roomRates : '';
  const bookingDeadline = typeof content.bookingDeadline === 'string' ? content.bookingDeadline : '';

  return (
    <article className="saf-builder-preview-card">
      {imageUrl && <img src={imageUrl} alt={block.title || block.organizationName || 'Event item'} />}
      {block.badgeText && <span>{block.badgeText}</span>}
      <h4>{block.title || block.organizationName || block.buttonLabel || block.blockType}</h4>
      {block.subtitle && <p className="saf-builder-preview-card-subtitle">{block.subtitle}</p>}
      {block.summary && <p>{block.summary}</p>}
      {block.body && <div className="saf-builder-preview-copy">{block.body}</div>}
      {roomRates && <p><strong>Room Rates</strong><br />{roomRates}</p>}
      {bookingDeadline && <p><strong>Booking Deadline</strong><br />{bookingDeadline}</p>}
      {block.buttonLabel && <em>{block.buttonLabel}</em>}
    </article>
  );
};

const PreviewOrganizationGroups: React.FC<{
  blocks: EventPageBlock[];
  blockImageFiles: Record<number, FileDetailType[]>;
}> = ({ blocks, blockImageFiles }) => {
  const groups = groupOrganizationBlocks(blocks);

  return (
    <div className="saf-builder-preview-org-wrap">
      {groups.map(([group, groupBlocks]) => (
        <div key={group} className="saf-builder-preview-org-group">
          <h3>{group}</h3>
          <div className={`saf-builder-preview-logo-grid${isOrganizerGroup(group) ? ' is-large' : ''}`}>
            {groupBlocks.map((block) => (
              <PreviewOrganizationLogo key={block.blockSeq} block={block} imageUrl={getBlockPreviewImageUrl(block, blockImageFiles)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PreviewOrganizationLogo: React.FC<{ block: EventPageBlock; imageUrl?: string }> = ({ block, imageUrl }) => (
  <article>
    {imageUrl ? (
      <img src={imageUrl} alt={block.organizationName || block.title || 'Organization'} />
    ) : (
      block.organizationName || block.title || getOrganizationGroupLabel(block)
    )}
  </article>
);

const PreviewProgramGroups: React.FC<{ blocks: EventPageBlock[] }> = ({ blocks }) => {
  const groups = groupProgramBlocks(blocks);

  return (
    <div className="saf-builder-preview-program">
      {groups.map(([track, sessions]) => (
        <div key={track} className="saf-builder-preview-program-track">
          <h3>{track}</h3>
          {sessions.map((block) => <PreviewProgramSession key={block.blockSeq} block={block} />)}
        </div>
      ))}
    </div>
  );
};

const PreviewProgramSession: React.FC<{ block: EventPageBlock }> = ({ block }) => {
  const content = parseBlockContent(block.contentJson);
  const sessionType = getProgramSessionTypeLabel(content);
  const moderator = typeof content.moderator === 'string' ? content.moderator : '';
  const dayLabel = typeof content.dayLabel === 'string' ? content.dayLabel : '';

  return (
    <article className={`saf-builder-preview-session is-${getProgramSessionTypeValue(content)}`}>
      <time>
        {dayLabel && <span>{dayLabel}</span>}
        {formatPreviewRange(block.startAt, block.endAt) || 'TBD'}
      </time>
      <div>
        {sessionType && <em>{sessionType}</em>}
        <h4>{block.title || 'Session'}</h4>
        {block.speakerNames && <p>{block.speakerNames}</p>}
        {moderator && <p>Moderator: {moderator}</p>}
        {block.venueName && <span>{block.venueName}</span>}
        {block.body && <div className="saf-builder-preview-copy">{block.body}</div>}
      </div>
    </article>
  );
};

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
    contentJson: getDefaultBlockContentJson(preset),
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
    settingsJson: JSON.stringify(normalizeSectionSettingsForSave(section.settingsJson)),
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
    label: section.title || '추가 항목',
    description: '추가로 입력하는 내용',
    defaultTitle: section.title || '추가 항목',
    blockType: 'card',
    addLabel: '항목 추가',
  };
}

function findTemplateSeq(catalog: EventPageComponentCatalog, scope: 'section' | 'block', componentType: string) {
  return catalog.templates.find((template) => (
    template.componentScope === scope && template.componentType === componentType
  ))?.componentTemplateSeq ?? null;
}

function getNewItemTitle(preset: SectionPreset, index: number) {
  if (preset.sectionType === 'program') return `세션 ${index}`;
  if (preset.sectionType === 'speakers') return `연사 ${index}`;
  if (preset.sectionType === 'supporting_organizations') return `기관 ${index}`;
  if (preset.sectionType === 'visit_seoul') return `호텔 ${index}`;
  if (preset.sectionType === 'notice') return `공지 ${index}`;
  return `항목 ${index}`;
}

function getItemHeading(preset: SectionPreset, block: EventPageBlock) {
  if (preset.sectionType === 'supporting_organizations') {
    return block.organizationName || block.title || `${getOrganizationGroupLabel(block)} 로고 ${block.sortSeq || ''}`.trim();
  }
  if (preset.sectionType === 'visit_seoul') return block.title || `호텔 ${block.sortSeq || ''}`.trim();
  return block.title || getNewItemTitle(preset, block.sortSeq || 1);
}

function getDefaultBlockContentJson(preset: SectionPreset) {
  if (preset.sectionType === 'supporting_organizations') {
    return JSON.stringify({ category: 'Supporters' });
  }
  if (preset.sectionType === 'visit_seoul') {
    return JSON.stringify({ groupTitle: 'Partner Hotels' });
  }
  return '{}';
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

function parsePageSettings(settingsJson?: unknown): PageSettings {
  if (!settingsJson) return {};
  if (typeof settingsJson === 'object' && !Array.isArray(settingsJson)) {
    return settingsJson as PageSettings;
  }
  if (typeof settingsJson !== 'string') return {};
  try {
    return JSON.parse(settingsJson);
  } catch {
    return {};
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

function normalizeSectionSettingsForSave(settingsJson?: unknown): SectionSettings {
  return parseSectionSettings(settingsJson);
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

function getOrganizationGroup(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const category = typeof content.category === 'string' ? content.category : block.badgeText || '';
  return category || 'Supporters';
}

function getOrganizationGroupLabel(block: EventPageBlock) {
  const value = getOrganizationGroup(block);
  return ORGANIZATION_GROUP_OPTIONS.find((option) => option.value === value)?.label || value || '후원기관';
}

function groupOrganizationBlocks(blocks: EventPageBlock[]) {
  const orderedGroups: string[] = [];
  const grouped = blocks.reduce<Record<string, EventPageBlock[]>>((acc, block) => {
    const group = getOrganizationGroup(block);
    if (!acc[group]) {
      acc[group] = [];
      orderedGroups.push(group);
    }
    acc[group].push(block);
    return acc;
  }, {});
  return orderedGroups.map((group) => [group, grouped[group]] as const);
}

function isOrganizerGroup(group: string) {
  return group.toLowerCase().includes('organizer') || group.includes('주최');
}

function getProgramSessionTypeValue(content: Record<string, unknown>) {
  const value = typeof content.sessionType === 'string' ? content.sessionType : 'session';
  return PROGRAM_SESSION_TYPE_OPTIONS.some((option) => option.value === value) ? value : 'session';
}

function getProgramSessionTypeLabel(content: Record<string, unknown>) {
  const value = getProgramSessionTypeValue(content);
  return PROGRAM_SESSION_TYPE_OPTIONS.find((option) => option.value === value)?.label || '';
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

function getBlockPreviewImageUrl(block: EventPageBlock, blockImageFiles: Record<number, FileDetailType[]>) {
  const uploadedImageUrl = getFilePreviewUrl(blockImageFiles[block.blockSeq]);
  if (uploadedImageUrl) return uploadedImageUrl;
  const content = parseBlockContent(block.contentJson);
  return typeof content.imageUrl === 'string' ? content.imageUrl : '';
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

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').slice(0, 140);
}

export default OfficialEventPageBuilder;
