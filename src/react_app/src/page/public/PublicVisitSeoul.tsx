import React from 'react';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-visit-seoul.png';
import SeoulImage from '../../assets/images/saf-renewal/0612/visit-intro.png';
import HotelOne from '../../assets/images/saf-renewal/0612/visit-hotel-josun.png';
import HotelTwo from '../../assets/images/saf-renewal/0612/visit-hotel-mondrian.png';
import HotelThree from '../../assets/images/saf-renewal/0612/visit-hotel-ac.png';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

interface RateTable {
  columns: string[];
  rows: string[][];
}

interface Hotel {
  name: string;
  image: string | { src?: string };
  link: string;
  address: string;
  contact: string;
  access: string;
  ratesText?: string;
  rateTable?: RateTable;
  rateNote?: string;
  reservation: string[];
  footnote: string;
}

const hotels: Hotel[] = [
  {
    name: 'Josun Palace',
    image: HotelOne,
    link: 'https://josunpalace.com',
    address: '231 Teheran-ro, Gangnam-gu, Seoul',
    contact: 'Ricky.choo@josunpalace.com',
    access: '4 min by car · 16 min walk from ADR Conference venue',
    ratesText:
      'Corporate rates are offered on a case-by-case basis and may vary depending on the time of booking. Please contact the reservation office directly.',
    reservation: [
      'Contact the reservation office (Ricky.choo@josunpalace.com · +82 2 727 7417) and mention the "KCAB International" corporate rate.',
    ],
    footnote: '*Rooms subject to availability.',
  },
  {
    name: 'Mondrian Seoul Itaewon',
    image: HotelTwo,
    link: 'https://mondrianseoul.com',
    address: '23 Janghun-ro, Yongsan-gu, Seoul',
    contact: 'Hannah.BACK@accor.com',
    access: 'Welcome reception hotel · 30–40 min by car from the venue',
    rateTable: {
      columns: ['Room Type', 'Single', 'Double', 'Notes'],
      rows: [
        ['Signature (King / Twin)', '356,000', '356,000', 'Room only'],
        ['Signature (King / Twin)', '405,000', '405,000', 'Breakfast for 1'],
        ['Signature City King', '395,000', '395,000', 'Breakfast + Sauna for 1'],
      ],
    },
    rateNote: 'All rates subject to 10% service charge.',
    reservation: [
      'Contact the reservation office (Hannah.BACK@accor.com · +82 2 2076 2000) and mention the "KCAB International" corporate rate.',
    ],
    footnote: '*Rooms subject to availability.',
  },
  {
    name: 'AC Hotel by Marriott Seoul Gangnam',
    image: HotelThree,
    link: 'https://www.marriott.com',
    address: '10 Teheran-ro 25-gil, Gangnam-gu, Seoul',
    contact: 'rsvn@acseoulgangnam.com',
    access: '5 min by car from ADR Conference venue',
    rateTable: {
      columns: ['Room Type', 'Room Rate', 'Notes'],
      rows: [
        ['Superior', '10% off Marriott.com flexible rate', 'Breakfast not included'],
        ['Deluxe (City View)', '', ''],
        ['Premier (Skyline View)', '', ''],
      ],
    },
    rateNote: 'All rates subject to 10% service charge.',
    reservation: [
      'Complete the reservation form and send it to rsvn@acseoulgangnam.com · +82 2 2050 6500.',
      'Or book directly on Marriott.com / Bonvoy app with corporate code F4307 in the Corp/Promo Code field under "Special Rates" when viewing available rates.',
    ],
    footnote: '*Rooms subject to availability.',
  },
];

function RateTableView({ table }: { table: RateTable }) {
  return (
    <table className="saf-visit-rate-table">
      <thead>
        <tr>
          {table.columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={row.join('-') + rowIndex}>
            {row.map((cell, colIndex) => {
              if (cell === '') return null;
              let rowSpan = 1;
              for (let k = rowIndex + 1; k < table.rows.length && table.rows[k][colIndex] === ''; k += 1) rowSpan += 1;
              return (
                <td key={colIndex} rowSpan={rowSpan > 1 ? rowSpan : undefined}>
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PublicVisitSeoul() {
  return (
    <main className="saf-subpage saf-visit-page">
      <PublicSubPageHero
        title="Visit Seoul"
        section="Visit Seoul"
        backgroundImage={HeroImage}
        className="saf-visit-hero"
      />

      <section className="saf-visit-intro">
        <div className="saf-renewal-shell saf-visit-intro-grid">
          <div>
            <div className="saf-section-lead">
              <span>SAF 2026</span>
              <div className="saf-section-lead-row">
                <h2>Visit Seoul</h2>
              </div>
            </div>
            <h3>Your gateway to Seoul.</h3>
            <p>
              Visiting Seoul is a seamless experience for international travellers. First-time visitor?
              The guide below covers transport and the essentials for a smooth arrival and departure.
            </p>
            <a href="https://english.visitseoul.net" target="_blank" rel="noopener noreferrer">Find out more →</a>
          </div>
          <img src={assetSrc(SeoulImage)} alt="Seoul city night view" />
        </div>
      </section>

      <section className="saf-subpage-section saf-visit-hotels">
        <div className="saf-renewal-shell">
          <div className="saf-visit-hotel-head">
            <span>Partner Hotels</span>
            <h2>Stay where the conference happens.</h2>
            <p>
              SAF 2026 offers a range of partner hotels to suit every budget. Accommodation is first-come,
              first-served and subject to availability at the time of booking.
            </p>
          </div>

          <div className="saf-visit-hotel-list">
            {hotels.map((hotel, index) => (
              <article className="saf-visit-hotel" key={hotel.name}>
                <figure>
                  <img src={assetSrc(hotel.image)} alt={hotel.name} />
                  <figcaption>{String(index + 1).padStart(2, '0')} / 05</figcaption>
                  <a href={hotel.link} target="_blank" rel="noopener noreferrer">Visit site ↗</a>
                </figure>
                <div className="saf-visit-hotel-body">
                  <h3>{hotel.name}</h3>
                  <dl>
                    <dt>Address</dt>
                    <dd>{hotel.address}</dd>
                    <dt>Contact</dt>
                    <dd>
                      <a href={`mailto:${hotel.contact}`}>{hotel.contact}</a>
                    </dd>
                    <dt>Access</dt>
                    <dd>{hotel.access}</dd>
                  </dl>

                  <hr className="saf-visit-hotel-divider" />

                  <h4>Room Rates</h4>
                  {hotel.ratesText && <p className="saf-visit-rate-text">{hotel.ratesText}</p>}
                  {hotel.rateTable && <RateTableView table={hotel.rateTable} />}
                  {hotel.rateNote && <p className="saf-visit-rate-note">{hotel.rateNote}</p>}

                  <h4>Reservation</h4>
                  {hotel.reservation.map((paragraph) => (
                    <p className="saf-visit-reservation" key={paragraph.slice(0, 24)}>
                      {paragraph}
                    </p>
                  ))}

                  <p className="saf-visit-footnote">{hotel.footnote}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="saf-visit-tax-note">All rates subject to 10% VAT per room.</p>
        </div>
      </section>
    </main>
  );
}
