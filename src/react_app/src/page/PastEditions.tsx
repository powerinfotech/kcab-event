'use client';

/**
 * PastEditions - Past SAF Editions 페이지 (Seoul ADR Festival 아카이브)
 *
 * 홈페이지(/)와 동일한 saf-renewal 톤 + 동일한 헤더/푸터.
 * 헤더/푸터는 HomePage 의 마크업과 1:1 로 동일하게 유지한다.
 */
import React, { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { currentPathAtom, pushPath } from '@atom/currentPathAtom';
import HeroSeoulImage from '../assets/images/saf-renewal/hero-seoul.jpg';

interface PastEdition {
  year: number;
  dateRange: string;
  theme?: string;
  badge?: string;
  /** PDF / 외부 브로셔 URL. 있으면 카드 클릭 시 새 창에서 열린다. */
  archiveUrl?: string;
  /** 내부 아카이브 상세 경로. 있으면 SPA 내부 화면으로 이동한다. */
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
  format?: string;
  venue?: string;
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

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Partners', href: '/#partners' },
  { label: 'Official Events', href: '/events' },
  { label: 'Calendar', href: '/#program' },
  { label: 'Visit Seoul', href: '/#visit' },
  { label: 'Archives', href: '/past-editions' },
  { label: 'Contact', href: '/#contact' },
];

const socialLinks = [
  { label: 'Artstation', href: '#', icon: 'A' },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'YouTube', href: '#', icon: 'YT' },
];

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
  { year: 2025, dateRange: 'Oct 27 - Oct 31, 2025', theme: 'Unveiling Excellence in Arbitration', badge: 'Latest' },
  { year: 2024, dateRange: 'Oct 28 - Nov 1, 2024', theme: 'ADR Reborn' },
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

/* HomePage.tsx 의 SocialIcon / FestivalLogo 와 1:1 동일하게 둔다. */
function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'A') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M12 4 4 20h3l1.5-3h7L17 20h3L12 4Zm-2 10 2-4 2 4h-4Z" fill="currentColor" />
      </svg>
    );
  }
  if (icon === 'in') {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M6.94 7.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88Zm-1.7 1.7h3.4V20h-3.4V9.2Zm6.07 0h3.26v1.5h.04a3.57 3.57 0 0 1 3.21-1.76c3.44 0 4.07 2.26 4.07 5.2V20H18.5v-4.85c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.27-1.87 2.57V20h-3.39V9.2Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.24 5 12 5 12 5s-6.24 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.76 19 12 19 12 19s6.24 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" fill="currentColor" />
    </svg>
  );
}

function FestivalLogo() {
  return (
    <span className="saf-renewal-logo" aria-hidden="true">
      <svg viewBox="0 0 110 60" focusable="false">
        <path d="M5 20 L55 6 L105 20" />
        <path d="M9 22 L101 22" />
        <path d="M14 22 L14 24 L18 24 L18 22 M24 22 L24 24 L28 24 L28 22 M34 22 L34 24 L38 24 L38 22 M44 22 L44 24 L48 24 L48 22 M54 22 L54 24 L58 24 L58 22 M64 22 L64 24 L68 24 L68 22 M74 22 L74 24 L78 24 L78 22 M84 22 L84 24 L88 24 L88 22 M94 22 L94 24 L98 24 L98 22" />
        <path d="M12 26 L98 26 L98 44 L12 44 Z" fill="none" />
        <path d="M22 26 L22 44 M32 26 L32 44 M42 26 L42 44 M52 26 L52 44 M62 26 L62 44 M72 26 L72 44 M82 26 L82 44 M92 26 L92 44" />
        <path d="M12 32 L98 32 M12 38 L98 38" />
        <path d="M8 44 L102 44 L102 48 L8 48 Z" fill="none" />
      </svg>
      <span className="saf-renewal-logo-title">SEOUL ADR FESTIVAL</span>
    </span>
  );
}

