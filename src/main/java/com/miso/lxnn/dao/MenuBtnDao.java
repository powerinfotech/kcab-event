package com.miso.lxnn.dao;

import com.miso.lxnn.domain.MenuBtn;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("menuBtnDao")
public interface MenuBtnDao {
    List<MenuBtn> selectByMenuSeq(@Param("menuSeq") Long menuSeq);
    void deleteByMenuSeq(@Param("menuSeq") Long menuSeq);
    void insert(MenuBtn menuBtn);
}
