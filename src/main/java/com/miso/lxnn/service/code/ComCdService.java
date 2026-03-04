package com.miso.lxnn.service.code;

import com.miso.lxnn.dto.code.ComCdListDto;
import com.miso.lxnn.dto.code.ComCdSaveDto;
import com.miso.lxnn.dto.common.LoginUser;

import javax.validation.Valid;
import java.util.List;

public interface ComCdService {
    List<ComCdListDto> selectComCdList(Long comGrpCdSeq) throws Exception;
    void saveComCd(@Valid ComCdSaveDto saveDto, LoginUser loginUser) throws Exception;
}
