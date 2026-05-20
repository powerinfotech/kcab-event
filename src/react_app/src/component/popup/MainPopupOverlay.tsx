'use client';

import React, { useEffect, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { PopupItem } from '@interface/popup/PopupManagement';

interface MainPopupOverlayProps {
  popups: PopupItem[];
  previewMode?: boolean;
  /** Called when the user closes the current popup for this session. */
  onClose?: (popup: PopupItem) => void;
  /** Called when the user picks "Don't show today" on the current popup. */
  onDismissToday?: (popup: PopupItem) => void;
}

/**
 * Slideshow-style popup overlay shown on the public main page (and reused by the admin preview).
 * Only one popup card is visible at a time; users navigate between popups via arrows.
 * Visual chrome only — fetching, cookie reads, and lifecycle live in the caller.
 */
export default function MainPopupOverlay({
  popups,
  previewMode = false,
  onClose,
  onDismissToday,
}: MainPopupOverlayProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (currentIdx >= popups.length && popups.length > 0) {
      setCurrentIdx(popups.length - 1);
    } else if (popups.length === 0 && currentIdx !== 0) {
      setCurrentIdx(0);
    }
  }, [popups.length, currentIdx]);

  if (!popups.length) return null;

  const safeIdx = Math.min(currentIdx, popups.length - 1);
  const current = popups[safeIdx];
  const total = popups.length;

  const goPrev = () => setCurrentIdx((i) => (i - 1 + total) % total);
  const goNext = () => setCurrentIdx((i) => (i + 1) % total);

  return (
    <div className="main-popup-overlay">
      <div
        className="main-popup-card"
        role="dialog"
        aria-label={current.title}
      >
        <div className="main-popup-header">
          <strong>{current.title}</strong>
          <button
            type="button"
            className="main-popup-close-icon"
            aria-label="Close popup"
            onClick={() => onClose?.(current)}
          >
            ×
          </button>
        </div>
        <div className="main-popup-body">
          {current.content && (
            <div
              className="main-popup-content"
              dangerouslySetInnerHTML={{ __html: current.content }}
            />
          )}
        </div>
        <div className="main-popup-footer">
          <button
            type="button"
            className="main-popup-dismiss"
            onClick={() => onDismissToday?.(current)}
            disabled={previewMode}
            title={previewMode ? 'Disabled in preview' : 'Hide this popup for the rest of today'}
          >
            오늘 보지 않기
          </button>
          {total > 1 && (
            <div className="main-popup-nav">
              <button
                type="button"
                className="main-popup-nav-arrow"
                aria-label="Previous popup"
                onClick={goPrev}
              >
                <LeftOutlined />
              </button>
              <span className="main-popup-nav-counter">{safeIdx + 1} / {total}</span>
              <button
                type="button"
                className="main-popup-nav-arrow"
                aria-label="Next popup"
                onClick={goNext}
              >
                <RightOutlined />
              </button>
            </div>
          )}
          <button
            type="button"
            className="main-popup-close"
            onClick={() => onClose?.(current)}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
