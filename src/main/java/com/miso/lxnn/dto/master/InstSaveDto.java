package com.miso.lxnn.dto.master;

import lombok.Data;
import lombok.NonNull;

import javax.validation.constraints.NotEmpty;

@Data
public class InstSaveDto {

    private Integer instSeq;
    @NotEmpty
    private String instName;
    @NotEmpty
    private String instCd;
    @NotEmpty
    private String instCode;

    private String instZipNo;
    private String instAddr;
    private String instDtlAddr;
    private String instTelNo;
    private String instEmail;
    private String instDesc;
    private String userId;
    private Boolean useFlag;

    private String iudType;

}
