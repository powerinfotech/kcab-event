package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.FindUserDao;
import com.miso.lxnn.dao.UserDao;
import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.UserChangePasswordDto;
import com.miso.lxnn.service.auth.FindUserService;
import com.miso.lxnn.util.CryptoUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * FindUserServiceImpl - {@link FindUserService} 구현체
 *
 * <p>아이디·비밀번호 찾기 조회와 비밀번호 재설정을 처리한다.
 * 비밀번호 재설정 시 BCrypt 해시화 후 DB에 저장하고 {@code passwordSetFlag}를 {@code true}로 갱신한다.</p>
 */
@Slf4j
@Service("findUserService")
public class FindUserServiceImpl implements FindUserService {

    @Resource(name = "findUserDao")
    private FindUserDao findUserDao;
    @Autowired
    private UserDao userDao;

    @Override
    public User findUserId(User user) {
        return findUserDao.findUserId(user);
    }

    @Override
    public User findUserPassword(User user) {
        return findUserDao.findUserPassword(user);
    }

    @Override
    public void changePassword(UserChangePasswordDto userChangePasswordDto) throws Exception {
        User user = userDao.selectUser(userChangePasswordDto.getUserId());
        user.setPasswordSetFlag(true);
        user.setPassword(CryptoUtil.encodePassword(userChangePasswordDto.getPassword()));
        user.setUptUserSeq(user.getUserSeq() != null ? user.getUserSeq() : null);

        userDao.updatePassword(user);
    }
}
