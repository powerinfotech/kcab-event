package com.miso.lxnn.service.master;

import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.AreaListDto;
import com.miso.lxnn.dto.master.AreaListSearchDto;
import com.miso.lxnn.dto.master.SectorListDto;

import java.util.List;

public interface SetupManagementService {
    List<AreaListDto> selectAreaList(AreaListSearchDto param) throws Exception;
    List<SectorListDto> selectSectorList(Integer areaSeq) throws Exception;
    void saveArea(LoginUser loginUser, AreaListDto param) throws Exception;
    void deleteArea(AreaListDto param) throws Exception;
    List<CodeResponseDto> selectAreaCmCodeList() throws Exception;
}
