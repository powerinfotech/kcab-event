export interface SignupRequest {
  userId: string;
  password: string;
  email: string;
  name: string;
  nameEn?: string;
  phone?: string;
  language?: string;
  orgName: string;
  orgNameEn?: string;
  orgType: string;
  businessNumber?: string;
  representativeName?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  website?: string;
}

export const ORG_TYPE_OPTIONS = [
  { value: 'law_firm', label: 'Law Firm' },
  { value: 'partner', label: 'Partner Organization' },
  { value: 'academic', label: 'Academic Institution' },
  { value: 'other', label: 'Other' },
];
