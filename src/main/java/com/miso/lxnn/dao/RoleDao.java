package com.miso.lxnn.dao;

import com.miso.lxnn.domain.Role;
import com.miso.lxnn.domain.RoleUser;
import com.miso.lxnn.dto.auth.RoleListDto;
import com.miso.lxnn.dto.auth.RoleUserListDto;
import com.miso.lxnn.dto.auth.RoleListSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("roleDao")
public interface RoleDao {
    List<RoleListDto> selectRoleList(RoleListSearchDto roleListSearchDto) throws Exception;
    List<RoleUserListDto> selectRoleUserList(@Param("roleSeq") Integer roleSeq) throws Exception;
    void insertRole(Role role) throws Exception;
    void updateRole(Role role) throws Exception;
    void deleteRole(@Param("roleSeq") Integer roleSeq) throws Exception;
    void insertRoleUser(RoleUser roleUser) throws Exception;
    void updateRoleUser(RoleUser roleUser) throws Exception;
    void updateRoleUserUnusableByRoleSeq(RoleUser roleUser) throws Exception;
    void deleteRoleUser(RoleUser roleUser) throws Exception;
}