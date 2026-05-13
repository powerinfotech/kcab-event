export type EmailLogStatus = 'queued' | 'sent' | 'failed' | string;

export interface EmailLogSearchParam {
  keyword?: string;
  status?: string;
  templateCode?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

export interface EmailLogListItem {
  emailLogSeq: number;
  templateSeq?: number;
  templateCode?: string;
  templateName?: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
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

export interface EmailLogResendParam {
  emailLogSeqs: number[];
}

export interface EmailLogResendResult {
  requestedCount: number;
  successCount: number;
  failedCount: number;
}
