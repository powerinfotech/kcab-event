import React, { useEffect, useMemo, useState } from 'react';
import { callGetPublicGalleryList, resolveGalleryImageUrl } from '@api/gallery/GalleryApi';
import { GalleryImage, GalleryListItem } from '@interface/admin/Gallery';
import PublicSubPageHero from './components/PublicSubPageHero';
import HeroImage from '../../assets/images/saf-renewal/0612/hero-gallery.png';
import FallbackOne from '../../assets/images/saf-renewal/gallery-conference.jpg';
import FallbackTwo from '../../assets/images/saf-renewal/gallery-reception.jpg';
import FallbackThree from '../../assets/images/saf-renewal/gallery-audience.jpg';

interface SelectedImage {
  gallery: GalleryListItem;
  image: GalleryImage;
}

const fallbackImages = [FallbackOne, FallbackTwo, FallbackThree];
const assetSrc = (asset: string | { src?: string }) => (typeof asset === 'string' ? asset : asset.src ?? '');

export default function PublicGallery() {
  const [items, setItems] = useState<GalleryListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  useEffect(() => {
    setLoading(true);
    callGetPublicGalleryList()
      .then((res) => setItems(res?.item ?? []))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    return items.reduce<Record<number, GalleryListItem[]>>((acc, item) => {
      if (!item.images?.length) return acc;
      if (!acc[item.galleryYear]) acc[item.galleryYear] = [];
      acc[item.galleryYear].push(item);
      return acc;
    }, {});
  }, [items]);

  const years = useMemo(
    () => Object.keys(grouped).map(Number).sort((a, b) => b - a),
    [grouped],
  );

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
          {!loading && !years.length && <GalleryFallback />}

          {years.map((year) => (
            <section key={year} className="saf-gallery-year-section">
              <h3>SAF {year}</h3>
              {grouped[year].map((gallery) => (
                <article key={gallery.gallerySeq} className="saf-gallery-album">
                  {gallery.description && <p>{gallery.description}</p>}
                  <div className="saf-gallery-mosaic">
                    {(gallery.images ?? []).map((image, index) => (
                      <button
                        key={image.fileDtlSeq}
                        type="button"
                        className={index % 7 === 0 ? 'is-wide' : ''}
                        onClick={() => setSelectedImage({ gallery, image })}
                      >
                        <img src={resolveGalleryImageUrl(image)} alt={image.fileNm || gallery.title} />
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div className="saf-gallery-lightbox" onClick={() => setSelectedImage(null)}>
          <button type="button" className="saf-gallery-lightbox-close" onClick={() => setSelectedImage(null)}>
            Close
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img
              src={resolveGalleryImageUrl(selectedImage.image)}
              alt={selectedImage.image.fileNm || selectedImage.gallery.title}
            />
            <figcaption>
              <strong>{selectedImage.gallery.title}</strong>
              <span>{selectedImage.image.fileNm}</span>
            </figcaption>
          </figure>
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
