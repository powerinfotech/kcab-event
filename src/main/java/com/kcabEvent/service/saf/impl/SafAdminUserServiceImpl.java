package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dao.SafUserDao;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.saf.SafAdminUserDetailDto;
import com.kcabEvent.dto.saf.SafAdminUserListDto;
import com.kcabEvent.dto.saf.SafAdminUserSaveDto;
import com.kcabEvent.dto.saf.SafAdminUserSearchDto;
import com.kcabEvent.enums.saf.SafOrgStatus;
import com.kcabEvent.enums.saf.SafUserStatus;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.saf.SafAdminUserService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * SAF 사용자/기관 관리자 서비스 구현체.
 *
 * <p>SAF 가입으로 생성된 사용자와 기관 정보를 관리자가 검토하고 승인할 수 있도록 처리한다.</p>
 */
@Slf4j
@Service("safAdminUserService")
public class SafAdminUserServiceImpl extends EgovAbstractServiceImpl implements SafAdminUserService {

    @Resource(name = "safUserDao")
    private SafUserDao safUserDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    @Override
    public List<SafAdminUserListDto> selectUserList(SafAdminUserSearchDto searchDto) {
        return safUserDao.selectAdminUserList(searchDto);
    }

    @Override
    public SafAdminUserDetailDto selectUserDetail(Long userSeq) {
        SafAdminUserDetailDto detail = safUserDao.selectAdminUserDetail(userSeq);
        if (detail == null) {
            throw new BusinessException("사용자 정보를 찾을 수 없습니다.");
        }
        return detail;
    }

    @Override
    @Transactional("transactionManager")
    public void updateUser(Long userSeq, SafAdminUserSaveDto saveDto, LoginUser loginUser) {
        SafAdminUserDetailDto detail = selectUserDetail(userSeq);

        saveDto.setUserSeq(userSeq);
        saveDto.setOrganizationSeq(detail.getOrganizationSeq());
        saveDto.setUpdatedBy(getLoginUserSeq(loginUser));

        int updatedCount = safUserDao.updateAdminUser(saveDto);
        if (updatedCount == 0) {
            throw new BusinessException("수정할 사용자 정보를 찾을 수 없습니다.");
        }

        if (detail.getOrganizationSeq() != null) {
            safOrganizationDao.updateAdminOrganization(saveDto);
        }
    }

    @Override
    @Transactional("transactionManager")
    public void approveUser(Long userSeq, LoginUser loginUser) {
        SafAdminUserDetailDto detail = selectUserDetail(userSeq);
        boolean isPendingUser = SafUserStatus.PENDING.getCode().equals(detail.getStatus());
        boolean isPendingOrg = SafOrgStatus.PENDING.getCode().equals(detail.getOrganizationStatus());
        if (!isPendingUser && !isPendingOrg) {
            throw new BusinessException("승인 대기 상태의 사용자만 승인할 수 있습니다.");
        }

        Long approverSeq = getLoginUserSeq(loginUser);
        safUserDao.approveAdminUser(userSeq, approverSeq);
        if (detail.getOrganizationSeq() != null) {
            safOrganizationDao.approveOrganizationByUserSeq(userSeq, approverSeq);
        }
    }

    /**
     * 세션 사용자 번호를 Long 타입으로 변환한다.
     */
    private Long getLoginUserSeq(LoginUser loginUser) {
        return loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;
    }
}
