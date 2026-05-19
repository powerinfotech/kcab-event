package com.kcabEvent.service.event;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.event.EventPageComponentCatalogDto;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventSaveDto;
import com.kcabEvent.dto.event.PublicEventPageDto;

import java.util.List;

/**
 * 관리자 및 공개 컨트롤러가 함께 사용하는 이벤트 관리 기능을 정의한다.
 */
public interface EventService {
    /**
     * 상태/유형/검색어 조건에 따라 이벤트 목록을 조회한다.
     */
    List<EventListDto> selectEventList(String status, String eventType, String keyword);

    /**
     * 관리자 화면에서 세션 권한을 반영해 이벤트 목록을 조회한다.
     */
    List<EventListDto> selectEventList(String status, String eventType, String keyword, LoginUser loginUser);

    /**
     * 이벤트 순번으로 이벤트를 조회한다.
     */
    Event selectEventBySeq(Long eventSeq);

    /**
     * Public event page lookup by URL slug for /event/{slug}.
     */
    PublicEventPageDto selectPublishedEventPageBySlug(String urlSlug);

    EventPageComponentCatalogDto selectEventPageComponentCatalog();

    PublicEventPageDto selectEventPageBuilder(Long eventSeq, LoginUser loginUser);

    PublicEventPageDto saveEventPageBuilder(PublicEventPageDto saveDto, LoginUser loginUser);

    /**
     * 관리자 화면에서 세션 권한을 반영해 이벤트를 조회한다.
     */
    Event selectEventBySeq(Long eventSeq, LoginUser loginUser);

    /**
     * 현재 로그인 사용자를 감사 정보로 사용해 이벤트를 생성하거나 수정한다.
     */
    Long saveEvent(EventSaveDto saveDto, LoginUser loginUser);

    /**
     * 기관 사용자가 draft 상태 이벤트의 승인 신청을 요청한다.
     */
    void requestApproval(Long eventSeq, LoginUser loginUser);

    /**
     * 기관 사용자가 승인 대기 중인 이벤트의 승인 신청을 취소한다.
     */
    void cancelApproval(Long eventSeq, LoginUser loginUser);

    /**
     * 기관 사용자가 반려된 이벤트를 재작성할 수 있도록 draft 상태로 되돌린다.
     */
    void reviseRejectedEvent(Long eventSeq, LoginUser loginUser);

    /**
     * 관리자가 승인 대기 이벤트를 승인한다.
     */
    void approveEvent(Long eventSeq, LoginUser loginUser);

    /**
     * 관리자가 승인 대기 이벤트를 반려한다.
     */
    void rejectEvent(Long eventSeq, String rejectionReason, LoginUser loginUser);

    /**
     * 이벤트 순번으로 이벤트를 삭제한다.
     */
    void deleteEvent(Long eventSeq);

    /**
     * 관리자 화면에서 세션 권한을 반영해 이벤트를 삭제한다.
     */
    void deleteEvent(Long eventSeq, LoginUser loginUser);
}
