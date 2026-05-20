package com.kcabEvent.dao;

import com.kcabEvent.dto.settings.OrganizationGradeLimitDto;
import com.kcabEvent.dto.settings.SettingsCodeDto;
import com.kcabEvent.dto.settings.SettingsGroupDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("safSettingsDao")
public interface SafSettingsDao {

    void createCommonCodeGroupTableIfMissing();

    void createCommonCodeTableIfMissing();

    void insertOrganizationGradeCodeGroupIfMissing();

    void insertDefaultOrganizationGradeCodesIfMissing();

    void insertParticipantTypeCodeGroupIfMissing();

    void insertDefaultParticipantTypeCodesIfMissing();

    List<SettingsGroupDto> selectSettingsGroups();

    int upsertSettingsGroup(SettingsGroupDto dto);

    int deleteSettingsGroup(SettingsGroupDto dto);

    List<SettingsCodeDto> selectSettingsCodes(@Param("comGrpCd") String comGrpCd);

    int upsertSettingsCode(SettingsCodeDto dto);

    int deleteSettingsCode(SettingsCodeDto dto);

    List<OrganizationGradeLimitDto> selectOrganizationGradeLimits();

    int upsertOrganizationGradeLimit(OrganizationGradeLimitDto dto);

    Integer selectOrganizationMaxEventCount(@Param("organizationSeq") Long organizationSeq);

    long countOrganizationHostedEvents(@Param("organizationSeq") Long organizationSeq);
}
