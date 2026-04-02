package com.power.validator;

import com.power.exception.custom.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

/**
 * CustomValidator - 공통 유효성 검사 컴포넌트
 *
 * <p>{@link BindingResult}에 오류가 있으면 즉시 {@link ValidationException}을 발생시킨다.
 * 컨트롤러에서 {@code @Valid} 검사 후 수동으로 호출하는 방식으로 사용한다.</p>
 *
 * <h3>사용 예시</h3>
 * <pre>
 * {@literal @}PostMapping("/api/save")
 * public ApiResponse{@literal <}Void{@literal >} save(
 *         {@literal @}Valid {@literal @}RequestBody UserSaveDto dto,
 *         BindingResult bindingResult) {
 *     customValidator.validate(dto, bindingResult); // 오류 있으면 예외 발생
 *     ...
 * }
 * </pre>
 *
 * @see Validator
 * @see ValidationException
 */
@Component("customValidator")
public class CustomValidator implements Validator<Object> {

    /**
     * {@link BindingResult}에 오류가 존재하면 {@link ValidationException}을 발생시킨다.
     *
     * @param objectToValidate 검사 대상 객체 (실제 검사는 BindingResult로 수행)
     * @param bindingResult    {@code @Valid} 검사 결과
     * @throws ValidationException 유효성 검사 오류가 하나 이상 존재할 때
     */
    @Override
    public void validate(Object objectToValidate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException();
        }
    }
}
