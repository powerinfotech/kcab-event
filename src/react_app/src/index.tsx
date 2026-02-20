import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RecoilRoot} from 'recoil';
import GlobalAxiosProvider from '@provider/GlobalAxiosProvider';
import CustomLoading from '@component/CustomLoading';
import GlobalModalProvider from '@provider/GlobalModalProvider';
import GlobalConfirmProvider from '@provider/GlobalConfirmProvider';
import GlobalAlertProvider from '@provider/GlobalAlertProvider';


const root = ReactDOM.createRoot(
  document.getElementById('__layout') as HTMLElement
);
root.render(
    <RecoilRoot>
      {/*<React.StrictMode>*/}
          <GlobalAxiosProvider>
              <CustomLoading />
              <GlobalModalProvider />
              <GlobalConfirmProvider />
              <GlobalAlertProvider />
              <App />
          </GlobalAxiosProvider>
      {/*</React.StrictMode>*/}
    </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
