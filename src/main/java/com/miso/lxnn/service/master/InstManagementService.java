package com.miso.lxnn.service.master;

import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.InstListDto;
import com.miso.lxnn.dto.master.InstListSearchDto;
import com.miso.lxnn.dto.master.InstSaveDto;

import java.util.List;

public interface InstManagementService {
    List<InstListDto> selectInst(InstListSearchDto instListSearchDto) throws Exception;
    List<CodeResponseDto> searchConditions();
    Integer saveInst(InstSaveDto instSaveDto, LoginUser loginUser) throws Exception;
    void deleteInst(InstSaveDto instSaveDto, LoginUser loginUser) throws Exception;
}
