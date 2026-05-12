package com.kcabEvent.dto.gallery;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GallerySaveDto {
    private Long gallerySeq;

    @NotBlank(message = "Title is required.")
    private String title;

    @NotNull(message = "Gallery year is required.")
    @Min(value = 2000, message = "Gallery year must be 2000 or later.")
    @Max(value = 2100, message = "Gallery year must be 2100 or earlier.")
    private Integer galleryYear;

    private String description;
    private Long fileSeq;
    private Integer sortSeq;
    private String useYn;
}
