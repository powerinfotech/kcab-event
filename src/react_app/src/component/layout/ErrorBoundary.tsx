'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - React 런타임 에러를 잡아 폴백 UI를 표시하는 컴포넌트
 *
 * 자식 컴포넌트 트리에서 발생하는 렌더링 에러를 캐치하여
 * 빈 화면 대신 에러 메시지와 새로고침 버튼을 표시한다.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="error"
                    title="오류가 발생했습니다"
                    subTitle="페이지에서 예기치 않은 오류가 발생했습니다. 새로고침을 시도해 주세요."
                    extra={
                        <Button type="primary" onClick={this.handleReload}>
                            새로고침
                        </Button>
                    }
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
