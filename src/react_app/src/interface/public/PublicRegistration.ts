export interface PublicRegistrationPricingOption {
  eventPricingSeq: number;
  eventSeq: number;
  priceType: string;
  priceName: string;
  currencyCode: 'USD' | 'KRW';
  amount: number;
  salesStartAt?: string | null;
  salesEndAt?: string | null;
  soldCount?: number | null;
}

export interface PublicRegistrationParticipantRequest {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  organizationName?: string;
  position?: string;
  country?: string;
  phone?: string;
  address?: string;
  city?: string;
  nationality?: string;
  residenceCountry?: string;
}

export type PublicRegistrationPaymentMethodCode = 'P000' | 'P001';

export interface PublicRegistrationDiscountValidationRequest {
  eventSeq: number;
  eventPricingSeq: number;
  discountCode: string;
}

export interface PublicRegistrationDiscountValidationResult {
  valid: boolean;
  status: string;
  message: string;
  discountCodeSeq?: number | null;
  discountCode?: string | null;
  discountType?: string | null;
  discountValue?: number | null;
  currencyCode?: string | null;
  originalAmount?: number | null;
  discountAmount?: number | null;
  finalAmount?: number | null;
  usageLimit?: number | null;
  usedCount?: number | null;
}

export interface PublicRegistrationPrepareRequest {
  eventSeq: number;
  eventPricingSeq: number;
  participant: PublicRegistrationParticipantRequest;
  paymentMethod?: string;
  paymentMethods: PublicRegistrationPaymentMethodCode[];
  discountCode?: string;
  lang: string;
  callbackBaseUrl: string;
}

export interface PublicRegistrationPaymentResult {
  paymentSeq?: number | null;
  orderId: string;
  status: string;
  amount: number;
  currency: 'USD' | 'KRW';
  eventTitle?: string | null;
  priceName?: string | null;
  pgTransactionId?: string | null;
  pgResponseCode?: string | null;
  pgResponseMessage?: string | null;
  failedReason?: string | null;
  paidAt?: string | null;
  createdAt?: string | null;
}

export interface PublicRegistrationPrepareResponse {
  paymentSeq?: number | null;
  orderId: string;
  sdkUrl?: string | null;
  eximbayRequest?: Record<string, unknown> | null;
  payment?: PublicRegistrationPaymentResult | null;
}
