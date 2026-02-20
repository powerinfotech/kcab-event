import React, {useEffect, useState} from 'react';

import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {useLoading} from '@hook/useLoading';
import qs from 'qs';
import {ErrorCode, ErrorResponse} from '@interface/common';
import {message} from 'antd';

interface GlobalAxiosInterceptorProps {
    children: React.ReactNode;
}

const GlobalAxiosProvider = (props: GlobalAxiosInterceptorProps) => {
    const loading = useLoading();
    const [isReadyAxios, setIsReadyAxios] = useState<boolean>();

    const onRequestFulfilled = (config: InternalAxiosRequestConfig) => {
        if(config.headers?.showLoading === undefined || config.headers?.showLoading === true)
            loading.add(config?.url ? config.url : '');
        const { headers } = config.headers;
        return { ...config, headers: headers, data: config?.data };
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
            location.replace('/');
        }

        return Promise.resolve({ ...res, data: res.data || {} });
    };

    const onResponseRejected = (error: AxiosError<ErrorResponse>) => {
        error?.config?.url && loading.remove(error.config.url);

        return new Promise((_, reject) => {
            reject(error);
        });
    };


    const retry = (errorConfig: InternalAxiosRequestConfig) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(axios.request(errorConfig));
            }, 1000);
        });
    };

    useEffect(() => {
        // axios.defaults.timeout = 15000;
        axios.defaults.withCredentials = true;
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
        };
    }, []);

    return isReadyAxios ? <>{props.children}</> : <></>;
};

export default GlobalAxiosProvider;