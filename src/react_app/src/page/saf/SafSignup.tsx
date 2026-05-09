'use client';

import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { callSignup } from '@api/saf/SafAuthApi';
import { ORG_TYPE_OPTIONS, SignupRequest } from '@interface/saf/SafAuth';

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
  address: '',
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

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isRequiredEmpty = (value?: string) => submitAttempted && !value?.trim();

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
    if (form.password !== form.passwordConfirm) {
      messageApi.error('Password and Confirm Password do not match.');
      return;
    }
    if (!form.agreePrivacy) {
      messageApi.warning('Please agree to the privacy policy.');
      return;
    }

    setLoading(true);
    try {
      const { passwordConfirm, agreePrivacy, ...payload } = form;
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
            <Field label="Primary Email *" invalid={isRequiredEmpty(form.contactEmail)}>
              <input value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="contact@abc.law" type="email" />
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
            <Field label="User ID *" invalid={isRequiredEmpty(form.userId)}>
              <input value={form.userId} onChange={(e) => set('userId', e.target.value)} placeholder="Letters and numbers, 4-20 characters" />
            </Field>
            <Field label="Email *" invalid={isRequiredEmpty(form.email)}>
              <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="kim@abc.law" type="email" />
            </Field>
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
