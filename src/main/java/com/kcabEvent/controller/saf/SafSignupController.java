package com.kcabEvent.controller.saf;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.saf.SignupRequestDto;
import com.kcabEvent.service.saf.SafSignupService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public/saf")
public class SafSignupController {

    @Resource(name = "safSignupService")
    private SafSignupService safSignupService;

    @PostMapping("/signup")
    public ApiResponse<Void> signup(@Valid @RequestBody SignupRequestDto requestDto) {
        try {
            safSignupService.signup(requestDto);
            return ApiResponse.ok(null, 200, "Sign-up has been completed. You can use the service after administrator approval.");
        } catch (IllegalArgumentException e) {
            return ApiResponse.ok(null, 400, e.getMessage());
        }
    }

    @GetMapping("/check-user-id")
    public ApiResponse<Map<String, Boolean>> checkUserId(@RequestParam String userId) {
        boolean exists = safSignupService.existsByUserId(userId);
        return ApiResponse.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-email")
    public ApiResponse<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = safSignupService.existsByEmail(email);
        return ApiResponse.ok(Map.of("exists", exists));
    }
}
