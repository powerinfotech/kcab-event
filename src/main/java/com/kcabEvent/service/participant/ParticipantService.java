package com.kcabEvent.service.participant;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.participant.ParticipantEventOptionDto;
import com.kcabEvent.dto.participant.ParticipantListDto;

import java.util.List;

public interface ParticipantService {
    List<ParticipantListDto> selectParticipantList(
            String keyword,
            List<Long> eventSeqs,
            List<String> statuses,
            LoginUser loginUser
    );

    List<ParticipantEventOptionDto> selectEventOptions(LoginUser loginUser);
}
