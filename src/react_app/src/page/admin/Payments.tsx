'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { App, DatePicker, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  callCancelPayment,
  callGetPaymentDetail,
  callGetPaymentEventOptions,
  callGetPaymentList,
  callUpdatePaymentMemo,
} from '@api/admin/PaymentManagementApi';
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONE,
  PaymentDetail,
  PaymentEventOption,
  PaymentListItem,
  PaymentStatus,
  REFUND_STATUS_LABELS,
  REFUND_TYPE_LABELS,
} from '@interface/admin/PaymentManagement';
import { EVENT_TYPE_LABELS, EVENT_TYPE_TONE } from '@interface/event/EventManagement';
import AdminGridPagination, { useClientGridPagination } from './AdminGridPagination';

const STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = (
  Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]
).map((value) => ({ value, label: PAYMENT_STATUS_LABELS[value] }));

const CURRENCY_OPTIONS = [
  { value: 'KRW', label: 'KRW' },
  { value: 'USD', label: 'USD' },
];

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(amount: string | number | null | undefined, currency?: string | null): string {
  const n = toNumber(amount);
  const cur = currency || 'KRW';
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: cur === 'KRW' ? 0 : 2,
    });
    return formatter.format(n);
  } catch {
    return `${cur} ${n.toLocaleString()}`;
  }
}

