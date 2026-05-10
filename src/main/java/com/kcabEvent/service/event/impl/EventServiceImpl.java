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
import java.time.LocalDateTime;
import java.util.List;

/**
 * 이벤트 저장과 기본값 처리를 구현한다.
 */
@Slf4j
@Service("eventService")
public class EventServiceImpl extends EgovAbstractServiceImpl implements EventService {

    @Resource(name = "eventDao")
    private EventDao eventDao;

    @Override
    public List<EventListDto> selectEventList(String status, String eventType, String keyword) {
        return eventDao.selectEventList(status, eventType, keyword);
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
        LocalDateTime startDt = saveDto.getEventStartDt() != null ? saveDto.getEventStartDt() : LocalDateTime.now();
        event.setEventStartDt(startDt);
        event.setEventEndDt(saveDto.getEventEndDt() != null ? saveDto.getEventEndDt() : startDt);
        event.setRegistrationStartDt(saveDto.getRegistrationStartDt());
        event.setRegistrationEndDt(saveDto.getRegistrationEndDt());
        event.setLocation(saveDto.getLocation());
        event.setPostalCode(saveDto.getPostalCode());
        event.setVenueAddress(saveDto.getVenueAddress());
        event.setAddressDetail(saveDto.getAddressDetail());
        event.setRegistrationUrl(saveDto.getRegistrationUrl());
        // 사용자 요구: 등록·수정 모두 status는 'published'로 강제 (사용자가 변경 불가)
        event.setStatus("published");
        event.setUseYn(saveDto.getUseYn() != null ? saveDto.getUseYn() : "Y");
        event.setFileSeq(saveDto.getFileSeq());
        event.setAttachmentFileSeq(saveDto.getAttachmentFileSeq());
        event.setEventType(saveDto.getEventType() != null ? saveDto.getEventType() : "main");
        event.setOrganizationSeq(saveDto.getOrganizationSeq());
        event.setMaxParticipants(saveDto.getMaxParticipants());
        event.setIsPaid(saveDto.getIsPaid() != null ? saveDto.getIsPaid() : Boolean.FALSE);

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
