package com.kcabEvent.controller.saf;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.saf.SafEmailVerificationSendRequestDto;
import com.kcabEvent.dto.saf.SafEmailVerificationVerifyRequestDto;
import com.kcabEvent.dto.saf.SignupRequestDto;
import com.kcabEvent.service.saf.SafEmailVerificationService;
import com.kcabEvent.service.saf.SafSignupService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 공개 SAF 조직 가입과 중복 확인 API를 제공한다.
 */
@RestController
@RequestMapping("/api/public/saf")
public class SafSignupController {

    @Resource(name = "safSignupService")
    private SafSignupService safSignupService;

    @Resource(name = "safEmailVerificationService")
    private SafEmailVerificationService safEmailVerificationService;

    /**
     * 관리자 승인을 위한 SAF 조직 가입 요청을 제출한다.
     */
    @PostMapping("/signup")
    public ApiResponse<Void> signup(@Valid @RequestBody SignupRequestDto requestDto, HttpSession session) {
        try {
            if (!safEmailVerificationService.isVerifiedForEmail(requestDto.getEmail(), session)) {
                return ApiResponse.ok(null, 400, "Please complete email verification before submitting.");
            }
            safSignupService.signup(requestDto);
            safEmailVerificationService.clear(session);
            return ApiResponse.ok(null, 200, "Sign-up has been completed. You can use the service after administrator approval.");
        } catch (IllegalArgumentException e) {
            return ApiResponse.ok(null, 400, e.getMessage());
        }
    }

    /**
     * 요청한 SAF 사용자 아이디가 이미 존재하는지 확인한다.
     */
    @GetMapping("/check-user-id")
    public ApiResponse<Map<String, Boolean>> checkUserId(@RequestParam String userId) {
        boolean exists = safSignupService.existsByUserId(userId);
        return ApiResponse.ok(Map.of("exists", exists));
    }

    /**
     * 요청한 SAF 이메일이 이미 존재하는지 확인한다.
     */
    @GetMapping("/check-email")
    public ApiResponse<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = safSignupService.existsByEmail(email);
        return ApiResponse.ok(Map.of("exists", exists));
    }

    /**
     * 가입용 이메일 인증 코드를 발송한다 (10분 유효).
     */
    @PostMapping("/send-email-code")
    public ApiResponse<Void> sendEmailCode(
            @Valid @RequestBody SafEmailVerificationSendRequestDto requestDto,
            HttpSession session
    ) {
        safEmailVerificationService.sendCode(requestDto, session);
        return ApiResponse.ok();
    }

    /**
     * 발송된 이메일 인증 코드를 검증한다.
     */
    @PostMapping("/verify-email-code")
    public ApiResponse<Void> verifyEmailCode(
            @Valid @RequestBody SafEmailVerificationVerifyRequestDto requestDto,
            HttpSession session
    ) {
        safEmailVerificationService.verifyCode(requestDto, session);
        return ApiResponse.ok();
    }
}
