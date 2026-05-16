export interface PayTestPricingOption {
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

export interface PayTestEventOption {
  eventSeq: number;
  title: string;
  eventType?: string | null;
  eventStartDt?: string | null;
  eventEndDt?: string | null;
  location?: string | null;
  pricingList: PayTestPricingOption[];
}

export interface PayTestParticipantRequest {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  organizationName?: string;
  position?: string;
  country?: string;
}

export type PayTestPaymentMethodCode = 'P000' | 'P001' | 'P302' | 'P015';

export interface PayTestPrepareRequest {
  eventSeq: number;
  eventPricingSeq: number;
  participant: PayTestParticipantRequest;
  paymentMethod?: string;
  paymentMethods: PayTestPaymentMethodCode[];
  lang: string;
  callbackBaseUrl: string;
}

export interface PayTestResult {
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

export interface PayTestPrepareResponse {
  paymentSeq?: number | null;
  orderId: string;
  sdkUrl: string;
  eximbayRequest: Record<string, unknown>;
  payment?: PayTestResult | null;
}
