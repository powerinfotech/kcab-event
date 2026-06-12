package com.kcabEvent.service.display.impl;

import com.kcabEvent.dao.PublicDisplaySettingDao;
import com.kcabEvent.dao.SponsorDao;
import com.kcabEvent.domain.PublicDisplaySetting;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.display.DisplaySettingDto;
import com.kcabEvent.service.display.PublicDisplaySettingService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("publicDisplaySettingService")
public class PublicDisplaySettingServiceImpl implements PublicDisplaySettingService {

    @Resource(name = "publicDisplaySettingDao")
    private PublicDisplaySettingDao publicDisplaySettingDao;

    @Resource(name = "sponsorDao")
    private SponsorDao sponsorDao;

    @Override
    public DisplaySettingDto getSetting() {
        DisplaySettingDto dto = publicDisplaySettingDao.selectSetting();
        if (dto == null) {
            dto = new DisplaySettingDto();
        }
        if (dto.getShowSponsors() == null || dto.getShowSponsors().isBlank()) {
            dto.setShowSponsors("Y");
        }
        return dto;
    }

    @Override
    public DisplaySettingDto getAdminSetting() {
        DisplaySettingDto dto = getSetting();
        dto.setAvailableYears(sponsorDao.selectDistinctSponsorYears());
        return dto;
    }

    @Override
    @Transactional("transactionManager")
    public void saveSetting(DisplaySettingDto dto, LoginUser loginUser) {
        PublicDisplaySetting entity = new PublicDisplaySetting();
        entity.setEditionYear(dto != null ? dto.getEditionYear() : null);
        entity.setShowSponsors(normalizeYn(dto != null ? dto.getShowSponsors() : null));
        entity.setUptUserSeq(loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null);
        publicDisplaySettingDao.upsertSetting(entity);
    }

    private String normalizeYn(String value) {
        if (value == null) {
            return "Y";
        }
        return "N".equals(value.trim().toUpperCase()) ? "N" : "Y";
    }
}
