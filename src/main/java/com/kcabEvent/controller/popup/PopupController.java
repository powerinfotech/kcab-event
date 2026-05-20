package com.kcabEvent.controller.popup;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.popup.PopupListDto;
import com.kcabEvent.dto.popup.PopupSaveDto;
import com.kcabEvent.service.popup.PopupService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

/**
 * 메인 화면 팝업 관리용 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/popup")
public class PopupController {

    @Resource(name = "popupService")
    private PopupService popupService;

    /**
     * 상태 조건에 따라 팝업 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<PopupListDto>> selectPopupList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean activeOnly) {
        return ApiResponse.ok(popupService.selectPopupList(status, activeOnly));
    }

    /**
     * 생성, 수정, 삭제된 팝업 행을 저장한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> savePopup(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid PopupSaveDto saveDto) {
        popupService.savePopup(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
