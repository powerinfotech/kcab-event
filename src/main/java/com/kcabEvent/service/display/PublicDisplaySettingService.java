package com.kcabEvent.service.display;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.display.DisplaySettingDto;

public interface PublicDisplaySettingService {
    /** 공개용: editionYear + showSponsors */
    DisplaySettingDto getSetting();

    /** admin용: 위 + availableYears(콤보) */
    DisplaySettingDto getAdminSetting();

    void saveSetting(DisplaySettingDto dto, LoginUser loginUser);
}
