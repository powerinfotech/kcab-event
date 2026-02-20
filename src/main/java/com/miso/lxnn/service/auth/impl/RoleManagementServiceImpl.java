package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.AuthGroupDao;
import com.miso.lxnn.dao.RoleDao;
import com.miso.lxnn.domain.AuthGroupRole;
import com.miso.lxnn.domain.RoleUser;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.auth.RoleListDto;
import com.miso.lxnn.dto.auth.RoleSaveDto;
import com.miso.lxnn.dto.auth.RoleUserListDto;
import com.miso.lxnn.dto.auth.RoleListSearchDto;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.service.auth.RoleManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service("roleManagementService")
public class RoleManagementServiceImpl extends EgovAbstractServiceImpl implements RoleManagementService {
    @Resource(name = "roleDao")
    private RoleDao roleDao;

    @Resource(name = "authGroupDao")
    private AuthGroupDao authGroupDao;

    @Override
    public List<RoleListDto> selectRoleList(RoleListSearchDto roleListSearchDto) throws Exception {
        return roleDao.selectRoleList(roleListSearchDto);
    }

    @Override
    public List<RoleUserListDto> selectRoleUserList(Integer roleSeq) throws Exception {
        return roleDao.selectRoleUserList(roleSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void saveRole(RoleSaveDto roleSaveDto, LoginUser loginUser) {
        roleSaveDto.getRoleList().stream().filter(v->v.getIudType() != null).forEach(v-> {
            try {
                if(v.getIudType() == IudType.I) {
                    v.setRgstUserId(loginUser.getUserId());
                    v.setUptUserId(loginUser.getUserId());
                    roleDao.insertRole(v);
                }
                else if(v.getIudType() == IudType.U) {
                    v.setUptUserId(loginUser.getUserId());
                    roleDao.updateRole(v);
                    if(!v.getUseFlag()) {
                        RoleUser roleUser = new RoleUser();
                        roleUser.setRoleSeq(v.getRoleSeq());
                        roleUser.setUptUserId(loginUser.getUserId());
                        roleDao.updateRoleUserUnusableByRoleSeq(roleUser);
                        /*AuthGroupRole authGroupRole = new AuthGroupRole();
                        authGroupRole.setRoleSeq(v.getRoleSeq());
                        authGroupRole.setEndDate(LocalDate.now());
                        authGroupRole.setUptUserId(loginUser.getUserId());
                        authGroupRole.setUseFlag(false);
                        authGroupDao.updateAuthGroupRoleByRoleSeq(authGroupRole);*/
                    }

                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

        roleSaveDto.getRoleUserList().stream().filter(v->v.getIudType() != null).forEach(v-> {
            try {
                if(v.getIudType() == IudType.I) {
                    v.setRgstUserId(loginUser.getUserId());
                    v.setUptUserId(loginUser.getUserId());
                    roleDao.insertRoleUser(v);
                }
                else if(v.getIudType() == IudType.U) {
                    v.setUptUserId(loginUser.getUserId());
                    if(!v.getUseFlag()) v.setEndDate(LocalDate.now());
                    else v.setEndDate(null);
                    roleDao.updateRoleUser(v);

                }
                else if(v.getIudType() == IudType.D) {
                    roleDao.deleteRoleUser(v);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

        roleSaveDto.getRoleList().stream().filter(v->v.getIudType() != null).forEach(v-> {
            try {
                if(v.getIudType() == IudType.D) {
                    roleDao.deleteRole(v.getRoleSeq());
                    RoleUser roleUser = new RoleUser();
                    roleUser.setRoleSeq(v.getRoleSeq());
                    roleDao.deleteRoleUser(roleUser);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
}

