package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dao.SafSettingsDao;
import com.kcabEvent.dto.settings.OrganizationGradeLimitDto;
import com.kcabEvent.dto.settings.SettingsCodeDto;
import com.kcabEvent.dto.settings.SettingsGroupDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.saf.SafSettingsService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("safSettingsService")
public class SafSettingsServiceImpl extends EgovAbstractServiceImpl implements SafSettingsService {

    @Resource(name = "safSettingsDao")
    private SafSettingsDao safSettingsDao;

    @Override
    @Transactional("transactionManager")
    public List<SettingsGroupDto> selectSettingsGroups() {
        ensureOrganizationGradeCodeDefaults();
        return safSettingsDao.selectSettingsGroups();
    }

    @Override
    @Transactional("transactionManager")
    public void saveSettingsGroups(List<SettingsGroupDto> groups, Long updatedBy) {
        ensureOrganizationGradeCodeDefaults();
        if (groups == null || groups.isEmpty()) {
            throw new BusinessException("No setting groups were provided.");
        }

        for (SettingsGroupDto group : groups) {
            if (group.getComGrpCd() == null || group.getComGrpCd().isBlank()) {
                throw new BusinessException("Common code group is required.");
            }
            group.setComGrpCd(group.getComGrpCd().trim().toUpperCase());
            group.setComGrpCdNm(group.getComGrpCdNm() == null || group.getComGrpCdNm().isBlank()
                    ? group.getComGrpCd()
                    : group.getComGrpCdNm().trim());
            group.setUpdatedBy(updatedBy);

            if ("D".equals(group.getIudType())) {
                safSettingsDao.deleteSettingsGroup(group);
            } else {
                safSettingsDao.upsertSettingsGroup(group);
            }
        }
    }

    @Override
    @Transactional("transactionManager")
    public List<SettingsCodeDto> selectSettingsCodes(String comGrpCd) {
        ensureOrganizationGradeCodeDefaults();
        String normalizedGroupCode = normalizeGroupCode(comGrpCd);
        return safSettingsDao.selectSettingsCodes(normalizedGroupCode);
    }

    @Override
    @Transactional("transactionManager")
    public void saveSettingsCodes(String comGrpCd, List<SettingsCodeDto> codes, Long updatedBy) {
        ensureOrganizationGradeCodeDefaults();
        String normalizedGroupCode = normalizeGroupCode(comGrpCd);
        if (codes == null || codes.isEmpty()) {
            throw new BusinessException("No settings were provided.");
        }

        for (SettingsCodeDto code : codes) {
            if (code.getComCd() == null || code.getComCd().isBlank()) {
                throw new BusinessException("Code is required.");
            }
            code.setComGrpCd(normalizedGroupCode);
            code.setComCd(code.getComCd().trim().toUpperCase());
            code.setUpdatedBy(updatedBy);
            if ("D".equals(code.getIudType())) {
                safSettingsDao.deleteSettingsCode(code);
                continue;
            }
            code.setComCdNm(code.getComCdNm() == null || code.getComCdNm().isBlank()
                    ? code.getComCd()
                    : code.getComCdNm().trim());
            safSettingsDao.upsertSettingsCode(code);
        }
    }

    @Override
    @Transactional("transactionManager")
    public List<OrganizationGradeLimitDto> selectOrganizationGradeLimits() {
        ensureOrganizationGradeCodeDefaults();
        return safSettingsDao.selectOrganizationGradeLimits();
    }

    @Override
    @Transactional("transactionManager")
    public void saveOrganizationGradeLimits(List<OrganizationGradeLimitDto> limits, Long updatedBy) {
        ensureOrganizationGradeCodeDefaults();
        if (limits == null || limits.isEmpty()) {
            throw new BusinessException("No settings were provided.");
        }

        for (OrganizationGradeLimitDto limit : limits) {
            if (limit.getGrade() == null || limit.getGrade().isBlank()) {
                throw new BusinessException("Grade is required.");
            }
            if (limit.getMaxEventCount() == null || limit.getMaxEventCount() < 0) {
                throw new BusinessException("Hosted event limit must be 0 or greater.");
            }
            limit.setGrade(limit.getGrade().trim().toUpperCase());
            limit.setGradeName(limit.getGradeName() == null || limit.getGradeName().isBlank()
                    ? limit.getGrade()
                    : limit.getGradeName().trim());
            limit.setUpdatedBy(updatedBy);
            safSettingsDao.upsertOrganizationGradeLimit(limit);
        }
    }

    @Override
    public void ensureOrganizationGradeCodeDefaults() {
        ensureCommonCodeTables();
        safSettingsDao.insertOrganizationGradeCodeGroupIfMissing();
        safSettingsDao.insertDefaultOrganizationGradeCodesIfMissing();
        safSettingsDao.insertParticipantTypeCodeGroupIfMissing();
        safSettingsDao.insertDefaultParticipantTypeCodesIfMissing();
    }

    @Override
    public void ensureParticipantTypeCodeDefaults() {
        ensureCommonCodeTables();
        safSettingsDao.insertParticipantTypeCodeGroupIfMissing();
        safSettingsDao.insertDefaultParticipantTypeCodesIfMissing();
    }

    private void ensureCommonCodeTables() {
        safSettingsDao.createCommonCodeGroupTableIfMissing();
        safSettingsDao.createCommonCodeTableIfMissing();
    }

    private String normalizeGroupCode(String comGrpCd) {
        if (comGrpCd == null || comGrpCd.isBlank()) {
            throw new BusinessException("Common code group is required.");
        }
        return comGrpCd.trim().toUpperCase();
    }
}
