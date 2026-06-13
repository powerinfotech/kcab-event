import React, { useState } from 'react';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-side-event.png';

const gains = [
  {
    title: 'Global Visibility',
    text: 'Showcase your law firm, institution, or company to the international arbitration community via the SAF platform.',
  },
  {
    title: 'Promotional Support',
    text: 'Get expert support from the SAF Secretariat for seamless event management and marketing tools.',
  },
  {
    title: 'Business Expansion',
    text: 'Seize the opportunity to grow your business and reach new audiences.',
  },
];

const formRows = [
  ['First Name', 'Last Name'],
  ['Email'],
  ['Company'],
  ['Job Title'],
  ['Event Date', 'Event Time'],
  ['Event Title'],
  ['Organizer(s)'],
  ['Event Format', 'Event Venue'],
  ['Event Language'],
  ['Speakers'],
  ['Short Description of the Event'],
  ['Logo of the Organizer(s)'],
];

const fieldStartIndex = formRows.reduce<number[]>((acc, _row, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + formRows[i - 1].length);
  return acc;
}, []);

export default function PublicSideEvent() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="saf-subpage saf-side-event-page">
      <PublicSubPageHero title="Side Event" section="Side Event" backgroundImage={HeroImage} className="saf-side-hero" />

      <section className="saf-subpage-section saf-side-intro">
        <div className="saf-renewal-shell">
          <div className="saf-side-kicker">SAF 2026 · Seoul</div>
          <div className="saf-side-title-grid">
            <h2>
              Side Event
              <br />
              <strong>Application</strong>
              <br />
              is Open.
            </h2>
            <p>
              Join us at SAF 2026 as a participating organization and expand your network for broader business
              opportunities in the field of international arbitration.
              <span>Status - Now Accepting</span>
            </p>
          </div>

          <section className="saf-side-gain-grid">
            <header>
              <span>Section 01</span>
              <h3>
                By hosting side events during SAF, you will gain
              </h3>
            </header>
            <div className="saf-side-gain-list">
              {gains.map((gain, index) => (
                <article key={gain.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{gain.title}</h4>
                    <p>{gain.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="saf-side-guidelines">
            <div>
              <span>Section 02 - Guidelines</span>
              <h3>
                Side Event
                <br />
                <strong>Guidelines.</strong>
              </h3>
            </div>
            <div>
              <p>
                After reviewing your event details, a confirmation email will be sent to you to confirm that your
                event has been successfully registered as part of SAF 2026.
              </p>
              <p
                style={{
                  marginTop: 24,
                  paddingTop: 24,
                  borderTop: '1px solid rgba(255, 255, 255, 0.13)',
                  fontSize: 14,
                  lineHeight: 1.3,
                  color: 'rgba(255, 255, 255, 0.67)',
                }}
              >
                For side event hosting guidelines, click the button and refer to the requirements.
              </p>
              <a href="#side-event-application">Find More</a>
            </div>
          </section>

          <section id="side-event-application" className="saf-side-form-section">
            <aside>
              <span>Section 03</span>
              <h3>Side Event Application Form</h3>
              <i className="saf-side-form-divider" aria-hidden="true" />
              <p>All fields marked are required for review by the SAF Secretariat.</p>
            </aside>
            <form
              className="saf-side-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              {formRows.map((row, index) => (
                <div className={`saf-side-form-row${row.length === 1 ? ' is-full' : ''}`} key={`${row.join('-')}-${index}`}>
                  {row.map((label, colIndex) => (
                    <label key={label}>
                      <span>{label}</span>
                      <em className="saf-side-field-index" aria-hidden="true">
                        {String(fieldStartIndex[index] + colIndex + 1).padStart(2, '0')}
                      </em>
                      {label.includes('Description') || label === 'Speakers' ? (
                        <textarea placeholder={label === 'Speakers' ? 'name / affiliation / position' : ''} />
                      ) : label.includes('Logo') ? (
                        <input type="file" />
                      ) : label === 'Event Format' ? (
                        <select defaultValue="">
                          <option value="" disabled>Select format</option>
                          <option>In-person</option>
                          <option>Online</option>
                          <option>Hybrid</option>
                        </select>
                      ) : (
                        <input type={label.includes('Date') ? 'date' : label.includes('Time') ? 'time' : 'text'} />
                      )}
                    </label>
                  ))}
                </div>
              ))}
              <div className="saf-side-form-submit">
                <span>{submitted ? 'Application preview submitted.' : 'Submit application'}</span>
                <button type="submit">Send</button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
