package com.miso.lxnn.service.common.impl;

import com.miso.lxnn.dao.UserDao;
import com.miso.lxnn.domain.User;
import com.miso.lxnn.service.common.UserService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Slf4j
@Service("userService")
public class UserServiceImpl extends EgovAbstractServiceImpl implements UserService {
    @Resource(name="userDao")
    private UserDao userDao;

    @Override
    public User selectUserInfo(String userId) throws Exception {
        return userDao.selectUser(userId);
    }

}
