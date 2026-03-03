package com.miso.lxnn.dao;

import com.miso.lxnn.domain.ComGrpCd;
import com.miso.lxnn.dto.code.ComGrpCdListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("comGrpCdDao")
public interface ComGrpCdDao {
    List<ComGrpCdListDto> selectComGrpCdList(@Param("searchText") String searchText) throws Exception;
    void insertComGrpCd(ComGrpCd comGrpCd) throws Exception;
    void updateComGrpCd(ComGrpCd comGrpCd) throws Exception;
}
