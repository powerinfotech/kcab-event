package com.kcabEvent.service.event.impl;

import com.kcabEvent.dao.EventDao;
import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventSaveDto;
import com.kcabEvent.service.event.EventService;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import java.util.List;

@Slf4j
@Service("eventService")
public class EventServiceImpl extends EgovAbstractServiceImpl implements EventService {

    @Resource(name = "eventDao")
    private EventDao eventDao;

    @Override
    public List<EventListDto> selectEventList(String status) {
        return eventDao.selectEventList(status);
    }

    @Override
    public Event selectEventBySeq(Long eventSeq) {
        return eventDao.selectEventBySeq(eventSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void saveEvent(EventSaveDto saveDto, LoginUser loginUser) {
        Long userSeq = Long.valueOf(loginUser.getUserSeq());

        Event event = new Event();
        event.setTitle(saveDto.getTitle());
        event.setContent(saveDto.getContent());
        event.setSummary(saveDto.getSummary());
        event.setThumbnailUrl(saveDto.getThumbnailUrl());
        event.setEventStartDt(saveDto.getEventStartDt());
        event.setEventEndDt(saveDto.getEventEndDt());
        event.setLocation(saveDto.getLocation());
        event.setRegistrationUrl(saveDto.getRegistrationUrl());
        event.setStatus(saveDto.getStatus() != null ? saveDto.getStatus() : "UPCOMING");
        event.setUseYn(saveDto.getUseYn() != null ? saveDto.getUseYn() : "Y");
        event.setFileSeq(saveDto.getFileSeq());

        if (saveDto.getEventSeq() == null) {
            event.setRgstUserSeq(userSeq);
            event.setUptUserSeq(userSeq);
            eventDao.insertEvent(event);
        } else {
            event.setEventSeq(saveDto.getEventSeq());
            event.setUptUserSeq(userSeq);
            eventDao.updateEvent(event);
        }
    }

    @Override
    @Transactional("transactionManager")
    public void deleteEvent(Long eventSeq) {
        eventDao.deleteEvent(eventSeq);
    }
}
