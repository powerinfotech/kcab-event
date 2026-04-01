/**
 * validationPatterns - react-hook-form 입력 검증용 정규식 패턴 모음
 *
 * [목적]
 * CustomSaveFormInput, CustomValidFormInput 등 폼 컴포넌트의
 * pattern prop에 전달하여 입력값을 실시간 검증한다.
 *
 * [구조]
 * 각 패턴은 { value: RegExp, message: string } 형태로,
 * react-hook-form의 pattern 규칙과 직접 호환된다.
 *
 * [사용 방법]
 * @example
 * import { EMAIL_REGEXP, PHONE_REGEXP } from '@util/validationPatterns';
 *
 * // CustomSaveFormInput에서 사용
 * <CustomSaveFormInput
 *   name="email"
 *   control={control}
 *   rules={{ pattern: EMAIL_REGEXP }}
 * />
 *
 * // react-hook-form register에서 직접 사용
 * register('phone', { pattern: PHONE_REGEXP })
 */

/** 영어와 숫자만 허용 (예: 'Admin123') */
export const ALPHANUMERIC_REGEXP = {value: /^[A-Za-z0-9]*$/, message: '영어와 숫자만 입력 가능합니다.'};

/** 정수만 허용 - 음수 포함 (예: '-100', '200') */
export const INTEGER_REGEXP = {value: /^-?\d*$/, message: '정수만 입력 가능합니다.'};

/** 실수만 허용 - 소수점, 음수 포함 (예: '-3.14', '100.5') */
export const FLOAT_REGEXP = {value: /^-?\d*\.?\d*$/, message: '실수만 입력 가능합니다.'};

/** 이메일 형식 (예: 'user@example.com') */
export const EMAIL_REGEXP = {value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: '올바른 이메일 형식이 아닙니다.'};

/** 한국 휴대전화번호 - 하이픈 있어도/없어도 허용 (예: '01012345678', '010-1234-5678') */
export const PHONE_REGEXP = {value: /^01[016789]-?\d{3,4}-?\d{4}$/, message: '올바른 전화번호 형식이 아닙니다.'};

/** 사업자등록번호 - 하이픈 있어도/없어도 허용 (예: '1234567890', '123-45-67890') */
export const BIZNO_REGEXP = {value: /^\d{3}-?\d{2}-?\d{5}$/, message: '올바른 사업자번호 형식이 아닙니다.'};

/** 비밀번호 - 영문 + 숫자 + 특수문자 조합, 8자 이상 (예: 'Pass1234!') */
export const PASSWORD_REGEXP = {value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,}$/, message: '영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.'};

/** 한글만 허용 - 자음/모음/완성형, 공백 포함 (예: '홍길동', '서울 특별시') */
export const KOREAN_REGEXP = {value: /^[가-힣ㄱ-ㅎㅏ-ㅣ\s]*$/, message: '한글만 입력 가능합니다.'};

/** URL 형식 - http:// 또는 https:// 필수 (예: 'https://example.com/path') */
export const URL_REGEXP = {value: /^https?:\/\/[^\s/$.?#].[^\s]*$/, message: '올바른 URL 형식이 아닙니다.'};

/** 한국 우편번호 - 5자리 숫자 (예: '06234') */
export const ZIP_REGEXP = {value: /^\d{5}$/, message: '올바른 우편번호 형식이 아닙니다. (5자리 숫자)'};

/** 한국 일반전화번호 - 지역번호(02, 031~064) + 7~8자리, 하이픈 있어도/없어도 허용
 *  (예: '02-1234-5678', '0311234567', '031-123-4567') */
export const LANDLINE_REGEXP = {value: /^(0[2-9]\d?)-?(\d{3,4})-?(\d{4})$/, message: '올바른 일반전화번호 형식이 아닙니다.'};

/** IPv4 주소 형식 (예: '192.168.0.1', '0.0.0.0', '255.255.255.255') */
export const IPV4_REGEXP = {value: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/, message: '올바른 IP 주소 형식이 아닙니다.'};
