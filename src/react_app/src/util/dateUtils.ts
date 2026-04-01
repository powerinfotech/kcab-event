/**
 * dateUtils - 날짜 조회 / 계산 / 검증 유틸
 *
 * [목적]
 * 오늘 일자, 이번 달/년도 조회, 마지막 일자 계산, 날짜 가감,
 * 두 날짜 간 차이 계산, 시작-종료일 유효성 검증 등
 * 프로젝트 전반에서 반복 사용되는 날짜 로직을 통합 제공한다. dayjs 기반.
 *
 * [사용 방법]
 * @example
 * import {
 *   getToday, getThisMonth, getThisYear,
 *   getLastDay, getLastDate,
 *   getStartOfMonth, getEndOfMonth,
 *   addDays, addMonths, addYears,
 *   diffDays, diffMonths, diffYears,
 *   isToday, isValidDateRange
 * } from '@util/dateUtils';
 *
 * // 현재 날짜 조회
 * getToday()                              → '2026-03-31'
 * getThisMonth()                          → '2026-03'
 * getThisYear()                           → '2026'
 *
 * // 월 시작/종료일
 * getStartOfMonth('2026-03-15')           → '2026-03-01'
 * getEndOfMonth('2026-03-15')             → '2026-03-31'
 *
 * // 마지막 일자
 * getLastDay(2026, 2)                     → 28
 * getLastDate(2026, 3)                    → '2026-03-31'
 *
 * // 날짜 가감
 * addDays('2026-03-31', 7)               → '2026-04-07'
 * addMonths('2026-03-31', -2)            → '2026-01-31'
 * addYears('2026-03-31', 1)              → '2027-03-31'
 *
 * // 차이 계산
 * diffDays('2026-03-01', '2026-03-31')   → 30
 * diffMonths('2026-01-15', '2026-04-15') → 3
 * diffYears('2020-01-01', '2026-03-31')  → 6
 *
 * // 오늘 여부 확인
 * isToday('2026-03-31')                  → true/false (실행 일자 기준)
 *
 * // 시작-종료일 유효성 검증
 * isValidDateRange('2026-03-01', '2026-03-31') → true
 * isValidDateRange('2026-04-01', '2026-03-31') → false (시작 > 종료)
 */
import dayjs from 'dayjs';

// ============================================================
// 현재 날짜 조회
// ============================================================

/**
 * 오늘 일자를 문자열로 반환
 *
 * @param format - 출력 포맷 (기본: 'YYYY-MM-DD')
 * @returns 오늘 일자 문자열
 *
 * @example
 * getToday()                        → '2026-03-31'
 * getToday('YYYYMMDD')              → '20260331'
 * getToday('YYYY년 MM월 DD일')       → '2026년 03월 31일'
 */
export function getToday(format: string = 'YYYY-MM-DD'): string {
    return dayjs().format(format);
}

/**
 * 이번 달을 문자열로 반환
 *
 * @param format - 출력 포맷 (기본: 'YYYY-MM')
 * @returns 이번 달 문자열
 *
 * @example
 * getThisMonth()                    → '2026-03'
 * getThisMonth('YYYYMM')           → '202603'
 * getThisMonth('YYYY년 MM월')       → '2026년 03월'
 */
export function getThisMonth(format: string = 'YYYY-MM'): string {
    return dayjs().format(format);
}

/**
 * 이번 년도를 문자열로 반환
 *
 * @param format - 출력 포맷 (기본: 'YYYY')
 * @returns 이번 년도 문자열
 *
 * @example
 * getThisYear()                     → '2026'
 * getThisYear('YYYY년')             → '2026년'
 */
export function getThisYear(format: string = 'YYYY'): string {
    return dayjs().format(format);
}

// ============================================================
// 월 시작/종료일 조회
// ============================================================

/**
 * 해당 날짜가 속한 월의 첫째 날을 반환
 *
 * @param date   - 기준 일자 (기본: 오늘)
 * @param format - 출력 포맷 (기본: 'YYYY-MM-DD')
 * @returns 월 첫째 날 문자열
 *
 * @example
 * getStartOfMonth('2026-03-15')           → '2026-03-01'
 * getStartOfMonth('2026-03-15', 'YYYYMMDD') → '20260301'
 * getStartOfMonth()                       → 이번 달 1일
 */
export function getStartOfMonth(date?: string | Date, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).startOf('month').format(format);
}

