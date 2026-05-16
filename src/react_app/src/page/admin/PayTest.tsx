'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Select } from 'antd';
import {
  CreditCardOutlined,
  ReloadOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  callGetPayTestEvents,
  callGetPayTestResult,
  callPreparePayTestPayment,
} from '@api/admin/PayTestApi';
import {
  PayTestEventOption,
  PayTestParticipantRequest,
  PayTestPaymentMethodCode,
  PayTestPricingOption,
  PayTestResult,
} from '@interface/admin/PayTest';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_TONE, PaymentStatus } from '@interface/admin/PaymentManagement';

declare global {
  interface Window {
    EXIMBAY?: {
      request_pay: (payload: Record<string, unknown>) => void;
    };
  }
}

const EMPTY_PARTICIPANT: PayTestParticipantRequest = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  organizationName: '',
  position: '',
  country: '',
};

const PAYMENT_METHOD_OPTIONS: Array<{
  value: PayTestPaymentMethodCode;
  label: string;
  brand: string;
  tone: string;
  description: string;
}> = [
  { value: 'P000', label: 'Credit Card', brand: 'CARD', tone: 'card', description: 'Visa, Mastercard, JCB' },
  { value: 'P001', label: 'PayPal', brand: 'PayPal', tone: 'paypal', description: 'Pay with PayPal' },
  { value: 'P302', label: 'KakaoPay', brand: 'kakao pay', tone: 'kakao', description: 'KakaoPay easy payment' },
  { value: 'P015', label: 'NaverPay', brand: 'N Pay', tone: 'naver', description: 'NaverPay card & point' },
];

const DEFAULT_PAYMENT_METHOD = PAYMENT_METHOD_OPTIONS[0].value;

function formatMoney(amount?: number | string | null, currency?: string | null) {
  const n = Number(amount ?? 0);
  const cur = currency || 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: cur === 'KRW' ? 0 : 2,
    }).format(Number.isFinite(n) ? n : 0);
  } catch {
    return `${cur} ${Number.isFinite(n) ? n.toLocaleString() : '0'}`;
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function statusBadge(status?: string | null) {
  const value = (status || 'pending') as PaymentStatus;
  const label = PAYMENT_STATUS_LABELS[value] ?? value;
  const tone = PAYMENT_STATUS_TONE[value] ?? 'gray';
  return <span className={`saf-status is-${tone}`}>{label}</span>;
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Browser is not available.'));
      return;
    }
    if (window.EXIMBAY) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Eximbay SDK.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Eximbay SDK.'));
    document.head.appendChild(script);
  });
}

