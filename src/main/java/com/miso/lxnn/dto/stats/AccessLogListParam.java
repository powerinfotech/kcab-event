package com.miso.lxnn.dto.stats;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AccessLogListParam {
    private String userId;
    private Boolean useFlag;
    private LocalDate startDate;
    private LocalDate endDate;
}
