'use client';

import React from 'react';
import { ConfigProvider, App } from 'antd';
import locale from 'antd/locale/ko_KR';
import GlobalAxiosProvider from '@provider/GlobalAxiosProvider';
import ErrorBoundary from '@component/layout/ErrorBoundary';
import CustomLoading from '@component/layout/CustomLoading';
import GlobalModalProvider from '@provider/GlobalModalProvider';
import GlobalConfirmProvider from '@provider/GlobalConfirmProvider';
import GlobalAlertProvider from '@provider/GlobalAlertProvider';
import AntdAppBridge from '@provider/AntdAppBridge';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={locale} theme={{
          token: {
            // KCAB International — saf-renewal palette (lavender)
            colorPrimary: '#b09cf2',          // var(--saf-purple) — softer lavender
            colorInfo: '#0d56bd',             // var(--saf-blue)
            colorSuccess: '#16a34a',
            colorWarning: '#f59e0b',
            colorError: '#dc2626',
            colorLink: '#9586f2',             // var(--saf-purple-2)
            borderRadius: 8,
            colorBorder: '#e7e3f5',           // var(--saf-border)
            colorText: '#151340',             // var(--saf-ink)
            colorTextSecondary: '#6b6788',    // var(--saf-mute)
            fontFamily: "'Onest', 'Open Sans', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
          },
          components: {
            Button: {
              colorPrimaryHover: '#9586f2',
              colorPrimaryActive: '#8474f0',
              primaryShadow: '0 4px 10px rgba(176, 156, 242, 0.16)',
            },
            Pagination: {
              colorPrimary: '#b09cf2',
              colorPrimaryHover: '#9586f2',
            },
            Tag: {
              defaultBg: '#f0edff',
              defaultColor: '#9586f2',
            },
          },
        }}>
      <App>
        <AntdAppBridge />
        <ErrorBoundary>
          <GlobalAxiosProvider>
            <CustomLoading />
            <GlobalModalProvider />
            <GlobalConfirmProvider />
            <GlobalAlertProvider />
            {children}
          </GlobalAxiosProvider>
        </ErrorBoundary>
      </App>
    </ConfigProvider>
  );
}
