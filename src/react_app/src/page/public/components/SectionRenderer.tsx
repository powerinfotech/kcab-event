import React, { useState, useEffect, useCallback } from 'react';
import {
  PageSection,
  HeroData,
  TextData,
  ImageData,
  ImageSliderData,
  CardListData,
  SpeakerListData,
  VideoData,
  MapData,
  BannerListData,
  EventInfoData,
} from '@interface/page/PageManagement';

function parseSectionData<T>(sectionData: string): T | null {
  try {
    return JSON.parse(sectionData) as T;
  } catch {
    return null;
  }
}

// ─────────── HERO ───────────
function HeroSection({ data }: { data: HeroData }) {
  const style = data.backgroundImage
    ? { backgroundImage: `url(${data.backgroundImage})` }
    : {};

  return (
    <section className={`pub-section section-hero size-${data.size || 'medium'}`} style={style}>
      <div className="hero-content">
        <h2 className="hero-title">{data.title}</h2>
        {data.subtitle && <p className="hero-subtitle">{data.subtitle}</p>}
      </div>
    </section>
  );
}

// ─────────── TEXT ───────────
function TextSection({ data }: { data: TextData }) {
  return (
    <section className={`pub-section section-text size-${data.size || 'medium'}`}>
      <div className="pub-section-inner">
        {data.title && <h3 className="text-title">{data.title}</h3>}
        <div className="text-content" dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </section>
  );
}

// ─────────── IMAGE ───────────
function ImageSection({ data }: { data: ImageData }) {
  return (
    <section className={`pub-section section-image size-${data.size || 'medium'}`}>
      <div className="pub-section-inner">
        <div className="image-wrap">
          <img src={data.imageUrl} alt={data.alt || ''} />
        </div>
        {data.caption && <p className="image-caption">{data.caption}</p>}
      </div>
    </section>
  );
}

