'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  StopOutlined,
  TeamOutlined,
} from '@ant-design/icons';
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
import {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserSaveParam,
  AdminUserStatus,
  AdminUserType,
} from '@interface/admin/AdminUserManagement';
import { ORG_TYPE_OPTIONS } from '@interface/saf/SafAuth';

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
  representativeName: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  website: '',
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
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isRequiredEmpty = (value?: string) => submitAttempted && !value?.trim();

  const selectedSummary = useMemo(
    () => users.find((user) => user.userSeq === selectedSeq),
    [selectedSeq, users],
  );

  const isNew = selectedSeq === null;
  const approvalPending = !isNew && form.status === 'pending';
  const isOrganization = form.userType === 'organization';

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
      setForm({ ...emptyDetail, ...res.item });
      setPassword('');
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

  const buildSaveParam = (): AdminUserSaveParam => ({
    userId: form.userId,
    email: form.email,
    password: password || undefined,
    name: form.name,
    position: form.position,
    userType: form.userType,
    status: form.status,
    organizationSeq: form.organizationSeq,
    organizationName: form.organizationName,
    orgType: form.orgType,
    representativeName: form.representativeName,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone,
    address: form.address,
    website: form.website,
  });

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.userType || !form.status) {
      message.warning('Please fill in all required user fields.');
      return false;
    }

    if (isOrganization && (!form.organizationName?.trim() || !form.contactEmail?.trim() || !form.orgType)) {
      message.warning('Please fill in all required organization fields.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    setSubmitAttempted(true);
    if (!validateForm()) return;
    if (isNew && (!password.trim() || !form.userId?.trim())) {
      message.warning('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await callCreateAdminUser(buildSaveParam());
        message.success('User has been registered.');
        setMode('list');
        await fetchUsers();
      } else {
        await callUpdateAdminUser(selectedSeq!, buildSaveParam());
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
              <Field label="User ID *" invalid={isNew && isRequiredEmpty(form.userId)}><input value={form.userId} disabled={!isNew} onChange={(e) => updateForm('userId', e.target.value)} placeholder={isNew ? 'Enter user ID' : ''} /></Field>
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
              <Field label={isNew ? 'Password *' : 'Password'} invalid={isNew && isRequiredEmpty(password)}><input type="password" value={password} disabled={approvalPending} placeholder={isNew ? 'Enter password' : 'Enter new password to change'} onChange={(e) => setPassword(e.target.value)} /></Field>
              <Field label="Name *" invalid={isRequiredEmpty(form.name)}><input value={form.name} disabled={approvalPending} onChange={(e) => updateForm('name', e.target.value)} /></Field>
              <Field label="Position"><input value={form.position ?? ''} disabled={approvalPending} onChange={(e) => updateForm('position', e.target.value)} /></Field>
              <Field label="Email *" invalid={isRequiredEmpty(form.email)}><input value={form.email} disabled={approvalPending} onChange={(e) => updateForm('email', e.target.value)} /></Field>
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
                <Field label="Representative"><input value={form.representativeName ?? ''} disabled={approvalPending} onChange={(e) => updateForm('representativeName', e.target.value)} /></Field>
                <Field label="Contact Email *" invalid={isOrganization && isRequiredEmpty(form.contactEmail)}><input value={form.contactEmail ?? ''} disabled={approvalPending} onChange={(e) => updateForm('contactEmail', e.target.value)} /></Field>
                <Field label="Contact Phone"><input value={form.contactPhone ?? ''} disabled={approvalPending} onChange={(e) => updateForm('contactPhone', e.target.value)} /></Field>
                <Field label="Website"><input value={form.website ?? ''} disabled={approvalPending} onChange={(e) => updateForm('website', e.target.value)} /></Field>
                <Field label="Address" wide><input value={form.address ?? ''} disabled={approvalPending} onChange={(e) => updateForm('address', e.target.value)} /></Field>
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
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchUsers} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={() => { setForm(emptyDetail); setPassword(''); setSubmitAttempted(false); setSelectedSeq(null); setMode('detail'); }}>
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
            {users.map((user) => (
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
        <div className="saf-table-footer">{users.length} record(s)</div>
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
