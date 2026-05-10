package com.kcabEvent.controller.event;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventSaveDto;
import com.kcabEvent.service.event.EventService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

/**
 * 이벤트 목록, 상세 조회, 저장, 삭제를 위한 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/event")
public class EventController {

    @Resource(name = "eventService")
    private EventService eventService;

    /**
     * 상태/유형/검색어 조건에 따라 이벤트 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<EventListDto>> selectEventList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(eventService.selectEventList(status, eventType, keyword));
    }

    /**
     * 이벤트 순번으로 이벤트 상세 정보를 조회한다.
     */
    @GetMapping("/detail")
    public ApiResponse<Event> selectEventDetail(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        return ApiResponse.ok(eventService.selectEventBySeq(eventSeq));
    }

    /**
     * 이벤트를 생성하거나 수정한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> saveEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid EventSaveDto saveDto) {
        eventService.saveEvent(saveDto, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 이벤트 순번으로 이벤트를 삭제한다.
     */
    @PostMapping("/delete")
    public ApiResponse<Void> deleteEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        eventService.deleteEvent(eventSeq);
        return ApiResponse.ok();
    }
}
