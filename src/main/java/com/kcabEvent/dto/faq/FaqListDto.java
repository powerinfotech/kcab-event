package com.kcabEvent.dto.faq;

import com.kcabEvent.enums.IudType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FaqListDto {
    private Long faqSeq;
    private String audience;
    private String category;
    private String question;
    private String answer;
    private Integer sortSeq;
    private String useYn;
    private LocalDateTime rgstDateTime;
    private IudType iudType;
}
