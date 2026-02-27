package com.miso.lxnn.dao;

import com.miso.lxnn.domain.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FindUserDao {

    User findUserId(User user);
    User findUserPassword(User user);
}
