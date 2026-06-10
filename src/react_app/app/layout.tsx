import type { Metadata } from 'next';
import './globals.css';
import '@scss/Common.scss';
import ClientProviders from './_components/ClientProviders';
import AppLayout from './_components/AppLayout';

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
  if (path === '/notice' || path === '/faq' || path === '/gallery') return '.pub-layout';
  if (path === '/events') return '.official-events-page';
  if (path === '/sponsors-2025') return '.saf-sponsors-page';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
