'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PopupItem } from '@interface/popup/PopupManagement';

interface MainPopupWindowLauncherProps {
  popups: PopupItem[];
  onClose?: (popup: PopupItem) => void;
  onDismissToday?: (popup: PopupItem) => void;
  showDismissToday?: boolean;
}

const POPUP_WIDTH = 560;
const POPUP_HEIGHT = 640;
const POPUP_OFFSET = 36;

function getPopupKey(popup: PopupItem, index: number): string {
  return String(popup.popupSeq ?? `new-${index}`);
}

function getWindowName(key: string): string {
  return `kcab_main_popup_${key}`.replace(/[^\w-]/g, '_');
}

function getWindowFeatures(index: number): string {
  const screenLeft = window.screenX ?? window.screenLeft ?? 0;
  const screenTop = window.screenY ?? window.screenTop ?? 0;
  const left = Math.max(0, screenLeft + 80 + (index * POPUP_OFFSET));
  const top = Math.max(0, screenTop + 80 + (index * POPUP_OFFSET));
  return [
    'popup=yes',
    `width=${POPUP_WIDTH}`,
    `height=${POPUP_HEIGHT}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes',
  ].join(',');
}

function writePopupShell(popupWindow: Window, popup: PopupItem, showDismissToday: boolean) {
  const doc = popupWindow.document;
  doc.open();
  doc.write(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title></title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; background: #f6f7fb; color: #172033; font-family: Arial, "Noto Sans KR", sans-serif; }
    body { display: flex; flex-direction: column; }
    .popup-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; background: #1f5b95; color: #fff; }
    .popup-title { margin: 0; font-size: 18px; font-weight: 700; line-height: 1.35; }
    .popup-x { width: 34px; height: 34px; border: 0; border-radius: 50%; background: rgba(255,255,255,.14); color: #fff; font-size: 24px; line-height: 1; cursor: pointer; }
    .popup-x:hover { background: rgba(255,255,255,.24); }
    .popup-body { flex: 1 1 auto; padding: 24px; overflow: auto; background: #fff; }
    .popup-content { line-height: 1.65; font-size: 15px; color: #1f2937; overflow-wrap: anywhere; }
    .popup-content img { max-width: 100%; height: auto; }
    .popup-content table { width: 100%; border-collapse: collapse; }
    .popup-content td, .popup-content th { border: 1px solid #d6dce8; padding: 8px; }
    .popup-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px; border-top: 1px solid #dfe4ee; background: #f8fafc; }
    .popup-btn { min-height: 36px; padding: 0 14px; border: 1px solid #c8d1df; border-radius: 6px; background: #fff; color: #1f2937; font-weight: 600; cursor: pointer; }
    .popup-btn:hover { border-color: #1f5b95; color: #1f5b95; }
    .popup-btn.is-primary { border-color: #1f5b95; background: #1f5b95; color: #fff; }
  </style>
</head>
<body>
  <header class="popup-header">
    <h1 class="popup-title" id="popup-title"></h1>
    <button type="button" class="popup-x" id="popup-close-x" aria-label="Close">×</button>
  </header>
  <main class="popup-body">
    <div class="popup-content" id="popup-content"></div>
  </main>
  <footer class="popup-footer">
    ${showDismissToday ? '<button type="button" class="popup-btn" id="popup-dismiss-today">오늘 보지 않기</button>' : '<span></span>'}
    <button type="button" class="popup-btn is-primary" id="popup-close">닫기</button>
  </footer>
</body>
</html>`);
  doc.close();
  doc.title = popup.title || 'Popup';
  const titleEl = doc.getElementById('popup-title');
  const contentEl = doc.getElementById('popup-content');
  if (titleEl) titleEl.textContent = popup.title || 'Popup';
  if (contentEl) contentEl.innerHTML = popup.content || '';
}

function getFallbackWindowStyle(index: number): CSSProperties {
  const offset = index * POPUP_OFFSET;
  return {
    position: 'fixed',
    left: `max(12px, min(calc(100vw - ${POPUP_WIDTH + 24}px), ${80 + offset}px))`,
    top: `max(12px, min(calc(100vh - ${POPUP_HEIGHT + 24}px), ${80 + offset}px))`,
    zIndex: 9000 + index,
    width: POPUP_WIDTH,
    maxWidth: 'calc(100vw - 24px)',
    height: POPUP_HEIGHT,
    maxHeight: 'calc(100vh - 24px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #cbd5e1',
    boxShadow: '0 22px 60px rgba(15, 23, 42, .28)',
  };
}

const fallbackHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '18px 22px',
  background: '#1f5b95',
  color: '#fff',
};

const fallbackBodyStyle: CSSProperties = {
  flex: '1 1 auto',
  padding: 24,
  overflow: 'auto',
  background: '#fff',
  lineHeight: 1.65,
  fontSize: 15,
  color: '#1f2937',
  overflowWrap: 'anywhere',
};

const fallbackFooterStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '14px 16px',
  borderTop: '1px solid #dfe4ee',
  background: '#f8fafc',
};

const fallbackButtonStyle: CSSProperties = {
  minHeight: 36,
  padding: '0 14px',
  border: '1px solid #c8d1df',
  borderRadius: 6,
  background: '#fff',
  color: '#1f2937',
  fontWeight: 600,
  cursor: 'pointer',
};

const fallbackPrimaryButtonStyle: CSSProperties = {
  ...fallbackButtonStyle,
  borderColor: '#1f5b95',
  background: '#1f5b95',
  color: '#fff',
};

export default function MainPopupWindowLauncher({
  popups,
  onClose,
  onDismissToday,
  showDismissToday = true,
}: MainPopupWindowLauncherProps) {
  const openedKeysRef = useRef<Set<string>>(new Set());
  const [fallbackPopups, setFallbackPopups] = useState<PopupItem[]>([]);

  const removeFallbackPopup = (popup: PopupItem, index: number) => {
    const key = getPopupKey(popup, index);
    setFallbackPopups((prev) => prev.filter((item, itemIndex) => getPopupKey(item, itemIndex) !== key));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    popups.forEach((popup, index) => {
      const key = getPopupKey(popup, index);
      if (openedKeysRef.current.has(key)) return;

      const popupWindow = window.open('', getWindowName(key), getWindowFeatures(index));
      if (!popupWindow) {
        openedKeysRef.current.add(key);
        setFallbackPopups((prev) => {
          if (prev.some((item, itemIndex) => getPopupKey(item, itemIndex) === key)) return prev;
          return [...prev, popup];
        });
        return;
      }

      openedKeysRef.current.add(key);
      writePopupShell(popupWindow, popup, showDismissToday);
      popupWindow.focus();

      const closeWindow = () => {
        onClose?.(popup);
        popupWindow.close();
      };
      const dismissToday = () => {
        onDismissToday?.(popup);
        popupWindow.close();
      };

      popupWindow.document.getElementById('popup-close-x')?.addEventListener('click', closeWindow);
      popupWindow.document.getElementById('popup-close')?.addEventListener('click', closeWindow);
      if (showDismissToday) {
        popupWindow.document.getElementById('popup-dismiss-today')?.addEventListener('click', dismissToday);
      }
    });
  }, [popups, onClose, onDismissToday, showDismissToday]);

  if (!fallbackPopups.length) return null;

  return (
    <>
      {fallbackPopups.map((popup, index) => (
        <div key={getPopupKey(popup, index)} style={getFallbackWindowStyle(index)} role="dialog" aria-modal="false">
          <header style={fallbackHeaderStyle}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.35 }}>
              {popup.title || 'Popup'}
            </h1>
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => {
                removeFallbackPopup(popup, index);
                onClose?.(popup);
              }}
              style={{
                width: 34,
                height: 34,
                border: 0,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.14)',
                color: '#fff',
                fontSize: 24,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </header>
          <main style={fallbackBodyStyle}>
            <div dangerouslySetInnerHTML={{ __html: popup.content || '' }} />
          </main>
          <footer style={fallbackFooterStyle}>
            {showDismissToday ? (
              <button
                type="button"
                style={fallbackButtonStyle}
                onClick={() => {
                  removeFallbackPopup(popup, index);
                  onDismissToday?.(popup);
                }}
              >
                오늘 보지 않기
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              style={fallbackPrimaryButtonStyle}
              onClick={() => {
                removeFallbackPopup(popup, index);
                onClose?.(popup);
              }}
            >
              닫기
            </button>
          </footer>
        </div>
      ))}
    </>
  );
}
