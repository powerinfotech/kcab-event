package com.kcabEvent.service.saf;

import com.kcabEvent.dto.saf.SignupRequestDto;

/**
 * 공개 SAF 조직 가입과 중복 확인 기능을 정의한다.
 */
public interface SafSignupService {

    /**
     * 승인 대기 상태의 SAF 사용자, 조직, 소유자 멤버십을 등록한다.
     */
    void signup(SignupRequestDto requestDto);

    /**
     * SAF 사용자 아이디가 이미 존재하는지 확인한다.
     */
    boolean existsByUserId(String userId);

    /**
     * SAF 이메일이 이미 존재하는지 확인한다.
     */
    boolean existsByEmail(String email);
}
