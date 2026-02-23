import type { Metadata } from 'next';
import './globals.css';
import '@scss/Common.scss';
import ClientProviders from './ClientProviders';
import AppLayout from './AppLayout';

export const metadata: Metadata = {
  title: '국가재난안전포탈 관리자',
  description: '국가재난안전포탈 관리자',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ClientProviders>
          <AppLayout>{children}</AppLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
