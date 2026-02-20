package com.miso.lxnn.controller.master;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.CommonCodeSaveDto;
import com.miso.lxnn.dto.master.CommonCodeListDto;
import com.miso.lxnn.dto.master.CommonCodeListParamDto;
import com.miso.lxnn.domain.CommonGrpCode;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.master.CommonGrpCodeListDto;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.master.impl.ComCodeManagementServiceImpl;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/common-code")
public class ComCodeManagementController {

    @Resource(name = "comCodeService")
    private ComCodeManagementServiceImpl comCodeService;

    @GetMapping("/grp-list")
    public ApiResponse<List<CommonGrpCodeListDto>> commonGrpCodeList(String searchText) throws Exception {
        return ApiResponse.ok(comCodeService.selectCommonGrpCodeList(searchText));
    }

    @PostMapping("/grp-save")
    public ApiResponse<Void> commonGrpCodeSave(@MisoSession LoginUser LoginUser, @RequestBody List<CommonGrpCode> commonCodeGrpList) throws Exception {
        comCodeService.setCommonGrpCodeSave(LoginUser,commonCodeGrpList);
        return ApiResponse.ok();
    }

    @GetMapping("/list")
    public ApiResponse<List<CommonCodeListDto>> commonCodeList(CommonCodeListParamDto param) throws Exception {
        return ApiResponse.ok(comCodeService.selectCommonCodeList(param));
    }

    @PostMapping("/save")
    public ApiResponse<Void> commonCodeSave(@MisoSession LoginUser LoginUser, @RequestBody List<CommonCodeSaveDto> commonCodeList) throws Exception {
        comCodeService.setCommonCodeSave(LoginUser,commonCodeList);
        return ApiResponse.ok();
    }

    @GetMapping("/grp-select-list")
    public ApiResponse<List<CodeResponseDto>> commonGrpCodeList() throws Exception {
        return ApiResponse.ok(comCodeService.selectCommonGrpCodeSelectList());
    }
}
