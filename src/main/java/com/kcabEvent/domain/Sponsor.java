package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Sponsor {
    private Long sponsorSeq;
    /** 년도별 선발 */
    private Integer editionYear;
    /** SPONSOR_TIER 공통코드 (event.com_cd.com_cd) */
    private String tierCd;
    private String companyName;
    /** 기업 로고 파일 그룹 (event.tb_file.file_seq) */
    private Long logoFileSeq;
    /** 기업설명 (HTML) */
    private String description;
    /** Representative's Remarks (HTML, 선택) */
    private String representativeRemarks;
    private Integer sortSeq;
    private String useYn;
    /** DB: event.sponsor.created_by */
    private Long rgstUserSeq;
    /** DB: event.sponsor.created_at */
    private LocalDateTime rgstDateTime;
    /** DB: event.sponsor.updated_by */
    private Long uptUserSeq;
    /** DB: event.sponsor.updated_at */
    private LocalDateTime uptDateTime;
}
