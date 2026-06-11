'use client';

import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { App } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  callGetEventList,
  callGetEventPageBuilder,
  callGetEventPageBuilderCatalog,
  callSaveEventPageBuilder,
} from '@api/event/EventApi';
import { callGetFileList, callSaveFiles, UPLOAD_CONTEXT, type UploadContext } from '@api/CommonApi';
import CustomFile, { FileDetailType } from '@component/upload/CustomFile';
import CustomRichEditor from '@component/special/CustomRichEditor';
import { PublicEventPageView } from '@page/public/PublicEventPage';
import {
  EventListItem,
  EventPageBlock,
  EventPageComponentCatalog,
  EventPageSection,
  PublicEventPage,
} from '@interface/event/EventManagement';
import HeroSeoulImage from '../../assets/images/saf-renewal/hero-seoul.jpg';

interface OfficialEventPageBuilderProps {
  eventSeq: number | null;
  canEdit: boolean;
}

export interface OfficialEventPageBuilderHandle {
  save: (options?: { silentSuccess?: boolean }) => Promise<boolean>;
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
  backgroundStyle?: 'white' | 'soft' | 'brand-purple' | 'brand-blue' | 'brand-pink' | 'brand-gradient' | 'lavender' | 'blue' | 'mint' | 'rose' | 'peach' | 'gold' | 'slate' | 'navy';
  width?: 'normal' | 'wide';
  spacing?: 'compact' | 'normal' | 'spacious';
  [key: string]: unknown;
}

const EMPTY_CATALOG: EventPageComponentCatalog = { categories: [], templates: [] };
const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');
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
  { value: 'white', label: '흰색', swatch: '#ffffff' },
  { value: 'soft', label: '연한 회색', swatch: 'linear-gradient(135deg, #f6f8fb, #ffffff)' },
  { value: 'brand-purple', label: 'SAF 퍼플', swatch: 'linear-gradient(135deg, #ede7ff, #ffffff)' },
  { value: 'brand-blue', label: 'SAF 블루', swatch: 'linear-gradient(135deg, #e5eeff, #ffffff)' },
  { value: 'brand-pink', label: 'SAF 핑크', swatch: 'linear-gradient(135deg, #ffe6fb, #ffffff)' },
  { value: 'brand-gradient', label: 'SAF 메인 그라데이션', swatch: 'linear-gradient(135deg, #315cff, #8b54f6 55%, #df55e7)' },
  { value: 'lavender', label: '라벤더', swatch: 'linear-gradient(135deg, #efe7ff, #ffffff)' },
  { value: 'blue', label: '연한 블루', swatch: 'linear-gradient(135deg, #e8f2ff, #ffffff)' },
  { value: 'mint', label: '민트', swatch: 'linear-gradient(135deg, #e3fbf2, #ffffff)' },
  { value: 'rose', label: '로즈', swatch: 'linear-gradient(135deg, #ffe7f3, #ffffff)' },
  { value: 'peach', label: '피치', swatch: 'linear-gradient(135deg, #ffefdf, #ffffff)' },
  { value: 'gold', label: '골드 포인트', swatch: 'linear-gradient(135deg, #fff0bb, #ffffff)' },
  { value: 'slate', label: '슬레이트', swatch: 'linear-gradient(135deg, #334155, #111827)' },
  { value: 'navy', label: '짙은 남색', swatch: 'linear-gradient(135deg, #10105a, #6f28bb)' },
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

const DISABLED_SECTION_TYPES = new Set(['contact']);

