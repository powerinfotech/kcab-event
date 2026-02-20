package com.miso.lxnn.dto.code;

import com.miso.lxnn.dto.common.CodeResponseDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NationAddrNoSearchDto {
//    검색조건 구조
   List<CodeResponseDto> sggList;
   List<CodeResponseDto> instlList;
   List<CodeResponseDto> instlInstList;
}
