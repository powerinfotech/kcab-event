package com.miso.lxnn.dto.code;

import com.miso.lxnn.domain.ComCd;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComCdListDto extends ComCd {
    private IudType iudType;
}
