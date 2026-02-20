package com.miso.lxnn.service.common.impl;

import com.miso.lxnn.dao.UserDao;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.exception.custom.BusinessException;
import com.miso.lxnn.service.common.ConvenienceLoginService;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;


@Service("convenienceLoginService")
public class ConvenienceLoginServiceImpl extends EgovAbstractServiceImpl implements ConvenienceLoginService {
    @Resource(name="userDao")
    private UserDao userDao;

    private final HttpSession httpSession;

    @Autowired
    public ConvenienceLoginServiceImpl(HttpSession httpSession) {
        this.httpSession = httpSession;
    }


    @Override
    public void login(String userId) throws Exception {
        LoginUser loginUser = LoginUser.covert(userDao.selectUser(userId));
        if(loginUser == null) {
            throw new BusinessException("사용자정보가 존재하지 않습니다.");
        }
        httpSession.setAttribute("user", loginUser);
    }
}
