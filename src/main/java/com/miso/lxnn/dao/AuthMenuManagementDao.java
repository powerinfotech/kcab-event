package com.miso.lxnn.dao;

import com.miso.lxnn.domain.AuthMenuBtn;
import com.miso.lxnn.dto.auth.AuthMenuBtnListDto;
import com.miso.lxnn.dto.auth.AuthMenuMgtAuthListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("authMenuManagementDao")
public interface AuthMenuManagementDao {
    List<AuthMenuMgtAuthListDto> selectAuthListWithGroup() throws Exception;

    List<AuthMenuBtnListDto> selectAuthMenuBtnList(
            @Param("authGrpSeq") Integer authGrpSeq,
            @Param("authSeq") Integer authSeq
    ) throws Exception;

    void insertAuthMenuBtn(AuthMenuBtn authMenuBtn) throws Exception;

    void updateAuthMenuBtn(AuthMenuBtn authMenuBtn) throws Exception;
}
