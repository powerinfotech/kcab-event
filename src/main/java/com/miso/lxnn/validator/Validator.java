package com.miso.lxnn.validator;

import org.springframework.validation.BindingResult;

public interface Validator<T> {
    void validate(T objectToValidate, BindingResult bindingResult);
}
