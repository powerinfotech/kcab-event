package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dao.SafUserDao;
import com.kcabEvent.domain.saf.SafOrganization;
import com.kcabEvent.domain.saf.SafOrganizationMember;
import com.kcabEvent.domain.saf.SafUser;
import com.kcabEvent.dto.saf.SignupRequestDto;
import com.kcabEvent.enums.saf.SafOrgMemberRole;

import com.kcabEvent.enums.saf.SafUserStatus;
import com.kcabEvent.enums.saf.SafUserType;
import com.kcabEvent.service.saf.SafSignupService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 승인 대기 사용자, 조직, 소유자 멤버십을 생성해 SAF 조직 가입을 구현한다.
 */
@Slf4j
@Service("safSignupService")
public class SafSignupServiceImpl extends EgovAbstractServiceImpl implements SafSignupService {

    @Resource(name = "safUserDao")
    private SafUserDao safUserDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional("transactionManager")
    public void signup(SignupRequestDto req) {
        if (existsByUserId(req.getUserId())) {
            throw new IllegalArgumentException("This user ID is already in use.");
        }
        if (existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("This email is already registered.");
        }

        SafUser user = new SafUser();
        user.setUserId(req.getUserId());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setName(req.getName());
        user.setPosition(req.getPosition());
        user.setUserType(SafUserType.ORGANIZATION.getCode());
        user.setStatus(SafUserStatus.PENDING.getCode());
        safUserDao.insertUser(user);

        SafOrganization org = new SafOrganization();
        org.setName(req.getOrgName());
        org.setOrgType(req.getOrgType());
        org.setContactEmail(req.getContactEmail());
        org.setContactPhone(req.getContactPhone());
        org.setWebsite(req.getWebsite());
        // 신규 가입 시 등급은 기본값 'C'로 강제 (관리자가 추후 변경)
        org.setGrade("C");
        org.setCreatedBy(user.getUserSeq());
        safOrganizationDao.insertOrganization(org);

        SafOrganizationMember member = new SafOrganizationMember();
        member.setOrganizationSeq(org.getOrganizationSeq());
        member.setUserSeq(user.getUserSeq());
        member.setRole(SafOrgMemberRole.OWNER.getCode());
        safOrganizationDao.insertOrganizationMember(member);
    }

    @Override
    public boolean existsByUserId(String userId) {
        return safUserDao.selectByUserId(userId) != null;
    }

    @Override
    public boolean existsByEmail(String email) {
        return safUserDao.selectByEmail(email) != null;
    }
}