/**
 * 해당 날짜가 속한 월의 마지막 날을 반환
 *
 * @param date   - 기준 일자 (기본: 오늘)
 * @param format - 출력 포맷 (기본: 'YYYY-MM-DD')
 * @returns 월 마지막 날 문자열
 *
 * @example
 * getEndOfMonth('2026-03-15')             → '2026-03-31'
 * getEndOfMonth('2026-02-01')             → '2026-02-28'
 * getEndOfMonth()                         → 이번 달 마지막 날
 */
export function getEndOfMonth(date?: string | Date, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).endOf('month').format(format);
}

// ============================================================
// 마지막 일자 계산
// ============================================================

/**
 * 해당 년월의 마지막 일자를 숫자로 반환
 *
 * @param year  - 년도 (예: 2026)
 * @param month - 월 1~12 (예: 2)
 * @returns 마지막 일자 (28 | 29 | 30 | 31)
 *
 * @example
 * getLastDay(2026, 2)  → 28
 * getLastDay(2024, 2)  → 29  (윤년)
 * getLastDay(2026, 3)  → 31
 */
export function getLastDay(year: number, month: number): number {
    return dayjs(new Date(year, month - 1, 1)).daysInMonth();
}

/**
 * 해당 년월의 마지막 일자를 문자열로 반환
 *
 * @param year   - 년도 (예: 2026)
 * @param month  - 월 1~12 (예: 3)
 * @param format - 출력 포맷 (기본: 'YYYY-MM-DD')
 * @returns 마지막 일자 문자열
 *
 * @example
 * getLastDate(2026, 3)              → '2026-03-31'
 * getLastDate(2026, 3, 'YYYYMMDD')  → '20260331'
 * getLastDate(2026, 2)              → '2026-02-28'
 */
export function getLastDate(year: number, month: number, format: string = 'YYYY-MM-DD'): string {
    return dayjs(new Date(year, month - 1, 1)).endOf('month').format(format);
}

// ============================================================
// 날짜 가감
// ============================================================

/**
 * 기준 일자에서 일(day)을 더하거나 빼서 반환
 * - 양수: 미래 날짜, 음수: 과거 날짜
 *
 * @param date   - 기준 일자 (문자열 또는 Date)
 * @param days   - 더할 일수 (음수면 빼기)
 * @param format - 출력 포맷 (기본: 'YYYY-MM-DD')
 * @returns 계산된 일자 문자열
 *
 * @example
 * addDays('2026-03-31', 7)          → '2026-04-07'   (7일 후)
 * addDays('2026-03-31', -10)        → '2026-03-21'   (10일 전)
 * addDays('2026-01-01', 1, 'YYYYMMDD') → '20260102'
 */
export function addDays(date: string | Date, days: number, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).add(days, 'day').format(format);
}

/**
 * 기준 일자에서 월(month)을 더하거나 빼서 반환
 * - 양수: 미래 날짜, 음수: 과거 날짜
 *
 * @param date   - 기준 일자 (문자열 또는 Date)
 * @param months - 더할 월수 (음수면 빼기)
 * @param format - 출력 포맷 (기본: 'YYYY-MM-DD')
 * @returns 계산된 일자 문자열
 *
 * @example
 * addMonths('2026-03-31', 1)        → '2026-04-30'   (1개월 후, 말일 자동 보정)
 * addMonths('2026-03-31', -2)       → '2026-01-31'   (2개월 전)
 * addMonths('2026-01-15', 3)        → '2026-04-15'
 */
export function addMonths(date: string | Date, months: number, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).add(months, 'month').format(format);
}

/**
 * 기준 일자에서 년(year)을 더하거나 빼서 반환
 * - 양수: 미래 날짜, 음수: 과거 날짜
 *
 * @param date   - 기준 일자 (문자열 또는 Date)
 * @param years  - 더할 년수 (음수면 빼기)
 * @param format - 출력 포맷 (기본: 'YYYY-MM-DD')
 * @returns 계산된 일자 문자열
 *
 * @example
 * addYears('2026-03-31', 1)         → '2027-03-31'   (1년 후)
 * addYears('2026-03-31', -3)        → '2023-03-31'   (3년 전)
 * addYears('2024-02-29', 1)         → '2025-02-28'   (윤년 말일 자동 보정)
 */
