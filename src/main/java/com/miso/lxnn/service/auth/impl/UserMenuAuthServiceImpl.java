package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.UserMenuAuthDao;
import com.miso.lxnn.dto.auth.AuthMenuBtnListDto;
import com.miso.lxnn.dto.auth.AuthMenuMgtAuthListDto;
import com.miso.lxnn.service.auth.UserMenuAuthService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("userMenuAuthService")
public class UserMenuAuthServiceImpl extends EgovAbstractServiceImpl implements UserMenuAuthService {

    @Resource(name = "userMenuAuthDao")
    private UserMenuAuthDao userMenuAuthDao;

    @Override
    public List<AuthMenuMgtAuthListDto> selectUserAuthList(String userId) throws Exception {
        return userMenuAuthDao.selectUserAuthList(userId);
    }

    @Override
    public List<AuthMenuBtnListDto> selectUserAllAuthMenuBtnList(String userId) throws Exception {
        return userMenuAuthDao.selectUserAllAuthMenuBtnList(userId);
    }
}