function formatDateTime(value?: string | null): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function renderStatusBadge(status: PaymentStatus | string | null) {
  const value = (status ?? 'pending') as PaymentStatus;
  const label = PAYMENT_STATUS_LABELS[value] ?? value;
  const tone = PAYMENT_STATUS_TONE[value] ?? 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function renderEventTypeBadge(type?: string | null) {
  if (!type) return <span className="saf-muted-text">-</span>;
  const label = EVENT_TYPE_LABELS[type] ?? type;
  const tone = EVENT_TYPE_TONE[type] ?? 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

interface CancelModalState {
  open: boolean;
  reason: string;
}

const EMPTY_CANCEL: CancelModalState = { open: false, reason: '' };

export default function Payments() {
  const { message, modal } = App.useApp();

  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [eventOptions, setEventOptions] = useState<PaymentEventOption[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedEventSeqs, setSelectedEventSeqs] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<PaymentStatus[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState<PaymentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [memoDraft, setMemoDraft] = useState('');
  const [savingMemo, setSavingMemo] = useState(false);
  const [cancelState, setCancelState] = useState<CancelModalState>(EMPTY_CANCEL);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const pagination = useClientGridPagination(payments);

  const fetchEventOptions = async () => {
    try {
      const res = await callGetPaymentEventOptions();
      setEventOptions(res?.item ?? []);
    } catch {
      setEventOptions([]);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await callGetPaymentList({
        keyword: keyword.trim() || undefined,
        eventSeqs: selectedEventSeqs,
        statuses: selectedStatuses,
        pgProviders: ['eximbay'],
        paymentMethods: ['card'],
        currencies: selectedCurrencies,
        fromDate: dateRange?.[0] ? dateRange[0]!.startOf('day').toISOString() : undefined,
        toDate: dateRange?.[1] ? dateRange[1]!.endOf('day').toISOString() : undefined,
      });
      setPayments(res?.item ?? []);
    } catch {
      message.error('Failed to load payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventOptions();
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    let totalSettle = 0;
    let totalRefund = 0;
    let failed = 0;
    let paid = 0;
    for (const p of payments) {
      const settle = toNumber(p.settleAmount);
      if (p.status === 'paid' || p.status === 'refunded') {
        totalSettle += settle;
      }
      totalRefund += toNumber(p.refundedAmount);
      if (p.status === 'failed') failed += 1;
      if (p.status === 'paid') paid += 1;
    }
    return { totalSettle, totalRefund, failed, paid };
  }, [payments]);

  const openDetail = async (paymentSeq: number) => {
    setDetailLoading(true);
    try {
      const res = await callGetPaymentDetail(paymentSeq);
      const data = res?.item ?? null;
      setDetail(data);
      setMemoDraft(data?.adminMemo ?? '');
    } catch {
      message.error('Failed to load payment detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetail(null);
    setMemoDraft('');
    setCancelState(EMPTY_CANCEL);
  };

  const refreshDetail = async () => {
    if (!detail) return;
    await openDetail(detail.paymentSeq);
    await fetchPayments();
  };

  const saveMemo = async () => {
    if (!detail) return;
    setSavingMemo(true);
    try {
      await callUpdatePaymentMemo(detail.paymentSeq, memoDraft);
      message.success('Memo saved.');
      await refreshDetail();
    } catch {
      message.error('Failed to save memo.');
    } finally {
      setSavingMemo(false);
    }
  };

  const totalAmount = detail ? toNumber(detail.amount) : 0;
  const alreadyRefunded = detail ? toNumber(detail.refundedAmount) : 0;
  const cancellable = Math.max(0, totalAmount - alreadyRefunded);
  const canCancel = !!detail && detail.status === 'paid' && cancellable > 0;

  const openCancelModal = () => {
    if (!detail) return;
    setCancelState({
      open: true,
      reason: '',
    });
  };

  const submitCancel = async () => {
    if (!detail) return;
    if (!cancelState.reason.trim()) {
      message.warning('Cancel reason is required.');
      return;
    }
    setCancelSubmitting(true);
    try {
      await callCancelPayment(detail.paymentSeq, {
        reason: cancelState.reason.trim(),
      });
      message.success('Payment cancellation processed.');
      setCancelState(EMPTY_CANCEL);
      await refreshDetail();
    } catch (err: unknown) {
      const reason = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Failed to cancel payment.';
      modal.error({ title: 'Cancellation failed', content: reason });
    } finally {
      setCancelSubmitting(false);
    }
  };

  if (detail) {
    return (
      <div className="saf-screen saf-participant-admin-screen">
        <header className="saf-screen-header">
          <div>
            <h1>Payment #{detail.paymentSeq}</h1>
            <p>{detail.pgOrderId} · Eximbay Card</p>
          </div>
          <div className="saf-screen-actions">
            <button type="button" className="saf-action-btn is-secondary" onClick={closeDetail}>
              <ArrowLeftOutlined />
              <span>List</span>
            </button>
            <button type="button" className="saf-action-btn is-secondary" onClick={refreshDetail} disabled={detailLoading}>
              <ReloadOutlined />
              <span>Refresh</span>
            </button>
            {detail.receiptUrl && (
              <a className="saf-action-btn is-secondary" href={detail.receiptUrl} target="_blank" rel="noreferrer">
                <FileTextOutlined />
                <span>Receipt</span>
              </a>
            )}
            <button
              type="button"
              className="saf-action-btn is-primary"
              onClick={openCancelModal}
              disabled={!canCancel}
              title={!canCancel ? 'Only paid card payments can be cancelled.' : ''}
            >
              <StopOutlined />
              <span>Cancel Payment</span>
            </button>
          </div>
        </header>

        <div className="saf-participant-detail-grid">
          <section className="saf-panel">
            <div className="saf-panel-title"><h2>Payment</h2></div>
            <dl className="saf-participant-meta">
              <div><dt>Status</dt><dd>{renderStatusBadge(detail.status)}</dd></div>
              <div><dt>Amount</dt><dd>{formatMoney(detail.amount, detail.currency)}</dd></div>
              <div><dt>Original Amount</dt><dd>{detail.originalAmount != null ? formatMoney(detail.originalAmount, detail.currency) : '-'}</dd></div>
              <div><dt>Discount</dt><dd>{detail.discountAmount != null && toNumber(detail.discountAmount) > 0 ? `${formatMoney(detail.discountAmount, detail.currency)}${detail.discountCode ? ` · ${detail.discountCode}` : ''}` : '-'}</dd></div>
              <div><dt>Settle (KRW)</dt><dd>{detail.settleAmount != null ? formatMoney(detail.settleAmount, detail.settleCurrency ?? 'KRW') : '-'}</dd></div>
              <div><dt>FX Rate</dt><dd>{detail.fxRate != null ? Number(detail.fxRate).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '-'}</dd></div>
              <div><dt>Refunded</dt><dd>{formatMoney(detail.refundedAmount ?? 0, detail.currency)}</dd></div>
              <div><dt>Method</dt><dd>Card</dd></div>
              <div><dt>Card</dt><dd>{detail.cardCompany ? `${detail.cardCompany}${detail.cardLast4 ? ' ****' + detail.cardLast4 : ''}` : '-'}</dd></div>
              <div><dt>Approval No</dt><dd>{detail.approvalNo ?? '-'}</dd></div>
              <div><dt>Installment</dt><dd>{detail.installmentMonths ? `${detail.installmentMonths} months` : 'Single'}</dd></div>
              <div><dt>Paid At</dt><dd>{formatDateTime(detail.paidAt)}</dd></div>
              <div><dt>Cancelled At</dt><dd>{formatDateTime(detail.cancelledAt)}</dd></div>
              <div><dt>Cancel Reason</dt><dd>{detail.cancelReason ?? '-'}</dd></div>
              <div><dt>PG MID</dt><dd>{detail.pgMid ?? '-'}</dd></div>
              <div><dt>PG TX ID</dt><dd>{detail.pgTransactionId ?? '-'}</dd></div>
              <div><dt>Order ID</dt><dd>{detail.pgOrderId}</dd></div>
              <div><dt>PG Response</dt><dd>{detail.pgResponseCode ? `${detail.pgResponseCode}${detail.pgResponseMessage ? ` · ${detail.pgResponseMessage}` : ''}` : '-'}</dd></div>
              <div><dt>Verified At</dt><dd>{formatDateTime(detail.verifiedAt)}</dd></div>
              <div><dt>Webhook At</dt><dd>{formatDateTime(detail.webhookReceivedAt)}</dd></div>
              <div><dt>Failed Reason</dt><dd>{detail.failedReason ?? '-'}</dd></div>
            </dl>
          </section>

          <section className="saf-panel">
            <div className="saf-panel-title"><h2>Payer</h2></div>
            <dl className="saf-participant-meta">
              <div><dt>Name</dt><dd>{detail.payerName ?? '-'}</dd></div>
              <div><dt>Email</dt><dd>{detail.payerEmail ?? '-'}</dd></div>
              <div><dt>Country</dt><dd>{detail.payerCountry ?? '-'}</dd></div>
              <div><dt>Organization</dt><dd>{detail.payerOrganization ?? '-'}</dd></div>
              <div><dt>Position</dt><dd>{detail.payerPosition ?? '-'}</dd></div>
            </dl>
          </section>

          <section className="saf-panel">
            <div className="saf-panel-title"><h2>Event</h2></div>
            <dl className="saf-participant-meta">
              <div><dt>Event</dt><dd>{detail.eventTitle ?? '-'}</dd></div>
              <div><dt>Type</dt><dd>{renderEventTypeBadge(detail.eventType)}</dd></div>
              <div><dt>Start</dt><dd>{formatDateTime(detail.eventStartDt)}</dd></div>
              <div><dt>Participation</dt><dd>{detail.participationStatus ?? '-'}</dd></div>
            </dl>
          </section>

          <section className="saf-panel">
            <div className="saf-panel-title"><h2>Admin Memo</h2></div>
            <textarea
              className="saf-textarea"
              rows={4}
              value={memoDraft}
              onChange={(e) => setMemoDraft(e.target.value)}
              placeholder="Internal note (visible only to admins)"
            />
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <button type="button" className="saf-action-btn is-primary" onClick={saveMemo} disabled={savingMemo}>
                <SaveOutlined />
                <span>Save Memo</span>
              </button>
            </div>
          </section>

          <section className="saf-panel" style={{ gridColumn: '1 / -1' }}>
            <div className="saf-panel-title"><h2>Refund History</h2><p>{detail.refunds.length} record(s)</p></div>
            <table className="saf-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Request ID</th>
                  <th>PG Refund ID</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>PG Response</th>
                  <th>Reason</th>
                  <th>Requested</th>
                  <th>Processed</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {detail.refunds.map((r) => (
                  <tr key={r.refundSeq}>
                    <td>{REFUND_TYPE_LABELS[r.refundType] ?? r.refundType}</td>
                    <td>{formatMoney(r.amount, r.currency ?? detail.currency)}</td>
                    <td>{r.refundRequestId ?? '-'}</td>
                    <td>{r.pgRefundTransactionId ?? r.pgRefundId ?? '-'}</td>
                    <td>
                      {r.balanceBefore != null || r.balanceAfter != null
                        ? `${formatMoney(r.balanceBefore ?? 0, r.currency ?? detail.currency)} -> ${formatMoney(r.balanceAfter ?? 0, r.currency ?? detail.currency)}`
                        : '-'}
                    </td>
                    <td>{REFUND_STATUS_LABELS[r.status] ?? r.status}</td>
                    <td>{r.pgResponseCode ? `${r.pgResponseCode}${r.pgResponseMessage ? ` · ${r.pgResponseMessage}` : ''}` : '-'}</td>
                    <td title={r.reason}>{r.reason}</td>
                    <td>{formatDateTime(r.requestedAt)}</td>
                    <td>{formatDateTime(r.processedAt)}</td>
                    <td>{r.processedByName ?? r.requestedByName ?? '-'}</td>
                  </tr>
                ))}
                {!detail.refunds.length && (
                  <tr><td colSpan={11} className="saf-participant-empty"><span>No refund history.</span></td></tr>
                )}
              </tbody>
            </table>
          </section>

          {detail.rawResponse && (
            <section className="saf-panel" style={{ gridColumn: '1 / -1' }}>
              <div className="saf-panel-title"><h2>PG Raw Response</h2></div>
              <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 6, maxHeight: 240, overflow: 'auto' }}>
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(detail.rawResponse), null, 2);
                  } catch {
                    return detail.rawResponse;
                  }
                })()}
              </pre>
            </section>
          )}
        </div>

        <Modal
          title="Cancel Payment"
          open={cancelState.open}
          onCancel={() => setCancelState(EMPTY_CANCEL)}
          onOk={submitCancel}
          okText="Process Cancellation"
          confirmLoading={cancelSubmitting}
          okButtonProps={{ danger: true }}
        >
          <p className="saf-muted-text" style={{ marginTop: 0 }}>
            This will process the full remaining amount: {formatMoney(cancellable, detail.currency)}.
          </p>
          <div className="saf-form-row" style={{ marginTop: 12 }}>
            <label>Reason</label>
            <textarea
              className="saf-textarea"
              rows={3}
              value={cancelState.reason}
              onChange={(e) => setCancelState((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Why is this payment being cancelled?"
            />
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="saf-screen saf-participant-admin-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Payment Management</h1>
          <p>View Eximbay card payments. Filter by event, status, currency, or date to narrow down.</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchPayments} disabled={loading}>
            <ReloadOutlined />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <section className="saf-metric-grid">
        <article className="saf-metric-card is-green">
          <span>Total Settled (KRW)</span>
          <strong>{formatMoney(summary.totalSettle, 'KRW')}</strong>
        </article>
        <article className="saf-metric-card is-blue">
          <span>Paid Count</span>
          <strong>{summary.paid}</strong>
        </article>
        <article className="saf-metric-card is-yellow">
          <span>Refunded Amount</span>
          <strong>{formatMoney(summary.totalRefund, 'KRW')}</strong>
        </article>
        <article className="saf-metric-card is-red">
          <span>Failures</span>
          <strong>{summary.failed}</strong>
        </article>
      </section>

      <section className="saf-filter-row saf-participant-filter-row">
        <div className="saf-search">
          <SearchOutlined />
          <input
            value={keyword}
            placeholder="Order ID / TX ID / Payer name or email"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchPayments(); }}
          />
        </div>
        <Select
          mode="multiple"
          allowClear
          className="saf-filter-select saf-participant-event-select"
          placeholder="Events"
          value={selectedEventSeqs}
          onChange={(values) => setSelectedEventSeqs(values)}
          options={eventOptions.map((option) => ({
            value: option.eventSeq,
            label: `${option.title} · ${EVENT_TYPE_LABELS[option.eventType] ?? option.eventType}`,
          }))}
          maxTagCount="responsive"
        />
        <Select
          mode="multiple"
          allowClear
          className="saf-filter-select"
          placeholder="Status"
          value={selectedStatuses}
          onChange={(values) => setSelectedStatuses(values as PaymentStatus[])}
          options={STATUS_OPTIONS}
          maxTagCount="responsive"
        />
        <Select
          mode="multiple"
          allowClear
          className="saf-filter-select"
          placeholder="Currency"
          value={selectedCurrencies}
          onChange={(values) => setSelectedCurrencies(values)}
          options={CURRENCY_OPTIONS}
          maxTagCount="responsive"
        />
        <DatePicker.RangePicker
          className="saf-filter-select"
          value={dateRange as [Dayjs, Dayjs] | null}
          onChange={(values) => setDateRange((values as [Dayjs | null, Dayjs | null]) ?? null)}
          allowClear
        />
        <button type="button" onClick={fetchPayments}>Search</button>
      </section>

      <section className="saf-table-wrap">
        <table className="saf-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Event</th>
              <th>Payer</th>
              <th>Card</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'right' }}>Settle (KRW)</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Refunds</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pagedItems.map((p) => (
              <tr key={p.paymentSeq} onClick={() => openDetail(p.paymentSeq)} style={{ cursor: 'pointer' }}>
                <td>
                  <strong>{p.pgOrderId}</strong>
                  {p.pgTransactionId && <div style={{ fontSize: 11, color: '#888' }}>{p.pgTransactionId}</div>}
                </td>
                <td>{formatDateTime(p.paidAt ?? p.createdAt)}</td>
                <td>
                  <div>{p.eventTitle ?? '-'}</div>
                  {p.eventType && <div>{renderEventTypeBadge(p.eventType)}</div>}
                </td>
                <td>
                  <div>{p.payerName ?? '-'}</div>
                  {p.payerEmail && <div style={{ fontSize: 11, color: '#888' }}>{p.payerEmail}</div>}
                </td>
                <td>
                  <div>Card</div>
                  <div style={{ fontSize: 11, color: '#888' }}>
                    {p.cardCompany ? `${p.cardCompany}${p.cardLast4 ? ' ****' + p.cardLast4 : ''}` : 'Eximbay'}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>{formatMoney(p.amount, p.currency)}</td>
                <td style={{ textAlign: 'right' }}>
                  {p.settleAmount != null ? formatMoney(p.settleAmount, p.settleCurrency ?? 'KRW') : '-'}
                </td>
                <td>{renderStatusBadge(p.status)}</td>
                <td style={{ textAlign: 'center' }}>{p.refundCount > 0 ? p.refundCount : '-'}</td>
              </tr>
            ))}
            {!payments.length && (
              <tr>
                <td colSpan={9} className="saf-participant-empty">
                  <CreditCardOutlined />
                  <span>{loading ? 'Loading...' : 'No payments found.'}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdminGridPagination {...pagination} />
      </section>
    </div>
  );
}
