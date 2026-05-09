package com.kcabEvent.controller.code;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.code.ComCdListDto;
import com.kcabEvent.dto.code.ComCdSaveDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.service.code.ComCdService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

/**
 * 공통 코드 그룹에 속한 공통 코드를 관리하는 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/com-cd")
public class ComCdController {

    @Resource(name = "comCdService")
    private ComCdService comCdService;

    /**
     * 선택한 공통 코드 그룹의 공통 코드 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<ComCdListDto>> selectComCdList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long comGrpCdSeq) {
        return ApiResponse.ok(comCdService.selectComCdList(comGrpCdSeq));
    }

    /**
     * 생성, 수정, 삭제된 공통 코드를 저장한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> saveComCd(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid ComCdSaveDto saveDto) {
        comCdService.saveComCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
