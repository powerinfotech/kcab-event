package com.miso.lxnn.controller.code;


import com.miso.lxnn.dto.code.*;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.service.code.SensorStateService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/sensor-state")
public class SensorStateController {

    @Resource(name = "sensorStateService")
    private SensorStateService sensorStateService;

    @GetMapping("/search-conditions")
    public ApiResponse<SensorStateNationAddrSearchDto> searchConditions() throws Exception {
        //검색조건이 하나여도 구조는 맞추고 갑니다. NationAddrNoSearchDto : 검색조건 리스트 모음
        return ApiResponse.ok(sensorStateService.searchConditions());
    }

    @GetMapping("/list")
    public ApiResponse<List<SensorStateNationAddrListDto>> selectNationAddrNoList(SensorStateNationAddrParamDto param) throws Exception {
        return ApiResponse.ok(sensorStateService.selectNationAddrNoList(param));
    }

    @GetMapping("/detail-list")
    public ApiResponse<List<SensorDetailList>> selectSensorDetailList(String ntnlPntNo) throws Exception {
        return ApiResponse.ok(sensorStateService.selectSensorDataList(ntnlPntNo));
    }
}
