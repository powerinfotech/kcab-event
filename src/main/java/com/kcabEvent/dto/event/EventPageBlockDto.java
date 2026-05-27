package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventPageBlockDto {
    private Long blockSeq;
    private Long sectionSeq;
    private Long parentBlockSeq;
    private Long componentTemplateSeq;
    private String blockKey;
    private String blockType;
    private String title;
    private String subtitle;
    private String summary;
    private String body;
    private String badgeText;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String venueName;
    private String speakerNames;
    private String organizationName;
    private String buttonLabel;
    private String linkUrl;
    private String linkTarget;
    private Long imageFileSeq;
    private String imageUrl;
    private Long attachmentFileSeq;
    private String featuredYn;
    private Integer sortSeq;
    private String useYn;
    private String styleJson;
    private String contentJson;
}
