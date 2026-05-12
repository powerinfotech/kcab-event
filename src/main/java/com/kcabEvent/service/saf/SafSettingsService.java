package com.kcabEvent.service.saf;

import com.kcabEvent.dto.settings.OrganizationGradeLimitDto;
import com.kcabEvent.dto.settings.SettingsCodeDto;
import com.kcabEvent.dto.settings.SettingsGroupDto;

import java.util.List;

public interface SafSettingsService {

    List<SettingsGroupDto> selectSettingsGroups();

    void saveSettingsGroups(List<SettingsGroupDto> groups, Long updatedBy);

    List<SettingsCodeDto> selectSettingsCodes(String comGrpCd);

    void saveSettingsCodes(String comGrpCd, List<SettingsCodeDto> codes, Long updatedBy);

    List<OrganizationGradeLimitDto> selectOrganizationGradeLimits();

    void saveOrganizationGradeLimits(List<OrganizationGradeLimitDto> limits, Long updatedBy);

    void ensureOrganizationGradeCodeDefaults();
}
