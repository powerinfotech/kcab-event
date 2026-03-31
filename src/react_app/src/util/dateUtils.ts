import dayjs from 'dayjs';

/**
 * 오늘 일자 (YYYY-MM-DD)
 * @example getToday() → '2026-03-31'
 * @example getToday('YYYYMMDD') → '20260331'
 * @example getToday('YYYY년 MM월 DD일') → '2026년 03월 31일'
 */
export function getToday(format: string = 'YYYY-MM-DD'): string {
    return dayjs().format(format);
}

/**
 * 이번 달 (YYYY-MM)
 * @example getThisMonth() → '2026-03'
 * @example getThisMonth('YYYYMM') → '202603'
 * @example getThisMonth('YYYY년 MM월') → '2026년 03월'
 */
export function getThisMonth(format: string = 'YYYY-MM'): string {
    return dayjs().format(format);
}

/**
 * 이번 년도
 * @example getThisYear() → '2026'
 * @example getThisYear('YYYY년') → '2026년'
 */
export function getThisYear(format: string = 'YYYY'): string {
    return dayjs().format(format);
}

/**
 * 해당 년월의 마지막 일자
 * @param year 년도
 * @param month 월 (1~12)
 * @example getLastDay(2026, 2) → 28
 * @example getLastDay(2024, 2) → 29  (윤년)
 * @example getLastDay(2026, 3) → 31
 */
export function getLastDay(year: number, month: number): number {
    return dayjs(`${year}-${String(month).padStart(2, '0')}-01`).daysInMonth();
}

/**
 * 해당 년월의 마지막 일자를 문자열로 반환
 * @param year 년도
 * @param month 월 (1~12)
 * @example getLastDate(2026, 3) → '2026-03-31'
 * @example getLastDate(2026, 3, 'YYYYMMDD') → '20260331'
 */
export function getLastDate(year: number, month: number, format: string = 'YYYY-MM-DD'): string {
    return dayjs(`${year}-${String(month).padStart(2, '0')}-01`).endOf('month').format(format);
}
