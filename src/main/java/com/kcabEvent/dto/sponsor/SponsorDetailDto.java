package com.kcabEvent.dto.sponsor;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SponsorDetailDto {
    private Long sponsorSeq;
    private Integer editionYear;
    private String tierCd;
    private String tierCdNm;
    private String companyName;
    private Long logoFileSeq;
    private Long logoFileDtlSeq;
    private String logoFilePath;
    private String logoFileUrl;
    private String description;
    private String representativeRemarks;
    private String websiteUrl;
    private Integer sortSeq;
    private String useYn;
    private Long rgstUserSeq;
    private String rgstUserName;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private String uptUserName;
    private LocalDateTime uptDateTime;
}
