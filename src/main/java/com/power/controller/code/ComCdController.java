package com.power.controller.code;

import com.power.annotation.PowerSession;
import com.power.dto.code.ComCdListDto;
import com.power.dto.code.ComCdSaveDto;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.LoginUser;
import com.power.service.code.ComCdService;
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
            @PowerSession LoginUser loginUser,
            @RequestParam Long comGrpCdSeq) {
        return ApiResponse.ok(comCdService.selectComCdList(comGrpCdSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveComCd(
            @PowerSession LoginUser loginUser,
            @RequestBody @Valid ComCdSaveDto saveDto) {
        comCdService.saveComCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
