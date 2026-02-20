package com.miso.lxnn.service.master;

import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.AlarmListDto;
import com.miso.lxnn.dto.master.AlarmListSearchDto;

import java.util.List;

public interface AlarmService {
    List<AlarmListDto> selectAlarmList(AlarmListSearchDto AlarmListSearchDto) throws Exception;
    void updateSensorAlarm(AlarmListDto AlarmListDto) throws Exception;
    void updateSensorAlarmAll(LoginUser loginUser) throws Exception;
}
