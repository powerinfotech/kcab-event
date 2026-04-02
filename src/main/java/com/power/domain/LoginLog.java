package com.power.domain;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class LoginLog {
    private Integer loginLogSeq;
    private Integer userSeq;
    private Integer userLoginSeq;
    private LocalDateTime loginDateTime;
    private String accessIp;
    private String userAgent;
    private String accessNm;


    @Builder
    public LoginLog(Integer userSeq, String accessIp, String userAgent) {
        this.userSeq = userSeq;
        this.accessIp = accessIp;
        this.userAgent = userAgent;
    }
}