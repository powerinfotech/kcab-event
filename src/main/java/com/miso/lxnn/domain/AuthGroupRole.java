package com.miso.lxnn.domain;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Getter
@Setter
public class AuthGroupRole {
    private Integer authGrpRoleSeq;
	@NotNull
	private Integer authGrpSeq;
	@NotNull
	private Integer roleSeq;
	@NotNull
	private LocalDate strDate;
	private LocalDate endDate;
	private Boolean useFlag;
	private String rgstUserId;
	private LocalDate rgstDateTime;
	private String uptUserId;
	private LocalDate uptDateTime;
}