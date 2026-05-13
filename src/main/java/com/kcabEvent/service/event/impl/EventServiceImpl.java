package com.kcabEvent.service.event.impl;

import com.kcabEvent.dao.EventDao;
import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dao.SafSettingsDao;
import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.email.EmailTemplateDetailDto;
import com.kcabEvent.dto.event.EventDiscountCodeDto;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventNotificationRecipientDto;
import com.kcabEvent.dto.event.EventPricingDto;
import com.kcabEvent.dto.event.EventSaveDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailLogService;
import com.kcabEvent.service.email.EmailTemplateService;
import com.kcabEvent.service.event.EventService;
import com.kcabEvent.util.EmailHtmlLayout;
import lombok.extern.slf4j.Slf4j;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import jakarta.annotation.Resource;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * 이벤트 저장과 기본값 처리를 구현한다.
 */
@Slf4j
@Service("eventService")
public class EventServiceImpl extends EgovAbstractServiceImpl implements EventService {

    private static final String STATUS_DRAFT = "draft";
    private static final String STATUS_PENDING_APPROVAL = "pending_approval";
    private static final String STATUS_PUBLISHED = "published";
    private static final String STATUS_REJECTED = "rejected";
    private static final String EVENT_TYPE_SIDE = "side";
    private static final String SIDE_EVENT_APPROVED_TEMPLATE_CODE = "side_event_approved";
    private static final String SIDE_EVENT_REJECTED_TEMPLATE_CODE = "side_event_rejected";
    private static final String DEFAULT_APPROVAL_COMMENT = "Your event page is ready to be published.";
    private static final DateTimeFormatter EVENT_DATE_FORMATTER = DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH);
    private static final DateTimeFormatter EVENT_TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Resource(name = "eventDao")
    private EventDao eventDao;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    @Resource(name = "safSettingsDao")
    private SafSettingsDao safSettingsDao;

    @Resource(name = "emailTemplateService")
    private EmailTemplateService emailTemplateService;

    @Autowired
    private EmailLogService emailLogService;

    @Override
    public List<EventListDto> selectEventList(String status, String eventType, String keyword) {
        return eventDao.selectEventList(status, eventType, keyword, null);
    }

    @Override
    public List<EventListDto> selectEventList(String status, String eventType, String keyword, LoginUser loginUser) {
        Long organizationSeq = resolveScopedOrganizationSeq(loginUser);
        return eventDao.selectEventList(status, eventType, keyword, organizationSeq);
    }

    @Override
    public Event selectEventBySeq(Long eventSeq) {
        Event event = eventDao.selectEventBySeq(eventSeq);
        loadPricingDetails(event, false);
        return event;
    }

    @Override
    public Event selectEventBySeq(Long eventSeq, LoginUser loginUser) {
        Event event = eventDao.selectEventBySeq(eventSeq);
        assertEventAccessible(event, loginUser);
        loadPricingDetails(event, true);
        return event;
    }

    @Override
    @Transactional("transactionManager")
    public Long saveEvent(EventSaveDto saveDto, LoginUser loginUser) {
        Long userSeq = getLoginUserSeq(loginUser);
        boolean admin = isAdmin(loginUser);
        Long organizationSeq = resolveScopedOrganizationSeq(loginUser);
        Event savedEvent = null;
        if (saveDto.getEventSeq() != null) {
            savedEvent = eventDao.selectEventBySeq(saveDto.getEventSeq());
            assertEventAccessible(savedEvent, loginUser);
            assertEventEditable(savedEvent, loginUser);
        }

        Event event = new Event();
        event.setTitle(saveDto.getTitle());
        String description = saveDto.getDescription() != null ? saveDto.getDescription() : saveDto.getContent();
        event.setDescription(description);
        event.setContent(description);
        event.setSummary(saveDto.getSummary());
        LocalDateTime startDt = saveDto.getEventStartDt() != null ? saveDto.getEventStartDt() : LocalDateTime.now();
        event.setEventStartDt(startDt);
        event.setEventEndDt(saveDto.getEventEndDt() != null ? saveDto.getEventEndDt() : startDt);
        event.setLocation(saveDto.getLocation());
        // 참가신청 방식 분기:
        //   none     → 등록 자체가 없는 행사. URL과 등록 시작/종료 모두 null.
        //   external → 외부 URL로 이동. URL 필수, 등록 시작/종료 필수.
        //   direct   → 자체 신청 화면. 등록 시작/종료 필수, URL은 null.
        String regType = saveDto.getRegistrationType();
        if ("none".equals(regType)) {
            event.setRegistrationType("none");
            event.setRegistrationUrl(null);
            event.setRegistrationStartDt(null);
            event.setRegistrationEndDt(null);
        } else if ("external".equals(regType)) {
            String regUrl = saveDto.getRegistrationUrl() != null ? saveDto.getRegistrationUrl().trim() : "";
            if (regUrl.isEmpty()) {
                throw new IllegalArgumentException("외부 참가신청 URL을 입력해주세요.");
            }
            if (saveDto.getRegistrationStartDt() == null || saveDto.getRegistrationEndDt() == null) {
                throw new IllegalArgumentException("참가신청 시작/종료 일시를 모두 입력해주세요.");
            }
            event.setRegistrationType("external");
            event.setRegistrationUrl(regUrl);
            event.setRegistrationStartDt(saveDto.getRegistrationStartDt());
            event.setRegistrationEndDt(saveDto.getRegistrationEndDt());
        } else {
            if (saveDto.getRegistrationStartDt() == null || saveDto.getRegistrationEndDt() == null) {
                throw new IllegalArgumentException("참가신청 시작/종료 일시를 모두 입력해주세요.");
            }
            event.setRegistrationType("direct");
            event.setRegistrationUrl(null);
            event.setRegistrationStartDt(saveDto.getRegistrationStartDt());
            event.setRegistrationEndDt(saveDto.getRegistrationEndDt());
        }
        event.setStatus(resolveSaveStatus(admin, savedEvent));
        event.setUseYn(saveDto.getUseYn() != null ? saveDto.getUseYn() : "Y");
        event.setFileSeq(saveDto.getFileSeq());
        event.setAttachmentFileSeq(saveDto.getAttachmentFileSeq());
        String resolvedEventType = admin ? (saveDto.getEventType() != null ? saveDto.getEventType() : "main") : EVENT_TYPE_SIDE;
        event.setEventType(resolvedEventType);
        event.setOrganizationSeq(organizationSeq != null ? organizationSeq : saveDto.getOrganizationSeq());
        event.setMaxParticipants(saveDto.getMaxParticipants());
        event.setIsPaid(admin && !EVENT_TYPE_SIDE.equals(resolvedEventType) && Boolean.TRUE.equals(saveDto.getIsPaid()));

        if (saveDto.getEventSeq() == null) {
            if (!admin) {
                assertOrganizationEventLimit(organizationSeq);
            }
            event.setRgstUserSeq(userSeq);
            event.setUptUserSeq(userSeq);
            eventDao.insertEvent(event);
        } else {
            event.setEventSeq(saveDto.getEventSeq());
            event.setUptUserSeq(userSeq);
            eventDao.updateEvent(event);
        }
        savePricingDetails(event.getEventSeq(), saveDto, userSeq, Boolean.TRUE.equals(event.getIsPaid()));
        return event.getEventSeq();
    }

    @Override
    @Transactional("transactionManager")
    public void requestApproval(Long eventSeq, LoginUser loginUser) {
        if (isAdmin(loginUser)) {
            throw new BusinessException("Only organization accounts can request event approval.");
        }
        Event event = eventDao.selectEventBySeq(eventSeq);
        assertEventAccessible(event, loginUser);
        if (!STATUS_DRAFT.equals(event.getStatus())) {
            throw new BusinessException("Only draft events can be submitted for approval.");
        }
        eventDao.updateEventStatus(eventSeq, STATUS_PENDING_APPROVAL, getLoginUserSeq(loginUser), null);
    }

    @Override
    @Transactional("transactionManager")
    public void cancelApproval(Long eventSeq, LoginUser loginUser) {
        if (isAdmin(loginUser)) {
            throw new BusinessException("Only organization accounts can cancel approval requests.");
        }
        Event event = eventDao.selectEventBySeq(eventSeq);
        assertEventAccessible(event, loginUser);
        if (!STATUS_PENDING_APPROVAL.equals(event.getStatus())) {
            throw new BusinessException("Only pending approval events can be cancelled.");
        }
        eventDao.updateEventStatus(eventSeq, STATUS_DRAFT, getLoginUserSeq(loginUser), null);
    }

    @Override
    @Transactional("transactionManager")
    public void approveEvent(Long eventSeq, LoginUser loginUser) {
        Event event = reviewPendingEvent(eventSeq, loginUser, STATUS_PUBLISHED, null);
        try {
            sendEventReviewEmail(event, SIDE_EVENT_APPROVED_TEMPLATE_CODE, null);
        } catch (RuntimeException e) {
            log.warn("Failed to send side event approval email. eventSeq={}", eventSeq, e);
        }
    }

    @Override
    @Transactional("transactionManager")
    public void rejectEvent(Long eventSeq, String rejectionReason, LoginUser loginUser) {
        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new BusinessException("Please enter a rejection reason.");
        }
        String trimmedReason = rejectionReason.trim();
        Event event = reviewPendingEvent(eventSeq, loginUser, STATUS_REJECTED, trimmedReason);
        try {
            sendEventReviewEmail(event, SIDE_EVENT_REJECTED_TEMPLATE_CODE, trimmedReason);
        } catch (RuntimeException e) {
            log.warn("Failed to send side event rejection email. eventSeq={}", eventSeq, e);
        }
    }

    @Override
    @Transactional("transactionManager")
    public void deleteEvent(Long eventSeq) {
        eventDao.deleteEvent(eventSeq);
    }

    @Override
    @Transactional("transactionManager")
    public void deleteEvent(Long eventSeq, LoginUser loginUser) {
        Event event = eventDao.selectEventBySeq(eventSeq);
        assertEventAccessible(event, loginUser);
        assertEventEditable(event, loginUser);
        eventDao.deleteEvent(eventSeq);
    }

    private Long resolveScopedOrganizationSeq(LoginUser loginUser) {
        if (isAdmin(loginUser)) {
            return null;
        }
        Long userSeq = getLoginUserSeq(loginUser);
        Long organizationSeq = safOrganizationDao.selectOrganizationSeqByUserSeq(userSeq);
        if (organizationSeq == null) {
            throw new BusinessException("No organization is linked to this account.");
        }
        return organizationSeq;
    }

    private void assertEventAccessible(Event event, LoginUser loginUser) {
        if (event == null) {
            throw new BusinessException("Event was not found.");
        }
        Long organizationSeq = resolveScopedOrganizationSeq(loginUser);
        if (organizationSeq != null && !organizationSeq.equals(event.getOrganizationSeq())) {
            throw new BusinessException("You can only access events owned by your organization.");
        }
    }

    private void assertEventEditable(Event event, LoginUser loginUser) {
        if (isAdmin(loginUser)) {
            if (STATUS_PENDING_APPROVAL.equals(event.getStatus()) || STATUS_REJECTED.equals(event.getStatus())) {
                throw new BusinessException("This event can no longer be edited.");
            }
            return;
        }
        if (!STATUS_DRAFT.equals(event.getStatus()) && !STATUS_PUBLISHED.equals(event.getStatus())) {
            throw new BusinessException("This event can no longer be edited.");
        }
    }

    private void assertOrganizationEventLimit(Long organizationSeq) {
        safSettingsDao.createCommonCodeGroupTableIfMissing();
        safSettingsDao.createCommonCodeTableIfMissing();
        safSettingsDao.insertOrganizationGradeCodeGroupIfMissing();
        safSettingsDao.insertDefaultOrganizationGradeCodesIfMissing();

        Integer maxEventCount = safSettingsDao.selectOrganizationMaxEventCount(organizationSeq);
        if (maxEventCount == null) {
            return;
        }

        long currentEventCount = safSettingsDao.countOrganizationHostedEvents(organizationSeq);
        if (currentEventCount >= maxEventCount) {
            throw new BusinessException("This organization's grade allows up to "
                    + maxEventCount + " hosted event(s). Please contact the administrator.");
        }
    }

    private String resolveSaveStatus(boolean admin, Event savedEvent) {
        if (admin) {
            return STATUS_PUBLISHED;
        }
        if (savedEvent == null) {
            return STATUS_DRAFT;
        }
        return savedEvent.getStatus();
    }

    private void loadPricingDetails(Event event, boolean includeDiscountCodes) {
        if (event == null) {
            return;
        }
        event.setPricingList(eventDao.selectEventPricingList(event.getEventSeq()));
        if (includeDiscountCodes) {
            event.setDiscountCodes(eventDao.selectEventDiscountCodeList(event.getEventSeq()));
        } else {
            event.setDiscountCodes(List.of());
        }
    }

    private void savePricingDetails(Long eventSeq, EventSaveDto saveDto, Long userSeq, boolean isPaid) {
        if (!isPaid) {
            eventDao.softDeleteEventDiscountCodesByEventSeq(eventSeq, userSeq);
            eventDao.softDeleteEventPricingByEventSeq(eventSeq, userSeq);
            return;
        }

        List<EventPricingDto> pricingList = normalizePricingList(saveDto.getPricingList());
        List<EventDiscountCodeDto> discountCodes = normalizeDiscountCodes(saveDto.getDiscountCodes(), pricingList);
        Map<Long, EventPricingDto> currentPricing = mapPricingBySeq(eventDao.selectEventPricingList(eventSeq));
        Map<Long, EventDiscountCodeDto> currentDiscountCodes = mapDiscountCodesBySeq(eventDao.selectEventDiscountCodeList(eventSeq));
        Set<Long> retainedPricingSeqs = new HashSet<>();
        Set<Long> retainedDiscountCodeSeqs = new HashSet<>();

        for (int i = 0; i < pricingList.size(); i++) {
            EventPricingDto pricing = pricingList.get(i);
            pricing.setEventSeq(eventSeq);
            pricing.setSortSeq(i + 1);
            Long pricingSeq = pricing.getEventPricingSeq();
            if (pricingSeq != null && currentPricing.containsKey(pricingSeq)) {
                assertPricingCanBeUpdated(currentPricing.get(pricingSeq), pricing);
                eventDao.updateEventPricing(pricing, userSeq);
                retainedPricingSeqs.add(pricingSeq);
            } else {
                pricing.setEventPricingSeq(null);
                eventDao.insertEventPricing(pricing, userSeq);
            }
        }
        for (int i = 0; i < discountCodes.size(); i++) {
            EventDiscountCodeDto discountCode = discountCodes.get(i);
            discountCode.setEventSeq(eventSeq);
            discountCode.setSortSeq(i + 1);
            Long discountCodeSeq = discountCode.getDiscountCodeSeq();
            if (discountCodeSeq != null && currentDiscountCodes.containsKey(discountCodeSeq)) {
                assertDiscountCodeCanBeUpdated(currentDiscountCodes.get(discountCodeSeq), discountCode);
                eventDao.updateEventDiscountCode(discountCode, userSeq);
                retainedDiscountCodeSeqs.add(discountCodeSeq);
            } else {
                discountCode.setDiscountCodeSeq(null);
                eventDao.insertEventDiscountCode(discountCode, userSeq);
            }
        }
        for (EventPricingDto current : currentPricing.values()) {
            if (!retainedPricingSeqs.contains(current.getEventPricingSeq())) {
                eventDao.softDeleteEventPricingBySeq(current.getEventPricingSeq(), userSeq);
            }
        }
        for (EventDiscountCodeDto current : currentDiscountCodes.values()) {
            if (!retainedDiscountCodeSeqs.contains(current.getDiscountCodeSeq())) {
                eventDao.softDeleteEventDiscountCodeBySeq(current.getDiscountCodeSeq(), userSeq);
            }
        }
    }

    private Map<Long, EventPricingDto> mapPricingBySeq(List<EventPricingDto> pricingList) {
        Map<Long, EventPricingDto> result = new HashMap<>();
        if (pricingList == null) {
            return result;
        }
        for (EventPricingDto pricing : pricingList) {
            if (pricing.getEventPricingSeq() != null) {
                result.put(pricing.getEventPricingSeq(), pricing);
            }
        }
        return result;
    }

    private Map<Long, EventDiscountCodeDto> mapDiscountCodesBySeq(List<EventDiscountCodeDto> discountCodes) {
        Map<Long, EventDiscountCodeDto> result = new HashMap<>();
        if (discountCodes == null) {
            return result;
        }
        for (EventDiscountCodeDto discountCode : discountCodes) {
            if (discountCode.getDiscountCodeSeq() != null) {
                result.put(discountCode.getDiscountCodeSeq(), discountCode);
            }
        }
        return result;
    }

    private void assertPricingCanBeUpdated(EventPricingDto current, EventPricingDto next) {
        if (current == null || nullToZero(current.getPaymentCount()) <= 0) {
            return;
        }
        boolean immutableChanged = !Objects.equals(normalizeKey(current.getPriceType()), normalizeKey(next.getPriceType()))
                || !Objects.equals(normalizeCurrency(current.getCurrencyCode()), normalizeCurrency(next.getCurrencyCode()))
                || compareAmount(current.getAmount(), next.getAmount()) != 0;
        if (immutableChanged) {
            throw new BusinessException("A sold pricing tier cannot change type, currency, or amount. Deactivate it and add a new price.");
        }
    }

    private void assertDiscountCodeCanBeUpdated(EventDiscountCodeDto current, EventDiscountCodeDto next) {
        if (current == null || nullToZero(current.getPaymentCount()) <= 0) {
            return;
        }
        boolean immutableChanged = !Objects.equals(normalizeDiscountCode(current.getDiscountCode()), normalizeDiscountCode(next.getDiscountCode()))
                || !Objects.equals(normalizeKey(current.getDiscountType()), normalizeKey(next.getDiscountType()))
                || compareAmount(current.getDiscountValue(), next.getDiscountValue()) != 0
                || !Objects.equals(normalizeOptionalCurrency(current.getCurrencyCode()), normalizeOptionalCurrency(next.getCurrencyCode()))
                || !Objects.equals(normalizeKey(current.getAppliesToPriceType()), normalizeKey(next.getAppliesToPriceType()));
        if (immutableChanged) {
            throw new BusinessException("A used discount code cannot change code, type, value, currency, or applies-to. Deactivate it and add a new code.");
        }
    }

    private int compareAmount(BigDecimal left, BigDecimal right) {
        BigDecimal safeLeft = left != null ? left : BigDecimal.ZERO;
        BigDecimal safeRight = right != null ? right : BigDecimal.ZERO;
        return safeLeft.compareTo(safeRight);
    }

    private int nullToZero(Integer value) {
        return value != null ? value : 0;
    }

    private List<EventPricingDto> normalizePricingList(List<EventPricingDto> pricingList) {
        List<EventPricingDto> normalized = new ArrayList<>();
        if (pricingList == null) {
            throw new BusinessException("Please add at least one pricing tier for paid events.");
        }

        for (EventPricingDto source : pricingList) {
            if (source == null) {
                continue;
            }
            String priceType = normalizeKey(source.getPriceType());
            String priceName = trimToNull(source.getPriceName());
            String currencyCode = normalizeCurrency(source.getCurrencyCode());
            BigDecimal amount = source.getAmount();

            if (!StringUtils.hasText(priceType)) {
                throw new BusinessException("Please select a pricing type.");
            }
            if (!StringUtils.hasText(priceName)) {
                throw new BusinessException("Please enter a pricing name.");
            }
            if (!"USD".equals(currencyCode) && !"KRW".equals(currencyCode)) {
                throw new BusinessException("Currency must be USD or KRW.");
            }
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException("Pricing amount must be greater than 0.");
            }
            if (source.getSalesStartAt() != null
                    && source.getSalesEndAt() != null
                    && source.getSalesStartAt().isAfter(source.getSalesEndAt())) {
                throw new BusinessException("Pricing sales end must be on or after sales start.");
            }

            EventPricingDto target = new EventPricingDto();
            target.setEventPricingSeq(source.getEventPricingSeq());
            target.setPriceType(priceType);
            target.setPriceName(priceName);
            target.setCurrencyCode(currencyCode);
            target.setAmount(amount);
            target.setSalesStartAt(source.getSalesStartAt());
            target.setSalesEndAt(source.getSalesEndAt());
            target.setUseYn(normalizeUseYn(source.getUseYn()));
            normalized.add(target);
        }

        if (normalized.isEmpty()) {
            throw new BusinessException("Please add at least one pricing tier for paid events.");
        }
        return normalized;
    }

    private List<EventDiscountCodeDto> normalizeDiscountCodes(List<EventDiscountCodeDto> discountCodes,
                                                              List<EventPricingDto> pricingList) {
        List<EventDiscountCodeDto> normalized = new ArrayList<>();
        if (discountCodes == null || discountCodes.isEmpty()) {
            return normalized;
        }

        Set<String> priceTypes = new HashSet<>();
        for (EventPricingDto pricing : pricingList) {
            priceTypes.add(pricing.getPriceType());
        }

        Set<String> uniqueCodes = new HashSet<>();
        for (EventDiscountCodeDto source : discountCodes) {
            if (source == null) {
                continue;
            }
            String code = normalizeDiscountCode(source.getDiscountCode());
            String discountType = normalizeKey(source.getDiscountType());
            BigDecimal discountValue = source.getDiscountValue();
            String currencyCode = normalizeOptionalCurrency(source.getCurrencyCode());
            String appliesTo = normalizeKey(source.getAppliesToPriceType());

            if (!StringUtils.hasText(code)) {
                throw new BusinessException("Please enter a discount code.");
            }
            if (!uniqueCodes.add(code)) {
                throw new BusinessException("Discount codes must be unique per event.");
            }
            if (!"percent".equals(discountType) && !"amount".equals(discountType)) {
                throw new BusinessException("Please select a valid discount type.");
            }
            if (discountValue == null || discountValue.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException("Discount value must be greater than 0.");
            }
            if ("percent".equals(discountType) && discountValue.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new BusinessException("Percent discount cannot exceed 100.");
            }
            if ("amount".equals(discountType) && !StringUtils.hasText(currencyCode)) {
                throw new BusinessException("Please select a discount currency.");
            }
            if (StringUtils.hasText(currencyCode) && !"USD".equals(currencyCode) && !"KRW".equals(currencyCode)) {
                throw new BusinessException("Discount currency must be USD or KRW.");
            }
            if (StringUtils.hasText(appliesTo) && !priceTypes.contains(appliesTo)) {
                throw new BusinessException("Discount code applies to a pricing type that does not exist.");
            }
            if (source.getUsageLimit() != null && source.getUsageLimit() < 0) {
                throw new BusinessException("Usage limit must be 0 or greater.");
            }
            if (source.getValidFromAt() != null
                    && source.getValidToAt() != null
                    && source.getValidFromAt().isAfter(source.getValidToAt())) {
                throw new BusinessException("Discount valid-to date must be on or after valid-from date.");
            }

            EventDiscountCodeDto target = new EventDiscountCodeDto();
            target.setDiscountCodeSeq(source.getDiscountCodeSeq());
            target.setDiscountCode(code);
            target.setDiscountType(discountType);
            target.setDiscountValue(discountValue);
            target.setCurrencyCode("amount".equals(discountType) ? currencyCode : null);
            target.setAppliesToPriceType(StringUtils.hasText(appliesTo) ? appliesTo : null);
            target.setUsageLimit(source.getUsageLimit());
            target.setUsedCount(source.getUsedCount() != null ? source.getUsedCount() : 0);
            target.setValidFromAt(source.getValidFromAt());
            target.setValidToAt(source.getValidToAt());
            target.setUseYn(normalizeUseYn(source.getUseYn()));
            normalized.add(target);
        }
        return normalized;
    }

    private String normalizeKey(String value) {
        String text = trimToNull(value);
        return text == null ? "" : text.toLowerCase(Locale.ROOT);
    }

    private String normalizeCurrency(String value) {
        String text = trimToNull(value);
        return text == null ? "USD" : text.toUpperCase(Locale.ROOT);
    }

    private String normalizeOptionalCurrency(String value) {
        String text = trimToNull(value);
        return text == null ? null : text.toUpperCase(Locale.ROOT);
    }

    private String normalizeUseYn(String value) {
        return "N".equalsIgnoreCase(value) ? "N" : "Y";
    }

    private String normalizeDiscountCode(String value) {
        String text = trimToNull(value);
        return text == null ? "" : text.toUpperCase(Locale.ROOT);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String text = value.trim();
        return text.isEmpty() ? null : text;
    }

    private Event reviewPendingEvent(Long eventSeq, LoginUser loginUser, String nextStatus, String rejectionReason) {
        if (!isAdmin(loginUser)) {
            throw new BusinessException("Only administrators can review event approval requests.");
        }
        Event event = eventDao.selectEventBySeq(eventSeq);
        if (event == null) {
            throw new BusinessException("Event was not found.");
        }
        if (!STATUS_PENDING_APPROVAL.equals(event.getStatus())) {
            throw new BusinessException("Only pending approval events can be reviewed.");
        }
        eventDao.updateEventStatus(eventSeq, nextStatus, getLoginUserSeq(loginUser), rejectionReason);
        event.setStatus(nextStatus);
        event.setRejectionReason(rejectionReason);
        return event;
    }

    private void sendEventReviewEmail(Event event, String templateCode, String rejectionReason) {
        EventNotificationRecipientDto recipient = eventDao.selectEventNotificationRecipient(event.getEventSeq());
        if (recipient == null || !StringUtils.hasText(recipient.getRecipientEmail())) {
            log.warn("Skipped event review email because recipient email is empty. eventSeq={}", event.getEventSeq());
            return;
        }

        EmailTemplateDetailDto template = emailTemplateService.selectTemplateDetail(templateCode);
        if (!Boolean.TRUE.equals(template.getIsActive())) {
            log.info("Skipped event review email because template is inactive. templateCode={}", templateCode);
            return;
        }

        Map<String, String> variables = Map.of(
                "user_name", defaultText(recipient.getRecipientName(), recipient.getOrganizationName()),
                "organization_name", defaultText(recipient.getOrganizationName(), ""),
                "event_name", defaultText(event.getTitle(), ""),
                "event_date", formatEventDate(event),
                "event_time", formatEventTime(event),
                "venue", defaultText(event.getLocation(), ""),
                "approval_comment", DEFAULT_APPROVAL_COMMENT,
                "rejection_reason", defaultText(rejectionReason, event.getRejectionReason())
        );

        String subject = renderTemplate(template.getSubject(), variables, false);
        String bodyHtml = renderTemplate(template.getBodyHtml(), variables, true);
        String emailHtml = EmailHtmlLayout.wrapTemplateBody(bodyHtml);

        emailLogService.sendHtmlAndLog(
                template.getTemplateSeq(),
                recipient.getRecipientEmail(),
                recipient.getRecipientName(),
                subject,
                emailHtml,
                emailHtml
        );
    }

    private String renderTemplate(String template, Map<String, String> variables, boolean escapeHtml) {
        String rendered = template == null ? "" : template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            String value = entry.getValue() == null ? "" : entry.getValue();
            if (escapeHtml) {
                value = HtmlUtils.htmlEscape(value, StandardCharsets.UTF_8.name());
            }
            rendered = rendered.replace("{{" + entry.getKey() + "}}", value);
        }
        return rendered;
    }

    private String formatEventDate(Event event) {
        if (event.getEventStartDt() == null) return "";
        return event.getEventStartDt().format(EVENT_DATE_FORMATTER);
    }

    private String formatEventTime(Event event) {
        LocalDateTime start = event.getEventStartDt();
        LocalDateTime end = event.getEventEndDt();
        if (start == null && end == null) return "";
        if (start == null) return end.format(EVENT_TIME_FORMATTER);
        if (end == null) return start.format(EVENT_TIME_FORMATTER);
        return start.format(EVENT_TIME_FORMATTER) + " - " + end.format(EVENT_TIME_FORMATTER);
    }

    private String defaultText(String value, String defaultValue) {
        if (StringUtils.hasText(value)) {
            return value.trim();
        }
        return StringUtils.hasText(defaultValue) ? defaultValue.trim() : "";
    }

    private boolean isAdmin(LoginUser loginUser) {
        return loginUser != null && "Y".equals(loginUser.getAdmYn());
    }

    private Long getLoginUserSeq(LoginUser loginUser) {
        if (loginUser == null || loginUser.getUserSeq() == null) {
            throw new BusinessException("Login session is invalid.");
        }
        return loginUser.getUserSeq().longValue();
    }
}
