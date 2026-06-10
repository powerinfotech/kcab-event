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
      <body>
        <script dangerouslySetInnerHTML={{ __html: restoreFromCacheScript }} />
        <ClientProviders>
          <AppLayout>{children}</AppLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
