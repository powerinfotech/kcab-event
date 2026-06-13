import React from 'react';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-sponsorship.png';
import CrowdImage from '../../assets/images/saf-renewal/0612/sponsorship-apply-band.png';
import PackageWelcome from '../../assets/images/saf-renewal/0612/sponsorship-package-welcome.png';
import PackagePlatinum from '../../assets/images/saf-renewal/0612/sponsorship-package-platinum.png';
import PackageGold from '../../assets/images/saf-renewal/0612/sponsorship-package-gold.png';
import PackageSilver from '../../assets/images/saf-renewal/0612/sponsorship-package-silver.png';
import PackageChampagne from '../../assets/images/saf-renewal/0612/sponsorship-package-champagne.png';
import PackageSouvenir from '../../assets/images/saf-renewal/0612/sponsorship-package-souvenir.png';
import PackageCoffee from '../../assets/images/saf-renewal/0612/sponsorship-package-coffee.png';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

const whySponsor = [
  ['Global Reach', 'Connect with 700+ participants from over 30 countries across the arbitration community.'],
  ['Targeted Networking', 'Build relationships with key decision makers while unlocking new business opportunities.'],
  ['Thought Leadership', 'Engage with leading experts and stay ahead of the latest developments in arbitration and ADR.'],
  ['Brand Visibility', 'Elevate your profile on a global stage by aligning with a premier ADR platform in Seoul.'],
  ['Business Growth & Client Engagement', 'Deepen client relationships and unlock new opportunities through targeted engagement.'],
];

const packages = [
  ['Welcome Reception', PackageWelcome],
  ['Platinum', PackagePlatinum],
  ['Gold', PackageGold],
  ['Silver', PackageSilver],
  ['Champagne', PackageChampagne],
  ['Souvenir', PackageSouvenir],
  ['Coffee', PackageCoffee],
];

const platinumRows = [
  ['Slots', '2', '3', 'Unlimited'],
  ['Logo profile featured on SAF website', '300 words', '200 words', '100 words'],
  ['Logo display across digital platforms', 'Prominent', 'O', 'O'],
  ['Private played during session breaks', '1 min', '30 sec', '-'],
  ['Sponsor post on LinkedIn in advance of SAF', 'Featured', 'O', 'O'],
  ['Access to KCAB facilities at discounted rates', 'Priority', 'Preferred', 'Best Available'],
];

const itemRows = [
  ['Slots', '2', '3', '1'],
  ['Event Type', 'Welcome Reception', 'Welcome Reception / SAF Conference', 'ADR Conference'],
  ['Logo placement on event item', 'Champagne coolers', 'Souvenir', 'Coffee wave'],
  ['Logo display across digital platforms', 'Featured', 'Featured', 'Featured'],
  ['Complimentary registrations', '5', '5', '3'],
];

export default function PublicSponsorship() {
  return (
    <main className="saf-subpage saf-sponsorship-page">
      <PublicSubPageHero title="SponsorShip" section="SponsorShip" backgroundImage={HeroImage} className="saf-sponsorship-hero" />

      <section className="saf-subpage-section saf-sponsor-intro">
        <div className="saf-renewal-shell">
          <div className="saf-sponsor-title-grid">
            <aside>
              <strong>SAF</strong>
              <span>Sponsorship</span>
              <small>Deadline 10 June 2026</small>
            </aside>
            <div>
              <span>Sponsorship</span>
              <h2>
                <strong>Sponsor</strong> Seoul's
                <br />
                premier ADR gathering of the year.
              </h2>
              <p>
                Join us in Seoul, a globally recognized city at the forefront of innovation and international
                collaboration, and unlock valuable opportunities to elevate your brand visibility and expand your
                business network through sponsorship of SAF 2026.
              </p>
            </div>
          </div>

          <section className="saf-sponsor-why">
            <aside>
              <span>Section 01</span>
              <p>Your reasons our sponsors return year after year.</p>
            </aside>
            <div>
              <h3>Why sponsor <strong>SAF 2026?</strong></h3>
              <div className="saf-sponsor-why-grid">
                {whySponsor.map(([title, text], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h4>{title}</h4>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="saf-sponsor-apply">
        <img src={assetSrc(CrowdImage)} alt="" aria-hidden="true" />
        <div className="saf-renewal-shell saf-sponsor-apply-inner">
          <h2>
            Apply
            <br />
            by 10 June
            <br />
            2026.
          </h2>
          <p>
            With tremendous support and encouragement, 2025 SAF was a great success thanks to our generous sponsors.
            KCAB International is pleased to introduce a new sponsorship program for 2026 Seoul ADR Festival.
          </p>
          <a href="mailto:saf@kcab.or.kr">saf@kcab.or.kr</a>
        </div>
      </section>

      <section className="saf-subpage-section saf-sponsor-packages">
        <div className="saf-renewal-shell">
          <div className="saf-sponsor-section-grid">
            <aside>
              <span>Section 03</span>
              <p>Seven package tiers across visibility, hospitality, and brand activation.</p>
            </aside>
            <div>
              <h2>Sponsorship <strong>Packages.</strong></h2>
              <div className="saf-sponsor-package-grid">
                {packages.map(([title, image], index) => (
                  <article key={title}>
                    <img src={assetSrc(image)} alt="" aria-hidden="true" />
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{title}</h3>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <SponsorshipTable
            title="Platinum / Gold / Silver."
            columns={['Sponsorship Benefits', 'Platinum', 'Gold', 'Silver']}
            rows={platinumRows}
          />
          <SponsorshipTable
            title="Champagne / Souvenir / Coffee."
            columns={['Sponsorship Benefits', 'Champagne', 'Souvenir', 'Coffee']}
            rows={itemRows}
            purple
          />

          <div className="saf-sponsor-contact">
            <span>Ready to sponsor?</span>
            <strong>Contact the SAF Secretariat by 10 June 2026.</strong>
            <a href="mailto:saf@kcab.or.kr">saf@kcab.or.kr</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function SponsorshipTable({
  title,
  columns,
  rows,
  purple = false,
}: {
  title: string;
  columns: string[];
  rows: string[][];
  purple?: boolean;
}) {
  return (
    <section className="saf-sponsor-table-block">
      <h2>{title}</h2>
      <div className={`saf-sponsor-table-wrap${purple ? ' is-purple' : ''}`}>
        <table>
          <thead>
            <tr>
              {columns.map((column) => <th key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join('-')}>
                {row.map((cell, index) => (
                  index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={`${cell}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
