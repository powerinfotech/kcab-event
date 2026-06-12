package com.kcabEvent.controller.myevents;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.participant.MyEventsCodeRequest;
import com.kcabEvent.dto.participant.MyEventsSessionDto;
import com.kcabEvent.dto.participant.MyEventsVerifyRequest;
import com.kcabEvent.service.myevents.MyEventsService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 공개 My Events: 이메일 인증코드로 본인 등록 행사/정보 조회. (/api/public/** 는 세션 인터셉터 제외) */
@RestController
@RequestMapping("/api/public/my-events")
public class PublicMyEventsController {

    @Resource(name = "myEventsService")
    private MyEventsService myEventsService;

    @PostMapping("/request-code")
    public ApiResponse<Void> requestCode(@Valid @RequestBody MyEventsCodeRequest request, HttpSession session) {
        myEventsService.requestCode(request.getEmail(), session);
        return ApiResponse.ok();
    }

    @PostMapping("/verify-code")
    public ApiResponse<MyEventsSessionDto> verifyCode(@Valid @RequestBody MyEventsVerifyRequest request, HttpSession session) {
        return ApiResponse.ok(myEventsService.verifyAndStart(request.getEmail(), request.getCode(), session));
    }

    /** 현재 유효한 세션의 내 정보/행사/남은 시간 (페이지 새로고침 복원용) */
    @GetMapping("/session")
    public ApiResponse<MyEventsSessionDto> session(HttpSession session) {
        return ApiResponse.ok(myEventsService.getSession(session));
    }

    /** 세션 5분 연장 */
    @PostMapping("/extend")
    public ApiResponse<MyEventsSessionDto> extend(HttpSession session) {
        return ApiResponse.ok(myEventsService.extendSession(session));
    }
}
