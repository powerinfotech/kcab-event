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
            colorPrimary: '#FFDD00',
            borderRadius: 4,
            colorBorder: '#d9d9d9',
            colorText: '#333',
            colorTextSecondary: '#666',
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
