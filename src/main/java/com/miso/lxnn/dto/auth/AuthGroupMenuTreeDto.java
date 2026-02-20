package com.miso.lxnn.dto.auth;

import com.miso.lxnn.enums.MenuType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor

public class AuthGroupMenuTreeDto {
     private Integer authGrpMenuSeq;
     private Integer authGrpSeq;
     private Integer menuId;
     private Integer upMenuId;
     private String menuNm;
     private MenuType menuTypeCd;
     private Boolean useFlag;
     private List<AuthGroupMenuTreeDto> children;



     @Builder
     public AuthGroupMenuTreeDto(Integer authGrpMenuSeq, Integer authGrpSeq, Integer menuId, Integer upMenuId, String menuNm, MenuType menuTypeCd, Boolean useFlag, List<AuthGroupMenuTreeDto> children) {
          this.authGrpMenuSeq = authGrpMenuSeq;
          this.authGrpSeq = authGrpSeq;
          this.menuId = menuId;
          this.upMenuId = upMenuId;
          this.menuNm = menuNm;
          this.menuTypeCd = menuTypeCd;
          this.useFlag = useFlag;
          this.children = children;
     }
}
