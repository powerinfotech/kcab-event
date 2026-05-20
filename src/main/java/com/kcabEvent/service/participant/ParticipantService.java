package com.kcabEvent.service.participant;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.participant.ParticipantEventOptionDto;
import com.kcabEvent.dto.participant.ParticipantEventTypeSaveDto;
import com.kcabEvent.dto.participant.ParticipantListDto;
import com.kcabEvent.dto.participant.ParticipantTypeOptionDto;

import java.util.List;

public interface ParticipantService {
    List<ParticipantListDto> selectParticipantList(
            String keyword,
            List<Long> eventSeqs,
            List<String> statuses,
            LoginUser loginUser
    );

    List<ParticipantEventOptionDto> selectEventOptions(LoginUser loginUser);

    List<ParticipantTypeOptionDto> selectParticipantTypeOptions();

    void updateParticipantEventTypes(Long participantSeq, List<ParticipantEventTypeSaveDto> items, LoginUser loginUser);
}
