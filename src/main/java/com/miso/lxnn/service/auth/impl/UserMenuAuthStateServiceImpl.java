package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.AuthGroupDao;
import com.miso.lxnn.dto.auth.UserMenuAuthGroupListDto;
import com.miso.lxnn.dto.auth.UserMenuAuthMenuListDto;
import com.miso.lxnn.service.auth.UserMenuAuthStateService;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("userMenuAuthStateService")
public class UserMenuAuthStateServiceImpl extends EgovAbstractServiceImpl implements UserMenuAuthStateService {
    @Resource(name="authGroupDao")
    private AuthGroupDao authGroupDao;

    @Override
    public List<UserMenuAuthGroupListDto> selectUserMenuAuthGroupList(Integer userSeq) throws Exception {
        return authGroupDao.selectUserMenuAuthGroupList(userSeq);
    }

    @Override
    public List<UserMenuAuthMenuListDto> selectUserMenuAuthMenuList(Integer authGrpSeq) throws Exception {
        return authGroupDao.selectUserMenuAuthMenuList(authGrpSeq);
    }
}
