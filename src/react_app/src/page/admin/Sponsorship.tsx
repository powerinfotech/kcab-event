'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, Select } from 'antd';
import {
  ArrowLeftOutlined,
  BankOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  callCreateSponsor,
  callDeleteSponsor,
  callGetSponsorDetail,
  callGetSponsorList,
  callGetSponsorTiers,
  callUpdateSponsor,
} from '@api/admin/SponsorApi';
import { callGetFileList, callSaveFiles, UPLOAD_CONTEXT } from '@api/CommonApi';
import { FileDetailType } from '@component/upload/CustomFile';
import CustomRichEditor from '@component/special/CustomRichEditor';
import {
  SponsorDetail,
  SponsorListItem,
  SponsorSavePayload,
  SponsorTier,
} from '@interface/admin/Sponsor';
import { IudType } from '@interface/common';
import type { RcFile } from 'antd/es/upload/interface';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

type Mode = 'list' | 'edit';

const CURRENT_YEAR = new Date().getFullYear();
const FIRST_YEAR = 2015;
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR + 1 - FIRST_YEAR + 1 },
  (_, i) => CURRENT_YEAR + 1 - i,
);

const USE_YN_OPTIONS = [
  { value: 'Y', label: 'Published' },
  { value: 'N', label: 'Hidden' },
];

const SPONSOR_LOGO_MAX_SIZE = 10 * 1024 * 1024;

interface FormState {
  editionYear: number;
  tierCd: string;
  companyName: string;
  description: string;
  representativeRemarks: string;
  websiteUrl: string;
  logoFileSeq: number | null;
  sortSeq: string;
  useYn: string;
}

