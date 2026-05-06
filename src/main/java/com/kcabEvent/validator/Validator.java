package com.kcabEvent.validator;

import org.springframework.validation.BindingResult;

/**
 * Validator - 범용 유효성 검사 인터페이스
 *
 * <p>{@link BindingResult}를 받아 유효성 검사 후 예외를 발생시키는 전략 인터페이스.
 * {@link CustomValidator}가 이 인터페이스의 기본 구현체를 제공한다.</p>
 *
 * @param <T> 검사 대상 객체 타입
 *
 * @see CustomValidator
 */
public interface Validator<T> {
    /**
     * 객체의 유효성을 검사하고, 오류가 있으면 예외를 발생시킨다.
     *
     * @param objectToValidate 검사할 객체
     * @param bindingResult    {@code @Valid} 검사 결과 (오류 목록 포함)
     */
    void validate(T objectToValidate, BindingResult bindingResult);
}
