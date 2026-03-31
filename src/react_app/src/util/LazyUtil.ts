/**
 * LazyUtil - 컴포넌트 지연 로딩(Code Splitting) 유틸
 *
 * [목적]
 * React.lazy()로 컴포넌트를 동적 import할 때, 네트워크 오류나 캐시 문제로
 * 청크 로딩이 실패하는 경우를 자동 재시도(페이지 새로고침)로 복구한다.
 *
 * [동작 방식]
 * 1. 컴포넌트 import 성공 → 정상 반환, 새로고침 플래그 초기화
 * 2. 첫 번째 실패 → localStorage에 플래그 저장 후 페이지 새로고침 (자동 재시도)
 * 3. 새로고침 후에도 실패 → 에러를 throw하여 ErrorBoundary에서 처리
 *
 * [사용 방법]
 * @example
 * // 일반 React.lazy() 대신 retryLazy() 사용
 * const MyPage = retryLazy(() => import('@page/MyPage'));
 *
 * // JSX에서 Suspense와 함께 사용
 * <Suspense fallback={<Loading />}>
 *   <MyPage />
 * </Suspense>
 */
import {lazy} from 'react';

/**
 * 청크 로딩 실패 시 1회 자동 새로고침 재시도를 포함한 lazy import 래퍼
 *
 * @param componentImport - 동적 import 함수 (예: () => import('./MyComponent'))
 * @returns React.lazy로 감싼 컴포넌트
 *
 * @example
 * const UserManagement = retryLazy(() => import('@page/master/UserManagement'));
 */
export const retryLazy = (componentImport:any) =>
    lazy(async() => {
        // 이전에 새로고침을 시도했는지 확인
        const pageAlreadyRefreshed = JSON.parse(window.localStorage.getItem('pageRefreshed') || 'false');
        try {
            const component = await componentImport();
            // 성공 시 새로고침 플래그 초기화
            window.localStorage.setItem('pageRefreshed', 'false');
            return component;
        } catch (error) {
            if(!pageAlreadyRefreshed) {
                // 첫 번째 실패: 새로고침 플래그 설정 후 페이지 리로드
                window.localStorage.setItem('pageRefreshed', 'true');
                return window.location.reload();
             }
            // 두 번째 실패: 복구 불가, 에러 전파
            throw error;
        }
    });
