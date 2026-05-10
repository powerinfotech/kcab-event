package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dao.SafUserDao;
import com.kcabEvent.domain.saf.SafOrganization;
import com.kcabEvent.domain.saf.SafOrganizationMember;
import com.kcabEvent.domain.saf.SafUser;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.saf.SafAdminUserDetailDto;
import com.kcabEvent.dto.saf.SafAdminUserListDto;
import com.kcabEvent.dto.saf.SafAdminUserSaveDto;
import com.kcabEvent.dto.saf.SafAdminUserSearchDto;
import com.kcabEvent.enums.saf.SafUserStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional("transactionManager")
    public void createUser(SafAdminUserSaveDto saveDto, LoginUser loginUser) {
        if (saveDto.getEmail() == null || saveDto.getEmail().isBlank()) {
            throw new BusinessException("Email is required.");
        }
        if (saveDto.getName() == null || saveDto.getName().isBlank()) {
            throw new BusinessException("Name is required.");
        }
        if (saveDto.getPassword() == null || saveDto.getPassword().isBlank()) {
            throw new BusinessException("Password is required.");
        }

        if (saveDto.getUserId() == null || saveDto.getUserId().isBlank()) {
            throw new BusinessException("User ID is required.");
        }
        String userId = saveDto.getUserId().trim();
        if (safUserDao.selectByUserId(userId) != null) {
            throw new BusinessException("This user ID already exists.");
        }
        if (safUserDao.selectByEmail(saveDto.getEmail()) != null) {
            throw new BusinessException("This email is already registered.");
        }

        SafUser user = new SafUser();
        user.setUserId(userId);
        user.setEmail(saveDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(saveDto.getPassword()));
        user.setName(saveDto.getName());
        user.setPosition(saveDto.getPosition());
        user.setUserType(saveDto.getUserType() != null ? saveDto.getUserType() : "organization");
        user.setStatus(SafUserStatus.ACTIVE.getCode());
        safUserDao.insertUser(user);

        if ("organization".equals(user.getUserType()) && saveDto.getOrganizationName() != null && !saveDto.getOrganizationName().isBlank()) {
            SafOrganization org = new SafOrganization();
            org.setName(saveDto.getOrganizationName());
            org.setOrgType(saveDto.getOrgType());
            org.setRepresentativeName(saveDto.getRepresentativeName());
            org.setContactEmail(saveDto.getContactEmail());
            org.setContactPhone(saveDto.getContactPhone());
            org.setAddress(saveDto.getAddress());
            org.setWebsite(saveDto.getWebsite());
            org.setCreatedBy(user.getUserSeq());
            safOrganizationDao.insertOrganization(org);

            SafOrganizationMember member = new SafOrganizationMember();
            member.setOrganizationSeq(org.getOrganizationSeq());
            member.setUserSeq(user.getUserSeq());
            member.setRole("owner");
            safOrganizationDao.insertOrganizationMember(member);
        }
    }

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

        if (saveDto.getPassword() != null && !saveDto.getPassword().isBlank()) {
            saveDto.setPasswordHash(passwordEncoder.encode(saveDto.getPassword()));
        }

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
        if (!isPendingUser) {
            throw new BusinessException("승인 대기 상태의 사용자만 승인할 수 있습니다.");
        }

        Long approverSeq = getLoginUserSeq(loginUser);
        safUserDao.approveAdminUser(userSeq, approverSeq);
        if (detail.getOrganizationSeq() != null) {
            safOrganizationDao.approveOrganizationByUserSeq(userSeq, approverSeq);
        }
    }

    @Override
    @Transactional("transactionManager")
    public void suspendUser(Long userSeq, LoginUser loginUser) {
        SafAdminUserDetailDto detail = selectUserDetail(userSeq);
        if (!SafUserStatus.ACTIVE.getCode().equals(detail.getStatus())) {
            throw new BusinessException("Only active users can be suspended.");
        }
        safUserDao.updateUserStatus(userSeq, SafUserStatus.SUSPENDED.getCode(), getLoginUserSeq(loginUser));
    }

    @Override
    @Transactional("transactionManager")
    public void reactivateUser(Long userSeq, LoginUser loginUser) {
        SafAdminUserDetailDto detail = selectUserDetail(userSeq);
        if (!SafUserStatus.SUSPENDED.getCode().equals(detail.getStatus())) {
            throw new BusinessException("Only suspended users can be reactivated.");
        }
        safUserDao.updateUserStatus(userSeq, SafUserStatus.ACTIVE.getCode(), getLoginUserSeq(loginUser));
    }

    @Override
    @Transactional("transactionManager")
    public void withdrawUser(Long userSeq, LoginUser loginUser) {
        SafAdminUserDetailDto detail = selectUserDetail(userSeq);
        if (SafUserStatus.WITHDRAWN.getCode().equals(detail.getStatus())) {
            throw new BusinessException("This user has already been withdrawn.");
        }
        safUserDao.updateUserStatus(userSeq, SafUserStatus.WITHDRAWN.getCode(), getLoginUserSeq(loginUser));
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
