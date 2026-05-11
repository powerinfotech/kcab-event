export type AdminUserType = 'admin' | 'organization';
export type AdminUserStatus = 'pending' | 'active' | 'suspended' | 'withdrawn';
export type AdminOrganizationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface AdminUserSearchParam {
  keyword?: string;
  userType?: string;
  status?: string;
}

export interface AdminUserListItem {
  userSeq: number;
  userId: string;
  email: string;
  name: string;

  position?: string;

  userType: AdminUserType;
  status: AdminUserStatus;
  organizationSeq?: number;
  organizationName?: string;

  orgType?: string;

  approvalPending?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserDetail extends AdminUserListItem {
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  /** 조직 등급: S/A/B/C */
  grade?: OrganizationGrade;
  approvedAt?: string;
}

export type OrganizationGrade = 'S' | 'A' | 'B' | 'C';

export const ORGANIZATION_GRADE_OPTIONS: Array<{ value: OrganizationGrade; label: string }> = [
  { value: 'S', label: 'S' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
];

export interface AdminUserSaveParam {
  userId?: string;
  email: string;
  password?: string;
  name: string;

  position?: string;

  userType: AdminUserType;
  status: AdminUserStatus;
  organizationSeq?: number;
  organizationName?: string;

  orgType?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  /** 조직 등급: S/A/B/C (생략 시 백엔드가 'C' 강제) */
  grade?: OrganizationGrade;
}
