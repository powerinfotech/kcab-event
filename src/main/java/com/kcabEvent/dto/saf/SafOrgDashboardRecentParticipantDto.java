package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SafOrgDashboardRecentParticipantDto {
    private Long participantSeq;
    private Long eventSeq;
    private String eventTitle;
    private String fullName;
    private String email;
    private String organizationName;
    private String position;
    private LocalDateTime registeredAt;
}
