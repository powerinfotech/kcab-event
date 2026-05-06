package com.kcabEvent.service.common.impl;

import com.kcabEvent.dao.LoginLogDao;
import com.kcabEvent.dao.UserDao;
import com.kcabEvent.domain.LoginLog;
import com.kcabEvent.domain.User;
import com.kcabEvent.dto.common.LoginRequestDto;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.common.LoginService;
import com.kcabEvent.util.CryptoUtil;
import com.kcabEvent.util.RequestUtil;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * LoginServiceImpl - {@link LoginService} 구현체
 *
 * <p>로그인 처리 흐름:</p>
 * <ol>
 *   <li>아이디로 사용자 조회 → 없으면 예외</li>
 *   <li>{@code mode=auto}가 아닐 경우 BCrypt 비밀번호 검증 → 불일치 시 예외</li>
 *   <li>세션에 {@link com.kcabEvent.dto.common.LoginUser} 저장</li>
 *   <li>최종 로그인 일시 갱신 (실패해도 로그인 계속)</li>
 *   <li>로그인 이력 기록 (실패해도 로그인 계속)</li>
 * </ol>
 */
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
    public void login(LoginRequestDto loginRequestDto, HttpServletRequest request) {
        User user = userDao.selectUser(loginRequestDto.getUserId());

        if (user == null) {
            throw new BusinessException("사용자정보가 존재하지 않습니다.");
        }

        if (!"auto".equals(loginRequestDto.getMode())
                && !CryptoUtil.matchesPassword(loginRequestDto.getPassword(), user.getPassword())) {
            throw new BusinessException("비밀번호가 일치하지 않습니다.");
        }

        LoginUser loginUser = LoginUser.convert(user);
        httpSession.setAttribute("user", loginUser);

        try {
            userDao.updateLoginDateTime(loginUser.getUserSeq().longValue());
        } catch (org.springframework.dao.DataAccessException e) {
            log.warn("최종 로그인일시 갱신 실패(로그인은 정상 처리): {}", e.getMessage());
        }

        try {
            loginLogDao.insertLoginLog(
                    LoginLog.builder()
                            .userSeq(loginUser.getUserSeq())
                            .accessIp(RequestUtil.getClientIp(request))
                            .userAgent(RequestUtil.getUserAgent(request))
                            .build());
        } catch (org.springframework.dao.DataAccessException e) {
            log.warn("로그인 로그 저장 실패(로그인은 정상 처리): {}", e.getMessage());
        }
    }

    @Override
    public void logout() {
        httpSession.invalidate();
    }

}
