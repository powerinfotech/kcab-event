package com.power.service.auth.impl;

import com.power.dao.AuthMenuManagementDao;
import com.power.domain.AuthMenuBtn;
import com.power.dto.auth.AuthMenuBtnListDto;
import com.power.dto.auth.AuthMenuBtnSaveItemDto;
import com.power.dto.auth.AuthMenuMgtAuthListDto;
import com.power.dto.common.LoginUser;
import com.power.enums.IudType;
import com.power.service.auth.AuthMenuManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * AuthMenuManagementServiceImpl - {@link AuthMenuManagementService} 구현체
 *
 * <p>권한-메뉴-버튼 매핑을 IudType에 따라 INSERT / UPDATE 처리한다.
 * (DELETE는 지원하지 않음 — 사용 여부 {@code useYn} 필드로 비활성화만 한다.)</p>
 */
@Slf4j
@Service("authMenuManagementService")
public class AuthMenuManagementServiceImpl extends EgovAbstractServiceImpl implements AuthMenuManagementService {

    @Resource(name = "authMenuManagementDao")
    private AuthMenuManagementDao authMenuManagementDao;

    @Override
    public List<AuthMenuMgtAuthListDto> selectAuthListWithGroup(String authNm) throws Exception {
        return authMenuManagementDao.selectAuthListWithGroup(authNm);
    }

    @Override
    public List<AuthMenuBtnListDto> selectAuthMenuBtnList(Integer authGrpSeq, Integer authSeq) throws Exception {
        return authMenuManagementDao.selectAuthMenuBtnList(authGrpSeq, authSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void save(LoginUser loginUser, Integer authGrpSeq, Integer authSeq,
                     List<AuthMenuBtnSaveItemDto> saveList) throws Exception {
        if (saveList == null) return;

        for (AuthMenuBtnSaveItemDto item : saveList) {
            if (item.getIudType() == null) continue;

            AuthMenuBtn entity = new AuthMenuBtn();
            entity.setAuthMenuBtnSeq(item.getAuthMenuBtnSeq());
            entity.setAuthGrpSeq(authGrpSeq);
            entity.setAuthSeq(authSeq);
            entity.setMenuSeq(item.getMenuSeq());
            entity.setBtnSeq(item.getBtnSeq());
            entity.setUseYn(item.getUseYn());
            entity.setRgstUserSeq(loginUser.getUserSeq());
            entity.setUptUserSeq(loginUser.getUserSeq());

            switch (item.getIudType()) {
                case I:
                    authMenuManagementDao.insertAuthMenuBtn(entity);
                    break;
                case U:
                    authMenuManagementDao.updateAuthMenuBtn(entity);
                    break;
            }
        }
    }
}
