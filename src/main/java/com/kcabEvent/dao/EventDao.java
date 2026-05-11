package com.kcabEvent.dao;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventNotificationRecipientDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("eventDao")
public interface EventDao {

    List<EventListDto> selectEventList(@Param("status") String status,
                                       @Param("eventType") String eventType,
                                       @Param("keyword") String keyword,
                                       @Param("organizationSeq") Long organizationSeq);

    Event selectEventBySeq(@Param("eventSeq") Long eventSeq);

    EventNotificationRecipientDto selectEventNotificationRecipient(@Param("eventSeq") Long eventSeq);

    void insertEvent(Event event);

    void updateEvent(Event event);

    int updateEventStatus(@Param("eventSeq") Long eventSeq,
                          @Param("status") String status,
                          @Param("updatedBy") Long updatedBy,
                          @Param("rejectionReason") String rejectionReason);

    void deleteEvent(@Param("eventSeq") Long eventSeq);

}
