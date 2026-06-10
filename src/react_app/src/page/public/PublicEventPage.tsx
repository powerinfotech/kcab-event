import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, Select } from 'antd';
import { callGetPublicEventPage } from '@api/event/EventApi';
import {
  callGetPublicRegistrationParticipant,
  callGetPublicRegistrationPaymentResult,
  callGetPublicRegistrationPricing,
  callPreparePublicRegistrationPayment,
  callValidatePublicRegistrationDiscountCode,
} from '@api/public/PublicRegistrationApi';
import { EventPageBlock, EventPageSection, EventRegistrationFieldItem, PublicEventPage as PublicEventPageModel } from '@interface/event/EventManagement';
import {
  PublicRegistrationParticipantRequest,
  PublicRegistrationDiscountValidationResult,
  PublicRegistrationPaymentMethodCode,
  PublicRegistrationPaymentResult,
  PublicRegistrationPricingOption,
} from '@interface/public/PublicRegistration';
import HeroSeoulImage from '../../assets/images/saf-renewal/official-events-hero-wide-figma.png';
import VenueFigmaImage from '../../assets/images/saf-renewal/official-events-venue-figma.png';
import RibbonFigmaImage from '../../assets/images/saf-renewal/official-events-ribbon-large-figma.png';
import { usePublicNavigate } from '@hook/usePublicNavigate';

declare global {
  interface Window {
    EXIMBAY?: {
      request_pay: (payload: Record<string, unknown>) => void;
    };
  }
}

interface PublicEventPageProps {
  urlSlug: string;
}

interface PageTheme {
  heroBackgroundType: 'image' | 'color';
  heroOverlay: 'dark' | 'light' | 'none';
  themeColor: string;
  heroBackgroundColor: string;
}

interface PageSettings {
  registrationStatusLabel?: string;
  contactEmail?: string;
  contactPhone?: string;
  organizerName?: string;
  infoNote?: string;
  sourceUrl?: string;
  [key: string]: unknown;
}

interface SectionSettings {
  backgroundStyle?: 'white' | 'soft' | 'brand-purple' | 'brand-blue' | 'brand-pink' | 'brand-gradient' | 'lavender' | 'blue' | 'mint' | 'rose' | 'peach' | 'gold' | 'slate' | 'navy';
  width?: 'normal' | 'wide';
  spacing?: 'compact' | 'normal' | 'spacious';
}

const DEFAULT_THEME: PageTheme = {
  heroBackgroundType: 'color',
  heroOverlay: 'dark',
  themeColor: 'navy',
  heroBackgroundColor: '#102033',
};

const THEME_COLOR_MAP: Record<string, string> = {
  navy: '#102033',
  blue: '#1f5b95',
  gold: '#b88900',
  gray: '#475569',
};

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');
const officialVenueImageUrl = assetSrc(VenueFigmaImage);
const officialRibbonImageUrl = assetSrc(RibbonFigmaImage);

type RegistrationActionType = 'direct' | 'external' | 'none';
type RegistrationStep = 1 | 2 | 3;
type ParticipantLookupStatus = 'idle' | 'checking' | 'found' | 'notFound' | 'invalid' | 'error';

const EMPTY_REGISTRATION_PARTICIPANT: PublicRegistrationParticipantRequest = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  organizationName: '',
  position: '',
  country: '',
  phone: '',
  address: '',
  city: '',
  nationality: '',
  residenceCountry: '',
};

const REGISTRATION_STEPS: Array<{ step: RegistrationStep; label: string; description: string }> = [
  { step: 1, label: 'Participant Information', description: 'Your registration details' },
  { step: 2, label: 'Ticket & Payment', description: 'Ticket & secure payment' },
  { step: 3, label: 'Registration Complete', description: 'Registration confirmed' },
];

const PAYMENT_METHOD_OPTIONS: Array<{
  value: PublicRegistrationPaymentMethodCode;
  label: string;
  brand: string;
  description: string;
}> = [
  { value: 'P000', label: 'Credit Card', brand: 'CARD', description: 'Visa, Mastercard, JCB' },
  { value: 'P001', label: 'PayPal', brand: 'PayPal', description: 'Pay with PayPal' },
];

const DEFAULT_PAYMENT_METHOD = PAYMENT_METHOD_OPTIONS[0].value;

const COUNTRY_OPTIONS = [
  'Korea, Republic of',
  'United States',
  'United Kingdom',
  'Japan',
  'China',
  'Singapore',
  'Hong Kong',
  'Australia',
  'Canada',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Malaysia',
  'Philippines',
  'Thailand',
  'Vietnam',
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Austria',
  'Bangladesh',
  'Belgium',
  'Brazil',
  'Bulgaria',
  'Cambodia',
  'Chile',
  'Colombia',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Egypt',
  'Finland',
  'Greece',
  'Hungary',
  'Ireland',
  'Israel',
  'Italy',
  'Kazakhstan',
  'Laos',
  'Mexico',
  'Mongolia',
  'Myanmar',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Pakistan',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Saudi Arabia',
  'South Africa',
  'Spain',
  'Sri Lanka',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Turkey',
  'United Arab Emirates',
  'Uzbekistan',
].map((country) => ({ label: country, value: country }));

const DEFAULT_REGISTRATION_FIELDS: EventRegistrationFieldItem[] = [
  { fieldCode: 'email', fieldLabel: 'Email', enabledYn: 'Y', requiredYn: 'Y', sortSeq: 1 },
  { fieldCode: 'first_name', fieldLabel: 'First Name', enabledYn: 'Y', requiredYn: 'Y', sortSeq: 2 },
  { fieldCode: 'middle_name', fieldLabel: 'Middle Name', enabledYn: 'Y', requiredYn: 'N', sortSeq: 3 },
  { fieldCode: 'last_name', fieldLabel: 'Last Name', enabledYn: 'Y', requiredYn: 'Y', sortSeq: 4 },
  { fieldCode: 'organization_name', fieldLabel: 'Company Name', enabledYn: 'Y', requiredYn: 'N', sortSeq: 6 },
  { fieldCode: 'position', fieldLabel: 'Position', enabledYn: 'Y', requiredYn: 'N', sortSeq: 7 },
  { fieldCode: 'residence_country', fieldLabel: 'Country of Residence', enabledYn: 'Y', requiredYn: 'N', sortSeq: 11 },
];

const HIDDEN_EVENT_SECTION_TYPES = new Set(['contact']);

const REGISTRATION_FIELD_INPUTS: Record<string, {
  key: keyof PublicRegistrationParticipantRequest;
  autoComplete?: string;
  half?: boolean;
  wide?: boolean;
  select?: boolean;
}> = {
  email: { key: 'email', autoComplete: 'email', wide: true },
  first_name: { key: 'firstName', autoComplete: 'given-name' },
  middle_name: { key: 'middleName', autoComplete: 'additional-name' },
  last_name: { key: 'lastName', autoComplete: 'family-name' },
  phone: { key: 'phone', autoComplete: 'tel', wide: true },
  organization_name: { key: 'organizationName', autoComplete: 'organization', wide: true },
  position: { key: 'position', autoComplete: 'organization-title', wide: true },
  address: { key: 'address', autoComplete: 'street-address', wide: true },
  city: { key: 'city', autoComplete: 'address-level2', half: true },
  nationality: { key: 'nationality', select: true, half: true },
  residence_country: { key: 'residenceCountry', select: true, wide: true },
};

// Cache loaded event-page data by slug so re-navigating to the event detail /
// registration pages renders instantly (no loading flash), like the static pages.
// Stale-while-revalidate: the fetch effect still re-fetches in the background.
const eventPageCache = new Map<string, PublicEventPageModel | null>();

