package com.miso.lxnn.controller.code;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.code.ComGrpCdListDto;
import com.miso.lxnn.dto.code.ComGrpCdSaveDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.code.ComGrpCdService;
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
            @MisoSession LoginUser loginUser,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String useYn) throws Exception {
        return ApiResponse.ok(comGrpCdService.selectComGrpCdList(searchText, useYn));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveComGrpCd(
            @MisoSession LoginUser loginUser,
            @RequestBody @Valid ComGrpCdSaveDto saveDto) throws Exception {
        comGrpCdService.saveComGrpCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
