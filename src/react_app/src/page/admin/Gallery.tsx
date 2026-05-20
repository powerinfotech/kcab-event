'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, Modal, Select } from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileImageOutlined,
  PictureOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  callCreateGallery,
  callDeleteGallery,
  callGetGalleryDetail,
  callGetGalleryList,
  callUpdateGallery,
} from '@api/admin/GalleryApi';
import { buildGalleryImageUrl } from '@api/gallery/GalleryApi';
import { callGetFileList, callSaveFiles, UPLOAD_CONTEXT } from '@api/CommonApi';
import { FileDetailType } from '@component/upload/CustomFile';
import {
  GalleryDetail,
  GalleryListItem,
  GallerySavePayload,
} from '@interface/admin/Gallery';
import { IudType } from '@interface/common';
import type { RcFile } from 'antd/es/upload/interface';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

type Mode = 'list' | 'edit';

const USE_YN_OPTIONS = [
  { value: 'Y', label: 'Published' },
  { value: 'N', label: 'Hidden' },
];

interface FormState {
  title: string;
  galleryYear: string;
  description: string;
  fileSeq: number | null;
  sortSeq: string;
  useYn: string;
}

const thisYear = () => new Date().getFullYear();
const MAX_GALLERY_IMAGE_COUNT = 80;
const GALLERY_IMAGE_MAX_SIZE = 30 * 1024 * 1024;

const blankForm = (): FormState => ({
  title: '',
  galleryYear: String(thisYear()),
  description: '',
  fileSeq: null,
  sortSeq: '0',
  useYn: 'Y',
});

