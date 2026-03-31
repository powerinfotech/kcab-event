export const ALPHANUMERIC_REGEXP = {value: /^[A-Za-z0-9]*$/, message: '영어와 숫자만 입력 가능합니다.'};
export const INTEGER_REGEXP = {value: /^-?\d*$/, message: '정수만 입력 가능합니다.'};
export const FLOAT_REGEXP = {value: /^-?\d*\.?\d*$/, message: '실수만 입력 가능합니다.'};

export const EMAIL_REGEXP = {value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: '올바른 이메일 형식이 아닙니다.'};
export const PHONE_REGEXP = {value: /^01[016789]-?\d{3,4}-?\d{4}$/, message: '올바른 전화번호 형식이 아닙니다.'};
export const BIZNO_REGEXP = {value: /^\d{3}-?\d{2}-?\d{5}$/, message: '올바른 사업자번호 형식이 아닙니다.'};
export const PASSWORD_REGEXP = {value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,}$/, message: '영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.'};
export const KOREAN_REGEXP = {value: /^[가-힣ㄱ-ㅎㅏ-ㅣ\s]*$/, message: '한글만 입력 가능합니다.'};
export const URL_REGEXP = {value: /^https?:\/\/[^\s/$.?#].[^\s]*$/, message: '올바른 URL 형식이 아닙니다.'};
