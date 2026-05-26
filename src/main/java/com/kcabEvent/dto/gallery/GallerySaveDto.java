package com.kcabEvent.dto.gallery;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GallerySaveDto {
    private Long gallerySeq;

    @NotBlank(message = "Title is required.")
    private String title;

    private Integer galleryYear;

    private String description;
    private Long fileSeq;
    private Integer sortSeq;
    private String useYn;
}
