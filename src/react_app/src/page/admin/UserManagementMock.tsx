'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  callApproveAdminUser,
  callGetAdminUserDetail,
  callGetAdminUsers,
  callUpdateAdminUser,
} from '@api/admin/AdminUserManagementApi';
import {
  AdminOrganizationStatus,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserSaveParam,
  AdminUserStatus,
  AdminUserType,
} from '@interface/admin/AdminUserManagement';
import { ORG_TYPE_OPTIONS } from '@interface/saf/SafAuth';

const USER_TYPE_LABEL: Record<AdminUserType, string> = {
  admin: '관리자',
  organization: '기관',
};

const USER_STATUS_LABEL: Record<AdminUserStatus, string> = {
  pending: '신청',
  active: '승인',
  suspended: '중지',
  withdrawn: '탈퇴',
};

const ORG_STATUS_LABEL: Record<AdminOrganizationStatus, string> = {
  pending: '신청',
  approved: '승인',
  rejected: '반려',
  suspended: '중지',
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
  nameEn: '',
  position: '',
  phone: '',
  userType: 'organization',
  status: 'pending',
  organizationName: '',
  organizationNameEn: '',
  orgType: 'law_firm',
  representativeName: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  website: '',
  organizationStatus: 'pending',
};

export default function UserManagementMock() {
  const { message } = App.useApp();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [userType, setUserType] = useState('');
  const [mode, setMode] = useState<'list' | 'detail'>('list');
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [form, setForm] = useState<AdminUserDetail>(emptyDetail);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedSummary = useMemo(
    () => users.find((user) => user.userSeq === selectedSeq),
    [selectedSeq, users],
  );

  const approvalPending = form.status === 'pending' || form.organizationStatus === 'pending';
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
      message.error('사용자 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (userSeq: number) => {
    setLoading(true);
    try {
      const res = await callGetAdminUserDetail(userSeq);
      setForm({ ...emptyDetail, ...res.item });
      setSelectedSeq(userSeq);
      setMode('detail');
    } catch (error) {
      message.error('사용자 상세 정보를 불러오지 못했습니다.');
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
    email: form.email,
    name: form.name,
    nameEn: form.nameEn,
    position: form.position,
    phone: form.phone,
    userType: form.userType,
    status: form.status,
    organizationSeq: form.organizationSeq,
    organizationName: form.organizationName,
    organizationNameEn: form.organizationNameEn,
    orgType: form.orgType,
    representativeName: form.representativeName,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone,
    address: form.address,
    website: form.website,
    organizationStatus: form.organizationStatus,
  });

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.userType || !form.status) {
      message.warning('사용자 필수값을 입력해주세요.');
      return false;
    }

    if (isOrganization && (!form.organizationName?.trim() || !form.contactEmail?.trim() || !form.orgType || !form.organizationStatus)) {
      message.warning('기관 필수값을 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!selectedSeq || !validateForm()) return;

    setSaving(true);
    try {
      await callUpdateAdminUser(selectedSeq, buildSaveParam());
      message.success('사용자 정보가 저장되었습니다.');
      await fetchUsers();
      await fetchDetail(selectedSeq);
    } catch (error) {
      message.error('사용자 정보를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedSeq) return;
    const confirmed = window.confirm('이 가입 신청을 승인하시겠습니까?');
    if (!confirmed) return;

    setSaving(true);
    try {
      await callApproveAdminUser(selectedSeq);
      message.success('가입 신청이 승인되었습니다.');
      await fetchUsers();
      await fetchDetail(selectedSeq);
    } catch (error) {
      message.error('승인 처리에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'detail') {
    return (
      <div className="saf-screen saf-user-admin-screen">
        <header className="saf-screen-header">
          <div>
            <h1>{form.name || selectedSummary?.name || '사용자 상세'}</h1>
            <p>{form.userId} · {USER_TYPE_LABEL[form.userType]}</p>
          </div>
          <div className="saf-screen-actions">
            <button type="button" className="saf-action-btn is-secondary" onClick={() => setMode('list')}>
              <ArrowLeftOutlined />
              <span>목록</span>
            </button>
            {approvalPending && (
              <button type="button" className="saf-action-btn is-approve" onClick={handleApprove} disabled={saving}>
                <CheckOutlined />
                <span>승인</span>
              </button>
            )}
            <button type="button" className="saf-action-btn is-primary" onClick={handleSave} disabled={saving}>
              <SaveOutlined />
              <span>저장</span>
            </button>
          </div>
        </header>

        <div className="saf-user-detail-grid">
          <section className="saf-panel">
            <PanelTitle title="계정 정보" subtitle="users 테이블 기준 정보입니다." />
            <div className="saf-form-grid">
              <Field label="사용자 ID"><input value={form.userId} disabled /></Field>
              <Field label="사용자 유형 *">
                <select value={form.userType} onChange={(e) => updateForm('userType', e.target.value as AdminUserType)}>
                  <option value="admin">관리자</option>
                  <option value="organization">기관</option>
                </select>
              </Field>
              <Field label="이름 *"><input value={form.name} onChange={(e) => updateForm('name', e.target.value)} /></Field>
              <Field label="영문 이름"><input value={form.nameEn ?? ''} onChange={(e) => updateForm('nameEn', e.target.value)} /></Field>
              <Field label="직위"><input value={form.position ?? ''} onChange={(e) => updateForm('position', e.target.value)} /></Field>
              <Field label="휴대폰"><input value={form.phone ?? ''} onChange={(e) => updateForm('phone', e.target.value)} /></Field>
              <Field label="이메일 *"><input value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></Field>
              <Field label="상태 *">
                <select value={form.status} onChange={(e) => updateForm('status', e.target.value as AdminUserStatus)}>
                  <option value="pending">신청</option>
                  <option value="active">승인</option>
                  <option value="suspended">중지</option>
                  <option value="withdrawn">탈퇴</option>
                </select>
              </Field>
            </div>
          </section>

          {isOrganization && (
            <section className="saf-panel">
              <PanelTitle title="기관 정보" subtitle="organizations 테이블 기준 정보입니다." />
              <div className="saf-form-grid">
                <Field label="기관명 *"><input value={form.organizationName ?? ''} onChange={(e) => updateForm('organizationName', e.target.value)} /></Field>
                <Field label="영문 기관명"><input value={form.organizationNameEn ?? ''} onChange={(e) => updateForm('organizationNameEn', e.target.value)} /></Field>
                <Field label="기관 유형 *">
                  <select value={form.orgType ?? 'law_firm'} onChange={(e) => updateForm('orgType', e.target.value)}>
                    {ORG_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="기관 상태 *">
                  <select value={form.organizationStatus ?? 'pending'} onChange={(e) => updateForm('organizationStatus', e.target.value as AdminOrganizationStatus)}>
                    <option value="pending">신청</option>
                    <option value="approved">승인</option>
                    <option value="rejected">반려</option>
                    <option value="suspended">중지</option>
                  </select>
                </Field>
                <Field label="대표자"><input value={form.representativeName ?? ''} onChange={(e) => updateForm('representativeName', e.target.value)} /></Field>
                <Field label="대표 이메일 *"><input value={form.contactEmail ?? ''} onChange={(e) => updateForm('contactEmail', e.target.value)} /></Field>
                <Field label="대표 전화"><input value={form.contactPhone ?? ''} onChange={(e) => updateForm('contactPhone', e.target.value)} /></Field>
                <Field label="웹사이트"><input value={form.website ?? ''} onChange={(e) => updateForm('website', e.target.value)} /></Field>
                <Field label="주소" wide><input value={form.address ?? ''} onChange={(e) => updateForm('address', e.target.value)} /></Field>
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
          <h1>사용자 관리</h1>
          <p>신청 상태를 먼저 보여주고, 그 다음 관리자와 기관 순서로 정렬됩니다.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchUsers} disabled={loading}>
            <ReloadOutlined />
            <span>새로고침</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="이름, ID, 이메일, 기관명 검색"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchUsers();
            }}
          />
        </div>
        <select className="saf-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="pending">신청</option>
          <option value="active">승인</option>
          <option value="approved">기관 승인</option>
          <option value="suspended">중지</option>
          <option value="rejected">반려</option>
        </select>
        <select className="saf-filter-select" value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">전체 유형</option>
          <option value="admin">관리자</option>
          <option value="organization">기관</option>
        </select>
        <button type="button" onClick={fetchUsers}>검색</button>
      </section>

      <section className="saf-table-wrap">
        <table className="saf-table saf-user-table">
          <thead>
            <tr>
              <th>상태</th>
              <th>유형</th>
              <th>이름 / ID</th>
              <th>기관</th>
              <th>이메일</th>
              <th>직위</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userSeq} onClick={() => fetchDetail(user.userSeq)}>
                <td><StatusBadge status={user.organizationStatus ?? user.status} /></td>
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
                  <span>{loading ? '불러오는 중입니다.' : '조회된 사용자가 없습니다.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="saf-table-footer">총 {users.length}건</div>
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

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`saf-form-field ${wide ? 'is-wide' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const tone = STATUS_TONE[status ?? ''] ?? 'gray';
  const label = USER_STATUS_LABEL[status as AdminUserStatus] ?? ORG_STATUS_LABEL[status as AdminOrganizationStatus] ?? status ?? '-';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function formatDate(value?: string) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
