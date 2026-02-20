package com.miso.lxnn.service.code;

import com.miso.lxnn.dto.code.NationAddrNoListDto;
import com.miso.lxnn.dto.code.NationAddrNoParamDto;
import com.miso.lxnn.dto.code.NationAddrNoSaveDto;
import com.miso.lxnn.dto.code.NationAddrNoSearchDto;
import com.miso.lxnn.dto.common.LoginUser;

import java.util.List;

public interface NationAddrNoService {
    NationAddrNoSearchDto searchConditions() throws Exception;
    List<NationAddrNoListDto> selectNationAddrNoList(NationAddrNoParamDto param) throws Exception;
    void saveNationAddrNo(List<NationAddrNoSaveDto> param, LoginUser user) throws Exception;
}
