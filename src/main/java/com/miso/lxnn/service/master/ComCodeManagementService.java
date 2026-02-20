package com.miso.lxnn.service.master;

import com.miso.lxnn.dto.master.CommonCodeListDto;
import com.miso.lxnn.dto.master.CommonCodeListParamDto;
import com.miso.lxnn.domain.CommonGrpCode;
import com.miso.lxnn.dto.master.CommonGrpCodeListDto;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;

import java.util.List;

public interface ComCodeManagementService {
    List<CommonGrpCodeListDto> selectCommonGrpCodeList(String searchText) throws Exception;
    List<CodeResponseDto> selectCommonGrpCodeSelectList() throws Exception;
    void setCommonGrpCodeSave(LoginUser LoginUser, List<CommonGrpCode> commonCodeGrpList) throws Exception;
    List<CommonCodeListDto> selectCommonCodeList(CommonCodeListParamDto param) throws Exception;
}
