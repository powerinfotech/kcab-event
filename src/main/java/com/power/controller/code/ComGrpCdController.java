package com.power.controller.code;

import com.power.annotation.PowerSession;
import com.power.dto.code.ComGrpCdListDto;
import com.power.dto.code.ComGrpCdSaveDto;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.LoginUser;
import com.power.service.code.ComGrpCdService;
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
            @PowerSession LoginUser loginUser,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String useYn) {
        return ApiResponse.ok(comGrpCdService.selectComGrpCdList(searchText, useYn));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveComGrpCd(
            @PowerSession LoginUser loginUser,
            @RequestBody @Valid ComGrpCdSaveDto saveDto) {
        comGrpCdService.saveComGrpCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
