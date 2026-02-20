package com.miso.lxnn.controller.master;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.AreaListDto;
import com.miso.lxnn.dto.master.AreaListSearchDto;
import com.miso.lxnn.dto.master.SectorListDto;
import com.miso.lxnn.service.master.SetupManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/setup-mgt")
public class SetupManagementController {
    @Resource(name = "setupManagementService")
    private SetupManagementService setupManagementService;

    @GetMapping("/area-list")
    public ApiResponse<List<AreaListDto>> selectAreaList(AreaListSearchDto searchParam) throws Exception {
        return ApiResponse.ok(setupManagementService.selectAreaList(searchParam));
    }

    @GetMapping("/sector-list")
    public ApiResponse<List<SectorListDto>> selectSectorList(@RequestParam("areaSeq") Integer areaSeq) throws Exception {
        return ApiResponse.ok(setupManagementService.selectSectorList(areaSeq));
    }

    @PostMapping("/save-area")
    public ApiResponse<AreaListDto> saveArea(@MisoSession LoginUser loginUser, @RequestBody @Valid AreaListDto saveParam) throws Exception {
        setupManagementService.saveArea(loginUser, saveParam);
        return ApiResponse.ok(saveParam);
    }

    @PostMapping("/delete-area")
    public ApiResponse<Void> deleteArea(@RequestBody AreaListDto saveParam) throws Exception {
        setupManagementService.deleteArea(saveParam);
        return ApiResponse.ok();
    }

    @GetMapping("/area-cd-list")
    public ApiResponse<List<CodeResponseDto>> selectAreaCmCodeList() throws Exception {
        return ApiResponse.ok(setupManagementService.selectAreaCmCodeList());
    }


}
