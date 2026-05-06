import type { Metadata } from 'next';
import './globals.css';
import '@scss/Common.scss';
import ClientProviders from './_components/ClientProviders';
import AppLayout from './_components/AppLayout';

export const metadata: Metadata = {
  title: 'KCAB INTERNATIONAL EVENT',
  description: 'KCAB INTERNATIONAL EVENT',
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
