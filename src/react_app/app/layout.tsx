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
function recoverSpecialRoute() {
  var path = window.location.pathname;
  var isSpecialRoute = path === '/login' || path === '/admin/login' || path === '/admin/signup';
  if (!isSpecialRoute) return;
  window.setTimeout(function () {
    var hasRouteRoot = document.querySelector('.saf-login-page, .saf-signup-page');
    var storageKey = 'kcab-route-recover:' + path;
    if (hasRouteRoot) {
      sessionStorage.removeItem(storageKey);
      return;
    }
    if (sessionStorage.getItem(storageKey) === '1') return;
    sessionStorage.setItem(storageKey, '1');
    window.location.reload();
  }, 500);
}

window.addEventListener('popstate', recoverSpecialRoute);
window.addEventListener('pageshow', recoverSpecialRoute);
window.addEventListener('load', recoverSpecialRoute);
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
