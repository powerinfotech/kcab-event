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

@RestController
@RequestMapping("/api/com-cd")
public class ComCdController {

    @Resource(name = "comCdService")
    private ComCdService comCdService;

    @GetMapping("/list")
    public ApiResponse<List<ComCdListDto>> selectComCdList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long comGrpCdSeq) {
        return ApiResponse.ok(comCdService.selectComCdList(comGrpCdSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveComCd(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid ComCdSaveDto saveDto) {
        comCdService.saveComCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