const formatDateTime = (value?: string | null): string => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function Gallery() {
  const { message, modal } = App.useApp();

  const [items, setItems] = useState<GalleryListItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [useYnFilter, setUseYnFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<Mode>('list');
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [detailMeta, setDetailMeta] = useState<GalleryDetail | null>(null);
  const [images, setImages] = useState<FileDetailType[]>([]);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const trimmedYear = yearFilter.trim();
      const res = await callGetGalleryList({
        keyword: keyword.trim() || undefined,
        galleryYear: trimmedYear ? Number(trimmedYear) : undefined,
        useYn: useYnFilter || undefined,
      });
      setItems(res?.item ?? []);
    } catch {
      message.error('Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  }, [keyword, yearFilter, useYnFilter, message]);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pagination = useClientGridPagination(items);

  const visibleImageCount = useMemo(
    () => images.filter((image) => image.iudType !== IudType.D).length,
    [images],
  );

  const handleOpenNew = () => {
    setSelectedSeq(null);
    setDetailMeta(null);
    setForm(blankForm());
    setImages([]);
    setSubmitAttempted(false);
    setMode('edit');
  };

  const handleOpenEdit = async (row: GalleryListItem) => {
    setLoading(true);
    try {
      const res = await callGetGalleryDetail(row.gallerySeq);
      const detail = res?.item;
      if (!detail) {
        message.warning('Gallery was not found.');
        return;
      }
      setSelectedSeq(detail.gallerySeq);
      setDetailMeta(detail);
      setForm({
        title: detail.title,
        galleryYear: String(detail.galleryYear ?? thisYear()),
        description: detail.description ?? '',
        fileSeq: detail.fileSeq ?? null,
        sortSeq: String(detail.sortSeq ?? 0),
        useYn: detail.useYn || 'Y',
      });
      if (detail.fileSeq) {
        try {
          const fileRes = await callGetFileList(detail.fileSeq);
          setImages((fileRes?.item as FileDetailType[]) ?? []);
        } catch {
          setImages([]);
        }
      } else {
        setImages([]);
      }
      setSubmitAttempted(false);
      setMode('edit');
    } catch {
      message.error('Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setMode('list');
    setSelectedSeq(null);
    setDetailMeta(null);
    setImages([]);
    setForm(blankForm());
    setSubmitAttempted(false);
  };

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const galleryYearNumber = Number(form.galleryYear);
  const sortSeqNumber = Number(form.sortSeq || 0);
  const titleInvalid = submitAttempted && !form.title.trim();
  const yearInvalid = submitAttempted && (
    !form.galleryYear
    || Number.isNaN(galleryYearNumber)
    || galleryYearNumber < 2000
    || galleryYearNumber > 2100
  );
  const imageInvalid = submitAttempted && visibleImageCount === 0;

  const validate = () => {
    if (!form.title.trim()) {
      message.warning('Please enter a title.');
      return false;
    }
    if (!form.galleryYear || Number.isNaN(galleryYearNumber) || galleryYearNumber < 2000 || galleryYearNumber > 2100) {
      message.warning('Please enter a valid gallery year.');
      return false;
    }
    if (visibleImageCount === 0) {
      message.warning('Please upload at least one gallery image.');
      return false;
    }
    return true;
  };

  const persist = async () => {
    setSaving(true);
    try {
      let resolvedFileSeq: number | null = form.fileSeq;
      if (images.some((f) => f.iudType)) {
        const res = await callSaveFiles(resolvedFileSeq, 0, images, UPLOAD_CONTEXT.GALLERY_IMAGE);
        const newSeq = res?.item?.fileSeq;
        if (newSeq) resolvedFileSeq = Number(newSeq);
        if (res?.item?.fileList) {
          setImages(res.item.fileList as FileDetailType[]);
        }
      }

      const payload: GallerySavePayload = {
        title: form.title.trim(),
        galleryYear: galleryYearNumber,
        description: form.description.trim() || null,
        fileSeq: resolvedFileSeq,
        sortSeq: Number.isNaN(sortSeqNumber) ? 0 : sortSeqNumber,
        useYn: form.useYn || 'Y',
      };

      if (selectedSeq == null) {
        await callCreateGallery(payload);
        message.success('Gallery has been registered.');
      } else {
        await callUpdateGallery(selectedSeq, payload);
        message.success('Gallery has been saved.');
      }
      await fetchList();
      handleBackToList();
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message;
      message.error(backendMsg ? `Failed to save. (${backendMsg})` : 'Failed to save gallery.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!validate()) return;
    modal.confirm({
      title: selectedSeq == null ? 'Register Gallery' : 'Save Gallery',
      content: selectedSeq == null ? 'Do you want to register this gallery?' : 'Do you want to save changes?',
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk: persist,
    });
  };

  const handleDelete = () => {
    if (selectedSeq == null) return;
    modal.confirm({
      title: 'Delete Gallery',
      content: 'Once deleted, this gallery will no longer be visible. Continue?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          await callDeleteGallery(selectedSeq);
          message.success('Gallery has been deleted.');
          await fetchList();
          handleBackToList();
        } catch (err: any) {
          const backendMsg = err?.response?.data?.message;
          message.error(backendMsg ? `Failed to delete. (${backendMsg})` : 'Failed to delete gallery.');
        }
      },
    });
  };

  if (mode === 'edit') {
    const isNew = selectedSeq == null;
    return (
      <div className="saf-screen saf-gallery-screen">
        <header className="saf-screen-header">
          <div>
            <h1>{isNew ? 'New Gallery' : 'Edit Gallery'}</h1>
            <p>
              {isNew
                ? 'Create a public photo gallery album.'
                : `Last updated by ${detailMeta?.uptUserName ?? '-'} · ${formatDateTime(detailMeta?.uptDateTime)}`}
            </p>
          </div>
          <div className="saf-screen-actions">
            <button type="button" className="saf-action-btn is-secondary" onClick={handleBackToList} disabled={saving}>
              <ArrowLeftOutlined />
              <span>List</span>
            </button>
            {!isNew && (
              <button type="button" className="saf-action-btn is-danger" onClick={handleDelete} disabled={saving}>
                <DeleteOutlined />
                <span>Delete</span>
              </button>
            )}
            <button type="button" className="saf-action-btn is-primary" onClick={handleSave} disabled={saving}>
              <SaveOutlined />
              <span>{isNew ? 'Register' : 'Save'}</span>
            </button>
          </div>
        </header>

        <div className="saf-notice-news-editor">
          <section className="saf-panel">
            <PanelTitle title="Gallery Information" subtitle="Images are shown on the public Gallery page by year." />
            <div className="saf-form-grid">
              <Field label="Gallery Year *" invalid={yearInvalid}>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={form.galleryYear}
                  onChange={(e) => updateForm('galleryYear', e.target.value)}
                  disabled={saving}
                />
              </Field>
              <Field label="Status">
                <select value={form.useYn} onChange={(e) => updateForm('useYn', e.target.value)} disabled={saving}>
                  {USE_YN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Sort Order">
                <input
                  type="number"
                  value={form.sortSeq}
                  onChange={(e) => updateForm('sortSeq', e.target.value)}
                  disabled={saving}
                />
              </Field>
              <Field label="Title *" invalid={titleInvalid}>
                <input
                  value={form.title}
                  maxLength={300}
                  placeholder="e.g. SAF 2025"
                  onChange={(e) => updateForm('title', e.target.value)}
                  disabled={saving}
                />
              </Field>
              <Field label="Description" wide>
                <textarea
                  value={form.description}
                  placeholder="Optional short description"
                  onChange={(e) => updateForm('description', e.target.value)}
                  disabled={saving}
                />
              </Field>
            </div>
          </section>

          <section className="saf-panel">
            <PanelTitle
              title="Gallery Images"
              subtitle={`${visibleImageCount} image(s) selected. Drag thumbnails to adjust display order.`}
            />
            <div className={`saf-thumbnail-uploader${imageInvalid ? ' is-invalid' : ''}`}>
              <GalleryImageUpload
                fileList={images}
                onChange={setImages}
                disabled={saving}
                maxCount={MAX_GALLERY_IMAGE_COUNT}
              />
              <p className="saf-hint-inline">Images only · max 30MB each · up to 80 images per album.</p>
            </div>
          </section>

          {!isNew && detailMeta && (
            <section className="saf-panel">
              <PanelTitle title="Audit" subtitle="Tracking information for this gallery." />
              <dl className="saf-participant-meta">
                <div><dt>Images</dt><dd>{detailMeta.imageCount ?? 0}</dd></div>
                <div><dt>Created By</dt><dd>{detailMeta.rgstUserName ?? '-'}</dd></div>
                <div><dt>Created At</dt><dd>{formatDateTime(detailMeta.rgstDateTime)}</dd></div>
                <div><dt>Updated By</dt><dd>{detailMeta.uptUserName ?? '-'}</dd></div>
                <div><dt>Updated At</dt><dd>{formatDateTime(detailMeta.uptDateTime)}</dd></div>
              </dl>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="saf-screen saf-gallery-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Gallery</h1>
          <p>Manage public SAF photo galleries by year.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchList} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={handleOpenNew} disabled={loading}>
            <PlusOutlined />
            <span>New Gallery</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Search by title or description"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchList();
            }}
          />
        </div>
        <input
          className="saf-gallery-year-filter"
          type="number"
          placeholder="Year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchList();
          }}
        />
        <Select
          allowClear
          className="saf-filter-select"
          placeholder="Status"
          value={useYnFilter || undefined}
          onChange={(value) => setUseYnFilter(value ?? '')}
          options={USE_YN_OPTIONS}
        />
        <button type="button" onClick={fetchList}>Search</button>
      </section>

      <section className="saf-table-wrap">
        <table className="saf-table saf-gallery-table">
          <thead>
            <tr>
              <th style={{ width: 120 }}>Preview</th>
              <th style={{ width: 110 }}>Year</th>
              <th>Title</th>
              <th style={{ width: 110 }}>Images</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 130 }}>Sort</th>
              <th style={{ width: 150 }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pagedItems.map((item) => (
              <tr key={item.gallerySeq} onClick={() => handleOpenEdit(item)}>
                <td>
                  {item.coverFileUrl || item.coverFilePath ? (
                    <img
                      className="saf-gallery-thumb"
                      src={item.coverFileUrl || buildGalleryImageUrl(item.coverFilePath)}
                      alt={item.title}
                    />
                  ) : (
                    <span className="saf-gallery-thumb is-empty"><PictureOutlined /></span>
                  )}
                </td>
                <td><strong>{item.galleryYear}</strong></td>
                <td>
                  <strong>{item.title}</strong>
                  {item.description && <span className="saf-gallery-desc">{item.description}</span>}
                </td>
                <td>
                  <span className="saf-muted-inline">
                    <FileImageOutlined /> {item.imageCount ?? 0}
                  </span>
                </td>
                <td>
                  <span className={`saf-status is-${item.useYn === 'Y' ? 'green' : 'gray'}`}>
                    {item.useYn === 'Y' ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>{item.sortSeq ?? 0}</td>
                <td>{formatDateTime(item.uptDateTime ?? item.rgstDateTime)}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={7} className="saf-participant-empty">
                  <PictureOutlined />
                  <span>{loading ? 'Loading...' : 'No galleries found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination {...pagination} />
      </section>
    </div>
  );
}

const getFileUid = (file: FileDetailType) => (
  file.fileDtlSeq ? String(file.fileDtlSeq) : file.uid ?? `${file.fileNm}-${file.sortSeq}`
);

const isBrowserReadableUrl = (url?: string): boolean => {
  if (!url) return false;
  return /^(https?:|data:|blob:|\/api\/|\/_next\/|\/images\/|\/uploads?\/)/i.test(url);
};

const getGalleryImagePreviewUrl = (file: Partial<FileDetailType>): string => {
  if (file.fileUrl) return file.fileUrl;
  if (isBrowserReadableUrl(file.filePath)) return file.filePath ?? '';
  return buildGalleryImageUrl(file.filePath);
};

const revokeLocalPreview = (file: FileDetailType) => {
  const previewUrl = file.fileUrl ?? file.filePath;
  if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
};

const reindexGalleryImages = (files: FileDetailType[]) => {
  let nextSortSeq = 1;
  return files.map((file) => {
    if (file.iudType === IudType.D) return { ...file, sortSeq: 0 };

    const sortSeq = nextSortSeq++;
    const iudType = file.iudType === IudType.I
      ? IudType.I
      : file.sortSeq !== sortSeq || file.iudType === IudType.U
        ? IudType.U
        : file.iudType;

    return { ...file, sortSeq, iudType };
  });
};

const sortVisibleImages = (files: FileDetailType[]) => (
  files
    .filter((file) => file.iudType !== IudType.D)
    .slice()
    .sort((a, b) => (a.sortSeq || 0) - (b.sortSeq || 0))
);

function GalleryImageUpload({
  fileList,
  onChange,
  disabled,
  maxCount,
}: {
  fileList: FileDetailType[];
  onChange: (files: FileDetailType[]) => void;
  disabled?: boolean;
  maxCount: number;
}) {
  const { message } = App.useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const localPreviewUrls = useRef<Set<string>>(new Set());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [draggingUid, setDraggingUid] = useState<string | null>(null);
  const visibleImages = useMemo(() => sortVisibleImages(fileList), [fileList]);

  const createImageFileDetail = (file: File, index: number): FileDetailType | null => {
    const rcFile = file as RcFile;
    if (!rcFile.type?.startsWith('image/')) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return null;
    }

    if (rcFile.size > GALLERY_IMAGE_MAX_SIZE) {
      message.error('Only images up to 30MB can be uploaded.');
      return null;
    }

    rcFile.uid = rcFile.uid ?? `gallery-image-${Date.now()}-${index}`;
    const previewUrl = URL.createObjectURL(rcFile);
    localPreviewUrls.current.add(previewUrl);

    return {
      uid: rcFile.uid,
      fileNm: rcFile.name,
      filePath: previewUrl,
      fileUrl: previewUrl,
      sortSeq: 0,
      originFileObj: rcFile,
      iudType: IudType.I,
    };
  };

  const openFileDialog = () => {
    if (disabled || visibleImages.length >= maxCount) return;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!selectedFiles.length) return;

    const availableCount = maxCount - visibleImages.length;
    if (availableCount <= 0) {
      message.warning(`You can upload up to ${maxCount} images.`);
      return;
    }

    if (selectedFiles.length > availableCount) {
      message.warning(`Only ${availableCount} more image(s) can be added.`);
    }

    const nextImages = selectedFiles
      .slice(0, availableCount)
      .map(createImageFileDetail)
      .filter((file): file is FileDetailType => file !== null);

    if (!nextImages.length) return;
    onChange(reindexGalleryImages([...fileList, ...nextImages]));
  };

  const handleRemove = (target: FileDetailType) => {
    const targetUid = getFileUid(target);
    const nextFiles = fileList.flatMap((file) => {
      if (getFileUid(file) !== targetUid) return [file];
      if (file.iudType === IudType.I) {
        revokeLocalPreview(file);
        localPreviewUrls.current.delete(file.fileUrl ?? file.filePath ?? '');
        return [];
      }
      return [{ ...file, iudType: IudType.D }];
    });

    onChange(reindexGalleryImages(nextFiles));
  };

  const handlePreview = (file: FileDetailType) => {
    const previewUrl = getGalleryImagePreviewUrl(file);
    if (!previewUrl) return;
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };

  const handleDrop = (targetUid: string) => {
    if (!draggingUid || draggingUid === targetUid) return;

    const currentVisible = sortVisibleImages(fileList);
    const fromIndex = currentVisible.findIndex((file) => getFileUid(file) === draggingUid);
    const toIndex = currentVisible.findIndex((file) => getFileUid(file) === targetUid);
    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = currentVisible.slice();
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const deletedFiles = fileList.filter((file) => file.iudType === IudType.D);

    onChange(reindexGalleryImages([...deletedFiles, ...reordered]));
    setDraggingUid(null);
  };

  useEffect(() => () => {
    for (const previewUrl of localPreviewUrls.current) {
      URL.revokeObjectURL(previewUrl);
    }
  }, []);

  return (
    <>
      <div className="saf-gallery-image-upload">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
        />
        <div className="saf-gallery-image-grid">
          {visibleImages.map((file, index) => {
            const uid = getFileUid(file);
            const previewUrl = getGalleryImagePreviewUrl(file);
            return (
              <div
                key={uid}
                className={`saf-gallery-image-card${draggingUid === uid ? ' is-dragging' : ''}`}
                draggable={!disabled}
                onDragStart={() => setDraggingUid(uid)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(uid)}
                onDragEnd={() => setDraggingUid(null)}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt={`Gallery image ${index + 1}`} />
                ) : (
                  <span className="saf-gallery-image-placeholder"><PictureOutlined /></span>
                )}
                <span className="saf-gallery-image-index">{index + 1}</span>
                <div className="saf-gallery-image-actions">
                  <button type="button" aria-label="Preview image" onClick={() => handlePreview(file)}>
                    <EyeOutlined />
                  </button>
                  <button type="button" aria-label="Remove image" onClick={() => handleRemove(file)} disabled={disabled}>
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            );
          })}
          {visibleImages.length < maxCount && (
            <button
              type="button"
              className="saf-gallery-image-add"
              onClick={openFileDialog}
              disabled={disabled}
            >
              <PlusOutlined />
              <span>업로드</span>
            </button>
          )}
        </div>
      </div>
      <Modal
        open={previewOpen}
        title="Gallery Image"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Gallery preview" src={previewImage} style={{ width: '100%' }} />
      </Modal>
    </>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="saf-panel-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

interface FieldProps {
  label: string;
  invalid?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}

function Field({ label, invalid, wide, children }: FieldProps) {
  const required = label.endsWith(' *');
  const labelText = required ? label.slice(0, -2) : label;
  return (
    <label className={`saf-form-field${wide ? ' is-wide' : ''}${invalid ? ' is-invalid' : ''}`}>
      <span>
        {labelText}
        {required && <em className="saf-required-mark">*</em>}
      </span>
      {children}
    </label>
  );
}
