'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/ko_KR';
import GlobalAxiosProvider from '@provider/GlobalAxiosProvider';
import CustomLoading from '@component/CustomLoading';
import GlobalModalProvider from '@provider/GlobalModalProvider';
import GlobalConfirmProvider from '@provider/GlobalConfirmProvider';
import GlobalAlertProvider from '@provider/GlobalAlertProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <ConfigProvider locale={locale}>
        <GlobalAxiosProvider>
          <CustomLoading />
          <GlobalModalProvider />
          <GlobalConfirmProvider />
          <GlobalAlertProvider />
          {children}
        </GlobalAxiosProvider>
      </ConfigProvider>
    </RecoilRoot>
  );
}
