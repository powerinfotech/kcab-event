package com.miso.lxnn.service.stats.impl;


import com.miso.lxnn.dao.LoginLogDao;
import com.miso.lxnn.dto.stats.AccessLogListDto;
import com.miso.lxnn.dto.stats.AccessLogListParam;
import com.miso.lxnn.dto.stats.AccessLogSearchUserListDto;
import com.miso.lxnn.service.stats.AccessService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("accessService")
public class AccessServiceImpl extends EgovAbstractServiceImpl implements AccessService {

    @Resource(name="loginLogDao")
    private LoginLogDao loginLogDao;

    @Override
    public List<AccessLogSearchUserListDto> selectUserList(String searchText) throws Exception {
        return loginLogDao.selectUserList(searchText);
    }

    @Override
    public List<AccessLogListDto> selectLogList(AccessLogListParam param) throws Exception {
        return loginLogDao.selectLogList(param);
    }
}
