package com.miso.lxnn.dto.auth;

import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.enums.MenuType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class AuthGroupMenuSaveDto {
     private Integer authGrpMenuSeq;
     private Integer authGrpSeq;
     private Integer menuSeq;
     private Integer upMenuSeq;
     private String menuNm;
     private MenuType menuTypeCd;
     private Boolean useFlag;
     private IudType iudType;
     private List<AuthGroupMenuSaveDto> children;
}
