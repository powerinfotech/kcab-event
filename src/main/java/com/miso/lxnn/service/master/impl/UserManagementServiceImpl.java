package com.miso.lxnn.service.master.impl;

import com.miso.lxnn.dao.UserDao;
import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.*;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.exception.custom.BusinessException;
import com.miso.lxnn.service.master.UserManagementService;
import com.miso.lxnn.util.CryptoUtil;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;
import java.util.List;

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
            user.setRgstUserId(loginUser.getUserId());
            user.setUptUserId(loginUser.getUserId());
            user.setSalt(CryptoUtil.getSalt());
            user.setPasswd(CryptoUtil.encryptSha256("1", user.getSalt()));
            userDao.insertUser(user);
        }
        else if (user.getIudType() == IudType.U) {
            user.setUptUserId(loginUser.getUserId());
            userDao.updateUser(user);
        }
    }

    @Override
    public void deleteUser(User user, LoginUser loginUser) throws Exception {
        userDao.deleteUser(user);
    }

    @Override
    public void changePassword(UserChangePasswordDto userChangePasswordDto, LoginUser LoginUser) throws Exception {
        userChangePasswordDto.setSalt(userDao.selectSalt(userChangePasswordDto.getUserId()));
        userDao.updatePassword(UserChangePasswordDto.from(userChangePasswordDto, LoginUser));
    }
}
