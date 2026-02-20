package com.miso.lxnn.dto.common;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FileDto {
    private Integer fileSeq;
    private String menuSeq;
    private String rgstUserId;
    private LocalDateTime rgstDateTime;
    private String uptUserId;
    private LocalDateTime uptDateTime;
}
