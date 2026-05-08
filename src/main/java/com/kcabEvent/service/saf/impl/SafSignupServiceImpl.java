package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dao.SafUserDao;
import com.kcabEvent.domain.saf.SafOrganization;
import com.kcabEvent.domain.saf.SafOrganizationMember;
import com.kcabEvent.domain.saf.SafUser;
import com.kcabEvent.dto.saf.SignupRequestDto;
import com.kcabEvent.enums.saf.SafOrgMemberRole;
import com.kcabEvent.enums.saf.SafOrgStatus;
import com.kcabEvent.enums.saf.SafUserStatus;
import com.kcabEvent.enums.saf.SafUserType;
import com.kcabEvent.service.saf.SafSignupService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;

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
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }
        if (req.getBusinessNumber() != null && !req.getBusinessNumber().isBlank()) {
            if (safOrganizationDao.selectByBusinessNumber(req.getBusinessNumber()) != null) {
                throw new IllegalArgumentException("이미 등록된 사업자등록번호입니다.");
            }
        }

        SafUser user = new SafUser();
        user.setUserId(req.getUserId());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setName(req.getName());
        user.setNameEn(req.getNameEn());
        user.setPhone(req.getPhone());
        user.setUserType(SafUserType.ORGANIZATION.getCode());
        user.setStatus(SafUserStatus.PENDING.getCode());
        user.setLanguage(req.getLanguage() != null ? req.getLanguage() : "ko");
        safUserDao.insertUser(user);

        SafOrganization org = new SafOrganization();
        org.setName(req.getOrgName());
        org.setNameEn(req.getOrgNameEn());
        org.setOrgType(req.getOrgType());
        org.setBusinessNumber(req.getBusinessNumber());
        org.setRepresentativeName(req.getRepresentativeName());
        org.setContactEmail(req.getContactEmail());
        org.setContactPhone(req.getContactPhone());
        org.setAddress(req.getAddress());
        org.setWebsite(req.getWebsite());
        org.setStatus(SafOrgStatus.PENDING.getCode());
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
