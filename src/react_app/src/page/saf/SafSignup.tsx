'use client';

import React, { useEffect, useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import {
  callCheckUserId,
  callSendEmailCode,
  callSignup,
  callVerifyEmailCode,
} from '@api/saf/SafAuthApi';
import { ORG_TYPE_OPTIONS, SignupRequest } from '@interface/saf/SafAuth';
import { EMAIL_REGEXP } from '@util/validationPatterns';

const USER_ID_MAX_LENGTH = 20;
const USER_ID_START_REGEXP = /^[A-Za-z]/;

const formatRemaining = (totalSec: number) => {
  if (totalSec <= 0) return 'Expired';
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const initialForm: SignupRequest & {
  passwordConfirm: string;
  agreePrivacy: boolean;
} = {
  orgName: '',
  orgType: 'law_firm',
  contactEmail: '',
  name: '',
  userId: '',
  email: '',
  position: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  representativeName: '',
  contactPhone: '',
  website: '',
  agreePrivacy: true,
};

const SafSignup: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [userIdChecked, setUserIdChecked] = useState(false);
  const [userIdChecking, setUserIdChecking] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [emailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [emailCodeVerifying, setEmailCodeVerifying] = useState(false);
  const [emailExpiresAt, setEmailExpiresAt] = useState<number | null>(null);
  const [emailRemainingSec, setEmailRemainingSec] = useState(0);

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserIdChange = (value: string) => {
    set('userId', value.slice(0, USER_ID_MAX_LENGTH));
    if (userIdChecked) setUserIdChecked(false);
  };

  const resetEmailVerification = () => {
    setEmailChecked(false);
    setEmailVerifyOpen(false);
    setEmailExpiresAt(null);
    setEmailRemainingSec(0);
    setEmailCodeInput('');
  };

  const handleEmailChange = (value: string) => {
    set('email', value);
  };

  const isRequiredEmpty = (value?: string) => submitAttempted && !value?.trim();
  const userIdValue = form.userId.trim();
  const contactEmailValue = form.contactEmail.trim();
  const emailValue = form.email.trim();
  const isUserIdRuleInvalid = submitAttempted
    && !!userIdValue
    && (!USER_ID_START_REGEXP.test(userIdValue) || userIdValue.length > USER_ID_MAX_LENGTH);
  const isContactEmailRuleInvalid = submitAttempted
    && !!contactEmailValue
    && !EMAIL_REGEXP.value.test(contactEmailValue);
  const isEmailRuleInvalid = submitAttempted
    && !!emailValue
    && !EMAIL_REGEXP.value.test(emailValue);

  const handleCheckUserId = async () => {
    if (userIdChecked) {
      setUserIdChecked(false);
      return;
    }
    if (!userIdValue) {
      messageApi.warning('Please enter a user ID first.');
      return;
    }
    if (!USER_ID_START_REGEXP.test(userIdValue)) {
      messageApi.warning('User ID must start with an English letter.');
      return;
    }
    if (userIdValue.length > USER_ID_MAX_LENGTH) {
      messageApi.warning(`User ID can be up to ${USER_ID_MAX_LENGTH} characters.`);
      return;
    }
    setUserIdChecking(true);
    try {
      const res = await callCheckUserId(userIdValue);
      if (res?.item?.exists === true) {
        messageApi.error('This user ID is already in use.');
        setUserIdChecked(false);
      } else if (res?.item?.exists === false) {
        messageApi.success('This user ID is available.');
        setUserIdChecked(true);
      } else {
        messageApi.error(res?.message || 'Failed to check user ID.');
      }
    } finally {
      setUserIdChecking(false);
    }
  };

  const handleEmailButtonClick = async () => {
    if (emailChecked || emailVerifyOpen) {
      resetEmailVerification();
      return;
    }
    if (!emailValue) {
      messageApi.warning('Please enter an email first.');
      return;
    }
    if (!EMAIL_REGEXP.value.test(emailValue)) {
      messageApi.warning('Please enter a valid email address.');
      return;
    }
    setEmailCodeSending(true);
    try {
      const res = await callSendEmailCode(emailValue);
      if (res?.code === 200) {
        const expiresAt = Date.now() + 10 * 60 * 1000;
        setEmailVerifyOpen(true);
        setEmailExpiresAt(expiresAt);
        setEmailRemainingSec(600);
        setEmailCodeInput('');
        messageApi.success('Verification code sent. Please enter it within 10 minutes.');
      }
    } finally {
      setEmailCodeSending(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    const code = emailCodeInput.trim();
    if (!/^\d{6}$/.test(code)) {
      messageApi.warning('Please enter the 6-digit verification code.');
      return;
    }
    setEmailCodeVerifying(true);
    try {
      const res = await callVerifyEmailCode(emailValue, code);
      if (res?.code === 200) {
        messageApi.success('Email verified.');
        setEmailChecked(true);
        setEmailVerifyOpen(false);
        setEmailExpiresAt(null);
        setEmailRemainingSec(0);
        setEmailCodeInput('');
      }
    } finally {
      setEmailCodeVerifying(false);
    }
  };

  useEffect(() => {
    if (!emailVerifyOpen || !emailExpiresAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((emailExpiresAt - Date.now()) / 1000));
      setEmailRemainingSec(remaining);
      if (remaining <= 0) {
        setEmailVerifyOpen(false);
        setEmailExpiresAt(null);
        setEmailCodeInput('');
        messageApi.warning('Verification code has expired. Please request a new one.');
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [emailVerifyOpen, emailExpiresAt, messageApi]);

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (
      !form.orgName?.trim()
      || !form.orgType?.trim()
      || !form.contactEmail?.trim()
      || !form.name?.trim()
      || !form.userId?.trim()
      || !form.email?.trim()
      || !form.password?.trim()
      || !form.passwordConfirm?.trim()
    ) {
      messageApi.warning('Please fill in all required fields.');
      return;
    }
    if (!USER_ID_START_REGEXP.test(userIdValue)) {
      messageApi.warning('User ID must start with an English letter.');
      return;
    }
    if (userIdValue.length > USER_ID_MAX_LENGTH) {
      messageApi.warning(`User ID can be up to ${USER_ID_MAX_LENGTH} characters.`);
      return;
    }
    if (!EMAIL_REGEXP.value.test(contactEmailValue)) {
      messageApi.warning('Please enter a valid contact email address.');
      return;
    }
    if (!EMAIL_REGEXP.value.test(emailValue)) {
      messageApi.warning('Please enter a valid email address.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      messageApi.error('Password and Confirm Password do not match.');
      return;
    }
    if (!userIdChecked) {
      messageApi.warning('Please run the user ID duplicate check first.');
      return;
    }
    if (!emailChecked) {
      messageApi.warning('Please run the email duplicate check first.');
      return;
    }
    if (!form.agreePrivacy) {
      messageApi.warning('Please agree to the privacy policy.');
      return;
    }

    setLoading(true);
    try {
      const { passwordConfirm, agreePrivacy, ...payload } = {
        ...form,
        orgName: form.orgName.trim(),
        userId: userIdValue,
        name: form.name.trim(),
        representativeName: form.representativeName?.trim(),
        contactEmail: contactEmailValue,
        contactPhone: form.contactPhone?.trim(),
        email: emailValue,
        position: form.position?.trim(),
        website: form.website?.trim(),
      };
      const res = await callSignup(payload);
      if (res?.code === 200) {
        messageApi.success('Your sign-up request has been submitted. You can sign in after administrator approval.');
        window.location.href = '/login';
      } else {
        messageApi.error(res?.message || 'Sign-up request failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="saf-signup-page">
      {contextHolder}
      <section className="saf-signup-shell">
        <header className="saf-signup-top">
          <div>
            <p>Account Request</p>
            <h1>Organization Sign-up</h1>
            <span>Register your organization and primary contact to create event programs.</span>
          </div>
          <button type="button" onClick={() => { window.location.href = '/login'; }}>
            Already have an account? Sign in
          </button>
        </header>

        <div className="saf-signup-grid">
          <section className="saf-signup-panel">
            <StepLabel step="STEP 1" title="Organization Information" meta="organizations" />
            <Field label="Organization Name *" invalid={isRequiredEmpty(form.orgName)}>
              <input value={form.orgName} onChange={(e) => set('orgName', e.target.value)} placeholder="e.g. ABC Law LLC" />
            </Field>
            <Field label="Organization Type *" invalid={isRequiredEmpty(form.orgType)}>
              <select value={form.orgType} onChange={(e) => set('orgType', e.target.value)}>
                {ORG_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Representative">
              <input value={form.representativeName} onChange={(e) => set('representativeName', e.target.value)} placeholder="e.g. Minsoo Kim" />
            </Field>
            <Field label="Contact Email *" invalid={isRequiredEmpty(form.contactEmail) || isContactEmailRuleInvalid}>
              <input value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="contact@abc.law" type="email" />
            </Field>
            <Field label="Contact Phone">
              <input value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="e.g. 02-1234-5678" />
            </Field>
            <Field label="Website">
              <input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://example.com" />
            </Field>
          </section>

          <section className="saf-signup-panel">
            <StepLabel step="STEP 2" title="Applicant Information" meta="users + organization_members" />
            <Field label="Name *" invalid={isRequiredEmpty(form.name)}>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Minsoo Kim" />
            </Field>
            <Field label="Position">
              <input value={form.position} onChange={(e) => set('position', e.target.value)} placeholder="e.g. Partner" />
            </Field>
            <Field label="User ID *" invalid={isRequiredEmpty(form.userId) || isUserIdRuleInvalid}>
              <div className="saf-input-action">
                <input
                  value={form.userId}
                  maxLength={USER_ID_MAX_LENGTH}
                  onChange={(e) => handleUserIdChange(e.target.value)}
                  placeholder="Starts with a letter, max 20 characters"
                  readOnly={userIdChecked}
                />
                <button
                  type="button"
                  className={`saf-check-btn${userIdChecked ? ' is-checked' : ''}`}
                  onClick={handleCheckUserId}
                  disabled={userIdChecking}
                >
                  {userIdChecking ? 'Checking...' : userIdChecked ? 'Change ID' : 'Check Duplicate'}
                </button>
              </div>
            </Field>
            <Field label="Email *" invalid={isRequiredEmpty(form.email) || isEmailRuleInvalid}>
              <div className="saf-input-action">
                <input
                  value={form.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="kim@abc.law"
                  type="email"
                  readOnly={emailChecked || emailVerifyOpen}
                />
                <button
                  type="button"
                  className={`saf-check-btn${emailChecked || emailVerifyOpen ? ' is-checked' : ''}`}
                  onClick={handleEmailButtonClick}
                  disabled={emailCodeSending}
                >
                  {emailCodeSending
                    ? 'Sending...'
                    : emailChecked || emailVerifyOpen
                      ? 'Change Email'
                      : 'Verify Email'}
                </button>
              </div>
            </Field>
            {emailVerifyOpen && (
              <div className="saf-verify-form">
                <div className="saf-verify-row">
                  <input
                    value={emailCodeInput}
                    onChange={(e) => setEmailCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
            <Field label="Password *" invalid={isRequiredEmpty(form.password)}>
              <PasswordInput
                value={form.password}
                onChange={(value) => set('password', value)}
                placeholder="At least 8 characters"
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                label="password"
              />
            </Field>
            <Field label="Confirm Password *" invalid={isRequiredEmpty(form.passwordConfirm)}>
              <PasswordInput
                value={form.passwordConfirm}
                onChange={(value) => set('passwordConfirm', value)}
                placeholder="Enter the same password"
                visible={showPasswordConfirm}
                onToggle={() => setShowPasswordConfirm((prev) => !prev)}
                label="confirm password"
              />
            </Field>
          </section>

          <aside className="saf-signup-side">
            <section className="saf-signup-panel">
              <StepLabel step="STEP 3" title="Agreements" />
              <Agreement
                label="Privacy Consent (Required)"
                checked={form.agreePrivacy}
                onChange={(v) => set('agreePrivacy', v)}
                onView={() => setPrivacyOpen(true)}
              />
              <button className="saf-signup-submit" type="button" disabled={loading} onClick={handleSubmit}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </section>

            <section className="saf-signup-process">
              <h2>Sign-up Process</h2>
              <ol>
                <li>Enter information and submit</li>
                <li>Administrator review (1-2 days)</li>
                <li>Receive approval email</li>
                <li>Sign in and create event programs</li>
              </ol>
            </section>
          </aside>
        </div>
      </section>

      <Modal
        title="Consent to collect, use, and provide personal information"
        open={privacyOpen}
        onCancel={() => setPrivacyOpen(false)}
        footer={null}
        width={760}
        className="saf-privacy-modal"
        destroyOnHidden
      >
        <div className="saf-privacy-consent">
          <p className="saf-privacy-consent__body">
            By completing this application form, you agree to KCAB using any of your personal information that you may
            have provided in this application for the purpose of assessment of panel listing, background and reference
            checks, future appointments in any arbitrations handled by KCAB, and listing your curriculum vitae on KCAB's
            website, in accordance with Korean Data Protection Act.
          </p>
        </div>
      </Modal>
    </main>
  );
};

const StepLabel = ({ step, title, meta }: { step: string; title: string; meta?: string }) => (
  <div className="saf-step-label">
    <span>{step}</span>
    <strong>{title}</strong>
    {meta && <em>{meta}</em>}
  </div>
);

const Field = ({
  label,
  children,
  invalid,
}: {
  label: string;
  children: React.ReactNode;
  invalid?: boolean;
}) => {
  const required = label.endsWith(' *');
  const labelText = required ? label.slice(0, -2) : label;

  return (
    <label className={`saf-signup-field ${invalid ? 'is-invalid' : ''}`}>
      <span>
        {labelText}
        {required && <em className="saf-required-mark">*</em>}
      </span>
      {children}
    </label>
  );
};

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
  label,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <div className="saf-password-input">
    <input
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={visible ? 'text' : 'password'}
    />
    <button
      type="button"
      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
      onClick={onToggle}
    >
      {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
    </button>
  </div>
);

const Agreement = ({
  label,
  checked,
  onChange,
  strong,
  showView = true,
  onView,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  strong?: boolean;
  showView?: boolean;
  onView?: () => void;
}) => (
  <label className={`saf-agreement ${strong ? 'is-strong' : ''}`}>
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span>{label}</span>
    {!strong && showView && (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onView?.();
        }}
      >
        View
      </button>
    )}
  </label>
);

export default SafSignup;
