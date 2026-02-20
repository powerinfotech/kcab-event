package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.AuthGroupDao;
import com.miso.lxnn.domain.AuthGroupMenu;
import com.miso.lxnn.dto.auth.AuthGroupMenuListDto;
import com.miso.lxnn.dto.auth.AuthGroupMenuSaveDto;
import com.miso.lxnn.dto.auth.AuthGroupMenuTreeDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.enums.MenuType;
import com.miso.lxnn.service.auth.AuthGroupMenuManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service("authGroupMenuManagementService")
public class AuthGroupMenuManagementServiceImpl extends EgovAbstractServiceImpl implements AuthGroupMenuManagementService {
    @Resource(name = "authGroupDao")
    private AuthGroupDao authGroupDao;

    @Override
    @Transactional("transactionManager")
    public List<AuthGroupMenuListDto> selectAuthGroupMenuList(Integer authGrpSeq) throws Exception {
        List<AuthGroupMenuListDto>  authGroupMenuList = authGroupDao.selectAuthGroupMenuList(authGrpSeq);
//        List<AuthGroupMenuTreeDto> result = new ArrayList<>();
//        AuthGroupMenuTreeDto root = new AuthGroupMenuTreeDto();
//        authGroupMenuList.stream()
//                .filter(authMenu->authMenu.getUpMenuId() == null)
//                .forEach(menu-> {
//                    root.setAuthGrpMenuSeq(menu.getAuthGrpMenuSeq());
//                    root.setAuthGrpCd(menu.getAuthGrpCd());
//                    root.setMenuId(menu.getMenuId());
//                    root.setMenuNm(menu.getMenuNm());
//                    root.setChildren(new ArrayList<>());
//                });
//
//        createAuthGroupMenuTree(authGroupMenuList, root);
//
//        result.add(root);
        return authGroupMenuList;
    }


    @Override
    @Transactional("transactionManager")
    public void save(LoginUser loginUser, AuthGroupMenuSaveDto authGroupMenuSaveDto, Integer authGrpSeq)  {
        this.saveAuthGroupMenu(loginUser, authGroupMenuSaveDto.getChildren(), authGrpSeq);
    }

    public void saveAuthGroupMenu(LoginUser loginUser, List<AuthGroupMenuSaveDto> authGroupMenuSaveDto, Integer authGrpSeq) {
        if(authGroupMenuSaveDto != null)
            authGroupMenuSaveDto.forEach(v-> {
                if(v.getIudType() == IudType.I) {
                    try {
                        v.setAuthGrpSeq(authGrpSeq);
                        authGroupDao.insertAuthGroupMenu(AuthGroupMenu.ofAuthGroupMenuSaveDto(v, loginUser));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
                else if(v.getIudType() == IudType.U) {
                    try {
                        authGroupDao.updateAuthGroupMenu(AuthGroupMenu.ofAuthGroupMenuSaveDto(v, loginUser));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }

                saveAuthGroupMenu(loginUser, v.getChildren(), authGrpSeq);
            });
    }

    private void createAuthGroupMenuTree(List<AuthGroupMenuListDto> authMenuList, AuthGroupMenuTreeDto parent) {
        authMenuList.stream().filter(v->v.getUpMenuId() != null
                        && v.getUpMenuId().equals(parent.getMenuId()))
                .forEach(v-> {
                    parent.getChildren().add(
                            AuthGroupMenuTreeDto
                                    .builder()
                                    .authGrpMenuSeq(v.getAuthGrpMenuSeq())
                                    .authGrpSeq(v.getAuthGrpSeq())
                                    .menuId(v.getMenuSeq())
                                    .upMenuId(v.getUpMenuId())
                                    .menuNm(v.getMenuNm())
                                    .menuTypeCd(v.getMenuTypeCd())
                                    .children(v.getMenuTypeCd() == MenuType.D ? new ArrayList<>() : null)
                                    .build());
                });

        parent.getChildren().stream().filter(v2->v2.getMenuTypeCd() == MenuType.D)
                            .forEach(v2-> {
                        createAuthGroupMenuTree(authMenuList, v2);
                    });

    }
}

