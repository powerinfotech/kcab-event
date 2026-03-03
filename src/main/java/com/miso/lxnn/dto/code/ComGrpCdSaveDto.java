package com.miso.lxnn.dto.code;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import java.util.List;

@Getter
@Setter
public class ComGrpCdSaveDto {
    @Valid
    private List<ComGrpCdListDto> comGrpCdList;
}
