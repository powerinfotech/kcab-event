import dayjs, { Dayjs } from 'dayjs';

/**
 * 전화번호 포맷 (숫자만 추출 후 하이픈 삽입)
 * @example formatPhone('01012345678') → '010-1234-5678'
 */
export function formatPhone(value: string | null | undefined): string {
    if (!value) return '';
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
}

/**
 * 사업자번호 포맷
 * @example formatBizNo('1234567890') → '123-45-67890'
 */
export function formatBizNo(value: string | null | undefined): string {
    if (!value) return '';
    const nums = value.replace(/\D/g, '').slice(0, 10);
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5)}`;
}

/**
 * 금액 포맷 (천 단위 콤마)
 * @example formatCurrency(1000000) → '1,000,000'
 * @example formatCurrency(1000000, '원') → '1,000,000원'
 */
export function formatCurrency(
    value: number | string | null | undefined,
    suffix?: string
): string {
    if (value == null || value === '') return '';
    const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
    if (isNaN(num)) return '';
    const formatted = num.toLocaleString('ko-KR');
    return suffix ? `${formatted}${suffix}` : formatted;
}

/**
 * 날짜 포맷 (dayjs 래핑)
 * @example formatDate('2024-01-15') → '2024-01-15'
 * @example formatDate('2024-01-15', 'YYYY년 MM월 DD일') → '2024년 01월 15일'
 */
export function formatDate(
    value: string | Date | Dayjs | null | undefined,
    format: string = 'YYYY-MM-DD'
): string {
    if (!value) return '';
    const d = dayjs(value);
    return d.isValid() ? d.format(format) : '';
}

/**
 * 파일 크기 포맷
 * @example formatFileSize(1536) → '1.5 KB'
 * @example formatFileSize(1048576) → '1.0 MB'
 */
export function formatFileSize(bytes: number | null | undefined): string {
    if (bytes == null || bytes < 0) return '';
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * 숫자에서 숫자가 아닌 문자 제거
 * @example stripNonNumeric('010-1234-5678') → '01012345678'
 */
export function stripNonNumeric(value: string): string {
    return value.replace(/\D/g, '');
}
