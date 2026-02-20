package com.miso.lxnn.dao;

import com.miso.lxnn.domain.User;
import com.miso.lxnn.dto.master.UserChangePasswordDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FindUserDao {

    User findUserId(User user);
    User findUserPassword(User user);
    void updatePassword(User user);
}
