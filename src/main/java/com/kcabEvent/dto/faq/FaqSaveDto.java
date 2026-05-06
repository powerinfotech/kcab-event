package com.kcabEvent.dto.faq;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FaqSaveDto {
    @NotNull
    private List<FaqListDto> faqList;
}
