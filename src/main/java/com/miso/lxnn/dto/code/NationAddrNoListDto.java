package com.miso.lxnn.dto.code;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NationAddrNoListDto {
   private Boolean accdntAreaFlag;
   private Integer ntnlPntSeq;
   private String ntnlPntNo;
   private String lctnSignNo;
   private String snsrSrlNo;
   private String sggCd;
   private String sggNm;
   private String instlTypeCd;
   private Float xCrdnt;
   private Float yCrdnt;
   private Float zCrdnt;
   private Float lng;//경도
   private Float lat;//위도
   private Float hght;
   private Double snsrLng;
   private Double snsrLat;
   private Integer srtSq;
   private Boolean useFlag;
   private LocalDateTime rgstDateTime;
   private LocalDateTime uptDateTime;
   private String instlCd;
   private String instlName;
   private String instlTypeName;
}

