package com.miso.lxnn.dao;

import com.miso.lxnn.dto.code.SensorDetailList;
import com.miso.lxnn.dto.code.SensorStateNationAddrListDto;
import com.miso.lxnn.dto.code.SensorStateNationAddrParamDto;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("sensorStateDao")
public interface SensorStateDao {
    List<SensorStateNationAddrListDto> selectNationAddrNoList(SensorStateNationAddrParamDto param);
    List<SensorDetailList> selectSensorDataList(String ntnlPntNo);
}
