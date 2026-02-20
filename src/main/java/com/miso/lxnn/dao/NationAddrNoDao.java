package com.miso.lxnn.dao;

import com.miso.lxnn.dto.code.NationAddrNoListDto;
import com.miso.lxnn.dto.code.NationAddrNoParamDto;
import com.miso.lxnn.dto.code.NationAddrNoSaveDto;
import com.miso.lxnn.dto.code.NationAddrNoSearchDto;
import com.miso.lxnn.dto.common.CodeResponseDto;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("nationAddrNoDao")
public interface NationAddrNoDao {
    List<NationAddrNoListDto> selectNationAddrNoList(NationAddrNoParamDto param) throws Exception;
    void updateNationAddrNo(NationAddrNoSaveDto param) throws Exception;
}
