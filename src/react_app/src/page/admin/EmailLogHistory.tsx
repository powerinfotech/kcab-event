'use client';

import React, { useEffect, useState } from 'react';
import { App, Modal } from 'antd';
import {
  EyeOutlined,
  MailOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { callGetEmailTemplates } from '@api/admin/EmailTemplateApi';
import { callGetEmailLogDetail, callGetEmailLogs, callResendEmailLogs } from '@api/admin/EmailLogApi';
import { EmailTemplateListItem } from '@interface/admin/EmailTemplate';
import { EmailLogDetail, EmailLogListItem } from '@interface/admin/EmailLog';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

const STATUS_LABEL: Record<string, string> = {
  queued: 'Queued',
  sent: 'Sent',
  failed: 'Failed',
};

const STATUS_TONE: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
  queued: 'yellow',
  sent: 'green',
  failed: 'red',
};

const DEFAULT_LIMIT = 500;

export default function EmailLogHistory() {
  const { message, modal } = App.useApp();
  const [logs, setLogs] = useState<EmailLogListItem[]>([]);
  const [templates, setTemplates] = useState<EmailTemplateListItem[]>([]);
  const [selectedLogSeqs, setSelectedLogSeqs] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [templateCode, setTemplateCode] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [detail, setDetail] = useState<EmailLogDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const logPagination = useClientGridPagination(logs);
  const visibleLogSeqs = logPagination.pagedItems.map((log) => log.emailLogSeq);
  const allVisibleSelected = visibleLogSeqs.length > 0 && visibleLogSeqs.every((emailLogSeq) => selectedLogSeqs.includes(emailLogSeq));

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await callGetEmailLogs({
        keyword: keyword.trim() || undefined,
        status: status || undefined,
        templateCode: templateCode || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        limit: DEFAULT_LIMIT,
      });
      setLogs(res.item ?? []);
      setSelectedLogSeqs([]);
    } catch (error) {
      message.error('Failed to load email history.');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (emailLogSeq: number) => {
    setDetailLoading(true);
    try {
      const res = await callGetEmailLogDetail(emailLogSeq);
      setDetail(res.item);
    } catch (error) {
      message.error('Failed to load email detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await callGetEmailTemplates();
      setTemplates(res.item ?? []);
    } catch (error) {
      message.error('Failed to load email templates.');
    }
  };

  const toggleLogSelection = (emailLogSeq: number) => {
    setSelectedLogSeqs((prev) => (
      prev.includes(emailLogSeq)
        ? prev.filter((seq) => seq !== emailLogSeq)
        : [...prev, emailLogSeq]
    ));
  };

  const toggleVisibleSelection = () => {
    setSelectedLogSeqs((prev) => {
      if (allVisibleSelected) {
        return prev.filter((seq) => !visibleLogSeqs.includes(seq));
      }
      return Array.from(new Set([...prev, ...visibleLogSeqs]));
    });
  };

  const confirmResend = () => {
    if (!selectedLogSeqs.length) {
      message.warning('Please select email logs to resend.');
      return;
    }

    modal.confirm({
      title: 'Resend Selected Emails',
      content: `Do you want to resend ${selectedLogSeqs.length} selected email(s)? Sent At will be updated after successful delivery.`,
      okText: 'Send',
      cancelText: 'Cancel',
      centered: true,
      onOk: resendSelectedLogs,
    });
  };

  const resendSelectedLogs = async () => {
    setResending(true);
    try {
      const res = await callResendEmailLogs({ emailLogSeqs: selectedLogSeqs });
      const result = res.item;
      message.success(
        result
          ? `Resend complete. Sent: ${result.successCount}, Failed: ${result.failedCount}.`
          : 'Resend complete.',
      );
      await fetchLogs();
    } catch (error) {
      message.error('Failed to resend selected emails.');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchLogs();
  }, []);

  return (
    <div className="saf-screen saf-email-history-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Email History</h1>
          <p>Review delivery status, recipients, and template-based email logs.</p>
        </div>
        <div className="saf-screen-actions">
          <button
            type="button"
            className="saf-action-btn is-primary"
            onClick={confirmResend}
            disabled={!selectedLogSeqs.length || loading || resending}
          >
            <SendOutlined />
            <span>{resending ? 'Sending...' : `Resend${selectedLogSeqs.length ? ` (${selectedLogSeqs.length})` : ''}`}</span>
          </button>
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchLogs} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <section className="saf-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Search by recipient, subject, or template"
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') fetchLogs();
            }}
          />
        </div>
        <select className="saf-filter-select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All Status</option>
          <option value="queued">Queued</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
        <select className="saf-filter-select" value={templateCode} onChange={(event) => setTemplateCode(event.target.value)}>
          <option value="">All Templates</option>
          {templates.map((template) => (
            <option key={template.code} value={template.code}>{template.name}</option>
          ))}
        </select>
        <input
          className="saf-filter-date"
          type="date"
          value={fromDate}
          aria-label="From date"
          onChange={(event) => setFromDate(event.target.value)}
        />
        <input
          className="saf-filter-date"
          type="date"
          value={toDate}
          aria-label="To date"
          onChange={(event) => setToDate(event.target.value)}
        />
        <button type="button" onClick={fetchLogs}>Search</button>
      </section>

      <section className="saf-table-wrap">
        <table className="saf-table saf-email-log-table">
          <thead>
            <tr>
              <th className="saf-email-log-select-col">
                <input
                  type="checkbox"
                  aria-label="Select visible email logs"
                  checked={allVisibleSelected}
                  disabled={!visibleLogSeqs.length}
                  onChange={toggleVisibleSelection}
                />
              </th>
              <th>Status</th>
              <th>Recipient</th>
              <th>Template</th>
              <th>Subject</th>
              <th>Sent At</th>
              <th>Created At</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {logPagination.pagedItems.map((log) => (
              <tr key={log.emailLogSeq} onClick={() => openDetail(log.emailLogSeq)}>
                <td className="saf-email-log-select-col" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    aria-label={`Select email log ${log.emailLogSeq}`}
                    checked={selectedLogSeqs.includes(log.emailLogSeq)}
                    onChange={() => toggleLogSelection(log.emailLogSeq)}
                  />
                </td>
                <td><StatusBadge status={log.status} /></td>
                <td>
                  <strong>{log.recipientEmail}</strong>
                  {log.recipientName && <span>{log.recipientName}</span>}
                </td>
                <td>
                  <strong>{log.templateName || '-'}</strong>
                  {log.templateCode && <span>{log.templateCode}</span>}
                </td>
                <td>
                  <strong>{log.subject}</strong>
                  {log.errorMessage && <span className="is-error">{log.errorMessage}</span>}
                </td>
                <td>{formatDate(log.sentAt)}</td>
                <td>{formatDate(log.createdAt)}</td>
                <td>
                  <button
                    type="button"
                    className="saf-table-icon-btn"
                    aria-label="View email detail"
                    onClick={(event) => {
                      event.stopPropagation();
                      openDetail(log.emailLogSeq);
                    }}
                  >
                    <EyeOutlined />
                  </button>
                </td>
              </tr>
            ))}
            {!logs.length && (
              <tr>
                <td colSpan={8} className="saf-user-empty">
                  <MailOutlined />
                  <span>{loading ? 'Loading...' : 'No email history found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination {...logPagination} />
      </section>

      <Modal
        title="Email Detail"
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
        width={900}
        destroyOnHidden
        confirmLoading={detailLoading}
      >
        {detail && (
          <div className="saf-email-detail">
            <dl>
              <div><dt>Status</dt><dd><StatusBadge status={detail.status} /></dd></div>
              <div><dt>Template</dt><dd>{detail.templateName || '-'}{detail.templateCode ? ` (${detail.templateCode})` : ''}</dd></div>
              <div><dt>Recipient</dt><dd>{detail.recipientEmail}{detail.recipientName ? ` (${detail.recipientName})` : ''}</dd></div>
              <div><dt>Subject</dt><dd>{detail.subject}</dd></div>
              <div><dt>Sent At</dt><dd>{formatDate(detail.sentAt)}</dd></div>
              {detail.errorMessage && <div><dt>Error</dt><dd className="is-error">{detail.errorMessage}</dd></div>}
            </dl>
            <iframe
              title="Email body preview"
              sandbox=""
              srcDoc={buildEmailPreviewHtml(detail.bodyHtml)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const tone = STATUS_TONE[status ?? ''] ?? 'gray';
  const label = STATUS_LABEL[status ?? ''] ?? status ?? '-';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildEmailPreviewHtml(bodyHtml?: string) {
  const normalizedHtml = normalizeStoredHtml(bodyHtml);
  if (!normalizedHtml) {
    return '<!doctype html><html><body style="font-family:Arial,sans-serif;color:#64748b;">No email body.</body></html>';
  }

  if (/<html[\s>]/i.test(normalizedHtml)) {
    return normalizedHtml;
  }

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin: 0; padding: 24px; background: #ffffff; font-family: Arial, sans-serif; color: #111827; }
          img { max-width: 100%; height: auto; }
          table { max-width: 100%; }
        </style>
      </head>
      <body>${normalizedHtml}</body>
    </html>
  `;
}

function normalizeStoredHtml(bodyHtml?: string) {
  const html = bodyHtml?.trim() ?? '';
  if (!html) return '';
  if (html.includes('<')) return html;
  if (!/&(?:amp|lt|gt|quot|#39);/.test(html)) return html;

  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
