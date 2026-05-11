package com.kcabEvent.dao;

import com.kcabEvent.dto.participant.ParticipantEventOptionDto;
import com.kcabEvent.dto.participant.ParticipantEventRowDto;
import com.kcabEvent.dto.participant.ParticipantSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("participantDao")
public interface ParticipantDao {
    List<ParticipantEventRowDto> selectParticipantEventRows(ParticipantSearchDto searchDto);

    List<ParticipantEventOptionDto> selectParticipantEventOptions(@Param("organizationSeq") Long organizationSeq);
}
