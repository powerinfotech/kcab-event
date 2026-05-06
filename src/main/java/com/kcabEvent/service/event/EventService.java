package com.kcabEvent.service.event;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventSaveDto;

import java.util.List;

public interface EventService {
    List<EventListDto> selectEventList(String status);
    Event selectEventBySeq(Long eventSeq);
    void saveEvent(EventSaveDto saveDto, LoginUser loginUser);
    void deleteEvent(Long eventSeq);
}
