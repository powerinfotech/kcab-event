package com.kcabEvent.controller.code;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.code.ComGrpCdListDto;
import com.kcabEvent.dto.code.ComGrpCdSaveDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.service.code.ComGrpCdService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/com-grp-cd")
public class ComGrpCdController {

    @Resource(name = "comGrpCdService")
    private ComGrpCdService comGrpCdService;

    @GetMapping("/list")
    public ApiResponse<List<ComGrpCdListDto>> selectComGrpCdList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String useYn) {
        return ApiResponse.ok(comGrpCdService.selectComGrpCdList(searchText, useYn));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveComGrpCd(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid ComGrpCdSaveDto saveDto) {
        comGrpCdService.saveComGrpCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
