export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type RefundType = 'void' | 'refund';
export type RefundStatus = 'requested' | 'processing' | 'completed' | 'rejected' | 'failed';

export interface PaymentListItem {
  paymentSeq: number;
  pgProvider: string;
  pgOrderId: string;
  pgTransactionId: string | null;
  amount: string | number;
  currency: string;
  originalAmount?: string | number | null;
  discountCode?: string | null;
  discountAmount?: string | number | null;
  settleAmount: string | number | null;
  settleCurrency: string | null;
  paymentMethod: string | null;
  cardCompany: string | null;
  cardLast4: string | null;
  status: PaymentStatus | string;
  paidAt: string | null;
  createdAt: string | null;
  cancelledAt: string | null;
  refundedAmount: string | number | null;
  refundCount: number;
  eventPricingSeq: number | null;
  priceType: string | null;
  priceName: string | null;
  discountCodeSeq: number | null;
  eventSeq: number | null;
  eventTitle: string | null;
  eventType: string | null;
  participantSeq: number | null;
  eventParticipantSeq: number | null;
  payerName: string | null;
  payerEmail: string | null;
  payerCountry: string | null;
}

export interface PaymentEventOption {
  eventSeq: number;
  title: string;
  eventType: string;
  startAt: string | null;
}

export interface RefundHistoryItem {
  refundSeq: number;
  paymentSeq: number;
  amount: string | number;
  currency?: string | null;
  settleAmount: string | number | null;
  reason: string;
  status: RefundStatus;
  refundType: RefundType;
  refundRequestId: string | null;
  pgRefundId: string | null;
  pgRefundTransactionId: string | null;
  pgResponseCode: string | null;
  pgResponseMessage: string | null;
  balanceBefore: string | number | null;
  balanceAfter: string | number | null;
  failedReason: string | null;
  requestedAt: string | null;
  processedAt: string | null;
  requestedByName: string | null;
  processedByName: string | null;
}

export interface PaymentDetail {
  paymentSeq: number;
  pgProvider: string;
  pgMid: string | null;
  pgTransactionId: string | null;
  pgOrderId: string;
  amount: string | number;
  currency: string;
  paymentMethod: string | null;
  cardCompany: string | null;
  cardLast4: string | null;
  status: PaymentStatus | string;
  paidAt: string | null;
  failedReason: string | null;
  receiptUrl: string | null;
  rawResponse: string | null;
  pgResponseCode: string | null;
  pgResponseMessage: string | null;
  verifiedAt: string | null;
  webhookReceivedAt: string | null;
  settleAmount: string | number | null;
  settleCurrency: string | null;
  fxRate: string | number | null;
  approvalNo: string | null;
  installmentMonths: number | null;
  eventPricingSeq: number | null;
  priceType: string | null;
  priceName: string | null;
  discountCodeSeq: number | null;
  originalAmount: string | number | null;
  discountCode: string | null;
  discountAmount: string | number | null;
  refundedAmount: string | number | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  adminMemo: string | null;
  createdAt: string | null;
  updatedAt: string | null;

  eventSeq: number | null;
  eventTitle: string | null;
  eventType: string | null;
  eventStartDt: string | null;

  eventParticipantSeq: number | null;
  participationStatus: string | null;

  participantSeq: number | null;
  payerName: string | null;
  payerEmail: string | null;
  payerCountry: string | null;
  payerOrganization: string | null;
  payerPosition: string | null;

  refunds: RefundHistoryItem[];
}

export interface PaymentListSearchParam {
  keyword?: string;
  eventSeqs?: number[];
  statuses?: PaymentStatus[];
  pgProviders?: string[];
  paymentMethods?: string[];
  currencies?: string[];
  fromDate?: string;
  toDate?: string;
  minAmount?: number | string;
  maxAmount?: number | string;
}

export interface PaymentCancelRequest {
  reason: string;
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, 'gray' | 'green' | 'yellow' | 'blue' | 'red'> = {
  pending: 'yellow',
  paid: 'green',
  failed: 'red',
  cancelled: 'gray',
  refunded: 'red',
};

export const REFUND_TYPE_LABELS: Record<RefundType, string> = {
  void: 'Void (same-day)',
  refund: 'Refund',
};

export const REFUND_STATUS_LABELS: Record<RefundStatus, string> = {
  requested: 'Requested',
  processing: 'Processing',
  completed: 'Completed',
  rejected: 'Rejected',
  failed: 'Failed',
};
