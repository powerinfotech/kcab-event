package com.kcabEvent.controller.event;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.service.event.EventService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/public/event")
public class PublicEventController {

    @Resource(name = "eventService")
    private EventService eventService;

    @GetMapping("/list")
    public ApiResponse<List<EventListDto>> selectEventList(
            @RequestParam(required = false) String status) {
        return ApiResponse.ok(eventService.selectEventList(status));
    }

    @GetMapping("/detail")
    public ApiResponse<Event> selectEventDetail(@RequestParam Long eventSeq) {
        return ApiResponse.ok(eventService.selectEventBySeq(eventSeq));
    }
}
