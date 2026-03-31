/**
 * useAsync - 비동기 API 호출 상태 관리 훅
 *
 * [목적]
 * API 호출 시 반복되는 loading / data / error 상태 관리를
 * useReducer 기반으로 한 번에 처리한다.
 * 컴포넌트에서 fetch()를 호출하면 자동으로 상태가 전이된다.
 *
 * [상태 흐름]
 * 초기 → fetch() 호출 → LOADING → 성공 시 SUCCESS / 실패 시 ERROR
 *
 * [사용 방법]
 * @example
 * // 1. API 함수와 파라미터를 전달하여 훅 생성
 * const { data, loading, error, fetch } = useAsync(callGetUserList, { userName: '홍길동' });
 *
 * // 2. 조회 버튼 클릭 시 fetch 호출
 * <CustomButton onClick={fetch}>조회</CustomButton>
 *
 * // 3. 상태에 따라 UI 렌더링
 * {loading && <Spin />}
 * {error && <Alert message="조회 실패" />}
 * {data && <CustomTable dataSource={data.item} />}
 */
import {Reducer, useReducer} from 'react';

/**
 * 비동기 상태 리듀서
 * - LOADING: API 호출 시작 (data 초기화, loading true)
 * - SUCCESS: API 호출 성공 (data 저장, loading false)
 * - ERROR:   API 호출 실패 (error 저장, loading false)
 */
const reducer: Reducer<any, any> = (state, action) => {
    switch (action.type) {
        case 'LOADING':
            return { data: null, loading: true, error: null };
        case 'SUCCESS':
            return { data: action.data, loading: false, error: null };
        case 'ERROR':
            return { data: null, loading: false, error: action.error };
        default:
            return state;
    }
};

/**
 * 비동기 API 호출의 loading / data / error 상태를 자동 관리하는 훅
 *
 * @param callback - 실행할 비동기 함수 (예: API 호출 함수)
 * @param param    - callback에 전달할 파라미터
 * @returns { data, loading, error, fetch }
 *   - data:    API 응답 데이터 (성공 시)
 *   - loading: 로딩 중 여부
 *   - error:   에러 객체 (실패 시)
 *   - fetch:   API 호출 실행 함수 (버튼 클릭 등에서 호출)
 *
 * @example
 * const { data, loading, error, fetch } = useAsync(getUserLoginInfo, undefined);
 *
 * useEffect(() => {
 *   fetch(); // 컴포넌트 마운트 시 자동 조회
 * }, []);
 */
export const useAsync = <T, R>(
    callback: (param: T) => Promise<R>,
    param: T
) => {
    const defaultState = { data: null, loading: false, error: null };
    const [state, action] = useReducer(reducer, defaultState);

    const fetch = async () => {
        await callback(param)
            .then((res) => action({ type: 'SUCCESS', data: res }))
            .catch((err) => {
                action({ type: 'ERROR', error: err });
            });
    };

    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        fetch,
    };
};