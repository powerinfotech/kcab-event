package com.miso.lxnn.service.code;

import com.miso.lxnn.dto.code.ComGrpCdListDto;
import com.miso.lxnn.dto.code.ComGrpCdSaveDto;
import com.miso.lxnn.dto.common.LoginUser;

import javax.validation.Valid;
import java.util.List;

public interface ComGrpCdService {
    List<ComGrpCdListDto> selectComGrpCdList(String searchText) throws Exception;
    void saveComGrpCd(@Valid ComGrpCdSaveDto saveDto, LoginUser loginUser) throws Exception;
}
