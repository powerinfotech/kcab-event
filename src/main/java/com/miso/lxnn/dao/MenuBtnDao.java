package com.miso.lxnn.dao;

import com.miso.lxnn.domain.MenuBtn;
import com.miso.lxnn.dto.common.MenuBtnDetailDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("menuBtnDao")
public interface MenuBtnDao {
    List<MenuBtn> selectByMenuSeq(@Param("menuSeq") Long menuSeq);
    List<MenuBtnDetailDto> selectActiveByMenuSeq(@Param("menuSeq") Long menuSeq);
    void deleteByMenuSeq(@Param("menuSeq") Long menuSeq);
    void insert(MenuBtn menuBtn);
}
