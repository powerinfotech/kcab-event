'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Modal } from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  StopOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';
import {
  callApproveAdminUser,
  callCreateAdminUser,
  callGetAdminUserDetail,
  callGetAdminUsers,
  callReactivateAdminUser,
  callSuspendAdminUser,
  callUpdateAdminUser,
  callWithdrawAdminUser,
} from '@api/admin/AdminUserManagementApi';
import { callGetFileList, callSaveFiles, UPLOAD_CONTEXT } from '@api/CommonApi';
import { callExcelDownload, ExcelColumnDef } from '@api/CommonExcelApi';
import { FileDetailType } from '@component/upload/CustomFile';
import {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserSaveParam,
  AdminUserStatus,
  AdminUserType,
  ORGANIZATION_GRADE_OPTIONS,
  OrganizationGrade,
} from '@interface/admin/AdminUserManagement';
import { IudType } from '@interface/common';
import { ORG_TYPE_OPTIONS } from '@interface/saf/SafAuth';
import { EMAIL_REGEXP } from '@util/validationPatterns';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

const USER_TYPE_LABEL: Record<AdminUserType, string> = {
  admin: 'Admin',
  organization: 'Organization',
};

const USER_STATUS_LABEL: Record<AdminUserStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  suspended: 'Suspended',
  withdrawn: 'Withdrawn',
};

const STATUS_TONE: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
  active: 'green',
  approved: 'green',
  pending: 'yellow',
  suspended: 'red',
  withdrawn: 'gray',
  rejected: 'red',
};

const USER_ID_MAX_LENGTH = 20;
const USER_ID_START_REGEXP = /^[A-Za-z]/;

const emptyDetail: AdminUserDetail = {
  userSeq: 0,
  userId: '',
  email: '',
  name: '',
  position: '',
  userType: 'organization',
  status: 'pending',
  organizationName: '',
  orgType: 'law_firm',
  contactEmail: '',
  contactPhone: '',
  website: '',
  imageFileSeq: null,
  grade: 'C',
};

