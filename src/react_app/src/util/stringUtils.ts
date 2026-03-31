/**
 * stringUtils - 문자열 처리 유틸
 *
 * [목적]
 * 관리자 화면에서 자주 사용하는 문자열 가공/검증/마스킹 함수를 제공한다.
 * null/undefined에 안전하게 동작하며 빈 문자열을 반환한다.
 *
 * [제공 함수]
 * - isEmpty / isNotEmpty        : 빈 값 체크
 * - lpad / rpad                 : 좌/우 패딩 (자리수 채우기)
 * - truncate                    : 글자수 초과 시 말줄임 처리
 * - truncateByByte              : 바이트 기준 말줄임 (한글 2바이트)
 * - getByteLength               : 문자열 바이트 수 계산
 * - mask                        : 개인정보 마스킹 (이름, 전화번호, 이메일 등)
 * - removeHtml                  : HTML 태그 제거
 * - nl2br                       : 줄바꿈(\n)을 <br>로 변환
 * - toNumber                    : 문자열을 숫자로 안전 변환
 * - capitalize                  : 첫 글자 대문자
 * - camelToSnake / snakeToCamel : camelCase ↔ snake_case 변환
 * - repeat                      : 문자열 반복
 * - contains                    : 문자열 포함 여부 (대소문자 무시 옵션)
 *
 * [사용 방법]
 * @example
 * import { lpad, truncate, mask, isEmpty } from '@util/stringUtils';
 *
 * lpad('7', 3, '0')               → '007'
 * truncate('안녕하세요 반갑습니다', 8) → '안녕하세요 반...'
 * mask('홍길동', 'name')           → '홍*동'
 * isEmpty(null)                    → true
 */

// ============================================================
// 빈 값 체크
// ============================================================

/**
 * 빈 값 여부 확인 (null / undefined / 빈 문자열 / 공백만 있는 문자열)
 *
 * @example
 * isEmpty(null)       → true
 * isEmpty(undefined)  → true
 * isEmpty('')         → true
 * isEmpty('  ')       → true
 * isEmpty('hello')    → false
 */
export function isEmpty(value: string | null | undefined): boolean {
    return value == null || value.trim() === '';
}

/**
 * 비어있지 않은 값 여부 확인 (isEmpty의 반대)
 *
 * @example
 * isNotEmpty('hello') → true
 * isNotEmpty('')      → false
 */
export function isNotEmpty(value: string | null | undefined): boolean {
    return !isEmpty(value);
}

// ============================================================
// 패딩
// ============================================================

/**
 * 문자열 좌측 패딩 (지정 길이가 될 때까지 앞에 문자 채우기)
 *
 * @param value   - 원본 값 (숫자도 자동 문자열 변환)
 * @param length  - 목표 전체 길이
 * @param padChar - 채울 문자 (기본: '0')
 * @returns 패딩된 문자열
 *
 * @example
 * lpad('7', 3)         → '007'
 * lpad('42', 5, '*')   → '***42'
 * lpad(9, 2, '0')      → '09'
 * lpad('hello', 3)     → 'hello'  (원본이 더 길면 그대로 반환)
 */
export function lpad(value: string | number, length: number, padChar: string = '0'): string {
    return String(value).padStart(length, padChar);
}

/**
 * 문자열 우측 패딩 (지정 길이가 될 때까지 뒤에 문자 채우기)
 *
 * @param value   - 원본 값
 * @param length  - 목표 전체 길이
 * @param padChar - 채울 문자 (기본: ' ')
 * @returns 패딩된 문자열
 *
 * @example
 * rpad('hello', 8)       → 'hello   '
 * rpad('A', 5, '-')      → 'A----'
 * rpad('toolong', 3)     → 'toolong'  (원본이 더 길면 그대로 반환)
 */
export function rpad(value: string | number, length: number, padChar: string = ' '): string {
    return String(value).padEnd(length, padChar);
}

// ============================================================
// 말줄임
// ============================================================

/**
 * 글자수 초과 시 말줄임 처리
 *
 * @param value   - 원본 문자열
 * @param maxLen  - 최대 글자 수
 * @param suffix  - 말줄임 표시 문자 (기본: '...')
 * @returns 처리된 문자열
 *
 * @example
 * truncate('안녕하세요 반갑습니다', 8)         → '안녕하세요 반...'
 * truncate('short', 10)                       → 'short'
 * truncate('안녕하세요', 5, '(더보기)')        → '안녕하세(더보기)'
 */
