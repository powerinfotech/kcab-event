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

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

/**
 * AuthManagementServiceImpl - {@link AuthManagementService} 구현체
 *
 * <p>권한 그룹·권한·권한-사용자를 IudType에 따라 분기 처리하며,
 * 삭제 시 연관 테이블(권한, 권한-사용자, 권한-메뉴-버튼)을 연쇄 삭제한다.</p>
 */
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
                        authManagementDao.deleteAuthMenuBtnByAuthGrpSeq(grp.getAuthGrpSeq());
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
                        authManagementDao.deleteAuthMenuBtnByAuthSeq(auth.getAuthSeq());
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
