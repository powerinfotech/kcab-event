import React, { useEffect, useMemo, useState } from 'react';
import { callGetPublicGalleryList, resolveGalleryImageUrl } from '@api/gallery/GalleryApi';
import { GalleryImage, GalleryListItem } from '@interface/admin/Gallery';
import PublicFooter from './components/PublicFooter';
import PublicHeader from './components/PublicHeader';

interface SelectedImage {
  gallery: GalleryListItem;
  image: GalleryImage;
}

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

  const handleNavigate = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="pub-layout">
      <PublicHeader currentUrl="/gallery" onNavigate={handleNavigate} />
      <main className="pub-page-content pub-gallery-page">
        <section
          className="pub-section section-hero size-small"
          style={{ background: 'linear-gradient(135deg, #0f1b3d 0%, #294DC7 100%)' }}
        >
          <div className="hero-content">
            <h2 className="hero-title">Gallery</h2>
            <p className="hero-subtitle">Scenes from the Seoul ADR Festival</p>
          </div>
        </section>

        <section className="pub-section section-text size-medium">
          <div className="pub-section-inner">
            {years.map((year) => (
              <section key={year} className="pub-gallery-year-section">
                <h3 className="pub-gallery-year">SAF {year}</h3>
                {grouped[year].map((gallery) => (
                  <div key={gallery.gallerySeq} className="pub-gallery-album">
                    <div className="pub-gallery-album-head">
                      <h4>{gallery.title}</h4>
                      {gallery.description && <p>{gallery.description}</p>}
                    </div>
                    <div className="pub-gallery-grid">
                      {(gallery.images ?? []).map((image) => (
                        <button
                          key={image.fileDtlSeq}
                          type="button"
                          className="pub-gallery-photo"
                          onClick={() => setSelectedImage({ gallery, image })}
                        >
                          <img src={resolveGalleryImageUrl(image)} alt={image.fileNm || gallery.title} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
            {!years.length && (
              <div className="pub-gallery-empty">
                {loading ? 'Loading gallery...' : 'No gallery images have been published yet.'}
              </div>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />

      {selectedImage && (
        <div className="pub-gallery-lightbox" onClick={() => setSelectedImage(null)}>
          <button type="button" className="pub-gallery-lightbox-close" onClick={() => setSelectedImage(null)}>
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
    </div>
  );
}
