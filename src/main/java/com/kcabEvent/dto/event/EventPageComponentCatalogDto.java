package com.kcabEvent.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class EventPageComponentCatalogDto {
    private List<EventPageComponentCategoryDto> categories = new ArrayList<>();
    private List<EventPageComponentTemplateDto> templates = new ArrayList<>();
}
