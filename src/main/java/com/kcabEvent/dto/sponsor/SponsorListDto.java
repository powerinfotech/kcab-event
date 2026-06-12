package com.kcabEvent.dto.sponsor;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SponsorListDto {
    private Long sponsorSeq;
    private Integer editionYear;
    private String tierCd;
    private String tierCdNm;
    private Integer tierSortSeq;
    private String companyName;
    private Long logoFileSeq;
    private Long logoFileDtlSeq;
    private String logoFilePath;
    private String logoFileUrl;
    private Boolean hasRemarks;
    /** 팝업용 상세 (공개 리스트에서 함께 내려준다) */
    private String description;
    private String representativeRemarks;
    private String websiteUrl;
    private Integer sortSeq;
    private String useYn;
    private String rgstUserName;
    private LocalDateTime rgstDateTime;
    private String uptUserName;
    private LocalDateTime uptDateTime;
}