const PublicEventPage: React.FC<PublicEventPageProps> = ({ urlSlug }) => {
  const [page, setPage] = useState<PublicEventPageModel | null>(() => eventPageCache.get(urlSlug) ?? null);
  const [loading, setLoading] = useState(() => !eventPageCache.get(urlSlug));

  useEffect(() => {
    let mounted = true;
    const cached = eventPageCache.get(urlSlug);
    if (cached) {
      setPage(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    callGetPublicEventPage(urlSlug)
      .then((res) => {
        const item = res?.item ?? null;
        if (item) eventPageCache.set(urlSlug, item);
        if (mounted) setPage(item);
      })
      .catch(() => {
        if (mounted && !cached) setPage(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [urlSlug]);

  const visibleSections = useMemo(
    () => (page?.sections ?? []).filter((section) => (
      section.useYn !== 'N' && !HIDDEN_EVENT_SECTION_TYPES.has(section.sectionType)
    )),
    [page],
  );
  const navSections = useMemo(
    () => visibleSections.filter((section) => section.navLabel || section.title),
    [visibleSections],
  );
  const theme = useMemo(() => parseTheme(page?.themeJson), [page?.themeJson]);
  const pageSettings = useMemo(() => parsePageSettings(page?.settingsJson), [page?.settingsJson]);
  const accentColor = getThemeColor(theme.themeColor);
  const handleNavigate = usePublicNavigate();
  const registrationActionType = normalizeRegistrationType(page?.registrationType);
  const externalRegistrationUrl = registrationActionType === 'external' ? page?.registrationUrl?.trim() ?? '' : '';
  const showRegistrationCta = registrationActionType === 'direct' || !!externalRegistrationUrl;

  const openRegistration = useCallback(() => {
    if (registrationActionType === 'external') {
      if (!externalRegistrationUrl) return;
      window.open(externalRegistrationUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (registrationActionType !== 'direct') return;
    handleNavigate(`/event/${encodeURIComponent(page?.urlSlug || urlSlug)}/register`);
  }, [externalRegistrationUrl, handleNavigate, page?.urlSlug, registrationActionType, urlSlug]);

  if (loading) {
    return (
      <main className="pub-page-content" aria-busy="true">
        <section
          className="pub-section pub-event-builder-hero saf-event-detail-hero"
          style={{
            backgroundImage: `url("${assetSrc(HeroSeoulImage)}")`,
            backgroundPosition: 'center top',
            backgroundSize: 'cover',
          }}
        />
      </main>
    );
  }

  if (!page) {
    return (
      <main className="pub-page-content">
        <section className="pub-section section-text size-medium pub-event-builder-section">
          <div className="pub-section-inner">
            <h3 className="text-title" style={{ paddingLeft: 0 }}>Event not found</h3>
            <p className="text-content">The event page is not published or the URL is incorrect.</p>
          </div>
        </section>
      </main>
    );
  }

  const heroTitle = page.heroTitle || page.pageTitle || page.eventTitle;
  const heroSubtitle = page.heroSubtitle || page.pageSubtitle || formatEventMeta(page);
  const fallbackHeroImageUrl = assetSrc(HeroSeoulImage);
  const useFigmaOfficialEventHero = page.urlSlug === 'asia-civil-law-summit-demo';
  const heroImageUrl = useFigmaOfficialEventHero ? fallbackHeroImageUrl : page.heroImageUrl || fallbackHeroImageUrl;
  const heroTheme = useFigmaOfficialEventHero || !page.heroImageUrl ? { ...theme, heroBackgroundType: 'image' as const } : theme;
  const heroStyle = useFigmaOfficialEventHero
    ? {
      backgroundImage: `url("${heroImageUrl}")`,
      backgroundPosition: 'center top',
      backgroundSize: 'cover',
    }
    : buildHeroStyle(heroTheme, heroImageUrl);
  const primarySection = navSections.find((section) => section.sectionType === 'program') ?? navSections[0];
  const primarySectionLabel = primarySection?.sectionType === 'program'
    ? 'View Program'
    : `View ${primarySection?.title || primarySection?.navLabel || 'Details'}`;

  return (
    <>
      <main className="pub-page-content">
        <section className="pub-section pub-event-builder-hero saf-event-detail-hero" style={heroStyle}>
          <div className="saf-renewal-shell saf-event-detail-hero-inner">
            <div className="hero-content pub-event-hero-content saf-event-detail-hero-copy">
              <p className="saf-event-detail-eyebrow">Official Event</p>
              <h1 className="hero-title">{heroTitle}</h1>
              {heroSubtitle && <p className="hero-subtitle">{heroSubtitle}</p>}
              {primarySection && (
                <a className="saf-event-detail-hero-cta" href={`#${primarySection.anchorId || primarySection.sectionKey}`}>
                  {primarySectionLabel}
                </a>
              )}
            </div>
            <EventHeroInfoCard
              page={page}
              settings={pageSettings}
              showRegistrationButton={showRegistrationCta}
              onRegister={openRegistration}
            />
          </div>
        </section>

        {navSections.length > 0 && (
          <nav className="pub-event-page-nav">
            {navSections.map((section) => (
              <a key={section.sectionSeq} href={`#${section.anchorId || section.sectionKey}`}>
                {section.title || section.navLabel}
              </a>
            ))}
          </nav>
        )}

        <div className="pub-event-detail-body">
          {visibleSections.map((section) => (
            <EventPageSectionRenderer key={section.sectionSeq} section={section} accentColor={accentColor} />
          ))}
        </div>
      </main>
      {showRegistrationCta && (
        <button
          type="button"
          className="pub-event-floating-register"
          aria-label={`Register for ${heroTitle}`}
          onClick={openRegistration}
        >
          Register
        </button>
      )}
      <button
        type="button"
        className={`pub-event-scroll-top${showRegistrationCta ? ' has-register-button' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span aria-hidden="true">{'\u2191'}</span>
      </button>
    </>
  );
};

export const PublicEventRegistrationPage: React.FC<PublicEventPageProps> = ({ urlSlug }) => {
  const { message } = App.useApp();
  const [page, setPage] = useState<PublicEventPageModel | null>(() => eventPageCache.get(urlSlug) ?? null);
  const [loading, setLoading] = useState(() => !eventPageCache.get(urlSlug));
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>(1);
  const [participant, setParticipant] = useState<PublicRegistrationParticipantRequest>(EMPTY_REGISTRATION_PARTICIPANT);
  const [pricingList, setPricingList] = useState<PublicRegistrationPricingOption[]>([]);
  const [selectedPricingSeq, setSelectedPricingSeq] = useState<number | undefined>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PublicRegistrationPaymentMethodCode>(DEFAULT_PAYMENT_METHOD);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [discountResult, setDiscountResult] = useState<PublicRegistrationDiscountValidationResult | null>(null);
  const [discountApplying, setDiscountApplying] = useState(false);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [submittingRegistration, setSubmittingRegistration] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [participantLookupLoading, setParticipantLookupLoading] = useState(false);
  const [participantLookupStatus, setParticipantLookupStatus] = useState<ParticipantLookupStatus>('idle');
  const [latestOrderId, setLatestOrderId] = useState('');
  const [registrationResult, setRegistrationResult] = useState<PublicRegistrationPaymentResult | null>(null);
  const verificationRunRef = useRef(0);
  const participantLookupRunRef = useRef(0);
  const latestLookupEmailRef = useRef('');
  const handleNavigate = usePublicNavigate();

  useEffect(() => {
    let mounted = true;
    const cached = eventPageCache.get(urlSlug);
    if (cached) {
      setPage(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    callGetPublicEventPage(urlSlug)
      .then((res) => {
        const item = res?.item ?? null;
        if (item) eventPageCache.set(urlSlug, item);
        if (mounted) setPage(item);
      })
      .catch(() => {
        if (mounted && !cached) setPage(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [urlSlug]);

  const pageSettings = useMemo(() => parsePageSettings(page?.settingsJson), [page?.settingsJson]);
  const registrationActionType = normalizeRegistrationType(page?.registrationType);
  const externalRegistrationUrl = registrationActionType === 'external' ? page?.registrationUrl?.trim() ?? '' : '';
  const selectedPricing = useMemo(
    () => pricingList.find((pricing) => pricing.eventPricingSeq === selectedPricingSeq),
    [pricingList, selectedPricingSeq],
  );
  const appliedDiscount = discountResult?.valid ? discountResult : null;
  const selectedOriginalAmount = selectedPricing ? Number(selectedPricing.amount) : 0;
  const selectedDiscountAmount = appliedDiscount ? Number(appliedDiscount.discountAmount ?? 0) : 0;
  const selectedFinalAmount = appliedDiscount
    ? Number(appliedDiscount.finalAmount ?? Math.max(selectedOriginalAmount - selectedDiscountAmount, 0))
    : selectedOriginalAmount;
  const eventPath = `/event/${encodeURIComponent(page?.urlSlug || urlSlug)}`;
  const backToEvent = useCallback(() => {
    handleNavigate(eventPath);
  }, [eventPath, handleNavigate]);

  const fetchRegistrationPricing = useCallback(async () => {
    if (!page?.eventSeq) return;
    setLoadingPricing(true);
    try {
      const res = await callGetPublicRegistrationPricing(page.eventSeq);
      const list = res?.item ?? [];
      setPricingList(list);
      setSelectedPricingSeq((current) => {
        if (current && list.some((pricing) => pricing.eventPricingSeq === current)) {
          return current;
        }
        return list[0]?.eventPricingSeq;
      });
    } catch {
      message.error('Failed to load registration pricing.');
    } finally {
      setLoadingPricing(false);
    }
  }, [message, page?.eventSeq]);

  useEffect(() => {
    if (registrationActionType === 'direct' && page?.eventSeq) {
      fetchRegistrationPricing();
    }
  }, [fetchRegistrationPricing, page?.eventSeq, registrationActionType]);

  const verifyPublicPayment = useCallback(async (orderId: string) => {
    if (!orderId) return;

    const runId = verificationRunRef.current + 1;
    verificationRunRef.current = runId;
    setVerifyingPayment(true);

    const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
    for (let attempt = 0; attempt < 12; attempt += 1) {
      if (attempt > 0) {
        await wait(2500);
      }
      if (verificationRunRef.current !== runId) return;

      try {
        const res = await callGetPublicRegistrationPaymentResult(orderId);
        const payment = res?.item ?? null;
        setRegistrationResult(payment);
        const status = payment?.status?.toLowerCase();
        if (status === 'paid' && payment?.paymentSeq) {
          setVerifyingPayment(false);
          setRegistrationStep(3);
          message.success('Registration payment has been confirmed.');
          return;
        }
        if (status === 'failed' || status === 'cancelled') {
          setVerifyingPayment(false);
          message.error(payment?.failedReason || 'Payment was not completed.');
          return;
        }
      } catch {
        if (attempt === 0) {
          message.warning('Payment result is not ready yet. We will keep checking.');
        }
      }
    }

    if (verificationRunRef.current === runId) {
      setVerifyingPayment(false);
      message.warning('Payment window returned, but confirmation is still pending. Please check again shortly.');
    }
  }, [message]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; orderId?: string };
      if (data?.type !== 'KCAB_EXIMBAY_RETURN') return;
      const orderId = data.orderId || latestOrderId;
      if (!orderId) return;
      setLatestOrderId(orderId);
      verifyPublicPayment(orderId);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [latestOrderId, verifyPublicPayment]);

  const lookupParticipantByEmail = useCallback(async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !isValidRegistrationEmail(normalizedEmail)) {
      setParticipantLookupLoading(false);
      setParticipantLookupStatus(normalizedEmail ? 'invalid' : 'idle');
      return;
    }

    const runId = participantLookupRunRef.current + 1;
    participantLookupRunRef.current = runId;
    latestLookupEmailRef.current = normalizedEmail;
    setParticipantLookupLoading(true);
    setParticipantLookupStatus('checking');

    try {
      const res = await callGetPublicRegistrationParticipant(normalizedEmail);
      if (participantLookupRunRef.current !== runId || latestLookupEmailRef.current !== normalizedEmail) {
        return;
      }
      const foundParticipant = res?.item ?? null;
      if (!foundParticipant?.email) {
        setParticipantLookupStatus('notFound');
        return;
      }
      setParticipant((current) => {
        if (current.email.trim().toLowerCase() !== normalizedEmail) {
          return current;
        }
        return {
          ...current,
          firstName: foundParticipant.firstName ?? '',
          middleName: foundParticipant.middleName ?? '',
          lastName: foundParticipant.lastName ?? '',
          organizationName: foundParticipant.organizationName ?? '',
          position: foundParticipant.position ?? '',
          country: foundParticipant.country ?? foundParticipant.residenceCountry ?? '',
          phone: foundParticipant.phone ?? '',
          address: foundParticipant.address ?? '',
          city: foundParticipant.city ?? '',
          nationality: foundParticipant.nationality ?? '',
          residenceCountry: foundParticipant.residenceCountry ?? foundParticipant.country ?? '',
        };
      });
      setParticipantLookupStatus('found');
    } catch {
      if (participantLookupRunRef.current === runId && latestLookupEmailRef.current === normalizedEmail) {
        setParticipantLookupStatus('error');
      }
    } finally {
      if (participantLookupRunRef.current === runId && latestLookupEmailRef.current === normalizedEmail) {
        setParticipantLookupLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const email = participant.email.trim();
    latestLookupEmailRef.current = email.toLowerCase();
    if (!email) {
      setParticipantLookupLoading(false);
      setParticipantLookupStatus('idle');
      return undefined;
    }
    if (!isValidRegistrationEmail(email)) {
      setParticipantLookupLoading(false);
      setParticipantLookupStatus('invalid');
      return undefined;
    }
    const timer = window.setTimeout(() => {
      lookupParticipantByEmail(email);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [lookupParticipantByEmail, participant.email]);

  const updateParticipant = useCallback((key: keyof PublicRegistrationParticipantRequest, value: string) => {
    if (key === 'email') {
      const previousLookupEmail = latestLookupEmailRef.current;
      latestLookupEmailRef.current = value.trim().toLowerCase();
      setParticipantLookupLoading(false);
      setParticipantLookupStatus('idle');
      setParticipant((prev) => {
        if (participantLookupStatus === 'found' && value.trim().toLowerCase() !== previousLookupEmail) {
          return { ...EMPTY_REGISTRATION_PARTICIPANT, email: value };
        }
        return { ...prev, email: value };
      });
      return;
    }
    setParticipant((prev) => ({ ...prev, [key]: value }));
  }, [participantLookupStatus]);

  const selectPricing = useCallback((value: number | undefined) => {
    setSelectedPricingSeq(value);
    setDiscountResult(null);
  }, []);

  const updateDiscountCodeInput = useCallback((value: string) => {
    setDiscountCodeInput(value.toUpperCase());
    setDiscountResult(null);
  }, []);

  const applyDiscountCode = useCallback(async () => {
    if (!page?.eventSeq || !selectedPricing) {
      message.warning('Please select a ticket before applying a discount code.');
      return;
    }
    const code = discountCodeInput.trim().toUpperCase();
    if (!code) {
      setDiscountResult({
        valid: false,
        status: 'empty',
        message: 'Enter a discount code.',
        originalAmount: selectedOriginalAmount,
        discountAmount: 0,
        finalAmount: selectedOriginalAmount,
      });
      return;
    }
    setDiscountApplying(true);
    try {
      const res = await callValidatePublicRegistrationDiscountCode({
        eventSeq: page.eventSeq,
        eventPricingSeq: selectedPricing.eventPricingSeq,
        discountCode: code,
      });
      const result = res?.item ?? null;
      setDiscountResult(result);
      if (result?.valid) {
        setDiscountCodeInput(result.discountCode || code);
        message.success(result.message || 'Discount code applied.');
      } else {
        message.warning(result?.message || 'This discount code cannot be applied.');
      }
    } catch {
      setDiscountResult({
        valid: false,
        status: 'error',
        message: 'We could not check this discount code. Please try again.',
        originalAmount: selectedOriginalAmount,
        discountAmount: 0,
        finalAmount: selectedOriginalAmount,
      });
    } finally {
      setDiscountApplying(false);
    }
  }, [discountCodeInput, message, page?.eventSeq, selectedOriginalAmount, selectedPricing]);

  const clearDiscountCode = useCallback(() => {
    setDiscountCodeInput('');
    setDiscountResult(null);
  }, []);

  const continueToPaymentStep = useCallback(() => {
    const validationMessage = validateRegistrationParticipant(participant, page?.registrationFields);
    if (validationMessage) {
      message.warning(validationMessage);
      return;
    }
    const cleanedParticipant = cleanParticipant(participant, page?.registrationFields);
    setParticipant(cleanedParticipant);
    setRegistrationStep(2);
    setRegistrationResult(null);
    setLatestOrderId('');
  }, [message, page?.registrationFields, participant]);

  const startRegistrationPayment = useCallback(async () => {
    if (!page?.eventSeq) return;
    const validationMessage = validateRegistrationParticipant(participant, page?.registrationFields);
    if (validationMessage) {
      message.warning(validationMessage);
      setRegistrationStep(1);
      return;
    }
    if (!selectedPricing) {
      message.warning('Please select a registration type.');
      return;
    }
    const cleanedParticipant = cleanParticipant(participant, page?.registrationFields);
    setParticipant(cleanedParticipant);
    setSubmittingRegistration(true);
    setRegistrationResult(null);
    try {
      const res = await callPreparePublicRegistrationPayment({
        eventSeq: page.eventSeq,
        eventPricingSeq: selectedPricing.eventPricingSeq,
        participant: cleanedParticipant,
        paymentMethod: selectedPaymentMethod,
        paymentMethods: [selectedPaymentMethod],
        discountCode: appliedDiscount?.discountCode?.trim() || undefined,
        lang: 'EN',
        callbackBaseUrl: window.location.origin,
      });
      const prepared = res?.item;
      if (!prepared) {
        message.error('Payment preparation failed.');
        return;
      }
      setLatestOrderId(prepared.orderId);
      setRegistrationResult(prepared.payment ?? null);
      if (prepared.payment?.status?.toLowerCase() === 'paid' && prepared.payment.paymentSeq) {
        setRegistrationStep(3);
        message.success('Registration has been completed.');
        return;
      }
      if (!prepared.sdkUrl || !prepared.eximbayRequest) {
        message.error('Payment request was not returned.');
        return;
      }
      await loadScript(prepared.sdkUrl);
      if (!window.EXIMBAY) {
        message.error('Eximbay SDK is not available.');
        return;
      }
      window.EXIMBAY.request_pay(prepared.eximbayRequest);
    } catch {
      message.error('Failed to start Eximbay payment.');
    } finally {
      setSubmittingRegistration(false);
    }
  }, [appliedDiscount, message, page?.eventSeq, page?.registrationFields, participant, selectedPaymentMethod, selectedPricing]);

  if (loading) {
    // Render the masthead hero with the hardcoded local image immediately (no backend wait).
    return (
      <main className="pub-page-content" aria-busy="true">
        <section className="pub-event-registration-page-section">
          <section
            className="pub-event-registration-masthead"
            style={{ '--registration-hero-image': `url("${assetSrc(HeroSeoulImage)}")` } as React.CSSProperties}
          />
        </section>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="pub-page-content">
        <section className="pub-event-registration-page-section">
          <div className="saf-renewal-shell pub-event-registration-message">
            <h1>Registration Not Found</h1>
            <p>The event page is not published or the URL is incorrect.</p>
            <button type="button" className="pub-event-registration-primary" onClick={() => handleNavigate('/events')}>
              View Events
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (registrationActionType !== 'direct') {
    return (
      <main className="pub-page-content">
          <section className="pub-event-registration-page-section">
            <div className="saf-renewal-shell pub-event-registration-message">
              <p className="pub-event-registration-kicker">Event Registration</p>
              <h1>{page.eventTitle}</h1>
              {registrationActionType === 'external' && externalRegistrationUrl ? (
                <>
                  <p>This event uses an external registration page.</p>
                  <div className="pub-event-registration-actions">
                    <button type="button" className="pub-event-registration-secondary" onClick={backToEvent}>
                      Back to Event
                    </button>
                    <button
                      type="button"
                      className="pub-event-registration-primary"
                      onClick={() => window.open(externalRegistrationUrl, '_blank', 'noopener,noreferrer')}
                    >
                      Open Registration
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>Registration is not available for this event.</p>
                  <button type="button" className="pub-event-registration-primary" onClick={backToEvent}>
                    Back to Event
                  </button>
                </>
              )}
            </div>
          </section>
      </main>
    );
  }

  return (
    <main className="pub-page-content">
        <section className="pub-event-registration-page-section">
          <PublicRegistrationMasthead
            page={page}
            settings={pageSettings}
            onBackToEvent={backToEvent}
          />
          <div className="saf-renewal-shell pub-event-registration-shell">
            <PublicRegistrationStepPanel
              page={page}
              settings={pageSettings}
              step={registrationStep}
              participant={participant}
              pricingList={pricingList}
              selectedPricing={selectedPricing}
              selectedPricingSeq={selectedPricingSeq}
              selectedPaymentMethod={selectedPaymentMethod}
              discountCodeInput={discountCodeInput}
              discountResult={discountResult}
              discountApplying={discountApplying}
              discountAmount={selectedDiscountAmount}
              finalAmount={selectedFinalAmount}
              loadingPricing={loadingPricing}
              submitting={submittingRegistration}
              verifyingPayment={verifyingPayment}
              participantLookupLoading={participantLookupLoading}
              participantLookupStatus={participantLookupStatus}
              latestOrderId={latestOrderId}
              result={registrationResult}
              onUpdateParticipant={updateParticipant}
              onSelectPricing={selectPricing}
              onSelectPaymentMethod={setSelectedPaymentMethod}
              onUpdateDiscountCode={updateDiscountCodeInput}
              onApplyDiscountCode={applyDiscountCode}
              onClearDiscountCode={clearDiscountCode}
              onContinueToPayment={continueToPaymentStep}
              onStartPayment={startRegistrationPayment}
              onEditInfo={() => setRegistrationStep(1)}
              onPreviewStep={setRegistrationStep}
              onCheckPayment={() => {
                if (latestOrderId) {
                  verifyPublicPayment(latestOrderId);
                }
              }}
              onBackToEvent={backToEvent}
            />
          </div>
        </section>
    </main>
  );
};

const EventHeroInfoCard: React.FC<{
  page: PublicEventPageModel;
  settings: PageSettings;
  showRegistrationButton: boolean;
  onRegister: () => void;
}> = ({ page, settings, showRegistrationButton, onRegister }) => {
  const contact = [settings.contactEmail, settings.contactPhone].filter(Boolean).join(' / ');
  const registrationStatus = getRegistrationStatusLabel(page, settings);
  const eventDate = formatHeroDate(page.eventStartDt, page.eventEndDt);
  const eventDateMeta = formatHeroDateMeta(page.eventStartDt, page.location);
  const eventDateDetail = formatHeroDateDetail(page.eventStartDt, page.eventEndDt);
  const venue = splitVenue(page.location);

  return (
    <aside
      className="pub-event-hero-info-card"
      style={{
        background: 'rgba(62, 61, 61, 0.34)',
        borderRadius: 24,
        boxShadow: '0 40px 100px -20px rgba(80, 40, 160, 0.55)',
        backdropFilter: 'blur(94px)',
        WebkitBackdropFilter: 'blur(94px)',
      }}
    >
      <div className="pub-event-hero-info-main">
        <div className="pub-event-hero-info-date">
          <span>Date</span>
          <strong>{eventDate}</strong>
          {eventDateMeta && <em>{eventDateMeta}</em>}
          {eventDateDetail && <small>{eventDateDetail}</small>}
        </div>
        <div className="pub-event-hero-info-venue">
          <span>Venue</span>
          <strong>{venue.title}</strong>
          {venue.detail && <small>{venue.detail}</small>}
        </div>
        <div className="pub-event-hero-info-action">
          {showRegistrationButton && (
            <button type="button" className="pub-event-register-link" onClick={onRegister}>
              Register
              <span aria-hidden="true">{'\u2197'}</span>
            </button>
          )}
          <small>{settings.infoNote ? `Limited seats ${'\u00b7'} Invitation included` : 'Limited seats'}</small>
        </div>
      </div>
      <div className="pub-event-hero-info-sub">
        {renderHeroInfoRow('Registration', registrationStatus)}
        {renderHeroInfoRow('Organizer', settings.organizerName)}
        {renderHeroInfoRow('Contact', contact)}
      </div>
    </aside>
  );
};

function renderHeroInfoRow(label: string, value?: string | null) {
  if (!value) return null;
  return (
    <dl className="pub-event-hero-info-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

function getRegistrationStatusLabel(page: PublicEventPageModel, settings: PageSettings) {
  if (normalizeRegistrationType(page.registrationType) === 'none') {
    return 'Registration is not available.';
  }

  const startDate = parseDateTime(page.registrationStartDt);
  const endDate = parseDateTime(page.registrationEndDt);
  const now = new Date();

  if (startDate && now.getTime() < startDate.getTime()) {
    return 'Registration is not open yet.';
  }

  if (endDate) {
    const inclusiveEnd = new Date(endDate);
    if (
      inclusiveEnd.getHours() === 0
      && inclusiveEnd.getMinutes() === 0
      && inclusiveEnd.getSeconds() === 0
      && inclusiveEnd.getMilliseconds() === 0
    ) {
      inclusiveEnd.setDate(inclusiveEnd.getDate() + 1);
      inclusiveEnd.setMilliseconds(inclusiveEnd.getMilliseconds() - 1);
    }
    if (now.getTime() > inclusiveEnd.getTime()) {
      return 'Registration is now closed.';
    }
  }

  if (startDate || endDate) {
    return 'Registration Open';
  }

  return settings.registrationStatusLabel || formatStatusLabel(page.eventStatus);
}

function formatHeroDate(start?: string | null, end?: string | null) {
  const startDate = parseDateTime(start);
  const endDate = parseDateTime(end);
  if (!startDate) return 'TBA';

  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate);
  const startDay = startDate.getDate();
  if (!endDate || isSameDay(startDate, endDate)) {
    return `${month} ${startDay}`;
  }

  const endMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(endDate);
  const endDay = endDate.getDate();
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${month} ${startDay}-${endDay}`;
  }
  return `${month} ${startDay}-${endMonth} ${endDay}`;
}

function formatHeroDateDetail(start?: string | null, end?: string | null) {
  const range = formatBlockDateRange(start, end);
  return range ? range.replace(' - ', ' - ') : '';
}

function formatHeroDateMeta(start?: string | null, location?: string | null) {
  const date = parseDateTime(start);
  const year = date ? String(date.getFullYear()) : '';
  const city = location?.toLowerCase().includes('seoul') ? 'Seoul' : '';
  return [year, city].filter(Boolean).join(' \u00b7 ');
}

function splitVenue(location?: string | null) {
  if (!location) return { title: 'TBA', detail: '' };
  const [title, ...rest] = location.split(',').map((part) => part.trim()).filter(Boolean);
  return {
    title: title || location,
    detail: rest.join(', '),
  };
}

const PublicRegistrationMasthead: React.FC<{
  page: PublicEventPageModel;
  settings: PageSettings;
  onBackToEvent: () => void;
}> = ({ page, settings, onBackToEvent }) => {
  const contact = [settings.contactEmail, settings.contactPhone].filter(Boolean).join(' / ');
  // Hardcoded local hero image (no backend dependency) so it loads immediately.
  const heroImageUrl = assetSrc(HeroSeoulImage);
  // Figma sub02_01Registration Mask group: 1줄=날짜/시간, 2줄=장소 (자정 00:00 표기는 생략)
  const mastheadDate = (formatBlockDateRange(page.eventStartDt, page.eventEndDt) || '').replace(/\s*00:00/g, '');
  const mastheadVenue = page.location;
  const mastheadStyle = {
    '--registration-hero-image': `url("${heroImageUrl}")`,
  } as React.CSSProperties;

  return (
    <section className="pub-event-registration-masthead" style={mastheadStyle}>
      <div className="pub-event-registration-masthead-copy">
        <p>Official Event Registration</p>
        <h1>{page.eventTitle}</h1>
        {(mastheadDate || mastheadVenue) && (
          <span>
            {mastheadDate}
            {mastheadDate && mastheadVenue && <br />}
            {mastheadVenue}
          </span>
        )}
      </div>
      <div className="pub-event-registration-masthead-meta">
        {renderRegistrationMetaItem('Date', formatBlockDateRange(page.eventStartDt, page.eventEndDt))}
        {renderRegistrationMetaItem('Venue', page.location)}
        {renderRegistrationMetaItem('Contact', contact || 'saf@kcab.or.kr')}
      </div>
      <button type="button" className="pub-event-registration-back" onClick={onBackToEvent}>
        Back to Event
      </button>
    </section>
  );
};

function renderRegistrationMetaItem(label: string, value?: string | null) {
  if (!value) return null;
  return (
    <dl className="pub-event-registration-meta-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

function renderParticipantLookupMessage(loading: boolean, status: ParticipantLookupStatus) {
  if (loading || status === 'checking') {
    return <small className="pub-event-registration-email-note">Checking participant information...</small>;
  }
  if (status === 'found') {
    return <small className="pub-event-registration-email-note is-success">Existing participant information was loaded.</small>;
  }
  if (status === 'notFound') {
    return <small className="pub-event-registration-email-note">No existing participant was found. Please continue.</small>;
  }
  if (status === 'error') {
    return <small className="pub-event-registration-email-note is-error">We could not check this email. You can still continue.</small>;
  }
  return null;
}

interface PublicRegistrationStepPanelProps {
  page: PublicEventPageModel;
  settings: PageSettings;
  step: RegistrationStep;
  participant: PublicRegistrationParticipantRequest;
  pricingList: PublicRegistrationPricingOption[];
  selectedPricing?: PublicRegistrationPricingOption;
  selectedPricingSeq?: number;
  selectedPaymentMethod: PublicRegistrationPaymentMethodCode;
  discountCodeInput: string;
  discountResult: PublicRegistrationDiscountValidationResult | null;
  discountApplying: boolean;
  discountAmount: number;
  finalAmount: number;
  loadingPricing: boolean;
  submitting: boolean;
  verifyingPayment: boolean;
  participantLookupLoading: boolean;
  participantLookupStatus: ParticipantLookupStatus;
  latestOrderId: string;
  result: PublicRegistrationPaymentResult | null;
  onUpdateParticipant: (key: keyof PublicRegistrationParticipantRequest, value: string) => void;
  onSelectPricing: (value: number | undefined) => void;
  onSelectPaymentMethod: (value: PublicRegistrationPaymentMethodCode) => void;
  onUpdateDiscountCode: (value: string) => void;
  onApplyDiscountCode: () => void;
  onClearDiscountCode: () => void;
  onContinueToPayment: () => void;
  onStartPayment: () => void;
  onEditInfo: () => void;
  onPreviewStep: (step: RegistrationStep) => void;
  onCheckPayment: () => void;
  onBackToEvent: () => void;
}

const PublicRegistrationStepPanel: React.FC<PublicRegistrationStepPanelProps> = ({
  page,
  settings,
  step,
  participant,
  pricingList,
  selectedPricing,
  selectedPricingSeq,
  selectedPaymentMethod,
  discountCodeInput,
  discountResult,
  discountApplying,
  discountAmount,
  finalAmount,
  loadingPricing,
  submitting,
  verifyingPayment,
  participantLookupLoading,
  participantLookupStatus,
  latestOrderId,
  result,
  onUpdateParticipant,
  onSelectPricing,
  onSelectPaymentMethod,
  onUpdateDiscountCode,
  onApplyDiscountCode,
  onClearDiscountCode,
  onContinueToPayment,
  onStartPayment,
  onEditInfo,
  onPreviewStep,
  onCheckPayment,
  onBackToEvent,
}) => {
  const contactEmail = settings.contactEmail || 'saf@kcab.or.kr';
  const resultStatus = result?.status?.toLowerCase();
  const paymentPending = !!resultStatus && resultStatus !== 'paid' && resultStatus !== 'failed' && resultStatus !== 'cancelled';
  const hasAppliedDiscount = !!discountResult?.valid;
  const payableAmount = selectedPricing ? finalAmount : 0;
  const registrationFields = useMemo(() => resolvePublicRegistrationFields(page.registrationFields), [page.registrationFields]);
  const countryOptions = useMemo(() => {
    const customCountries = [participant.country, participant.residenceCountry, participant.nationality]
      .map((value) => value?.trim())
      .filter((value): value is string => !!value && !COUNTRY_OPTIONS.some((option) => option.value === value));
    if (!customCountries.length) {
      return COUNTRY_OPTIONS;
    }
    const uniqueCustomCountries = Array.from(new Set(customCountries));
    return [
      ...uniqueCustomCountries.map((value) => ({ label: value, value })),
      ...COUNTRY_OPTIONS,
    ];
  }, [participant.country, participant.nationality, participant.residenceCountry]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onContinueToPayment();
  };

  return (
      <section className="pub-event-registration-panel" aria-labelledby="public-registration-title">
        <header className="pub-event-registration-head">
          <div>
            <p>Registration Details</p>
            <h2 id="public-registration-title">Complete your registration</h2>
            <span>Enter your participant information, choose your ticket, and complete payment in the secure window.</span>
          </div>
          <div className="pub-event-registration-preview">
            <span>Design Preview</span>
            <div>
              {REGISTRATION_STEPS.map((item) => (
                <button
                  type="button"
                  key={item.step}
                  className={step === item.step ? 'is-active' : ''}
                  aria-pressed={step === item.step}
                  onClick={() => onPreviewStep(item.step)}
                >
                  Step {item.step}
                </button>
              ))}
            </div>
          </div>
        </header>
        <ol className="pub-event-registration-steps" aria-label="Registration steps">
          {REGISTRATION_STEPS.map((item) => (
            <li
              key={item.step}
              className={[
                step === item.step ? 'is-active' : '',
                step > item.step ? 'is-complete' : '',
              ].filter(Boolean).join(' ')}
            >
              <span>{item.step}</span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </li>
          ))}
        </ol>

        {step === 1 && (
          <form className="pub-event-registration-grid is-participant-only" onSubmit={handleSubmit}>
            <div className="pub-event-registration-form">
              <div className="pub-event-registration-section-title">
                <span>Step 1</span>
                <h3>Participant Information</h3>
                <p>Please enter the participant details first. Ticket selection and payment will be handled in the next step.</p>
              </div>
              <div className="pub-event-registration-fields">
                {registrationFields.map((field) => {
                  const inputConfig = REGISTRATION_FIELD_INPUTS[field.fieldCode];
                  if (!inputConfig) return null;
                  const value = participant[inputConfig.key] ?? '';
                  const isRequired = field.requiredYn === 'Y';
                  const fieldClassName = [
                    inputConfig.half ? 'is-half' : '',
                    inputConfig.wide ? 'is-wide' : '',
                  ].filter(Boolean).join(' ') || undefined;
                  if (inputConfig.select) {
                    return (
                      <label key={field.fieldCode} className={fieldClassName}>
                        <span>{field.fieldLabel}{isRequired && <em className="pub-event-required">*</em>}</span>
                        <Select<string>
                          className="pub-event-registration-country-select"
                          classNames={{ popup: { root: 'pub-event-registration-country-dropdown' } }}
                          showSearch
                          allowClear
                          value={String(value).trim() ? String(value) : undefined}
                          placeholder="Search country"
                          options={countryOptions}
                          optionFilterProp="label"
                          onChange={(nextValue) => onUpdateParticipant(inputConfig.key, nextValue ?? '')}
                        />
                      </label>
                    );
                  }
                  return (
                    <label key={field.fieldCode} className={fieldClassName}>
                      <span>{field.fieldLabel}{isRequired && <em className="pub-event-required">*</em>}</span>
                      <input
                        type={field.fieldCode === 'email' ? 'email' : 'text'}
                        value={String(value)}
                        autoComplete={inputConfig.autoComplete}
                        onChange={(event) => onUpdateParticipant(inputConfig.key, event.target.value)}
                      />
                      {field.fieldCode === 'email' && renderParticipantLookupMessage(participantLookupLoading, participantLookupStatus)}
                    </label>
                  );
                })}
              </div>
              <div className="pub-event-registration-form-actions">
                <button type="button" className="pub-event-registration-secondary" onClick={onBackToEvent}>
                  Back to Event
                </button>
                <button type="submit" className="pub-event-registration-primary">
                  Next: Ticket & Payment
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="pub-event-registration-payment">
            <div className="pub-event-registration-section-title">
              <span>Step 2</span>
              <h3>Select Ticket & Payment</h3>
              <p>Choose your registration type and payment method, then continue to the secure Eximbay payment window.</p>
            </div>
            <div className="pub-event-registration-payment-grid">
              <aside className="pub-event-registration-summary">
                <div className="pub-event-registration-section-title">
                  <span>Registration Type</span>
                  <h3>Select Ticket</h3>
                </div>
                <div className="pub-event-registration-ticket-list" role="radiogroup" aria-label="Registration type">
                  {loadingPricing && <p className="pub-event-registration-muted">Loading registration options...</p>}
                  {!loadingPricing && pricingList.length === 0 && (
                    <p className="pub-event-registration-unavailable">No payable registration option is available for this event.</p>
                  )}
                  {pricingList.map((pricing) => {
                    const selected = selectedPricingSeq === pricing.eventPricingSeq;
                    return (
                      <button
                        type="button"
                        key={pricing.eventPricingSeq}
                        className={`pub-event-registration-ticket${selected ? ' is-selected' : ''}`}
                        aria-pressed={selected}
                        onClick={() => onSelectPricing(pricing.eventPricingSeq)}
                      >
                        <span>{pricing.priceName}</span>
                        <strong>{formatMoney(pricing.amount, pricing.currencyCode)}</strong>
                        <small>{pricing.priceType}</small>
                      </button>
                    );
                  })}
                </div>

                <div className="pub-event-registration-methods" role="radiogroup" aria-label="Payment method">
                  <span>Payment Method</span>
                  {PAYMENT_METHOD_OPTIONS.map((option) => {
                    const selected = selectedPaymentMethod === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        className={selected ? 'is-selected' : ''}
                        aria-pressed={selected}
                        onClick={() => onSelectPaymentMethod(option.value)}
                      >
                        <strong>{option.brand}</strong>
                        <small>{option.description}</small>
                      </button>
                    );
                  })}
                </div>

                <div className="pub-event-registration-total">
                  <span>Total</span>
                  <strong>{selectedPricing ? formatMoney(payableAmount, selectedPricing.currencyCode) : '-'}</strong>
                  {selectedPricing && hasAppliedDiscount && (
                    <small>{formatMoney(discountAmount, selectedPricing.currencyCode)} discount applied</small>
                  )}
                </div>
              </aside>
              <div className="pub-event-registration-payment-side">
                <div className="pub-event-registration-payment-state">
                  <span>{submitting ? 'Preparing' : verifyingPayment ? 'Confirming' : paymentPending ? 'Pending' : latestOrderId ? 'Payment Window Open' : 'Ready to Pay'}</span>
                  <h4>{submitting ? 'Preparing your payment request.' : latestOrderId ? 'Please finish payment in the popup window.' : 'Ready when your ticket and payment method are selected.'}</h4>
                  <p>{latestOrderId ? 'This page will move to Step 3 automatically after confirmation.' : 'You can still go back and edit participant information before opening Eximbay.'}</p>
                </div>
                <div className="pub-event-registration-discount">
                  <div className="pub-event-registration-discount-head">
                    <span>Discount Code</span>
                    {hasAppliedDiscount && <strong>{discountResult?.discountCode}</strong>}
                  </div>
                  <div className="pub-event-registration-discount-control">
                    <input
                      value={discountCodeInput}
                      placeholder="Enter discount code"
                      onChange={(event) => onUpdateDiscountCode(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          onApplyDiscountCode();
                        }
                      }}
                      disabled={submitting || verifyingPayment}
                    />
                    <button
                      type="button"
                      className="pub-event-registration-secondary"
                      onClick={onApplyDiscountCode}
                      disabled={discountApplying || submitting || verifyingPayment || !selectedPricing}
                    >
                      {discountApplying ? 'Checking' : 'Apply'}
                    </button>
                    {hasAppliedDiscount && (
                      <button
                        type="button"
                        className="pub-event-registration-discount-clear"
                        onClick={onClearDiscountCode}
                        disabled={submitting || verifyingPayment}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {discountResult?.message && (
                    <p className={`pub-event-registration-discount-message ${discountResult.valid ? 'is-success' : 'is-error'}`}>
                      {discountResult.message}
                    </p>
                  )}
                  {selectedPricing && hasAppliedDiscount && (
                    <div className="pub-event-registration-discount-lines">
                      <div>
                        <span>Subtotal</span>
                        <strong>{formatMoney(selectedPricing.amount, selectedPricing.currencyCode)}</strong>
                      </div>
                      <div>
                        <span>Discount</span>
                        <strong>-{formatMoney(discountAmount, selectedPricing.currencyCode)}</strong>
                      </div>
                      <div>
                        <span>New Total</span>
                        <strong>{formatMoney(payableAmount, selectedPricing.currencyCode)}</strong>
                      </div>
                    </div>
                  )}
                </div>
                {result?.failedReason && <p className="pub-event-registration-error">{result.failedReason}</p>}
                <div className="pub-event-registration-actions">
                  <button type="button" className="pub-event-registration-secondary" onClick={onEditInfo} disabled={submitting || verifyingPayment}>
                    Edit Participant
                  </button>
                  <button type="button" className="pub-event-registration-primary" onClick={onStartPayment} disabled={submitting || loadingPricing || !selectedPricing}>
                    {submitting ? 'Preparing Payment' : payableAmount <= 0 && hasAppliedDiscount ? 'Complete Registration' : 'Pay with Eximbay'}
                  </button>
                  {latestOrderId && (
                    <button type="button" className="pub-event-registration-secondary" onClick={onCheckPayment} disabled={submitting || verifyingPayment}>
                      {verifyingPayment ? 'Checking Payment' : 'Check Payment'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="pub-event-registration-complete">
            <div className="pub-event-registration-complete-panel">
              <span className="pub-event-registration-complete-badge">Confirmed</span>
              <h3>Registration Complete</h3>
              <p>
                Thank you for registering for {page.eventTitle}. Your payment has been confirmed and your participant
                information has been recorded.
              </p>
              <p className="pub-event-registration-note">
                Event updates or access information may be sent to your registered email address.
                For registration changes or questions, contact <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
            </div>
            <button type="button" className="pub-event-registration-complete-back" onClick={onBackToEvent}>
              Back to Event
            </button>
          </div>
        )}
      </section>
  );
};

const EventPageSectionRenderer: React.FC<{ section: EventPageSection; accentColor: string }> = ({ section, accentColor }) => {
  const anchor = section.anchorId || section.sectionKey;
  const blocks = section.blocks ?? [];
  const sectionSettings = parseSectionSettings(section.settingsJson);
  const sectionStyle = { '--pub-event-accent': accentColor } as React.CSSProperties;
  const sectionClassName = [
    'pub-event-builder-section',
    `pub-event-section-${section.sectionType.replace(/_/g, '-')}`,
    `pub-event-bg-${sectionSettings.backgroundStyle || 'white'}`,
    `pub-event-width-${sectionSettings.width || 'normal'}`,
    `pub-event-spacing-${sectionSettings.spacing || 'normal'}`,
  ].join(' ');

  if (section.sectionType === 'speakers') {
    return (
      <section id={anchor} className={`pub-section section-speaker-list ${sectionClassName}`} style={sectionStyle}>
        <div className="pub-section-inner">
          <span className="pub-event-section-eyebrow">VOICES</span>
          <h3 className="speaker-title">{section.title || 'Speakers'}</h3>
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          <div className="speaker-grid">
            {blocks.map((block) => renderSpeakerCard(block))}
          </div>
        </div>
      </section>
    );
  }

  if (section.sectionType === 'program') {
    return (
      <section
        id={anchor}
        className={`pub-section section-text size-medium ${sectionClassName} pub-event-builder-program`}
        style={{
          ...sectionStyle,
          '--oe-program-ribbon-bg': `url("${officialRibbonImageUrl}")`,
        } as React.CSSProperties}
      >
        <div className="pub-section-inner">
          <span className="pub-event-section-eyebrow">SCHEDULE</span>
          <h3 className="text-title">{section.title || 'Program'}</h3>
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          <div className="pub-event-program-list">
            <ProgramSchedule blocks={blocks} />
          </div>
        </div>
      </section>
    );
  }

  if (section.sectionType === 'supporting_organizations') {
    return (
      <section id={anchor} className={`pub-section section-banner-list ${sectionClassName}`} style={sectionStyle}>
        <div className="pub-section-inner">
          <span className="pub-event-section-eyebrow">WITH THANKS</span>
          <h3 className="card-list-title">{section.title || 'Supporting Organizations'}</h3>
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          {renderSupportingOrganizations(blocks)}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'venue') {
    const venueBlock = blocks.find((block) => block.useYn !== 'N') ?? null;
    const venueTitle = venueBlock?.title || section.subtitle || section.title || 'Venue';
    const venueRoom = venueBlock?.subtitle || splitVenue(venueBlock?.venueName || '').detail || '2F Chrysanthemum Room';
    const venueDescriptionSource = section.body || venueBlock?.body || venueBlock?.summary || '';
    const venueDescription = getFirstHtmlParagraph(venueDescriptionSource);
    const plainVenueText = stripHtml(`${section.body || ''} ${venueBlock?.body || ''}`);
    const address = plainVenueText.match(/(?:Address:\s*)?([^.]*(?:Teheran|Gangnam|Seoul)[^.]*)\.?/i)?.[1]?.trim()
      || venueBlock?.venueName
      || '521 Teheran-ro, Gangnam-gu, Seoul';

    return (
      <section
        id={anchor}
        className={`pub-section section-text size-medium ${sectionClassName} pub-event-venue-section`}
        style={{
          ...sectionStyle,
          '--oe-venue-bg': `url("${officialVenueImageUrl}")`,
        } as React.CSSProperties}
      >
        <div className="pub-section-inner">
          <div className="pub-event-venue-panel">
            <div className="pub-event-venue-copy">
              <span className="pub-event-venue-eyebrow">{section.title || 'Venue'}</span>
              <h3>{venueTitle}</h3>
              {venueDescription && <div className="text-content" dangerouslySetInnerHTML={{ __html: venueDescription }} />}
              <div className="pub-event-venue-facts">
                {renderVenueFact('Address', address)}
                {renderVenueFact('Room', venueRoom)}
                {renderVenueFact('Nearest Station', `Samseong Station ${'\u00b7'} Line 2`)}
              </div>
            </div>
            <aside className="pub-event-venue-aside">
              {renderVenueFact('District', 'Gangnam, Seoul')}
              {renderVenueFact('Parking', 'On-site available')}
              {venueBlock?.linkUrl && (
                <div className="pub-event-venue-map">
                  <span>Map</span>
                  <a href={venueBlock.linkUrl} target={venueBlock.linkTarget || '_blank'} rel="noopener noreferrer">
                    {venueBlock.buttonLabel || 'View on Map'}
                    <span aria-hidden="true">{'\u2197'}</span>
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    );
  }

  if (section.sectionType === 'visit_seoul') {
    const visitEyebrow = `VISIT SEOUL ${'\u00b7'} PARTNER HOTELS`;

    return (
      <section id={anchor} className={`pub-section section-text size-medium ${sectionClassName} pub-event-visit-section`} style={sectionStyle}>
        <div className="pub-section-inner">
          <span className="pub-event-visit-eyebrow">{visitEyebrow}</span>
          {section.title && <h3 className="text-title">{section.title}</h3>}
          {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
          {section.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: section.body }} />}
          {blocks.length > 0 && (
            <div className="pub-event-subsection">
              <div className="pub-event-page-card-grid pub-event-hotel-grid">
                {blocks.filter((block) => block.useYn !== 'N').map(renderHotelCard)}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (section.sectionType === 'notice') {
    return renderNoticeSection(section, sectionClassName, sectionStyle, anchor, blocks);
  }

  if (section.sectionType === 'contact') {
    return null;
  }

  return (
    <section id={anchor} className={`pub-section section-text size-medium ${sectionClassName}`} style={sectionStyle}>
      <div className="pub-section-inner">
        {section.title && <h3 className="text-title">{section.title}</h3>}
        {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
        {section.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: section.body }} />}
        {blocks.length > 0 && (
          <div className="pub-event-page-card-grid">
            {blocks.map((block) => renderLinkedBlock(block, 'pub-event-page-card'))}
          </div>
        )}
      </div>
    </section>
  );
};

function getProgramSessions(blocks: EventPageBlock[]) {
  const topLevelBlocks = blocks.filter((block) => !block.parentBlockSeq && block.useYn !== 'N');
  const childrenByParent = blocks.reduce<Record<number, EventPageBlock[]>>((acc, block) => {
    if (block.parentBlockSeq && block.useYn !== 'N') {
      acc[block.parentBlockSeq] = [...(acc[block.parentBlockSeq] ?? []), block];
    }
    return acc;
  }, {});

  const sessions = topLevelBlocks.flatMap((block) => {
    const children = childrenByParent[block.blockSeq] ?? [];
    if (children.length > 0 || block.blockType === 'agenda_day') {
      return children;
    }
    return [block];
  });
  return sessions;
}

const ProgramSchedule: React.FC<{ blocks: EventPageBlock[] }> = ({ blocks }) => {
  const sessions = useMemo(() => getProgramSessions(blocks), [blocks]);
  const programTracks = useMemo(() => groupProgramBlocks(sessions), [sessions]);
  const tabLabels = ['Main Schedule', 'Open Session', 'Institutions Session'].filter((label) =>
    programTracks.some(([track]) => track === label),
  );
  const [activeTrack, setActiveTrack] = useState(tabLabels[0] || 'Main Schedule');
  const activeSessions = programTracks.find(([track]) => track === activeTrack)?.[1] ?? [];

  return (
    <section className="pub-event-program-track" key="program-schedule">
      <div className="pub-event-program-track-head">
        {tabLabels.map((label) => (
          <button
            type="button"
            className={label === activeTrack ? 'is-active' : undefined}
            onClick={() => setActiveTrack(label)}
            key={label}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="pub-event-program-track-sessions">
        {activeSessions.map((block) => renderProgramSession(block))}
      </div>
    </section>
  );
};

function renderProgramSession(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const sessionType = getProgramSessionType(content);
  const moderator = typeof content.moderator === 'string' ? content.moderator : '';
  const dayLabel = typeof content.dayLabel === 'string' ? content.dayLabel : '';
  const imageUrls = getProgramImageUrls(block);

  return (
    <article className={`pub-event-program-session is-${sessionType}${imageUrls.length ? ' has-images' : ''}`} key={block.blockSeq}>
      <div className="pub-event-program-time">
        {dayLabel && <span>{dayLabel}</span>}
        {formatBlockTime(block)}
      </div>
      <div className="pub-event-program-main">
        <span className="pub-event-program-type">{getProgramSessionTypeLabel(sessionType)}</span>
        {block.linkUrl ? (
          <h5>
            <a className="pub-event-program-link" href={block.linkUrl} target={block.linkTarget || '_self'} rel="noopener noreferrer">
              {block.title}
            </a>
          </h5>
        ) : (
          <h5>{block.title}</h5>
        )}
        {block.speakerNames && <p className="pub-event-program-speakers">{block.speakerNames}</p>}
        {moderator && <p className="pub-event-program-speakers">Moderator: {moderator}</p>}
        {block.venueName && <p className="pub-event-program-venue">{block.venueName}</p>}
        {block.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: block.body }} />}
        {imageUrls.length > 0 && (
          <div className={`pub-event-program-images is-count-${Math.min(imageUrls.length, 3)}`}>
            {imageUrls.map((imageUrl, index) => (
              <figure className="pub-event-program-image-frame" key={`${imageUrl}-${index}`}>
                <img className="pub-event-program-image" src={imageUrl} alt={`${block.title || 'Program session'} host logo ${index + 1}`} />
              </figure>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function renderSpeakerCard(block: EventPageBlock) {
  const contentJson = parseBlockContent(block.contentJson);
  const linkedInUrl = typeof contentJson.linkedInUrl === 'string' ? contentJson.linkedInUrl : '';
  const profileUrl = block.linkUrl || linkedInUrl;
  const content = (
    <>
      {getBlockImageUrl(block) ? (
        <img className="speaker-photo" src={getBlockImageUrl(block)} alt={block.title || 'Speaker'} />
      ) : (
        <div className="speaker-photo speaker-photo-fallback">{(block.title || 'S').slice(0, 1)}</div>
      )}
      <h4 className="speaker-name">{block.title}</h4>
      {block.subtitle && <p className="speaker-role">{block.subtitle}</p>}
      {block.organizationName && <p className="speaker-org">{block.organizationName}</p>}
      {block.body && <p className="pub-event-speaker-bio">{stripHtml(block.body)}</p>}
      {profileUrl && <span className="pub-event-speaker-profile">View Profile</span>}
    </>
  );

  if (profileUrl) {
    return (
      <a key={block.blockSeq} className="speaker-item pub-event-speaker-link" href={profileUrl} target={block.linkTarget || '_blank'} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <article className="speaker-item" key={block.blockSeq}>{content}</article>;
}

function renderSupportingOrganizations(blocks: EventPageBlock[]) {
  const shownBlocks = blocks.filter((block) => block.useYn !== 'N');
  const groups = groupOrganizationBlocks(shownBlocks);
  const organizers = groups.find(([group]) => isOrganizerGroup(group))?.[1] ?? [];
  const supporters = groups
    .filter(([group]) => !isOrganizerGroup(group))
    .flatMap(([, groupBlocks]) => groupBlocks);

  return (
    <div className="pub-event-org-wrap">
      <div className="pub-event-org-organizers">
        {organizers.map((block, index) => renderOrganizationCard(block, 'Organizers', index))}
      </div>
      {supporters.length > 0 && (
        <div className="pub-event-org-supporters">
          <h4>Supporters</h4>
          <div className="pub-event-org-grid">
            {supporters.map((block, index) => renderSupporterLogo(block, index))}
          </div>
        </div>
      )}
    </div>
  );
}

function renderOrganizationCard(block: EventPageBlock, label: string, index: number) {
  const imageUrl = getBlockImageUrl(block);
  const title = getOrganizationDisplayName(block, index);
  const content = (
    <>
      <div>
        <span>{label}</span>
        <h4>{title}</h4>
      </div>
      {imageUrl && <img src={imageUrl} alt={title} />}
    </>
  );

  if (block.linkUrl) {
    return (
      <a key={block.blockSeq} className="pub-event-org-card" href={block.linkUrl} target={block.linkTarget || '_blank'} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <article key={block.blockSeq} className="pub-event-org-card">{content}</article>;
}

function renderSupporterLogo(block: EventPageBlock, index: number) {
  const imageUrl = getBlockImageUrl(block);
  const title = getOrganizationDisplayName(block, index);
  const content = imageUrl ? <img src={imageUrl} alt={title} /> : <span>{title}</span>;

  if (block.linkUrl) {
    return (
      <a key={block.blockSeq} className="pub-event-supporter-logo" href={block.linkUrl} target={block.linkTarget || '_blank'} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <span key={block.blockSeq} className="pub-event-supporter-logo">{content}</span>;
}

function getOrganizationDisplayName(block: EventPageBlock, index: number) {
  const fallbackOrganizerNames = ['KCAB International', 'Asia Civil Law Council'];
  return block.organizationName || block.title || block.summary || fallbackOrganizerNames[index] || `Organization ${index + 1}`;
}

function renderLinkedBlock(block: EventPageBlock, className: string) {
  const imageUrl = getBlockImageUrl(block);
  const extraContent = parseBlockContent(block.contentJson);
  const roomRates = typeof extraContent.roomRates === 'string' ? extraContent.roomRates : '';
  const mapUrl = typeof extraContent.mapUrl === 'string' ? extraContent.mapUrl : '';
  const bookingDeadline = typeof extraContent.bookingDeadline === 'string' ? extraContent.bookingDeadline : '';
  const isLogoCard = className.includes('pub-event-logo-card');
  const content = (
    <>
      {imageUrl && (
        <img
          className={className.includes('pub-event-logo-card') ? 'pub-event-logo-image' : 'pub-event-page-card-image'}
          src={imageUrl}
          alt={block.organizationName || block.title || 'Event content'}
        />
      )}
      {block.badgeText && <span className="pub-event-page-badge">{block.badgeText}</span>}
      {(block.title || block.organizationName || block.buttonLabel) && (
        <h4>{block.title || block.organizationName || block.buttonLabel}</h4>
      )}
      {block.subtitle && <p className="pub-event-page-subtitle">{block.subtitle}</p>}
      {block.summary && <p>{block.summary}</p>}
      {block.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: block.body }} />}
      {roomRates && <div className="text-content"><strong>Room Rates</strong><br />{roomRates}</div>}
      {bookingDeadline && <p><strong>Booking Deadline</strong><br />{bookingDeadline}</p>}
      {!isLogoCard && (block.linkUrl || mapUrl) && (
        <div className="pub-event-page-actions">
          {block.linkUrl && (
            <a href={block.linkUrl} target={block.linkTarget || '_blank'} rel="noopener noreferrer">
              {block.buttonLabel || 'View Details'}
            </a>
          )}
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              Map
            </a>
          )}
        </div>
      )}
    </>
  );

  if (isLogoCard && block.linkUrl) {
    return (
      <a key={block.blockSeq} className={className} href={block.linkUrl} target={block.linkTarget || '_self'} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <article key={block.blockSeq} className={className}>{content}</article>;
}

function renderHotelCard(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const mapUrl = typeof content.mapUrl === 'string' ? content.mapUrl : '';
  const parsedSummary = parseHotelSummary(block.summary || '');
  const travelTime = (typeof content.travelTime === 'string' && content.travelTime.trim())
    ? content.travelTime.trim()
    : parsedSummary.travelTime;
  const title = block.title || 'Partner Hotel';
  const [contactEmail, contactPhone] = (block.subtitle || '').split(' - ').map((item) => item.trim());
  const address = parsedSummary.address;

  return (
    <article key={block.blockSeq} className="pub-event-page-card pub-event-hotel-card">
      {travelTime && <span className="pub-event-hotel-distance">{travelTime}</span>}
      <h4>{title}</h4>
      {address && <p className="pub-event-hotel-address">{address}</p>}
      <div className="pub-event-hotel-contact">
        {contactEmail && <span>{contactEmail}</span>}
        {contactPhone && <span>{contactPhone}</span>}
      </div>
      <div className="pub-event-page-actions">
        {block.linkUrl && (
          <a href={block.linkUrl} target={block.linkTarget || '_blank'} rel="noopener noreferrer">
            {block.buttonLabel || 'View Details'}
            <span aria-hidden="true">{'\u2197'}</span>
          </a>
        )}
        {mapUrl && (
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            Map
            <span aria-hidden="true">{'\u2197'}</span>
          </a>
        )}
      </div>
    </article>
  );
}

function parseHotelSummary(summary: string) {
  const normalized = summary.trim();
  const [address, travelTime] = normalized.split(/\s+-\s+about\s+/i);

  if (travelTime) {
    return {
      address: address.trim(),
      travelTime: `~${travelTime.trim()}`,
    };
  }

  return {
    address: normalized,
    travelTime: '',
  };
}

function renderNoticeBlock(block: EventPageBlock) {
  const content = (
    <>
      <div className="pub-event-notice-marker">
        {block.badgeText || 'Notice'}
      </div>
      <div className="pub-event-notice-copy">
        <h4>{block.title || 'Notice'}</h4>
        {block.subtitle && <p className="pub-event-page-subtitle">{block.subtitle}</p>}
        {block.summary && <p>{block.summary}</p>}
        {block.body && <div className="text-content" dangerouslySetInnerHTML={{ __html: block.body }} />}
      </div>
      {block.linkUrl && (
        <span className="pub-event-notice-action">
          {block.buttonLabel || 'View Notice'}
        </span>
      )}
    </>
  );

  if (block.linkUrl) {
    return (
      <a key={block.blockSeq} className="pub-event-notice-card" href={block.linkUrl} target={block.linkTarget || '_blank'} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <article key={block.blockSeq} className="pub-event-notice-card">{content}</article>;
}

function renderNoticeSection(
  section: EventPageSection,
  sectionClassName: string,
  sectionStyle: React.CSSProperties,
  anchor: string,
  blocks: EventPageBlock[],
) {
  const visibleBlocks = blocks.filter((block) => block.useYn !== 'N');
  const sectionBodyText = stripHtml(section.body || '');
  const noticeItems = visibleBlocks.length > 0
    ? visibleBlocks.map((block) => ({
      title: block.title || block.badgeText || 'Notice',
      body: stripHtml(block.summary || block.subtitle || block.body || ''),
    })).filter((item) => item.title || item.body)
    : (sectionBodyText ? [{ title: section.title || 'Notice', body: sectionBodyText }] : []);
  const displayedNoticeItems = noticeItems.slice(0, 3);

  return (
    <section
      id={anchor}
      className={`pub-section section-text size-medium ${sectionClassName} pub-event-notice-section`}
      style={{
        ...sectionStyle,
        '--oe-ribbon-bg': `url("${officialRibbonImageUrl}")`,
      } as React.CSSProperties}
    >
      <div className="pub-section-inner">
        <h3 className="text-title">{section.title || 'Notice'}</h3>
        {section.subtitle && <p className="pub-event-section-subtitle">{section.subtitle}</p>}
        {displayedNoticeItems.length > 0 && (
          <div className="pub-event-notice-list">
            <article className="pub-event-notice-card">
              {displayedNoticeItems.map((item, index) => (
                <div className="pub-event-notice-row" key={`${item.title}-${index}`}>
                  <h4>{item.title}</h4>
                  {item.body && <p title={item.body}>{item.body}</p>}
                </div>
              ))}
            </article>
          </div>
        )}
      </div>
    </section>
  );
}

function renderContactSection(
  section: EventPageSection,
  sectionClassName: string,
  sectionStyle: React.CSSProperties,
  anchor: string,
  blocks: EventPageBlock[],
) {
  const contactBlock = blocks.find((block) => block.useYn !== 'N');
  const email = contactBlock?.linkUrl?.startsWith('mailto:') ? contactBlock.linkUrl.replace('mailto:', '') : 'acls@kcab.or.kr';
  const contactTitle = contactBlock?.title || '';
  const contactSummary = contactBlock?.summary || '';
  const description = [contactTitle, contactSummary].filter(Boolean).join(' - ')
    || stripHtml(section.body || '')
    || 'For event inquiries, registration changes, or delegate assistance.';
  const contactButtonLabel = contactBlock?.buttonLabel || section.navLabel || section.title || 'Contact';

  return (
    <section id={anchor} className={`pub-section section-text size-medium ${sectionClassName} pub-event-contact-section`} style={sectionStyle}>
      <div className="pub-section-inner">
        <div className="pub-event-contact-copy">
          <span>Get in Touch</span>
          <h3>{section.title || 'Contact'}</h3>
          <p>{description}</p>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        <form className="pub-event-contact-form">
          <label>
            <span>Your Email</span>
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            <span>Message</span>
            <textarea placeholder="How can we help?" />
          </label>
          <button type="button">
            {contactButtonLabel}
            <span aria-hidden="true">{'\u2197'}</span>
          </button>
        </form>
      </div>
    </section>
  );
}

function renderVenueFact(label: string, value?: string | null) {
  if (!value) return null;
  return (
    <dl className="pub-event-venue-fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

function getFirstHtmlParagraph(value?: string | null) {
  if (!value) return '';
  const match = value.match(/<p[\s\S]*?<\/p>/i);
  return match ? match[0] : value;
}

function normalizeRegistrationType(value?: string | null): RegistrationActionType {
  const normalized = (value || 'none').trim().toLowerCase();
  if (normalized === 'direct' || normalized === 'external' || normalized === 'none') {
    return normalized;
  }
  return 'none';
}

function resolvePublicRegistrationFields(fields?: EventRegistrationFieldItem[] | null): EventRegistrationFieldItem[] {
  const configured = fields?.length ? fields : DEFAULT_REGISTRATION_FIELDS;
  return configured
    .filter((field) => field.enabledYn === 'Y' && REGISTRATION_FIELD_INPUTS[field.fieldCode])
    .map((field, index) => ({
      ...field,
      fieldLabel: field.fieldLabel || DEFAULT_REGISTRATION_FIELDS.find((item) => item.fieldCode === field.fieldCode)?.fieldLabel || field.fieldCode,
      requiredYn: field.fieldCode === 'email' ? 'Y' : field.requiredYn,
      sortSeq: field.sortSeq ?? index + 1,
    }))
    .sort((a, b) => (a.sortSeq ?? 0) - (b.sortSeq ?? 0));
}

function cleanParticipant(
  participant: PublicRegistrationParticipantRequest,
  fields?: EventRegistrationFieldItem[] | null,
): PublicRegistrationParticipantRequest {
  const enabledCodes = new Set(resolvePublicRegistrationFields(fields).map((field) => field.fieldCode));
  const cleaned: PublicRegistrationParticipantRequest = {
    firstName: enabledCodes.has('first_name') ? participant.firstName.trim() : '',
    middleName: enabledCodes.has('middle_name') ? participant.middleName?.trim() ?? '' : '',
    lastName: enabledCodes.has('last_name') ? participant.lastName.trim() : '',
    email: participant.email.trim().toLowerCase(),
    organizationName: enabledCodes.has('organization_name') ? participant.organizationName?.trim() ?? '' : '',
    position: enabledCodes.has('position') ? participant.position?.trim() ?? '' : '',
    phone: enabledCodes.has('phone') ? participant.phone?.trim() ?? '' : '',
    address: enabledCodes.has('address') ? participant.address?.trim() ?? '' : '',
    city: enabledCodes.has('city') ? participant.city?.trim() ?? '' : '',
    nationality: enabledCodes.has('nationality') ? participant.nationality?.trim() ?? '' : '',
    residenceCountry: enabledCodes.has('residence_country') ? participant.residenceCountry?.trim() ?? participant.country?.trim() ?? '' : '',
    country: enabledCodes.has('residence_country') ? participant.residenceCountry?.trim() ?? participant.country?.trim() ?? '' : '',
  };
  return cleaned;
}

function validateRegistrationParticipant(
  participant: PublicRegistrationParticipantRequest,
  fields?: EventRegistrationFieldItem[] | null,
) {
  const activeFields = resolvePublicRegistrationFields(fields);
  const cleaned = cleanParticipant(participant, fields);
  for (const field of activeFields) {
    if (field.requiredYn !== 'Y') continue;
    const inputConfig = REGISTRATION_FIELD_INPUTS[field.fieldCode];
    const value = inputConfig ? cleaned[inputConfig.key] : '';
    if (!String(value ?? '').trim()) {
      return `Please enter ${field.fieldLabel}.`;
    }
  }
  if (!isValidRegistrationEmail(cleaned.email)) {
    return 'Please enter a valid email address.';
  }
  return '';
}

function isValidRegistrationEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatMoney(amount?: number | string | null, currency?: string | null) {
  const value = Number(amount ?? 0);
  const code = currency || 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: code === 'KRW' ? 0 : 2,
    }).format(Number.isFinite(value) ? value : 0);
  } catch {
    return `${code} ${Number.isFinite(value) ? value.toLocaleString() : '0'}`;
  }
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

function formatEventMeta(page: PublicEventPageModel) {
  const parts = [formatBlockDateRange(page.eventStartDt, page.eventEndDt), page.location].filter(Boolean);
  return parts.join(' | ');
}

function formatDate(value?: string | null) {
  if (!value) return '';
  const date = parseDateTime(value);
  if (!date) return value.replace('T', ' ').slice(0, 16);
  return `${formatDateOnly(date)} ${formatTimeOnly(date)}`;
}

function formatBlockDateRange(start?: string | null, end?: string | null) {
  const startDate = parseDateTime(start);
  const endDate = parseDateTime(end);

  if (startDate && endDate) {
    if (isSameDay(startDate, endDate)) {
      return `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)} - ${formatTimeOnly(endDate)}`;
    }
    return `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)} - ${formatDateOnly(endDate)} ${formatTimeOnly(endDate)}`;
  }

  const startText = startDate ? `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)}` : formatDate(start);
  const endText = endDate ? `${formatDateOnly(endDate)} ${formatTimeOnly(endDate)}` : formatDate(end);
  if (startText && endText) return `${startText} - ${endText}`;
  return startText || endText;
}

function formatBlockTime(block: EventPageBlock) {
  const startDate = parseDateTime(block.startAt);
  const endDate = parseDateTime(block.endAt);

  if (startDate && endDate) {
    if (isSameDay(startDate, endDate)) {
      return `${formatTimeOnly(startDate)} - ${formatTimeOnly(endDate)}`;
    }
    return `${formatDateOnly(startDate)} ${formatTimeOnly(startDate)} - ${formatDateOnly(endDate)} ${formatTimeOnly(endDate)}`;
  }

  if (startDate) return formatTimeOnly(startDate);
  if (endDate) return formatTimeOnly(endDate);
  return formatBlockDateRange(block.startAt, block.endAt);
}

function parseDateTime(value?: string | null) {
  if (!value) return null;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateOnly(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTimeOnly(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function parseTheme(themeJson?: unknown): PageTheme {
  if (!themeJson) return DEFAULT_THEME;
  if (typeof themeJson === 'object' && !Array.isArray(themeJson)) {
    return {
      ...DEFAULT_THEME,
      ...(themeJson as Partial<PageTheme>),
    };
  }
  if (typeof themeJson !== 'string') return DEFAULT_THEME;
  try {
    return {
      ...DEFAULT_THEME,
      ...JSON.parse(themeJson),
    };
  } catch {
    return DEFAULT_THEME;
  }
}

function parsePageSettings(settingsJson?: unknown): PageSettings {
  if (!settingsJson) return {};
  if (typeof settingsJson === 'object' && !Array.isArray(settingsJson)) {
    return settingsJson as PageSettings;
  }
  if (typeof settingsJson !== 'string') return {};
  try {
    return JSON.parse(settingsJson);
  } catch {
    return {};
  }
}

function parseSectionSettings(settingsJson?: unknown): SectionSettings {
  if (!settingsJson) return {};
  if (typeof settingsJson === 'object' && !Array.isArray(settingsJson)) {
    return settingsJson as SectionSettings;
  }
  if (typeof settingsJson !== 'string') return {};
  try {
    return JSON.parse(settingsJson);
  } catch {
    return {};
  }
}

function parseBlockContent(contentJson?: unknown): Record<string, unknown> {
  if (!contentJson) return {};
  if (typeof contentJson === 'object' && !Array.isArray(contentJson)) {
    return contentJson as Record<string, unknown>;
  }
  if (typeof contentJson !== 'string') return {};
  try {
    return JSON.parse(contentJson);
  } catch {
    return {};
  }
}

function getProgramTrack(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const track = typeof content.track === 'string' ? content.track : '';
  return track || block.subtitle || 'Main Schedule';
}

function getBlockImageUrl(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const externalImageUrl = typeof content.imageUrl === 'string' ? content.imageUrl : '';
  return block.imageUrl || externalImageUrl;
}

function parseImageUrlsText(value: string) {
  return value
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function normalizeImageUrlList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((url): url is string => typeof url === 'string')
      .map((url) => url.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return parseImageUrlsText(value);
  }
  return [];
}

function getProgramImageUrls(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const externalImageUrl = typeof content.imageUrl === 'string' ? content.imageUrl : '';
  return Array.from(new Set([
    block.imageUrl || '',
    externalImageUrl,
    ...normalizeImageUrlList(content.imageUrls),
  ].map((url) => url.trim()).filter(Boolean)));
}

function getOrganizationGroup(block: EventPageBlock) {
  const content = parseBlockContent(block.contentJson);
  const category = typeof content.category === 'string' ? content.category : block.badgeText || '';
  return category || 'Supporters';
}

function groupOrganizationBlocks(blocks: EventPageBlock[]) {
  const orderedGroups: string[] = [];
  const grouped = blocks.reduce<Record<string, EventPageBlock[]>>((acc, block) => {
    const group = getOrganizationGroup(block);
    if (!acc[group]) {
      acc[group] = [];
      orderedGroups.push(group);
    }
    acc[group].push(block);
    return acc;
  }, {});
  return orderedGroups.map((group) => [group, grouped[group]] as const);
}

function isOrganizerGroup(group: string) {
  return group.toLowerCase().includes('organizer') || group.includes('\uc8fc\ucd5c');
}

function getProgramSessionType(content: Record<string, unknown>) {
  const value = typeof content.sessionType === 'string' ? content.sessionType : 'session';
  return ['session', 'opening', 'keynote', 'panel', 'break', 'networking'].includes(value) ? value : 'session';
}

function getProgramSessionTypeLabel(type: string) {
  const labels: Record<string, string> = {
    session: 'Session',
    opening: 'Opening',
    keynote: 'Keynote',
    panel: 'Panel',
    break: 'Break',
    networking: 'Networking',
  };
  return labels[type] || labels.session;
}

function formatStatusLabel(status?: string | null) {
  if (!status) return '';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function groupProgramBlocks(blocks: EventPageBlock[]) {
  const orderedTracks: string[] = [];
  const grouped = blocks.reduce<Record<string, EventPageBlock[]>>((acc, block) => {
    const track = getProgramTrack(block);
    if (!acc[track]) {
      acc[track] = [];
      orderedTracks.push(track);
    }
    acc[track].push(block);
    return acc;
  }, {});
  return orderedTracks.map((track) => [track, grouped[track]] as const);
}

function getThemeColor(themeColor: string) {
  return THEME_COLOR_MAP[themeColor] ?? THEME_COLOR_MAP.navy;
}

function buildHeroStyle(theme: PageTheme, heroImageUrl?: string | null): React.CSSProperties {
  if (heroImageUrl) {
    return {
      backgroundImage: `${getOverlayGradient(theme.heroOverlay)}, url("${heroImageUrl}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    };
  }

  const baseColor = theme.heroBackgroundColor || DEFAULT_THEME.heroBackgroundColor;
  const accentColor = getThemeColor(theme.themeColor);
  return {
    background: `linear-gradient(135deg, ${baseColor} 0%, ${accentColor} 100%)`,
  };
}

function getOverlayGradient(overlay: PageTheme['heroOverlay']) {
  if (overlay === 'light') {
    return 'linear-gradient(135deg, rgba(255,255,255,.78), rgba(255,255,255,.38))';
  }
  if (overlay === 'none') {
    return 'linear-gradient(135deg, rgba(0,0,0,0), rgba(0,0,0,0))';
  }
  return 'linear-gradient(135deg, rgba(16,32,51,.84), rgba(16,32,51,.48))';
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '');
}

export default PublicEventPage;
