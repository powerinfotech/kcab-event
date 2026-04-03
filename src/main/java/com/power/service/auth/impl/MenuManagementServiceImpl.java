package com.power.service.auth.impl;

import com.power.dao.BtnDao;
import com.power.dao.MenuBtnDao;
import com.power.dao.MenuDao;
import com.power.domain.Btn;
import com.power.domain.MenuBtn;
import com.power.dto.auth.MenuBtnSaveDto;
import com.power.dto.auth.MenuListDto;
import com.power.dto.auth.MenuSaveDto;
import com.power.dto.common.LoginUser;
import com.power.dto.common.MenuBtnDetailDto;
import com.power.enums.IudType;
import com.power.service.auth.MenuManagementService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * MenuManagementServiceImpl - {@link MenuManagementService} 구현체
 *
 * <p>메뉴 저장 시 IudType으로 INSERT / UPDATE / DELETE를 분기한다.
 * INSERT·UPDATE의 경우 버튼 목록을 기존 전체 삭제 후 재등록하는 방식으로 처리한다.</p>
 *
 * <p>{@link #selectUserPermittedMenuInfo}는 권한이 있는 말단 메뉴뿐 아니라
 * 해당 메뉴까지의 상위 디렉토리 노드도 포함하여 사이드 메뉴 트리를 올바르게 구성한다.</p>
 */
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
    public List<MenuListDto> selectMenuInfo(String userId) {
        return menuDao.selectMenuList(userId);
    }

    @Override
    public List<MenuListDto> selectUserPermittedMenuInfo(String userId) {
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
    public List<MenuBtnDetailDto> selectUserPermittedMenuBtnList(String userId, Long menuSeq) {
        return menuBtnDao.selectUserPermittedMenuBtnList(userId, menuSeq);
    }

    @Override
    public List<Btn> selectBtnList() {
        return btnDao.selectBtnList();
    }

    @Override
    public List<MenuBtn> selectMenuBtnList(Long menuSeq) {
        return menuBtnDao.selectByMenuSeq(menuSeq);
    }

    @Override
    public List<MenuBtnDetailDto> selectActiveMenuBtnList(Long menuSeq) {
        return menuBtnDao.selectActiveByMenuSeq(menuSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void saveMenu(LoginUser loginUser, MenuSaveDto menuSaveDto) {
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
    public void deleteMenu(Integer menuSeq) {
        menuDao.deleteMenu(menuSeq);
    }
}

