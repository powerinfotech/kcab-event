package com.kcabEvent.controller.display;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.display.DisplaySettingDto;
import com.kcabEvent.service.display.PublicDisplaySettingService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 공개 노출 설정 조회 (nav·페이지가 읽음). /api/public/** 는 세션 인터셉터 제외. */
@RestController
@RequestMapping("/api/public/display-setting")
public class PublicDisplaySettingController {

    @Resource(name = "publicDisplaySettingService")
    private PublicDisplaySettingService publicDisplaySettingService;

    @GetMapping
    public ApiResponse<DisplaySettingDto> get() {
        return ApiResponse.ok(publicDisplaySettingService.getSetting());
    }
}
