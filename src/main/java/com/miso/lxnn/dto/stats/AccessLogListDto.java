package com.miso.lxnn.dto.stats;

import com.miso.lxnn.domain.LoginLog;
import com.miso.lxnn.util.RequestUtil;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccessLogListDto extends LoginLog {
    private String userId;
    private String userName;


    public String getBrowser() {
        return RequestUtil.getBrowser(this.getUserAgent());
    }

}