export function truncate(value: string | null | undefined, maxLen: number, suffix: string = '...'): string {
    if (!value) return '';
    if (value.length <= maxLen) return value;
    return value.slice(0, maxLen) + suffix;
}

/**
 * 바이트 수 기준 말줄임 처리 (한글 2바이트, 영문/숫자 1바이트)
 * - 테이블 컬럼 등 고정 바이트 제한이 있는 경우 사용
 *
 * @param value    - 원본 문자열
 * @param maxBytes - 최대 바이트 수
 * @param suffix   - 말줄임 표시 문자 (기본: '...')
 * @returns 처리된 문자열
 *
 * @example
 * truncateByByte('Hello안녕', 8)   → 'Hello안...'  (Hello=5 + 안=2 + ... )
 * truncateByByte('Hello', 10)      → 'Hello'
 */
export function truncateByByte(value: string | null | undefined, maxBytes: number, suffix: string = '...'): string {
    if (!value) return '';
    let byteCount = 0;
    let i = 0;
    for (; i < value.length; i++) {
        byteCount += getCharByte(value[i]);
        if (byteCount > maxBytes) break;
    }
    if (i >= value.length) return value;
    return value.slice(0, i) + suffix;
}

/**
 * 문자열의 바이트 수 계산 (한글/특수문자 2바이트, 그 외 1바이트)
 *
 * @param value - 바이트 수를 계산할 문자열
 * @returns 바이트 수
 *
 * @example
 * getByteLength('Hello')      → 5
 * getByteLength('안녕')       → 4
 * getByteLength('Hello안녕')  → 9
 */
export function getByteLength(value: string | null | undefined): number {
    if (!value) return 0;
    return [...value].reduce((acc, char) => acc + getCharByte(char), 0);
}

/** 단일 문자의 바이트 수 반환 */
function getCharByte(char: string): number {
    return char.charCodeAt(0) > 127 ? 2 : 1;
}

// ============================================================
// 마스킹 (개인정보 보호)
// ============================================================

type MaskType = 'name' | 'phone' | 'email' | 'bizNo' | 'custom';

/**
 * 개인정보 마스킹 처리
 * - name:   이름 중간 글자 마스킹
 * - phone:  전화번호 중간 4자리 마스킹
 * - email:  이메일 @ 앞 일부 마스킹
 * - bizNo:  사업자번호 중간 2자리 마스킹
 * - custom: start~end 구간을 maskChar로 마스킹
 *
 * @param value    - 원본 값
 * @param type     - 마스킹 타입
 * @param options  - custom 타입 시 { start, end, maskChar } 지정
 * @returns 마스킹된 문자열
 *
 * @example
 * mask('홍길동', 'name')                        → '홍*동'
 * mask('김철수', 'name')                        → '김*수'
 * mask('010-1234-5678', 'phone')               → '010-****-5678'
 * mask('user@example.com', 'email')            → 'us**@example.com'
 * mask('123-45-67890', 'bizNo')                → '123-**-67890'
 * mask('1234567890', 'custom', { start: 2, end: 6 }) → '12****7890'
 */
export function mask(
    value: string | null | undefined,
    type: MaskType,
    options?: { start?: number; end?: number; maskChar?: string }
): string {
    if (!value) return '';
    const mc = options?.maskChar ?? '*';

    switch (type) {
        case 'name': {
            // 2글자: 마지막 글자 마스킹, 3글자 이상: 중간 글자 마스킹
            if (value.length <= 1) return value;
            if (value.length === 2) return value[0] + mc;
            return value[0] + mc.repeat(value.length - 2) + value[value.length - 1];
        }
        case 'phone': {
            // 하이픈 포함/미포함 모두 지원
            const nums = value.replace(/\D/g, '');
            if (nums.length < 10) return value;
            const masked = nums.slice(0, 3) + '-' + '****' + '-' + nums.slice(7);
            return masked;
        }
        case 'email': {
            const atIdx = value.indexOf('@');
            if (atIdx < 0) return value;
            const local = value.slice(0, atIdx);
            const domain = value.slice(atIdx);
            // 앞 2글자 유지, 나머지 마스킹
            const visibleLen = Math.min(2, local.length);
            return local.slice(0, visibleLen) + mc.repeat(local.length - visibleLen) + domain;
        }
        case 'bizNo': {
            // 123-45-67890 형식에서 중간 2자리 마스킹
            return value.replace(/(\d{3})-?(\d{2})-?(\d{5})/, `$1-${mc.repeat(2)}-$3`);
        }
        case 'custom': {
            const start = options?.start ?? 0;
            const end = options?.end ?? value.length;
            return value.slice(0, start) + mc.repeat(end - start) + value.slice(end);
        }
        default:
            return value;
    }
}

