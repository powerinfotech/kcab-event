package com.kcabEvent.service.common.impl;

import com.kcabEvent.dao.UserDao;
import com.kcabEvent.domain.User;
import com.kcabEvent.service.common.UserService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;

/**
 * UserServiceImpl - {@link UserService} 구현체
 *
 * <p>공통 사용자 조회 기능을 제공한다. UserDao를 통해 단순 아이디 기반 조회만 수행한다.</p>
 */
@Slf4j
@Service("userService")
public class UserServiceImpl extends EgovAbstractServiceImpl implements UserService {
    @Resource(name="userDao")
    private UserDao userDao;

    @Override
    public User selectUserInfo(String userId) {
        return userDao.selectUser(userId);
    }

}
