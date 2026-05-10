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
  representativeName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  approvedAt?: string;
}

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
  representativeName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;

}
