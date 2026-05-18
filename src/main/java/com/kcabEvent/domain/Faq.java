package com.kcabEvent.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Faq {
    private Long faqSeq;
    private String audience;
    private String category;
    private String question;
    private String answer;
    private Integer sortSeq;
    private String useYn;
    private Long rgstUserSeq;
    private LocalDateTime rgstDateTime;
    private Long uptUserSeq;
    private LocalDateTime uptDateTime;
}
