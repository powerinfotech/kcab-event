package com.miso.lxnn.service.code.impl;

import com.miso.lxnn.dao.ComCodeDao;
import com.miso.lxnn.dao.SensorStateDao;
import com.miso.lxnn.dto.code.*;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.service.code.SensorStateService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("sensorStateService")
public class SensorStateServiceImpl extends EgovAbstractServiceImpl implements SensorStateService {

    @Resource(name="sensorStateDao")
    private SensorStateDao sensorStateDao;


    @Resource(name="comCodeDao")
    private ComCodeDao comCodeDao;

    //검색조건
    @Override
    public SensorStateNationAddrSearchDto searchConditions() throws Exception {
        SensorStateNationAddrSearchDto searchDto = new SensorStateNationAddrSearchDto();
        searchDto.setSggList(comCodeDao.getCommonCodeList("A02").stream().map(x -> new CodeResponseDto(x.getCmNm(),x.getRefval01())).toList());
        return searchDto;
    }

    @Override
    public List<SensorStateNationAddrListDto> selectNationAddrNoList(SensorStateNationAddrParamDto param) throws Exception {
        return sensorStateDao.selectNationAddrNoList(param);
    }

    @Override
    public List<SensorDetailList> selectSensorDataList(String ntnlPntNo) throws Exception {
        return sensorStateDao.selectSensorDataList(ntnlPntNo);
    }
}