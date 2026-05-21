'use client';

import React, { useEffect, useRef, useState } from 'react';
import { App, Modal } from 'antd';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';
import { callGetFileList, callSaveFiles, getUserLoginInfo, UPLOAD_CONTEXT } from '@api/CommonApi';
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
import { IudType } from '@interface/common';
import { ORG_TYPE_OPTIONS } from '@interface/saf/SafAuth';
import { EMAIL_REGEXP } from '@util/validationPatterns';
import { FileDetailType } from '@component/upload/CustomFile';

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
const EMAIL_VERIFY_PURPOSE_PROFILE = 'profile-email';
const EMAIL_VERIFY_PURPOSE_CONTACT = 'contact-email';

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
  imageFileSeq: null,
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
  const [originalContactEmail, setOriginalContactEmail] = useState('');
  const [contactEmailVerified, setContactEmailVerified] = useState(true);
  const [contactEmailCodeSending, setContactEmailCodeSending] = useState(false);
  const [contactEmailVerifyOpen, setContactEmailVerifyOpen] = useState(false);
  const [contactEmailCodeInput, setContactEmailCodeInput] = useState('');
  const [contactEmailCodeVerifying, setContactEmailCodeVerifying] = useState(false);
  const [contactEmailExpiresAt, setContactEmailExpiresAt] = useState<number | null>(null);
  const [contactEmailRemainingSec, setContactEmailRemainingSec] = useState(0);
  const [organizationImageFiles, setOrganizationImageFiles] = useState<FileDetailType[]>([]);

  const isOrganization = form.userType === 'organization';
  const hasOrganizationProfile = isOrganization || form.userType === 'admin' || !!form.organizationSeq || !!form.imageFileSeq;
  const organizationFieldsRequired = isOrganization || !!form.organizationSeq;
  const shouldVerifyContactEmail = isOrganization || !!form.organizationSeq;
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
  const normalizedContactEmailValue = normalizeEmail(form.contactEmail);
  const contactEmailChanged = shouldVerifyContactEmail && !!form.userSeq && normalizedContactEmailValue !== originalContactEmail;
  const isVerifiedChangedContactEmail = contactEmailChanged && contactEmailVerified;
  const contactEmailFieldLocked = contactEmailVerifyOpen || isVerifiedChangedContactEmail;
  const contactEmailActionButtonDisabled = contactEmailCodeSending || (!contactEmailChanged && !contactEmailVerifyOpen);
  const contactEmailActionButtonLabel = contactEmailCodeSending
    ? 'Sending...'
    : contactEmailVerifyOpen || isVerifiedChangedContactEmail
      ? 'Change Email'
      : contactEmailChanged
        ? 'Verify Email'
        : 'Verified';
  const isRequiredEmpty = (value?: string) => submitAttempted && !value?.trim();
  const isEmailRuleInvalid = submitAttempted && !!emailValue && !EMAIL_REGEXP.value.test(emailValue);
  const isEmailVerificationInvalid = submitAttempted && emailChanged && !emailVerified;
  const isContactEmailRuleInvalid = submitAttempted
    && hasOrganizationProfile
    && !!contactEmailValue
    && !EMAIL_REGEXP.value.test(contactEmailValue);
  const isContactEmailVerificationInvalid = submitAttempted && contactEmailChanged && !contactEmailVerified;

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

  const resetContactEmailVerification = (verified = false) => {
    setContactEmailVerified(verified);
    setContactEmailVerifyOpen(false);
    setContactEmailExpiresAt(null);
    setContactEmailRemainingSec(0);
    setContactEmailCodeInput('');
  };

  const handleEmailChange = (value: string) => {
    setForm((prev) => ({ ...prev, email: value }));
    resetEmailVerification(normalizeEmail(value) === originalEmail);
  };

  const handleContactEmailChange = (value: string) => {
    setForm((prev) => ({ ...prev, contactEmail: value }));
    resetContactEmailVerification(normalizeEmail(value) === originalContactEmail);
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
      setOriginalContactEmail(normalizeEmail(nextForm.contactEmail));
      resetEmailVerification(true);
      resetContactEmailVerification(true);
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

  useEffect(() => {
    if (!contactEmailExpiresAt || (!contactEmailVerifyOpen && !isVerifiedChangedContactEmail)) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((contactEmailExpiresAt - Date.now()) / 1000));
      setContactEmailRemainingSec(remaining);
      if (remaining <= 0) {
        resetContactEmailVerification(false);
        message.warning('Contact email verification has expired. Please request a new code.');
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [contactEmailVerifyOpen, contactEmailExpiresAt, isVerifiedChangedContactEmail, message]);

  const buildSaveParam = (imageFileSeq: number | null = form.imageFileSeq ?? null): AdminUserSaveParam => ({
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
    imageFileSeq,
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

    if (organizationFieldsRequired && (!form.organizationName?.trim() || !contactEmailValue || !form.orgType)) {
      message.warning('Please fill in all required organization fields.');
      return false;
    }

    if (hasOrganizationProfile && contactEmailValue && !EMAIL_REGEXP.value.test(contactEmailValue)) {
      message.warning('Please enter a valid contact email address.');
      return false;
    }

    if (contactEmailChanged && !contactEmailVerified) {
      message.warning('Please verify the new contact email before saving.');
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
      const res = await callSendEmailCode(emailValue, EMAIL_VERIFY_PURPOSE_PROFILE);
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
      const res = await callVerifyEmailCode(emailValue, code, EMAIL_VERIFY_PURPOSE_PROFILE);
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

  const handleContactEmailButtonClick = async () => {
    if (contactEmailVerifyOpen || (contactEmailChanged && contactEmailVerified)) {
      resetContactEmailVerification(false);
      return;
    }

    if (!contactEmailChanged) {
      message.info('Change the contact email first.');
      return;
    }

    if (!contactEmailValue) {
      message.warning('Please enter a contact email first.');
      return;
    }

    if (!EMAIL_REGEXP.value.test(contactEmailValue)) {
      message.warning('Please enter a valid contact email address.');
      return;
    }

    setContactEmailCodeSending(true);
    try {
      const res = await callSendEmailCode(contactEmailValue, EMAIL_VERIFY_PURPOSE_CONTACT);
      if (res?.code === 200) {
        setContactEmailVerifyOpen(true);
        setContactEmailExpiresAt(Date.now() + EMAIL_VERIFY_SECONDS * 1000);
        setContactEmailRemainingSec(EMAIL_VERIFY_SECONDS);
        setContactEmailCodeInput('');
        message.success('Verification code sent. Please enter it within 10 minutes.');
      }
    } finally {
      setContactEmailCodeSending(false);
    }
  };

  const handleVerifyContactEmailCode = async () => {
    const code = contactEmailCodeInput.trim();

    if (!/^\d{6}$/.test(code)) {
      message.warning('Please enter the 6-digit verification code.');
      return;
    }

    setContactEmailCodeVerifying(true);
    try {
      const res = await callVerifyEmailCode(contactEmailValue, code, EMAIL_VERIFY_PURPOSE_CONTACT);
      if (res?.code === 200) {
        message.success('Contact email verified. This email is locked until you choose Change Email.');
        setContactEmailVerified(true);
        setContactEmailVerifyOpen(false);
        setContactEmailCodeInput('');
      }
    } finally {
      setContactEmailCodeVerifying(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let resolvedImageFileSeq: number | null = form.imageFileSeq ?? null;
      if (organizationImageFiles.some((file) => file.iudType)) {
        const fileRes = await callSaveFiles(resolvedImageFileSeq, 0, organizationImageFiles, UPLOAD_CONTEXT.ORGANIZATION_IMAGE);
        const newSeq = fileRes?.item?.fileSeq;
        if (newSeq) resolvedImageFileSeq = Number(newSeq);
        if (fileRes?.item?.fileList) {
          setOrganizationImageFiles(fileRes.item.fileList as FileDetailType[]);
        }
      }

      await callUpdateAdminUser(form.userSeq, buildSaveParam(resolvedImageFileSeq));
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

        {hasOrganizationProfile && (
          <section className="saf-panel">
            <PanelTitle title="Organization Information" subtitle="Based on the organizations table." />
            <div className="saf-form-grid">
              <Field
                label={`Organization Name${organizationFieldsRequired ? ' *' : ''}`}
                invalid={organizationFieldsRequired && isRequiredEmpty(form.organizationName)}
              >
                <input
                  value={form.organizationName ?? ''}
                  onChange={(event) => updateForm('organizationName', event.target.value)}
                />
              </Field>
              <Field label={`Organization Type${organizationFieldsRequired ? ' *' : ''}`}>
                <select
                  value={form.orgType ?? 'law_firm'}
                  onChange={(event) => updateForm('orgType', event.target.value)}
                >
                  {ORG_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
              <Field
                label={`Contact Email${organizationFieldsRequired ? ' *' : ''}`}
                invalid={(organizationFieldsRequired && isRequiredEmpty(form.contactEmail)) || isContactEmailRuleInvalid || isContactEmailVerificationInvalid}
              >
                <div className="saf-input-action">
                  <input
                    value={form.contactEmail ?? ''}
                    type="email"
                    disabled={contactEmailFieldLocked}
                    onChange={(event) => handleContactEmailChange(event.target.value)}
                  />
                  {shouldVerifyContactEmail && (
                    <button
                      type="button"
                      className={`saf-check-btn${contactEmailVerifyOpen || isVerifiedChangedContactEmail || !contactEmailChanged ? ' is-checked' : ''}`}
                      onClick={handleContactEmailButtonClick}
                      disabled={contactEmailActionButtonDisabled}
                    >
                      {contactEmailActionButtonLabel}
                    </button>
                  )}
                </div>
                {contactEmailChanged && !contactEmailVerifyOpen && !contactEmailVerified && (
                  <p className="saf-verify-hint">Please verify this contact email before saving.</p>
                )}
                {isVerifiedChangedContactEmail && (
                  <p className="saf-verify-hint">
                    Contact email verified. Save is available for {formatRemaining(contactEmailRemainingSec)}.
                  </p>
                )}
              </Field>
              {contactEmailVerifyOpen && (
                <div className="saf-verify-form is-wide">
                  <div className="saf-verify-row">
                    <input
                      value={contactEmailCodeInput}
                      onChange={(event) => setContactEmailCodeInput(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit code"
                      inputMode="numeric"
                      maxLength={6}
                    />
                    <span className={`saf-verify-timer${contactEmailRemainingSec <= 0 ? ' is-expired' : ''}`}>
                      {formatRemaining(contactEmailRemainingSec)}
                    </span>
                    <button
                      type="button"
                      className="saf-verify-btn"
                      onClick={handleVerifyContactEmailCode}
                      disabled={contactEmailCodeVerifying || contactEmailRemainingSec <= 0}
                    >
                      {contactEmailCodeVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  <p className="saf-verify-hint">
                    A verification code has been sent to your contact email. Please enter it within 10 minutes.
                  </p>
                </div>
              )}
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
              <Field label="Organization Image" wide>
                <div className="saf-thumbnail-uploader">
                  {loading ? (
                    <div className="saf-image-upload-skeleton" aria-hidden="true" />
                  ) : (
                    <OrganizationImageUpload
                      fileList={organizationImageFiles}
                      onChange={setOrganizationImageFiles}
                      disabled={saving}
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
