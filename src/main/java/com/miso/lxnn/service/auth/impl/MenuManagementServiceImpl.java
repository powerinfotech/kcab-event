package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.MenuDao;
import com.miso.lxnn.dto.auth.MenuListDto;
import com.miso.lxnn.dto.auth.MenuSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.service.auth.MenuManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Slf4j
@Service("menuManagementService")
public class MenuManagementServiceImpl extends EgovAbstractServiceImpl implements MenuManagementService {
    @Resource(name = "menuDao")
    private MenuDao menuDao;

    @Override
    public List<MenuListDto> selectMenuInfo(String userId) throws Exception {
        return menuDao.selectMenuList(userId);
    }

    @Override
    @Transactional("transactionManager")
    public void saveMenu(LoginUser loginUser, MenuSaveDto menuSaveDto) throws Exception {
        if(menuSaveDto.getIudType() == IudType.I) {
            menuSaveDto.setRgstUserId(loginUser.getUserId());
            menuSaveDto.setUptUserId(loginUser.getUserId());
            menuDao.insertMenu(menuSaveDto);
        }
        else if(menuSaveDto.getIudType() == IudType.U) {
            menuSaveDto.setUptUserId(loginUser.getUserId());
            menuDao.updateMenu(menuSaveDto);
        }
        else if(menuSaveDto.getIudType() == IudType.D) {
            menuDao.deleteMenu(menuSaveDto.getMenuId());
        }
    }

    @Override
    public void deleteMenu(Integer menuSeq) throws Exception {
        menuDao.deleteMenu(menuSeq);
    }
}

