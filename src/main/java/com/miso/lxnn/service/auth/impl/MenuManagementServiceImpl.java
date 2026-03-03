package com.miso.lxnn.service.auth.impl;

import com.miso.lxnn.dao.BtnDao;
import com.miso.lxnn.dao.MenuBtnDao;
import com.miso.lxnn.dao.MenuDao;
import com.miso.lxnn.domain.Btn;
import com.miso.lxnn.domain.MenuBtn;
import com.miso.lxnn.dto.auth.MenuBtnSaveDto;
import com.miso.lxnn.dto.auth.MenuListDto;
import com.miso.lxnn.dto.auth.MenuSaveDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.common.MenuBtnDetailDto;
import com.miso.lxnn.enums.IudType;
import com.miso.lxnn.service.auth.MenuManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service("menuManagementService")
public class MenuManagementServiceImpl extends EgovAbstractServiceImpl implements MenuManagementService {
    @Resource(name = "menuDao")
    private MenuDao menuDao;
    @Resource(name = "btnDao")
    private BtnDao btnDao;
    @Resource(name = "menuBtnDao")
    private MenuBtnDao menuBtnDao;

    @Override
    public List<MenuListDto> selectMenuInfo(String userId) throws Exception {
        return menuDao.selectMenuList(userId);
    }

    @Override
    public List<MenuListDto> selectUserPermittedMenuInfo(String userId) throws Exception {
        List<MenuListDto> allMenus = menuDao.selectMenuList(userId);
        List<Long> permittedMenuSeqs = menuDao.selectUserPermittedMenuSeqs(userId);
        Set<Long> permittedSet = new HashSet<>(permittedMenuSeqs);

        Set<Long> allowedMenuSeqs = new HashSet<>(permittedSet);
        for (MenuListDto menu : allMenus) {
            if (menu.getMenuSeq() != null && permittedSet.contains(menu.getMenuSeq().longValue())) {
                Integer parentSeq = menu.getUpMenuSeq();
                while (parentSeq != null) {
                    allowedMenuSeqs.add(parentSeq.longValue());
                    final Integer pSeq = parentSeq;
                    MenuListDto parent = allMenus.stream()
                            .filter(m -> m.getMenuSeq() != null && m.getMenuSeq().equals(pSeq))
                            .findFirst().orElse(null);
                    parentSeq = parent != null ? parent.getUpMenuSeq() : null;
                }
            }
        }

        return allMenus.stream()
                .filter(menu -> menu.getMenuSeq() != null && allowedMenuSeqs.contains(menu.getMenuSeq().longValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuBtnDetailDto> selectUserPermittedMenuBtnList(String userId, Long menuSeq) throws Exception {
        return menuBtnDao.selectUserPermittedMenuBtnList(userId, menuSeq);
    }

    @Override
    public List<Btn> selectBtnList() throws Exception {
        return btnDao.selectBtnList();
    }

    @Override
    public List<MenuBtn> selectMenuBtnList(Long menuSeq) throws Exception {
        return menuBtnDao.selectByMenuSeq(menuSeq);
    }

    @Override
    public List<MenuBtnDetailDto> selectActiveMenuBtnList(Long menuSeq) throws Exception {
        return menuBtnDao.selectActiveByMenuSeq(menuSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void saveMenu(LoginUser loginUser, MenuSaveDto menuSaveDto) throws Exception {
        Integer userSeq = loginUser.getUserSeq();

        if (menuSaveDto.getIudType() == IudType.I) {
            menuSaveDto.setRgstUserSeq(userSeq);
            menuSaveDto.setUptUserSeq(userSeq);
            menuDao.insertMenu(menuSaveDto);
        } else if (menuSaveDto.getIudType() == IudType.U) {
            menuSaveDto.setUptUserSeq(userSeq);
            menuDao.updateMenu(menuSaveDto);
        } else if (menuSaveDto.getIudType() == IudType.D) {
            menuDao.deleteMenu(menuSaveDto.getMenuSeq());
            menuBtnDao.deleteByMenuSeq(menuSaveDto.getMenuSeq().longValue());
            return;
        }

        if (menuSaveDto.getMenuSeq() != null && menuSaveDto.getMenuBtnList() != null && !menuSaveDto.getMenuBtnList().isEmpty()) {
            Long menuSeqLong = menuSaveDto.getMenuSeq().longValue();
            Long userSeqLong = userSeq != null ? userSeq.longValue() : null;
            menuBtnDao.deleteByMenuSeq(menuSeqLong);
            for (MenuBtnSaveDto dto : menuSaveDto.getMenuBtnList()) {
                MenuBtn menuBtn = new MenuBtn();
                menuBtn.setMenuSeq(menuSeqLong);
                menuBtn.setBtnSeq(dto.getBtnSeq());
                menuBtn.setBtnNm(dto.getBtnNm() != null ? dto.getBtnNm() : "");
                menuBtn.setUseYn("Y".equalsIgnoreCase(dto.getUseYn()) ? "Y" : "N");
                menuBtn.setRgstUserSeq(userSeqLong);
                menuBtn.setUptUserSeq(userSeqLong);
                menuBtnDao.insert(menuBtn);
            }
        }
    }

    @Override
    public void deleteMenu(Integer menuSeq) throws Exception {
        menuDao.deleteMenu(menuSeq);
    }
}

