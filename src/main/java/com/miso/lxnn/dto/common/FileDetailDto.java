package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FileDetailDto extends FileDto{
    private Integer fileDtlSeq;
    private Integer fileSeq;
    private String fileNm;
    private String filePath;
    private String fileType;
    private String delYn;
    private Integer sortSeq;
}
