package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.AuthManagementDao;
import com.miso.lxnn.dto.auth.AuthGrpListDto;
import com.miso.lxnn.dto.auth.AuthListDto;
import com.miso.lxnn.dto.auth.AuthManagementSaveDto;
import com.miso.lxnn.dto.auth.AuthUserListDto;
import com.miso.lxnn.dto.auth.UserSearchDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.service.auth.AuthManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@Slf4j
@Service("authManagementService")
public class AuthManagementServiceImpl extends EgovAbstractServiceImpl implements AuthManagementService {

    @Resource(name = "authManagementDao")
    private AuthManagementDao authManagementDao;

    @Override
    public List<AuthGrpListDto> selectAuthGrpList() throws Exception {
        return authManagementDao.selectAuthGrpList();
    }

    @Override
    public List<AuthListDto> selectAuthList(Integer authGrpSeq) throws Exception {
        return authManagementDao.selectAuthList(authGrpSeq);
    }

    @Override
    public List<AuthUserListDto> selectAuthUserList(Integer authGrpSeq, Integer authSeq) throws Exception {
        return authManagementDao.selectAuthUserList(authGrpSeq, authSeq);
    }

    @Override
    public List<UserSearchDto> selectUserSearchList(String searchText, Boolean excludeUnused) throws Exception {
        return authManagementDao.selectUserSearchList(searchText, excludeUnused);
    }

    @Override
    @Transactional("transactionManager")
    public void saveAuthManagement(@Valid AuthManagementSaveDto saveDto, LoginUser loginUser) throws Exception {
        if (saveDto.getAuthGrpList() != null) {
            for (AuthGrpListDto grp : saveDto.getAuthGrpList()) {
                if (grp.getIudType() == null) continue;
                switch (grp.getIudType()) {
                    case I:
                        grp.setRgstUserSeq(loginUser.getUserSeq());
                        grp.setUptUserSeq(loginUser.getUserSeq());
                        authManagementDao.insertAuthGrp(grp);
                        break;
                    case U:
                        grp.setUptUserSeq(loginUser.getUserSeq());
                        authManagementDao.updateAuthGrp(grp);
                        break;
                    case D:
                        authManagementDao.deleteAuthUserByAuthGrpSeq(grp.getAuthGrpSeq());
                        authManagementDao.deleteAuthByAuthGrpSeq(grp.getAuthGrpSeq());
                        authManagementDao.deleteAuthGrp(grp.getAuthGrpSeq());
                        break;
                }
            }
        }

        if (saveDto.getAuthList() != null) {
            for (AuthListDto auth : saveDto.getAuthList()) {
                if (auth.getIudType() == null) continue;
                switch (auth.getIudType()) {
                    case I:
                        auth.setRgstUserSeq(loginUser.getUserSeq());
                        auth.setUptUserSeq(loginUser.getUserSeq());
                        authManagementDao.insertAuth(auth);
                        break;
                    case U:
                        auth.setUptUserSeq(loginUser.getUserSeq());
                        authManagementDao.updateAuth(auth);
                        break;
                    case D:
                        authManagementDao.deleteAuthUserByAuthSeq(auth.getAuthSeq());
                        authManagementDao.deleteAuth(auth.getAuthSeq());
                        break;
                }
            }
        }

        if (saveDto.getAuthUserList() != null) {
            for (AuthUserListDto authUser : saveDto.getAuthUserList()) {
                if (authUser.getIudType() == null) continue;
                switch (authUser.getIudType()) {
                    case I:
                        authUser.setRgstUserSeq(loginUser.getUserSeq());
                        authUser.setUptUserSeq(loginUser.getUserSeq());
                        authManagementDao.insertAuthUser(authUser);
                        break;
                    case U:
                        authUser.setUptUserSeq(loginUser.getUserSeq());
                        authManagementDao.updateAuthUser(authUser);
                        break;
                    case D:
                        authManagementDao.deleteAuthUser(authUser.getAuthUserSeq());
                        break;
                }
            }
        }
    }
}
