package com.kcabEvent.dto.event;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventSaveDto {
    private Long eventSeq;

    @NotBlank(message = "행사명을 입력해주세요.")
    private String title;

    private String content;
    private String summary;
    private LocalDateTime eventStartDt;
    private LocalDateTime eventEndDt;
    private LocalDateTime registrationStartDt;
    private LocalDateTime registrationEndDt;
    private String location;
    private String venueAddress;
    /** 참가신청 방식: direct=자체 신청 화면, external=외부 URL로 이동, none=등록 불필요 */
    private String registrationType;
    /** 참가신청 외부 URL (registrationType=external 일 때만 사용) */
    private String registrationUrl;
    private String status;
    private String useYn;
    /** 썸네일 파일 그룹 */
    private Long fileSeq;
    /** 일반 첨부파일 그룹 */
    private Long attachmentFileSeq;

    /** main = 오피셜, side = 부대행사 */
    private String eventType;
    private Long organizationSeq;
    private Integer maxParticipants;
    private Boolean isPaid;
}
