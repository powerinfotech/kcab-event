package com.kcabEvent.dto.gallery;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GalleryImageDto {
    private Long fileDtlSeq;
    private Long fileSeq;
    private String fileNm;
    private String filePath;
    private String fileUrl;
    private String fileType;
    private Integer sortSeq;
}
