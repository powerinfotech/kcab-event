package com.kcabEvent.dto.sponsor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SponsorSearchDto {
    private Integer editionYear;
    private String tierCd;
    private String useYn;
    private String keyword;
}
