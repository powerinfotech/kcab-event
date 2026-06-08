package com.kcabEvent.service.participant.impl;

import com.kcabEvent.dao.EventDao;
import com.kcabEvent.dao.ParticipantDao;
import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.participant.ParticipantEventDto;
import com.kcabEvent.dto.participant.ParticipantEventOptionDto;
import com.kcabEvent.dto.participant.ParticipantEventRowDto;
import com.kcabEvent.dto.participant.ParticipantEventTypeSaveDto;
import com.kcabEvent.dto.participant.ParticipantListDto;
import com.kcabEvent.dto.participant.ParticipantSearchDto;
import com.kcabEvent.dto.participant.ParticipantTypeOptionDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.participant.ParticipantService;
import com.kcabEvent.service.saf.SafSettingsService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service("participantService")
public class ParticipantServiceImpl extends EgovAbstractServiceImpl implements ParticipantService {

    @Resource(name = "participantDao")
    private ParticipantDao participantDao;

    @Resource(name = "eventDao")
    private EventDao eventDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    @Resource(name = "safSettingsService")
    private SafSettingsService safSettingsService;

    @Override
    public List<ParticipantListDto> selectParticipantList(
            String keyword,
            List<Long> eventSeqs,
            List<String> statuses,
            LoginUser loginUser
    ) {
        ensureParticipantRegistrationSchema();
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
                dto.setPhone(row.getPhone());
                dto.setAddress(row.getAddress());
                dto.setCity(row.getCity());
                dto.setNationality(row.getNationality());
                dto.setResidenceCountry(row.getResidenceCountry());
                dto.setEventCount(row.getTotalEventCount());
                return dto;
            });

            ParticipantEventDto event = new ParticipantEventDto();
            event.setEventParticipantSeq(row.getEventParticipantSeq());
            event.setEventSeq(row.getEventSeq());
            event.setEventTitle(row.getEventTitle());
            event.setEventType(row.getEventType());
            event.setParticipantTypeCd(row.getParticipantTypeCd());
            event.setParticipantTypeName(row.getParticipantTypeName());
            event.setPaymentName(row.getPaymentName());
            event.setPaymentSeq(row.getPaymentSeq());
            event.setPaymentStatus(row.getPaymentStatus());
            event.setPaymentAmount(row.getPaymentAmount());
            event.setPaymentCurrency(row.getPaymentCurrency());
            event.setPaymentMethod(row.getPaymentMethod());
            event.setPaymentOrderId(row.getPaymentOrderId());
            event.setPaymentTransactionId(row.getPaymentTransactionId());
            event.setPaymentRefundedAmount(row.getPaymentRefundedAmount());
            event.setPaymentPaidAt(row.getPaymentPaidAt());
            event.setPaymentCancelledAt(row.getPaymentCancelledAt());
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

    @Override
    @Transactional("transactionManager")
    public List<ParticipantTypeOptionDto> selectParticipantTypeOptions() {
        safSettingsService.ensureParticipantTypeCodeDefaults();
        return participantDao.selectParticipantTypeOptions();
    }

    @Override
    @Transactional("transactionManager")
    public void updateParticipantEventTypes(Long participantSeq, List<ParticipantEventTypeSaveDto> items, LoginUser loginUser) {
        if (participantSeq == null || participantSeq <= 0) {
            throw new BusinessException("Participant id is required.");
        }
        if (items == null || items.isEmpty()) {
            throw new BusinessException("No participating events were provided.");
        }

        safSettingsService.ensureParticipantTypeCodeDefaults();
        Long organizationSeq = resolveScopedOrganizationSeq(loginUser);
        Set<String> allowedCodes = participantDao.selectParticipantTypeOptions().stream()
                .map(ParticipantTypeOptionDto::getValue)
                .filter(StringUtils::hasText)
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        for (ParticipantEventTypeSaveDto item : items) {
            if (item.getEventParticipantSeq() == null || item.getEventParticipantSeq() <= 0) {
                throw new BusinessException("Participating event id is required.");
            }
            String participantTypeCd = normalizeParticipantTypeCode(item.getParticipantTypeCd());
            if (participantTypeCd != null && !allowedCodes.contains(participantTypeCd)) {
                throw new BusinessException("Invalid participant type: " + participantTypeCd);
            }
            int updated = participantDao.updateParticipantEventType(
                    participantSeq,
                    item.getEventParticipantSeq(),
                    participantTypeCd,
                    organizationSeq
            );
            if (updated <= 0) {
                throw new BusinessException("Participant event was not found or not accessible.");
            }
        }
    }

    private String normalizeParticipantTypeCode(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim().toUpperCase();
    }

    private void ensureParticipantRegistrationSchema() {
        eventDao.ensureParticipantsPhoneColumn();
        eventDao.ensureParticipantsAddressColumn();
        eventDao.ensureParticipantsCityColumn();
        eventDao.ensureParticipantsNationalityColumn();
        eventDao.ensureParticipantsResidenceCountryColumn();
        eventDao.backfillParticipantsResidenceCountry();
        eventDao.ensureEventRegistrationFieldsTable();
        eventDao.ensureEventParticipantProfilesTable();
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
