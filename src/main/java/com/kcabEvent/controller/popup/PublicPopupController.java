package com.kcabEvent.controller.popup;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.popup.PopupListDto;
import com.kcabEvent.service.popup.PopupService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 비로그인 메인 화면에서 사용하는 팝업 조회 API를 제공한다.
 */
@RestController
@RequestMapping("/api/public/popup")
public class PublicPopupController {

    @Resource(name = "popupService")
    private PopupService popupService;

    /**
     * 메인 화면에 표시할 활성 팝업 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<PopupListDto>> selectPublicPopupList() {
        return ApiResponse.ok(popupService.selectPopupList("published", true));
    }
}
