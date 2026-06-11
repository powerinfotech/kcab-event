package com.kcabEvent.controller.event;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.PublicEventPageDto;
import com.kcabEvent.service.event.EventService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 비로그인 공개 화면에서 사용하는 이벤트 조회 API를 제공한다.
 */
@RestController
@RequestMapping("/api/public/event")
public class PublicEventController {

    @Resource(name = "eventService")
    private EventService eventService;

    /**
     * 상태 조건에 따라 공개 이벤트 카드 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<EventListDto>> selectEventList(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(eventService.selectEventList(status, eventType, keyword));
    }

    /**
     * 공개 이벤트 상세 정보를 조회한다.
     */
    @GetMapping("/detail")
    public ApiResponse<Event> selectEventDetail(@RequestParam Long eventSeq) {
        Event event = eventService.selectEventBySeq(eventSeq);
        return ApiResponse.ok(isVisibleNow(event) ? event : null);
    }

    /**
     * Public page builder event detail lookup for /event/{slug}.
     */
    @GetMapping("/page")
    public ApiResponse<PublicEventPageDto> selectEventPage(@RequestParam String urlSlug) {
        return ApiResponse.ok(eventService.selectPublishedEventPageBySlug(urlSlug));
    }

    private boolean isVisibleNow(Event event) {
        if (event == null) {
            return false;
        }
        LocalDateTime now = LocalDateTime.now();
        return (event.getShowStartDate() == null || !event.getShowStartDate().isAfter(now))
                && (event.getShowEndDate() == null || !event.getShowEndDate().isBefore(now));
    }
}
