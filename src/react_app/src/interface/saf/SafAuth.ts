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
  { value: 'law_firm', label: 'Law Firm (로펌)' },
  { value: 'partner', label: 'Partner Organization (파트너기관)' },
  { value: 'academic', label: 'Academic Institution (학술기관)' },
  { value: 'other', label: 'Other (기타)' },
];
