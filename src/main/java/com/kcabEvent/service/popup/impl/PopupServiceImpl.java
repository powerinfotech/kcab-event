package com.kcabEvent.service.popup.impl;

import com.kcabEvent.dao.PopupDao;
import com.kcabEvent.domain.Popup;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.popup.PopupListDto;
import com.kcabEvent.dto.popup.PopupSaveDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.popup.PopupService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 메인 화면 팝업의 목록 조회와 행 단위 생성/수정/삭제 처리를 구현한다.
 */
@Slf4j
@Service("popupService")
public class PopupServiceImpl extends EgovAbstractServiceImpl implements PopupService {

    private static final String STATUS_PUBLISHED = "published";
    private static final String STATUS_HIDDEN = "hidden";

    @Resource(name = "popupDao")
    private PopupDao popupDao;

    @Override
    public List<PopupListDto> selectPopupList(String status, Boolean activeOnly) {
        return popupDao.selectPopupList(normalizeStatusFilter(status), activeOnly);
    }

    @Override
    @Transactional("transactionManager")
    public void savePopup(PopupSaveDto saveDto, LoginUser loginUser) {
        if (saveDto.getPopupList() == null) return;
        if (loginUser == null || !"Y".equals(loginUser.getAdmYn())) {
            throw new BusinessException("Only administrators can manage popups.");
        }
        Long userSeq = Long.valueOf(loginUser.getUserSeq());

        for (PopupListDto item : saveDto.getPopupList()) {
            if (item.getIudType() == null) continue;

            switch (item.getIudType()) {
                case I: {
                    Popup popup = toDomain(item);
                    popup.setCreatedBy(userSeq);
                    popup.setUpdatedBy(userSeq);
                    popupDao.insertPopup(popup);
                    break;
                }
                case U: {
                    if (item.getPopupSeq() == null) break;
                    Popup popup = toDomain(item);
                    popup.setPopupSeq(item.getPopupSeq());
                    popup.setUpdatedBy(userSeq);
                    popupDao.updatePopup(popup);
                    break;
                }
                case D: {
                    if (item.getPopupSeq() == null) break;
                    popupDao.softDeletePopup(item.getPopupSeq(), userSeq);
                    break;
                }
                default:
                    break;
            }
        }
    }

    private Popup toDomain(PopupListDto item) {
        Popup popup = new Popup();
        popup.setTitle(item.getTitle());
        popup.setContent(item.getContent());
        popup.setStatus(normalizeStatusForSave(item.getStatus()));
        popup.setSortSeq(item.getSortSeq() != null ? item.getSortSeq() : 0);
        popup.setStartAt(item.getStartAt());
        popup.setEndAt(item.getEndAt());
        return popup;
    }

    private String normalizeStatusFilter(String status) {
        if (STATUS_PUBLISHED.equals(status) || STATUS_HIDDEN.equals(status)) {
            return status;
        }
        return null;
    }

    private String normalizeStatusForSave(String status) {
        return STATUS_PUBLISHED.equals(status) ? STATUS_PUBLISHED : STATUS_HIDDEN;
    }
}