export function addYears(date: string | Date, years: number, format: string = 'YYYY-MM-DD'): string {
    return dayjs(date).add(years, 'year').format(format);
}

// ============================================================
// 날짜 차이 계산
// ============================================================

/**
 * 두 일자 간의 차이 일수를 계산
 * - endDate - startDate 방향으로 계산 (endDate가 이후면 양수)
 *
 * @param startDate - 시작 일자
 * @param endDate   - 종료 일자
 * @returns 차이 일수 (절대값 아님, 방향 포함)
 *
 * @example
 * diffDays('2026-03-01', '2026-03-31')  → 30
 * diffDays('2026-03-31', '2026-03-01')  → -30
 * diffDays('2026-01-01', '2026-12-31')  → 364
 */
export function diffDays(startDate: string | Date, endDate: string | Date): number {
    return dayjs(endDate).diff(dayjs(startDate), 'day');
}

/**
 * 두 일자 간의 차이 월수를 계산
 * - endDate - startDate 방향으로 계산 (endDate가 이후면 양수)
 * - 소수점 이하 버림 (완전한 월 단위)
 *
 * @param startDate - 시작 일자
 * @param endDate   - 종료 일자
 * @returns 차이 월수 (절대값 아님, 방향 포함)
 *
 * @example
 * diffMonths('2026-01-15', '2026-04-15')  → 3
 * diffMonths('2026-01-31', '2026-03-01')  → 1   (완전한 1개월만 인정)
 * diffMonths('2026-06-01', '2026-01-01')  → -5
 */
export function diffMonths(startDate: string | Date, endDate: string | Date): number {
    return dayjs(endDate).diff(dayjs(startDate), 'month');
}

/**
 * 두 일자 간의 차이 년수를 계산
 * - endDate - startDate 방향으로 계산 (endDate가 이후면 양수)
 * - 소수점 이하 버림 (완전한 년 단위)
 *
 * @param startDate - 시작 일자
 * @param endDate   - 종료 일자
 * @returns 차이 년수 (절대값 아님, 방향 포함)
 *
 * @example
 * diffYears('2020-01-01', '2026-03-31')  → 6
 * diffYears('2020-06-01', '2026-03-01')  → 5   (완전한 6년 미도달)
 * diffYears('2026-01-01', '2020-01-01')  → -6
 */
export function diffYears(startDate: string | Date, endDate: string | Date): number {
    return dayjs(endDate).diff(dayjs(startDate), 'year');
}

// ============================================================
// 날짜 유효성 검증
// ============================================================

/**
 * 주어진 날짜가 오늘인지 확인
 *
 * @param date - 확인할 날짜
 * @returns true: 오늘, false: 오늘이 아님
 *
 * @example
 * isToday('2026-04-01')   → true  (오늘이 2026-04-01인 경우)
 * isToday('2026-01-01')   → false
 * isToday(new Date())     → true
 */
export function isToday(date: string | Date): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * 시작일이 종료일보다 이전(또는 같은)인지 검증
 * - 날짜, 월(YYYY-MM), 년도(YYYY) 등 모든 포맷에서 사용 가능
 * - 시작일 === 종료일도 유효(true)로 판단
 *
 * @param startDate - 시작 일자 (예: '2026-03-01', '2026-03', '2026')
 * @param endDate   - 종료 일자 (예: '2026-03-31', '2026-12', '2027')
 * @returns true: 유효 (시작 <= 종료), false: 무효 (시작 > 종료)
 *
 * @example
 * // 일자 범위 검증
 * isValidDateRange('2026-03-01', '2026-03-31')  → true
 * isValidDateRange('2026-04-01', '2026-03-31')  → false  (시작 > 종료)
 * isValidDateRange('2026-03-15', '2026-03-15')  → true   (같은 날짜 허용)
 *
 * // 월 범위 검증
 * isValidDateRange('2026-01', '2026-12')        → true
 * isValidDateRange('2026-06', '2026-01')        → false
 *
 * // 년도 범위 검증
 * isValidDateRange('2025', '2026')              → true
 *
 * // 검색 조건 검증에 활용
 * if (!isValidDateRange(startDt, endDt)) {
 *   message.warning('시작일이 종료일보다 클 수 없습니다.');
 *   return;
 * }
 */
export function isValidDateRange(startDate: string | Date, endDate: string | Date): boolean {
    return !dayjs(startDate).isAfter(dayjs(endDate));
}
