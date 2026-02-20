package com.miso.lxnn.dao;

import com.miso.lxnn.dto.master.AreaListDto;
import com.miso.lxnn.dto.master.AreaListSearchDto;
import com.miso.lxnn.dto.master.SectorListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("setupDao")
public interface SetupDao {
    List<AreaListDto> selectAreaList(AreaListSearchDto searchParam) throws Exception;
    List<SectorListDto> selectSectorList(@Param("areaSeq") Integer areaSeq) throws Exception;
    void insertArea(AreaListDto saveParam) throws Exception;
    void updateArea(AreaListDto saveParam) throws Exception;
    void deleteArea(@Param("areaSeq") Integer areaSeq) throws Exception;
}
