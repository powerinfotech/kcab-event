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
  callSendEmailCode,
  callVerifyEmailCode,
} from '@api/saf/SafAuthApi';
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

const EMAIL_VERIFY_SECONDS = 10 * 60;

const normalizeEmail = (email?: string) => (email ?? '').trim().toLowerCase();

const formatRemaining = (totalSec: number) => {
  if (totalSec <= 0) return 'Expired';
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
  const [originalEmail, setOriginalEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(true);
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [emailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [emailCodeVerifying, setEmailCodeVerifying] = useState(false);
  const [emailExpiresAt, setEmailExpiresAt] = useState<number | null>(null);
  const [emailRemainingSec, setEmailRemainingSec] = useState(0);

  const isOrganization = form.userType === 'organization';
  const emailValue = form.email.trim();
  const normalizedEmailValue = normalizeEmail(form.email);
  const emailChanged = !!form.userSeq && normalizedEmailValue !== originalEmail;
  const isVerifiedChangedEmail = emailChanged && emailVerified;
  const emailFieldLocked = emailVerifyOpen || isVerifiedChangedEmail;
  const emailActionButtonDisabled = emailCodeSending || (!emailChanged && !emailVerifyOpen);
  const emailActionButtonLabel = emailCodeSending
    ? 'Sending...'
    : emailVerifyOpen || isVerifiedChangedEmail
      ? 'Change Email'
      : emailChanged
        ? 'Verify Email'
        : 'Verified';
  const contactEmailValue = form.contactEmail?.trim() ?? '';
  const isRequiredEmpty = (value?: string) => submitAttempted && !value?.trim();
  const isEmailRuleInvalid = submitAttempted && !!emailValue && !EMAIL_REGEXP.value.test(emailValue);
  const isEmailVerificationInvalid = submitAttempted && emailChanged && !emailVerified;
  const isContactEmailRuleInvalid = submitAttempted
    && isOrganization
    && !!contactEmailValue
    && !EMAIL_REGEXP.value.test(contactEmailValue);

  const updateForm = <K extends keyof AdminUserDetail>(key: K, value: AdminUserDetail[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetEmailVerification = (verified = false) => {
    setEmailVerified(verified);
    setEmailVerifyOpen(false);
    setEmailExpiresAt(null);
    setEmailRemainingSec(0);
    setEmailCodeInput('');
  };

  const handleEmailChange = (value: string) => {
    setForm((prev) => ({ ...prev, email: value }));
    resetEmailVerification(normalizeEmail(value) === originalEmail);
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
      const nextForm = { ...emptyDetail, ...detailRes.item };
      setForm(nextForm);
      setOriginalEmail(normalizeEmail(nextForm.email));
      resetEmailVerification(true);
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

  useEffect(() => {
    if (!emailExpiresAt || (!emailVerifyOpen && !isVerifiedChangedEmail)) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((emailExpiresAt - Date.now()) / 1000));
      setEmailRemainingSec(remaining);
      if (remaining <= 0) {
        resetEmailVerification(false);
        message.warning('Email verification has expired. Please request a new code.');
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [emailVerifyOpen, emailExpiresAt, isVerifiedChangedEmail, message]);

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

    if (emailChanged && !emailVerified) {
      message.warning('Please verify the new account email before saving.');
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

  const handleEmailButtonClick = async () => {
    if (emailVerifyOpen || (emailChanged && emailVerified)) {
      resetEmailVerification(false);
      return;
    }

    if (!emailChanged) {
      message.info('Change the account email first.');
      return;
    }

    if (!emailValue) {
      message.warning('Please enter an email first.');
      return;
    }

    if (!EMAIL_REGEXP.value.test(emailValue)) {
      message.warning('Please enter a valid email address.');
      return;
    }

    setEmailCodeSending(true);
    try {
      const res = await callSendEmailCode(emailValue);
      if (res?.code === 200) {
        setEmailVerifyOpen(true);
        setEmailExpiresAt(Date.now() + EMAIL_VERIFY_SECONDS * 1000);
        setEmailRemainingSec(EMAIL_VERIFY_SECONDS);
        setEmailCodeInput('');
        message.success('Verification code sent. Please enter it within 10 minutes.');
      }
    } finally {
      setEmailCodeSending(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    const code = emailCodeInput.trim();

    if (!/^\d{6}$/.test(code)) {
      message.warning('Please enter the 6-digit verification code.');
      return;
    }

    setEmailCodeVerifying(true);
    try {
      const res = await callVerifyEmailCode(emailValue, code);
      if (res?.code === 200) {
        message.success('Email verified. This email is locked until you choose Change Email.');
        setEmailVerified(true);
        setEmailVerifyOpen(false);
        setEmailCodeInput('');
      }
    } finally {
      setEmailCodeVerifying(false);
    }
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
            <Field label="Email *" invalid={isRequiredEmpty(form.email) || isEmailRuleInvalid || isEmailVerificationInvalid}>
              <div className="saf-input-action">
                <input
                  value={form.email}
                  type="email"
                  disabled={emailFieldLocked}
                  onChange={(event) => handleEmailChange(event.target.value)}
                />
                <button
                  type="button"
                  className={`saf-check-btn${emailVerifyOpen || isVerifiedChangedEmail || !emailChanged ? ' is-checked' : ''}`}
                  onClick={handleEmailButtonClick}
                  disabled={emailActionButtonDisabled}
                >
                  {emailActionButtonLabel}
                </button>
              </div>
              {emailChanged && !emailVerifyOpen && !emailVerified && (
                <p className="saf-verify-hint">Please verify this email before saving.</p>
              )}
              {isVerifiedChangedEmail && (
                <p className="saf-verify-hint">
                  Email verified. Save is available for {formatRemaining(emailRemainingSec)}.
                </p>
              )}
            </Field>
            {emailVerifyOpen && (
              <div className="saf-verify-form is-wide">
                <div className="saf-verify-row">
                  <input
                    value={emailCodeInput}
                    onChange={(event) => setEmailCodeInput(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    inputMode="numeric"
                    maxLength={6}
                  />
                  <span className={`saf-verify-timer${emailRemainingSec <= 0 ? ' is-expired' : ''}`}>
                    {formatRemaining(emailRemainingSec)}
                  </span>
                  <button
                    type="button"
                    className="saf-verify-btn"
                    onClick={handleVerifyEmailCode}
                    disabled={emailCodeVerifying || emailRemainingSec <= 0}
                  >
                    {emailCodeVerifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                <p className="saf-verify-hint">
                  A verification code has been sent to your email. Please enter it within 10 minutes.
                </p>
              </div>
            )}
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
