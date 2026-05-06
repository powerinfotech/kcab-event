package com.kcabEvent.dto.page;

import com.kcabEvent.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionDto {
    private Long sectionSeq;
    private Long pageSeq;
    private String sectionType;
    private String sectionData;
    private Integer sortSeq;
    private String useYn;
    private IudType iudType;
}
