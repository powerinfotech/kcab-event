/**
 * useCmCode - 공통코드 조회 및 캐싱 훅
 *
 * [목적]
 * 셀렉트박스, 라디오 등에서 사용하는 공통코드(그룹코드별 코드 목록)를
 * API 조회 후 클라이언트 캐시(Map)에 저장하여 재요청을 방지한다.
 * 동일 그룹코드는 한 번만 API 호출하고, 이후에는 캐시에서 즉시 반환.
 *
 * [캐시 동작]
 * - 첫 조회: API 호출 → 결과를 cmCodeCache(Map)에 저장 → 컴포넌트에 반환
 * - 재조회: 캐시에서 즉시 반환 (API 호출 안 함)
 * - 캐시 초기화: bustCmCodeCache() 호출 시 전체 캐시 제거
 *
 * [사용 방법]
 * @example
 * // 1. 필요한 그룹코드 배열을 전달
 * const cmCode = useCmCode(['STATUS_CD', 'USER_TYPE_CD', 'USE_YN']);
 *
 * // 2. 로딩 중에는 빈 객체 {} 반환, 로딩 완료 후 코드맵 반환
 * // cmCode = {
 * //   STATUS_CD: { '01': '활성', '02': '비활성' },
 * //   USER_TYPE_CD: { 'A': '관리자', 'U': '일반' },
 * //   USE_YN: { 'Y': '사용', 'N': '미사용' }
 * // }
 *
 * // 3. CustomSelect에서 사용
 * <CustomSelect options={
 *   Object.entries(cmCode['STATUS_CD'] ?? {}).map(([value, label]) => ({ value, label }))
 * } />
 *
 * // 4. 공통코드가 변경된 경우 캐시 초기화
 * import { bustCmCodeCache } from '@hook/useCmCode';
 * bustCmCodeCache();  // 캐시 전체 제거 → 다음 렌더 시 재조회
 */
import {getViewCmCode} from '@api/CommonApi';
import {CommonCodeMap} from '@interface/common';
import {useEffect, useMemo, useState} from 'react';

/** 클라이언트 공통코드 캐시 (그룹코드 → { 코드값: 코드명 }) */
const cmCodeCache = new Map<string, {[key: string]: string}>();

/** 공통코드 캐시 전체 초기화 (코드가 변경된 경우 호출) */
export function bustCmCodeCache() {
    cmCodeCache.clear();
}

/**
 * 공통코드 조회 훅
 *
 * @param cmGroupCodeList - 조회할 그룹코드 배열 (예: ['STATUS_CD', 'USE_YN'])
 * @returns CommonCodeMap - { 그룹코드: { 코드값: 코드명 } } (로딩 중이면 빈 객체)
 */
export const useCmCode = (cmGroupCodeList: string[]): CommonCodeMap => {
    // 그룹코드 배열을 문자열 키로 변환 (메모이제이션 의존성용)
    const listKey = cmGroupCodeList.join(',');
    // 배열 참조 안정화 (listKey가 같으면 동일 배열 유지)
    const stableList = useMemo(() => [...cmGroupCodeList], [listKey]);

    // 초기 상태: 모든 코드가 캐시에 있으면 즉시 반환, 아니면 null(로딩 중)
    const [data, setData] = useState<CommonCodeMap | null>(() => {
        const allCached = stableList.every(code => cmCodeCache.has(code));
        if (allCached && stableList.length > 0) {
            const result: CommonCodeMap = {};
            stableList.forEach(code => {
                result[code] = cmCodeCache.get(code)!;
            });
            return result;
        }
        return null;
    });

    useEffect(() => {
        // 캐시에 없는 코드만 추출
        const missingCodes = stableList.filter(code => !cmCodeCache.has(code));

        // 모두 캐시에 있으면 API 호출 없이 캐시에서 반환
        if (missingCodes.length === 0 && stableList.length > 0) {
            const result: CommonCodeMap = {};
            stableList.forEach(code => {
                result[code] = cmCodeCache.get(code)!;
            });
            setData(result);
            return;
        }

        // 빈 배열이면 빈 객체 반환
        if (stableList.length === 0) {
            setData({});
            return;
        }

        // 캐시에 없는 코드만 API 조회
        let cancelled = false;
        getViewCmCode({cmGroupCodeList: missingCodes})
            .then((result) => {
                if (!cancelled) {
                    // 조회 결과를 캐시에 저장
                    Object.entries(result).forEach(([key, value]) => {
                        cmCodeCache.set(key, value);
                    });
                    // 요청한 모든 코드를 캐시에서 병합하여 반환
                    const merged: CommonCodeMap = {};
                    stableList.forEach(code => {
                        merged[code] = cmCodeCache.get(code) ?? {};
                    });
                    setData(merged);
                }
            })
            .catch(() => {
                if (!cancelled) setData({});
            });
        // 컴포넌트 언마운트 시 상태 업데이트 방지
        return () => {
            cancelled = true;
        };
    }, [listKey]);

    // 로딩 중(data===null)이면 빈 객체 반환 (컴포넌트에서 안전하게 사용 가능)
    if (data === null) {
        return {};
    }
    return data;
};
