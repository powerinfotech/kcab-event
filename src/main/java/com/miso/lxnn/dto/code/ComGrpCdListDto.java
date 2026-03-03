package com.miso.lxnn.dto.code;

import com.miso.lxnn.domain.ComGrpCd;
import com.miso.lxnn.enums.IudType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComGrpCdListDto extends ComGrpCd {
    private IudType iudType;
}
