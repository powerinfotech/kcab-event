package com.miso.lxnn.domain;

import com.miso.lxnn.dto.auth.AuthGroupMenuSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AuthGroupMenu {
    private Integer authGrpMenuSeq;
	private Integer authGrpSeq;
	private Integer menuSeq;
	private Boolean useFlag;
	private String rgstUserId;
	private LocalDate rgstDateTime;
	private String uptUserId;
	private LocalDate uptDateTime;

	public static AuthGroupMenu ofAuthGroupMenuSaveDto(AuthGroupMenuSaveDto authGroupMenuSaveDto, LoginUser loginUser) {
		AuthGroupMenu authGroupMenu = new AuthGroupMenu();
		authGroupMenu.setAuthGrpMenuSeq(authGroupMenuSaveDto.getAuthGrpMenuSeq());
		authGroupMenu.setAuthGrpSeq(authGroupMenuSaveDto.getAuthGrpSeq());
		authGroupMenu.setMenuSeq(authGroupMenuSaveDto.getMenuSeq());
		authGroupMenu.setUseFlag(authGroupMenuSaveDto.getUseFlag());
		authGroupMenu.setRgstUserId(loginUser.getUserId());
		authGroupMenu.setUptUserId(loginUser.getUserId());
		return authGroupMenu;
	}
}