export default function PayTest() {
  const { message } = App.useApp();
  const [events, setEvents] = useState<PayTestEventOption[]>([]);
  const [selectedEventSeq, setSelectedEventSeq] = useState<number | undefined>();
  const [selectedPricingSeq, setSelectedPricingSeq] = useState<number | undefined>();
  const [participant, setParticipant] = useState<PayTestParticipantRequest>(EMPTY_PARTICIPANT);
  const [callbackBaseUrl, setCallbackBaseUrl] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PayTestPaymentMethodCode>(DEFAULT_PAYMENT_METHOD);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState('');
  const [result, setResult] = useState<PayTestResult | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.eventSeq === selectedEventSeq),
    [events, selectedEventSeq],
  );

  const selectedPricing = useMemo(
    () => selectedEvent?.pricingList.find((pricing) => pricing.eventPricingSeq === selectedPricingSeq),
    [selectedEvent, selectedPricingSeq],
  );

  const eventOptions = useMemo(() => events.map((event) => ({
    value: event.eventSeq,
    label: event.title,
  })), [events]);

  const pricingOptions = useMemo(() => (selectedEvent?.pricingList ?? []).map((pricing) => ({
    value: pricing.eventPricingSeq,
    label: `${pricing.priceName} · ${formatMoney(pricing.amount, pricing.currencyCode)}`,
  })), [selectedEvent]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callGetPayTestEvents();
      const list = res?.item ?? [];
      setEvents(list);
      if (list.length) {
        setSelectedEventSeq((current) => current ?? list[0].eventSeq);
        setSelectedPricingSeq((current) => current ?? list[0].pricingList[0]?.eventPricingSeq);
      }
    } catch {
      message.error('Failed to load pay test events.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCallbackBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    if (!selectedEvent.pricingList.some((pricing) => pricing.eventPricingSeq === selectedPricingSeq)) {
      setSelectedPricingSeq(selectedEvent.pricingList[0]?.eventPricingSeq);
    }
  }, [selectedEvent, selectedPricingSeq]);

  const refreshResult = useCallback(async (orderId: string, silent = false) => {
    if (!orderId) return;
    try {
      const res = await callGetPayTestResult(orderId);
      setResult(res?.item ?? null);
    } catch {
      if (!silent) message.error('Failed to load payment test result.');
    }
  }, [message]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; orderId?: string };
      if (data?.type !== 'KCAB_EXIMBAY_RETURN') return;
      const orderId = data.orderId || latestOrderId;
      if (!orderId) return;
      setLatestOrderId(orderId);
      refreshResult(orderId, true);
      window.setTimeout(() => refreshResult(orderId, true), 2500);
      window.setTimeout(() => refreshResult(orderId, true), 6000);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [latestOrderId, refreshResult]);

  const updateParticipant = (key: keyof PayTestParticipantRequest, value: string) => {
    setParticipant((prev) => ({ ...prev, [key]: value }));
  };

  const startPayment = async () => {
    if (!selectedEvent || !selectedPricing) {
      message.warning('Please select an event and pricing.');
      return;
    }
    if (!participant.firstName.trim() || !participant.lastName.trim() || !participant.email.trim()) {
      message.warning('Please enter participant name and email.');
      return;
    }
    if (!callbackBaseUrl.trim()) {
      message.warning('Please enter callback base URL.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await callPreparePayTestPayment({
        eventSeq: selectedEvent.eventSeq,
        eventPricingSeq: selectedPricing.eventPricingSeq,
        participant,
        paymentMethod: selectedPaymentMethod,
        paymentMethods: [selectedPaymentMethod],
        lang: 'EN',
        callbackBaseUrl: callbackBaseUrl.trim(),
      });
      const prepared = res?.item;
      if (!prepared) {
        message.error('Payment preparation failed.');
        return;
      }
      setLatestOrderId(prepared.orderId);
      setResult(prepared.payment ?? null);
      await loadScript(prepared.sdkUrl);
      if (!window.EXIMBAY) {
        message.error('Eximbay SDK is not available.');
        return;
      }
      window.EXIMBAY.request_pay(prepared.eximbayRequest);
    } catch (error) {
      message.error('Failed to start Eximbay payment.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSummary = selectedPricing ? (
    <div className="saf-pay-test-summary">
      <span>{selectedPricing.currencyCode}</span>
      <strong>{formatMoney(selectedPricing.amount, selectedPricing.currencyCode)}</strong>
      <p>{selectedEvent?.title}</p>
      <p>{selectedPricing.priceName}</p>
    </div>
  ) : (
    <div className="saf-pay-test-summary is-empty">
      <span>No Pricing</span>
      <strong>-</strong>
      <p>Select a paid event pricing.</p>
    </div>
  );

  return (
    <section className="saf-screen saf-pay-test-screen">
      <header className="saf-screen-header">
        <div>
          <h1>Pay Test</h1>
          <p>Eximbay sandbox payment flow</p>
        </div>
        <div className="saf-screen-actions">
          <button type="button" className="saf-action-btn is-secondary" onClick={fetchEvents} disabled={loading}>
            <ReloadOutlined />
            Refresh
          </button>
        </div>
      </header>

      <div className="saf-pay-test-layout">
        <section className="saf-panel">
          <div className="saf-step-label">
            <span>STEP 1</span>
            <strong>Event & Pricing</strong>
          </div>
          <label className="saf-form-field">
            <span>Event</span>
            <Select
              value={selectedEventSeq}
              options={eventOptions}
              loading={loading}
              onChange={(value) => {
                const event = events.find((item) => item.eventSeq === value);
                setSelectedEventSeq(value);
                setSelectedPricingSeq(event?.pricingList[0]?.eventPricingSeq);
              }}
              placeholder="Select event"
            />
          </label>
          <label className="saf-form-field">
            <span>Pricing</span>
            <Select
              value={selectedPricingSeq}
              options={pricingOptions}
              onChange={(value) => setSelectedPricingSeq(value)}
              placeholder="Select pricing"
            />
          </label>
          <div className="saf-pay-test-event-meta">
            <span>{selectedEvent?.eventType ?? '-'}</span>
            <span>{formatDateTime(selectedEvent?.eventStartDt)}</span>
            <span>{selectedEvent?.location || '-'}</span>
          </div>
          {selectedSummary}
        </section>

        <section className="saf-panel">
          <div className="saf-step-label">
            <span>STEP 2</span>
            <strong>Participant</strong>
          </div>
          <div className="saf-pay-test-form-grid">
            <label className="saf-form-field">
              <span>First Name</span>
              <input value={participant.firstName} onChange={(e) => updateParticipant('firstName', e.target.value)} />
            </label>
            <label className="saf-form-field">
              <span>Middle Name</span>
              <input value={participant.middleName} onChange={(e) => updateParticipant('middleName', e.target.value)} />
            </label>
            <label className="saf-form-field">
              <span>Last Name</span>
              <input value={participant.lastName} onChange={(e) => updateParticipant('lastName', e.target.value)} />
            </label>
            <label className="saf-form-field is-wide">
              <span>Email</span>
              <input type="email" value={participant.email} onChange={(e) => updateParticipant('email', e.target.value)} />
            </label>
            <label className="saf-form-field">
              <span>Organization</span>
              <input value={participant.organizationName} onChange={(e) => updateParticipant('organizationName', e.target.value)} />
            </label>
            <label className="saf-form-field">
              <span>Position</span>
              <input value={participant.position} onChange={(e) => updateParticipant('position', e.target.value)} />
            </label>
            <label className="saf-form-field is-wide">
              <span>Country</span>
              <input
                value={participant.country}
                maxLength={100}
                onChange={(e) => updateParticipant('country', e.target.value)}
              />
            </label>
          </div>
        </section>

        <aside className="saf-panel">
          <div className="saf-step-label">
            <span>STEP 3</span>
            <strong>Payment</strong>
          </div>
          <label className="saf-form-field">
            <span>Payment Method</span>
            <div className="saf-pay-method-grid" role="radiogroup" aria-label="Payment method">
              {PAYMENT_METHOD_OPTIONS.map((option) => {
                const selected = selectedPaymentMethod === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    className={`saf-pay-method-button is-${option.tone}${selected ? ' is-selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => setSelectedPaymentMethod(option.value)}
                  >
                    <span className="saf-pay-method-brand">{option.brand}</span>
                    <span className="saf-pay-method-copy">
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </label>
          <label className="saf-form-field">
            <span>Callback Base URL</span>
            <input value={callbackBaseUrl} onChange={(e) => setCallbackBaseUrl(e.target.value)} />
          </label>
          {callbackBaseUrl.includes('localhost') && (
            <p className="saf-pay-test-warning">Use a public HTTPS tunnel for status callbacks.</p>
          )}
          <button
            type="button"
            className="saf-pay-test-submit"
            onClick={startPayment}
            disabled={submitting || !selectedPricing}
          >
            {submitting ? <ReloadOutlined /> : <SendOutlined />}
            Start Payment
          </button>

          <div className="saf-pay-test-result">
            <div>
              <span>Order ID</span>
              <strong>{latestOrderId || '-'}</strong>
            </div>
            <div>
              <span>Status</span>
              {result ? statusBadge(result.status) : <strong>-</strong>}
            </div>
            <div>
              <span>Amount</span>
              <strong>{result ? formatMoney(result.amount, result.currency) : '-'}</strong>
            </div>
            <div>
              <span>Transaction</span>
              <strong>{result?.pgTransactionId || '-'}</strong>
            </div>
            {result?.failedReason && <p className="saf-pay-test-error">{result.failedReason}</p>}
            {latestOrderId && (
              <button type="button" className="saf-action-btn is-secondary" onClick={() => refreshResult(latestOrderId)}>
                <CreditCardOutlined />
                Check Result
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