// ============================================================
// HTML
// ============================================================

/**
 * HTML 태그 제거 (게시판 내용 미리보기 등에 사용)
 *
 * @param html - HTML 문자열
 * @returns 태그가 제거된 순수 텍스트
 *
 * @example
 * removeHtml('<p>안녕하세요<br/>반갑습니다</p>')  → '안녕하세요반갑습니다'
 * removeHtml('<b>Bold</b> text')                 → 'Bold text'
 */
export function removeHtml(html: string | null | undefined): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

/**
 * 줄바꿈 문자(\n)를 HTML <br> 태그로 변환
 * - dangerouslySetInnerHTML과 함께 사용
 *
 * @param value - 원본 문자열
 * @returns <br> 태그가 삽입된 문자열
 *
 * @example
 * nl2br('1줄\n2줄\n3줄')  → '1줄<br>2줄<br>3줄'
 */
export function nl2br(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br>');
}

// ============================================================
// 타입 변환
// ============================================================

/**
 * 문자열을 숫자로 안전하게 변환
 * - 쉼표(천단위 구분자) 자동 제거
 * - 변환 실패 시 defaultValue 반환
 *
 * @param value        - 변환할 문자열
 * @param defaultValue - 변환 실패 시 반환값 (기본: 0)
 * @returns 변환된 숫자
 *
 * @example
 * toNumber('1,234,567')  → 1234567
 * toNumber('3.14')       → 3.14
 * toNumber('abc')        → 0
 * toNumber('', -1)       → -1
 */
export function toNumber(value: string | null | undefined, defaultValue: number = 0): number {
    if (!value) return defaultValue;
    const num = Number(value.replace(/,/g, ''));
    return isNaN(num) ? defaultValue : num;
}

// ============================================================
// 대소문자 / 케이스 변환
// ============================================================

/**
 * 문자열의 첫 글자를 대문자로 변환
 *
 * @example
 * capitalize('hello world')  → 'Hello world'
 * capitalize('abc')          → 'Abc'
 */
export function capitalize(value: string | null | undefined): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * camelCase → snake_case 변환
 *
 * @example
 * camelToSnake('userName')       → 'user_name'
 * camelToSnake('getUserList')    → 'get_user_list'
 */
export function camelToSnake(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

/**
 * snake_case → camelCase 변환
 *
 * @example
 * snakeToCamel('user_name')       → 'userName'
 * snakeToCamel('get_user_list')   → 'getUserList'
 */
export function snakeToCamel(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

// ============================================================
// 기타
// ============================================================

/**
 * 문자열 반복
 *
 * @param value - 반복할 문자열
 * @param count - 반복 횟수
 * @returns 반복된 문자열
 *
 * @example
 * repeat('ab', 3)   → 'ababab'
 * repeat('-', 10)   → '----------'
 */
export function repeat(value: string, count: number): string {
    return value.repeat(Math.max(0, count));
}

/**
 * 문자열 포함 여부 확인 (대소문자 무시 옵션)
 *
 * @param value      - 검색 대상 문자열
 * @param search     - 검색할 문자열
 * @param ignoreCase - 대소문자 무시 여부 (기본: false)
 * @returns 포함 여부
 *
 * @example
 * contains('Hello World', 'world')              → false
 * contains('Hello World', 'world', true)        → true
 * contains('사용자 관리', '관리')                → true
 */
export function contains(
    value: string | null | undefined,
    search: string,
    ignoreCase: boolean = false
): boolean {
    if (!value) return false;
    if (ignoreCase) return value.toLowerCase().includes(search.toLowerCase());
    return value.includes(search);
}
