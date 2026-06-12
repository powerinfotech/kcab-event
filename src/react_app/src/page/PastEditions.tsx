'use client';

/**
 * PastEditions - Past SAF Editions page (Seoul ADR Festival archive)
 *
 * Uses the shared renewal header/footer through PublicRenewalLayout.
 */
import React, { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul.jpg';
import HomeIcon from '../assets/images/saf-renewal/media-partners/home.svg';
import { saf2024EventDetails } from './Saf2024EventDetails';
import { saf2025EventDetails } from './Saf2025EventDetails';

interface PastEdition {
  year: number;
  dateRange: string;
  theme?: string;
  badge?: string;
  /** PDF or external archive URL. */
  archiveUrl?: string;
  /** Internal archive detail path. Uses SPA navigation when present. */
  detailPath?: string;
}

interface SafArchiveHost {
  name: string;
  logo: string;
  href?: string;
  subtitle?: string;
}

interface SafArchiveEvent {
  time: string;
  title: string;
  eventType?: string;
  format?: string;
  venue?: string;
  hostedBy?: string;
  summary?: string;
  topics?: string[];
  topicLabel?: string;
  sourceHref?: string;
  sourceLabel?: string;
  hostLabel?: string;
  showHostNames?: boolean;
  hosts: SafArchiveHost[];
}

interface SafArchiveDay {
  label: string;
  date: string;
  events: SafArchiveEvent[];
}

const saf2020HostBasePath = '/archives/2020/hosts';

const saf2020Hosts: Record<string, SafArchiveHost> = {
  kaa: {
    name: 'The Korean Arbitrators Association',
    logo: `${saf2020HostBasePath}/kaa.jpg`,
    href: 'http://www.kaarb.or.kr/default/',
  },
  siac: {
    name: 'SIAC',
    logo: `${saf2020HostBasePath}/siac.png`,
    href: 'https://www.siac.org.sg/',
  },
  kcab: {
    name: 'KCAB INTERNATIONAL',
    logo: `${saf2020HostBasePath}/kcab-international.png`,
    href: 'http://www.kcabinternational.or.kr',
  },
  uncitral: {
    name: 'UNCITRAL',
    logo: `${saf2020HostBasePath}/uncitral.png`,
  },
  moj: {
    name: 'Ministry of Justice',
    logo: `${saf2020HostBasePath}/moj.png`,
  },
  kocia: {
    name: 'KOCIA',
    logo: `${saf2020HostBasePath}/kocia.jpg`,
  },
  kica: {
    name: 'KICA',
    logo: `${saf2020HostBasePath}/kica.jpg`,
    href: 'https://www.kica.bar/index_eng.htm',
  },
  simc: {
    name: 'SIMC',
    logo: `${saf2020HostBasePath}/simc.jpg`,
    href: 'https://simc.com.sg/',
  },
  hsf: {
    name: 'Herbert Smith Freehills',
    logo: `${saf2020HostBasePath}/hsf.png`,
    href: 'https://www.herbertsmithfreehills.com/',
  },
  kimChang: {
    name: 'Kim & Chang',
    logo: `${saf2020HostBasePath}/kim-chang.png`,
    href: 'https://www.kimchang.com/en/main.kc',
  },
  kcabNext: {
    name: 'KCAB NEXT',
    logo: `${saf2020HostBasePath}/kcab-next.png`,
    href: 'http://www.kcabinternational.or.kr/common/index.do?jpath=/contents/sub040601',
  },
  brg: {
    name: 'Berkeley Research Group',
    logo: `${saf2020HostBasePath}/brg.png`,
  },
  ysiac: {
    name: 'YSIAC',
    logo: `${saf2020HostBasePath}/ysiac.jpg`,
    href: 'https://siac.org.sg/about-ysiac',
  },
  yconstruction: {
    name: 'YConstruction',
    logo: `${saf2020HostBasePath}/yconstruction.png`,
  },
  peterKim: {
    name: 'Peter & Kim',
    logo: `${saf2020HostBasePath}/peter-kim.png`,
    href: 'https://peterandkim.com/',
  },
  hk45: {
    name: 'HK45',
    logo: `${saf2020HostBasePath}/hk45.png`,
  },
  hkiac: {
    name: 'HKIAC',
    logo: `${saf2020HostBasePath}/hkiac.png`,
  },
  icc: {
    name: 'ICC',
    logo: `${saf2020HostBasePath}/icc.png`,
    href: 'https://iccwbo.org/',
  },
  seoulIdrc: {
    name: 'Seoul IDRC',
    logo: `${saf2020HostBasePath}/seoul-idrc.png`,
    href: 'http://www.sidrc.org/idrc/en/main/main.do',
  },
  kaas: {
    name: 'The Korean Association of Arbitration Studies',
    logo: `${saf2020HostBasePath}/kaas.png`,
  },
};

const editions: PastEdition[] = [
  {
    year: 2025,
    dateRange: 'Oct 26 - Oct 31, 2025',
    theme: 'Unveiling Excellence in Arbitration',
    badge: 'Latest',
    detailPath: '/past-editions/2025',
  },
  {
    year: 2024,
    dateRange: 'Oct 28 - Nov 1, 2024',
    theme: 'ADR Reborn',
    detailPath: '/past-editions/2024',
  },
  {
    year: 2023,
    dateRange: 'Oct 30 - Nov 3, 2023',
    theme: 'New World, No Map',
    detailPath: '/past-editions/2023',
  },
  {
    year: 2022,
    dateRange: 'Nov 7 - Nov 11, 2022',
    theme: 'Resilience for Recovery',
    detailPath: '/past-editions/2022',
  },
  {
    year: 2021,
    dateRange: 'Nov 1 - Nov 5, 2021',
    theme: 'Innovating the Future of Dispute Resolution Beyond 2021',
    detailPath: '/past-editions/2021',
  },
  {
    year: 2020,
    dateRange: 'Nov 2 - Nov 7, 2020',
    theme: 'The New Arbitration Landscape: 2020 and Beyond',
    detailPath: '/past-editions/2020',
  },
  {
    year: 2019,
    dateRange: 'Sep 17 - Sep 21, 2019',
    theme: 'Resilience for Recovery',
    archiveUrl: 'http://www.safkcab.com/',
  },
  {
    year: 2018,
    dateRange: 'Nov 4 - Nov 9, 2018',
    theme: 'Innovating the Future of Dispute Resolution',
    archiveUrl: 'http://saf2018.safkcab.com/index.html',
  },
  {
    year: 2017,
    dateRange: 'Nov 6 - Nov 11, 2017',
    theme: 'Access to Justice Innovations in Transnational Trade and Investment',
    archiveUrl: '/archives/SAF2017.pdf',
  },
  { year: 2016, dateRange: 'Oct 10 - Oct 14, 2016', archiveUrl: '/archives/SAF2016.pdf' },
  {
    year: 2015,
    dateRange: 'Nov 2 - Nov 6, 2015',
    archiveUrl: '/archives/SAF2015.pdf',
  },
];

const saf2024Days: SafArchiveDay[] = [
  {
    label: 'Mon',
    date: 'October 28',
    events: [
      {
        time: '09:00 - 11:30',
        title: 'Commercial, cultural and legal challenges in cross-border construction projects',
        eventType: 'Partner Event',
        hostedBy: 'SCL Korea - SCL HK - Secretariat - rosenblatt - Yoon & Yang - BAE, KIM & LEE',
        sourceHref: 'https://www.seouladrfestival.com/복제-mon-yoon-yang',
        hosts: [],
      },
      {
        time: '11:00 - 13:00',
        title: 'Delay and Delay Damage Claims in Construction Projects',
        eventType: 'Partner Event',
        hostedBy: 'Yulchon - Crown Office Chambers - Yendall Hunter',
        sourceHref: 'https://www.seouladrfestival.com/mon-yulchoon-yendallhunter',
        hosts: [],
      },
      {
        time: '12:30 - 14:30',
        title: 'New and Renewable Energy Landscape in Korea and Beyond - Current Issues in Project Development and Dispute Resolution',
        eventType: 'Partner Event',
        hostedBy: 'Yoon & Yang - Al Tamimi & Co. - 39 Essex Chambers',
        sourceHref: 'https://www.seouladrfestival.com/복제-tue-dis',
        hosts: [],
      },
      {
        time: '15:00 - 17:00',
        title: 'Innovating Justice: How Tech is Shaping the Future of Arbitration & International Law',
        eventType: 'Partner Event',
        hostedBy: 'Jus Mundi - Yulchon',
        sourceHref: 'https://www.seouladrfestival.com/mon-jusmundi-yulchon',
        hosts: [],
      },
      {
        time: '16:00 - 17:30',
        title: 'Arbitrating Private Equity Disputes',
        eventType: 'Partner Event',
        hostedBy: 'Kim & Chang - Debevoise & Plimpton',
        sourceHref: 'https://www.seouladrfestival.com/mon-kim-chang-debevoise-plimpton',
        hosts: [],
      },
      {
        time: '16:00 - 18:30',
        title: 'Beyond the courtroom: Insider strategies to tip the scales in your favour',
        eventType: 'Partner Event',
        hostedBy: 'HKA - Lee & Ko - Yulchon - Clifford Chance - Al Tamimi & Co.',
        sourceHref: 'https://www.seouladrfestival.com/hka-lee-ko-yulchonandcliffordchance',
        hosts: [],
      },
      {
        time: '19:00 - 21:00',
        title: 'Seoul ADR Festival: Welcome Reception',
        eventType: 'Official Event',
        hostedBy: 'KCAB International',
        hosts: [],
      },
      {
        time: '20:00 - 22:00',
        title: 'Baker McKenzie KL Partners Drinks Reception',
        eventType: 'Partner Event',
        hostedBy: 'Baker McKenzie & KL Partners',
        sourceHref: 'https://www.seouladrfestival.com/mon-bakermckenzie',
        hosts: [],
      },
    ],
  },
  {
    label: 'Tue',
    date: 'October 29',
    events: [
      {
        time: '07:30 - 09:15',
        title: 'HKA Charity Walk and Breakfast',
        eventType: 'Partner Event',
        hostedBy: 'HKA - Campaign for Greener Arbitrations',
        sourceHref: 'https://www.seouladrfestival.com/tue-hka',
        hosts: [],
      },
      {
        time: '09:00 - 12:00',
        title: 'The Art of Cross-Examination: Mock Proceedings and a Discussion on Effective Cross-Examination',
        eventType: 'Partner Event',
        hostedBy: 'SIAC - YSIAC',
        sourceHref: 'https://www.seouladrfestival.com/tue-siac-ysiac',
        hosts: [],
      },
      {
        time: '09:30 - 16:30',
        title: '2024 KMOJ - UNCITRAL ADR Special Session',
        eventType: 'Partner Event',
        hostedBy: 'Ministry of Justice of Korea - UNCITRAL',
        summary: 'Invitation only',
        sourceHref: 'https://www.seouladrfestival.com/tue-uncitral-ministryofjustice',
        hosts: [],
      },
      {
        time: '10:00 - 12:30',
        title: 'Energy Transition Era and New Legal Challenges',
        eventType: 'Partner Event',
        hostedBy: 'Kim & Chang - KCCI',
        sourceHref: 'https://www.seouladrfestival.com/tue-kim-chang-kcci',
        hosts: [],
      },
      {
        time: '10:30 - 12:00',
        title: 'Navigating Enforcement Proceedings: Practical Strategies, Tips, and Pitfalls from Leading Cases',
        eventType: 'Partner Event',
        hostedBy: 'BAE, KIM & LEE',
        sourceHref: 'https://www.seouladrfestival.com/baekim-lee',
        hosts: [],
      },
      {
        time: '11:00 - 12:00',
        title: 'Construction Arbitration Around the Globe',
        eventType: 'Partner Event',
        hostedBy: 'Covington & Burling',
        sourceHref: 'https://www.seouladrfestival.com/복제-tue-siac-ysiac',
        hosts: [],
      },
      {
        time: '13:00 - 16:00',
        title: 'Skills Workshop: Tools and Ingredients for a Successful Settlement',
        eventType: 'Partner Event',
        hostedBy: 'Jipyong - SIMC',
        sourceHref: 'https://www.seouladrfestival.com/tue-jipyong-simc',
        hosts: [],
      },
      {
        time: '14:00 - 15:30',
        title: 'Arbitral Procedures - How creative have we been and can we go further?',
        eventType: 'Partner Event',
        hostedBy: 'HKIAC - Yulchon',
        sourceHref: 'https://www.seouladrfestival.com/tue-hkiac-yulchon',
        hosts: [],
      },
      {
        time: '15:00 - 17:00',
        title: 'DIS@SAF: To be, or not to be sandwiched - The new DIS Supplementary Rules for Third-Party Notices',
        eventType: 'Partner Event',
        hostedBy: 'German Arbitration Institute (DIS)',
        sourceHref: 'https://www.seouladrfestival.com/tue-dis',
        hosts: [],
      },
      {
        time: '16:30 - 18:00',
        title: 'Pitfalls to avoid when doing business in India',
        eventType: 'Partner Event',
        hostedBy: 'Shin & Kim - Secretariat - 39 Essex Chambers - Quinn Emanuel - Indian Chamber of Commerce in Korea (ICCK)',
        sourceHref: 'https://www.seouladrfestival.com/tue-shin-kim',
        hosts: [],
      },
      {
        time: '15:00 - 18:00',
        title: 'Lee & Ko - HSF',
        eventType: 'Partner Event',
        hostedBy: 'Lee & Ko - HSF',
        hosts: [],
      },
      {
        time: '18:00 - 20:00',
        title: 'Seoul ADR Festival: Gala Dinner',
        eventType: 'Official Event',
        hostedBy: 'KCAB International',
        summary: 'By invitation only',
        hosts: [],
      },
      {
        time: '19:00 - 21:00',
        title: 'The Lee & Ko Dinner',
        eventType: 'Partner Event',
        hostedBy: 'Lee & Ko',
        sourceHref: 'https://www.seouladrfestival.com/복제-thu-icc-1',
        hosts: [],
      },
      {
        time: '19:00 - 22:00',
        title: 'Yulchon Private Dinner & Yacht Cruise',
        eventType: 'Partner Event',
        hostedBy: 'Yulchon',
        summary: 'Invitation only',
        sourceHref: 'https://www.seouladrfestival.com/tue-yulchon',
        hosts: [],
      },
      {
        time: '20:00 -',
        title: 'CMS Cocktail Reception',
        eventType: 'Partner Event',
        hostedBy: 'CMS',
        sourceHref: 'https://www.seouladrfestival.com/복제-tue-yulchon',
        hosts: [],
      },
    ],
  },
  {
    label: 'Wed',
    date: 'October 30',
    events: [
      {
        time: '09:00 - 18:00',
        title: 'Seoul ADR Festival: The 13th Asia-Pacific ADR Conference',
        eventType: 'Official Event',
        hostedBy: 'KCAB International',
        summary: 'ADR Reborn: Dynamics of Renewed Asian ADR Landscape',
        sourceHref: 'https://www.seouladrfestival.com/adr-conference-2024',
        hosts: [],
      },
      {
        time: '16:00 - 18:30',
        title: "A deep dive into renewable energy disputes in the Asia Pacific region and the IBA's revised Guidelines on Conflicts of Interest",
        eventType: 'Partner Event',
        hostedBy: 'IBA Asia Pacific Arbitration Group',
        sourceHref: 'https://www.seouladrfestival.com/wed-iba',
        hosts: [],
      },
      {
        time: '19:00 - 22:00',
        title: 'Peter & Kim K-Arts Concert',
        eventType: 'Partner Event',
        hostedBy: 'Peter & Kim',
        sourceHref: 'https://www.seouladrfestival.com/wed-peter-kim',
        hosts: [],
      },
      {
        time: '19:00 - 21:00',
        title: 'Past, Present and Future of Arbitration in Asia: Diversity and Inclusion',
        eventType: 'Partner Event',
        hostedBy: "Women's Interest Committee",
        sourceHref: 'https://www.seouladrfestival.com/복제-tue-shin-kim',
        hosts: [],
      },
    ],
  },
  {
    label: 'Thu',
    date: 'October 31',
    events: [
      {
        time: '09:30 - 12:00',
        title: 'Challenging Arbitration Awards in Singapore & South Korea',
        eventType: 'Partner Event',
        hostedBy: 'Kim & Chang - SCMA Seoul Breakfast Conference 2024',
        summary: 'A review of recent Singaporean and Korean arbitration decisions',
        sourceHref: 'https://www.seouladrfestival.com/thu-kim-chang-scma',
        hosts: [],
      },
      {
        time: '09:00 - 18:00',
        title: 'GAR Live: Seoul',
        eventType: 'Partner Event',
        hostedBy: 'Global Arbitration Review',
        sourceHref: 'https://events.globalarbitrationreview.com/event/GARSEOUL2024/websitePage:2e8a6cb7-917e-405c-83ff-8a8b14d1855f',
        hosts: [],
      },
      {
        time: '11:30 - 13:30',
        title: 'ICC Potluck Event: The New Cross-Cultural Playbook for Global Arbitration',
        eventType: 'Partner Event',
        hostedBy: 'ICC - Yulchon - Lee & Ko',
        sourceHref: 'https://www.seouladrfestival.com/복제-fri-limnexus-svamc-steve',
        hosts: [],
      },
      {
        time: '15:00 - 18:00',
        title: 'Insights from the Institution - interactive panel discussion and a conversation with the LCIA Director General',
        eventType: 'Partner Event',
        hostedBy: 'LCIA - Kim & Chang',
        sourceHref: 'https://www.seouladrfestival.com/복제-thu-icc',
        hosts: [],
      },
      {
        time: '16:30 - 18:00',
        title: 'Enforcement and Setting Aside of Arbitral Awards',
        eventType: 'Partner Event',
        hostedBy: 'IHCF-KOCIA',
        sourceHref: 'https://www.seouladrfestival.com/thu-ihcf-kocia',
        hosts: [],
      },
      {
        time: '17:00 - 18:30',
        title: 'Agricultural Trade Matters: Beefing Up the Australia-Korea Commercial Relationship',
        eventType: 'Partner Event',
        hostedBy: 'ACICA - Peter & Kim',
        sourceHref: 'https://www.seouladrfestival.com/thu-acica-peter-kim',
        hosts: [],
      },
      {
        time: '18:00 - 21:00',
        title: 'Fireside Chat with Clients',
        eventType: 'Partner Event',
        hostedBy: 'Jipyong - Mori Hamada & Matsumoto - Matson, Driscoll & Damico - Oppenheim Law Firm',
        sourceHref: 'https://www.seouladrfestival.com/tue-jipyong',
        hosts: [],
      },
      {
        time: '18:00 - 21:30',
        title: 'YIAG Meet & Mingle in Korea',
        eventType: 'Partner Event',
        hostedBy: 'YIAG - Kim & Chang - KOCIA',
        sourceHref: 'https://www.seouladrfestival.com/tue-yiag',
        hosts: [],
      },
    ],
  },
  {
    label: 'Fri',
    date: 'November 1',
    events: [
      {
        time: '09:00 - 10:30',
        title: 'Navigating the use of AI in Arbitration: Practical Scenarios, Ethical Issues, and Best Practices',
        eventType: 'Partner Event',
        hostedBy: 'LimNexus - SVAMC - Stevenson, Wong & Co - California Arbitration',
        sourceHref: 'https://www.seouladrfestival.com/fri-limnexus-svamc-steve',
        hosts: [],
      },
      {
        time: '10:00 - 14:00',
        title: 'TPF(Third-Party Funding) Utilization for Cross-border Disputes',
        eventType: 'Partner Event',
        hostedBy: 'LITIG Equity Partners',
        summary: 'Lunch seminar',
        sourceHref: 'https://www.seouladrfestival.com/fri-litig',
        hosts: [],
      },
      {
        time: '11:30 - 14:00',
        title: 'Public International Law: Emerging and Future Disputes',
        eventType: 'Partner Event',
        hostedBy: 'Watson Farley & Williams',
        sourceHref: 'https://www.seouladrfestival.com/fri-watsonfarley-williams',
        hosts: [],
      },
      {
        time: '14:00 - 16:00',
        title: 'Witnessing Conferencing: The Idea, Methods and Practice',
        eventType: 'Partner Event',
        hostedBy: 'Peter & Kim - Clifford Chance - WilmerHale',
        sourceHref: 'https://www.seouladrfestival.com/fir-peterkim',
        hosts: [],
      },
      {
        time: '16:00 - 18:00',
        title: 'Expert Evidence Can Make or Break Your Case - Proven Strategies to Win!',
        eventType: 'Partner Event',
        hostedBy: 'Dentons Lee - Dentons Rodyk',
        sourceHref: 'https://www.seouladrfestival.com/fri-dentonslee',
        hosts: [],
      },
    ],
  },
];

const saf2025Days: SafArchiveDay[] = [
  {
    label: 'Sun',
    date: 'October 26',
    events: [
      {
        time: '14:00 - 15:30',
        title: "The Campaign for Greener Arbitrations' Walk through Seoul",
        eventType: 'Partner Event',
        hostedBy: 'Campaign for Greener Arbitrations / HANEFELD / Peter & Kim',
        venue: 'Seokchon Lake',
        sourceHref: 'https://www.seouladrfestival.com/side/the-campaign-for-greener-arbitrations%E2%80%99-walk-through-seoul',
        sourceLabel: 'Find out more',
        hosts: [],
      },
    ],
  },
  {
    label: 'Mon',
    date: 'October 27',
    events: [
      {
        time: '09:30 - 11:30',
        title: 'Entering the Ring: A Practical Guide to Your First Arbitration',
        eventType: 'Partner Event',
        hostedBy: 'CIArb YMG Korea',
        venue: 'YEOYUL, Yulchon LLC (39F Parnas Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/ciarb-ymg-korea',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '10:00 - 12:00',
        title: 'Delays on Different Types of Projects',
        eventType: 'Partner Event',
        hostedBy: 'BKL - Yendall Hunter',
        venue: 'BKL Office in Seoul',
        sourceHref: 'https://www.seouladrfestival.com/side/bkl-yh',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '11:00 - 13:00',
        title: 'HKIAC / Eversheds Sutherland: Crypto & Tech Frontiers: Deals & Disputes Perspectives from Asia',
        eventType: 'Partner Event',
        hostedBy: 'HKIAC - Eversheds Sutherland',
        venue: 'KCAB Hearing Room 1 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/hkiac-evershedssutherland',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '13:30 - 15:30',
        title: 'The Practice of Data-enabled Alternative Dispute Resolution in China and Korea',
        eventType: 'Partner Event',
        hostedBy: 'Shanghai International Economic and Trade Arbitration Commission (Shanghai International Arbitration Center)',
        venue: 'Meeting Room 1, 51F, Trade Tower, 511 Yeongdong-daero, Gangnam-gu',
        sourceHref: 'https://www.seouladrfestival.com/side/shiac',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '14:00 - 17:00',
        title: 'Global Pharma - Bio IP Strategies and Dispute Resolution - Managing Global IP Risks and Utilizing TPF in Disputes',
        eventType: 'Partner Event',
        hostedBy: 'LITIG - KPBMA',
        venue: 'Conference Room, 4F KPBMA Building (161, Hyoryeong-ro, Seocho-gu)',
        sourceHref: 'https://www.seouladrfestival.com/side/litig',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '15:00 - 17:00',
        title: 'Recent Developments in US Regulatory Environment and Multi-Jurisdictional Disputes',
        eventType: 'Partner Event',
        hostedBy: 'Kim & Chang / King & Spalding',
        venue: 'KCAB Hearing Room 5 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/kimchang-joint',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '15:30 - 17:00',
        title: 'How International Arbitration and Mediation Works in Korea and Japan?',
        eventType: 'Partner Event',
        hostedBy: 'Ministry of Justice of Japan',
        venue: 'COEX 301',
        sourceHref: 'https://www.seouladrfestival.com/side/jmoj',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:00 - 18:00',
        title: 'ISDS Today: Seoul Conversations',
        eventType: 'Partner Event',
        hostedBy: 'Yulchon - Steptoe',
        venue: 'Yulchon Lecture Hall, 39F, Parnas Tower, 521 Teheran-ro, Gangnam-gu, Seoul 06164',
        sourceHref: 'https://www.seouladrfestival.com/side/yulchon-steptoe',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:00 - 18:00',
        title: 'The First 100 Days After A Dispute Arises: Settlement, Evidence, Forums, and Strategy',
        eventType: 'Partner Event',
        hostedBy: 'Lee & Ko',
        venue: 'Lee & Ko Seoul Office',
        sourceHref: 'https://www.seouladrfestival.com/side/leeandko-seminar',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:00 - 18:00',
        title: 'Monetizing the Award: Interim Measures, Asset Tracing and Enforcement',
        eventType: 'Partner Event',
        hostedBy: 'BKL / Debevoise & Plimpton LLP / HKIAC',
        venue: 'KCAB Hearing Room 1 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/bkl-debevoise-hkiac',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '18:00 - 21:00',
        title: 'SAF Welcome Reception',
        eventType: 'Official Event',
        hostedBy: 'KCAB International',
        venue: 'Mondrian Seoul Itaewon',
        sourceHref: 'https://www.seouladrfestival.com/welcome-reception',
        sourceLabel: 'Find out more',
        hosts: [],
      },
    ],
  },
  {
    label: 'Tue',
    date: 'October 28',
    events: [
      {
        time: '09:00 - 18:00',
        title: 'The Asia Civil Law Summit',
        eventType: 'Official Event',
        hostedBy: 'KCAB International',
        venue: 'Grand InterContinental Seoul Parnas',
        sourceHref: 'https://kcabinternational.glueup.com/event/the-asia-civil-law-summit-150825/',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '10:00 - 12:00',
        title: "State Measures and Investor Rights: Lessons from Korea's ISDS experience against the backdrop of global ISDS developments and geopolitical change",
        eventType: 'Partner Event',
        hostedBy: 'Vanguard',
        venue: 'KCAB Hearing Room 1 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/vanguard',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '10:00 - 12:00',
        title: 'DIS@SAF: Wind Farm Disputes - Global Perspectives',
        eventType: 'Partner Event',
        hostedBy: 'Peter & Kim - DIS',
        venue: 'Peter & Kim Office',
        sourceHref: 'https://www.seouladrfestival.com/side/peterkim-dis',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '10:00 - 11:30',
        title: 'NEOM, Reform, and Disputes in the Desert: Can SCCA Win Global Trust?',
        eventType: 'Partner Event',
        hostedBy: 'HFW - Yulchon',
        venue: 'Yulchon Lecture Hall',
        sourceHref: 'https://www.seouladrfestival.com/side/hfw-yulchon',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '11:00 - 12:30',
        title: 'Enhancing Efficiency in International Dispute Resolution: Practical Insights and Strategies',
        eventType: 'Partner Event',
        hostedBy: 'Yoon & Yang LLC - Atkin Chambers - Three Crowns - Hourani & Partners',
        venue: 'Yoon & Yang LLC (Main Conference Room 1, 34F ASEM Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/yoon-yang-joint',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '11:15 - 13:00',
        title: 'Arbitration Across Generations',
        eventType: 'Partner Event',
        hostedBy: 'Secretariat',
        venue: 'KCAB Hearing Room 5 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/secretariat',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '13:00 - 15:00',
        title: 'Kimchi Premium and Korea Discount: Cryptocurrency, AI, and Shareholder Disputes - A Luncheon Panel Discussion',
        eventType: 'Partner Event',
        hostedBy: 'Analysis Group - Freshfields',
        venue: 'KCAB Hearing Room 1 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/analysisgroup-freshfields',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '14:00 - 17:00',
        title: 'Global Dispute Strategy & Negotiations Workshop for SMEs',
        eventType: 'Partner Event',
        hostedBy: 'Jipyong LLC - SIMC',
        venue: 'Jipyong LLC',
        sourceHref: 'https://www.seouladrfestival.com/side/jipyong-simc',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '14:00 - 18:00',
        title: '2025 KMOJ / UNCITRAL ADR Special Session',
        eventType: 'Partner Event',
        hostedBy: 'KMOJ - UNCITRAL - KCAB',
        venue: 'KCAB Hearing Room 5 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/kmoj-uncitral-kcab',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '14:00 - 18:00',
        title: 'All About SIAC Arbitration: Insights, Industries, and the Road Ahead for Korea',
        eventType: 'Partner Event',
        hostedBy: 'SIAC',
        venue: 'Andaz Seoul Gangnam',
        sourceHref: 'https://www.seouladrfestival.com/side/siac',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:00 - 17:00',
        title: 'What You Need to Know Before Arbitrating in Mainland China',
        eventType: 'Partner Event',
        hostedBy: 'Shin & Kim',
        venue: 'KCAB Hearing Room 1 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/shin&kim',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:00 - 18:00',
        title: 'Broken Deals in Private Capital: Arbitration vs Litigation',
        eventType: 'Partner Event',
        hostedBy: 'BKL / HSF Kramer Herbert Smith Freehills',
        venue: 'BKL Office (Seminar Room 25F)',
        sourceHref: 'https://www.seouladrfestival.com/side/hsf-kramer-bkl',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:30 - 18:00',
        title: 'Swiss Contract Law: A Pragmatic and Balanced Alternative Law on the Merits',
        eventType: 'Partner Event',
        hostedBy: 'Peter & Kim / Swiss Arbitration',
        venue: 'Peter & Kim Office',
        sourceHref: 'https://www.seouladrfestival.com/side/peterandkim-swissarbitration',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '17:00 - 18:00',
        title: 'Investment Protections and Dispute Resolution Strategies in the India-South Korea Business Ecosystem. The Role of Regional Initiatives like MCIA',
        eventType: 'Partner Event',
        hostedBy: 'MCIA',
        venue: 'Zoom Webinar',
        sourceHref: 'https://www.seouladrfestival.com/side/mcia',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '18:00 - 20:00',
        title: 'From Strategy to Simulation: Using the New SIAC Rules and Mock EA with a PPO Application',
        eventType: 'Partner Event',
        hostedBy: 'SIAC - YSIAC',
        venue: 'Andaz Seoul Gangnam',
        sourceHref: 'https://www.seouladrfestival.com/side/ysiac',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '19:00 - 22:00',
        title: 'Yulchon - Jus Mundi Private Dinner & Yacht Cruise',
        eventType: 'Partner Event',
        hostedBy: 'Yulchon - Jus Mundi',
        venue: 'Golden Blue Marina (Banpo Hangang Park)',
        sourceHref: 'https://www.seouladrfestival.com/side/yulchon-jusmundi',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '20:00 - 00:00',
        title: 'CMS Cocktail Reception in Seoul',
        eventType: 'Partner Event',
        hostedBy: 'CMS',
        venue: 'ZEST bar (B1 26 KR 55 Dosandaero 55-gil, Gangnam-gu)',
        sourceHref: 'https://www.seouladrfestival.com/side/cms',
        sourceLabel: 'Find out more',
        hosts: [],
      },
    ],
  },
  {
    label: 'Wed',
    date: 'October 29',
    events: [
      {
        time: '09:00 - 20:00',
        title: 'The 14th Asia-Pacific ADR Conference & Garden Party',
        eventType: 'Official Event',
        hostedBy: 'KCAB International',
        venue: 'The Raum',
        sourceHref: 'https://adrconference.com/',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '19:30 - 22:30',
        title: 'Motion to Strike - Peter & Kim Bar and Bowling Event',
        eventType: 'Partner Event',
        hostedBy: 'Peter & Kim',
        venue: 'Smashing Bowl Cheongdam (B2, 818 Seolleung-ro, Gangnam-gu)',
        sourceHref: 'https://www.seouladrfestival.com/side/peter&kim',
        sourceLabel: 'Find out more',
        hosts: [],
      },
    ],
  },
  {
    label: 'Thu',
    date: 'October 30',
    events: [
      {
        time: '09:00 - 12:00',
        title: 'Saudi Arabia - Korea: Enabling Growth, Ensuring Certainty and Preventing Disputes',
        eventType: 'Partner Event',
        hostedBy: 'SCCA - Kim & Chang - Al Tamimi',
        venue: 'Crescendo Building, Kim & Chang',
        sourceHref: 'https://www.seouladrfestival.com/side/scca-kim&chang-al-tamimi',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '09:00 - 18:00',
        title: 'GAR Live: Seoul',
        eventType: 'Partner Event',
        hostedBy: 'GAR Live: Seoul',
        venue: 'Four Seasons Hotel Seoul',
        sourceHref: 'https://www.seouladrfestival.com/side/gar-live:-seoul',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '09:00 - 11:45',
        title: "The Right Dispute Resolution Tools for the Best Outcome - It's time to explore and consider Mediation and Arbitration",
        eventType: 'Partner Event',
        hostedBy: 'Dentons Rodyk and Dentons Lee',
        venue: 'Poongsan Building Auditorium (Underground @ B1) 23 Chungjeong-ro, Seodaemun-gu Seoul 03737 South Korea',
        sourceHref: 'https://www.seouladrfestival.com/side/dentons-lee',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '09:30 - 12:00',
        title: 'BKL - SCMA Korea Seminar & Networking 2025',
        eventType: 'Partner Event',
        hostedBy: 'BKL / Helmsman / King & Wood Mallesons / SCMA',
        venue: 'BKL Office (Seminar Room 25F)',
        sourceHref: 'https://www.seouladrfestival.com/side/bkl-scma',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '10:00 - 12:00',
        title: 'Gateway for Businesses to Effectively Resolve Disputes',
        eventType: 'Partner Event',
        hostedBy: 'DIAC - Horizons & Co - Greenberg Traurig',
        venue: 'KCAB Hearing Room 5 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/diac-horizonsco-greenbergtraurig',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '12:00 - 14:00',
        title: 'Cross like a Pro: Tips and Techniques for Young Practitioners',
        eventType: 'Partner Event',
        hostedBy: 'ICC YAAF',
        venue: 'Lee & Ko Seoul Office',
        sourceHref: 'https://www.seouladrfestival.com/side/icc-yaaf',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '12:30 - 14:30',
        title: 'Navigating U.S. Trade and Investment Policies and Dispute Risks for Korean Businesses',
        eventType: 'Partner Event',
        hostedBy: 'Jipyong LLC / Young ITA / KCAB Next / NYIAC',
        venue: 'Jipyong LLC',
        sourceHref: 'https://www.seouladrfestival.com/side/jipyong-youngita-kcabnext-nyiac',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '13:00 - 15:00',
        title: 'Tech Hubs Rising: Seoul, Dubai & the Innovations Shaping International Dispute Resolution',
        eventType: 'Partner Event',
        hostedBy: 'Jus Mundi / KCAB International / DIAC',
        venue: 'KCAB Hearing Room 5 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/jusmundi-kcab-diac',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '15:30 - 17:00',
        title: 'Panel Discussion: Protecting Legal Interests in Cross-Border Arbitration - Insights from Korea and Beyond',
        eventType: 'Partner Event',
        hostedBy: 'Stevenson, Wong & Co.',
        venue: 'KCAB Hearing Room 1 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/stevenson,-wong-&-co.',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:00 - 18:00',
        title: 'Exploring Emerging Trends in International Arbitration and Global Disputes',
        eventType: 'Partner Event',
        hostedBy: 'BKL - Clifford Chance',
        venue: 'BKL Office (Conference Room 3F)',
        sourceHref: 'https://www.seouladrfestival.com/side/bkl-clifford-chance',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '16:00 - 17:30',
        title: 'Enforcing Arbitration Awards in Vietnam - The Winds of Change',
        eventType: 'Partner Event',
        hostedBy: 'Peter & Kim - YKVN',
        venue: 'Peter & Kim Office, Trade Tower 38F',
        sourceHref: 'https://www.seouladrfestival.com/side/peterandkim-ykvn-joint-seminar',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '19:00 - 22:00',
        title: "WIC Mentorship & International Arbitration Networking at Changdeok's Doorstep",
        eventType: 'Partner Event',
        hostedBy: "Women's Interest Committee (WIC)",
        venue: 'Yudamhun (61, Changdeokgung-gil, Jongno-gu)',
        sourceHref: 'https://www.seouladrfestival.com/side/wic',
        sourceLabel: 'Find out more',
        hosts: [],
      },
    ],
  },
  {
    label: 'Fri',
    date: 'October 31',
    events: [
      {
        time: '08:30 - 10:30',
        title: 'Seoul-ful Breakfast with Arbitration Luminaries - featuring Gary Born and B.C. Yoon',
        eventType: 'Partner Event',
        hostedBy: 'KCAB Next - AFIA',
        venue: 'Kim & Chang Conference Hall (Crescendo Building, 75, Saemunan-ro, Jongno-gu)',
        sourceHref: 'https://www.seouladrfestival.com/side/kcab-next-afia',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '10:00 - 11:30',
        title: 'Mediation, Convention, and AI in Action: A New Era of Dispute Resolution',
        eventType: 'Partner Event',
        hostedBy: 'Singapore International Mediation Centre (SIMC) / KCAB International',
        venue: 'KCAB Hearing Room 5 (18F Trade Tower)',
        sourceHref: 'https://www.seouladrfestival.com/side/simc-kcab',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '12:00 - 14:00',
        title: 'ICC Potluck Event: Spotting Red Flags of Corruption in International Arbitration',
        eventType: 'Partner Event',
        hostedBy: 'ICC',
        venue: 'Yeoyul Cafe, 39F Yulchon Office, Parnas Tower, 521 Teheran-ro, Gangnam-gu, Seoul',
        sourceHref: 'https://www.seouladrfestival.com/side/icc-potluck-event',
        sourceLabel: 'Find out more',
        hosts: [],
      },
      {
        time: '14:00 - 16:00',
        title: 'Surviving U.S. Legal Shifts: from Tariffs to Antitrust',
        eventType: 'Partner Event',
        hostedBy: 'Yulchon - Steptoe',
        venue: 'Yulchon Lecture Hall, 39F, Parnas Tower, 521 Teheran-ro, Gangnam-gu, Seoul 06164',
        sourceHref: 'https://www.seouladrfestival.com/side/yulchon-steptoe-seminar',
        sourceLabel: 'Find out more',
        hosts: [],
      },
    ],
  },
];

const saf2020Days: SafArchiveDay[] = [
  {
    label: 'Mon',
    date: '2 November',
    events: [
      {
        time: '13:00 - 15:00',
        title: 'The Korean Arbitrators Association Seminar',
        venue: 'Seoul IDRC, Hearing Room 1',
        hosts: [saf2020Hosts.kaa],
      },
      {
        time: '16:00 - 17:30',
        title: 'SIAC - KCAB INTERNATIONAL Joint Webinar',
        format: 'Virtual',
        hosts: [saf2020Hosts.siac, saf2020Hosts.kcab],
      },
    ],
  },
  {
    label: 'Tue',
    date: '3 November',
    events: [
      {
        time: '09:00 - 17:00',
        title: 'UNCITRAL - MOJ Workshop - Day 1',
        format: 'Hybrid',
        hosts: [saf2020Hosts.uncitral, saf2020Hosts.moj],
      },
      {
        time: '10:00 - 12:00',
        title: 'KOCIA-KICA Webinar',
        format: 'Virtual',
        hosts: [saf2020Hosts.kocia, saf2020Hosts.kica],
      },
      {
        time: '16:00 - 17:20',
        title: 'SIMC - KCAB INTERNATIONAL Joint Event',
        format: 'Virtual',
        hosts: [saf2020Hosts.simc, saf2020Hosts.kcab],
      },
      {
        time: '18:30 - 21:30',
        title: 'The 3rd Women in Arbitration Networking Event',
        format: 'Virtual',
        hosts: [saf2020Hosts.hsf, saf2020Hosts.kimChang, saf2020Hosts.kcab],
      },
    ],
  },
  {
    label: 'Wed',
    date: '4 November',
    events: [
      {
        time: '09:00 - 17:00',
        title: 'UNCITRAL - MOJ Workshop - Day 2',
        format: 'Hybrid',
        hosts: [saf2020Hosts.uncitral, saf2020Hosts.moj],
      },
      {
        time: '11:00 - 12:00',
        title: 'KCAB NEXT SAF Event',
        hosts: [saf2020Hosts.kcabNext, saf2020Hosts.kcab],
      },
      {
        time: '16:00 - 17:30',
        title: 'Webinar on Legal and Practical Issues on Valuation',
        format: 'Virtual',
        hosts: [saf2020Hosts.kimChang, saf2020Hosts.brg],
      },
      {
        time: '17:00 - 18:15',
        title: 'YSIAC Seoul Debate',
        format: 'Virtual',
        hosts: [saf2020Hosts.ysiac],
      },
      {
        time: '19:00 - 20:00',
        title: 'YConstruction Virtual Discussion Round',
        format: 'Virtual',
        hosts: [saf2020Hosts.yconstruction, saf2020Hosts.peterKim],
      },
    ],
  },
  {
    label: 'Thu',
    date: '5 November',
    events: [
      {
        time: '13:00 - 14:00',
        title: 'HK45 SAF Seminar',
        format: 'Virtual',
        hosts: [saf2020Hosts.hk45, saf2020Hosts.hkiac],
      },
      {
        time: '14:00 - 15:30',
        title: 'HKIAC SAF Seminar',
        format: 'Virtual',
        hosts: [saf2020Hosts.hkiac],
      },
      {
        time: '16:00 - 19:00',
        title: 'The 9th Asia-Pacific ADR Conference - Day 1',
        format: 'Virtual',
        hosts: [
          saf2020Hosts.kcab,
          saf2020Hosts.uncitral,
          saf2020Hosts.moj,
          saf2020Hosts.icc,
          saf2020Hosts.seoulIdrc,
        ],
      },
    ],
  },
  {
    label: 'Fri',
    date: '6 November',
    events: [
      {
        time: '16:00 - 19:00',
        title: 'The 9th Asia-Pacific ADR Conference - Day 2',
        format: 'Virtual',
        hosts: [
          saf2020Hosts.kcab,
          saf2020Hosts.uncitral,
          saf2020Hosts.moj,
          saf2020Hosts.icc,
          saf2020Hosts.seoulIdrc,
        ],
      },
    ],
  },
  {
    label: 'Sat',
    date: '7 November',
    events: [
      {
        time: '14:00 - 17:00',
        title: 'The Korean Association of Arbitration Studies',
        format: 'Hybrid',
        hosts: [saf2020Hosts.kaas],
      },
    ],
  },
];

const saf2021HostBasePath = '/archives/2021/hosts';

const saf2021Hosts: Record<string, SafArchiveHost> = {
  simc: {
    name: 'SIMC',
    logo: `${saf2021HostBasePath}/simc.jpg`,
    href: 'https://simc.com.sg/',
  },
  yulchon: {
    name: 'Yulchon LLC',
    logo: `${saf2021HostBasePath}/yulchon.jpg`,
    href: 'https://www.yulchon.com/en/main/main.do',
  },
  hsf: {
    name: 'Herbert Smith Freehills',
    logo: `${saf2021HostBasePath}/hsf.png`,
    href: 'https://www.herbertsmithfreehills.com/',
  },
  ihcf: {
    name: 'IHCF',
    logo: `${saf2021HostBasePath}/ihcf.jpg`,
    href: 'https://www.ihcf.co.kr/en/index.php',
  },
  cms: {
    name: 'CMS',
    logo: `${saf2021HostBasePath}/cms.png`,
    href: 'https://cms.law/en/int/',
  },
  ysiac: {
    name: 'YSIAC',
    logo: `${saf2021HostBasePath}/ysiac.jpg`,
    href: 'https://siac.org.sg/about-ysiac',
  },
  kcabNext: {
    name: 'KCAB NEXT',
    logo: `${saf2021HostBasePath}/kcab-next.png`,
    href: 'http://www.kcabinternational.or.kr/common/index.do?jpath=/contents/sub040601',
  },
  kocia: {
    name: 'KOCIA',
    logo: `${saf2021HostBasePath}/kocia.jpg`,
  },
  kica: {
    name: 'KICA',
    logo: `${saf2021HostBasePath}/kica.jpg`,
    href: 'https://www.kica.bar/index_eng.htm',
  },
  hwawoo: {
    name: 'Yoon & Yang LLC',
    logo: `${saf2021HostBasePath}/hwawoo.jpeg`,
    href: 'https://www.yoonyang.com/eng/main.do',
  },
  siac: {
    name: 'SIAC',
    logo: `${saf2021HostBasePath}/siac.jpg`,
    href: 'https://siac.org.sg/',
  },
  kcab: {
    name: 'KCAB INTERNATIONAL',
    logo: `${saf2021HostBasePath}/kcab-international.png`,
    href: 'http://www.kcabinternational.or.kr/main.do',
  },
  kimChang: {
    name: 'Kim & Chang',
    logo: `${saf2021HostBasePath}/kim-chang.png`,
    href: 'https://www.kimchang.com/en/main.kc',
  },
  allenOvery: {
    name: 'Allen & Overy',
    logo: `${saf2021HostBasePath}/allen-overy.jpg`,
    href: 'https://www.allenovery.com/en-gb/global',
  },
  uncitral: {
    name: 'UNCITRAL',
    logo: `${saf2021HostBasePath}/uncitral.jpg`,
    href: 'https://uncitral.un.org/',
  },
  moj: {
    name: 'Ministry of Justice',
    logo: `${saf2021HostBasePath}/moj.jpg`,
    href: 'https://www.moj.go.kr/moj_eng/index.do',
  },
  hkiac: {
    name: 'HKIAC',
    logo: `${saf2021HostBasePath}/hkiac.jpg`,
    href: 'https://www.hkiac.org/',
  },
  leeKo: {
    name: 'Lee & Ko',
    logo: `${saf2021HostBasePath}/lee-ko.jpg`,
    href: 'https://www.leeko.com/leenko/main.do?lang=EN',
  },
  wongPartnership: {
    name: 'WongPartnership',
    logo: `${saf2021HostBasePath}/wongpartnership.jpg`,
    href: 'https://www.wongpartnership.com/',
  },
  bkl: {
    name: 'BKL',
    logo: `${saf2021HostBasePath}/bkl.png`,
    href: 'https://www.bkl.co.kr/law?lang=en',
  },
  wilmerHale: {
    name: 'WilmerHale',
    logo: `${saf2021HostBasePath}/wilmerhale.jpg`,
    href: 'https://www.wilmerhale.com/en',
  },
  pinsentMasons: {
    name: 'Pinsent Masons',
    logo: `${saf2021HostBasePath}/pinsent-masons.jpg`,
    href: 'https://www.pinsentmasons.com/',
  },
  icc: {
    name: 'ICC',
    logo: `${saf2021HostBasePath}/icc.png`,
    href: 'https://iccwbo.org/',
  },
  seoulIdrc: {
    name: 'Seoul IDRC',
    logo: `${saf2021HostBasePath}/seoul-idrc.png`,
    href: 'http://www.sidrc.org/idrc/en/main/main.do',
  },
  dlaPiper: {
    name: 'DLA Piper',
    logo: `${saf2021HostBasePath}/dla-piper.jpg`,
    href: 'https://www.dlapiper.com/en/us/',
  },
  kaas: {
    name: 'The Korean Association of Arbitration Studies',
    logo: `${saf2021HostBasePath}/kaas.png`,
    href: 'http://www.kaas.re.kr/',
  },
  kaa: {
    name: 'The Korean Arbitrators Association',
    logo: `${saf2021HostBasePath}/kaa.jpg`,
    href: 'http://www.kaarb.or.kr/default/',
  },
  klpa: {
    name: 'Korean Law Professors Association',
    logo: `${saf2021HostBasePath}/klpa.png`,
  },
};

const saf2021Days: SafArchiveDay[] = [
  {
    label: 'Mon',
    date: '1 November',
    events: [
      {
        time: '10:00 - 12:00',
        title: 'SIMC Webinar "The New K-Wave: Evolution in Mediation Practice and Processes"',
        hosts: [saf2021Hosts.simc],
      },
      {
        time: '14:00 - 15:00',
        title: "Yulchon LLC Webinar \"Korean Practitioners' View on Korean Court Intervention in Arbitration - Special Tips for In-House Counsel\"",
        hosts: [saf2021Hosts.yulchon],
      },
      {
        time: '16:00 - 17:00',
        title: '"Turning Adversity to Opportunity - Managing Disputes on Emerging Markets Investments"',
        hosts: [saf2021Hosts.hsf, saf2021Hosts.ihcf],
      },
      {
        time: '17:00 - 18:00',
        title: '"The Role of Factual Witnesses in International Construction Arbitrations - Challenges and Innovation"',
        hosts: [saf2021Hosts.cms],
      },
      {
        time: '17:30 - 18:45',
        title: 'YSIAC - KCAB Next Happy Hour "A Virtual Happy Hour on the Future of Tech in Arbitration"',
        hosts: [saf2021Hosts.ysiac, saf2021Hosts.kcabNext],
      },
    ],
  },
  {
    label: 'Tue',
    date: '2 November',
    events: [
      {
        time: '10:30 - 12:00',
        title: 'KOCIA - KICA Webinar "Trends and Developments in International Arbitration in 2021"',
        hosts: [saf2021Hosts.kocia, saf2021Hosts.kica],
      },
      {
        time: '14:00 - 15:00',
        title: '"How to enhance efficiency in international arbitration - from cradle to recovery"',
        hosts: [saf2021Hosts.hwawoo],
      },
      {
        time: '15:30 - 16:45',
        title: 'SIAC - KCAB INTERNATIONAL Seoul Webinar "Arbitration and the Korean Wave"',
        hosts: [saf2021Hosts.siac, saf2021Hosts.kcab],
      },
      {
        time: '17:00 - 18:30',
        title: 'Kim & Chang - Allen & Overy Webinar "Modernization of Investment Treaty Arbitration: Amendments to the ICSID Arbitration Rules"',
        hosts: [saf2021Hosts.kimChang, saf2021Hosts.allenOvery],
      },
      {
        time: '16:00 - 19:00',
        title: 'UNCITRAL ADR Special Session "UNCITRAL and Regional Developments on Arbitration and Mediation"',
        hosts: [saf2021Hosts.uncitral, saf2021Hosts.moj],
      },
    ],
  },
  {
    label: 'Wed',
    date: '3 November',
    events: [
      {
        time: '10:30 - 11:30',
        title: 'HKIAC Lecture Series "Arbitration, a Collaborative Effort"',
        hosts: [saf2021Hosts.hkiac],
      },
      {
        time: '14:00 - 16:00',
        title: 'KCAB Next Round Table Discussion "KCAB Next: Career Talk"',
        hosts: [saf2021Hosts.kcabNext],
      },
      {
        time: '16:00 - 17:00',
        title: 'Lee & Ko - WongPartnership Webinar "Selected Topics in International Arbitration"',
        hosts: [saf2021Hosts.leeKo, saf2021Hosts.wongPartnership],
      },
      {
        time: '17:00 - 18:00',
        title: 'Women in Arbitration Virtual Event "What is the Future for Women in Arbitration?"',
        hosts: [saf2021Hosts.kimChang, saf2021Hosts.hsf, saf2021Hosts.kcab],
      },
      {
        time: '16:00 - 19:00',
        title: 'UNCITRAL ADR Special Session "UNCITRAL and Regional Developments on Arbitration and Mediation"',
        hosts: [saf2021Hosts.uncitral, saf2021Hosts.moj],
      },
    ],
  },
  {
    label: 'Thu',
    date: '4 November',
    events: [
      {
        time: '09:00 - 10:35',
        title: 'BKL - WilmerHale Webinar "The Future of Energy Disputes: Perspectives and Outlook"',
        hosts: [saf2021Hosts.bkl, saf2021Hosts.wilmerHale],
      },
      {
        time: '14:00 - 16:00',
        title: 'Pinsent Masons Webinar "Techniques for Effective Management of Your Next International Arbitration"',
        hosts: [saf2021Hosts.pinsentMasons],
      },
      {
        time: '16:00 - 19:00',
        title: 'The 10th Asia-Pacific ADR Virtual Conference [Day 1] "Innovating the Future of Dispute Resolution Beyond 2021: The Journey Continues"',
        hosts: [
          saf2021Hosts.uncitral,
          saf2021Hosts.moj,
          saf2021Hosts.kcab,
          saf2021Hosts.icc,
          saf2021Hosts.seoulIdrc,
        ],
      },
    ],
  },
  {
    label: 'Fri',
    date: '5 November',
    events: [
      {
        time: '09:00 - 11:00',
        title: 'DLA Piper Webinar "Korean Companies in the Global Market - Best Practice to Protect Your Foreign Investments"',
        hosts: [saf2021Hosts.dlaPiper],
      },
      {
        time: '13:00 - 16:00',
        title: '2021 Korean Arbitration Associated Organizations Joint Event "Arbitration System as a Solution to International Disputes in COVID Era"',
        hosts: [saf2021Hosts.kaas, saf2021Hosts.kaa, saf2021Hosts.klpa],
      },
      {
        time: '16:00 - 19:00',
        title: 'The 10th Asia-Pacific ADR Virtual Conference [Day 2] "Innovating the Future of Dispute Resolution Beyond 2021: The Journey Continues"',
        hosts: [
          saf2021Hosts.uncitral,
          saf2021Hosts.moj,
          saf2021Hosts.kcab,
          saf2021Hosts.icc,
          saf2021Hosts.seoulIdrc,
        ],
      },
    ],
  },
];

const saf2022SpeakerBasePath = '/archives/2022/speakers';
const saf2022ImageBasePath = '/archives/2022/images';

const saf2022Speakers: Record<string, SafArchiveHost> = {
  benjaminHughes: {
    name: 'Benjamin Hughes',
    subtitle: 'Independent Arbitrator, Fountain Court Chambers',
    logo: `${saf2022SpeakerBasePath}/benjamin-hughes.png`,
  },
  ericNg: {
    name: 'Eric Ng',
    subtitle: 'Deputy Secretary-General, HKIAC',
    logo: `${saf2022SpeakerBasePath}/eric-ng.png`,
  },
  jaeSungLee: {
    name: 'Jae Sung Lee',
    subtitle: 'Senior Legal Officer, UNCITRAL',
    logo: `${saf2022SpeakerBasePath}/jae-sung-lee.png`,
  },
  kevinNash: {
    name: 'Kevin Nash',
    subtitle: 'Registrar, SIAC',
    logo: `${saf2022SpeakerBasePath}/kevin-nash.png`,
  },
  michaelLee: {
    name: 'Michael Lee',
    subtitle: 'Vice President, ICDR',
    logo: `${saf2022SpeakerBasePath}/michael-lee.png`,
  },
  steveKim: {
    name: 'Steve Kim',
    subtitle: 'Secretary-General, KCAB INTERNATIONAL',
    logo: `${saf2022SpeakerBasePath}/steve-kim.png`,
  },
  donnaHuang: {
    name: 'Dr. Zhijin (Donna) Huang',
    subtitle: 'Director, ICC Arbitration and ADR, North Asia',
    logo: `${saf2022SpeakerBasePath}/donna-huang.png`,
  },
  sueHyunLim: {
    name: 'Sue Hyun Lim',
    subtitle: 'Partner, Kim & Chang',
    logo: `${saf2022SpeakerBasePath}/sue-hyun-lim.png`,
  },
  alastairHenderson: {
    name: 'Alastair Henderson',
    subtitle: 'Managing Partner, Herbert Smith Freehills',
    logo: `${saf2022SpeakerBasePath}/alastair-henderson.png`,
  },
  andresJanaLinetzky: {
    name: 'Andres Jana Linetzky',
    subtitle: 'Founding Partner, Jana & Gil Dispute Resolution',
    logo: `${saf2022SpeakerBasePath}/andres-jana-linetzky.png`,
  },
  evaKalnina: {
    name: 'Eva Kalnina',
    subtitle: 'Independent Arbitrator, Arbitration Chambers',
    logo: `${saf2022SpeakerBasePath}/eva-kalnina.png`,
  },
  jeonghyeSophieAhn: {
    name: 'Jeonghye Sophie Ahn',
    subtitle: 'Partner, Yulchon LLC',
    logo: `${saf2022SpeakerBasePath}/jeonghye-sophie-ahn.png`,
  },
  sweeYenKoh: {
    name: 'Swee Yen Koh',
    subtitle: 'Partner, WongPartnership',
    logo: `${saf2022SpeakerBasePath}/swee-yen-koh.png`,
  },
  yoshimiOhara: {
    name: 'Yoshimi Ohara',
    subtitle: 'Partner, Nagashima Ohno & Tsunematsu',
    logo: `${saf2022SpeakerBasePath}/yoshimi-ohara.png`,
  },
};

const saf2022Days: SafArchiveDay[] = [
  {
    label: 'Wed',
    date: '9 November',
    events: [
      {
        time: '16:00 - 16:10',
        title: 'Opening Remarks',
        format: 'Opening',
        venue: 'Virtual Conference',
        summary: 'Minister of Justice, Korea',
        hosts: [],
      },
      {
        time: '16:10 - 17:25',
        title: 'The Importance of Solidarity among Arbitral Institutions on the Road to Pandemic Recovery',
        format: 'Session 1 - 75 minutes',
        venue: 'Virtual Conference',
        summary: 'Moderator: Benjamin Hughes, Independent Arbitrator, Fountain Court Chambers.',
        topics: [
          'What has changed in the global arbitration ecosystem?',
          'How has Covid-19 changed the way we view and handle arbitration?',
          'What are the duties and responsibilities of arbitral institutions going forward?',
        ],
        hostLabel: 'Speakers',
        showHostNames: true,
        hosts: [
          saf2022Speakers.benjaminHughes,
          saf2022Speakers.ericNg,
          saf2022Speakers.jaeSungLee,
          saf2022Speakers.kevinNash,
          saf2022Speakers.michaelLee,
          saf2022Speakers.steveKim,
          saf2022Speakers.donnaHuang,
        ],
      },
      {
        time: '17:25 - 17:40',
        title: 'Break',
        format: '15 minutes',
        hosts: [],
      },
    ],
  },
  {
    label: 'Thu',
    date: '10 November',
    events: [
      {
        time: '17:40 - 19:00',
        title: 'Innovation Updates',
        format: 'Session 2 - 80 minutes',
        venue: 'Virtual Conference',
        summary: 'Moderator: Sue Hyun Lim, Partner, Kim & Chang.',
        topics: [
          'Procedural innovations in arbitration in the last ten years and where they are now.',
          'Expedited arbitration and dispute resolution in the digital economy.',
          'Emergency arbitration.',
          'Condition precedent, escalation clause, and mandatory mediation.',
          'Conditional fee, contingency fee, and expedited procedure.',
          'Arbitrator schedule and disclosure.',
        ],
        hostLabel: 'Speakers',
        showHostNames: true,
        hosts: [
          saf2022Speakers.sueHyunLim,
          saf2022Speakers.alastairHenderson,
          saf2022Speakers.andresJanaLinetzky,
          saf2022Speakers.evaKalnina,
          saf2022Speakers.jeonghyeSophieAhn,
          saf2022Speakers.sweeYenKoh,
          saf2022Speakers.yoshimiOhara,
        ],
      },
    ],
  },
];

const saf2023HostBasePath = '/archives/2023/hosts';

const saf2023Hosts: Record<string, SafArchiveHost> = {
  driverTrett: {
    name: 'Driver Trett',
    logo: `${saf2023HostBasePath}/driver-trett.png`,
    href: 'https://www.driver-group.com/en/asia-pacific/',
  },
  yulchon: {
    name: 'Yulchon LLC',
    logo: `${saf2023HostBasePath}/yulchon.jpg`,
    href: 'https://www.yulchon.com/ko/main/main.do',
  },
  samsungCt: {
    name: 'Samsung C&T',
    logo: `${saf2023HostBasePath}/samsung-ct.png`,
    href: 'https://www.samsungcnt.com/index.do',
  },
  dentonsLee: {
    name: 'Dentons Lee',
    logo: `${saf2023HostBasePath}/dentons-lee.jpg`,
    href: 'https://www.dentonslee.com/',
  },
  kimChang: {
    name: 'Kim & Chang',
    logo: `${saf2023HostBasePath}/kim-chang.png`,
    href: 'https://www.kimchang.com/ko/main.kc',
  },
  aaaIcdr: {
    name: 'AAA-ICDR',
    logo: `${saf2023HostBasePath}/aaa-icdr.png`,
    href: 'https://www.icdr.org/',
  },
  yoonYang: {
    name: 'Yoon & Yang',
    logo: `${saf2023HostBasePath}/yoon-yang.png`,
    href: 'https://www.yoonyang.com/eng/main?lang=en',
  },
  exponent: {
    name: 'Exponent',
    logo: `${saf2023HostBasePath}/exponent.jpg`,
    href: 'https://www.exponent.com/',
  },
  fti: {
    name: 'FTI Consulting',
    logo: `${saf2023HostBasePath}/fti.jpg`,
    href: 'https://www.fticonsulting.com/',
  },
  taswea: {
    name: 'TASWEA',
    logo: `${saf2023HostBasePath}/taswea.jpg`,
    href: 'https://taswea.com/',
  },
  lawHouse: {
    name: 'Law House',
    logo: `${saf2023HostBasePath}/law-house.jpg`,
    href: 'https://lawhouse.ae/',
  },
  secretariat: {
    name: 'Secretariat',
    logo: `${saf2023HostBasePath}/secretariat.jpg`,
    href: 'https://secretariat-intl.com/',
  },
  kocia: {
    name: 'KOCIA',
    logo: `${saf2023HostBasePath}/kocia.jpg`,
    href: 'https://en.kocia.io/',
  },
  kica: {
    name: 'KICA',
    logo: `${saf2023HostBasePath}/kica.jpg`,
    href: 'https://www.kica.bar/',
  },
  kcab: {
    name: 'KCAB INTERNATIONAL',
    logo: `${saf2023HostBasePath}/kcab-international.png`,
    href: 'http://www.kcabinternational.or.kr/main.do',
  },
  siac: {
    name: 'SIAC',
    logo: `${saf2023HostBasePath}/siac.jpg`,
    href: 'https://siac.org.sg/',
  },
  cms: {
    name: 'CMS',
    logo: `${saf2023HostBasePath}/cms.png`,
    href: 'https://cms.law/en/int/',
  },
  ciarb: {
    name: 'CIArb',
    logo: `${saf2023HostBasePath}/ciarb.jpg`,
    href: 'https://www.ciarb.org/',
  },
  scma: {
    name: 'SCMA',
    logo: `${saf2023HostBasePath}/scma.png`,
    href: 'https://www.scma.org.sg/',
  },
  kmla: {
    name: 'Korea Maritime Law Association',
    logo: `${saf2023HostBasePath}/kmla.jpg`,
    href: 'http://www.kormla.or.kr/eng/sub01-01.asp',
  },
  simc: {
    name: 'SIMC',
    logo: `${saf2023HostBasePath}/simc.png`,
    href: 'https://simc.com.sg/',
  },
  hkiac: {
    name: 'HKIAC',
    logo: `${saf2023HostBasePath}/hkiac.png`,
    href: 'https://www.hkiac.org/',
  },
  steptoe: {
    name: 'Steptoe & Johnson',
    logo: `${saf2023HostBasePath}/steptoe.jpg`,
    href: 'https://www.steptoe.com/en/',
  },
  leeKo: {
    name: 'Lee & Ko',
    logo: `${saf2023HostBasePath}/lee-ko.png`,
    href: 'https://www.leeko.com/leenko/main.do?lang=KR',
  },
  ysiac: {
    name: 'YSIAC',
    logo: `${saf2023HostBasePath}/ysiac.jpg`,
    href: 'https://siac.org.sg/ysiac-council-members',
  },
  hsf: {
    name: 'Herbert Smith Freehills',
    logo: `${saf2023HostBasePath}/hsf.jpg`,
    href: 'https://herbertsmithfreehills.com/',
  },
  peterKim: {
    name: 'Peter & Kim',
    logo: `${saf2023HostBasePath}/peter-kim.png`,
    href: 'https://peterandkim.com/',
  },
  moj: {
    name: 'Ministry of Justice, Republic of Korea',
    logo: `${saf2023HostBasePath}/moj.png`,
    href: 'https://www.moj.go.kr/moj/index.do',
  },
  uncitral: {
    name: 'UNCITRAL RCAP',
    logo: `${saf2023HostBasePath}/uncitral.jpg`,
    href: 'https://un-rok.org/about-un/offices/uncitral-rcap/',
  },
  draju: {
    name: 'DR & AJU',
    logo: `${saf2023HostBasePath}/draju.jpg`,
    href: 'https://www.draju.com/en/main/main.html',
  },
  skrine: {
    name: 'Skrine',
    logo: `${saf2023HostBasePath}/skrine.jpg`,
    href: 'https://www.skrine.com/',
  },
  amt: {
    name: 'Anderson Mori & Tomotsune',
    logo: `${saf2023HostBasePath}/amt.jpg`,
    href: 'https://www.amt-law.com/en/',
  },
  icc: {
    name: 'ICC International Court of Arbitration',
    logo: `${saf2023HostBasePath}/icc.png`,
    href: 'https://iccwbo.org/dispute-resolution/dispute-resolution-services/icc-international-court-of-arbitration/',
  },
  thirtyNineEssex: {
    name: '39 Essex Chambers',
    logo: `${saf2023HostBasePath}/39-essex.jpg`,
    href: 'https://www.39essex.com/',
  },
  bkl: {
    name: 'BKL',
    logo: `${saf2023HostBasePath}/bkl.png`,
    href: 'https://www.bkl.co.kr/law?lang=ko',
  },
  kcabNext: {
    name: 'KCAB NEXT',
    logo: `${saf2023HostBasePath}/kcab-next.png`,
    href: 'http://www.kcabinternational.or.kr/common/index.do?jpath=/contents/sub040601',
  },
  covington: {
    name: 'Covington & Burling LLP',
    logo: `${saf2023HostBasePath}/covington.jpg`,
    href: 'https://www.cov.com/',
  },
  sclVietnam: {
    name: 'SCL Vietnam',
    logo: `${saf2023HostBasePath}/scl-vietnam.png`,
    href: 'https://scl.org.vn/',
  },
  sclKorea: {
    name: 'SCL Korea',
    logo: `${saf2023HostBasePath}/scl-korea.png`,
    href: 'http://www.sclkorea.org/',
  },
};

const saf2023Days: SafArchiveDay[] = [
  {
    label: 'Mon',
    date: '30 October',
    events: [
      {
        time: '10:30 - 12:00',
        title: 'Driver Trett - Yulchon Panel Discussion',
        summary: 'Perspectives on Expert Witness Engagement in Construction Dispute',
        hosts: [saf2023Hosts.driverTrett, saf2023Hosts.yulchon, saf2023Hosts.samsungCt],
      },
      {
        time: '10:30 - 12:00',
        title: 'Dentons Lee Panel Discussion',
        summary: 'Pre-Arbitration and Post-Arbitration Considerations of a Dispute: What you need to know and decide when you have been wronged, have financial damages and need to collect.',
        hosts: [saf2023Hosts.dentonsLee],
      },
      {
        time: '13:00 - 15:00',
        title: 'Kim & Chang - Korea Chamber of Commerce and Industry Joint Seminar',
        summary: 'How to Avoid or Manage M&A Disputes (*conducted in Korean)',
        hosts: [saf2023Hosts.kimChang],
      },
      {
        time: '14:00 - 16:00',
        title: 'AAA-ICDR Event',
        summary: 'Strategies to Develop a Career in International Arbitration',
        hosts: [saf2023Hosts.aaaIcdr],
      },
      {
        time: '15:00 - 17:00',
        title: 'Yoon & Yang Seminar',
        summary: 'Emerging Technology and Market in International ADR',
        hosts: [
          saf2023Hosts.yoonYang,
          saf2023Hosts.exponent,
          saf2023Hosts.fti,
          saf2023Hosts.taswea,
          saf2023Hosts.lawHouse,
        ],
      },
      {
        time: '16:00 - 17:30',
        title: 'Secretariat - Panel Discussion',
        summary: 'Managing Expert Evidence and Recovering Costs in Arbitration: Insider Perspectives and Strategies',
        hosts: [saf2023Hosts.secretariat],
      },
      {
        time: '16:30 - 18:00',
        title: 'KOCIA - KICA Joint Webinar',
        summary: 'Resolving New Waves of Disputes in Creative Ways',
        hosts: [saf2023Hosts.kocia, saf2023Hosts.kica],
      },
      {
        time: '19:00 - 21:00',
        title: 'Seoul ADR Festival 2023: The Grand Welcome Reception',
        venue: 'Harmony Ballroom, B1 Intercontinental Seoul COEX',
        hosts: [saf2023Hosts.kcab],
      },
    ],
  },
  {
    label: 'Tue',
    date: '31 October',
    events: [
      {
        time: '09:30 - 13:30',
        title: 'SIAC Seoul Conference 2023',
        summary: 'Prove Your Case: Revisiting Document Production and Witness Testimony for Korean Companies',
        hosts: [saf2023Hosts.siac],
      },
      {
        time: '10:00 - 12:00',
        title: 'CMS Seminar',
        summary: 'Emergency Arbitration - No Longer a Novelty But Is It Effective?',
        hosts: [saf2023Hosts.cms],
      },
      {
        time: '12:00 - 13:30',
        title: 'CIArb (EAB) YMG Korea Chapter Event',
        summary: 'Fireside Chat - Live, laugh and learn in arbitration and beyond',
        hosts: [saf2023Hosts.ciarb],
      },
      {
        time: '12:00 - 14:00',
        title: 'KMLA-SCMA Joint Seminar',
        summary: 'Study on the Cases and Procedures of Maritime Arbitration in South Korea and Singapore',
        hosts: [saf2023Hosts.kmla, saf2023Hosts.scma],
      },
      {
        time: '13:30 - 17:00',
        title: 'SIMC Seoul Seminar 2023',
        summary: 'Practical Insights into Mediating Mega Tech Disputes & Rising Trends in Asia',
        hosts: [saf2023Hosts.simc],
      },
      {
        time: '14:00 - 16:00',
        title: 'HKIAC Event',
        summary: 'Breaking the Boundaries: Arbitration, Construction and Energy',
        hosts: [saf2023Hosts.hkiac],
      },
      {
        time: '15:30 - 17:00',
        title: 'Steptoe & Johnson Seminar',
        summary: 'US and International Dispute Resolution: Cross-Border Technology Protection, Intellectual Property Enforcement and International Arbitration',
        hosts: [saf2023Hosts.steptoe],
      },
      {
        time: '17:00 - 18:00',
        title: 'Lee & Ko Event',
        summary: 'Room for Debate II',
        hosts: [saf2023Hosts.leeKo],
      },
      {
        time: '18:00 - 21:00',
        title: 'YSIAC Networking Session',
        summary: 'Wine and Dine + 7 Questions with SIAC Registrar',
        hosts: [saf2023Hosts.ysiac],
      },
      {
        time: '18:30 - 21:00',
        title: "KCAB Women's Interest Committee Networking Event",
        summary: "Herbert Smith Freehills and Women's Interest Committee Networking Event",
        hosts: [saf2023Hosts.hsf],
      },
      {
        time: '20:00',
        title: 'CMS Cocktail Reception',
        summary: '*Invitation Only*',
        hosts: [saf2023Hosts.cms],
      },
    ],
  },
  {
    label: 'Wed',
    date: '1 November',
    events: [
      {
        time: '09:00 - 18:00',
        title: 'The 12th Asia-Pacific ADR Conference',
        summary: 'New World, No Map',
        venue: 'Grand Ballroom (3F), SONO FELICE Convention',
        topicLabel: 'Sessions',
        topics: [
          'Session 1: Arbitration Institutions - Endemic: New Crossroads Ahead for Arbitral Institutions. Keep Tradition or Start Anew?',
          "Session 2: Arbitration Practice - Keep Up or Perish? Practitioners' Dilemma in the New Digital ADR Age",
          'Session 3: ISDS - ISDS Landscape: Global and Asia',
          'Session 4: New Trends in Industry Sectors - Your Money in Digital Jungle: What Does It Mean to You?',
        ],
        sourceHref: 'https://www.seouladrfestival.com/2023adr-conference',
        sourceLabel: 'Read More',
        hosts: [saf2023Hosts.kcab],
      },
      {
        time: '18:30 - 21:30',
        title: 'Peter & Kim Networking Event',
        summary: 'Peter & Kim Jazz Night',
        hosts: [saf2023Hosts.peterKim],
      },
    ],
  },
  {
    label: 'Thu',
    date: '2 November',
    events: [
      {
        time: '09:30 - 17:45',
        title: 'Ministry of Justice, Republic of Korea & UNCITRAL RCAP',
        summary: 'ADR Special Session on ISDS Reform',
        hosts: [saf2023Hosts.moj, saf2023Hosts.uncitral],
      },
      {
        time: '10:00 - 12:00',
        title: 'DR & AJU-SKRINE-Anderson Mori & Tomotsune Joint Event',
        summary: 'Unchained: Supply Chain Disputes in a Shifting Global Landscape',
        hosts: [saf2023Hosts.draju, saf2023Hosts.skrine, saf2023Hosts.amt],
      },
      {
        time: '11:45 - 14:00',
        title: 'ICC Potluck Event',
        hosts: [saf2023Hosts.icc],
      },
      {
        time: '14:00 - 16:00',
        title: 'Yulchon - 39 Essex Roundtable Discussion',
        summary: 'UK-Singaporean-Korean perspectives on hot topics in International Arbitration',
        hosts: [saf2023Hosts.yulchon, saf2023Hosts.thirtyNineEssex],
      },
      {
        time: '17:00 - 20:00',
        title: 'BKL Art Dinner',
        summary: '*Invitation Only',
        hosts: [saf2023Hosts.bkl],
      },
      {
        time: '19:00 - 21:00',
        title: 'KCAB NEXT',
        summary: 'KCAB NEXT Pub Quiz',
        hosts: [saf2023Hosts.kcabNext],
      },
    ],
  },
  {
    label: 'Fri',
    date: '3 November',
    events: [
      {
        time: '11:00 - 12:00',
        title: 'Covington & Burling LLP Webinar',
        summary: 'The Use of International Arbitration for IP and Technology Disputes',
        hosts: [saf2023Hosts.covington],
      },
      {
        time: '16:00 - 18:00',
        title: 'SCL Korea - SCL Vietnam Joint Event',
        summary: 'ADR & Construction Industry in Vietnam: Views from Vietnam & Korea',
        hosts: [saf2023Hosts.sclKorea, saf2023Hosts.sclVietnam],
      },
    ],
  },
];

const ALL_FILTER = 'ALL';
const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');
const safArchiveDayId = (year: number, label: string) => `saf-${year}-${label.toLowerCase()}`;
const compactArchiveDate = (date: string) => date.replace('October', 'Oct').replace('November', 'Nov');
const archiveNavDateLabel = (year: number, date: string, totalDays: number) => (
  year === 2025 || totalDays !== 6 ? compactArchiveDate(date) : date
);

interface SafArchiveEventDetailContent {
  contactInfo?: string[];
  images?: Array<{ src: string; alt: string }>;
  registerHref?: string;
  sections?: Array<{ title: string; lines: string[] }>;
}

interface SafArchiveEventMatch {
  day: SafArchiveDay;
  detail?: SafArchiveEventDetailContent;
  event: SafArchiveEvent;
  slug: string;
}

const safSourcePrefix = 'https://www.seouladrfestival.com/';

const safEventSlugFromHref = (href: string) => {
  const cleanHref = href.split('?')[0].replace(/\/+$/, '');
  const rawSlug = cleanHref.slice(cleanHref.lastIndexOf('/') + 1);
  try {
    return decodeURIComponent(rawSlug);
  } catch {
    return rawSlug;
  }
};

const isMigratedSaf2024Source = (href?: string) => (
  !!href
  && href.startsWith(safSourcePrefix)
  && !href.endsWith('/2024mon')
  && href.replace(/\/+$/, '') !== safSourcePrefix.replace(/\/+$/, '')
);

const isMigratedSaf2025Source = (href?: string) => (
  !!href
  && href.startsWith(safSourcePrefix)
  && (href.includes('/side/') || href.endsWith('/welcome-reception'))
);

const safInternalEventHref = (year: number, href: string) => (
  `/past-editions/${year}/events/${encodeURIComponent(safEventSlugFromHref(href))}`
);

const resolveArchiveSourceHref = (year: number, href?: string) => {
  if (!href) return '';
  if (year === 2024 && isMigratedSaf2024Source(href)) return safInternalEventHref(2024, href);
  if (year === 2025 && isMigratedSaf2025Source(href)) return safInternalEventHref(2025, href);
  return href;
};

const findSafEventBySlug = (
  slug: string,
  days: SafArchiveDay[],
  details: Record<string, SafArchiveEventDetailContent>,
): SafArchiveEventMatch | null => {
  const decodedSlug = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();

  for (const day of days) {
    const event = day.events.find((item) => (
      item.sourceHref && safEventSlugFromHref(item.sourceHref) === decodedSlug
    ));
    if (event) {
      return {
        day,
        event,
        detail: details[decodedSlug],
        slug: decodedSlug,
      };
    }
  }

  return null;
};

const findSaf2024EventBySlug = (slug: string) => (
  findSafEventBySlug(slug, saf2024Days, saf2024EventDetails)
);

const findSaf2025EventBySlug = (slug: string) => (
  findSafEventBySlug(slug, saf2025Days, saf2025EventDetails)
);

export default function PastEditions() {
  const setCurrentPath = useSetAtom(currentPathAtom);
  const [filter, setFilter] = useState<string>(ALL_FILTER);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/') || href.includes('#')) return;
    e.preventDefault();
    pushPath(href, setCurrentPath);
  };

  const decades = ['ALL', '2020s', '2010s'];
  const filteredEditions = editions.filter((edition) => {
    if (filter === ALL_FILTER) return true;
    if (filter === '2020s') return edition.year >= 2020;
    if (filter === '2010s') return edition.year >= 2010 && edition.year < 2020;
    return true;
  });

  return (
    <>
      <main className="saf-past-main">
        {/* organizer 와 동일한 mp-hero 패턴: 이미지 배경(cover) + breadcrumb + 타이틀 */}
        <section
          className="mp-hero"
          style={{ backgroundImage: `url(${assetSrc(HeroSeoulImage)})` }}
        >
          <div className="mp-hero-content">
            <nav className="mp-breadcrumb" aria-label="Breadcrumb">
              <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span>Archives</span>
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span className="mp-breadcrumb-current">Past Editions</span>
            </nav>
            <h1 className="mp-hero-title">Past Editions</h1>
          </div>
        </section>

        <section className="saf-past-listing">
          <div className="saf-renewal-shell">
            <div className="saf-past-intro">
              <h2 className="mp-heading saf-past-intro-title">A decade of dialogue</h2>
              <p>
                Since 2015, the Seoul ADR Festival has gathered arbitrators, practitioners,
                and global experts every autumn. Browse the editions that shaped the conversation.
              </p>
            </div>
            <div className="saf-past-filter">
              {decades.map((decade) => (
                <button
                  key={decade}
                  type="button"
                  className={`saf-past-filter-btn ${filter === decade ? 'is-active' : ''}`}
                  onClick={() => setFilter(decade)}
                >
                  {decade === 'ALL' ? 'All editions' : decade}
                </button>
              ))}
            </div>

            <ol className="saf-past-grid">
              {filteredEditions.map((edition) => {
                const hasArchive = Boolean(edition.archiveUrl || edition.detailPath);
                const className = [
                  'saf-past-card',
                  edition.badge ? 'is-featured' : '',
                  hasArchive ? 'is-clickable' : '',
                ].filter(Boolean).join(' ');

                const handleClick = () => {
                  if (edition.detailPath) {
                    pushPath(edition.detailPath, setCurrentPath);
                    return;
                  }
                  if (edition.archiveUrl && typeof window !== 'undefined') {
                    window.open(edition.archiveUrl, '_blank', 'noopener,noreferrer');
                  }
                };

                const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
                  if (!hasArchive) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                };

                return (
                  <li
                    key={edition.year}
                    className={className}
                    onClick={hasArchive ? handleClick : undefined}
                    onKeyDown={hasArchive ? handleKeyDown : undefined}
                    role={hasArchive ? 'link' : undefined}
                    tabIndex={hasArchive ? 0 : undefined}
                    aria-label={hasArchive
                      ? edition.detailPath
                        ? `Open SAF ${edition.year} archive`
                        : `Open SAF ${edition.year} archive (opens in new tab)`
                      : undefined}
                  >
                    <div className="saf-past-card-year">
                      <span>{edition.year}</span>
                      {edition.badge && <em>{edition.badge}</em>}
                    </div>
                    <div className="saf-past-card-body">
                      {edition.theme && (
                        <h3 className="saf-past-card-theme">{edition.theme}</h3>
                      )}
                      <p className="saf-past-card-date">{edition.dateRange}</p>
                    </div>
                    <div className="saf-past-card-meta">
                      <span>Seoul | Republic of Korea</span>
                    </div>
                  </li>
                );
              })}
            </ol>

            {filteredEditions.length === 0 && (
              <p className="saf-past-empty">No editions match this filter.</p>
            )}
          </div>
        </section>

        <section className="saf-past-cta">
          <div className="saf-renewal-shell">
            <div>
              <p className="saf-renewal-kicker">SAF 2026</p>
              <h2>The next chapter starts in October.</h2>
            </div>
            <a
              className="saf-renewal-primary-btn"
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
            >
              Visit SAF 2026
              <span aria-hidden="true">&gt;</span>
            </a>
          </div>
        </section>
      </main>

    </>
  );
}

