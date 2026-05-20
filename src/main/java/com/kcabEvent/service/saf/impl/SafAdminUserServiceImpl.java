package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dao.SafUserDao;
import com.kcabEvent.domain.saf.SafOrganization;
import com.kcabEvent.domain.saf.SafOrganizationMember;
import com.kcabEvent.domain.saf.SafUser;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.email.EmailTemplateDetailDto;
import com.kcabEvent.dto.saf.SafAdminUserDetailDto;
import com.kcabEvent.dto.saf.SafAdminUserListDto;
import com.kcabEvent.dto.saf.SafAdminUserSaveDto;
import com.kcabEvent.dto.saf.SafAdminUserSearchDto;
import com.kcabEvent.enums.saf.SafUserStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailLogService;
import com.kcabEvent.service.email.EmailTemplateService;
import com.kcabEvent.service.saf.SafAdminUserService;
import com.kcabEvent.service.saf.SafEmailVerificationService;
import com.kcabEvent.util.EmailHtmlLayout;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * SAF 사용자/기관 관리자 서비스 구현체.
 *
 * <p>SAF 가입으로 생성된 사용자와 기관 정보를 관리자가 검토하고 승인할 수 있도록 처리한다.</p>
 */
@Slf4j
@Service("safAdminUserService")
public class SafAdminUserServiceImpl extends EgovAbstractServiceImpl implements SafAdminUserService {

    private static final String SIGNUP_APPROVAL_TEMPLATE_CODE = "signup_approval";
    private static final String DEFAULT_ORGANIZATION_NAME = "KCAB International";
    private static final String EMAIL_VERIFY_PURPOSE_PROFILE = "profile-email";
    private static final String EMAIL_VERIFY_PURPOSE_CONTACT = "contact-email";

    @Resource(name = "safUserDao")
    private SafUserDao safUserDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    @Resource(name = "emailTemplateService")
    private EmailTemplateService emailTemplateService;

    @Resource(name = "safEmailVerificationService")
    private SafEmailVerificationService safEmailVerificationService;

    @Autowired
    private EmailLogService emailLogService;

    @Value("${saf.admin.login-url:https://saf.kcabinternational.or.kr/login}")
    private String adminLoginUrl;

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
            org.setContactEmail(saveDto.getContactEmail());
            org.setContactPhone(saveDto.getContactPhone());
            org.setWebsite(saveDto.getWebsite());
            org.setImageFileSeq(saveDto.getImageFileSeq());
            // 관리자가 새 조직 등록 시: 폼에 등급 입력값이 있으면 사용, 없으면 'C'
            org.setGrade(saveDto.getGrade() != null && !saveDto.getGrade().isBlank() ? saveDto.getGrade() : "C");
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
    public void updateUser(Long userSeq, SafAdminUserSaveDto saveDto, LoginUser loginUser, HttpSession session) {
        SafAdminUserDetailDto detail = selectUserDetail(userSeq);
        String requestedEmail = normalizeEmail(saveDto.getEmail());
        String currentEmail = normalizeEmail(detail.getEmail());
        String requestedContactEmail = normalizeEmail(saveDto.getContactEmail());
        String currentContactEmail = normalizeEmail(detail.getContactEmail());
        boolean emailChanged = !requestedEmail.equals(currentEmail);
        boolean contactEmailChanged = detail.getOrganizationSeq() != null
                && !requestedContactEmail.equals(currentContactEmail);

        if (!StringUtils.hasText(requestedEmail)) {
            throw new BusinessException("Email is required.");
        }

        if (emailChanged) {
            SafUser existingUser = safUserDao.selectByEmail(requestedEmail);
            if (existingUser != null && !userSeq.equals(existingUser.getUserSeq())) {
                throw new BusinessException("This email is already registered.");
            }
            if (isSelfProfileUpdate(userSeq, loginUser)
                    && !safEmailVerificationService.isVerifiedForEmail(requestedEmail, session, EMAIL_VERIFY_PURPOSE_PROFILE)) {
                throw new BusinessException("Please verify the new account email before saving.");
            }
        }

        if (contactEmailChanged && isSelfProfileUpdate(userSeq, loginUser)) {
            if (!StringUtils.hasText(requestedContactEmail)) {
                throw new BusinessException("Contact email is required.");
            }
            if (!safEmailVerificationService.isVerifiedForEmail(requestedContactEmail, session, EMAIL_VERIFY_PURPOSE_CONTACT)) {
                throw new BusinessException("Please verify the new contact email before saving.");
            }
        }

        saveDto.setUserSeq(userSeq);
        saveDto.setEmail(requestedEmail);
        saveDto.setContactEmail(requestedContactEmail);
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

        if (emailChanged && isSelfProfileUpdate(userSeq, loginUser)) {
            safEmailVerificationService.clear(session, EMAIL_VERIFY_PURPOSE_PROFILE);
        }
        if (contactEmailChanged && isSelfProfileUpdate(userSeq, loginUser)) {
            safEmailVerificationService.clear(session, EMAIL_VERIFY_PURPOSE_CONTACT);
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
        try {
            sendSignupApprovalEmail(detail);
        } catch (RuntimeException e) {
            log.warn("Failed to send sign-up approval email. userSeq={}, email={}", userSeq, detail.getEmail(), e);
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

    private boolean isSelfProfileUpdate(Long userSeq, LoginUser loginUser) {
        Long loginUserSeq = getLoginUserSeq(loginUser);
        return userSeq != null && userSeq.equals(loginUserSeq);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private void sendSignupApprovalEmail(SafAdminUserDetailDto detail) {
        if (!StringUtils.hasText(detail.getEmail())) {
            log.warn("Skipped sign-up approval email because recipient email is empty. userSeq={}", detail.getUserSeq());
            return;
        }

        EmailTemplateDetailDto template = emailTemplateService.selectTemplateDetail(SIGNUP_APPROVAL_TEMPLATE_CODE);
        if (!Boolean.TRUE.equals(template.getIsActive())) {
            log.info("Skipped sign-up approval email because template is inactive. templateCode={}", SIGNUP_APPROVAL_TEMPLATE_CODE);
            return;
        }

        Map<String, String> variables = Map.of(
                "user_name", defaultText(detail.getName(), detail.getUserId()),
                "organization_name", defaultText(detail.getOrganizationName(), DEFAULT_ORGANIZATION_NAME),
                "login_url", adminLoginUrl
        );

        String subject = renderTemplate(template.getSubject(), variables, false);
        String bodyHtml = renderTemplate(template.getBodyHtml(), variables, true);
        String emailHtml = EmailHtmlLayout.wrapTemplateBody(bodyHtml);

        emailLogService.sendHtmlAndLog(
                template.getTemplateSeq(),
                detail.getEmail(),
                detail.getName(),
                subject,
                emailHtml,
                emailHtml
        );
    }

    private String renderTemplate(String template, Map<String, String> variables, boolean escapeHtml) {
        String rendered = template == null ? "" : template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            String value = entry.getValue() == null ? "" : entry.getValue();
            if (escapeHtml) {
                value = HtmlUtils.htmlEscape(value, StandardCharsets.UTF_8.name());
            }
            rendered = rendered.replace("{{" + entry.getKey() + "}}", value);
        }
        return rendered;
    }

    private String defaultText(String value, String defaultValue) {
        if (StringUtils.hasText(value)) {
            return value.trim();
        }
        return StringUtils.hasText(defaultValue) ? defaultValue.trim() : "";
    }
}
