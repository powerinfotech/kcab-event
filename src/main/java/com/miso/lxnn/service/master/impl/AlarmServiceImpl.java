package com.miso.lxnn.service.master.impl;

import com.miso.lxnn.dao.AlarmDao;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.AlarmListDto;
import com.miso.lxnn.dto.master.AlarmListSearchDto;
import com.miso.lxnn.service.master.AlarmService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("alarmService")
public class AlarmServiceImpl extends EgovAbstractServiceImpl implements AlarmService {
    @Resource(name="alarmDao")
    private AlarmDao alarmDao;


    @Override
    public List<AlarmListDto> selectAlarmList(AlarmListSearchDto AlarmListSearchDto) throws Exception {
        return alarmDao.selectAlarmList(AlarmListSearchDto);
    }

    @Override
    public void updateSensorAlarm(AlarmListDto AlarmListDto) throws Exception {
        alarmDao.updateSensorAlarm(AlarmListDto);
    }

    @Override
    public void updateSensorAlarmAll(LoginUser loginUser) throws Exception {
        alarmDao.updateSensorAlarmAll(loginUser.getUserSeq());
    }
}
