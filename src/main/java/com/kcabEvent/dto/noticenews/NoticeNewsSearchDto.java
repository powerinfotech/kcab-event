package com.kcabEvent.dto.noticenews;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeNewsSearchDto {
    private String postType;   // 'NEWS' | 'NOTICE' | null(all)
    private String useYn;      // 'Y' | 'N' | null(all)
    private String keyword;    // search by title
}
