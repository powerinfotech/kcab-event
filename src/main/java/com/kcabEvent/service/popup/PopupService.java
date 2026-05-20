package com.kcabEvent.service.popup;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.popup.PopupListDto;
import com.kcabEvent.dto.popup.PopupSaveDto;

import java.util.List;

/**
 * 메인 화면 팝업의 목록 조회와 행 단위 생성/수정/삭제 처리를 정의한다.
 */
public interface PopupService {
    List<PopupListDto> selectPopupList(String status, Boolean activeOnly);

    void savePopup(PopupSaveDto saveDto, LoginUser loginUser);
}
