package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventRegistrationFieldDto {
    private Long registrationFieldSeq;
    private Long eventSeq;
    private String fieldCode;
    private String fieldLabel;
    private String enabledYn;
    private String requiredYn;
    private Integer sortSeq;
}
