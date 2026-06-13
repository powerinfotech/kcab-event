import type { Metadata } from 'next';
import './globals.css';
import '@scss/Common.scss';
import ClientProviders from './_components/ClientProviders';
import AppLayout from './_components/AppLayout';
import HeroSeoulImage from '@image/saf-renewal/hero-seoul-figma.jpg';

export const metadata: Metadata = {
  title: 'KCAB INTERNATIONAL EVENT',
  description: 'KCAB INTERNATIONAL EVENT',
};

const restoreFromCacheScript = `
function getExpectedRouteRootSelector(path) {
  if (path === '/') return '.saf-renewal-home';
  if (path === '/login' || path === '/admin/login') return '.saf-login-page';
  if (path === '/admin/signup') return '.saf-signup-page';
  if (path.indexOf('/event/') === 0) return '.pub-event-renewal';
  if (path === '/faq') return '.pub-layout';
  if (
    path === '/notice' ||
    path.indexOf('/notice/') === 0 ||
    path === '/gallery' ||
    path === '/calendar' ||
    path === '/visit-seoul' ||
    path === '/contact' ||
    path === '/side-event' ||
    path === '/sponsorship'
  ) return '.saf-renewal-home';
  if (path === '/events') return '.official-events-page';
  if (path === '/sponsors') return '.saf-sponsors-page';
  if (path === '/my-events') return '.saf-myevents-page';
  if (path === '/organizer') return '.organizer-page';
  if (path === '/media-partners') return '.media-partners-page';
  if (path.indexOf('/past-editions') === 0) return '.saf-past-home, .saf-renewal-home';
  return '';
}

function recoverRouteFromBlankRoot() {
  var path = window.location.pathname;
  var expectedRootSelector = getExpectedRouteRootSelector(path);
  if (!expectedRootSelector) return;

  window.setTimeout(function () {
    var hasRouteRoot = document.querySelector(expectedRootSelector);
    var appRoot = document.querySelector('.ant-app');
    var isBlankAppRoot = appRoot && appRoot.innerHTML.trim().length === 0;
    var storageKey = 'kcab-route-recover:' + path;
    if (hasRouteRoot && !isBlankAppRoot) {
      sessionStorage.removeItem(storageKey);
      return;
    }

    if (sessionStorage.getItem(storageKey) === '1') return;
    sessionStorage.setItem(storageKey, '1');
    window.location.reload();
  }, 500);
}

window.addEventListener('popstate', recoverRouteFromBlankRoot);
window.addEventListener('pageshow', recoverRouteFromBlankRoot);
window.addEventListener('load', recoverRouteFromBlankRoot);
window.addEventListener('unload', function () {});
`;

// 홈('/')에서만 hero 이미지를 HTML 파싱 중(JS 번들 실행 전) 고우선으로 미리 가져온다.
// background-image는 첫 페인트 이후에야 요청되어 hero가 잠깐 비어 보이는 깜빡임이 생기는데,
// 같은 URL을 preload 해두면 hero가 그려질 때 이미지가 준비되어 있어 바로 표시된다.
const preloadHomeHeroScript = `
(function () {
  if (window.location.pathname !== '/') return;
  var link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '${HeroSeoulImage.src}';
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadHomeHeroScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300..900;1,300..900&family=Noto+Sans+KR:wght@100..900&family=Onest:wght@100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: restoreFromCacheScript }} />
        <ClientProviders>
          <AppLayout>{children}</AppLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
