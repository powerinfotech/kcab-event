import React from 'react';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-contact.png';

export default function PublicContact() {
  return (
    <main className="saf-subpage saf-contact-page">
      <PublicSubPageHero
        title="Contact"
        section="Contact"
        current="Contact us"
        backgroundImage={HeroImage}
        className="saf-contact-hero"
      />

      <section className="saf-subpage-section saf-contact-section">
        <div className="saf-renewal-shell">
          <div className="saf-section-lead">
            <span>Contact</span>
            <div className="saf-section-lead-row">
              <h2>Contact us</h2>
            </div>
          </div>

          <div className="saf-contact-grid">
            <aside className="saf-contact-info">
              <span>Office</span>
              <h3>SAF Secretariat</h3>
              <p>
                Suite 3704, 37F,
                <br />
                511 Yeongdong-daero,
                <br />
                Gangnam-gu, Seoul,
                <br />
                South Korea
              </p>
              <hr />
              <span>Email</span>
              <a href="mailto:saf@kcab.or.kr">saf@kcab.or.kr</a>
            </aside>
            <div className="saf-contact-map">
              <iframe
                title="SAF Secretariat map"
                src="https://www.google.com/maps?q=Trade%20Tower%2C%20511%20Yeongdong-daero%2C%20Gangnam-gu%2C%20Seoul&z=16&hl=en&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
