package com.kcabEvent.service.auth.impl;

import com.kcabEvent.dao.UserMenuAuthDao;
import com.kcabEvent.dto.auth.AuthMenuBtnListDto;
import com.kcabEvent.dto.auth.AuthMenuMgtAuthListDto;
import com.kcabEvent.service.auth.UserMenuAuthService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
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
    public List<AuthMenuMgtAuthListDto> selectUserAuthList(String userId) {
        return userMenuAuthDao.selectUserAuthList(userId);
    }

    @Override
    public List<AuthMenuBtnListDto> selectUserAllAuthMenuBtnList(String userId) {
        return userMenuAuthDao.selectUserAllAuthMenuBtnList(userId);
    }
}
