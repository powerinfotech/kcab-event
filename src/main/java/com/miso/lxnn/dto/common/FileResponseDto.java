package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FileResponseDto {
    private Integer fileSeq;
    private List<FileDetailDto> fileList;
}
