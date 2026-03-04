package com.miso.lxnn.dao;

import com.miso.lxnn.domain.ComCd;
import com.miso.lxnn.dto.code.ComCdListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("comCdDao")
public interface ComCdDao {
    List<ComCdListDto> selectComCdList(@Param("comGrpCdSeq") Long comGrpCdSeq) throws Exception;
    void insertComCd(ComCd comCd) throws Exception;
    void updateComCd(ComCd comCd) throws Exception;
    void deleteComCd(@Param("comCdSeq") Long comCdSeq) throws Exception;
}
