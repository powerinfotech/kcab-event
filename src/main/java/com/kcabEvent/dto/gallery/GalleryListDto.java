package com.kcabEvent.dto.gallery;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class GalleryListDto {
    private Long gallerySeq;
    private String title;
    private Integer galleryYear;
    private String description;
    private Long fileSeq;
    private Integer imageCount;
    private String coverFilePath;
    private Integer sortSeq;
    private String useYn;
    private String rgstUserName;
    private LocalDateTime rgstDateTime;
    private String uptUserName;
    private LocalDateTime uptDateTime;
    private List<GalleryImageDto> images;
}
