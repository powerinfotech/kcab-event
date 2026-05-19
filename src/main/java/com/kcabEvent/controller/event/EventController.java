package com.kcabEvent.controller.event;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.event.EventPageComponentCatalogDto;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventReviewRequestDto;
import com.kcabEvent.dto.event.EventSaveDto;
import com.kcabEvent.dto.event.PublicEventPageDto;
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
        return ApiResponse.ok(eventService.selectEventList(status, eventType, keyword, loginUser));
    }

    /**
     * 이벤트 순번으로 이벤트 상세 정보를 조회한다.
     */
    @GetMapping("/detail")
    public ApiResponse<Event> selectEventDetail(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        return ApiResponse.ok(eventService.selectEventBySeq(eventSeq, loginUser));
    }

    /**
     * 이벤트를 생성하거나 수정한다.
     */
    @PostMapping("/save")
    public ApiResponse<Long> saveEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid EventSaveDto saveDto) {
        return ApiResponse.ok(eventService.saveEvent(saveDto, loginUser));
    }

    /**
     * 기관 사용자가 임시저장한 이벤트의 승인 신청을 요청한다.
     */
    @GetMapping("/page-builder/catalog")
    public ApiResponse<EventPageComponentCatalogDto> selectPageBuilderCatalog(
            @KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(eventService.selectEventPageComponentCatalog());
    }

    @GetMapping("/page-builder")
    public ApiResponse<PublicEventPageDto> selectPageBuilder(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        return ApiResponse.ok(eventService.selectEventPageBuilder(eventSeq, loginUser));
    }

    @PostMapping("/page-builder/save")
    public ApiResponse<PublicEventPageDto> savePageBuilder(
            @KcabEventSession LoginUser loginUser,
            @RequestBody PublicEventPageDto saveDto) {
        return ApiResponse.ok(eventService.saveEventPageBuilder(saveDto, loginUser));
    }

    @PostMapping("/request-approval")
    public ApiResponse<Void> requestApproval(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        eventService.requestApproval(eventSeq, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 기관 사용자가 승인 대기 이벤트의 승인 신청을 취소한다.
     */
    @PostMapping("/cancel-approval")
    public ApiResponse<Void> cancelApproval(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        eventService.cancelApproval(eventSeq, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 기관 사용자가 반려된 이벤트를 재작성하기 위해 draft 상태로 되돌린다.
     */
    @PostMapping("/revise-rejected")
    public ApiResponse<Void> reviseRejectedEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        eventService.reviseRejectedEvent(eventSeq, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 관리자가 승인 대기 이벤트를 승인한다.
     */
    @PostMapping("/approve")
    public ApiResponse<Void> approveEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        eventService.approveEvent(eventSeq, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 관리자가 승인 대기 이벤트를 반려한다.
     */
    @PostMapping("/reject")
    public ApiResponse<Void> rejectEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq,
            @RequestBody @Valid EventReviewRequestDto reviewDto) {
        eventService.rejectEvent(eventSeq, reviewDto.getRejectionReason(), loginUser);
        return ApiResponse.ok();
    }

    /**
     * 이벤트 순번으로 이벤트를 삭제한다.
     */
    @PostMapping("/delete")
    public ApiResponse<Void> deleteEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        eventService.deleteEvent(eventSeq, loginUser);
        return ApiResponse.ok();
    }
}
