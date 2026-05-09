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
  nameEn?: string;
  position?: string;
  phone?: string;
  userType: AdminUserType;
  status: AdminUserStatus;
  organizationSeq?: number;
  organizationName?: string;
  organizationNameEn?: string;
  orgType?: string;
  organizationStatus?: AdminOrganizationStatus;
  approvalPending?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserDetail extends AdminUserListItem {
  representativeName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  approvedAt?: string;
}

export interface AdminUserSaveParam {
  email: string;
  name: string;
  nameEn?: string;
  position?: string;
  phone?: string;
  userType: AdminUserType;
  status: AdminUserStatus;
  organizationSeq?: number;
  organizationName?: string;
  organizationNameEn?: string;
  orgType?: string;
  representativeName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  organizationStatus?: AdminOrganizationStatus;
}