export function PastEdition2020() {
  return (
    <PastEditionDetail
      year={2020}
      theme="The New Arbitration Landscape: 2020 and Beyond"
      dateRange="2 to 7 November"
      visualDateRange="2-7 Nov"
      days={saf2020Days}
    />
  );
}

export function PastEdition2024() {
  return (
    <PastEditionDetail
      year={2024}
      theme="ADR Reborn"
      dateRange="28 October to 1 November"
      visualDateRange="28 Oct-1 Nov"
      intro="Seoul ADR Festival 2024 ran from 28 October to 1 November in Korea Standard Time. This archive brings the original tabbed calendar and its Read More event pages into one local SAF timeline."
      dayMetricLabel="calendar days"
      days={saf2024Days}
    />
  );
}

export function PastEdition2025() {
  return (
    <PastEditionDetail
      year={2025}
      theme="Unveiling Excellence in Arbitration"
      dateRange="26 to 31 October"
      visualDateRange="26-31 Oct"
      intro="Seoul ADR Festival 2025 Calendar provides an overview of scheduled events from 26 to 31 October 2025 in Korea Standard Time. This page converts the original calendar into one continuous archive schedule."
      dayMetricLabel="calendar days"
      days={saf2025Days}
    />
  );
}

export function PastEdition2022() {
  return (
    <PastEditionDetail
      year={2022}
      theme="Resilience for Recovery"
      dateRange="9 to 10 November"
      visualDateRange="9-10 Nov"
      intro="The 11th Asia-Pacific ADR Virtual Conference was held under the theme Resilience, Restoration, Recalibration on 9-10 November 2022 in Korea Standard Time."
      dayMetricLabel="program days"
      visualImage={`${saf2022ImageBasePath}/gyeonghoeru.png`}
      days={saf2022Days}
    />
  );
}

