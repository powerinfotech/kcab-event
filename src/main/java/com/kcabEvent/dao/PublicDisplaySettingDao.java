package com.kcabEvent.dao;

import com.kcabEvent.domain.PublicDisplaySetting;
import com.kcabEvent.dto.display.DisplaySettingDto;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

@EgovMapper("publicDisplaySettingDao")
public interface PublicDisplaySettingDao {
    DisplaySettingDto selectSetting();

    int upsertSetting(PublicDisplaySetting setting);
}