export default function UserManagementMock() {
  const { message, modal } = App.useApp();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [userType, setUserType] = useState('');
  const [mode, setMode] = useState<'list' | 'detail'>('list');
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [form, setForm] = useState<AdminUserDetail>(emptyDetail);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [organizationImageFiles, setOrganizationImageFiles] = useState<FileDetailType[]>([]);

  const isRequiredEmpty = (value?: string) => submitAttempted && !value?.trim();

  const selectedSummary = useMemo(
    () => users.find((user) => user.userSeq === selectedSeq),
    [selectedSeq, users],
  );

  const isNew = selectedSeq === null;
  const approvalPending = !isNew && form.status === 'pending';
  const isOrganization = form.userType === 'organization';
  const userIdValue = form.userId?.trim() ?? '';
  const emailValue = form.email.trim();
  const contactEmailValue = form.contactEmail?.trim() ?? '';
  const isUserIdRuleInvalid = submitAttempted
    && !!userIdValue
    && (!USER_ID_START_REGEXP.test(userIdValue) || userIdValue.length > USER_ID_MAX_LENGTH);
  const isEmailRuleInvalid = submitAttempted && !!emailValue && !EMAIL_REGEXP.value.test(emailValue);
  const isContactEmailRuleInvalid = submitAttempted
    && isOrganization
    && !!contactEmailValue
    && !EMAIL_REGEXP.value.test(contactEmailValue);
  const userPagination = useClientGridPagination(users);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await callGetAdminUsers({
        keyword: keyword.trim() || undefined,
        status: status || undefined,
        userType: userType || undefined,
      });
      setUsers(res.item ?? []);
    } catch (error) {
      message.error('Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (userSeq: number) => {
    setLoading(true);
    try {
      const res = await callGetAdminUserDetail(userSeq);
      const nextForm = { ...emptyDetail, ...res.item };
      setForm(nextForm);
      if (nextForm.imageFileSeq) {
        try {
          const fileRes = await callGetFileList(nextForm.imageFileSeq);
          setOrganizationImageFiles((fileRes?.item as FileDetailType[]) ?? []);
        } catch {
          setOrganizationImageFiles([]);
        }
      } else {
        setOrganizationImageFiles([]);
      }
      setPassword('');
      setShowPassword(false);
      setSubmitAttempted(false);
      setSelectedSeq(userSeq);
      setMode('detail');
    } catch (error) {
      message.error('Failed to load user details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateForm = <K extends keyof AdminUserDetail>(key: K, value: AdminUserDetail[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildSaveParam = (imageFileSeq: number | null = form.imageFileSeq ?? null): AdminUserSaveParam => ({
    userId: userIdValue,
    email: emailValue,
    password: password || undefined,
    name: form.name,
    position: form.position,
    userType: form.userType,
    status: form.status,
    organizationSeq: form.organizationSeq,
    organizationName: form.organizationName,
    orgType: form.orgType,
    contactEmail: contactEmailValue,
    contactPhone: form.contactPhone,
    website: form.website,
    imageFileSeq,
    grade: form.grade ?? 'C',
  });

  const validateForm = () => {
    if (!form.name.trim() || !emailValue || !form.userType || !form.status) {
      message.warning('Please fill in all required user fields.');
      return false;
    }

    if (isNew && (!password.trim() || !userIdValue)) {
      message.warning('Please fill in all required fields.');
      return false;
    }

    if (isOrganization && (!form.organizationName?.trim() || !contactEmailValue || !form.orgType)) {
      message.warning('Please fill in all required organization fields.');
      return false;
    }

    if (!EMAIL_REGEXP.value.test(emailValue)) {
      message.warning('Please enter a valid email address.');
      return false;
    }

    if (isOrganization && !EMAIL_REGEXP.value.test(contactEmailValue)) {
      message.warning('Please enter a valid contact email address.');
      return false;
    }

    if (userIdValue && !USER_ID_START_REGEXP.test(userIdValue)) {
      message.warning('User ID must start with an English letter.');
      return false;
    }

    if (userIdValue.length > USER_ID_MAX_LENGTH) {
      message.warning(`User ID can be up to ${USER_ID_MAX_LENGTH} characters.`);
      return false;
    }

    return true;
  };

  const saveUser = async () => {
    setSaving(true);
    try {
      let resolvedImageFileSeq: number | null = isOrganization ? (form.imageFileSeq ?? null) : null;
      if (isOrganization && organizationImageFiles.some((file) => file.iudType)) {
        const fileRes = await callSaveFiles(
          resolvedImageFileSeq,
          0,
          organizationImageFiles,
          UPLOAD_CONTEXT.ORGANIZATION_IMAGE,
        );
        const newSeq = fileRes?.item?.fileSeq;
        if (newSeq) resolvedImageFileSeq = Number(newSeq);
        if (fileRes?.item?.fileList) {
          setOrganizationImageFiles(fileRes.item.fileList as FileDetailType[]);
        }
      }

      if (isNew) {
        await callCreateAdminUser(buildSaveParam(resolvedImageFileSeq));
        message.success('User has been registered.');
        setMode('list');
        await fetchUsers();
      } else {
        await callUpdateAdminUser(selectedSeq!, buildSaveParam(resolvedImageFileSeq));
        message.success('User information has been saved.');
        await fetchUsers();
        await fetchDetail(selectedSeq!);
      }
    } catch (error) {
      message.error(isNew ? 'Failed to register user.' : 'Failed to save user information.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!validateForm()) return;

    modal.confirm({
      title: isNew ? 'Register User' : 'Save User Information',
      content: isNew ? 'Do you want to register this user?' : 'Do you want to save this user information?',
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk: saveUser,
    });
  };

  const confirmAction = (title: string, content: string, action: () => Promise<void>, danger = false) => {
    if (!selectedSeq) return;
    modal.confirm({
      title,
      content,
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      okButtonProps: danger ? { danger: true } : undefined,
      onOk: async () => {
        setSaving(true);
        try {
          await action();
          await fetchUsers();
          await fetchDetail(selectedSeq);
        } catch (error) {
          message.error('Operation failed.');
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleExportExcel = async () => {
    if (!users.length) {
      message.warning('No users to export.');
      return;
    }
    setExporting(true);
    try {
      const detailResults = await Promise.all(
        users.map((u) =>
          callGetAdminUserDetail(u.userSeq)
            .then((res) => res?.item ?? null)
            .catch(() => null),
        ),
      );

      const orgTypeLabel = (value?: string) =>
        ORG_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value ?? '';

      const columns: ExcelColumnDef[] = [
        { headerName: 'User ID', dataIndex: 'userId', width: 18 },
        { headerName: 'Name', dataIndex: 'name', width: 18 },
        { headerName: 'Email', dataIndex: 'email', width: 28 },
        { headerName: 'Position', dataIndex: 'position', width: 18 },
        { headerName: 'User Type', dataIndex: 'userType', width: 14 },
        { headerName: 'Status', dataIndex: 'status', width: 12 },
        { headerName: 'Organization Name', dataIndex: 'organizationName', width: 22 },
        { headerName: 'Org Type', dataIndex: 'orgType', width: 18 },
        { headerName: 'Contact Email', dataIndex: 'contactEmail', width: 26 },
        { headerName: 'Contact Phone', dataIndex: 'contactPhone', width: 16 },
        { headerName: 'Website', dataIndex: 'website', width: 26 },
        { headerName: 'Grade', dataIndex: 'grade', width: 8 },
        { headerName: 'Created At', dataIndex: 'createdAt', width: 20 },
        { headerName: 'Updated At', dataIndex: 'updatedAt', width: 20 },
      ];

      const rows = users.map((u, idx) => {
        const d = detailResults[idx];
        return {
          userId: u.userId ?? '',
          name: u.name ?? '',
          email: u.email ?? '',
          position: u.position ?? d?.position ?? '',
          userType: USER_TYPE_LABEL[u.userType] ?? u.userType,
          status: USER_STATUS_LABEL[u.status] ?? u.status,
          organizationName: u.organizationName ?? d?.organizationName ?? '',
          orgType: orgTypeLabel(u.orgType ?? d?.orgType),
          contactEmail: d?.contactEmail ?? '',
          contactPhone: d?.contactPhone ?? '',
          website: d?.website ?? '',
          grade: d?.grade ?? '',
          createdAt: formatDate(u.createdAt),
          updatedAt: formatDate(u.updatedAt),
        };
      });

      const stamp = new Date().toISOString().slice(0, 10);
      await callExcelDownload(columns, rows, `users_${stamp}`);
    } catch (err) {
      message.error('Failed to download Excel.');
    } finally {
      setExporting(false);
    }
  };

  const handleApprove = () => confirmAction(
    'Approve Registration',
    'Do you want to approve this registration?',
    async () => { await callApproveAdminUser(selectedSeq!); message.success('Registration has been approved.'); },
  );

  const handleSuspend = () => confirmAction(
    'Suspend User',
    'This user will be suspended and cannot access the system. You can reactivate later.',
    async () => { await callSuspendAdminUser(selectedSeq!); message.success('User has been suspended.'); },
    true,
  );

  const handleReactivate = () => confirmAction(
    'Reactivate User',
    'This user will be reactivated and can access the system again.',
    async () => { await callReactivateAdminUser(selectedSeq!); message.success('User has been reactivated.'); },
  );

  const handleWithdraw = () => confirmAction(
    'Withdraw User',
    'This action is irreversible. The user will be permanently withdrawn and removed from the list.',
    async () => { await callWithdrawAdminUser(selectedSeq!); message.success('User has been withdrawn.'); setMode('list'); },
    true,
  );

  if (mode === 'detail') {
    return (
      <div className="saf-screen saf-user-admin-screen">
        <header className="saf-screen-header">
          <div>
            <h1>{isNew ? 'Register User' : (form.name || selectedSummary?.name || 'User Detail')}</h1>
            {!isNew && <p>{form.userId} · {USER_TYPE_LABEL[form.userType]}</p>}
          </div>
          <div className="saf-screen-actions">
            <button type="button" className="saf-action-btn is-secondary" onClick={() => setMode('list')}>
              <ArrowLeftOutlined />
              <span>List</span>
            </button>
            {!isNew && form.status === 'pending' && (
              <button type="button" className="saf-action-btn is-approve" onClick={handleApprove} disabled={saving}>
                <CheckOutlined />
                <span>Approve</span>
              </button>
            )}
            {!isNew && form.status === 'active' && (
              <>
                <button type="button" className="saf-action-btn is-warning" onClick={handleSuspend} disabled={saving}>
                  <PauseCircleOutlined />
                  <span>Suspend</span>
                </button>
                <button type="button" className="saf-action-btn is-danger" onClick={handleWithdraw} disabled={saving}>
                  <StopOutlined />
                  <span>Withdraw</span>
                </button>
              </>
            )}
            {!isNew && form.status === 'suspended' && (
              <>
                <button type="button" className="saf-action-btn is-approve" onClick={handleReactivate} disabled={saving}>
                  <PlayCircleOutlined />
                  <span>Reactivate</span>
                </button>
                <button type="button" className="saf-action-btn is-danger" onClick={handleWithdraw} disabled={saving}>
                  <StopOutlined />
                  <span>Withdraw</span>
                </button>
              </>
            )}
            {(isNew || form.status !== 'pending') && (
              <button type="button" className="saf-action-btn is-primary" onClick={handleSave} disabled={saving}>
                <SaveOutlined />
                <span>{isNew ? 'Register' : 'Save'}</span>
              </button>
            )}
          </div>
        </header>

        <div className="saf-user-detail-grid">
          <section className="saf-panel">
            <PanelTitle title="Account Information" subtitle="Based on the users table." />
            <div className="saf-form-grid">
              <Field label="User ID *" invalid={(isNew && isRequiredEmpty(form.userId)) || isUserIdRuleInvalid}><input value={form.userId} disabled={!isNew} maxLength={USER_ID_MAX_LENGTH} onChange={(e) => updateForm('userId', e.target.value.slice(0, USER_ID_MAX_LENGTH))} placeholder={isNew ? 'Starts with a letter, max 20 characters' : ''} /></Field>
              <Field label="User Type">
                {isNew ? (
                  <select value={form.userType} onChange={(e) => updateForm('userType', e.target.value as AdminUserType)}>
                    <option value="admin">Admin</option>
                    <option value="organization">Organization</option>
                  </select>
                ) : (
                  <input value={USER_TYPE_LABEL[form.userType] ?? form.userType} disabled />
                )}
              </Field>
              <Field label={isNew ? 'Password *' : 'Password'} invalid={isNew && isRequiredEmpty(password)}>
                <PasswordInput
                  value={password}
                  disabled={approvalPending}
                  placeholder={isNew ? 'Enter password' : 'Enter new password to change'}
                  visible={showPassword}
                  onChange={setPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />
              </Field>
              <Field label="Name *" invalid={isRequiredEmpty(form.name)}><input value={form.name} disabled={approvalPending} onChange={(e) => updateForm('name', e.target.value)} /></Field>
              <Field label="Position"><input value={form.position ?? ''} disabled={approvalPending} onChange={(e) => updateForm('position', e.target.value)} /></Field>
              <Field label="Email *" invalid={isRequiredEmpty(form.email) || isEmailRuleInvalid}><input value={form.email} disabled={approvalPending} type="email" onChange={(e) => updateForm('email', e.target.value)} /></Field>
              {!isNew && <Field label="Status"><input value={USER_STATUS_LABEL[form.status] ?? form.status} disabled /></Field>}
            </div>
          </section>

          {isOrganization && (
            <section className="saf-panel">
              <PanelTitle title="Organization Information" subtitle="Based on the organizations table." />
              <div className="saf-form-grid">
                <Field label="Organization Name *" invalid={isOrganization && isRequiredEmpty(form.organizationName)}><input value={form.organizationName ?? ''} disabled={approvalPending} onChange={(e) => updateForm('organizationName', e.target.value)} /></Field>
                <Field label="Organization Type *">
                  <select value={form.orgType ?? 'law_firm'} disabled={approvalPending} onChange={(e) => updateForm('orgType', e.target.value)}>
                    {ORG_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Website"><input value={form.website ?? ''} disabled={approvalPending} onChange={(e) => updateForm('website', e.target.value)} /></Field>
                <Field label="Contact Email *" invalid={(isOrganization && isRequiredEmpty(form.contactEmail)) || isContactEmailRuleInvalid}><input value={form.contactEmail ?? ''} disabled={approvalPending} type="email" onChange={(e) => updateForm('contactEmail', e.target.value)} /></Field>
                <Field label="Contact Phone"><input value={form.contactPhone ?? ''} disabled={approvalPending} onChange={(e) => updateForm('contactPhone', e.target.value)} /></Field>
                <Field label="Grade *">
                  <select
                    value={form.grade ?? 'C'}
                    disabled={approvalPending}
                    onChange={(e) => updateForm('grade', e.target.value as OrganizationGrade)}
                  >
                    {ORGANIZATION_GRADE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Organization Image" wide>
                  <div className="saf-thumbnail-uploader">
                    {loading ? (
                      <div className="saf-image-upload-skeleton" aria-hidden="true" />
                    ) : (
                      <OrganizationImageUpload
                        fileList={organizationImageFiles}
                        onChange={setOrganizationImageFiles}
                        disabled={saving || approvalPending}
                      />
                    )}
                    <p className="saf-hint-inline">1 organization image only (JPG/PNG/GIF/WebP) · max 30MB.</p>
                  </div>
                </Field>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="saf-screen saf-user-admin-screen">
      <header className="saf-screen-header">
        <div>
          <h1>User Management</h1>
          <p>Pending requests are shown first, followed by admins and organizations.</p>
        </div>
        <div className="saf-screen-actions">
          <button
            type="button"
            className="saf-action-btn is-secondary"
            onClick={handleExportExcel}
            disabled={exporting || loading || !users.length}
          >
            <DownloadOutlined />
            <span>{exporting ? 'Exporting...' : 'Download Excel'}</span>
          </button>
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchUsers} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={() => { setForm(emptyDetail); setOrganizationImageFiles([]); setPassword(''); setShowPassword(false); setSubmitAttempted(false); setSelectedSeq(null); setMode('detail'); }}>
            <PlusOutlined />
            <span>Register</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Search by name, ID, email, or organization"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchUsers();
            }}
          />
        </div>
        <select className="saf-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <select className="saf-filter-select" value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">All Types</option>
          <option value="admin">Admin</option>
          <option value="organization">Organization</option>
        </select>
        <button type="button" onClick={fetchUsers}>Search</button>
      </section>

      <section className="saf-table-wrap">
        <table className="saf-table saf-user-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Type</th>
              <th>Name / ID</th>
              <th>Organization</th>
              <th>Email</th>
              <th>Position</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {userPagination.pagedItems.map((user) => (
              <tr key={user.userSeq} onClick={() => fetchDetail(user.userSeq)}>
                <td><StatusBadge status={user.status} /></td>
                <td>{USER_TYPE_LABEL[user.userType]}</td>
                <td>
                  <strong>{user.name}</strong>
                  <span>{user.userId}</span>
                </td>
                <td>{user.organizationName || '-'}</td>
                <td>{user.email}</td>
                <td>{user.position || '-'}</td>
                <td>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan={7} className="saf-user-empty">
                  <TeamOutlined />
                  <span>{loading ? 'Loading...' : 'No users found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination {...userPagination} />
      </section>
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

function Field({ label, children, wide, invalid }: { label: string; children: React.ReactNode; wide?: boolean; invalid?: boolean }) {
  const required = label.endsWith(' *');
  const labelText = required ? label.slice(0, -2) : label;
  return (
    <label className={`saf-form-field ${wide ? 'is-wide' : ''} ${invalid ? 'is-invalid' : ''}`}>
      <span>
        {labelText}
        {required && <em className="saf-required-mark">*</em>}
      </span>
      {children}
    </label>
  );
}

function PasswordInput({
  value,
  disabled,
  placeholder,
  visible,
  onChange,
  onToggle,
}: {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div className="saf-password-input">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        disabled={disabled}
        onClick={onToggle}
      >
        {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const tone = STATUS_TONE[status ?? ''] ?? 'gray';
  const label = USER_STATUS_LABEL[status as AdminUserStatus] ?? status ?? '-';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function formatDate(value?: string) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const IMAGE_MAX_SIZE = 30 * 1024 * 1024;

const getFileUid = (file: FileDetailType) => (
  file.fileDtlSeq ? String(file.fileDtlSeq) : file.uid ?? `${file.fileNm}-${file.sortSeq}`
);

const isBrowserReadableUrl = (url?: string): boolean => {
  if (!url) return false;
  return /^(https?:|data:|blob:|\/api\/|\/_next\/|\/images\/|\/uploads?\/)/i.test(url);
};

const getImagePreviewUrl = (file: Partial<FileDetailType>): string | undefined => {
  const directUrl = file.fileUrl ?? file.filePath;
  if (!directUrl) return undefined;
  if (isBrowserReadableUrl(directUrl)) return directUrl;
  if (file.filePath) return `/api/download-file?filePath=${encodeURIComponent(file.filePath)}`;
  return undefined;
};

const revokeLocalPreview = (file: FileDetailType) => {
  const previewUrl = file.fileUrl ?? file.filePath;
  if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
};

const reindexImageFiles = (files: FileDetailType[]) => {
  let nextSortSeq = 1;
  return files.map((file) => {
    if (file.iudType === IudType.D) return { ...file, sortSeq: 0 };
    return { ...file, sortSeq: nextSortSeq++ };
  });
};

function OrganizationImageUpload({
  fileList,
  onChange,
  disabled,
}: {
  fileList: FileDetailType[];
  onChange: (files: FileDetailType[]) => void;
  disabled?: boolean;
}) {
  const { message } = App.useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const visibleFile = fileList.find((file) => file.iudType !== IudType.D);
  const previewUrl = visibleFile ? getImagePreviewUrl(visibleFile) : undefined;

  const createImageFileDetail = (file: File): FileDetailType | null => {
    const rcFile = file as RcFile;
    if (!rcFile.type?.startsWith('image/')) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return null;
    }

    if (rcFile.size > IMAGE_MAX_SIZE) {
      message.error('Only images up to 30MB can be uploaded.');
      return null;
    }

    rcFile.uid = rcFile.uid ?? `org-image-${Date.now()}`;
    const previewUrl = URL.createObjectURL(rcFile);
    return {
      uid: rcFile.uid,
      fileNm: rcFile.name,
      filePath: previewUrl,
      fileUrl: previewUrl,
      sortSeq: 1,
      originFileObj: rcFile,
      iudType: IudType.I,
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    event.target.value = '';
    if (!nextFile) return;

    const nextImage = createImageFileDetail(nextFile);
    if (!nextImage) return;

    const retainedFiles = fileList.flatMap((file) => {
      if (file.iudType === IudType.D) return [file];
      if (file.iudType === IudType.I) {
        revokeLocalPreview(file);
        return [];
      }
      return [{ ...file, iudType: IudType.D }];
    });

    onChange(reindexImageFiles([...retainedFiles, nextImage]));
  };

  const handleRemove = () => {
    if (!visibleFile) return;

    const nextFiles = fileList.flatMap((file) => {
      if (getFileUid(file) !== getFileUid(visibleFile)) return [file];
      if (file.iudType === IudType.I) {
        revokeLocalPreview(file);
        return [];
      }
      return [{ ...file, iudType: IudType.D }];
    });

    onChange(reindexImageFiles(nextFiles));
  };

  const handlePreview = () => {
    if (!previewUrl) return;
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };

  const openFileDialog = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  useEffect(() => () => {
    for (const file of fileList) {
      if (file.iudType === IudType.I) revokeLocalPreview(file);
    }
  }, []);

  return (
    <>
      <div className="saf-organization-image-upload">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
        {visibleFile && previewUrl ? (
          <div className="saf-organization-image-card">
            <img src={previewUrl} alt="Organization" />
            <div className="saf-organization-image-actions">
              <button type="button" aria-label="Preview image" onClick={handlePreview}>
                <EyeOutlined />
              </button>
              <button type="button" aria-label="Replace image" onClick={openFileDialog} disabled={disabled}>
                <PlusOutlined />
              </button>
              <button type="button" aria-label="Remove image" onClick={handleRemove} disabled={disabled}>
                <DeleteOutlined />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="saf-organization-image-empty"
            onClick={openFileDialog}
            disabled={disabled}
          >
            <PlusOutlined />
            <span>업로드</span>
          </button>
        )}
      </div>
      <Modal
        open={previewOpen}
        title="Organization Image"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Organization preview" src={previewImage} style={{ width: '100%' }} />
      </Modal>
    </>
  );
}
