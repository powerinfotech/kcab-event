package com.miso.lxnn.dao;

import com.miso.lxnn.dto.auth.AuthMenuBtnListDto;
import com.miso.lxnn.dto.auth.AuthMenuMgtAuthListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("userMenuAuthDao")
public interface UserMenuAuthDao {
    List<AuthMenuMgtAuthListDto> selectUserAuthList(@Param("userId") String userId) throws Exception;

    List<AuthMenuBtnListDto> selectUserAllAuthMenuBtnList(@Param("userId") String userId) throws Exception;
}
