package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class EventPageSectionDto {
    private Long sectionSeq;
    private Long eventPageSeq;
    private Long componentTemplateSeq;
    private String sectionKey;
    private String sectionType;
    private String title;
    private String eyebrow;
    private String subtitle;
    private String body;
    private String anchorId;
    private String navLabel;
    private String showInNavYn;
    private String layoutType;
    private Integer columnCount;
    private Integer sortSeq;
    private String useYn;
    private String settingsJson;
    private List<EventPageBlockDto> blocks = new ArrayList<>();
}
