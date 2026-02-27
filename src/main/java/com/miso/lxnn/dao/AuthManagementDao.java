package com.miso.lxnn.dao;

import com.miso.lxnn.domain.Auth;
import com.miso.lxnn.domain.AuthGrp;
import com.miso.lxnn.domain.AuthUser;
import com.miso.lxnn.dto.auth.AuthGrpListDto;
import com.miso.lxnn.dto.auth.AuthListDto;
import com.miso.lxnn.dto.auth.AuthUserListDto;
import com.miso.lxnn.dto.auth.UserSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("authManagementDao")
public interface AuthManagementDao {
    List<AuthGrpListDto> selectAuthGrpList() throws Exception;
    void insertAuthGrp(AuthGrp authGrp) throws Exception;
    void updateAuthGrp(AuthGrp authGrp) throws Exception;
    void deleteAuthGrp(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;

    List<AuthListDto> selectAuthList(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    void insertAuth(Auth auth) throws Exception;
    void updateAuth(Auth auth) throws Exception;
    void deleteAuth(@Param("authSeq") Integer authSeq) throws Exception;

    List<AuthUserListDto> selectAuthUserList(@Param("authGrpSeq") Integer authGrpSeq, @Param("authSeq") Integer authSeq) throws Exception;
    void insertAuthUser(AuthUser authUser) throws Exception;
    void updateAuthUser(AuthUser authUser) throws Exception;
    void deleteAuthUser(@Param("authUserSeq") Integer authUserSeq) throws Exception;
    void deleteAuthUserByAuthSeq(@Param("authSeq") Integer authSeq) throws Exception;
    void deleteAuthByAuthGrpSeq(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    void deleteAuthUserByAuthGrpSeq(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    void deleteAuthMenuBtnByAuthSeq(@Param("authSeq") Integer authSeq) throws Exception;
    void deleteAuthMenuBtnByAuthGrpSeq(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;

    List<UserSearchDto> selectUserSearchList(@Param("searchText") String searchText, @Param("excludeUnused") Boolean excludeUnused) throws Exception;
}
