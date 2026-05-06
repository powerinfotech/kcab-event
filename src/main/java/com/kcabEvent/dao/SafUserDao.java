package com.kcabEvent.dao;

import com.kcabEvent.domain.saf.SafUser;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

@EgovMapper("safUserDao")
public interface SafUserDao {

    SafUser selectByUserId(@Param("userId") String userId);

    SafUser selectByEmail(@Param("email") String email);

    void insertUser(SafUser user);
}
