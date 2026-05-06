'use client';

import React, { useState } from 'react';
import { message } from 'antd';
import { callSignup } from '@api/saf/SafAuthApi';
import { SignupRequest } from '@interface/saf/SafAuth';

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
  language: 'ko',
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
      message.warning('필수 항목을 입력해 주세요.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      message.warning('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (!form.agreeTerms || !form.agreePrivacy) {
      message.warning('필수 약관에 동의해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const { passwordConfirm, agreeTerms, agreePrivacy, agreeMarketing, ...payload } = form;
      const res = await callSignup(payload);
      if (res?.code === 200) {
        message.success('가입 신청이 완료되었습니다. 슈퍼관리자 승인 후 로그인할 수 있습니다.');
        window.location.href = '/admin/login';
      } else {
        message.error(res?.message || '가입 신청에 실패했습니다.');
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
            <p>관리자</p>
            <h1>기업 회원가입</h1>
            <span>부대행사 등록을 위한 기관과 담당자 정보를 등록해 주세요.</span>
          </div>
          <button type="button" onClick={() => { window.location.href = '/admin/login'; }}>
            이미 계정이 있으신가요? 로그인 →
          </button>
        </header>

        <div className="saf-signup-grid">
          <section className="saf-signup-panel">
            <StepLabel step="STEP 1" title="기관 정보" meta="organizations" />
            <Field label="기관명 *">
              <input value={form.orgName} onChange={(e) => set('orgName', e.target.value)} placeholder="예) 한국 ABC 법무법인" />
            </Field>
            <Field label="사업자등록번호 *">
              <input value={form.businessNumber} onChange={(e) => set('businessNumber', e.target.value)} placeholder="123-45-67890" />
            </Field>
            <Field label="기관 유형 *">
              <select value={form.orgType} onChange={(e) => set('orgType', e.target.value)}>
                <option value="law_firm">로펌</option>
                <option value="corporation">기업</option>
                <option value="association">협회</option>
                <option value="other">기타</option>
              </select>
            </Field>
            <Field label="대표 이메일 *">
              <input value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="contact@abc.law" type="email" />
            </Field>
          </section>

          <section className="saf-signup-panel">
            <StepLabel step="STEP 2" title="가입자 (대표자) 정보" meta="users + organization_members" />
            <Field label="이름 *">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="예) 김민수" />
            </Field>
            <Field label="아이디 *">
              <input value={form.userId} onChange={(e) => set('userId', e.target.value)} placeholder="영문+숫자, 4~20자" />
            </Field>
            <Field label="이메일 *">
              <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="kim@abc.law" type="email" />
            </Field>
            <Field label="비밀번호 *">
              <input value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="8자 이상, 영문+숫자+특수문자" type="password" />
            </Field>
            <Field label="비밀번호 확인 *">
              <input value={form.passwordConfirm} onChange={(e) => set('passwordConfirm', e.target.value)} placeholder="동일하게 입력" type="password" />
            </Field>
            <div className="saf-lang-toggle">
              <span>사용 언어 *</span>
              <button type="button" className={form.language === 'ko' ? 'is-active' : ''} onClick={() => set('language', 'ko')}>한국어</button>
              <button type="button" className={form.language === 'en' ? 'is-active' : ''} onClick={() => set('language', 'en')}>English</button>
            </div>
          </section>

          <aside className="saf-signup-side">
            <section className="saf-signup-panel">
              <StepLabel step="STEP 3" title="약관 동의" />
              <Agreement
                label="전체 동의"
                checked={form.agreeTerms && form.agreePrivacy && form.agreeMarketing}
                onChange={toggleAll}
                strong
              />
              <Agreement label="이용약관 동의 (필수)" checked={form.agreeTerms} onChange={(v) => set('agreeTerms', v)} />
              <Agreement label="개인정보 수집·이용 (필수)" checked={form.agreePrivacy} onChange={(v) => set('agreePrivacy', v)} />
              <Agreement label="마케팅 정보 수신 (선택)" checked={form.agreeMarketing} onChange={(v) => set('agreeMarketing', v)} />
              <button className="saf-signup-submit" type="button" disabled={loading} onClick={handleSubmit}>
                {loading ? '신청 중...' : '가입 신청하기'}
              </button>
            </section>

            <section className="saf-signup-process">
              <h2>가입 절차</h2>
              <ol>
                <li>정보 입력 후 신청</li>
                <li>슈퍼관리자 승인 (1~2일)</li>
                <li>승인 메일 수신</li>
                <li>로그인 → 부대행사 등록</li>
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
    {!strong && <button type="button">전문 ›</button>}
  </label>
);

export default SafSignup;
