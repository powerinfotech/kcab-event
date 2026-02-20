package com.miso.lxnn.dao;

import com.miso.lxnn.domain.CommonCode;
import com.miso.lxnn.dto.master.CommonCodeListDto;
import com.miso.lxnn.dto.master.CommonCodeListParamDto;
import com.miso.lxnn.domain.CommonGrpCode;
import com.miso.lxnn.dto.master.CommonGrpCodeListDto;
import com.miso.lxnn.dto.common.CodeResponseDto;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("comCodeDao")
public interface ComCodeDao {
    List<CommonCodeListDto> getCommonCodeList(String comGrpCd);
    List<CommonGrpCodeListDto> selectCommonGrpCodeList(String searchText) throws Exception;
    List<CodeResponseDto>searchCommonGrpCodeList() throws Exception;
    void insertCommonGrpCode(CommonGrpCode commonGrpCode) throws Exception;
    void updateCommonGrpCode(CommonGrpCode commonGrpCode) throws Exception;
    void deleteCommonGrpCode(Integer comGrpCdSeq) throws Exception;
    void deleteCommonCodeGroup(Integer comGrpCdSeq) throws Exception;
    List<CommonCodeListDto> selectCommonCodeList(CommonCodeListParamDto param) throws Exception;
    void insertCommonCode(CommonCode commonGrpCode) throws Exception;
    void updateCommonCode(CommonCode commonGrpCode) throws Exception;
    void deleteCommonCode(Integer comCdSeq) throws Exception;
    Integer selectCommonGrpCodeCheck(CommonGrpCode commonGrpCode) throws Exception;
    Integer selectCommonCodeCheck(CommonCode commonGrpCode) throws Exception;
}