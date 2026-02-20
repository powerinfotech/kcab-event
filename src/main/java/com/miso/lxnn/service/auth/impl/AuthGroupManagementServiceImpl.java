package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.AuthGroupDao;
import com.miso.lxnn.domain.AuthGroup;
import com.miso.lxnn.domain.AuthGroupMenu;
import com.miso.lxnn.domain.AuthGroupRole;
import com.miso.lxnn.dto.auth.AuthGroupListDto;
import com.miso.lxnn.dto.auth.AuthGroupSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.exception.custom.BusinessException;
import com.miso.lxnn.service.auth.AuthGroupManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@Slf4j
@Service("authGroupManagementService")
public class AuthGroupManagementServiceImpl extends EgovAbstractServiceImpl implements AuthGroupManagementService {
    @Resource(name = "authGroupDao")
    private AuthGroupDao authGroupDao;


    @Override
    public List<AuthGroupListDto> selectAuthGroupList() throws Exception {
        return authGroupDao.selectAuthGroupList();
    }

    @Override
    @Transactional("transactionManager")
    public void saveAuthGroup(AuthGroupSaveDto authGroupSaveDto, LoginUser loginUser) throws Exception {
        authGroupSaveDto.getAuthGroupList().stream().filter(v->v.getIudType() != null).forEach(v-> {
            try {
                if(v.getIudType() == IudType.I) {
                    if (authGroupDao.selectAuthGroupCheck(v.getAuthGrpCd()) > 0) {
                        throw new BusinessException("동일한 공통코드가 존재합니다.");
                    }
                    v.setRgstUserId(loginUser.getUserId());
                    v.setUptUserId(loginUser.getUserId());
                    authGroupDao.insertAuthGroup(v);
                    AuthGroupMenu authGroupMenu = new AuthGroupMenu();
                    authGroupMenu.setAuthGrpSeq(v.getAuthGrpSeq());
                    authGroupMenu.setRgstUserId(loginUser.getUserId());
                    authGroupMenu.setUptUserId(loginUser.getUserId());
                    authGroupDao.insertAuthGroupMenuByAuthGrp(authGroupMenu);
                }
                else if(v.getIudType() == IudType.U) {
                    v.setUptUserId(loginUser.getUserId());
                    authGroupDao.updateAuthGroup(v);
                    if(!v.getUseFlag()) {
                        AuthGroupMenu authGroupMenu = new AuthGroupMenu();
                        authGroupMenu.setAuthGrpSeq(v.getAuthGrpSeq());
                        authGroupMenu.setUseFlag(false);
                        authGroupMenu.setUptUserId(loginUser.getUserId());
                        authGroupDao.updateAuthGroupMenuByAuthGrpSeq(authGroupMenu);

                        AuthGroupRole authGroupRole = new AuthGroupRole();
                        authGroupRole.setAuthGrpSeq(v.getAuthGrpSeq());
                        authGroupRole.setUseFlag(false);
                        authGroupRole.setUptUserId(loginUser.getUserId());
                        authGroupDao.updateAuthGroupRoleByAuthGrpSeq(authGroupRole);
                    }
                }
                else if(v.getIudType() == IudType.D) {
                    authGroupDao.deleteAuthGroup(v.getAuthGrpSeq());
                    AuthGroupMenu authGroupMenu = new AuthGroupMenu();
                    authGroupMenu.setAuthGrpSeq(v.getAuthGrpSeq());
                    authGroupMenu.setUseFlag(false);
                    authGroupMenu.setUptUserId(loginUser.getUserId());
                    authGroupDao.updateAuthGroupMenuByAuthGrpSeq(authGroupMenu);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
}

