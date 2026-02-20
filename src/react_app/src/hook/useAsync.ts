import {Reducer, useReducer} from 'react';


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