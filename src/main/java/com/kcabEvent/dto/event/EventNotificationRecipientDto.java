package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventNotificationRecipientDto {
    private String recipientEmail;
    private String recipientName;
    private String organizationName;
}
