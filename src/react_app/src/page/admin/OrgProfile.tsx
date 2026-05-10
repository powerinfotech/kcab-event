'use client';

import React, { useEffect, useState } from 'react';
import { App } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { getUserLoginInfo } from '@api/CommonApi';
import {
  callGetAdminUserDetail,
  callUpdateAdminUser,
} from '@api/admin/AdminUserManagementApi';
import {
  AdminUserDetail,
  AdminUserSaveParam,
  AdminUserStatus,
  AdminUserType,
} from '@interface/admin/AdminUserManagement';
import { ORG_TYPE_OPTIONS } from '@interface/saf/SafAuth';
import { EMAIL_REGEXP } from '@util/validationPatterns';

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
  website: '',
};

export default function OrgProfile() {
  const { message, modal } = App.useApp();
  const [form, setForm] = useState<AdminUserDetail>(emptyDetail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isOrganization = form.userType === 'organization';
  const emailValue = form.email.trim();
  const contactEmailValue = form.contactEmail?.trim() ?? '';
  const isRequiredEmpty = (value?: string) => submitAttempted && !value?.trim();
  const isEmailRuleInvalid = submitAttempted && !!emailValue && !EMAIL_REGEXP.value.test(emailValue);
  const isContactEmailRuleInvalid = submitAttempted
    && isOrganization
    && !!contactEmailValue
    && !EMAIL_REGEXP.value.test(contactEmailValue);

  const updateForm = <K extends keyof AdminUserDetail>(key: K, value: AdminUserDetail[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const loginRes = await getUserLoginInfo();
      if (!loginRes.item?.userSeq) {
        message.error('Failed to load login information.');
        return;
      }

      const detailRes = await callGetAdminUserDetail(loginRes.item.userSeq);
      setForm({ ...emptyDetail, ...detailRes.item });
      setPassword('');
      setShowPassword(false);
      setSubmitAttempted(false);
    } catch (error) {
      message.error('Failed to load profile information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const buildSaveParam = (): AdminUserSaveParam => ({
    userId: form.userId?.trim(),
    email: emailValue,
    password: password || undefined,
    name: form.name,
    position: form.position,
    userType: form.userType,
    status: form.status,
    organizationSeq: form.organizationSeq,
    organizationName: form.organizationName,
    orgType: form.orgType,
    representativeName: form.representativeName,
    contactEmail: contactEmailValue,
    contactPhone: form.contactPhone,
    website: form.website,
  });

  const validateForm = () => {
    if (!form.name.trim() || !emailValue || !form.userType || !form.status) {
      message.warning('Please fill in all required user fields.');
      return false;
    }

    if (!EMAIL_REGEXP.value.test(emailValue)) {
      message.warning('Please enter a valid email address.');
      return false;
    }

    if (isOrganization && (!form.organizationName?.trim() || !contactEmailValue || !form.orgType)) {
      message.warning('Please fill in all required organization fields.');
      return false;
    }

    if (isOrganization && !EMAIL_REGEXP.value.test(contactEmailValue)) {
      message.warning('Please enter a valid contact email address.');
      return false;
    }

    return true;
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await callUpdateAdminUser(form.userSeq, buildSaveParam());
      message.success('Profile information has been saved.');
      await fetchProfile();
    } catch (error) {
      message.error('Failed to save profile information.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!validateForm()) return;

    modal.confirm({
      title: 'Save Profile Information',
      content: 'Do you want to save this profile information?',
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk: saveProfile,
    });
  };

  return (
    <div className="saf-screen saf-user-admin-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Organization Profile</h1>
          <p>Manage your account and organization information.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchProfile} disabled={loading || saving}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={handleSave} disabled={loading || saving}>
            <SaveOutlined />
            <span>Save</span>
          </button>
        </div>
      </header>

      <div className="saf-user-detail-grid">
        <section className="saf-panel">
          <PanelTitle title="Account Information" subtitle="Based on the users table." />
          <div className="saf-form-grid">
            <Field label="User ID *">
              <input value={form.userId} disabled />
            </Field>
            <Field label="User Type">
              <input value={USER_TYPE_LABEL[form.userType] ?? form.userType} disabled />
            </Field>
            <Field label="Password">
              <PasswordInput
                value={password}
                placeholder="Enter new password to change"
                visible={showPassword}
                onChange={setPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />
            </Field>
            <Field label="Name *" invalid={isRequiredEmpty(form.name)}>
              <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
            </Field>
            <Field label="Position">
              <input value={form.position ?? ''} onChange={(event) => updateForm('position', event.target.value)} />
            </Field>
            <Field label="Email *" invalid={isRequiredEmpty(form.email) || isEmailRuleInvalid}>
              <input value={form.email} type="email" onChange={(event) => updateForm('email', event.target.value)} />
            </Field>
            <Field label="Status">
              <input value={USER_STATUS_LABEL[form.status] ?? form.status} disabled />
            </Field>
          </div>
        </section>

        {isOrganization && (
          <section className="saf-panel">
            <PanelTitle title="Organization Information" subtitle="Based on the organizations table." />
            <div className="saf-form-grid">
              <Field label="Organization Name *" invalid={isRequiredEmpty(form.organizationName)}>
                <input
                  value={form.organizationName ?? ''}
                  onChange={(event) => updateForm('organizationName', event.target.value)}
                />
              </Field>
              <Field label="Organization Type *">
                <select
                  value={form.orgType ?? 'law_firm'}
                  onChange={(event) => updateForm('orgType', event.target.value)}
                >
                  {ORG_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Representative">
                <input
                  value={form.representativeName ?? ''}
                  onChange={(event) => updateForm('representativeName', event.target.value)}
                />
              </Field>
              <Field label="Contact Email *" invalid={isRequiredEmpty(form.contactEmail) || isContactEmailRuleInvalid}>
                <input
                  value={form.contactEmail ?? ''}
                  type="email"
                  onChange={(event) => updateForm('contactEmail', event.target.value)}
                />
              </Field>
              <Field label="Contact Phone">
                <input
                  value={form.contactPhone ?? ''}
                  onChange={(event) => updateForm('contactPhone', event.target.value)}
                />
              </Field>
              <Field label="Website">
                <input
                  value={form.website ?? ''}
                  onChange={(event) => updateForm('website', event.target.value)}
                />
              </Field>
            </div>
          </section>
        )}
      </div>
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

function Field({
  label,
  children,
  wide,
  invalid,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  invalid?: boolean;
}) {
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
  placeholder,
  visible,
  onChange,
  onToggle,
}: {
  value: string;
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
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={onToggle}
      >
        {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      </button>
    </div>
  );
}
