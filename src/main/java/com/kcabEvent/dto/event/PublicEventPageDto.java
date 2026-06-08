package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PublicEventPageDto {
    private Long eventPageSeq;
    private Long eventSeq;
    private String languageCode;
    private String urlSlug;
    private String pageStatus;
    private String pageTitle;
    private String pageSubtitle;
    private String heroTitle;
    private String heroSubtitle;
    private Long heroFileSeq;
    private String heroImageUrl;
    private String themeCode;
    private String themeJson;
    private String settingsJson;
    private LocalDateTime publishedAt;

    private String eventTitle;
    private String eventSummary;
    private LocalDateTime eventStartDt;
    private LocalDateTime eventEndDt;
    private String location;
    private String registrationType;
    private String registrationUrl;
    private String eventStatus;
    private String eventType;

    private List<EventPageSectionDto> sections = new ArrayList<>();
    private List<EventRegistrationFieldDto> registrationFields = new ArrayList<>();
}
