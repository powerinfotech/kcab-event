package com.miso.lxnn.dao;

import com.miso.lxnn.domain.Menu;
import com.miso.lxnn.dto.auth.MenuListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import java.util.List;

@Mapper("menuDao")
public interface MenuDao {
    List<MenuListDto> selectMenuList(String userId) throws Exception;
    void insertMenu(Menu menu) throws Exception;
    void updateMenu(Menu menu) throws Exception;
    void deleteMenu(@Param("menuSeq") Integer menuSeq) throws Exception;
}