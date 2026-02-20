package com.miso.lxnn.dto.common;

import com.miso.lxnn.domain.CommonCode;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonCodeSaveDto extends CommonCode {
    private String cmGrpCd;
    private IudType iudType;

}
