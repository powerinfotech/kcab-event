package com.miso.lxnn.dao;

import com.miso.lxnn.dto.master.AlarmListDto;
import com.miso.lxnn.dto.master.AlarmListSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("alarmDao")
public interface AlarmDao {
    List<AlarmListDto> selectAlarmList(AlarmListSearchDto AlarmListSearchDto) throws Exception;
    void updateSensorAlarm(AlarmListDto AlarmListDto) throws Exception;
    void updateSensorAlarmAll(@Param("userSeq") int userSeq) throws Exception;
}