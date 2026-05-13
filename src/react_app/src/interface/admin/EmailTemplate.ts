export interface EmailTemplateListItem {
  templateSeq: number;
  code: string;
  name: string;
  subject: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface EmailTemplateVariable {
  key: string;
  description: string;
  sample: string;
}

export interface EmailTemplateDetail extends EmailTemplateListItem {
  bodyHtml: string;
  variables?: string;
  createdAt?: string;
}

export interface EmailTemplateSaveParam {
  subject: string;
  bodyHtml: string;
  isActive: boolean;
}

export interface EmailTemplatePreviewSendParam {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  bodyHtml: string;
}