const ALL_FILTER = 'ALL';
const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');
const safArchiveDayId = (year: number, label: string) => `saf-${year}-${label.toLowerCase()}`;
const compactArchiveDate = (date: string) => date.replace('October', 'Oct').replace('November', 'Nov');

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
    <div className="saf-renewal-home saf-past-home">
      {/* === 메인(/)과 1:1 동일한 헤더 === */}
      <header className="saf-renewal-header">
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a
            className="saf-renewal-brand"
            href="/"
            aria-label="Seoul ADR Festival home"
            onClick={(e) => handleNavClick(e, '/')}
          >
            <FestivalLogo />
          </a>
          <div className="saf-renewal-header-right">
            <div className="saf-renewal-social">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} aria-label={item.label}>
                  <SocialIcon icon={item.icon} />
                </a>
              ))}
            </div>
            <nav className="saf-renewal-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="saf-past-hero">
          <div className="saf-renewal-shell">
            <p className="saf-renewal-eyebrow">Archives · 2015 — 2025</p>
            <h1>
              A decade of <span>dialogue.</span>
            </h1>
            <p className="saf-past-hero-copy">
              Since 2015, the Seoul ADR Festival has gathered arbitrators, practitioners,
              and global experts every autumn. Browse the eleven editions that shaped the
              conversation.
            </p>
            <div className="saf-past-metrics">
              <div>
                <strong>11</strong>
                <span>editions hosted</span>
              </div>
              <div>
                <strong>2015</strong>
                <span>inaugural year</span>
              </div>
              <div>
                <strong>Seoul</strong>
                <span>permanent host city</span>
              </div>
            </div>
          </div>
        </section>

        <section className="saf-past-listing">
          <div className="saf-renewal-shell">
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
                      <span>Seoul · Republic of Korea</span>
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
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      {/* === 메인(/)과 1:1 동일한 푸터 === */}
      <footer className="saf-renewal-footer">
        <div className="saf-renewal-shell">
          <div className="saf-renewal-footer-brand">
            <FestivalLogo />
            <strong>
              Seoul
              <br />
              ADR
              <br />
              Festival
            </strong>
          </div>
          <p>
            Seoul ADR Festival (SAF) is organized by KCAB International.
            <br />
            Office Trade Tower, 511 Yeongdong-daero, Gangnam-gu, Seoul
            <br />
            Contact: saf@kcab.or.kr
          </p>
          <small>© 2026 KCAB International. All rights reserved.</small>
        </div>
      </footer>
    </div>
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
    <div className="saf-renewal-home saf-past-home saf-archive-detail-home">
      <header className="saf-renewal-header">
        <div className="saf-renewal-shell saf-renewal-header-inner">
          <a
            className="saf-renewal-brand"
            href="/"
            aria-label="Seoul ADR Festival home"
            onClick={(e) => handleNavClick(e, '/')}
          >
            <FestivalLogo />
          </a>
          <div className="saf-renewal-header-right">
            <div className="saf-renewal-social">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} aria-label={item.label}>
                  <SocialIcon icon={item.icon} />
                </a>
              ))}
            </div>
            <nav className="saf-renewal-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="saf-archive-detail-hero">
          <div className="saf-renewal-shell saf-archive-detail-hero-inner">
            <div className="saf-archive-detail-hero-copy">
              <a
                href="/past-editions"
                className="saf-archive-back-link"
                onClick={(e) => handleNavClick(e, '/past-editions')}
              >
                Back to Archives
              </a>
              <p className="saf-renewal-eyebrow">SAF Archive · {year}</p>
              <h1>{theme}</h1>
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
            <div
              className="saf-archive-detail-visual"
              style={{ backgroundImage: `url(${assetSrc(visualImage ?? HeroSeoulImage)})` }}
              aria-hidden="true"
            >
              <div>
                <span>{visualDateRange}</span>
                <strong>SAF {year}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="saf-archive-detail-body">
          <div className="saf-renewal-shell">
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
                  <span>{days.length === 6 ? day.date : compactArchiveDate(day.date)}</span>
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
                            {(event.format || event.venue) && (
                              <dl>
                                {event.format && (
                                  <>
                                    <dt>Format</dt>
                                    <dd>{event.format}</dd>
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
                            {event.sourceHref && (
                              <a
                                className="saf-archive-event-source-link"
                                href={event.sourceHref}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {event.sourceLabel ?? 'Read More'}
                              </a>
                            )}
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

      <footer className="saf-renewal-footer">
        <div className="saf-renewal-shell">
          <div className="saf-renewal-footer-brand">
            <FestivalLogo />
            <strong>
              Seoul
              <br />
              ADR
              <br />
              Festival
            </strong>
          </div>
          <p>
            Seoul ADR Festival (SAF) is organized by KCAB International.
            <br />
            Office Trade Tower, 511 Yeongdong-daero, Gangnam-gu, Seoul
            <br />
            Contact: saf@kcab.or.kr
          </p>
          <small>© 2026 KCAB International. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