export function PastEdition2023() {
  return (
    <PastEditionDetail
      year={2023}
      theme="New World, No Map"
      dateRange="30 October to 3 November"
      visualDateRange="30 Oct-3 Nov"
      intro="Seoul ADR Festival 2023 ran from 30 October to 3 November in Korea Standard Time. This page combines the five original day-by-day program pages into one continuous archive schedule."
      days={saf2023Days}
    />
  );
}

export function PastEdition2021() {
  return (
    <PastEditionDetail
      year={2021}
      theme="Innovating the Future of Dispute Resolution Beyond 2021"
      dateRange="1 to 5 November"
      visualDateRange="1-5 Nov"
      days={saf2021Days}
    />
  );
}

interface PastEditionDetailProps {
  year: number;
  theme: string;
  dateRange: string;
  visualDateRange: string;
  intro?: string;
  dayMetricLabel?: string;
  visualImage?: string;
  days: SafArchiveDay[];
}

export function PastEdition2024EventDetail({ slug }: { slug: string }) {
  return (
    <PastEditionArchiveEventDetail
      year={2024}
      slug={slug}
      findEvent={findSaf2024EventBySlug}
    />
  );
}

export function PastEdition2025EventDetail({ slug }: { slug: string }) {
  return (
    <PastEditionArchiveEventDetail
      year={2025}
      slug={slug}
      findEvent={findSaf2025EventBySlug}
    />
  );
}

