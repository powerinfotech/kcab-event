package com.miso.lxnn.dto.master;

import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class AreaListDto {
    private Integer areaSeq;
    @NotBlank
    private String areaName;
    @NotBlank
    private String areaCd;
    private String areaCdNm;
    private String areaZipNo;
    private String areaAddr;
    private String areaDtlAddr;
    private BigDecimal areaLatitude;
    private BigDecimal areaLongitude;
    private String areaDesc;
    private Boolean useFlag;
    private String rgstUserId;
    private LocalDateTime rgstDateTime;
    private String uptUserId;
    private LocalDateTime uptDateTime;
    private String lastUpdateDate;
    private String lastModifyUserName;
    private IudType iudType;

    public LocalDate getLastUpdateDate() {
        return this.getUptDateTime() != null ? LocalDate.parse(this.getUptDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")), DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null;
    }
}
