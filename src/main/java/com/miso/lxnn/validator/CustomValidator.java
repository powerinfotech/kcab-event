package com.miso.lxnn.validator;

import com.miso.lxnn.exception.custom.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

@Component("customValidator")
public class CustomValidator implements  Validator<Object>{

    @Override
    public void validate(Object objectToValidate, BindingResult bindingResult) {
         if(bindingResult.hasErrors()) {
             throw new ValidationException();
        }
    }
}
