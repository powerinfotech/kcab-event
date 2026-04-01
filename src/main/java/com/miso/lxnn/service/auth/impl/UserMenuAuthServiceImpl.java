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

/**
 * UserMenuAuthServiceImpl - {@link UserMenuAuthService} 구현체
 *
 * <p>사용자에게 부여된 권한 목록과 해당 권한으로 접근 가능한 메뉴-버튼 목록을 조회한다.</p>
 */
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
