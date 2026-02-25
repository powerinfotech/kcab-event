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
     private Integer menuSeq;
     private Integer upMenuSeq;
     private String menuNm;
     private MenuType menuTypeCd;
     private Boolean useFlag;
     private List<AuthGroupMenuTreeDto> children;



     @Builder
     public AuthGroupMenuTreeDto(Integer authGrpMenuSeq, Integer authGrpSeq, Integer menuSeq, Integer upMenuSeq, String menuNm, MenuType menuTypeCd, Boolean useFlag, List<AuthGroupMenuTreeDto> children) {
          this.authGrpMenuSeq = authGrpMenuSeq;
          this.authGrpSeq = authGrpSeq;
          this.menuSeq = menuSeq;
          this.upMenuSeq = upMenuSeq;
          this.menuNm = menuNm;
          this.menuTypeCd = menuTypeCd;
          this.useFlag = useFlag;
          this.children = children;
     }
}
