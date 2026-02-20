package com.miso.lxnn.service.code;

import com.miso.lxnn.dto.code.*;

import java.util.List;

public interface SensorStateService {
    SensorStateNationAddrSearchDto searchConditions() throws Exception;
    List<SensorStateNationAddrListDto> selectNationAddrNoList(SensorStateNationAddrParamDto param) throws Exception;
    List<SensorDetailList> selectSensorDataList(String ntnlPntNo) throws Exception;
}
