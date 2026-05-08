package com.kcabEvent.dao;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.event.EventListDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("eventDao")
public interface EventDao {

    List<EventListDto> selectEventList(@Param("status") String status);

    Event selectEventBySeq(@Param("eventSeq") Long eventSeq);

    void insertEvent(Event event);

    void updateEvent(Event event);

    void deleteEvent(@Param("eventSeq") Long eventSeq);

}
