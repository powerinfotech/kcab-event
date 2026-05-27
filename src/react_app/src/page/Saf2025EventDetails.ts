export interface Saf2025EventDetail {
  contactInfo?: string[];
  images?: Array<{ src: string; alt: string }>;
  registerHref?: string;
  sections?: Array<{ title: string; lines: string[] }>;
}

const saf2025DetailAssetPath = '/assets/saf-2025/details';

export const saf2025EventDetails: Record<string, Saf2025EventDetail> = {
  'the-campaign-for-greener-arbitrations’-walk-through-seoul': {
    registerHref: 'https://forms.office.com/r/KAWn7JWccZ',
    images: [
      {
        src: `${saf2025DetailAssetPath}/greener-arbitrations-walk-1.jpeg`,
        alt: 'The Campaign for Greener Arbitrations walk through Seoul event flyer',
      },
    ],
    sections: [
      {
        title: 'Type',
        lines: ['Networking – outdoor walk'],
      },
      {
        title: 'Speakers',
        lines: ['Mino Han and Charlotte Matthews'],
      },
    ],
  },
  'ciarb-ymg-korea': {
    contactInfo: ['sme@leeko.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/ciarb-ymg-korea-1.png`,
        alt: 'Entering the Ring practical guide to your first arbitration event flyer',
      },
    ],
    registerHref: 'https://docs.google.com/forms/d/e/1FAIpQLSfS4W30gu83BBZCBYjRIY7u-E0Dys9w1dTafe4TNnhSBl7gCQ/viewform',
    sections: [
      {
        title: 'Overview',
        lines: ['The Korea Chapter of CIArb’s Young Members Group (YMG) is pleased to welcome aspiring practitioners to an exclusive mentorship session designed specifically for young practitioners in international arbitration. Building on its mission to connect and empower the next generation of arbitration practitioners, this year’s session offers a unique opportunity to engage directly with seasoned industry leaders in an intimate small-group setting, where participants will receive practical, real-world guidance on how to successfully navigate their first arbitration.'],
      },
      {
        title: 'Programme',
        lines: ['9:30 – 9:40 Opening Remarks & Introduction', '9:40 – 10:10 Small group mentoring rotations', '10:10 – 10:40 Plenary discussion', '10:40 – 11:00 Open Q&A', '11:00 – 11:30 Closing & Networking'],
      },
      {
        title: 'Speakers',
        lines: ['Edward Alder (Prince’s Chambers)', 'Arie Eernisse (Peter & Kim)', 'Hyo Jeong (HJ) Kwon (Clifford Chance)', 'Hangil Lee (Bae, Kim & Lee)', 'David MacArthur (Yulchon)', 'Reshma Oogorah (Niyom Chambers)', 'Sae Youn Kim (Kim & Chang)', 'Jae Hee Kim (Shin & Kim)'],
      },
    ],
  },
  'bkl-yh': {
    contactInfo: ['bkkang@bkl.co.kr', '*Light finger food catering will be provided'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/bkl-yh-1.png`,
        alt: 'Delays on Different Types of Projects event flyer',
      },
    ],
    registerHref: 'https://docs.google.com/forms/d/e/1FAIpQLSd0tR4IXGYzFUlVw7ZtylCfqGoy0OF7fIlGOfImq-wnf9K4Kw/viewform',
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
  'hkiac-evershedssutherland': {
    contactInfo: ['kip@hkiac.org'],
    registerHref: 'https://hkiac.glueup.com/event/crypto-tech-frontiers-deals-disputes-perspectives-from-asia-156023/',
    sections: [
      {
        title: 'Overview',
        lines: ['Join leading legal professionals for a focused exploration of the intersection between digital finance and international arbitration, with a particular emphasis on South Korea and Hong Kong— who are emerging as strategic cryptocurrency and technology hubs in Asia. This session will feature:', 'Comparative analysis of legal frameworks and market developments in South Korea, Hong Kong and the wider region', 'Exploration of the challenges of regulation, data privacy, IP protection and fintech partnerships', 'Practical insights into handling digital asset-related disputes', 'HKIAC’s experience with cryptocurrency and finance disputes'],
      },
      {
        title: 'Speakers',
        lines: ['Wesley Pang, Partner, Eversheds Sutherland (Moderator)', 'Joanne Lau, Secretary-General, HKIAC', 'Andrew Fei, Partner, King & Wood Mallesons', 'Kim Rooney, Barrister & Arbitrator, Rede Chambers', 'Young Suk Park, Partner, Shin & Kim LLC', 'Terry Kim, Chief Operating Officer, BDACS'],
      },
    ],
  },
  shiac: {
    images: [
      {
        src: `${saf2025DetailAssetPath}/shiac-1.png`,
        alt: 'Data-enabled alternative dispute resolution in China and Korea event flyer',
      },
    ],
    registerHref: 'https://shiac2023.mikecrm.com/shT6oEI',
    sections: [
      {
        title: 'Overview',
        lines: ['The event will explore the growing role of data-enabled technologies in alternative dispute resolution, with a particular focus on developments and practices in China and Korea. Experts from both jurisdictions will share insights on how digital tools are enhancing the efficiency, transparency, and accessibility of ADR mechanisms, especially arbitration. The event aims to foster dialogue and exchange ideas on future trends and cross-border collaboration in data-enabled dispute resolution.'],
      },
    ],
  },
  litig: {
    contactInfo: ['taehun.lee@litigep.com'],
    sections: [
      {
        title: 'Speakers',
        lines: ['Representatives from KPBMA, LITIG, Kim & Chang, Yulchon, Omni Bridgeway, and leading Pharma-Bio companies', 'By invitation only for Pharma-Bio companies'],
      },
    ],
  },
  'kimchang-joint': {
    contactInfo: ['arbitration_news@kimchang.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/kimchang-joint-1.jpg`,
        alt: 'Recent developments in US regulatory environment and multi-jurisdictional disputes event flyer',
      },
    ],
    registerHref: 'https://www.kimchang.com/en/rsvp/registration.kc?idx=793&user_yn=accept',
    sections: [
      {
        title: 'Hosts',
        lines: ['* Registration opens at 14:30'],
      },
      {
        title: 'Overview',
        lines: ['The new executive orders and directives introduced by the Trump Administration continue to have far-reaching implications for companies doing business in the U.S. The first session will cover some key developments in U.S. export control, tariff, sanction and immigration enforcement with a focus on how such developments may interact with force majeure, change of law and material adverse consequence (MAC) clauses in existing contractual relationships governed by US laws. In the second session, we will explore challenges involving parallel proceedings in multiple jurisdictions, drawing upon recent first-hand experiences from the U.S., Hong Kong, Singapore, and Korea.', '• Session 1: Jurisdictional Clashes and Managing Parallel Proceedings—War Stories', '• Session 2: US Regulatory Developments in export control, tariffs, sanctions and immigration enforcement – Implications for Korean Companies in Performing Contractual Obligations'],
      },
      {
        title: 'Speakers',
        lines: ['Moderator: Sungjean Seo (Kim & Chang)', 'Speakers: Wade Coriell (King & Spalding), Nils Eliasson (King & Spalding)', 'Commentators: Wonyol Jon (Seoul National University), Byung-Chol (B.C.) Yoon (Kim & Chang), Chul-Won Lee (Kim & Chang), Harold Noh (Kim & Chang)'],
      },
    ],
  },
  jmoj: {
    contactInfo: ['m.kawano.7x8@i.moj.go.jp'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/jmoj-1.jpg`,
        alt: 'How international arbitration and mediation works in Korea and Japan event flyer',
      },
    ],
    registerHref: 'https://forms.office.com/r/ZQMmEGb0Yy',
    sections: [
      {
        title: 'Objectives',
        lines: ['Highlight what procedural features are attractive for business users regarding international commercial arbitration and mediation.', 'Explore strong points of international arbitration and mediation with national legal traditions in Korea and Japan.', 'Explore procedural aspects which are influenced by civil law practices in Korea and Japan.', 'Explore how Korea and Japan can strengthen cooperation to facilitate dispute resolution for international trade.'],
      },
      {
        title: 'Tentative Program',
        lines: ['15:30 - 15:35 Opening Remarks', '15:35 - 15:45 Efforts to promote international arbitration and mediation in Japan', 'Ministry of Justice of Japan', '15:45 - 15:55 Efforts to promote international arbitration and mediation in Korea', 'Ministry of Justice of Korea', '15:55 - 16:55 Panel Discussion -How International Arbitration and Mediation Works in Korea and Japan?-'],
      },
      {
        title: 'Speakers',
        lines: ['Moderator: Ms. NAKAHARA Chié, Partner at Nishimura & Asahi', 'Speakers: Mr. Tony Andriotis, Partner at DLA Piper Tokyo Partnership', 'Mr. Juneyoung Choi, Deputy Counsel of KCAB International', 'Mr. Jae Min Jeon, Partner at SHIN & KIM LLC, KCAB Arbitrator'],
      },
      {
        title: 'Others',
        lines: ['Around 50 people', 'In-Person'],
      },
    ],
  },
  'yulchon-steptoe': {
    contactInfo: ['s_jmyoo@yulchon.com'],
    registerHref: 'https://www.yulchon.com/en/seminars/seminars-view/666/page.do',
    sections: [
      {
        title: 'Type',
        lines: ['Seminar'],
      },
      {
        title: 'Overview',
        lines: ['“ISDS Today: Seoul Conversations” brings together leading practitioners from Korea and the United States to explore the evolving landscape of investor–state dispute settlement (ISDS). With global investment flows under pressure and arbitration facing calls for reform, this seminar will provide Korean companies as well as arbitration practitioners with practical insights into recent arbitral trends, enforcement challenges, and risk management strategies. Through interactive discussion, participants will gain a clearer understanding of how ISDS developments affect cross-border business and how to approach disputes in an uncertain global environment.'],
      },
      {
        title: 'Speakers',
        lines: ['Jae Hyong Woo (Yulchon), So Young Park (Yulchon), Zachary Song (Steptoe)'],
      },
    ],
  },
  'leeandko-seminar': {
    contactInfo: ['yjcha@leeko.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/leeandko-seminar-1.png`,
        alt: 'The First 100 Days After A Dispute Arises event flyer',
      },
    ],
    registerHref: 'https://www.leeko.com/leenko/seminar/seminarView.do?lang=EN&seminarIdx=172',
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
  'bkl-debevoise-hkiac': {
    contactInfo: ['YSPARK@bkl.co.kr', 'HANJH@bkl.co.kr'],
    registerHref: 'https://docs.google.com/forms/d/e/1FAIpQLSeiYfT6YJvrmb9DJJArdtgbzh1Qv1dn3cV9tqC9rqXhJXUE6A/viewform',
    sections: [
      {
        title: 'Overview',
        lines: ['Session I: Mainland China and Hong Kong', 'Session II: Korea, U.S., and Other Jurisdictions'],
      },
      {
        title: 'Speakers',
        lines: ['Joanne Lau (HKIAC, Secretary General)', 'Chee Chong Lau (Omni Bridgeway, Senior Legal Counsel)', 'Tony Dymond (Debevoise & Plimpton LLP, Partner)', 'Sarah Lee (Debevoise & Plimpton LLP, Registered Foreign Lawyer (New York))', 'Hongjoong Kim (Bae, Kim & Lee LLC, Partner)', 'Woojae Kim (Bae, Kim & Lee LLC, Partner)'],
      },
      {
        title: 'Moderator',
        lines: ['Chris Mainwaring-Taylor (Bae, Kim & Lee LLC, Senior Foreign Attorney)'],
      },
    ],
  },
  'welcome-reception': {
    images: [
      {
        src: `${saf2025DetailAssetPath}/welcome-reception-1.jpg`,
        alt: 'SAF 2025 Welcome Reception highlight photo',
      },
      {
        src: `${saf2025DetailAssetPath}/welcome-reception-2.jpg`,
        alt: 'SAF 2025 Welcome Reception venue highlight photo',
      },
    ],
    sections: [
      {
        title: 'Overview',
        lines: ['The Welcome Reception is the signature opening event of the Seoul ADR Festival 2025. This special evening brings together ADR experts, practitioners, institutional representatives, academics, and service users from across the globe to celebrate the commencement of SAF 2025 in the vibrant heart of Seoul.'],
      },
      {
        title: 'What Makes It Special',
        lines: ['SAF 2025’s Welcome Reception offers a unique opportunity to gather with the Festival’s largest group of participants at the official opening event. It is the first chance of the week to reconnect with familiar faces, meet new colleagues, and expand professional networks in a relaxed and lively atmosphere.'],
      },
      {
        title: 'The Iconic Venue',
        lines: ['Hosted at the stylish Mondrian Seoul Itaewon, the Reception is set in the heart of Seoul’s most iconic and international district. Itaewon provides an ideal backdrop for an elegant yet dynamic evening where contemporary design meets global connections to celebrate the start of SAF 2025.'],
      },
      {
        title: 'Registration Fee',
        lines: ['Registration Fee: KRW 20,000 (incl. 10% VAT, total KRW 22,000)', 'Registration fee includes a buffet, complimentary wine and champagne.', 'Registration Closed'],
      },
      {
        title: 'How to Register',
        lines: ['Official Sponsors: a special complimentary code has been distributed to all official sponsors of SAF 2025. Sponsors must still complete the registration process.', 'Co-hosts, moderators, panelists, and invited guests: an exclusive complimentary code is available. Please contact the SAF Secretariat for details and registration assistance.', 'Anyone who wishes to attend: register through the original Register Now flow when registration is open.'],
      },
      {
        title: 'Event Details',
        lines: ['Date & Time: Monday, 27 October 2025, 19:00-21:00 (KST)', '18:30 Registration and networking over welcome drinks', '19:30 Opening and welcome remarks', '21:00 Event concludes', 'Location: Botanical Garden Hall (B2F), Mondrian Seoul Itaewon, 23 Jangmun-ro, Yongsan-gu, Seoul'],
      },
      {
        title: 'Contact',
        lines: ['Should you have any inquiries, please contact us at saf@kcab.or.kr.'],
      },
    ],
  },
  vanguard: {
    contactInfo: ['dlee@vanguard-disputes.com'],
    registerHref: 'https://forms.office.com/Pages/ResponsePage.aspx?id=SG0w3qByj0-kWSFa2pYc3qY6tCV6-JlGjW1R7vGR55lUM1NSTDRSOVZJU01IQ0E4OUNWQVQySElKSi4u',
    sections: [
      {
        title: 'Overview',
        lines: ['As States grapple with regulatory challenges in strategic sectors, the balance between the legitimate exercise of a State’s sovereign right to regulate and foreign investors’ right to investment protection is at the heart of many investment treaty arbitrations.', 'Vanguard has invited four preeminent experts to analyze Korea’s ISDS experience in the context of the broader global developments in ISDS and the rapidly changing geopolitical landscape.', 'The topic will be introduced by a thought-provoking keynote address delivered by James Castello, setting the stage for a critical panel discussion, featuring leading experts from private practice and government.', 'Through the lens of the high-profile disputes that Korea has been involved in, the panel will discern doctrinal trends and address strategic considerations, offering valuable insights for both host States and investors that have to navigate the increasingly complex legal and regulatory environment in which foreign investments are made today.'],
      },
      {
        title: 'Speakers',
        lines: ['Sophia Von Dewall / Founding Partner, Vanguard International Dispute Resolution', 'James Castello / Independent Arbitrator, Arbitration Chambers', 'Sanghoon Han / Partner, Lee & Ko', 'Nadia Darwazeh / Managing Partner & Head of Arbitration, Clyde & Co', 'Junyeul (Alex) Yang / Public Prosecutor, International Dispute Settlement Division, Ministry of Justice (Republic of Korea)'],
      },
    ],
  },
  'peterkim-dis': {
    contactInfo: ['bkpark@peterandkim.com', 'jhshim@peterandkim.com', 'jwchoi@peterandkim.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/peterkim-dis-1.jpg`,
        alt: 'DIS@SAF Wind Farm Disputes event flyer page 1',
      },
      {
        src: `${saf2025DetailAssetPath}/peterkim-dis-2.jpg`,
        alt: 'DIS@SAF Wind Farm Disputes event flyer page 2',
      },
    ],
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the images below.'],
      },
    ],
  },
  'hfw-yulchon': {
    contactInfo: ['chris.cho@hfw.com', 'helen.lee@hfw.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/hfw-yulchon-1.png`,
        alt: 'NEOM, Reform, and Disputes in the Desert event flyer',
      },
    ],
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
  'yoon-yang-joint': {
    contactInfo: ['jhyun@yoonyang.com', 'chyoon@yoonyang.com'],
    registerHref: 'https://forms.gle/QtfAqazcHfbGtmEs6',
    sections: [
      {
        title: 'Overview',
        lines: ['In an era where international disputes - particularly cross-border and construction-related conflicts - have become increasingly complex and time-consuming, efficiency in resolution is more vital than ever. This seminar brings together experienced practitioners who have developed proven strategies and practical approaches that streamline resolution processes without sacrificing effectiveness. Drawing from real-world track records in expert determination, mediation, interim reliefs et al., the session will highlight key practices that have delivered tangible results in expediting dispute resolution. Participants will gain actionable insights into practical tips grounded in tested experience, common pitfalls to avoid in managing proceedings, and strategies for saving time while enabling parties to move forward constructively.'],
      },
      {
        title: 'Speakers',
        lines: ['Kyu Chul Jung / Yoon & Yang', 'Reza Mohtashami KC / Three Crowns', 'Karim Ghaly KC / Atkin Chambers', 'Se Won Park (Moderator) / Hourani & Partners'],
      },
    ],
  },
  secretariat: {
    contactInfo: ['nchild@secretariat-intl.com', 'njenks@secretariat-intl.com', 'mKidane@secretariat-intl.com'],
    registerHref: 'https://forms.office.com/pages/responsepage.aspx?id=LXfRww6qnku7Wkr6mceid9a6wgbxzHlEg-V5t_rsWAxUREZOTzFDMzNKWENVQktIVE9JSFdJVTAyQy4u&route=shorturl',
    sections: [
      {
        title: 'Overview',
        lines: ['Secretariat are pleased to invite you to a panel discussion exploring how the convergence of different generations can affect the conduct and outcome of arbitrations.', 'Leading arbitrators, lawyers, and experts with a wide range of experience will come together for a frank but good-natured discussion of the important insights they have gained over the course of working alongside, against, and before others from different generations. This is an interactive session, and you will also have the opportunity to share your own views after the event.'],
      },
      {
        title: 'Speakers',
        lines: ['Moderator – Dr. Shane Kennett, Secretariat, Denver - As a licensed Professional Engineer and an internationally recommended expert in arbitrations, Shane investigates complex, multidisciplinary engineering problems on large construction projects and at industrial facilities, specializing in root-cause analyses of metal components.​ ​Many of his investigations are focused on weldments in pressurized systems (pipes, vessels, pipelines) and structural steel systems. He has extensively investigated the performance of the steel weldments under in-service conditions. Shane is a mechanical engineer, metallurgical engineer, and Certified Welding Inspector; using these skills, he often applies an inspection-based background to his investigations.', 'Senior Expert - Ben Burley, Secretariat, Hong Kong - An experienced Expert, Ben specialises in delay, disruptions, and acceleration analysis for construction, engineering, and infrastructure projects and programs of work in high-value complex arbitrations, with a particular focus on APAC and EMEA. Ben’s clients benefit from his extensive delay, planning, programming, and project controls experience spanning multiple sectors, including energy, infrastructure, building, offshore, and industrial. He has been appointed expert witness on time, delay, concurrent delay, and disruption issues and has provided expert reports and oral evidence in support of his opinion to various dispute resolution forums: litigation, arbitration, adjudication, and mediation.', 'Junior Expert - Dr. Jay Sohn, Secretariat, Atlanta - Sangjoon “Jay” Sohn, PhD, PE is an expert in applied mechanics and stress analysis with a focus on the use of finite element method and other engineering analysis methodologies in investigating the cause of failure. His work focuses on understanding how engineering stress affects the structure resulting in fracture, fatigue, and many other modes of failure. With a multidisciplinary academic and industrial background, Jay also commands a strong understanding and hands-on experience in the use of metallurgy in determining the root cause of a failure of mechanical components and engineering structures.', 'Arbitrator – Peter Turner KC, 39 Essex Chambers, London - Peter has over 30 years\' experience as an advocate, primarily in arbitrations but also in court and also sits as an arbitrator. Peter\'s practice comprises investment-treaty arbitration (under the ICSID and UNCITRAL Rules and ad hoc, including administered by the Permanent Court of Arbitration), other matters involving issues of public international law, and complex and high-value commercial disputes, including post-M&A disputes and construction and engineering cases. His industry experience covers a wide range, from energy (including nuclear and renewable energy) to financial services and banking, from ground-handling at airports to manufacturing. Peter takes matters under any governing law and conducts cases in English and French.', 'Junior Lawyer – Sarthak Malhotra, Bae Kim & Lee, Seoul - Sarthak is a foreign attorney and his main practice areas include international arbitration and litigation. In addition to his broad disputes practice, Sarthak is also a member of the firm\'s India practice. Sarthak has significant experience representing clients in international commercial and investment arbitration proceedings across various industry sectors. His areas of focus include construction, oil and gas, energy, digital assets, post-M&A disputes, and public international law issues. Prior to joining Bae, Kim & Lee, Sarthak was an assistant legal counsel at the Permanent Court of Arbitration (PCA) in The Hague.', 'Senior lawyer – Kevin Kim, Founding Partner, Peter & Kim, Seoul - Kap–You (Kevin) Kim is a senior partner at Peter & Kim in Seoul. He was previously a senior partner at Bae, Kim & Lee LLC, where he worked for the past three decades in various roles, including as the co–founder and head of the International Arbitration Practice and the head of the Domestic and International Disputes Group.  Over the past 30 years, Kevin has acted as counsel, presiding arbitrator, co–arbitrator or sole arbitrator in more than 350 cases of international arbitrations under various arbitration rules. Presently, he is involved in several investment and commercial arbitrations.  Among other positions that he holds, Kevin is an Advisory Board Member of the International Council for Commercial Arbitration (ICCA) and the Chairman of the Korean Commercial Arbitration Board’s (KCAB) International Arbitration Committee.'],
      },
    ],
  },
  'analysisgroup-freshfields': {
    contactInfo: ['Hyun.Lee@analysisgroup.com', 'Jennifer.Thornton@analysisgroup.com'],
    registerHref: 'https://pages.analysisgroup.com/side-event-seoul-adr-registration',
    sections: [
      {
        title: 'Overview',
        lines: ['Shareholder disputes continue to arise and have a long history of covering key valuation topics across a variety of venues. The rapid growth of cryptocurrencies and AI has introduced novel valuation and liquidity questions that resonate with traditional shareholder disputes. This panel will explore cutting-edge legal and valuation debates at the intersection of these areas, bringing together legal and economic perspectives to examine how tribunals and courts have approached such challenges, and what lessons can be drawn for future cross-border arbitration and Korea’s dynamic financial markets. The panelists will highlight examples from the US, other countries, and the latest academic research from leading economists. Lunch will be provided for registered attendees.', 'The panel discussion will address:', 'Recent trends in shareholder disputes across a variety of venues and industries', 'The interplay between valuation date as a legal construct and as an economic measurement, including the age-old question of ex-ante versus ex-post, and unique considerations for highly volatile and risky assets when assessing damages', 'How liquidity discounts can differ in cryptocurrency disputes compared to traditional shareholder cases, including insights from the recent FTX bankruptcy', 'Korea-specific perspectives, including parallels between the “kimchi premium” in cryptocurrency trading and the longstanding “Korea discount” in equity markets, highlighting how legal standards and economic rationales align to inform these disputes', 'The challenges of valuing AI-driven and other early-stage technology firms, and whether approaches such as risk-adjusted net present value (rNPV) can provide a more reliable framework than traditional discounted cash flow (DCF) methods'],
      },
      {
        title: 'Moderator',
        lines: ['Rohit Bhat – Freshfields LLP'],
      },
      {
        title: 'Welcome Remarks',
        lines: ['Nick Lingard – Freshfields LLP'],
      },
      {
        title: 'Speakers',
        lines: ['Mark Berberian – Analysis Group', 'Sup-Joon Byun – Kim & Chang', 'Saemee Kim – Lee & Ko', 'John Choong – Freshfields LLP', 'Hyun Lee – Analysis Group', 'Seokchun Yun – 42Dot'],
      },
    ],
  },
  'jipyong-simc': {
    contactInfo: ['pr_team@jipyong.com'],
    registerHref: 'https://www.jipyong.com/origin/event/251028/index.html',
    sections: [
      {
        title: 'Overview',
        lines: ['Small and medium enterprises face unique challenges in dealing with legal issues arising from foreign investments, cross-border transactions, and trade. The Workshop is designed to offer strategic insight and a hands-on opportunity to experience international mediation tailored to SMEs. The Workshop will cover negotiation techniques, dispute prevention methods, and efficient dispute management.'],
      },
      {
        title: 'Speakers',
        lines: ['Jinhee Kim / Jipyong LLC', 'George Lim / SIMC', 'Wee Meng Chuan / SIMC'],
      },
    ],
  },
  'kmoj-uncitral-kcab': {
    contactInfo: ['sion.gil@un.org'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/kmoj-uncitral-kcab-1.png`,
        alt: '2025 KMOJ UNCITRAL ADR special session event flyer',
      },
    ],
    registerHref: 'https://docs.google.com/forms/d/e/1FAIpQLSec03YI87e3fGJfTLeU0_wuYU5TgpChuvJFep4_kAPPQ8SYSQ/viewform',
    sections: [
      {
        title: 'Overview',
        lines: ['Co-hosted with KMOJ, Asian Development Bank (ADB), Asian Development Bank Institute (ADBI) and KCAB INTERNATIONAL, the 2025 ADR Special Session will be themed “Implementation of UNCITRAL Dispute Settlement Instruments in Civil Law Jurisdictions.” Discussions will highlight the enactments and considerations of UNCITRAL instruments, focusing on civil law jurisdictions, explore comparative perspectives and the uniform interpretation of UNCITRAL texts via the Case Law on UNCITRAL Texts (CLOUT), and examine the Investor-State Dispute Settlement (ISDS) reform developments and the evolving landscape of dispute resolution in the digital economy. Deputy Minister of Justice Hong-Sik (Justin) Chung and UNCITRAL Secretary Anna Joubin-Bret will deliver opening remarks.', 'In-person participation is by invitation only.', 'For online registration, please use the link below'],
      },
    ],
  },
  siac: {
    contactInfo: ['jayshin@siac.org.sg'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/siac-1.png`,
        alt: 'All About SIAC Arbitration event flyer',
      },
    ],
    registerHref: 'https://siac.org.sg/event/siac-seoul-conference-2025',
    sections: [
      {
        title: 'Overview',
        lines: ['Korea is driving momentum in international arbitration. As one of SIAC’s most active foreign users, Korea continues to play a role in shaping global dispute resolution trends. This year’s SIAC Seoul Conference brings together thought leaders and practitioners to explore what is happening now and what lies ahead, from the impact of the new SIAC Rules to emerging sectors and regional developments.'],
      },
      {
        title: 'Programme',
        lines: ['1:30pm – 2:00pm'],
      },
      {
        title: 'Registration',
        lines: ['2:00pm – 2:10pm', 'Welcome Remarks by Ms Gloria Lim, CEO, SIAC', '2:10pm – 3:00pm', 'A Conversation with the Thought Leaders: War Stories and Reflections on the SIAC Rules, Past and Present', '3:00pm – 4:00pm', 'Panel Session I: Strengthening Trade Ties between Korea and South East Asia', '4:00pm – 4:10pm', 'Refreshment Break', '4:10pm – 5:00pm', 'Panel Discussion II: Emerging Sectors in Dispute Resolution in Korea', '5:00pm – 6:00pm', 'Networking Session (with canapes and drinks served)'],
      },
    ],
  },
  'shin&kim': {
    contactInfo: ['bbang@shinkim.com', 'mjseo@shinkim.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/shin-kim-1.png`,
        alt: 'What You Need to Know Before Arbitrating in Mainland China event flyer',
      },
    ],
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
  'hsf-kramer-bkl': {
    contactInfo: ['Simone.Soong@hsf.com', 'Minju.Kim@hsf.com'],
    registerHref: 'https://docs.google.com/forms/d/e/1FAIpQLSfmfXBmJkKVLoFnv-bS-VqRSripxke2peYOnAFDEZ-NFK8k4w/viewform',
    sections: [
      {
        title: 'Overview',
        lines: ['Private capital transactions can be complex, high-value, and intensely negotiated. Yet when deals unravel – whether before closing, after closing, or at the exit stage – the dispute resolution forum becomes critical.', 'This session will explore the distinctive features of arbitration and litigation in resolving private capital disputes, highlighting their respective strengths and limitations. We will examine how considerations of confidentiality, enforceability across borders, and the practical realities of each process shape outcomes and strategy for investors and counterparties alike.', 'Join leading practitioners for a candid discussion on navigating broken deals in private capital and choosing the right path when conflicts arise.'],
      },
      {
        title: 'Speakers',
        lines: ['Woojae Kim (Partner, Bae, Kim & Lee LLC)', 'Yoon Jeong Park (Senior Foreign Attorney, Bae, Kim & Lee LLC)', 'Hangil Lee (Partner, Bae, Kim & Lee LLC)', 'Mike McClure KC (Co-head of the Korea Group, Partner, Herbert Smith Freehills Kramer)', 'Weina Ye (Partner, Herbert Smith Freehills Kewei)', 'Lillian Li (Senior Associate, Herbert Smith Freehills Kramer).'],
      },
      {
        title: 'Moderators',
        lines: ['Dana Kim (Co-head of the Korea Group, Partner, Herbert Smith Freehills Kramer)', 'Hee Yoon Park (Associate, Bae, Kim & Lee LLC)'],
      },
    ],
  },
  'peterandkim-swissarbitration': {
    contactInfo: ['bkpark@peterandkim.com', 'jhshim@peterandkim.com', 'jwchoi@peterandkim.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/peterandkim-swissarbitration-1.png`,
        alt: 'Swiss Contract Law event flyer',
      },
    ],
    registerHref: 'https://forms.gle/VvUuJgZy1jcR27p3A',
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
  mcia: {
    contactInfo: ['neeti@mcia.org.in'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/mcia-1.png`,
        alt: 'MCIA investment protections event flyer',
      },
    ],
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
  ysiac: {
    contactInfo: ['jayshin@siac.org.sg'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/ysiac-1.png`,
        alt: 'YSIAC new SIAC rules and mock EA workshop event flyer',
      },
    ],
    registerHref: 'https://siac.org.sg/event/siac-ysiac-seoul-workshop-from-strategy-to-simulation-using-the-new-siac-rules-and-mock-ea-with-a-ppo-application',
    sections: [
      {
        title: 'Overview',
        lines: ['The first session (in Korean) will highlight the enhanced efficiency and effectiveness of the new Rules, and how strategic use of the Rules can influence outcomes in practice. The second part (in English) will bring these principles to life through a mock hearing of an Emergency Arbitration with an application for a Protective Preliminary Order, demonstrating how emergency relief can be sought and decided in urgent situations. It will be followed by a panel discussion joined by all speakers of the second panel.'],
      },
      {
        title: 'Programme',
        lines: ['5:30pm – 6:00pm'],
      },
      {
        title: 'Registration',
        lines: ['6:00pm – 6:05pm', 'Welcome Address by Ms Gloria Lim, CEO, SIAC', '6:05pm – 6:35pm', 'Fireside chat: The New SIAC Rules and Their Strategic Use (in Korean)', '6:35pm – 6:40pm', 'Introduction to Case Scenario and Concept of Workshop by Mr Arie Eernisse, Member, YSIAC Council; Senior Foreign Attorney, Peter & Kim', '6:40pm – 7:30pm', 'Mock EA with a PPO Application: Emergency Relief in Practice (in English)', '7:30pm – 8:00pm', 'Panel Discussion: What Makes EA and PPO applications Effective for Korean Companies?'],
      },
    ],
  },
  'yulchon-jusmundi': {
    sections: [
      {
        title: 'Overview',
        lines: ['We are delighted to extend an exclusive invitation to esteemed arbitration practitioners for a private dinner and yacht cruise along the majestic Han River, held during the much-anticipated Seoul ADR Festival (SAF) week. This special event, hosted by Yulchon and Jus Muni, is designed to provide an unparalleled opportunity to meet and engage with distinguished colleagues from the global arbitration community in an intimate and spectacular setting. This event provides a rare chance to exchange insights and strategies with peers, learn from the experiences of leaders in the field, and discuss potential collaborations in a less formal, more personable environment. As you network, the stunning views of the Han River will provide a refreshing and inspiring setting that encourages open, meaningful conversations. We are excited about the opportunity to host you and look forward to an evening of great food, insightful dialogue, and rewarding networking.', 'By invitation only'],
      },
    ],
  },
  cms: {
    contactInfo: ['Alicja.Labunska-Dmowska@cmslegal.com'],
    sections: [
      {
        title: 'Overview',
        lines: ['We are delighted to invite you to an exclusive CMS Cocktail Reception during the 2025 Seoul ADR Festival.', 'The reception is scheduled for Tuesday, 28 October 2025, starting at 8:00 p.m. at Zest, a venue that has earned recognition among the Top 50 Bars in Asia. The CMS International Arbitration team very much hopes that the evening will provide an opportunity for us all to reconnect with our friends in Seoul and forge new connections over special cocktails and canapes at a memorable location.', 'By Invitation Only'],
      },
    ],
  },
  'peter&kim': {
    contactInfo: ['bkpark@peterandkim.com', 'jhshim@peterandkim.com', 'jwchoi@peterandkim.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/peter-kim-bowling-1.png`,
        alt: 'Motion to Strike Peter and Kim bar and bowling event flyer',
      },
    ],
    registerHref: 'https://forms.gle/bCCueGy9yXxviZWDA',
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
  'scca-kim&chang-al-tamimi': {
    contactInfo: ['arbitration_news@kimchang.com', 'fasghari@sadr.org'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/scca-kimchang-al-tamimi-1.png`,
        alt: 'Saudi Arabia Korea enabling growth ensuring certainty and preventing disputes event flyer',
      },
    ],
    registerHref: 'https://www.kimchang.com/en/rsvp/registration.kc?idx=812&user_yn=accept',
    sections: [
      {
        title: 'Overview',
        lines: ['The Saudi Center for Commercial Arbitration, Kim & Chang and Al Tamimi & Company are pleased to present a seminar that will provide invaluable insights into Saudi Arabia\'s evolving investment and legal landscape. Please join our experts as they help Korean investors and legal practitioners navigate the Kingdom\'s dynamic environment, which is being shaped by ambitious economic reforms and major giga-projects. The discussions will cover the legal and regulatory framework for foreign investment and highlight key opportunities in strategic sectors, alongside an examination of Saudi Arabia’s growing role as a hub for international arbitration. The seminar will also delve into the practical aspects of dispute resolution, including recent updates from the SCCA, its increasing use in cross-border contracts, and the enforcement of arbitral awards.', 'The seminar will be conducted in English. More details, including speakers and the program, will be circulated as the event approaches. Thank you.'],
      },
      {
        title: 'Speakers',
        lines: ['Opening Remarks: Saeed Almadani (Saudi Arabia Commercial Attache), Hyung Koo Yeo (Kim & Chang)', 'Closing Remarks: Byung-Woo Im (Kim & Chang)', 'Speakers: Hamed Merah (SCCA), Christian P. Alberti (SCCA), Don Jeon (Kim & Chang), Manse Park (Kim & Chang), Keun Young Heo (Kim & Chang), Ahmed Basrawi (Al Tamimi & Company), Paul Taylor (Al Tamimi & Company), Jiwon Ha (Al Tamimi & Company), Wonjune Lee (LIG Nex1), Yeongjoon Pyeon (FTI Consulting)'],
      },
    ],
  },
  'gar-live:-seoul': {
    registerHref: 'https://events.globalarbitrationreview.com/event/GARSEOUL2025/home',
    sections: [
      {
        title: 'Source Page Details',
        lines: ['The original source page provides the event metadata and registration link only. Additional programme information is available through the registration page.'],
      },
    ],
  },
  'dentons-lee': {
    contactInfo: ['john.jk.kim@dentons.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/dentons-lee-1.png`,
        alt: 'The right dispute resolution tools for the best outcome event flyer',
      },
    ],
    registerHref: 'https://forms.office.com/Pages/ResponsePage.aspx?id=EbFJPNsZjUWD_xrwrJrjWwKtzp8AJw5FmtQ5QWmWwVlURTFLSVRKNDVTQ1NYSEdSOVQ2SUgwWERIQS4u',
    sections: [
      {
        title: 'Overview',
        lines: ['Litigation in courts is not the only option. Mediation can help parties preserve relationships and find extra-legal solutions to a dispute, and arbitration gives parties the option of resolving their disputes confidentially and to tailor a procedure that is best suited their needs.', 'Dentons shares how alternative dispute resolution can benefit your business, and how you can update your standard dispute resolution clauses.'],
      },
    ],
  },
  'bkl-scma': {
    contactInfo: ['changwan.han@bkl.co.kr'],
    registerHref: 'https://docs.google.com/forms/d/e/1FAIpQLSeOH3A0Njl4FnWp7qnvUg8J_YQi979G6ukBG-pQh11sLbgErw/viewform',
    sections: [
      {
        title: 'Source Page Details',
        lines: ['The original source page provides the event metadata and registration link only. Additional programme information is available through the registration page.'],
      },
    ],
  },
  'diac-horizonsco-greenbergtraurig': {
    registerHref: 'https://cvent.me/7B0q04',
    sections: [
      {
        title: 'Overview',
        lines: ['Join us for an engaging panel discussion on the evolving arbitration landscape in Dubai and the wider MENA region, followed by a networking session.', 'Leading arbitration experts and practitioners will share insights into DIAC’s role, regional legal frameworks, and comparative perspectives from Korea , fostering dialogue on cross-border cooperation, best practices, and the enforcement of arbitral awards.'],
      },
      {
        title: 'Speakers',
        lines: ['Jehad Kazim, Executive Director, DIAC', 'Mohammed Al Suwaidi, DIAC Arbitration Court Member, Founder and Managing Partner, Alsuwaidi & Company LLC', 'Christoffer Coello Hedberg, Deputy Registrar, DIAC', 'Ali Al Zarooni, Managing Partner, Horizons & Co', 'Richard Edlin, Vice Chair, Greenberg Traurig', 'Mr. Issey Park, Senior Associate, Morgan, Lewis & Bockius'],
      },
    ],
  },
  'icc-yaaf': {
    contactInfo: ['yjcha@leeko.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/icc-yaaf-1.png`,
        alt: 'Cross like a Pro tips and techniques for young practitioners event flyer',
      },
    ],
    registerHref: 'https://events2go.iccwbo.org/event/register-401?registrationMode=INDIVIDUAL',
    sections: [
      {
        title: 'Overview',
        lines: ['Join us for an engaging ICC YAAF session on practical strategies and advocacy techniques for cross-examination in international arbitration. This event will bring together experienced arbitration practitioners to share their insights on how to prepare, structure, and conduct effective cross-examinations — one of the most challenging yet essential skills in advocacy.', 'Whether you are a young practitioner seeking to build your advocacy toolkit or a seasoned professional eager to exchange perspectives, this event offers an excellent opportunity to connect with peers and leaders shaping the future of arbitration practice.'],
      },
      {
        title: 'Programme',
        lines: ['12:00 – 12:30 Lunch & Networking', '12:30 – 12:40 Welcome Remarks', '12:40 – 12:45 Introduction of ICC YAAF', '12:45 – 13:45 Panel Discussion', '13:45 – 14:00 Q&A / Closing Remarks'],
      },
      {
        title: 'Speakers',
        lines: ['Welcome Remarks : Dr. Donna Huang (ICC)', 'Moderator: Saemee Kim (Lee & Ko)', 'Speakers: Friven Yeoh (Skadden, Arps, Slate, Meagher & Flom), Dr. Inka Hanefeld (Hanefeld Legal), Moses Park (Liberty Chambers), Winnie Wat (ICC)'],
      },
    ],
  },
  'jipyong-youngita-kcabnext-nyiac': {
    contactInfo: ['pr_team@jipyong.com'],
    registerHref: 'https://www.jipyong.com/event/251030/index.html',
    sections: [
      {
        title: 'Overview',
        lines: ['This panel will explore how recent shifts in U.S. regulations are reshaping Korean and Asian outbound investment and trade. Speakers will highlight key risk points in contracts and supply chains, sector-specific exposure in industries such as construction, pharmaceuticals, energy, shipbuilding, etc., and the ways abrupt policy changes can trigger disputes. Practical guidance will focus on risk allocation, enforcement strategies, and effective use of arbitration and other dispute resolution tools.'],
      },
      {
        title: 'Speakers',
        lines: ['Moderator: Eugenia Stavropoulou / LSE Law, International Disputes Attorney', 'Speakers: Somin K. Jun / Jipyong LLC', 'Arie Eernisse / Peter & Kim', 'Mevelyn Ong / Sidley Austin LLP', 'Don Jeon / Kim & Chang', 'Lexi Takamatsu / Mori Hamada & Matsumoto'],
      },
    ],
  },
  'jusmundi-kcab-diac': {
    contactInfo: ['j.tangaperce@jusmundi.com'],
    registerHref: 'https://luma.com/JM-KCAB-DIAC-SeoulADR2025',
    sections: [
      {
        title: 'Overview',
        lines: ['The rise of Seoul and Dubai as global tech hubs is driving new approaches to international dispute resolution — from institutional innovation to AI and tech-driven disputes. This panel brings together leaders from DIAC, KCAB International, Jus Mundi, and leading Korean firms to explore how innovation is transforming the way disputes are managed and resolved across borders, with insights from both sides of the Gulf–Asia corridor.'],
      },
      {
        title: 'Speakers',
        lines: ['Jehad Kazim, Executive Director, DIAC', 'Christoffer Coello Hedberg, Deputy Registrar, DIAC', 'Pui-Ki Emmanuelle Ta, Secretary General, KCAB International', 'Jean-Rémi de Maistre, CEO & Co-Founder, Jus Mundi', 'Carl Im, Chief Technology Officer, Yulchon', 'Moderator: Joel Richardson, Partner, Kim & Chang'],
      },
    ],
  },
  'stevenson,-wong-&-co.': {
    contactInfo: ['Julia.Yeung@sw-hk.com', 'Networking session & light refreshment will be provided.'],
    registerHref: 'https://forms.gle/bvDKi5Te1htjSDnaA',
    sections: [
      {
        title: 'Language',
        lines: ['English (Korean interpretation can be arranged)'],
      },
      {
        title: 'Overview',
        lines: ['This dynamic panel discussion will explore emerging trends and key developments in the arbitration landscape, with a particular focus on Korea and insights from Hong Kong.', 'The discussion will cover multiple topics such as third-party funding in arbitration, the protection of confidentiality, safeguarding trade secrets and proprietary information, and the arbitration of intellectual property disputes. Panellists will also share perspectives on evolving government policies, all under the overarching theme of “Protecting Interests Through Arbitration.”', 'We are proud to present a diverse panel of speakers, including the Secretary General of KCAB INTERNATIONAL, seasoned in-house counsel, a respected law professor, and partners from prominent law firms in the field of international arbitration. This event offers a unique opportunity to gain first-hand insights into Korea’s growing role in international arbitration, while also learning from the experiences of neighbouring jurisdictions.'],
      },
      {
        title: 'Moderators',
        lines: ['Ms. Elizabeth Chan - Consultant of Stevenson, Wong & Co.', 'Mr. Justin Kim - Associate of Stevenson, Wong & Co. and AllBright Law (Hong Kong) Offices LLP'],
      },
      {
        title: 'Speakers',
        lines: ['Ms. Pui-Ki Emmanuelle Ta - Secretary General of KCAB INTERNATIONAL', 'Ms. Heidi Chui - Council Member of the Hong Kong International Arbitration Centre, Partner of Stevenson, Wong & Co. and AllBright Law (Hong Kong) Offices LLP', 'Professor Ahn Tae Joon - School of Law, Hanyang University', 'Mr. Yun Suk Jun - In-house counsel of 42 Dot Limited', 'Mr. Philip Kim - Partner of Watson Farley Williams (Seoul Office)'],
      },
    ],
  },
  'bkl-clifford-chance': {
    contactInfo: ['YSPARK@bkl.co.kr', 'HANJH@bkl.co.kr'],
    registerHref: 'https://docs.google.com/forms/d/e/1FAIpQLSc5p1WS3XQn_rUEUBkHLOhTtki9NjuZh8OdiFmJtwCbEFquJA/viewform',
    sections: [
      {
        title: 'Overview',
        lines: ['Session I: Effects of Russian Sanctions on International Arbitration', 'Session II: Protectionism and International Disputes', 'Session III: Artificial Intelligence in Arbitration'],
      },
      {
        title: 'Speakers',
        lines: ['Jason Fry [Clifford Chance]', 'Changwan Han [Bae, Kim & Lee LLC]', 'HJ Kwon [Clifford Chance]', 'Andrew Chongseh Kim [Bae, Kim & Lee LLC]'],
      },
    ],
  },
  'peterandkim-ykvn-joint-seminar': {
    contactInfo: ['bkpark@peterandkim.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/peterandkim-ykvn-joint-seminar-1.png`,
        alt: 'Enforcing arbitration awards in Vietnam event flyer',
      },
    ],
    registerHref: 'https://forms.gle/VLx19DdHjcRJJezAA',
    sections: [
      {
        title: 'Contact Person',
        lines: ['Name: Bokyeong Park', 'Position: Office Director', 'Email: bkpark@peterandkim.com', 'Phone: +82 (2) 538 2900'],
      },
    ],
  },
  wic: {
    contactInfo: ['makim@yoonyang.com'],
    registerHref: 'https://kcabinternational.glueup.com/event/wic-mentorship-international-arbitration-networking-at-changdeok-s-doorstep-155845/',
    sections: [
      {
        title: 'Overview',
        lines: ['Join us for an unforgettable evening of mentorship, networking evening and a dash of fun at Yudamhun directly facing Changdeok Palace - a UNESCO World Heritage Site rich in history and natural beauty. Enjoy light refreshments and dynamic conversation with members of the Women\'s Interest Committee (WIC), an accomplished organization of leading female international arbitration practitioners in Korea. In support of our commitment to diversity and inclusion, the event warmly welcomes all diverse practitioners engaged in international arbitration, regardless of seniority, gender, or affiliation. In celebration of the evening’s theme, guests are invited to incorporate an element of Korean traditional dress or culture into their attire (whether through a subtle accessory or a bold statement). The event is proudly supported by KCAB and KOCIA.'],
      },
    ],
  },
  'kcab-next-afia': {
    contactInfo: ['jangyoun.woo@kcab.or.kr'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/kcab-next-afia-1.png`,
        alt: 'Seoul-ful Breakfast with arbitration luminaries event flyer',
      },
    ],
    registerHref: 'https://kcabinternational.glueup.com/event/seoul-ful-breakfast-with-arbitration-luminaries-159352/',
    sections: [
      {
        title: 'Program',
        lines: ['08:30 - 09:00 Registration and Light Breakfast', '09:00 - 09:10 Welcome Remarks by KCAB International and AFIA', '09:10 - 10:20 Fireside Chat', '10:20 - 10:30 Closing'],
      },
    ],
  },
  'simc-kcab': {
    registerHref: 'https://simc.glueup.com/event/mediation-convention-and-ai-in-action-a-new-era-of-dispute-resolution-157920/',
    sections: [
      {
        title: 'Overview',
        lines: ['As part of Seoul ADR Festival 2025, SIMC and KCAB International have come together to host \"Mediation, Convention, and AI in Action: A New Era of Dispute Resolution.\"', 'Discover how mediation and technology are reshaping the future of dispute resolution. The programme features two interactive sessions—one on the power of mediation and the significance of the Singapore Convention, and another with a live demonstration of SIMC\'s Mediation AI Assistant (MAIA® 2.0), showcasing how AI can support mediators in real time, especially for complex commercial disputes.', 'Roundtable: \"What is Mediation and Why Now?\"'],
      },
      {
        title: 'Power of Mediation',
        lines: ['Exploring how mediation complements arbitration and litigation.', 'Highlighting the significance of the Singapore Convention.', '\"MAIA in Action\"', 'A live demonstration of MAIA, SIMC\'s AI-powered mediation assistant.', 'Showcasing how AI can practically support mediators in real-time.'],
      },
      {
        title: 'Speakers',
        lines: ['Chuan Wee Meng, Chief Executive Officer, Singapore International Mediation Centre (SIMC)', 'Pui-Ki Emmanuelle Ta, Secretary-General at KCAB International', 'Kap-You (Kevin) Kim, Founder & Managing Partner of Peter & Kim', 'Sae Youn Kim, Partner at Kim & Chang'],
      },
    ],
  },
  'icc-potluck-event': {
    contactInfo: ['vera.he@iccwbo.org'],
    registerHref: 'https://events2go.iccwbo.org/event/icc-potluck-event-spotting-red-flags-of-corruption-in-international-arbitration',
    sections: [
      {
        title: 'Sponsors',
        lines: ['Yulchon LLC - Kim & Chang'],
      },
      {
        title: 'Overview',
        lines: ['Corruption remains a critical challenge in international arbitration, jeopardizing the validity and enforceability of awards. Drawing on the ICC’s report “Red Flags or Other Indicators of Corruption in International Arbitration,” this event explores practical tools to identify suspicious patterns—from unusual payments and abnormal conduct to dealings with shell companies.', 'The discussion will emphasize how arbitrators and counsel can proactively detect and address these indicators while balancing investigative duties with procedural fairness. Join this essential conversation to enhance your ability to safeguard the integrity of your practice and the arbitral system.', 'Lunch for this event is kindly provided by the sponsoring law firm.'],
      },
      {
        title: 'Programme',
        lines: ['12:00 - 12:15 Registration', '12:15 - 12:20 Opening Remarks', 'Vera He, Deputy Director, ICC Arbitration and ADR for North Asia, ICC Dispute Resolution Services', '12:20 - 12:30 Introduction to the ICC Report', 'Donna Huang, Director, ICC Arbitration and ADR for North Asia, ICC Dispute Resolution Services', '12:30 - 13:45 Panel Discussion', 'Susan Munro, Registered Foreign Lawyer, K&L Gates, Hong Kong', 'Wesley Pang, Partner, Eversheds Sutherland, Hong Kong', 'Lydia Tang, Director, Disputes and International Arbitration, BRG, Hong Kong', 'Moderated by:', 'David McArthur, Partner, Co-head of International Dispute Resolution, Yulchon LLC, Seoul', '13:45 - 14:00 Networking'],
      },
      {
        title: 'Contact Point',
        lines: ['Ms. Vera He, Deputy Director, ICC Arbitration and ADR for North Asia, ICC Dispute Resolution Services, vera.he@iccwbo.org'],
      },
    ],
  },
  'yulchon-steptoe-seminar': {
    contactInfo: ['s_jmyoo@yulchon.com'],
    images: [
      {
        src: `${saf2025DetailAssetPath}/yulchon-steptoe-seminar-1.png`,
        alt: 'Surviving U.S. Legal Shifts event flyer',
      },
    ],
    registerHref: 'https://www.yulchon.com/en/seminars/seminars-view/667/page.do',
    sections: [
      {
        title: 'Event Materials',
        lines: ['The original source page presents the detailed programme as the flyer below.'],
      },
    ],
  },
};
