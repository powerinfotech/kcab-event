package com.kcabEvent.dto.email;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailLogSearchDto {
    private String keyword;
    private String status;
    private String templateCode;
    private String fromDate;
    private String toDate;
    private Integer limit = 100;
}
