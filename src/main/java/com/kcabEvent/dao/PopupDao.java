package com.kcabEvent.dao;

import com.kcabEvent.domain.Popup;
import com.kcabEvent.dto.popup.PopupListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("popupDao")
public interface PopupDao {

    List<PopupListDto> selectPopupList(@Param("status") String status,
                                       @Param("activeOnly") Boolean activeOnly);

    void insertPopup(Popup popup);

    void updatePopup(Popup popup);

    void softDeletePopup(@Param("popupSeq") Long popupSeq,
                         @Param("userSeq") Long userSeq);
}
