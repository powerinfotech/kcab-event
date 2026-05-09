package com.kcabEvent.dao;

import com.kcabEvent.domain.saf.SafUser;
import com.kcabEvent.dto.saf.SafAdminUserDetailDto;
import com.kcabEvent.dto.saf.SafAdminUserListDto;
import com.kcabEvent.dto.saf.SafAdminUserSaveDto;
import com.kcabEvent.dto.saf.SafAdminUserSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("safUserDao")
public interface SafUserDao {

    SafUser selectByUserId(@Param("userId") String userId);

    SafUser selectByEmail(@Param("email") String email);

    void insertUser(SafUser user);

    List<SafAdminUserListDto> selectAdminUserList(SafAdminUserSearchDto searchDto);

    SafAdminUserDetailDto selectAdminUserDetail(@Param("userSeq") Long userSeq);

    int updateAdminUser(SafAdminUserSaveDto saveDto);

    int approveAdminUser(@Param("userSeq") Long userSeq, @Param("updatedBy") Long updatedBy);
}
