package com.miso.lxnn.service.common.impl;

import com.miso.lxnn.dao.LoginLogDao;
import com.miso.lxnn.dao.UserDao;
import com.miso.lxnn.domain.LoginLog;
import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginRequestDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.exception.custom.BusinessException;
import com.miso.lxnn.service.common.LoginService;
import com.miso.lxnn.util.CryptoUtil;
import com.miso.lxnn.util.RequestUtil;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Slf4j
@Service("loginService")
public class LoginServiceImpl extends EgovAbstractServiceImpl implements LoginService {

    @Resource(name="userDao")
    private UserDao userDao;

    @Resource(name="loginLogDao")
    private LoginLogDao loginLogDao;

    private final HttpSession httpSession;

    @Autowired
    public LoginServiceImpl(HttpSession httpSession) {
        this.httpSession = httpSession;
    }

    @Override
    public void login(LoginRequestDto loginRequestDto, HttpServletRequest request) throws Exception {
        User user = userDao.selectUser(loginRequestDto.getUserId());

        if (user == null) {
            throw new BusinessException("사용자정보가 존재하지 않습니다.");
        }

        if (!"auto".equals(loginRequestDto.getMode())
                && !CryptoUtil.matchesPassword(loginRequestDto.getPassword(), user.getPassword())) {
            throw new BusinessException("비밀번호가 일치하지 않습니다.");
        }

        LoginUser loginUser = LoginUser.covert(user);
        httpSession.setAttribute("user", loginUser);

        try {
            loginLogDao.insertLoginLog(
                    LoginLog.builder()
                            .userSeq(loginUser.getUserSeq())
                            .accessIp(RequestUtil.getClientIp(request))
                            .userAgent(RequestUtil.getUserAgent(request))
                            .build());
        } catch (Exception e) {
            log.warn("로그인 로그 저장 실패(로그인은 정상 처리): {}", e.getMessage());
        }
    }

    @Override
    public void logout() throws Exception {
        httpSession.invalidate();
    }

}