const blankForm = (): FormState => ({
  editionYear: CURRENT_YEAR,
  tierCd: '',
  companyName: '',
  description: '',
  representativeRemarks: '',
  websiteUrl: '',
  logoFileSeq: null,
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

const htmlHasContent = (html?: string | null): boolean => {
  if (!html) return false;
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text.length > 0 || /<img/i.test(html);
};

const cleanHtml = (html?: string | null): string | null => (htmlHasContent(html) ? html! : null);

const buildLogoUrl = (fileDtlSeq?: number | null): string => (
  fileDtlSeq ? `/api/public/file-image/${fileDtlSeq}` : ''
);

const getLogoPreviewUrl = (file?: FileDetailType | null): string => {
  if (!file) return '';
  if (file.fileUrl) return file.fileUrl;
  if (file.fileDtlSeq) return buildLogoUrl(file.fileDtlSeq);
  return file.filePath ?? '';
};

export default function Sponsorship() {
  const { message, modal } = App.useApp();

  const [items, setItems] = useState<SponsorListItem[]>([]);
  const [tiers, setTiers] = useState<SponsorTier[]>([]);
  const [keyword, setKeyword] = useState('');
  const [yearFilter, setYearFilter] = useState<number | undefined>(CURRENT_YEAR);
  const [tierFilter, setTierFilter] = useState<string>('');
  const [useYnFilter, setUseYnFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<Mode>('list');
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [detailMeta, setDetailMeta] = useState<SponsorDetail | null>(null);
  const [logoFiles, setLogoFiles] = useState<FileDetailType[]>([]);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const tierNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    tiers.forEach((tier) => { map[tier.code] = tier.name; });
    return map;
  }, [tiers]);

  const fetchTiers = useCallback(async () => {
    try {
      const res = await callGetSponsorTiers();
      setTiers(res?.item ?? []);
    } catch {
      setTiers([]);
    }
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callGetSponsorList({
        editionYear: yearFilter,
        tierCd: tierFilter || undefined,
        useYn: useYnFilter || undefined,
        keyword: keyword.trim() || undefined,
      });
      setItems(res?.item ?? []);
    } catch {
      message.error('Failed to load sponsors.');
    } finally {
      setLoading(false);
    }
  }, [yearFilter, tierFilter, useYnFilter, keyword, message]);

  useEffect(() => {
    fetchTiers();
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pagination = useClientGridPagination(items);

  const visibleLogo = useMemo(
    () => logoFiles.find((file) => file.iudType !== IudType.D) ?? null,
    [logoFiles],
  );

  const handleOpenNew = () => {
    setSelectedSeq(null);
    setDetailMeta(null);
    setForm({ ...blankForm(), editionYear: yearFilter ?? CURRENT_YEAR });
    setLogoFiles([]);
    setSubmitAttempted(false);
    setMode('edit');
  };

  const handleOpenEdit = async (row: SponsorListItem) => {
    setLoading(true);
    try {
      const res = await callGetSponsorDetail(row.sponsorSeq);
      const detail = res?.item;
      if (!detail) {
        message.warning('Sponsor was not found.');
        return;
      }
      setSelectedSeq(detail.sponsorSeq);
      setDetailMeta(detail);
      setForm({
        editionYear: detail.editionYear ?? CURRENT_YEAR,
        tierCd: detail.tierCd ?? '',
        companyName: detail.companyName ?? '',
        description: detail.description ?? '',
        representativeRemarks: detail.representativeRemarks ?? '',
        websiteUrl: detail.websiteUrl ?? '',
        logoFileSeq: detail.logoFileSeq ?? null,
        sortSeq: String(detail.sortSeq ?? 0),
        useYn: detail.useYn || 'Y',
      });
      if (detail.logoFileSeq) {
        try {
          const fileRes = await callGetFileList(detail.logoFileSeq);
          setLogoFiles((fileRes?.item as FileDetailType[]) ?? []);
        } catch {
          setLogoFiles([]);
        }
      } else {
        setLogoFiles([]);
      }
      setSubmitAttempted(false);
      setMode('edit');
    } catch {
      message.error('Failed to load sponsor.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setMode('list');
    setSelectedSeq(null);
    setDetailMeta(null);
    setLogoFiles([]);
    setForm(blankForm());
    setSubmitAttempted(false);
  };

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sortSeqNumber = Number(form.sortSeq || 0);
  const companyInvalid = submitAttempted && !form.companyName.trim();
  const tierInvalid = submitAttempted && !form.tierCd;
  const logoInvalid = submitAttempted && !visibleLogo;

  const validate = () => {
    if (!form.tierCd) {
      message.warning('Please select a tier.');
      return false;
    }
    if (!form.companyName.trim()) {
      message.warning('Please enter a company name.');
      return false;
    }
    if (!visibleLogo) {
      message.warning('Please upload a company logo.');
      return false;
    }
    return true;
  };

  const persist = async () => {
    setSaving(true);
    try {
      let resolvedFileSeq: number | null = form.logoFileSeq;
      if (logoFiles.some((file) => file.iudType)) {
        const res = await callSaveFiles(resolvedFileSeq, 0, logoFiles, UPLOAD_CONTEXT.SPONSOR_LOGO);
        const newSeq = res?.item?.fileSeq;
        if (newSeq) resolvedFileSeq = Number(newSeq);
        if (res?.item?.fileList) {
          setLogoFiles(res.item.fileList as FileDetailType[]);
        }
      }

      const payload: SponsorSavePayload = {
        editionYear: form.editionYear,
        tierCd: form.tierCd,
        companyName: form.companyName.trim(),
        logoFileSeq: resolvedFileSeq,
        description: cleanHtml(form.description),
        representativeRemarks: cleanHtml(form.representativeRemarks),
        websiteUrl: form.websiteUrl.trim() || null,
        sortSeq: Number.isNaN(sortSeqNumber) ? 0 : sortSeqNumber,
        useYn: form.useYn || 'Y',
      };

      if (selectedSeq == null) {
        await callCreateSponsor(payload);
        message.success('Sponsor has been registered.');
      } else {
        await callUpdateSponsor(selectedSeq, payload);
        message.success('Sponsor has been saved.');
      }
      await fetchList();
      handleBackToList();
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message;
      message.error(backendMsg ? `Failed to save. (${backendMsg})` : 'Failed to save sponsor.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!validate()) return;
    modal.confirm({
      title: selectedSeq == null ? 'Register Sponsor' : 'Save Sponsor',
      content: selectedSeq == null ? 'Do you want to register this sponsor?' : 'Do you want to save changes?',
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk: persist,
    });
  };

  const handleDelete = () => {
    if (selectedSeq == null) return;
    modal.confirm({
      title: 'Delete Sponsor',
      content: 'Once deleted, this sponsor will no longer be visible. Continue?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          await callDeleteSponsor(selectedSeq);
          message.success('Sponsor has been deleted.');
          await fetchList();
          handleBackToList();
        } catch (err: any) {
          const backendMsg = err?.response?.data?.message;
          message.error(backendMsg ? `Failed to delete. (${backendMsg})` : 'Failed to delete sponsor.');
        }
      },
    });
  };

  if (mode === 'edit') {
    const isNew = selectedSeq == null;
    return (
      <div className="saf-screen saf-sponsorship-screen">
        <header className="saf-screen-header">
          <div>
            <h1>{isNew ? 'New Sponsor' : 'Edit Sponsor'}</h1>
            <p>
              {isNew
                ? 'Register a sponsor under a tier for a given year.'
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
            <PanelTitle title="Sponsor Information" subtitle="Year and tier decide where this company appears." />
            <div className="saf-form-grid">
              <Field label="Year *">
                <select
                  value={form.editionYear}
                  onChange={(e) => updateForm('editionYear', Number(e.target.value))}
                  disabled={saving}
                >
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tier *" invalid={tierInvalid}>
                <select
                  value={form.tierCd}
                  onChange={(e) => updateForm('tierCd', e.target.value)}
                  disabled={saving}
                >
                  <option value="" disabled>Select a tier</option>
                  {tiers.map((tier) => (
                    <option key={tier.code} value={tier.code}>{tier.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Company Name *" invalid={companyInvalid} wide>
                <input
                  value={form.companyName}
                  maxLength={300}
                  placeholder="e.g. Lex Mundi"
                  onChange={(e) => updateForm('companyName', e.target.value)}
                  disabled={saving}
                />
              </Field>
              <Field label="Website URL" wide>
                <input
                  type="url"
                  value={form.websiteUrl}
                  maxLength={500}
                  placeholder="https://example.com"
                  onChange={(e) => updateForm('websiteUrl', e.target.value)}
                  disabled={saving}
                />
              </Field>
              <Field label="Sort Order">
                <input
                  type="number"
                  value={form.sortSeq}
                  onChange={(e) => updateForm('sortSeq', e.target.value)}
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
            </div>
          </section>

          <section className="saf-panel">
            <PanelTitle title="Logo *" subtitle="Single image (PNG/JPG), shown on the public sponsors section." />
            <SponsorLogoUpload
              fileList={logoFiles}
              onChange={setLogoFiles}
              disabled={saving}
              invalid={logoInvalid}
            />
          </section>

          <section className="saf-panel">
            <PanelTitle title="Company Description" subtitle="Rich text shown on the sponsor's entry." />
            <div className="saf-event-description-editor">
              <CustomRichEditor
                key={`desc-${selectedSeq ?? 'new'}`}
                value={form.description}
                isEditable={!saving}
                onChange={(html) => updateForm('description', html)}
                placeholder="Write a short description of this company."
                height={320}
                uploadContext={UPLOAD_CONTEXT.SPONSOR_LOGO}
              />
            </div>
          </section>

          <section className="saf-panel">
            <PanelTitle
              title="Representative's Remarks"
              subtitle="Optional — only companies with remarks appear in the public Representative's Remarks section."
            />
            <div className="saf-event-description-editor">
              <CustomRichEditor
                key={`remarks-${selectedSeq ?? 'new'}`}
                value={form.representativeRemarks}
                isEditable={!saving}
                onChange={(html) => updateForm('representativeRemarks', html)}
                placeholder="Leave empty if this sponsor has no remarks."
                height={320}
                uploadContext={UPLOAD_CONTEXT.SPONSOR_LOGO}
              />
            </div>
          </section>

          {!isNew && detailMeta && (
            <section className="saf-panel">
              <PanelTitle title="Audit" subtitle="Tracking information for this sponsor." />
              <dl className="saf-participant-meta">
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
    <div className="saf-screen saf-sponsorship-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Sponsorship</h1>
          <p>Manage sponsors and partners by edition year.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchList} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={handleOpenNew} disabled={loading}>
            <PlusOutlined />
            <span>New Sponsor</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Search by company name"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchList();
            }}
          />
        </div>
        <Select
          allowClear
          className="saf-filter-select"
          placeholder="Year"
          value={yearFilter}
          onChange={(value) => setYearFilter(value ?? undefined)}
          options={YEAR_OPTIONS.map((year) => ({ value: year, label: String(year) }))}
        />
        <Select
          allowClear
          className="saf-filter-select"
          placeholder="Tier"
          value={tierFilter || undefined}
          onChange={(value) => setTierFilter(value ?? '')}
          options={tiers.map((tier) => ({ value: tier.code, label: tier.name }))}
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
        <table className="saf-table saf-sponsor-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>Logo</th>
              <th>Company</th>
              <th style={{ width: 150 }}>Tier</th>
              <th style={{ width: 80 }}>Year</th>
              <th style={{ width: 100 }}>Remarks</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 90 }}>Sort</th>
              <th style={{ width: 150 }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pagedItems.map((item) => {
              const logoUrl = item.logoFileUrl || buildLogoUrl(item.logoFileDtlSeq);
              return (
                <tr key={item.sponsorSeq} onClick={() => handleOpenEdit(item)}>
                  <td>
                    {logoUrl ? (
                      <img className="saf-sponsor-logo-thumb" src={logoUrl} alt={item.companyName} loading="lazy" decoding="async" />
                    ) : (
                      <span className="saf-sponsor-logo-thumb is-empty"><BankOutlined /></span>
                    )}
                  </td>
                  <td><strong>{item.companyName}</strong></td>
                  <td>
                    <span className="saf-status is-gray">
                      {item.tierCdNm || tierNameMap[item.tierCd] || item.tierCd}
                    </span>
                  </td>
                  <td>{item.editionYear}</td>
                  <td>
                    {item.hasRemarks
                      ? <span className="saf-status is-purple">Yes</span>
                      : <span className="saf-muted-inline">—</span>}
                  </td>
                  <td>
                    <span className={`saf-status is-${item.useYn === 'Y' ? 'green' : 'gray'}`}>
                      {item.useYn === 'Y' ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td>{item.sortSeq ?? 0}</td>
                  <td>{formatDateTime(item.uptDateTime ?? item.rgstDateTime)}</td>
                </tr>
              );
            })}
            {!items.length && (
              <tr>
                <td colSpan={8} className="saf-participant-empty">
                  <BankOutlined />
                  <span>{loading ? 'Loading...' : 'No sponsors found.'}</span>
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

function SponsorLogoUpload({
  fileList,
  onChange,
  disabled,
  invalid,
}: {
  fileList: FileDetailType[];
  onChange: (files: FileDetailType[]) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const { message } = App.useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const localUrls = useRef<Set<string>>(new Set());
  const visible = useMemo(
    () => fileList.find((file) => file.iudType !== IudType.D) ?? null,
    [fileList],
  );

  const revoke = (file: FileDetailType) => {
    const url = file.fileUrl ?? file.filePath;
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      localUrls.current.delete(url);
    }
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > SPONSOR_LOGO_MAX_SIZE) {
      message.error('Only images up to 10MB can be uploaded.');
      return;
    }
    const rcFile = file as RcFile;
    rcFile.uid = `sponsor-logo-${Date.now()}`;
    const previewUrl = URL.createObjectURL(rcFile);
    localUrls.current.add(previewUrl);

    const next: FileDetailType = {
      uid: rcFile.uid,
      fileNm: rcFile.name,
      filePath: previewUrl,
      fileUrl: previewUrl,
      sortSeq: 1,
      originFileObj: rcFile,
      iudType: IudType.I,
    };

    const kept = fileList.flatMap((existing) => {
      if (existing.iudType === IudType.D) return [existing];
      if (existing.iudType === IudType.I) {
        revoke(existing);
        return [];
      }
      return [{ ...existing, iudType: IudType.D }];
    });

    onChange([...kept, next]);
  };

  const handleRemove = () => {
    if (!visible) return;
    const next = fileList.flatMap((file) => {
      if (file !== visible) return [file];
      if (file.iudType === IudType.I) {
        revoke(file);
        return [];
      }
      return [{ ...file, iudType: IudType.D }];
    });
    onChange(next);
  };

  useEffect(() => () => {
    for (const url of localUrls.current) URL.revokeObjectURL(url);
  }, []);

  const previewUrl = getLogoPreviewUrl(visible);

  return (
    <div className={`saf-logo-uploader${invalid ? ' is-invalid' : ''}`}>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} disabled={disabled} />
      {visible ? (
        <div className="saf-logo-preview">
          <img src={previewUrl} alt="Sponsor logo" decoding="async" />
          <div className="saf-logo-preview-actions">
            <button type="button" onClick={openPicker} disabled={disabled}>Change</button>
            <button type="button" className="is-danger" onClick={handleRemove} disabled={disabled} aria-label="Remove logo">
              <DeleteOutlined />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="saf-logo-dropzone" onClick={openPicker} disabled={disabled}>
          <PlusOutlined />
          <span>Click to upload logo</span>
          <small>PNG / JPG · up to 10MB</small>
        </button>
      )}
    </div>
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
