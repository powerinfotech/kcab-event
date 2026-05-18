package com.kcabEvent.service.common.impl;

import com.kcabEvent.dao.LoginLogDao;
import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dao.SafUserDao;
import com.kcabEvent.dao.UserDao;
import com.kcabEvent.domain.LoginLog;
import com.kcabEvent.domain.User;
import com.kcabEvent.domain.saf.SafUser;
import com.kcabEvent.dto.common.LoginRequestDto;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.enums.saf.SafUserStatus;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.common.LoginService;
import com.kcabEvent.util.CryptoUtil;
import com.kcabEvent.util.RequestUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/**
 * 기존 사용자 로그인/로그아웃을 구현하고 기존 사용자 조회가 불가할 때 SAF 사용자로 대체 조회한다.
 */
@Slf4j
@Service("loginService")
public class LoginServiceImpl extends EgovAbstractServiceImpl implements LoginService {

    @Resource(name = "userDao")
    private UserDao userDao;

    @Resource(name = "loginLogDao")
    private LoginLogDao loginLogDao;

    @Resource(name = "safUserDao")
    private SafUserDao safUserDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    private final HttpSession httpSession;

    @Autowired
    public LoginServiceImpl(HttpSession httpSession) {
        this.httpSession = httpSession;
    }

    @Override
    public void login(LoginRequestDto loginRequestDto, HttpServletRequest request) {
        User user = null;
        try {
            user = userDao.selectUser(loginRequestDto.getUserId());
        } catch (DataAccessException e) {
            log.warn("Legacy user lookup failed; falling back to SAF users: {}", e.getMessage());
        }

        if (user == null) {
            loginSafUser(loginRequestDto);
            return;
        }

        if (!"auto".equals(loginRequestDto.getMode())
                && !CryptoUtil.matchesPassword(loginRequestDto.getPassword(), user.getPassword())) {
            throw new BusinessException("The password does not match.");
        }

        LoginUser loginUser = LoginUser.convert(user);
        httpSession.setAttribute("user", loginUser);

        try {
            userDao.updateLoginDateTime(loginUser.getUserSeq().longValue());
        } catch (DataAccessException e) {
            log.warn("Failed to update last login time; login will continue: {}", e.getMessage());
        }

        try {
            loginLogDao.insertLoginLog(
                    LoginLog.builder()
                            .userSeq(loginUser.getUserSeq())
                            .accessIp(RequestUtil.getClientIp(request))
                            .userAgent(RequestUtil.getUserAgent(request))
                            .build());
        } catch (DataAccessException e) {
            log.warn("Failed to insert login log; login will continue: {}", e.getMessage());
        }
    }

    private void loginSafUser(LoginRequestDto loginRequestDto) {
        SafUser safUser = safUserDao.selectByUserId(loginRequestDto.getUserId());
        if (safUser == null) {
            throw new BusinessException("User information does not exist.");
        }

        if (!SafUserStatus.ACTIVE.getCode().equals(safUser.getStatus())) {
            throw new BusinessException("You can sign in after administrator approval.");
        }

        if (!"auto".equals(loginRequestDto.getMode())
                && !CryptoUtil.matchesPassword(loginRequestDto.getPassword(), safUser.getPasswordHash())) {
            throw new BusinessException("The password does not match.");
        }

        LoginUser loginUser = LoginUser.convert(safUser);
        loginUser.setOrganizationName(safOrganizationDao.selectOrganizationNameByUserSeq(safUser.getUserSeq()));
        httpSession.setAttribute("user", loginUser);
    }

    @Override
    public void logout() {
        httpSession.invalidate();
    }
}
