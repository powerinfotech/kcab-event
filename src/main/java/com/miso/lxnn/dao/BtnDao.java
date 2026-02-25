package com.miso.lxnn.dao;

import com.miso.lxnn.domain.Btn;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("btnDao")
public interface BtnDao {
    List<Btn> selectBtnList();
}
