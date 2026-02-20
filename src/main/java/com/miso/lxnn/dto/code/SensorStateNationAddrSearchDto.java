package com.miso.lxnn.dto.code;

import com.miso.lxnn.dto.common.CodeResponseDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SensorStateNationAddrSearchDto {
    List<CodeResponseDto> sggList;
}
