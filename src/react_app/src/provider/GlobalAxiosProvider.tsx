/**
 * GlobalAxiosProvider - 전역 Axios 인터셉터 프로바이더
 *
 * [목적]
 * 앱 전체에서 사용하는 axios 요청/응답 인터셉터를 설정하고 자식 컴포넌트를 렌더링한다.
 * 로딩 상태 관리, 에러 코드 처리, 인증 만료 리다이렉트를 전역으로 처리한다.
 *
 * [동작 방식]
 * - 마운트 시 axios 인터셉터를 등록하고 isReadyAxios를 true로 설정한다.
 * - 인터셉터가 준비되기 전까지 children을 렌더링하지 않는다 (요청이 인터셉터 없이 날아가는 것 방지).
 * - 언마운트 시 인터셉터를 해제(eject)하여 메모리 누수를 방지한다.
 *
 * [인터셉터 처리 내용]
 * - 요청: showLoading 헤더가 true(또는 미설정)이면 로딩 큐에 URL 추가
 * - 응답 성공:
 *   - INVALID_PARAMETER_ERROR → message.error로 파라미터 오류 메시지 표시
 *   - BUSINESS_ERROR → message.error로 비즈니스 오류 메시지 표시
 *   - INVALID_SESSION_ERROR → 로그인('/login')으로 리다이렉트 (세션 만료)
 * - 응답 실패: 로딩 큐에서 URL 제거 후 에러 그대로 reject
 * - paramsSerializer: qs 라이브러리로 배열 파라미터를 brackets 형식으로 직렬화
 * - withCredentials: true (쿠키 기반 인증)
 *
 * [사용 방법]
 * @example
 * // 앱 루트에서 RecoilRoot 안에 배치 (children을 감싸야 함)
 * import GlobalAxiosProvider from '@provider/GlobalAxiosProvider';
 *
 * const App = () => (
 *   <RecoilRoot>
 *     <GlobalAxiosProvider>
 *       <RouterProvider router={router} />
 *     </GlobalAxiosProvider>
 *   </RecoilRoot>
 * );
 *
 * // 특정 요청에서 로딩 표시 끄기
 * axios.get('/api/silent', { headers: { showLoading: false } });
 */
import React, {useEffect, useState} from 'react';

import {App} from 'antd';
import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {useLoading} from '@hook/useLoading';
import qs from 'qs';
import {ErrorCode, ErrorResponse} from '@interface/common';

const AUTH_MESSAGE_STORAGE_KEY = 'kcab-auth-message';

interface GlobalAxiosInterceptorProps {
    children: React.ReactNode;
}

const GlobalAxiosProvider = (props: GlobalAxiosInterceptorProps) => {
    const {message} = App.useApp();
    const loading = useLoading();
    const [isReadyAxios, setIsReadyAxios] = useState<boolean>();

    const onRequestFulfilled = (config: InternalAxiosRequestConfig) => {
        if(config.headers?.showLoading === undefined || config.headers?.showLoading === true)
            loading.add(config?.url ? config.url : '');
        return config;
    };

    const onRequestRejected = (error:AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    };

    const onResponseFulfilled = (res: AxiosResponse): Promise<AxiosResponse> => {
        res.config.url && loading.remove(res.config.url);
        if (res.data.code === ErrorCode.INVALID_PARAMETER_ERROR) {
            message.error(res.data.message);
        }

        if (res.data.code === ErrorCode.BUSINESS_ERROR) {
            message.error(res.data.message);
        }

        if (res.data.code === ErrorCode.INVALID_SESSION_ERROR) {
            try {
                sessionStorage.setItem(AUTH_MESSAGE_STORAGE_KEY, '권한이 없습니다.');
                sessionStorage.removeItem('tabList');
                sessionStorage.removeItem('activeTabKey');
            } catch (e) {
                // 프라이빗 브라우징 등에서 sessionStorage 접근 실패 가능
            }
            if (location.pathname !== '/login') {
                location.replace('/login');
            }
        }

        return Promise.resolve({ ...res, data: res.data || {} });
    };

    const onResponseRejected = (error: AxiosError<ErrorResponse>) => {
        error?.config?.url && loading.remove(error.config.url);

        return new Promise((_, reject) => {
            reject(error);
        });
    };


    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios.defaults.timeout = 30000;
        axios.defaults.transitional = {
            clarifyTimeoutError: true,
            forcedJSONParsing: true,
            silentJSONParsing: true,
        };
        axios.defaults.paramsSerializer = params => {
            return qs.stringify(params, {arrayFormat: 'brackets'});
        };

        const regInterceptors = axios.interceptors.request.use(onRequestFulfilled, onRequestRejected);
        const resInterceptors = axios.interceptors.response.use(onResponseFulfilled, onResponseRejected);
        setIsReadyAxios(true);
        return () => {
            axios.interceptors.request.eject(regInterceptors);
            axios.interceptors.response.eject(resInterceptors);
            loading.clear();
        };
    }, []);

    return isReadyAxios ? <>{props.children}</> : null;
};

export default GlobalAxiosProvider;
