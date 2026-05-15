package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventPageComponentTemplateDto {
    private Long componentTemplateSeq;
    private Long componentCategorySeq;
    private String componentScope;
    private String templateCode;
    private String componentType;
    private String templateName;
    private String description;
    private String iconName;
    private Long previewFileSeq;
    private String defaultTitle;
    private String defaultSubtitle;
    private String formSchemaJson;
    private String defaultSettingsJson;
    private String defaultContentJson;
    private String allowedChildTypes;
    private Integer sortSeq;
}
