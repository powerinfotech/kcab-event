package com.kcabEvent.dao;

import com.kcabEvent.dto.participant.MyEventDto;
import com.kcabEvent.dto.participant.MyProfileDto;
import com.kcabEvent.dto.participant.ParticipantEventOptionDto;
import com.kcabEvent.dto.participant.ParticipantEventRowDto;
import com.kcabEvent.dto.participant.ParticipantSearchDto;
import com.kcabEvent.dto.participant.ParticipantTypeOptionDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("participantDao")
public interface ParticipantDao {
    List<ParticipantEventRowDto> selectParticipantEventRows(ParticipantSearchDto searchDto);

    /** 해당 이메일로 등록된 참가자가 존재하는지 (My Events 인증 전 확인) */
    boolean existsByEmail(@Param("email") String email);

    /** 해당 이메일 참가자가 등록한 행사 목록 (My Events) */
    List<MyEventDto> selectMyEvents(@Param("email") String email);

    /** 해당 이메일의 (최신 등록 기준) 프로필 1건 (My Events 내 정보) */
    MyProfileDto selectMyProfile(@Param("email") String email);

    List<ParticipantEventOptionDto> selectParticipantEventOptions(@Param("organizationSeq") Long organizationSeq);

    List<ParticipantTypeOptionDto> selectParticipantTypeOptions();

    int updateParticipantEventType(
            @Param("participantSeq") Long participantSeq,
            @Param("eventParticipantSeq") Long eventParticipantSeq,
            @Param("participantTypeCd") String participantTypeCd,
            @Param("organizationSeq") Long organizationSeq
    );
}
