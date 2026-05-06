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

@RestController
@RequestMapping("/api/event")
public class EventController {

    @Resource(name = "eventService")
    private EventService eventService;

    @GetMapping("/list")
    public ApiResponse<List<EventListDto>> selectEventList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String status) {
        return ApiResponse.ok(eventService.selectEventList(status));
    }

    @GetMapping("/detail")
    public ApiResponse<Event> selectEventDetail(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        return ApiResponse.ok(eventService.selectEventBySeq(eventSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid EventSaveDto saveDto) {
        eventService.saveEvent(saveDto, loginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/delete")
    public ApiResponse<Void> deleteEvent(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long eventSeq) {
        eventService.deleteEvent(eventSeq);
        return ApiResponse.ok();
    }
}
