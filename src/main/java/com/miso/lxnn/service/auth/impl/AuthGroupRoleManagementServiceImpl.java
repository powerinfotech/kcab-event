package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.AuthGroupDao;
import com.miso.lxnn.dto.auth.AuthGroupListDto;
import com.miso.lxnn.dto.auth.AuthGroupRoleListDto;
import com.miso.lxnn.dto.auth.AuthGroupRoleSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.service.auth.AuthGroupRoleManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service("authGroupRoleManagementService")
public class AuthGroupRoleManagementServiceImpl extends EgovAbstractServiceImpl implements AuthGroupRoleManagementService {
    @Resource(name = "authGroupDao")
    private AuthGroupDao authGroupDao;


    @Override
    public List<AuthGroupListDto> selectAuthGroupList() throws Exception {
        return authGroupDao.selectAuthGroupList();
    }

    @Override
    public List<AuthGroupRoleListDto> selectAuthGroupRoleList(Integer authGrpSeq) throws Exception {
        return authGroupDao.selectAuthGroupRoleList(authGrpSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void saveAuthGroupRole(AuthGroupRoleSaveDto authGroupRoleSaveDto, LoginUser loginUser) throws Exception {
        authGroupRoleSaveDto.getAuthGroupRoleList().stream().filter(v->v.getIudType() != null).forEach(v-> {
            try {
                if(v.getIudType() == IudType.I) {
                    v.setRgstUserId(loginUser.getUserId());
                    v.setUptUserId(loginUser.getUserId());
                    authGroupDao.insertAuthGroupRole(v);
                }
                else if(v.getIudType() == IudType.U) {
                    v.setUptUserId(loginUser.getUserId());
                    if(!v.getUseFlag()) v.setEndDate(LocalDate.now());
                    authGroupDao.updateAuthGroupRole(v);
                }
                else if(v.getIudType() == IudType.D) {
                    authGroupDao.deleteAuthGroupRole(v.getAuthGrpRoleSeq());
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
}

