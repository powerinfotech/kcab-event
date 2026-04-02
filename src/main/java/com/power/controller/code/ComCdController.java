package com.power.controller.code;

import com.power.annotation.MisoSession;
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
            @MisoSession LoginUser loginUser,
            @RequestParam Long comGrpCdSeq) throws Exception {
        return ApiResponse.ok(comCdService.selectComCdList(comGrpCdSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveComCd(
            @MisoSession LoginUser loginUser,
            @RequestBody @Valid ComCdSaveDto saveDto) throws Exception {
        comCdService.saveComCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