function PastEditionArchiveEventDetail({
  year,
  slug,
  findEvent,
}: {
  year: number;
  slug: string;
  findEvent: (slug: string) => SafArchiveEventMatch | null;
}) {
  const setCurrentPath = useSetAtom(currentPathAtom);
  const matched = findEvent(slug);
  const archiveHref = `/past-editions/${year}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, [slug]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/') || href.includes('#')) return;
    e.preventDefault();
    pushPath(href, setCurrentPath);
  };

  if (!matched) {
    return (
      <>
        <main className="saf-archive-event-detail-main">
          <section className="saf-renewal-shell saf-archive-event-detail-empty">
            <a href={archiveHref} className="saf-archive-back-link" onClick={(e) => handleNavClick(e, archiveHref)}>
              Back to SAF {year}
            </a>
            <h1>Event not found</h1>
            <p>The selected SAF {year} event could not be found.</p>
          </section>
        </main>
      </>
    );
  }

  const { day, event, detail } = matched;
  const detailSections = detail?.sections ?? [];
  const detailImages = detail?.images ?? [];
  const contactInfo = detail?.contactInfo ?? [];
  const registerHref = detail?.registerHref;

  return (
    <>

      <main className="saf-archive-event-detail-main">
        {/* organizer 와 동일한 mp-hero 패턴 (이미지 + breadcrumb + 타이틀) */}
        <section
          className="mp-hero"
          style={{ backgroundImage: `url(${assetSrc(HeroSeoulImage)})` }}
        >
          <div className="mp-hero-content">
            <nav className="mp-breadcrumb" aria-label="Breadcrumb">
              <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <a
                href="/past-editions"
                className="mp-breadcrumb-link"
                onClick={(e) => handleNavClick(e, '/past-editions')}
              >
                Archives
              </a>
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <a
                href={archiveHref}
                className="mp-breadcrumb-link"
                onClick={(e) => handleNavClick(e, archiveHref)}
              >
                SAF {year}
              </a>
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span className="mp-breadcrumb-current">{event.eventType ?? 'Event'}</span>
            </nav>
            <h1 className="mp-hero-title">{event.title}</h1>
            {registerHref && (
              <div className="saf-archive-event-detail-actions">
                <a href={registerHref} target="_blank" rel="noopener noreferrer">
                  Register
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="saf-archive-event-detail-body">
          <div className="saf-renewal-shell saf-archive-event-detail-grid">
            <aside className="saf-archive-event-detail-meta">
              <dl>
                <dt>Date</dt>
                <dd>{day.date}</dd>
                <dt>Day</dt>
                <dd>{day.label}</dd>
                <dt>Time</dt>
                <dd>{event.time}</dd>
                {event.eventType && (
                  <>
                    <dt>Type</dt>
                    <dd>{event.eventType}</dd>
                  </>
                )}
                {event.hostedBy && (
                  <>
                    <dt>Hosted by</dt>
                    <dd>{event.hostedBy}</dd>
                  </>
                )}
                {event.venue && (
                  <>
                    <dt>Venue</dt>
                    <dd>{event.venue}</dd>
                  </>
                )}
                {event.format && (
                  <>
                    <dt>Format</dt>
                    <dd>{event.format}</dd>
                  </>
                )}
              </dl>
              {contactInfo.length > 0 && (
                <div className="saf-archive-event-detail-contact">
                  <span>Contact</span>
                  {contactInfo.map((contact) => (
                    <p key={contact}>{contact}</p>
                  ))}
                </div>
              )}
            </aside>

            <div className="saf-archive-event-detail-sections">
              {detailSections.length > 0 && (
                detailSections.map((section) => (
                  <section key={`${event.title}-${section.title}`} className="saf-archive-event-detail-section">
                    <h2>{section.title}</h2>
                    {section.lines.length > 1 ? (
                      <ul>
                        {section.lines.map((line) => (
                          <li key={`${section.title}-${line}`}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      section.lines.map((line) => (
                        <p key={`${section.title}-${line}`}>{line}</p>
                      ))
                    )}
                  </section>
                ))
              )}
              {detailImages.length > 0 && (
                <section className="saf-archive-event-detail-section">
                  <h2>Original Event Material</h2>
                  <div className="saf-archive-event-detail-images">
                    {detailImages.map((image) => (
                      <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
                    ))}
                  </div>
                </section>
              )}
              {detailSections.length === 0 && detailImages.length === 0 && (
                <section className="saf-archive-event-detail-section">
                  <h2>Details</h2>
                  <p>Detailed programme information is available through the registration page or event organizer.</p>
                </section>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function PastEditionDetail({
  year,
  theme,
  dateRange,
  visualDateRange,
  intro,
  dayMetricLabel = 'festival days',
  visualImage,
  days,
}: PastEditionDetailProps) {
  const setCurrentPath = useSetAtom(currentPathAtom);
  const totalEvents = days.reduce((sum, day) => sum + day.events.length, 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/') || href.includes('#')) return;
    e.preventDefault();
    pushPath(href, setCurrentPath);
  };

  const handleBackToArchives = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    pushPath('/past-editions', setCurrentPath);
  };

  const handleDayJump = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const id = safArchiveDayId(year, label);
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <>

      <main>
        {/* organizer 와 동일한 mp-hero 패턴 (이미지 + breadcrumb + 타이틀) */}
        <section
          className="mp-hero"
          style={{ backgroundImage: `url(${assetSrc(visualImage ?? HeroSeoulImage)})` }}
        >
          <div className="mp-hero-content">
            <nav className="mp-breadcrumb" aria-label="Breadcrumb">
              <HomeIcon className="mp-breadcrumb-home" aria-hidden="true" />
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <a
                href="/past-editions"
                className="mp-breadcrumb-link"
                onClick={handleBackToArchives}
              >
                Archives
              </a>
              <span className="mp-breadcrumb-dot" aria-hidden="true" />
              <span className="mp-breadcrumb-current">SAF {year}</span>
            </nav>
            <h1 className="mp-hero-title">{theme}</h1>
          </div>
        </section>

        <section className="saf-archive-detail-body">
          <div className="saf-renewal-shell">
            <div className="saf-archive-detail-intro">
              <p>
                {intro
                  ?? `Seoul ADR Festival ${year} ran from ${dateRange} in Korea Standard Time. This page combines the original day-by-day archive into one continuous schedule.`}
              </p>
              <div className="saf-archive-detail-stats">
                <div>
                  <strong>{days.length}</strong>
                  <span>{dayMetricLabel}</span>
                </div>
                <div>
                  <strong>{totalEvents}</strong>
                  <span>listed events</span>
                </div>
                <div>
                  <strong>UTC+9</strong>
                  <span>Korea time</span>
                </div>
              </div>
            </div>
            <nav
              className={`saf-archive-day-nav saf-archive-day-nav--${days.length}`}
              aria-label={`SAF ${year} days`}
            >
              {days.map((day) => (
                <a
                  key={day.label}
                  href={`#${safArchiveDayId(year, day.label)}`}
                  onClick={(e) => handleDayJump(e, day.label)}
                >
                  <strong>{day.label}</strong>
                  <span>{archiveNavDateLabel(year, day.date, days.length)}</span>
                </a>
              ))}
            </nav>

            <div className="saf-archive-timeline">
              {days.map((day) => (
                <section
                  key={day.label}
                  id={safArchiveDayId(year, day.label)}
                  className="saf-archive-day-section"
                >
                  <div className="saf-archive-day-heading">
                    <span>{day.label}</span>
                    <div>
                      <h2>{day.date}</h2>
                      <p>{day.events.length} event{day.events.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <ol className="saf-archive-event-list">
                    {day.events.map((event) => (
                      <li key={`${day.label}-${event.time}-${event.title}`} className="saf-archive-event-item">
                        <time>{event.time}</time>
                        <div className="saf-archive-event-card">
                          <div>
                            <h3>{event.title}</h3>
                            {event.summary && (
                              <p className="saf-archive-event-summary">{event.summary}</p>
                            )}
                            {(event.eventType || event.format || event.hostedBy || event.venue) && (
                              <dl>
                                {event.eventType && (
                                  <>
                                    <dt>Type</dt>
                                    <dd>{event.eventType}</dd>
                                  </>
                                )}
                                {event.format && (
                                  <>
                                    <dt>Format</dt>
                                    <dd>{event.format}</dd>
                                  </>
                                )}
                                {event.hostedBy && (
                                  <>
                                    <dt>Hosted by</dt>
                                    <dd>{event.hostedBy}</dd>
                                  </>
                                )}
                                {event.venue && (
                                  <>
                                    <dt>Venue</dt>
                                    <dd>{event.venue}</dd>
                                  </>
                                )}
                              </dl>
                            )}
                            {event.topics && event.topics.length > 0 && (
                              <div className="saf-archive-event-topics-block">
                                <span>{event.topicLabel ?? 'Topics'}</span>
                                <ul className="saf-archive-event-topics">
                                  {event.topics.map((topic) => (
                                    <li key={`${event.title}-${topic}`}>{topic}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {event.sourceHref && (() => {
                              const resolvedSourceHref = resolveArchiveSourceHref(year, event.sourceHref);
                              const isInternalSourceHref = resolvedSourceHref.startsWith('/');

                              return (
                                <a
                                  className="saf-archive-event-source-link"
                                  href={resolvedSourceHref}
                                  onClick={isInternalSourceHref ? (e) => handleNavClick(e, resolvedSourceHref) : undefined}
                                  target={isInternalSourceHref ? undefined : '_blank'}
                                  rel={isInternalSourceHref ? undefined : 'noopener noreferrer'}
                                >
                                  {event.sourceLabel ?? 'Read More'}
                                </a>
                              );
                            })()}
                          </div>
                          {event.hosts.length > 0 && (
                            <div className={`saf-archive-hosts ${event.showHostNames ? 'saf-archive-hosts--people' : ''}`}>
                              <span>{event.hostLabel ?? (event.hosts.length > 1 ? 'Hosts' : 'Host')}</span>
                              <div>
                                {event.hosts.map((host) => (
                                  <figure
                                    key={`${event.title}-${host.name}`}
                                    className={`saf-archive-host-logo ${event.showHostNames ? 'saf-archive-host-logo--captioned' : ''}`}
                                  >
                                    {host.href ? (
                                      <a
                                        href={host.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Open ${host.name} website`}
                                      >
                                        <img
                                          src={host.logo}
                                          alt={event.showHostNames ? host.name : `${host.name} logo`}
                                          loading="lazy"
                                        />
                                      </a>
                                    ) : (
                                      <img
                                        src={host.logo}
                                        alt={event.showHostNames ? host.name : `${host.name} logo`}
                                        loading="lazy"
                                      />
                                    )}
                                    {event.showHostNames && (
                                      <figcaption>
                                        <strong>{host.name}</strong>
                                        {host.subtitle && <span>{host.subtitle}</span>}
                                      </figcaption>
                                    )}
                                  </figure>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

    </>
  );
}

