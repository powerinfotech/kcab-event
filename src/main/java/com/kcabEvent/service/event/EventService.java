package com.kcabEvent.service.event;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventSaveDto;

import java.util.List;

/**
 * 관리자 및 공개 컨트롤러가 함께 사용하는 이벤트 관리 기능을 정의한다.
 */
public interface EventService {
    /**
     * 상태 조건에 따라 이벤트 목록을 조회한다.
     */
    List<EventListDto> selectEventList(String status);

    /**
     * 이벤트 순번으로 이벤트를 조회한다.
     */
    Event selectEventBySeq(Long eventSeq);

    /**
     * 현재 로그인 사용자를 감사 정보로 사용해 이벤트를 생성하거나 수정한다.
     */
    void saveEvent(EventSaveDto saveDto, LoginUser loginUser);

    /**
     * 이벤트 순번으로 이벤트를 삭제한다.
     */
    void deleteEvent(Long eventSeq);
}