// ─────────── IMAGE_SLIDER ───────────
function ImageSliderSection({ data }: { data: ImageSliderData }) {
  const [current, setCurrent] = useState(0);
  const images = data.images || [];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!data.autoPlay || images.length <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [data.autoPlay, images.length, next]);

  if (images.length === 0) return null;

  return (
    <section className="pub-section section-image-slider">
      <div className="pub-section-inner">
        <div className="slider-container">
          <div className="slider-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {images.map((img, i) => (
              <div key={i} className="slider-slide">
                <img src={img.imageUrl} alt={img.alt || ''} />
                {img.caption && <p className="slider-caption">{img.caption}</p>}
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button className="slider-btn prev" onClick={prev}>&lt;</button>
              <button className="slider-btn next" onClick={next}>&gt;</button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="slider-controls">
            {images.map((_, i) => (
              <button
                key={i}
                className={`slider-dot ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────── CARD_LIST ───────────
function CardListSection({ data }: { data: CardListData }) {
  return (
    <section className="pub-section section-card-list">
      <div className="pub-section-inner">
        {data.title && <h3 className="card-list-title">{data.title}</h3>}
        <div className={`card-grid cols-${data.columns || 3}`}>
          {(data.cards || []).map((card, i) => (
            <div key={i} className="card-item">
              {card.linkUrl ? (
                <a href={card.linkUrl} target="_blank" rel="noopener noreferrer">
                  {card.imageUrl && <img className="card-image" src={card.imageUrl} alt={card.title} />}
                  <div className="card-body">
                    <h4 className="card-title">{card.title}</h4>
                    {card.description && <p className="card-desc">{card.description}</p>}
                  </div>
                </a>
              ) : (
                <>
                  {card.imageUrl && <img className="card-image" src={card.imageUrl} alt={card.title} />}
                  <div className="card-body">
                    <h4 className="card-title">{card.title}</h4>
                    {card.description && <p className="card-desc">{card.description}</p>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────── SPEAKER_LIST ───────────
function SpeakerListSection({ data }: { data: SpeakerListData }) {
  return (
    <section className="pub-section section-speaker-list">
      <div className="pub-section-inner">
        {data.title && <h3 className="speaker-title">{data.title}</h3>}
        <div className="speaker-grid">
          {(data.speakers || []).map((speaker, i) => (
            <div key={i} className="speaker-item">
              {speaker.imageUrl ? (
                <img className="speaker-photo" src={speaker.imageUrl} alt={speaker.name} />
              ) : (
                <div className="speaker-photo" />
              )}
              <h4 className="speaker-name">{speaker.name}</h4>
              {speaker.role && <p className="speaker-role">{speaker.role}</p>}
              {speaker.organization && <p className="speaker-org">{speaker.organization}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────── VIDEO ───────────
function VideoSection({ data }: { data: VideoData }) {
  const embedUrl = data.videoUrl?.includes('youtube.com/watch')
    ? data.videoUrl.replace('watch?v=', 'embed/')
    : data.videoUrl;

  return (
    <section className="pub-section section-video">
      <div className="pub-section-inner">
        {data.title && <h3 className="video-title">{data.title}</h3>}
        <div className="video-wrap">
          <iframe src={embedUrl} allowFullScreen title={data.title || 'Video'} />
        </div>
      </div>
    </section>
  );
}

// ─────────── MAP ───────────
function MapSection({ data }: { data: MapData }) {
  const mapSrc = `https://maps.google.com/maps?q=${data.lat},${data.lng}&z=15&output=embed`;

  return (
    <section className="pub-section section-map">
      <div className="pub-section-inner">
        {data.title && <h3 className="map-title">{data.title}</h3>}
        {data.address && <p className="map-address">{data.address}</p>}
        <div className="map-embed">
          <iframe src={mapSrc} title={data.title || 'Map'} />
        </div>
        {data.description && <p className="map-description">{data.description}</p>}
      </div>
    </section>
  );
}

// ─────────── BANNER_LIST ───────────
function BannerListSection({ data }: { data: BannerListData }) {
  return (
    <section className="pub-section section-banner-list">
      <div className="pub-section-inner">
        <div className="banner-grid">
          {(data.banners || []).map((banner, i) => (
            <div key={i} className="banner-item">
              {banner.linkUrl ? (
                <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                  <img src={banner.imageUrl} alt={banner.alt || ''} />
                </a>
              ) : (
                <img src={banner.imageUrl} alt={banner.alt || ''} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────── EVENT_INFO ───────────
function EventInfoSection({ data }: { data: EventInfoData }) {
  return (
    <section className="pub-section section-event-info">
      <div className="pub-section-inner">
        <div className="event-info-inner">
          <h3 className="event-title">{data.title}</h3>
          <div className="event-meta">
            {data.date && <span className="event-meta-item">{data.date}</span>}
            {data.location && <span className="event-meta-item">{data.location}</span>}
          </div>
          {data.description && <p className="event-description">{data.description}</p>}
          {data.registrationUrl && (
            <a className="event-register-btn" href={data.registrationUrl} target="_blank" rel="noopener noreferrer">
              Register
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────── Main Renderer ───────────
interface SectionRendererProps {
  section: PageSection;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const { sectionType, sectionData } = section;

  switch (sectionType) {
    case 'HERO': {
      const data = parseSectionData<HeroData>(sectionData);
      return data ? <HeroSection data={data} /> : null;
    }
    case 'TEXT': {
      const data = parseSectionData<TextData>(sectionData);
      return data ? <TextSection data={data} /> : null;
    }
    case 'IMAGE': {
      const data = parseSectionData<ImageData>(sectionData);
      return data ? <ImageSection data={data} /> : null;
    }
    case 'IMAGE_SLIDER': {
      const data = parseSectionData<ImageSliderData>(sectionData);
      return data ? <ImageSliderSection data={data} /> : null;
    }
    case 'CARD_LIST': {
      const data = parseSectionData<CardListData>(sectionData);
      return data ? <CardListSection data={data} /> : null;
    }
    case 'SPEAKER_LIST': {
      const data = parseSectionData<SpeakerListData>(sectionData);
      return data ? <SpeakerListSection data={data} /> : null;
    }
    case 'VIDEO': {
      const data = parseSectionData<VideoData>(sectionData);
      return data ? <VideoSection data={data} /> : null;
    }
    case 'MAP': {
      const data = parseSectionData<MapData>(sectionData);
      return data ? <MapSection data={data} /> : null;
    }
    case 'BANNER_LIST': {
      const data = parseSectionData<BannerListData>(sectionData);
      return data ? <BannerListSection data={data} /> : null;
    }
    case 'EVENT_INFO': {
      const data = parseSectionData<EventInfoData>(sectionData);
      return data ? <EventInfoSection data={data} /> : null;
    }
    default:
      return null;
  }
};

export default SectionRenderer;
