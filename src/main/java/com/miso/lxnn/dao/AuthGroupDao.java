package com.miso.lxnn.dao;

import com.miso.lxnn.domain.AuthGroup;
import com.miso.lxnn.domain.AuthGroupMenu;
import com.miso.lxnn.domain.AuthGroupRole;
import com.miso.lxnn.dto.auth.*;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Mapper("authGroupDao")
public interface AuthGroupDao {
    List<AuthGroupListDto> selectAuthGroupList() throws Exception;
    List<AuthGroupRoleListDto> selectAuthGroupRoleList(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    List<AuthGroupMenuListDto> selectAuthGroupMenuList(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    List<UserMenuAuthGroupListDto> selectUserMenuAuthGroupList(@Param("userSeq") Integer userSeq) throws Exception;
    List<UserMenuAuthMenuListDto> selectUserMenuAuthMenuList(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    void insertAuthGroup(AuthGroup authGroup) throws Exception;
    void updateAuthGroup(AuthGroup authGroup) throws Exception;
    void deleteAuthGroup(@Param("authGrpSeq") Integer authGrpSeq) throws Exception;
    void insertAuthGroupRole(AuthGroupRole authGroupRole) throws Exception;
    void updateAuthGroupRole(AuthGroupRole authGroupRole) throws Exception;
    void deleteAuthGroupRole(@Param("authGrpRoleSeq") Integer authGrpRoleSeq) throws Exception;
    void updateAuthGroupRoleByAuthGrpSeq(AuthGroupRole authGroupRole) throws Exception;
    void updateAuthGroupRoleByRoleSeq(AuthGroupRole authGroupRole) throws Exception;
    void insertAuthGroupMenu(AuthGroupMenu authGroupMenu) throws Exception;
    void updateAuthGroupMenu(AuthGroupMenu authGroupMenu) throws Exception;
    void insertAuthGroupMenuByAuthGrp(AuthGroupMenu authGroupMenu) throws Exception;
    void updateAuthGroupMenuByAuthGrpSeq(AuthGroupMenu authGroupMenu) throws Exception;
    Integer selectAuthGroupCheck(@Param("authGrpCd") String authGrpCd) throws Exception;
}