'use client';

import React, { useState } from 'react';
import { message } from 'antd';
import { callSignup } from '@api/saf/SafAuthApi';
import { ORG_TYPE_OPTIONS, SignupRequest } from '@interface/saf/SafAuth';

const initialForm: SignupRequest & {
  passwordConfirm: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
} = {
  orgName: '',
  businessNumber: '',
  orgType: 'law_firm',
  contactEmail: '',
  name: '',
  userId: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  representativeName: '',
  contactPhone: '',
  address: '',
  website: '',
  agreeTerms: true,
  agreePrivacy: true,
  agreeMarketing: false,
};

const SafSignup: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAll = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    }));
  };

  const handleSubmit = async () => {
    if (!form.orgName || !form.businessNumber || !form.contactEmail || !form.name || !form.userId || !form.email || !form.password) {
      message.warning('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      message.warning('Password confirmation does not match.');
      return;
    }
    if (!form.agreeTerms || !form.agreePrivacy) {
      message.warning('Please agree to the required terms.');
      return;
    }

    setLoading(true);
    try {
      const { passwordConfirm, agreeTerms, agreePrivacy, agreeMarketing, ...payload } = form;
      const res = await callSignup(payload);
      if (res?.code === 200) {
        message.success('Your sign-up request has been submitted. You can sign in after administrator approval.');
        window.location.href = '/login';
      } else {
        message.error(res?.message || 'Sign-up request failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="saf-signup-page">
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
            <Field label="Organization Name *">
              <input value={form.orgName} onChange={(e) => set('orgName', e.target.value)} placeholder="e.g. ABC Law LLC" />
            </Field>
            <Field label="Business Registration Number *">
              <input value={form.businessNumber} onChange={(e) => set('businessNumber', e.target.value)} placeholder="123-45-67890" />
            </Field>
            <Field label="Organization Type *">
              <select value={form.orgType} onChange={(e) => set('orgType', e.target.value)}>
                {ORG_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Primary Email *">
              <input value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="contact@abc.law" type="email" />
            </Field>
          </section>

          <section className="saf-signup-panel">
            <StepLabel step="STEP 2" title="Applicant Information" meta="users + organization_members" />
            <Field label="Name *">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Minsoo Kim" />
            </Field>
            <Field label="User ID *">
              <input value={form.userId} onChange={(e) => set('userId', e.target.value)} placeholder="Letters and numbers, 4-20 characters" />
            </Field>
            <Field label="Email *">
              <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="kim@abc.law" type="email" />
            </Field>
            <Field label="Password *">
              <input value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="At least 8 characters" type="password" />
            </Field>
            <Field label="Confirm Password *">
              <input value={form.passwordConfirm} onChange={(e) => set('passwordConfirm', e.target.value)} placeholder="Enter the same password" type="password" />
            </Field>
          </section>

          <aside className="saf-signup-side">
            <section className="saf-signup-panel">
              <StepLabel step="STEP 3" title="Agreements" />
              <Agreement
                label="Agree to all"
                checked={form.agreeTerms && form.agreePrivacy && form.agreeMarketing}
                onChange={toggleAll}
                strong
              />
              <Agreement label="Terms of Service (Required)" checked={form.agreeTerms} onChange={(v) => set('agreeTerms', v)} />
              <Agreement label="Collection and Use of Personal Information (Required)" checked={form.agreePrivacy} onChange={(v) => set('agreePrivacy', v)} />
              <Agreement label="Marketing Updates (Optional)" checked={form.agreeMarketing} onChange={(v) => set('agreeMarketing', v)} />
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="saf-signup-field">
    <span>{label}</span>
    {children}
  </label>
);

const Agreement = ({
  label,
  checked,
  onChange,
  strong,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  strong?: boolean;
}) => (
  <label className={`saf-agreement ${strong ? 'is-strong' : ''}`}>
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span>{label}</span>
    {!strong && <button type="button">View</button>}
  </label>
);

export default SafSignup;
