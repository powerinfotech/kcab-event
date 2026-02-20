package com.miso.lxnn.controller.master;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.InstListDto;
import com.miso.lxnn.dto.master.InstListSearchDto;
import com.miso.lxnn.dto.master.InstSaveDto;
import com.miso.lxnn.service.master.InstManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/inst-mgt")
public class InstManagementController {

    @Resource(name="InstManagementService")
    private InstManagementService instManagementService;

    @GetMapping("search-conditions")
    public ApiResponse<List<CodeResponseDto>> searchConditions(){
        return ApiResponse.ok(instManagementService.searchConditions());
    }

    @GetMapping("/inst-list")
    public ApiResponse<List<InstListDto>> selectInstList(InstListSearchDto instListSearchDto) throws Exception {
        return ApiResponse.ok(instManagementService.selectInst(instListSearchDto));
    }
    @PostMapping("/save-inst")
    public ApiResponse<Integer> saveInst(@MisoSession LoginUser LoginUser, @RequestBody @Valid InstSaveDto instSaveDto) throws Exception{
        Integer InstSeq=instManagementService.saveInst(instSaveDto,LoginUser);
        return ApiResponse.ok(InstSeq);
    }
    @PostMapping("/delete-inst")
    public ApiResponse<Void> deleteInst(@MisoSession LoginUser LoginUser, @RequestBody InstSaveDto instSaveDto) throws Exception{
        instManagementService.deleteInst(instSaveDto,LoginUser);
        return ApiResponse.ok();
    }
}
