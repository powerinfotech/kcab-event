package com.power.service.master.impl;

import com.power.dao.UserDao;
import com.power.domain.User;
import com.power.dto.common.LoginUser;
import com.power.dto.master.*;
import com.power.enums.IudType;
import com.power.exception.custom.BusinessException;
import com.power.service.master.UserManagementService;
import com.power.util.CryptoUtil;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * UserManagementServiceImpl - {@link UserManagementService} 구현체
 *
 * <p>사용자 등록 시 아이디 중복 체크와 비밀번호 필수 입력 검증을 수행하고,
 * 비밀번호는 BCrypt로 해시화하여 저장한다.</p>
 */
@Slf4j
@Service("userManagementService")
public class UserManagementServiceImpl extends EgovAbstractServiceImpl implements UserManagementService {
    @Resource(name="userDao")
    private UserDao userDao;

    @Override
    public User selectUserInfo(String userId) throws Exception {

         return userDao.selectUser(userId);
    }

    @Override
    public List<UserListDto> selectUserList(UserListSearchDto param) throws Exception {
        return userDao.selectUserList(param);
    }

    @Override
    public List<UserComboListDto> selectUserComboList(String searchText) throws Exception {
        return userDao.selectUserComboList(searchText);
    }

    @Override
    public void saveUser(UserSaveDto user, LoginUser loginUser) throws Exception {


        if(user.getIudType() == IudType.I) {
            if(userDao.selectUserIdValidation(user.getUserId())){
                throw new BusinessException("중복된 아이디입니다.");
            }
            if(user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                throw new BusinessException("비밀번호를 입력하세요.");
            }
            user.setRgstUserSeq(loginUser.getUserSeq());
            user.setUptUserSeq(loginUser.getUserSeq());
            user.setPassword(CryptoUtil.encodePassword(user.getPassword().trim()));
            userDao.insertUser(user);
        }
        else if (user.getIudType() == IudType.U) {
            user.setUptUserSeq(loginUser.getUserSeq());
            userDao.updateUser(user);
        }
    }

    @Override
    public void deleteUser(User user, LoginUser loginUser) throws Exception {
        userDao.deleteUser(user);
    }

    @Override
    public void changePassword(UserChangePasswordDto userChangePasswordDto, LoginUser LoginUser) throws Exception {
        userDao.updatePassword(UserChangePasswordDto.from(userChangePasswordDto, LoginUser));
    }
}
