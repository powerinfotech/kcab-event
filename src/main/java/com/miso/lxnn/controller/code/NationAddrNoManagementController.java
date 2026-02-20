package com.miso.lxnn.controller.code;


import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.code.NationAddrNoSearchDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.code.NationAddrNoListDto;
import com.miso.lxnn.dto.code.NationAddrNoParamDto;
import com.miso.lxnn.dto.code.NationAddrNoSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.service.code.NationAddrNoService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/nation-addr")
public class NationAddrNoManagementController {

    @Resource(name = "nationAddrNoService")
    private NationAddrNoService nationAddrNoService;

    @GetMapping("/search-conditions")
    public ApiResponse<NationAddrNoSearchDto> searchConditions() throws Exception {
        //검색조건이 하나여도 구조는 맞추고 갑니다. NationAddrNoSearchDto : 검색조건 리스트 모음
        return ApiResponse.ok(nationAddrNoService.searchConditions());
    }

    @GetMapping("/list")
    public ApiResponse<List<NationAddrNoListDto>> selectNationAddrNoList(NationAddrNoParamDto param) throws Exception {
        return ApiResponse.ok(nationAddrNoService.selectNationAddrNoList(param));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveNationAddrNo(@MisoSession LoginUser user, @RequestBody List<NationAddrNoSaveDto> nationAddrNoSaveDto) throws Exception {
        nationAddrNoService.saveNationAddrNo(nationAddrNoSaveDto, user);
        return ApiResponse.ok();
    }
}
