package com.miso.lxnn.dto.master;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SectorListDto {
    private Integer sectorSeq;
    private Integer areaSeq;
    private String sectorName;
    private String sectorCd;
    private String sectorCdNm;
    private String sectorDesc;
    private Integer srtSq;
    private Boolean useFlag;
    @JsonProperty("xAxis")
    private String xAxis;
    @JsonProperty("yAxis")
    private String yAxis;
    private String rgstUserId;
    private LocalDateTime rgstDateTime;
    private String uptUserId;
    private LocalDateTime uptDateTime;
    private IudType iudType;
}
