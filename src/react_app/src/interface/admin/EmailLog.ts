export type EmailLogStatus = 'queued' | 'sent' | 'failed' | string;

export interface EmailLogSearchParam {
  keyword?: string;
  status?: string;
  provider?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

export interface EmailLogListItem {
  emailLogSeq: number;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  provider: string;
  providerMessageId?: string;
  status: EmailLogStatus;
  errorMessage?: string;
  retryCount?: number;
  sentAt?: string;
  openedAt?: string;
  createdAt?: string;
}

export interface EmailLogDetail extends EmailLogListItem {
  templateSeq?: number;
  registrationSeq?: number;
  bodyHtml: string;
}
