package com.miso.lxnn.dao;

import com.miso.lxnn.dto.master.InstListDto;
import com.miso.lxnn.dto.master.InstListSearchDto;
import com.miso.lxnn.dto.master.InstSaveDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface InstDao {
    List<InstListDto> selectInst(InstListSearchDto instListSearchDto);
    void insertInst(InstSaveDto instSaveDto);
    void updateInst(InstSaveDto instSaveDto);
    void deleteInst(InstSaveDto instSaveDto);
}