const OfficialEventPageBuilder = React.forwardRef<OfficialEventPageBuilderHandle, OfficialEventPageBuilderProps>(({ eventSeq, canEdit }, ref) => {
  const { message } = App.useApp();
  const tempSeqRef = useRef(-1);
  const previewShellRef = useRef<HTMLDivElement>(null);
  const previewBodyRef = useRef<HTMLDivElement>(null);
  const previewScrollFrameRef = useRef<number | null>(null);
  const previewDragRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
    width: number;
    height: number;
  } | null>(null);
  const [catalog, setCatalog] = useState<EventPageComponentCatalog>(EMPTY_CATALOG);
  const [page, setPage] = useState<PublicEventPage | null>(null);
  const [activeSectionSeq, setActiveSectionSeq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDragging, setPreviewDragging] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<{ left: number; top: number } | null>(null);
  const [copyPanelOpen, setCopyPanelOpen] = useState(false);
  const [copySourceEvents, setCopySourceEvents] = useState<EventListItem[]>([]);
  const [copySourceEventSeq, setCopySourceEventSeq] = useState<number | null>(null);
  const [copySourceLoading, setCopySourceLoading] = useState(false);
  const [copyingPage, setCopyingPage] = useState(false);
  const [heroFiles, setHeroFiles] = useState<FileDetailType[]>([]);
  const [blockImageFiles, setBlockImageFiles] = useState<Record<number, FileDetailType[]>>({});

  const activeSection = useMemo(
    () => page?.sections.find((section) => section.sectionSeq === activeSectionSeq) ?? null,
    [page?.sections, activeSectionSeq],
  );
  const activePreset = useMemo(() => getPreset(activeSection), [activeSection]);
  const theme = useMemo(() => parseTheme(page?.themeJson), [page?.themeJson]);
  const pageSettings = useMemo(() => parsePageSettings(page?.settingsJson), [page?.settingsJson]);

  const scrollPreviewToSection = (sectionSeq?: number | null) => {
    if (sectionSeq === null || sectionSeq === undefined || typeof window === 'undefined') return;
    const section = page?.sections.find((item) => item.sectionSeq === sectionSeq);
    const anchor = section?.anchorId || section?.sectionKey;
    if (previewScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(previewScrollFrameRef.current);
    }
    previewScrollFrameRef.current = window.requestAnimationFrame(() => {
      previewScrollFrameRef.current = window.requestAnimationFrame(() => {
        const body = previewBodyRef.current;
        const target = body?.querySelector<HTMLElement>(
          `#preview-${sectionSeq}${anchor ? `, [id="${escapeCssAttribute(anchor)}"]` : ''}`,
        );
        previewScrollFrameRef.current = null;
        if (!body || !target) return;
        const bodyRect = body.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        body.scrollTo({
          top: body.scrollTop + targetRect.top - bodyRect.top - 16,
          behavior: 'smooth',
        });
      });
    });
  };

  const openPreview = (sectionSeq?: number | null) => {
    const targetSeq = sectionSeq ?? activeSectionSeq ?? page?.sections[0]?.sectionSeq ?? null;
    setPreviewOpen(true);
    if (targetSeq !== null && targetSeq !== undefined) {
      replacePreviewHash(targetSeq);
      scrollPreviewToSection(targetSeq);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    clearPreviewHash();
  };

  const navigatePreviewSection = (sectionSeq: number) => {
    setPreviewOpen(true);
    setActiveSectionSeq(sectionSeq);
    replacePreviewHash(sectionSeq);
    scrollPreviewToSection(sectionSeq);
  };

  const clampPreviewPosition = (left: number, top: number, width: number, height: number) => {
    if (typeof window === 'undefined') return { left, top };
    const padding = 12;
    const maxLeft = Math.max(padding, window.innerWidth - width - padding);
    const maxTop = Math.max(padding, window.innerHeight - height - padding);
    return {
      left: Math.min(Math.max(left, padding), maxLeft),
      top: Math.min(Math.max(top, padding), maxTop),
    };
  };

  const handlePreviewDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    const shell = previewShellRef.current;
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    previewDragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      width: rect.width,
      height: rect.height,
    };
    setPreviewPosition({ left: rect.left, top: rect.top });
    setPreviewDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePreviewDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = previewDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const nextLeft = drag.startLeft + event.clientX - drag.startClientX;
    const nextTop = drag.startTop + event.clientY - drag.startClientY;
    setPreviewPosition(clampPreviewPosition(nextLeft, nextTop, drag.width, drag.height));
  };

  const handlePreviewDragEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = previewDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }
    previewDragRef.current = null;
    setPreviewDragging(false);
  };

  const nextTempSeq = () => {
    const value = tempSeqRef.current;
    tempSeqRef.current -= 1;
    return value;
  };

  const loadCopySourceEvents = async () => {
    if (!eventSeq) return;
    setCopySourceLoading(true);
    try {
      const res = await callGetEventList({ eventType: 'main' });
      const nextEvents = (res?.item ?? [])
        .filter((item) => item.eventSeq !== eventSeq)
        .sort((a, b) => Number(new Date(b.eventStartDt || 0)) - Number(new Date(a.eventStartDt || 0)));
      setCopySourceEvents(nextEvents);
      setCopySourceEventSeq((prev) => (
        prev && nextEvents.some((item) => item.eventSeq === prev)
          ? prev
          : (nextEvents[0]?.eventSeq ?? null)
      ));
    } catch (err: any) {
      setCopySourceEvents([]);
      setCopySourceEventSeq(null);
      message.error(err?.response?.data?.message ?? '복사할 행사 목록을 불러오지 못했습니다.');
    } finally {
      setCopySourceLoading(false);
    }
  };

  const openCopyPanel = () => {
    if (!canEdit || !eventSeq) return;
    setCopyPanelOpen(true);
    void loadCopySourceEvents();
  };

  const applyCopiedPageBuilder = async () => {
    if (!page || !eventSeq || !copySourceEventSeq) return;

    setCopyingPage(true);
    try {
      const res = await callGetEventPageBuilder(copySourceEventSeq);
      const sourcePage = ensureSimpleSections(
        normalizePage(res?.item ?? null, copySourceEventSeq),
        catalog,
        nextTempSeq,
      );
      const copiedPage = ensureSimpleSections(
        createCopiedPageForCurrentEvent(sourcePage, page, eventSeq),
        catalog,
        nextTempSeq,
      );
      const nextImages = await loadPageImageFiles(copiedPage);
      setPage(copiedPage);
      setHeroFiles(nextImages.heroFiles);
      setBlockImageFiles(nextImages.blockImageFiles);
      setActiveSectionSeq(copiedPage.sections[0]?.sectionSeq ?? null);
      setCopyPanelOpen(false);
      message.success('기존 행사 꾸미기를 현재 행사에 복사했습니다. 저장을 눌러 반영해주세요.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? '기존 행사 꾸미기 복사에 실패했습니다.');
    } finally {
      setCopyingPage(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!eventSeq) {
        setPage(null);
        setActiveSectionSeq(null);
        setPreviewOpen(false);
        setCopyPanelOpen(false);
        setCopySourceEventSeq(null);
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

  useEffect(() => {
    setCopyPanelOpen(false);
    setCopySourceEvents([]);
    setCopySourceEventSeq(null);
  }, [eventSeq]);

  useEffect(() => () => {
    if (previewScrollFrameRef.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(previewScrollFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (!page) return;
    const hashSectionSeq = readPreviewHashSectionSeq();
    if (hashSectionSeq === null) return;
    const targetSeq = resolvePreviewSectionSeq(page, hashSectionSeq);
    if (targetSeq === null) return;
    setPreviewOpen(true);
    setActiveSectionSeq(targetSeq);
    scrollPreviewToSection(targetSeq);
  }, [page?.eventPageSeq]);

  useEffect(() => {
    if (!page || typeof window === 'undefined') return undefined;
    const handleHashChange = () => {
      const hashSectionSeq = readPreviewHashSectionSeq();
      if (hashSectionSeq === null) return;
      const targetSeq = resolvePreviewSectionSeq(page, hashSectionSeq);
      if (targetSeq === null) return;
      setPreviewOpen(true);
      setActiveSectionSeq(targetSeq);
      scrollPreviewToSection(targetSeq);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [page]);

  useEffect(() => {
    if (!previewOpen || activeSectionSeq === null) return;
    replacePreviewHash(activeSectionSeq);
    scrollPreviewToSection(activeSectionSeq);
  }, [activeSectionSeq, previewOpen]);

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

  const saveBuilder = async (options?: { silentSuccess?: boolean }) => {
    if (!page || !eventSeq) return false;
    if (!page.pageTitle?.trim()) {
      message.warning('Please enter the page title.');
      return false;
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
      if (!options?.silentSuccess) {
        message.success('행사 페이지가 저장되었습니다.');
      }
      return true;
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? '행사 페이지 저장에 실패했습니다.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: saveBuilder,
  }), [saveBuilder]);

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
        onPreview={() => openPreview()}
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
            <div className="saf-simple-rich-field is-wide">
              <span>상단 소개 문구</span>
              <CustomRichEditor
                value={page.heroSubtitle ?? ''}
                isEditable={canEdit}
                onChange={(value) => updatePage({ heroSubtitle: normalizeEditorHtml(value) })}
                placeholder="행사를 소개하는 짧은 문구"
                height={128}
              />
            </div>
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
              <div className="saf-simple-rich-field is-wide">
                <span>상단 안내 메모</span>
                <CustomRichEditor
                  value={pageSettings.infoNote || ''}
                  isEditable={canEdit}
                  onChange={(value) => updatePageSettings({ infoNote: normalizeEditorHtml(value) })}
                  placeholder="예: Registration closes when seats are full."
                  height={118}
                />
              </div>
            </div>
          </div>

          <div className="saf-visual-settings">
            <div className="saf-simple-editor-title">
              <div>
                <h3>상단 화면 꾸미기</h3>
                <p>대표 이미지와 색상을 선택하면 화면에 자동으로 반영됩니다.</p>
              </div>
              {canEdit && (
                <button
                  type="button"
                  className="saf-action-btn is-secondary saf-copy-builder-open"
                  onClick={openCopyPanel}
                  disabled={saving || loading || copyingPage}
                >
                  <CopyOutlined />
                  <span>기존 행사 꾸미기 복사</span>
                </button>
              )}
            </div>
            {copyPanelOpen && (
              <div className="saf-copy-builder-panel">
                <div>
                  <strong>기존 행사 선택</strong>
                  <p>선택한 행사에서 페이지 제목, 상단 문구, 대표 이미지, 색상, 행사 정보 카드, 화면 구성을 모두 가져옵니다.</p>
                </div>
                <div className="saf-copy-builder-controls">
                  <select
                    value={copySourceEventSeq ?? ''}
                    disabled={copySourceLoading || copyingPage}
                    onChange={(e) => setCopySourceEventSeq(e.target.value ? Number(e.target.value) : null)}
                  >
                    {copySourceLoading ? (
                      <option value="">행사 목록을 불러오는 중입니다...</option>
                    ) : copySourceEvents.length ? (
                      copySourceEvents.map((item) => (
                        <option key={item.eventSeq} value={item.eventSeq}>
                          {item.title} {formatCopySourceEventMeta(item)}
                        </option>
                      ))
                    ) : (
                      <option value="">복사할 수 있는 기존 공식 행사가 없습니다.</option>
                    )}
                  </select>
                  <button
                    type="button"
                    className="saf-action-btn is-primary"
                    onClick={applyCopiedPageBuilder}
                    disabled={!copySourceEventSeq || copySourceLoading || copyingPage}
                  >
                    <CopyOutlined />
                    <span>{copyingPage ? '복사 중' : '복사 적용'}</span>
                  </button>
                  <button
                    type="button"
                    className="saf-action-btn is-secondary"
                    onClick={() => setCopyPanelOpen(false)}
                    disabled={copyingPage}
                  >
                    <span>취소</span>
                  </button>
                </div>
              </div>
            )}
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
                            showInNavYn: e.target.checked ? 'Y' : section.showInNavYn,
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

      {previewOpen && page && (
        <div
          ref={previewShellRef}
          className={`saf-builder-modeless-preview${previewDragging ? ' is-dragging' : ''}`}
          role="dialog"
          aria-label="미리보기"
          style={previewPosition ? { left: previewPosition.left, top: previewPosition.top, right: 'auto' } : undefined}
        >
          <div
            className="saf-builder-modeless-preview-head"
            onPointerDown={handlePreviewDragStart}
            onPointerMove={handlePreviewDragMove}
            onPointerUp={handlePreviewDragEnd}
            onPointerCancel={handlePreviewDragEnd}
          >
            <div>
              <strong>미리보기</strong>
              <span>수정 내용이 저장 전 상태 그대로 실시간 반영됩니다.</span>
            </div>
            <button type="button" onClick={closePreview} aria-label="미리보기 닫기">
              닫기
            </button>
          </div>
          <div className="saf-builder-modeless-preview-body" ref={previewBodyRef}>
            <OfficialPagePreview
              page={page}
              theme={theme}
              heroImageUrl={getFilePreviewUrl(heroFiles)}
              blockImageFiles={blockImageFiles}
              onNavigateSection={navigatePreviewSection}
            />
          </div>
        </div>
      )}
    </section>
  );
});

OfficialEventPageBuilder.displayName = 'OfficialEventPageBuilder';

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
  const selectedBackgroundOption = getSectionBackgroundOption(sectionSettings.backgroundStyle);
  const backgroundPickerRef = useRef<HTMLDivElement>(null);
  const [backgroundPickerOpen, setBackgroundPickerOpen] = useState(false);
  const [sectionGuideOpen, setSectionGuideOpen] = useState(false);
  const updateSectionSettings = (patch: Partial<SectionSettings>) => {
    onUpdate({ settingsJson: JSON.stringify({ ...sectionSettings, ...patch }) });
  };

  useEffect(() => {
    if (!backgroundPickerOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!backgroundPickerRef.current?.contains(event.target as Node)) {
        setBackgroundPickerOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBackgroundPickerOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [backgroundPickerOpen]);

  const selectBackgroundStyle = (value: SectionSettings['backgroundStyle']) => {
    updateSectionSettings({ backgroundStyle: value });
    setBackgroundPickerOpen(false);
  };

  return (
    <>
      <div className="saf-simple-editor-title">
        <div>
          <h3>{preset.label}</h3>
          <p>{preset.description}</p>
        </div>
        <div className="saf-simple-editor-actions">
          <button
            type="button"
            className={`saf-visual-help-trigger${sectionGuideOpen ? ' is-active' : ''}`}
            onClick={() => setSectionGuideOpen((open) => !open)}
            aria-expanded={sectionGuideOpen}
          >
            <QuestionCircleOutlined />
            <span>화면 예시</span>
          </button>
          <label className="saf-simple-toggle">
            <input
              type="checkbox"
              checked={section.useYn !== 'N'}
              disabled={!canEdit}
              onChange={(e) => onUpdate({
                useYn: e.target.checked ? 'Y' : 'N',
                showInNavYn: e.target.checked ? 'Y' : section.showInNavYn,
              })}
            />
            <span>화면에 보이기</span>
          </label>
        </div>
      </div>

      {sectionGuideOpen && (
        <SectionVisualGuide preset={preset} section={section} block={visibleItems[0]} />
      )}

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
        <div className="saf-background-select-field">
          <span>배경</span>
          <div className={`saf-background-select${backgroundPickerOpen ? ' is-open' : ''}`} ref={backgroundPickerRef}>
            <button
              type="button"
              className="saf-background-trigger"
              disabled={!canEdit}
              aria-haspopup="listbox"
              aria-expanded={backgroundPickerOpen}
              onClick={() => setBackgroundPickerOpen((open) => !open)}
            >
              <i
                className="saf-background-swatch"
                style={{ background: selectedBackgroundOption.swatch }}
                title={selectedBackgroundOption.label}
                aria-hidden="true"
              />
              <strong>{selectedBackgroundOption.label}</strong>
            </button>
            {backgroundPickerOpen && canEdit && (
              <div className="saf-background-menu" role="listbox" aria-label="섹션 배경 색상">
                {SECTION_BACKGROUND_OPTIONS.map((option) => {
                  const selected = option.value === selectedBackgroundOption.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`saf-background-option${selected ? ' is-selected' : ''}`}
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectBackgroundStyle(option.value as SectionSettings['backgroundStyle'])}
                    >
                      <i
                        className="saf-background-option-swatch"
                        style={{ background: option.swatch }}
                        aria-hidden="true"
                      />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
            <div className="saf-simple-items-actions">
              {canEdit && (
                <button type="button" className="saf-action-btn is-secondary" onClick={onAddItem}>
                  <PlusOutlined />
                  <span>{preset.addLabel}</span>
                </button>
              )}
            </div>
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
}> = ({ preset, block, canEdit, onUpdate, onRemove, onMove, imageFiles, onImageFilesChange }) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const isProgramItem = preset.sectionType === 'program';

  return (
    <article className="saf-simple-item">
      <div className="saf-simple-item-head">
        <strong>{getItemHeading(preset, block)}</strong>
        <div>
          {isProgramItem && (
            <button
              type="button"
              className={`saf-session-help-trigger${helpOpen ? ' is-active' : ''}`}
              onClick={() => setHelpOpen((open) => !open)}
              title="세션 화면 예시"
              aria-label="세션 화면 예시"
              aria-expanded={helpOpen}
            >
              <QuestionCircleOutlined />
            </button>
          )}
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
      {isProgramItem && helpOpen && <ProgramSessionGuide block={block} />}
      {renderItemFields(preset, block, canEdit, onUpdate, imageFiles, onImageFilesChange)}
    </article>
  );
};

const SectionVisualGuide: React.FC<{
  preset: SectionPreset;
  section: EventPageSection;
  block?: EventPageBlock;
}> = ({ preset, section, block }) => {
  if (preset.sectionType === 'program') {
    return <ProgramSessionGuide block={block} />;
  }

  const content = parseBlockContent(block?.contentJson);
  const sectionTitle = section.title || preset.defaultTitle || preset.label;
  const subtitle = section.subtitle || preset.description;
  const itemTitle = block?.title || block?.organizationName || preset.addLabel?.replace('Add ', '') || 'Item';
  const imageLabel = typeof content.imageUrl === 'string' && content.imageUrl ? '이미지' : '사진/로고';

  if (preset.sectionType === 'speakers') {
    return (
      <aside className="saf-visual-guide" aria-label={`${preset.label} 화면 예시`}>
        <VisualGuideTitle title="연사 섹션 화면 예시" description="사진, 이름, 직책, 소속, 약력이 카드 안에서 이렇게 배치됩니다." />
        <div className="saf-visual-canvas is-speakers">
          <div className="saf-visual-speaker-card">
            <div className="saf-visual-avatar">{imageLabel}</div>
            <strong>{itemTitle}</strong>
            <span>{block?.subtitle || '직책'}</span>
            <small>{block?.organizationName || '소속'}</small>
            <p>{block?.body ? '약력 문구' : '약력은 카드 아래쪽에 짧게 표시됩니다.'}</p>
          </div>
          <VisualPin label="사진" />
          <VisualPin label="이름/직책/소속" />
          <VisualPin label="약력" />
        </div>
      </aside>
    );
  }

  if (preset.sectionType === 'supporting_organizations') {
    return (
      <aside className="saf-visual-guide" aria-label={`${preset.label} 화면 예시`}>
        <VisualGuideTitle title="기관/로고 섹션 화면 예시" description="기관 구분별로 묶이고, 로고나 기관명이 카드로 정렬됩니다." />
        <div className="saf-visual-canvas is-orgs">
          <div className="saf-visual-group-title">{block ? getOrganizationGroup(block) : 'Host Organization'}</div>
          <div className="saf-visual-logo-grid">
            <div>{block?.organizationName || itemTitle}</div>
            <div>Logo</div>
            <div>Logo</div>
          </div>
          <VisualPin label="기관 구분" />
          <VisualPin label="로고/기관명" />
        </div>
      </aside>
    );
  }

  if (preset.sectionType === 'venue') {
    return (
      <aside className="saf-visual-guide" aria-label={`${preset.label} 화면 예시`}>
        <VisualGuideTitle title="장소 섹션 화면 예시" description="장소명, 짧은 안내, 상세 설명, 버튼 문구가 안내 카드로 배치됩니다." />
        <div className="saf-visual-canvas is-card">
          <div className="saf-visual-card-image">장소 이미지</div>
          <div className="saf-visual-card-body">
            <strong>{itemTitle}</strong>
            <p>{block?.summary || section.body || '주소 / 회의실 / 오시는 길 안내'}</p>
            <span>{block?.buttonLabel || 'View Location'}</span>
          </div>
          <VisualPin label="장소명" />
          <VisualPin label="주소/안내" />
          <VisualPin label="링크 버튼" />
        </div>
      </aside>
    );
  }

  if (preset.sectionType === 'visit_seoul') {
    return (
      <aside className="saf-visual-guide" aria-label={`${preset.label} 화면 예시`}>
        <VisualGuideTitle title="호텔/방문 안내 화면 예시" description="호텔명, 주소, 예약 안내, 버튼 문구가 카드 형태로 보입니다." />
        <div className="saf-visual-canvas is-card">
          <div className="saf-visual-card-image">호텔 이미지</div>
          <div className="saf-visual-card-body">
            <strong>{itemTitle}</strong>
            <p>{block?.summary || '주소 / 행사장까지 이동 시간'}</p>
            <span>{block?.buttonLabel || 'View Hotel'}</span>
          </div>
          <VisualPin label="호텔명" />
          <VisualPin label="주소/안내" />
          <VisualPin label="버튼" />
        </div>
      </aside>
    );
  }

  if (preset.sectionType === 'notice') {
    return (
      <aside className="saf-visual-guide" aria-label={`${preset.label} 화면 예시`}>
        <VisualGuideTitle title="공지 섹션 화면 예시" description="공지 제목, 설명, 링크 버튼이 한 줄 카드로 정리됩니다." />
        <div className="saf-visual-canvas is-notice">
          <span>NOTICE</span>
          <div>
            <strong>{itemTitle}</strong>
            <p>{block?.summary || block?.body || '공지 설명 문구'}</p>
          </div>
          <em>{block?.buttonLabel || 'View Notice'}</em>
          <VisualPin label="공지 제목" />
          <VisualPin label="설명/버튼" />
        </div>
      </aside>
    );
  }

  if (preset.sectionType === 'contact') {
    return (
      <aside className="saf-visual-guide" aria-label={`${preset.label} 화면 예시`}>
        <VisualGuideTitle title="문의 섹션 화면 예시" description="담당 부서, 연락처 설명, 이메일/링크 버튼이 문의 카드로 표시됩니다." />
        <div className="saf-visual-canvas is-contact">
          <div className="saf-visual-contact-card">
            <strong>{itemTitle}</strong>
            <p>{block?.summary || section.body || '담당 부서 / 이메일 / 연락처 안내'}</p>
            <span>{block?.buttonLabel || 'Contact'}</span>
          </div>
          <VisualPin label="담당 부서" />
          <VisualPin label="연락처 설명" />
          <VisualPin label="이메일/링크" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="saf-visual-guide" aria-label={`${preset.label} 화면 예시`}>
      <VisualGuideTitle title={`${preset.label} 화면 예시`} description="섹션 제목, 소개 문구, 본문이 공개 화면에서 위에서 아래로 배치됩니다." />
      <div className="saf-visual-canvas is-text">
        <span>{section.eyebrow || preset.label}</span>
        <strong>{sectionTitle}</strong>
        <p>{section.body || subtitle}</p>
        <VisualPin label="제목" />
        <VisualPin label="소개/본문" />
      </div>
    </aside>
  );
};

const VisualGuideTitle: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="saf-visual-guide-title">
    <QuestionCircleOutlined />
    <div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  </div>
);

const VisualPin: React.FC<{ label: string }> = ({ label }) => (
  <i className="saf-visual-pin">{label}</i>
);

const ProgramSessionGuide: React.FC<{ block?: EventPageBlock }> = ({ block }) => {
  const content = parseBlockContent(block?.contentJson);
  const sessionType = getProgramSessionTypeLabel(content);
  const track = block ? getProgramTrack(block) : PROGRAM_TRACK_OPTIONS[0];
  const dayLabel = typeof content.dayLabel === 'string' ? content.dayLabel : '';
  const moderator = typeof content.moderator === 'string' ? content.moderator : '';
  const timeText = block ? formatPreviewBlockTime(block) || 'TBD' : 'TBD';
  const titleText = block?.title || 'Session';
  const imageCount = Math.min(
    4,
    (block?.imageFileSeq ? 1 : 0)
      + (typeof content.imageUrl === 'string' && content.imageUrl.trim() ? 1 : 0)
      + normalizeImageUrlList(content.imageUrls).length,
  );

  return (
    <aside className="saf-visual-guide saf-session-guide" aria-label="세션 화면 예시">
      <VisualGuideTitle title="세션 화면 예시" description="입력값이 공개 이벤트 페이지의 세션 카드 안에서 어디에 보이는지 그림처럼 확인합니다." />
      <div className="saf-visual-canvas is-session">
        <div className="saf-visual-track">
          <span>{track}</span>
          <VisualPin label="프로그램 구분" />
        </div>
        <div className="saf-session-visual-card">
          <time>
            {dayLabel && <small>{dayLabel}</small>}
            <strong>{timeText}</strong>
            <VisualPin label="날짜/시간" />
          </time>
          <div>
            <em>{sessionType}</em>
            <h5>{titleText}</h5>
            <p>{block?.speakerNames || '발표자 이름'}</p>
            <p>{moderator ? `Moderator: ${moderator}` : 'Moderator: 좌장 이름'}</p>
            <span>{block?.venueName || '장소'}</span>
            {block?.body && <small>설명 문구</small>}
            {imageCount > 0 && (
              <div className={`saf-session-visual-images is-count-${Math.min(imageCount, 3)}`}>
                {Array.from({ length: imageCount }).map((_, index) => (
                  <i key={index} />
                ))}
                <VisualPin label="호스트 로고" />
              </div>
            )}
            <VisualPin label="형태/제목" />
            <VisualPin label="발표자/좌장/장소" />
          </div>
        </div>
        <div className="saf-visual-link-note">
          상세 링크를 넣으면 세션 제목이 클릭 가능한 링크로 바뀝니다.
        </div>
      </div>
    </aside>
  );
};

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
    const programImageUrl = typeof programContent.imageUrl === 'string' ? programContent.imageUrl : '';
    const programImageUrlsText = normalizeImageUrlList(programContent.imageUrls).join('\n');
    const updateProgramTrack = (track: string) => {
      onUpdate({
        subtitle: track,
        contentJson: JSON.stringify({ ...programContent, track }),
      });
    };
    const updateProgramContent = (patch: Record<string, unknown>) => {
      onUpdate({ contentJson: JSON.stringify({ ...programContent, ...patch }) });
    };
    const updateProgramImageUrls = (value: string) => {
      updateProgramContent({ imageUrls: parseImageUrlsText(value) });
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
        <div className="saf-simple-file-field is-wide">
          <span>호스트/기관 로고</span>
          <CustomFile
            fileList={imageFiles}
            onFileListChange={onImageFilesChange}
            isEditable={canEdit}
            maxCount={1}
            accept="image/*"
          />
        </div>
        <label className="is-wide">
          <span>대표 호스트 로고 주소(선택)</span>
          <input
            value={programImageUrl}
            disabled={!canEdit}
            onChange={(e) => updateProgramContent({ imageUrl: e.target.value })}
            placeholder="https://..."
          />
        </label>
        <label className="is-wide">
          <span>추가 호스트 로고 주소(선택, 줄바꿈)</span>
          <textarea
            value={programImageUrlsText}
            disabled={!canEdit}
            onChange={(e) => updateProgramImageUrls(e.target.value)}
            placeholder={'https://...\nhttps://...'}
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
    const travelTime = typeof hotelContent.travelTime === 'string' ? hotelContent.travelTime : '';
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
          <span>Travel time from venue</span>
          <input value={travelTime} disabled={!canEdit} onChange={(e) => updateHotelContent({ travelTime: e.target.value })} placeholder="~15 min by car from venue" />
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
  onNavigateSection?: (sectionSeq: number) => void;
}> = ({ page, theme, heroImageUrl, blockImageFiles, onNavigateSection }) => {
  const fallbackHeroImageUrl = assetSrc(HeroSeoulImage);
  const resolvedHeroImageUrl = heroImageUrl || page.heroImageUrl || fallbackHeroImageUrl;
  const previewPage = useMemo(
    () => buildPublicPreviewPage(page, blockImageFiles),
    [blockImageFiles, page],
  );
  const handleSectionLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, section: EventPageSection) => {
    event.preventDefault();
    const anchor = section.anchorId || section.sectionKey;
    const previewRoot = event.currentTarget.closest('.saf-builder-public-preview');
    const target = anchor ? previewRoot?.querySelector(`[id="${escapeCssAttribute(anchor)}"]`) : null;
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onNavigateSection?.(section.sectionSeq);
  };

  return (
    <div className="official-event-detail-page pub-event-renewal saf-builder-public-preview">
      <PublicEventPageView
        page={{ ...previewPage, themeJson: JSON.stringify(theme) }}
        heroImageUrl={resolvedHeroImageUrl}
        showFloatingActions={false}
        onRegister={() => undefined}
        onSectionNavigate={handleSectionLinkClick}
      />
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
        <PreviewProgramGroups blocks={blocks} blockImageFiles={blockImageFiles} />
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
    const hotelHeading = section.subtitle?.trim().toLowerCase().includes('partner hotel') ? '' : 'Partner Hotels';

    return (
      <section id={`preview-${section.sectionSeq}`} className={sectionClassName}>
        <PreviewSectionTitle section={section} />
        {section.body && <div className="saf-builder-preview-copy is-rich" dangerouslySetInnerHTML={{ __html: section.body }} />}
        {blocks.length > 0 && (
          <>
            {hotelHeading && <h3 className="saf-builder-preview-subtitle">{hotelHeading}</h3>}
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

  if (section.sectionType === 'notice') {
    return (
      <section id={`preview-${section.sectionSeq}`} className={`${sectionClassName} saf-builder-preview-notice-section`}>
        <PreviewSectionTitle section={section} />
        {section.body && <div className="saf-builder-preview-copy is-rich" dangerouslySetInnerHTML={{ __html: section.body }} />}
        {blocks.length > 0 && (
          <div className="saf-builder-preview-notice-list">
            {blocks.map((block) => (
              <PreviewNoticeCard key={block.blockSeq} block={block} />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section id={`preview-${section.sectionSeq}`} className={sectionClassName}>
      <PreviewSectionTitle section={section} />
      {section.body && <div className="saf-builder-preview-copy is-rich" dangerouslySetInnerHTML={{ __html: section.body }} />}
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
      {block.body && <div className="saf-builder-preview-copy is-rich" dangerouslySetInnerHTML={{ __html: block.body }} />}
      {roomRates && <p><strong>Room Rates</strong><br />{roomRates}</p>}
      {bookingDeadline && <p><strong>Booking Deadline</strong><br />{bookingDeadline}</p>}
      {block.buttonLabel && <em>{block.buttonLabel}</em>}
    </article>
  );
};

const PreviewNoticeCard: React.FC<{ block: EventPageBlock }> = ({ block }) => (
  <article className="saf-builder-preview-notice-card">
    <div className="saf-builder-preview-notice-marker">
      {block.badgeText || 'Notice'}
    </div>
    <div className="saf-builder-preview-notice-copy">
      <h4>{block.title || 'Notice'}</h4>
      {block.subtitle && <p className="saf-builder-preview-card-subtitle">{block.subtitle}</p>}
      {block.summary && <p>{block.summary}</p>}
      {block.body && <div className="saf-builder-preview-copy is-rich" dangerouslySetInnerHTML={{ __html: block.body }} />}
    </div>
    {block.linkUrl && (
      <span className="saf-builder-preview-notice-action">
        {block.buttonLabel || 'View Notice'}
      </span>
    )}
  </article>
);

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

const PreviewProgramGroups: React.FC<{
  blocks: EventPageBlock[];
  blockImageFiles: Record<number, FileDetailType[]>;
}> = ({ blocks, blockImageFiles }) => {
  const groups = groupProgramBlocks(blocks);

  return (
    <div className="saf-builder-preview-program">
      {groups.map(([track, sessions]) => (
        <div key={track} className="saf-builder-preview-program-track">
          <h3><span>{track}</span></h3>
          {sessions.map((block) => (
            <PreviewProgramSession
              key={block.blockSeq}
              block={block}
              imageUrls={getProgramPreviewImageUrls(block, blockImageFiles)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const PreviewProgramSession: React.FC<{ block: EventPageBlock; imageUrls: string[] }> = ({ block, imageUrls }) => {
  const content = parseBlockContent(block.contentJson);
  const sessionType = getProgramSessionTypeLabel(content);
  const moderator = typeof content.moderator === 'string' ? content.moderator : '';
  const dayLabel = typeof content.dayLabel === 'string' ? content.dayLabel : '';

  return (
    <article className={`saf-builder-preview-session is-${getProgramSessionTypeValue(content)}${imageUrls.length ? ' has-images' : ''}`}>
      <time>
        {dayLabel && <span>{dayLabel}</span>}
        {formatPreviewBlockTime(block) || 'TBD'}
      </time>
      <div>
        {sessionType && <em>{sessionType}</em>}
        {block.linkUrl ? (
          <h4>
            <a className="saf-builder-preview-program-link" href={block.linkUrl} target={block.linkTarget || '_self'} rel="noopener noreferrer">
              {block.title || 'Session'}
            </a>
          </h4>
        ) : (
          <h4>{block.title || 'Session'}</h4>
        )}
        {block.speakerNames && <p>{block.speakerNames}</p>}
        {moderator && <p>Moderator: {moderator}</p>}
        {block.venueName && <span>{block.venueName}</span>}
        {block.body && <div className="saf-builder-preview-copy is-rich" dangerouslySetInnerHTML={{ __html: block.body }} />}
        {imageUrls.length > 0 && (
          <div className={`saf-builder-preview-session-images is-count-${Math.min(imageUrls.length, 3)}`}>
            {imageUrls.map((imageUrl, index) => (
              <figure key={`${imageUrl}-${index}`}>
                <img src={imageUrl} alt={`${block.title || 'Session'} host logo ${index + 1}`} />
              </figure>
            ))}
          </div>
        )}
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
  const heroFileSeq = await resolveFileSeq(page.heroFileSeq ?? null, heroFiles, UPLOAD_CONTEXT.EVENT_PAGE_HERO);
  const sections: EventPageSection[] = [];

  for (const section of page.sections) {
    const blocks: EventPageBlock[] = [];
    for (const block of section.blocks ?? []) {
      const files = blockImageFiles[block.blockSeq];
      const imageFileSeq = files === undefined
        ? (block.imageFileSeq ?? null)
        : await resolveFileSeq(block.imageFileSeq ?? null, files, UPLOAD_CONTEXT.EVENT_PAGE_BLOCK_IMAGE);
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

async function resolveFileSeq(currentFileSeq: number | null, files: FileDetailType[], uploadContext: UploadContext) {
  const visibleFiles = getVisibleFiles(files);
  if (files.some((file) => !!file.iudType)) {
    const res = await callSaveFiles(currentFileSeq, 0, files, uploadContext);
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

function createCopiedPageForCurrentEvent(
  sourcePage: PublicEventPage,
  currentPage: PublicEventPage,
  targetEventSeq: number,
): PublicEventPage {
  return {
    ...sourcePage,
    eventPageSeq: currentPage.eventPageSeq ?? 0,
    eventSeq: targetEventSeq,
    languageCode: currentPage.languageCode || sourcePage.languageCode || 'en',
    urlSlug: currentPage.urlSlug || '',
    pageStatus: currentPage.pageStatus || 'draft',
    pageTitle: sourcePage.pageTitle || sourcePage.eventTitle || currentPage.pageTitle || '',
    pageSubtitle: sourcePage.pageSubtitle || '',
    heroTitle: sourcePage.heroTitle || sourcePage.eventTitle || currentPage.heroTitle || '',
    heroSubtitle: sourcePage.heroSubtitle || sourcePage.eventSummary || currentPage.heroSubtitle || '',
    settingsJson: sourcePage.settingsJson || '{}',
    publishedAt: currentPage.publishedAt ?? null,
    eventTitle: currentPage.eventTitle || '',
    eventSummary: currentPage.eventSummary || '',
    eventStartDt: currentPage.eventStartDt || '',
    eventEndDt: currentPage.eventEndDt || '',
    location: currentPage.location || '',
    registrationType: currentPage.registrationType || 'none',
    registrationUrl: currentPage.registrationUrl || '',
    eventStatus: currentPage.eventStatus || '',
    eventType: currentPage.eventType || 'main',
    sections: sourcePage.sections.map((section) => ({
      ...section,
      eventPageSeq: currentPage.eventPageSeq ?? 0,
      blocks: (section.blocks ?? []).map((block) => ({ ...block })),
    })),
  };
}

function ensureSimpleSections(
  page: PublicEventPage,
  catalog: EventPageComponentCatalog,
  nextTempSeq: () => number,
): PublicEventPage {
  const sourceSections = page.sections.filter((section) => !DISABLED_SECTION_TYPES.has(section.sectionType));
  const activePresets = SECTION_PRESETS.filter((preset) => !DISABLED_SECTION_TYPES.has(preset.sectionType));
  const existingByType = new Map(sourceSections.map((section) => [section.sectionType, section]));
  const presetSections = activePresets.map((preset, index) => {
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

  const knownTypes = new Set(activePresets.map((preset) => preset.sectionType));
  const customSections = sourceSections
    .filter((section) => !knownTypes.has(section.sectionType) && !DISABLED_SECTION_TYPES.has(section.sectionType))
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
  const saveableSections = sections.filter((section) => !DISABLED_SECTION_TYPES.has(section.sectionType));
  return resequenceSections(saveableSections).map((section) => ({
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

function getSectionBackgroundOption(value?: string | null) {
  return SECTION_BACKGROUND_OPTIONS.find((option) => option.value === value) ?? SECTION_BACKGROUND_OPTIONS[0];
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

function parseImageUrlsText(value: string) {
  return value
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function normalizeImageUrlList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((url): url is string => typeof url === 'string')
      .map((url) => url.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return parseImageUrlsText(value);
  }
  return [];
}

function uniqueImageUrls(urls: string[]) {
  return Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean)));
}

function getBlockPreviewImageUrl(block: EventPageBlock, blockImageFiles: Record<number, FileDetailType[]>) {
  const uploadedImageUrl = getFilePreviewUrl(blockImageFiles[block.blockSeq]);
  if (uploadedImageUrl) return uploadedImageUrl;
  const content = parseBlockContent(block.contentJson);
  return typeof content.imageUrl === 'string' ? content.imageUrl : '';
}

function getProgramPreviewImageUrls(block: EventPageBlock, blockImageFiles: Record<number, FileDetailType[]>) {
  const content = parseBlockContent(block.contentJson);
  const uploadedImageUrl = getFilePreviewUrl(blockImageFiles[block.blockSeq]);
  const externalImageUrl = typeof content.imageUrl === 'string' ? content.imageUrl : '';
  return uniqueImageUrls([
    uploadedImageUrl,
    externalImageUrl,
    ...normalizeImageUrlList(content.imageUrls),
  ]);
}

function buildPublicPreviewPage(page: PublicEventPage, blockImageFiles: Record<number, FileDetailType[]>): PublicEventPage {
  return {
    ...page,
    sections: (page.sections ?? []).map((section) => ({
      ...section,
      blocks: (section.blocks ?? []).map((block) => {
        const imageUrls = getProgramPreviewImageUrls(block, blockImageFiles);
        if (!imageUrls.length && !block.imageUrl) return block;

        const content = parseBlockContent(block.contentJson);
        const nextContent = imageUrls.length ? { ...content, imageUrls } : content;

        return {
          ...block,
          imageUrl: imageUrls[0] || block.imageUrl,
          contentJson: JSON.stringify(nextContent),
        };
      }),
    })),
  };
}

function escapeCssAttribute(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function toDatetimeInput(value?: string | null) {
  if (!value) return '';
  return value.replace(' ', 'T').slice(0, 16);
}

function readPreviewHashSectionSeq() {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#preview-(-?\d+)$/);
  if (!match) return null;
  const sectionSeq = Number(match[1]);
  return Number.isFinite(sectionSeq) ? sectionSeq : null;
}

function replacePreviewHash(sectionSeq: number) {
  if (typeof window === 'undefined') return;
  const nextUrl = `${window.location.pathname}${window.location.search}#preview-${sectionSeq}`;
  window.history.replaceState(null, '', nextUrl);
}

function clearPreviewHash() {
  if (typeof window === 'undefined') return;
  if (!window.location.hash.startsWith('#preview-')) return;
  const nextUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, '', nextUrl);
}

function resolvePreviewSectionSeq(page: PublicEventPage, requestedSeq: number) {
  if (page.sections.some((section) => section.sectionSeq === requestedSeq)) return requestedSeq;
  return page.sections[0]?.sectionSeq ?? null;
}

function formatPreviewEventMeta(page: PublicEventPage) {
  const parts = [formatPreviewDateRange(page.eventStartDt, page.eventEndDt), page.location].filter(Boolean);
  return parts.join(' | ');
}

function formatCopySourceEventMeta(event: EventListItem) {
  const parts = [formatPreviewDateRange(event.eventStartDt, event.eventEndDt), formatStatusLabel(event.status)]
    .filter(Boolean);
  return parts.length ? `(${parts.join(' | ')})` : '';
}

function formatPreviewDate(value?: string | null) {
  if (!value) return '';
  const date = parseDateTime(value);
  if (!date) return value.replace('T', ' ').slice(0, 16);
  return `${formatDateOnly(date)} ${formatTimeOnly(date)}`;
}

function formatPreviewDateRange(start?: string | null, end?: string | null) {
  const startDate = parseDateTime(start);
  const endDate = parseDateTime(end);

  if (startDate && endDate) {
    if (isSameDay(startDate, endDate)) {
      return `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)} - ${formatTimeOnly(endDate)}`;
    }
    return `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)} - ${formatDateOnly(endDate)} ${formatTimeOnly(endDate)}`;
  }

  const startText = startDate ? `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)}` : formatPreviewDate(start);
  const endText = endDate ? `${formatDateOnly(endDate)} ${formatTimeOnly(endDate)}` : formatPreviewDate(end);
  if (startText && endText) return `${startText} - ${endText}`;
  return startText || endText;
}

function formatPreviewBlockTime(block: EventPageBlock) {
  const startDate = parseDateTime(block.startAt);
  const endDate = parseDateTime(block.endAt);

  if (startDate && endDate) {
    if (isSameDay(startDate, endDate)) {
      return `${formatTimeOnly(startDate)} - ${formatTimeOnly(endDate)}`;
    }
    return `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)} - ${formatDateOnly(endDate)} ${formatTimeOnly(endDate)}`;
  }

  if (startDate) return formatTimeOnly(startDate);
  if (endDate) return formatTimeOnly(endDate);
  return formatPreviewDateRange(block.startAt, block.endAt);
}

function parseDateTime(value?: string | null) {
  if (!value) return null;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseDate(value?: string | null) {
  return parseDateTime(value);
}

function formatDateOnly(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTimeOnly(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function getRegistrationStatusLabel(page: PublicEventPage, settings: PageSettings) {
  if (page.registrationType === 'none') {
    return 'Registration is not available.';
  }

  const startDate = parseDateTime(page.registrationStartDt);
  const endDate = parseDateTime(page.registrationEndDt);
  const now = new Date();

  if (startDate && now.getTime() < startDate.getTime()) {
    return 'Registration is not open yet.';
  }

  if (endDate) {
    const inclusiveEnd = new Date(endDate);
    if (
      inclusiveEnd.getHours() === 0
      && inclusiveEnd.getMinutes() === 0
      && inclusiveEnd.getSeconds() === 0
      && inclusiveEnd.getMilliseconds() === 0
    ) {
      inclusiveEnd.setDate(inclusiveEnd.getDate() + 1);
      inclusiveEnd.setMilliseconds(inclusiveEnd.getMilliseconds() - 1);
    }
    if (now.getTime() > inclusiveEnd.getTime()) {
      return 'Registration is now closed.';
    }
  }

  if (startDate || endDate) {
    return 'Registration Open';
  }

  return settings.registrationStatusLabel || formatStatusLabel(page.eventStatus);
}

function formatStatusLabel(status?: string | null) {
  if (!status) return '';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').slice(0, 140);
}

function normalizeEditorHtml(value?: string | null) {
  const html = (value ?? '').trim();
  if (!html || html === '<p></p>') return '';
  return html;
}

export default OfficialEventPageBuilder;
