package com.kcabEvent.service.common.impl;

import com.kcabEvent.dao.UserDao;
import com.kcabEvent.domain.User;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.common.ConvenienceLoginService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * local/dev 편의 로그인을 위해 기존 사용자 정보를 세션에 저장한다.
 */
@Service("convenienceLoginService")
public class ConvenienceLoginServiceImpl extends EgovAbstractServiceImpl implements ConvenienceLoginService {
    @Resource(name = "userDao")
    private UserDao userDao;

    private final HttpSession httpSession;

    @Autowired
    public ConvenienceLoginServiceImpl(HttpSession httpSession) {
        this.httpSession = httpSession;
    }

    @Override
    public void login(String userId) {
        User user = userDao.selectUser(userId);
        if (user == null) {
            throw new BusinessException("User information does not exist.");
        }
        httpSession.setAttribute("user", LoginUser.convert(user));
    }
}
