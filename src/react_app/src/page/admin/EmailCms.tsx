'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App, Modal } from 'antd';
import {
  EyeOutlined,
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons';
import CustomRichEditor from '@component/special/CustomRichEditor';
import {
  callGetEmailTemplateDetail,
  callGetEmailTemplates,
  callSaveEmailTemplate,
  callSendEmailTemplatePreview,
} from '@api/admin/EmailTemplateApi';
import {
  EmailTemplateDetail,
  EmailTemplateListItem,
  EmailTemplateVariable,
} from '@interface/admin/EmailTemplate';
import { EMAIL_REGEXP } from '@util/validationPatterns';

const EMPTY_TEMPLATE: EmailTemplateDetail = {
  templateSeq: 0,
  code: '',
  name: '',
  subject: '',
  bodyHtml: '',
  isActive: true,
};

export default function EmailCms() {
  const { message } = App.useApp();
  const [templates, setTemplates] = useState<EmailTemplateListItem[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [detail, setDetail] = useState<EmailTemplateDetail>(EMPTY_TEMPLATE);
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendRecipientEmail, setSendRecipientEmail] = useState('');
  const [sendRecipientName, setSendRecipientName] = useState('');

  const variables = useMemo(() => parseVariables(detail.variables), [detail.variables]);
  const previewSubject = useMemo(() => renderTemplate(subject, variables), [subject, variables]);
  const renderedBodyHtml = useMemo(() => renderTemplate(bodyHtml, variables), [bodyHtml, variables]);
  const previewHtml = useMemo(() => buildEmailPreviewHtml(renderedBodyHtml), [renderedBodyHtml]);
  const unknownVariables = useMemo(() => findUnknownVariables(`${subject} ${bodyHtml}`, variables), [subject, bodyHtml, variables]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await callGetEmailTemplates();
      const items = res.item ?? [];
      setTemplates(items);
      const nextCode = selectedCode || resolveInitialCode(items);
      if (nextCode) {
        await fetchDetail(nextCode);
      }
    } catch (error) {
      message.error('Failed to load email templates.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (code: string) => {
    setLoading(true);
    try {
      const res = await callGetEmailTemplateDetail(code);
      const nextDetail = res.item ?? EMPTY_TEMPLATE;
      setSelectedCode(code);
      setDetail(nextDetail);
      setSubject(decodeHtmlEntities(nextDetail.subject ?? ''));
      setBodyHtml(normalizeStoredHtml(nextDetail.bodyHtml));
      setIsActive(nextDetail.isActive ?? true);
    } catch (error) {
      message.error('Failed to load email template.');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!selectedCode) return;
    if (!subject.trim()) {
      message.warning('Subject is required.');
      return;
    }
    if (!stripHtml(bodyHtml).trim()) {
      message.warning('Body is required.');
      return;
    }

    setSaving(true);
    try {
      const result = await callSaveEmailTemplate(selectedCode, {
        subject: subject.trim(),
        bodyHtml,
        isActive,
      });
      if (result.code !== 200) return;

      message.success('Email template has been saved.');
      await fetchTemplates();
    } catch (error) {
      message.error('Failed to save email template.');
    } finally {
      setSaving(false);
    }
  };

  const sendPreviewEmail = async () => {
    if (!selectedCode) return;

    const recipientEmail = sendRecipientEmail.trim();
    if (!recipientEmail) {
      message.warning('Recipient email is required.');
      return;
    }
    if (!EMAIL_REGEXP.value.test(recipientEmail)) {
      message.warning('Please enter a valid recipient email.');
      return;
    }
    if (!previewSubject.trim()) {
      message.warning('Subject is required.');
      return;
    }
    if (!stripHtml(renderedBodyHtml).trim()) {
      message.warning('Body is required.');
      return;
    }

    setSending(true);
    try {
      await callSendEmailTemplatePreview(selectedCode, {
        recipientEmail,
        recipientName: sendRecipientName.trim() || undefined,
        subject: previewSubject.trim(),
        bodyHtml: renderedBodyHtml,
      });
      message.success('Preview email has been sent.');
      setSendOpen(false);
    } catch (error) {
      message.error('Failed to send preview email.');
    } finally {
      setSending(false);
    }
  };

  const copyVariable = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      message.success(`${key} copied.`);
    } catch (error) {
      setBodyHtml((prev) => `${prev}<p>${key}</p>`);
      message.info(`${key} has been added to the body.`);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="saf-screen saf-email-cms-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Email Templates</h1>
          <p>Edit English email subjects and body content. Available variables are rendered before sending.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchTemplates} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
          <button type="button" className="saf-action-btn is-secondary" onClick={() => setPreviewOpen(true)} disabled={!selectedCode}>
            <EyeOutlined />
            <span>Preview</span>
          </button>
          <button type="button" className="saf-action-btn is-secondary" onClick={() => setSendOpen(true)} disabled={!selectedCode}>
            <SendOutlined />
            <span>Send</span>
          </button>
          <button type="button" className="saf-action-btn is-primary" onClick={saveTemplate} disabled={saving || !selectedCode}>
            <SaveOutlined />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      <div className="saf-email-layout">
        <aside className="saf-template-list">
          {templates.map((template) => (
            <button
              type="button"
              className={template.code === selectedCode ? 'is-active' : ''}
              key={template.code}
              onClick={() => fetchDetail(template.code)}
            >
              <strong>{template.name}</strong>
              <span>{template.isActive ? 'Active' : 'Inactive'}</span>
            </button>
          ))}
          {!templates.length && <p className="saf-template-empty">{loading ? 'Loading...' : 'No templates found.'}</p>}
        </aside>

        <section className="saf-panel saf-email-editor-panel">
          <div className="saf-panel-title">
            <h2>{detail.name || 'Template'}</h2>
            <p>Only email-safe body content is editable here. The outer mail layout is applied automatically.</p>
          </div>

          <label className="saf-form-field">
            <span>Subject</span>
            <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Email subject" />
          </label>

          <label className="saf-form-field">
            <span>Status</span>
            <select value={isActive ? 'Y' : 'N'} onChange={(event) => setIsActive(event.target.value === 'Y')}>
              <option value="Y">Active</option>
              <option value="N">Inactive</option>
            </select>
          </label>

          <div className="saf-email-editor">
            <span>Body</span>
            <CustomRichEditor
              value={bodyHtml}
              isEditable
              onChange={setBodyHtml}
              height={360}
              placeholder="Write email body content in English."
              variables={variables}
            />
          </div>

          {!!unknownVariables.length && (
            <p className="saf-email-warning">
              Unknown variable(s): {unknownVariables.join(', ')}
            </p>
          )}
        </section>

        <aside className="saf-panel saf-email-side-panel">
          <div className="saf-panel-title">
            <h2>Available Variables</h2>
            <p>Click a variable to copy it.</p>
          </div>
          <div className="saf-variable-list">
            {variables.map((variable) => (
              <button type="button" key={variable.key} onClick={() => copyVariable(variable.key)}>
                <strong>{variable.key}</strong>
                <span>{variable.description}</span>
              </button>
            ))}
          </div>

          <div className="saf-panel-title is-preview-title">
            <h2>Live Preview</h2>
            <p>{previewSubject || 'Subject preview'}</p>
          </div>
          <iframe className="saf-email-preview-frame" title="Email preview" sandbox="" srcDoc={previewHtml} />
        </aside>
      </div>

      <Modal
        title="Email Preview"
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        width={920}
        destroyOnHidden
      >
        <div className="saf-email-preview-modal">
          <strong>{previewSubject}</strong>
          <iframe title="Email preview modal" sandbox="" srcDoc={previewHtml} />
        </div>
      </Modal>

      <Modal
        title="Send Preview Email"
        open={sendOpen}
        onCancel={() => setSendOpen(false)}
        footer={[
          <button key="cancel" type="button" className="saf-action-btn is-secondary" onClick={() => setSendOpen(false)} disabled={sending}>
            Cancel
          </button>,
          <button key="send" type="button" className="saf-action-btn is-primary" onClick={sendPreviewEmail} disabled={sending}>
            <SendOutlined />
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </button>,
        ]}
        width={920}
        destroyOnHidden
      >
        <div className="saf-email-send-modal">
          <div className="saf-form-grid">
            <label className="saf-form-field">
              <span>Recipient Email *</span>
              <input
                value={sendRecipientEmail}
                onChange={(event) => setSendRecipientEmail(event.target.value)}
                placeholder="name@example.com"
                type="email"
              />
            </label>
            <label className="saf-form-field">
              <span>Recipient Name</span>
              <input
                value={sendRecipientName}
                onChange={(event) => setSendRecipientName(event.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>
          <div className="saf-email-send-subject">
            <span>Subject</span>
            <strong>{previewSubject || 'Subject preview'}</strong>
          </div>
          <iframe title="Email send preview" sandbox="" srcDoc={previewHtml} />
        </div>
      </Modal>
    </div>
  );
}

function resolveInitialCode(items: EmailTemplateListItem[]) {
  const pathCode = window.location.pathname.split('/').pop();
  if (items.some((item) => item.code === pathCode)) return pathCode ?? '';
  return items[0]?.code ?? '';
}

function parseVariables(value?: string): EmailTemplateVariable[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(decodeHtmlEntities(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function renderTemplate(value: string, variables: EmailTemplateVariable[]) {
  return variables.reduce((result, variable) => (
    result.replaceAll(variable.key, variable.sample || variable.key)
  ), value || '');
}

function findUnknownVariables(value: string, variables: EmailTemplateVariable[]) {
  const allowed = new Set(variables.map((variable) => variable.key));
  return Array.from(new Set(value.match(/\{\{[a-zA-Z0-9_]+\}\}/g) ?? []))
    .filter((token) => !allowed.has(token));
}

function stripHtml(value: string) {
  return normalizeStoredHtml(value).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
}

function buildEmailPreviewHtml(bodyHtml: string) {
  const normalizedHtml = normalizeStoredHtml(bodyHtml);

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin: 0; background: #f4f6f9; font-family: Arial, 'Segoe UI', sans-serif; color: #1f2937; }
          .mail-shell { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
          .mail-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
          .mail-header { padding: 24px 28px; background: #102033; color: #ffffff; font-size: 20px; font-weight: 700; }
          .mail-body { padding: 28px; font-size: 15px; line-height: 1.65; }
          .mail-body p { margin: 0 0 14px; }
          .mail-body a { color: #1f5b95; font-weight: 700; }
          .mail-footer { padding: 18px 28px; border-top: 1px solid #edf1f5; color: #64748b; font-size: 12px; line-height: 1.5; }
          img { max-width: 100%; height: auto; }
          table { max-width: 100%; }
        </style>
      </head>
      <body>
        <div class="mail-shell">
          <div class="mail-card">
            <div class="mail-header">KCAB INTERNATIONAL</div>
            <div class="mail-body">${normalizedHtml || '<p>No body content.</p>'}</div>
            <div class="mail-footer">This is an automated email from KCAB International.</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function normalizeStoredHtml(bodyHtml?: string) {
  const html = bodyHtml?.trim() ?? '';
  if (!html) return '';
  if (html.includes('<')) return html;
  if (!/&(?:amp|lt|gt|quot|#35|#39|#40|#41);/.test(html)) return html;

  return decodeHtmlEntities(html);
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#35;/g, '#')
    .replace(/&#40;/g, '(')
    .replace(/&#41;/g, ')')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
