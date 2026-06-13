import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { callGetPublicGalleryList, resolveGalleryImageUrl } from '@api/gallery/GalleryApi';
import { GalleryListItem } from '@interface/admin/Gallery';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-gallery.png';
import FallbackOne from '../../assets/images/saf-renewal/gallery-conference.jpg';
import FallbackTwo from '../../assets/images/saf-renewal/gallery-reception.jpg';
import FallbackThree from '../../assets/images/saf-renewal/gallery-audience.jpg';

interface SelectedImage {
  gallery: GalleryListItem;
  index: number;
}

const fallbackImages = [FallbackOne, FallbackTwo, FallbackThree];
const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

// 정렬용 연도: 타이틀의 4자리 숫자 → 없으면 galleryYear.
function yearFromTitle(item: GalleryListItem) {
  const matched = (item.title ?? '').match(/\d{4}/);
  return matched ? Number(matched[0]) : item.galleryYear ?? 0;
}

export default function PublicGallery() {
  const [items, setItems] = useState<GalleryListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectedImage | null>(null);

  useEffect(() => {
    setLoading(true);
    callGetPublicGalleryList()
      .then((res) => setItems(res?.item ?? []))
      .finally(() => setLoading(false));
  }, []);

  // 이미지가 있는 앨범만, 타이틀 연도 내림차순 — 최신부터 (2024 → 2019).
  const galleries = useMemo(
    () => items.filter((item) => item.images?.length).sort((a, b) => yearFromTitle(b) - yearFromTitle(a)),
    [items],
  );

  const selectedImages = selected ? selected.gallery.images ?? [] : [];
  const currentImage = selected ? selectedImages[selected.index] : null;

  const close = useCallback(() => setSelected(null), []);
  const step = useCallback((delta: number) => {
    setSelected((prev) => {
      if (!prev) return prev;
      const list = prev.gallery.images ?? [];
      if (!list.length) return prev;
      return { gallery: prev.gallery, index: (prev.index + delta + list.length) % list.length };
    });
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, close, step]);

  return (
    <main className="saf-subpage saf-gallery-page">
      <PublicSubPageHero
        title="Archives"
        section="Archives"
        current="Gallery"
        backgroundImage={HeroImage}
        className="saf-gallery-hero"
      />

      <section className="saf-subpage-section saf-gallery-section">
        <div className="saf-renewal-shell">
          <div className="saf-section-lead">
            <span>Archives</span>
          </div>

          {loading && <div className="saf-subpage-empty">Loading gallery...</div>}
          {!loading && !galleries.length && <GalleryFallback />}

          {galleries.map((gallery) => (
            <section key={gallery.gallerySeq} className="saf-gallery-year-section">
              <h3>{gallery.title}</h3>
              {gallery.description && <p className="saf-gallery-album-desc">{gallery.description}</p>}
              <div className="saf-gallery-mosaic">
                {(gallery.images ?? []).map((image, index) => (
                  <button
                    key={image.fileDtlSeq}
                    type="button"
                    className={index % 7 === 0 ? 'is-wide' : ''}
                    onClick={() => setSelected({ gallery, index })}
                  >
                    <img src={resolveGalleryImageUrl(image)} alt={image.fileNm || gallery.title} loading="lazy" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {selected && currentImage && (
        <div className="saf-gallery-lightbox" onClick={close}>
          <button type="button" className="saf-gallery-lightbox-close" aria-label="Close" onClick={close}>
            Close
          </button>
          {selectedImages.length > 1 && (
            <button
              type="button"
              className="saf-gallery-lightbox-nav is-prev"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
            >
              ‹
            </button>
          )}
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={resolveGalleryImageUrl(currentImage)} alt={currentImage.fileNm || selected.gallery.title} />
            <figcaption>
              <strong>{selected.gallery.title}</strong>
              <span>
                {selected.index + 1} / {selectedImages.length}
              </span>
            </figcaption>
          </figure>
          {selectedImages.length > 1 && (
            <button
              type="button"
              className="saf-gallery-lightbox-nav is-next"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </main>
  );
}

function GalleryFallback() {
  return (
    <section className="saf-gallery-year-section">
      <h3>SAF 2025</h3>
      <div className="saf-gallery-mosaic">
        {fallbackImages.map((image, index) => (
          <span key={assetSrc(image)} className={index === 0 ? 'is-wide' : ''}>
            <img src={assetSrc(image)} alt={`SAF gallery sample ${index + 1}`} />
          </span>
        ))}
      </div>
      <div className="saf-subpage-empty">No gallery images have been published yet.</div>
    </section>
  );
}
