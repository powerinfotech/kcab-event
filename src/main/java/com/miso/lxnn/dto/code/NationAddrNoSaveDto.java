package com.miso.lxnn.dto.code;

import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NationAddrNoSaveDto {
    private IudType iudType;
    private Integer ntnlPntSeq;
    private Boolean accdntAreaFlag;
    private String lctnSignNo;
    private String sggCd;
    private String instlTypeCd;
    private Double xcrdnt;
    private Double ycrdnt;
    private Double zcrdnt;
    private Double lng;
    private Double lat;
    private Double hght;
    private Integer srtSq;
    private Boolean useFlag;
    private Double snsrLng;
    private Double snsrLat;
    private LocalDateTime uptDateTime;
    private String uptUserId;
    private String instlCd;
}
