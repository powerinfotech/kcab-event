package com.miso.lxnn.controller.code;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.code.ComCdListDto;
import com.miso.lxnn.dto.code.ComCdSaveDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.code.ComCdService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
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
