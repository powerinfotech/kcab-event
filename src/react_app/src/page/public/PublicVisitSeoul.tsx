import React from 'react';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-visit-seoul.png';
import SeoulImage from '../../assets/images/saf-renewal/0612/visit-intro.png';
import HotelOne from '../../assets/images/saf-renewal/0612/visit-hotel-josun.png';
import HotelTwo from '../../assets/images/saf-renewal/0612/visit-hotel-mondrian.png';
import HotelThree from '../../assets/images/saf-renewal/0612/visit-hotel-ac.png';

const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

const hotels = [
  {
    name: 'Josun Palace',
    image: HotelOne,
    address: '231 Teheran-ro, Gangnam-gu, Seoul',
    contact: 'Ricky.choo@josunpalace.com · +82 2 727 7417',
    access: '4 min by car · 16 min walk from ADR Conference venue',
    rates: 'Corporate rates are offered on a case-by-case basis and may vary depending on the time of booking.',
    link: 'https://josunpalace.com',
  },
  {
    name: 'Mondrian Seoul Itaewon',
    image: HotelTwo,
    address: '23 Jangmun-ro, Yongsan-gu, Seoul',
    contact: 'Hannah.BACK@accor.com · +82 2 2076 2000',
    access: 'Welcome reception hotel · 30-40 min by car from the venue',
    rates: 'Signature rooms are available with single or double options, subject to availability.',
    link: 'https://mondrianseoul.com',
  },
  {
    name: 'AC Hotel by Marriott Seoul Gangnam',
    image: HotelThree,
    address: '10 Teheran-ro 25-gil, Gangnam-gu, Seoul',
    contact: 'rsvn@acseoulgangnam.com · +82 2 2050 6500',
    access: '5 min by car from ADR Conference venue',
    rates: 'Superior, Deluxe, and Premier room types are available with flexible rates from Marriott.com.',
    link: 'https://www.marriott.com',
  },
];

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
            <a href="https://english.visitseoul.net" target="_blank" rel="noopener noreferrer">Find out more +</a>
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
                  <a href={hotel.link} target="_blank" rel="noopener noreferrer">Visit site +</a>
                </figure>
                <div>
                  <h3>{hotel.name}</h3>
                  <dl>
                    <dt>Address</dt>
                    <dd>{hotel.address}</dd>
                    <dt>Contact</dt>
                    <dd>{hotel.contact}</dd>
                    <dt>Access</dt>
                    <dd>{hotel.access}</dd>
                    <dt>Room Rates</dt>
                    <dd>{hotel.rates}</dd>
                    <dt>Reservation</dt>
                    <dd>Contact the reservation office directly and mention the KCAB International corporate rate.</dd>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
