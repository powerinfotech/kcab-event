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
    private String thumbnailUrl;
    private LocalDateTime eventStartDt;
    private LocalDateTime eventEndDt;
    private LocalDateTime registrationStartDt;
    private LocalDateTime registrationEndDt;
    private String location;
    private String postalCode;
    private String venueAddress;
    private String addressDetail;
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
