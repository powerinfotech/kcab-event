package com.miso.lxnn.dto.code;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.List;

@Getter
@Setter
public class ComCdSaveDto {
    private Long comGrpCdSeq;
    private String comGrpCd;
    @Valid
    private List<ComCdListDto> comCdList;
}
