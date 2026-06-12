package com.kcabEvent.dto.sponsor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SponsorSaveDto {
    private Long sponsorSeq;

    @NotNull(message = "Year is required.")
    private Integer editionYear;

    @NotBlank(message = "Tier is required.")
    private String tierCd;

    @NotBlank(message = "Company name is required.")
    private String companyName;

    private Long logoFileSeq;
    private String description;
    private String representativeRemarks;
    private String websiteUrl;
    private Integer sortSeq;
    private String useYn;
}
