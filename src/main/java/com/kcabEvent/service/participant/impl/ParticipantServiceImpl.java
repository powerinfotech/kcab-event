package com.kcabEvent.service.participant.impl;

import com.kcabEvent.dao.ParticipantDao;
import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.participant.ParticipantEventDto;
import com.kcabEvent.dto.participant.ParticipantEventOptionDto;
import com.kcabEvent.dto.participant.ParticipantEventRowDto;
import com.kcabEvent.dto.participant.ParticipantListDto;
import com.kcabEvent.dto.participant.ParticipantSearchDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.participant.ParticipantService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service("participantService")
public class ParticipantServiceImpl extends EgovAbstractServiceImpl implements ParticipantService {

    @Resource(name = "participantDao")
    private ParticipantDao participantDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    @Override
    public List<ParticipantListDto> selectParticipantList(
            String keyword,
            List<Long> eventSeqs,
            List<String> statuses,
            LoginUser loginUser
    ) {
        ParticipantSearchDto searchDto = new ParticipantSearchDto();
        searchDto.setKeyword(StringUtils.hasText(keyword) ? keyword.trim() : null);
        searchDto.setEventSeqs(eventSeqs == null || eventSeqs.isEmpty() ? null : eventSeqs);
        searchDto.setStatuses(statuses == null || statuses.isEmpty() ? null : statuses);
        searchDto.setOrganizationSeq(resolveScopedOrganizationSeq(loginUser));

        List<ParticipantEventRowDto> rows = participantDao.selectParticipantEventRows(searchDto);
        Map<Long, ParticipantListDto> participants = new LinkedHashMap<>();
        for (ParticipantEventRowDto row : rows) {
            ParticipantListDto participant = participants.computeIfAbsent(row.getParticipantSeq(), ignored -> {
                ParticipantListDto dto = new ParticipantListDto();
                dto.setParticipantSeq(row.getParticipantSeq());
                dto.setEmail(row.getEmail());
                dto.setFullName(row.getFullName());
                dto.setOrganizationName(row.getOrganizationName());
                dto.setPosition(row.getPosition());
                dto.setCountry(row.getCountry());
                dto.setEventCount(row.getTotalEventCount());
                return dto;
            });

            ParticipantEventDto event = new ParticipantEventDto();
            event.setEventParticipantSeq(row.getEventParticipantSeq());
            event.setEventSeq(row.getEventSeq());
            event.setEventTitle(row.getEventTitle());
            event.setEventType(row.getEventType());
            event.setStatus(row.getParticipationStatus());
            event.setRegisteredAt(row.getRegisteredAt());
            event.setCancelledAt(row.getCancelledAt());
            event.setCancelReason(row.getCancelReason());
            participant.getEvents().add(event);
        }

        participants.values().forEach(ParticipantListDto::refreshSummary);
        return List.copyOf(participants.values());
    }

    @Override
    public List<ParticipantEventOptionDto> selectEventOptions(LoginUser loginUser) {
        return participantDao.selectParticipantEventOptions(resolveScopedOrganizationSeq(loginUser));
    }

    private Long resolveScopedOrganizationSeq(LoginUser loginUser) {
        if (loginUser != null && "Y".equals(loginUser.getAdmYn())) {
            return null;
        }
        if (loginUser == null || loginUser.getUserSeq() == null) {
            throw new BusinessException("Login session is invalid.");
        }
        Long organizationSeq = safOrganizationDao.selectOrganizationSeqByUserSeq(loginUser.getUserSeq().longValue());
        if (organizationSeq == null) {
            throw new BusinessException("No organization is linked to this account.");
        }
        return organizationSeq;
    }
}
