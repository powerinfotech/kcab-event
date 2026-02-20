package com.miso.lxnn.domain;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import java.time.LocalDate;

@Getter
@Setter
public class AuthGroup {
    private Integer authGrpSeq;
	@NotEmpty
	private String authGrpCd;
	@NotEmpty
	private String authGrpNm;
	private String authGrpDesc;
	private String authGrpTypeCd;
	private Boolean useFlag;
	private String rgstUserId;
	private LocalDate rgstDateTime;
	private String uptUserId;
	private LocalDate uptDateTime;
}
