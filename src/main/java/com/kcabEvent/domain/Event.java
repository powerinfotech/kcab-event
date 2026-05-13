package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import com.kcabEvent.dto.event.EventDiscountCodeDto;
import com.kcabEvent.dto.event.EventPricingDto;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class Event {
    private Long eventSeq;
    private String title;
    /** events.description 컬럼 */
    private String description;
    private String content;
    private String summary;
    /** 행사 시작 일시 (날짜+시간) */
    private LocalDateTime eventStartDt;
    /** 행사 종료 일시 (날짜+시간) */
    private LocalDateTime eventEndDt;
    /** 참가신청 시작 일시 */
    private LocalDateTime registrationStartDt;
    /** 참가신청 종료 일시 */
    private LocalDateTime registrationEndDt;
    /** 장소명 */
    private String location;
    /** 참가신청 방식: direct=자체 신청 화면, external=외부 URL로 이동, none=등록 불필요 */
    private String registrationType;
    /** 참가신청 외부 URL (registrationType=external 일 때만 사용) */
    private String registrationUrl;
    private String status;
    private String rejectionReason;
    private String useYn;
    /** 썸네일 파일 그룹 (tb_file.file_seq) */
    private Long fileSeq;
    /** 일반 첨부파일 그룹 (tb_file.file_seq) */
    private Long attachmentFileSeq;
    private String eventType;
    private Long organizationSeq;
    private String organizationName;
    private Integer maxParticipants;
    private Boolean isPaid;
    private List<EventPricingDto> pricingList;
    private List<EventDiscountCodeDto> discountCodes;
    private Long rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
