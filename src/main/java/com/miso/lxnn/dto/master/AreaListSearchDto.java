package com.miso.lxnn.dto.master;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AreaListSearchDto {
    private String areaName;
    private String areaCdName;
    private Boolean includeUnusedFlag;
}
