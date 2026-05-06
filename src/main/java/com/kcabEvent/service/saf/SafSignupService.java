package com.kcabEvent.service.saf;

import com.kcabEvent.dto.saf.SignupRequestDto;

public interface SafSignupService {

    void signup(SignupRequestDto requestDto);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);
}
