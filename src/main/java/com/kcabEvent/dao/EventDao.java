package com.kcabEvent.dao;

import com.kcabEvent.domain.Event;
import com.kcabEvent.dto.event.DiscountCodeUsageDto;
import com.kcabEvent.dto.event.EventDiscountCodeDto;
import com.kcabEvent.dto.event.EventListDto;
import com.kcabEvent.dto.event.EventNotificationRecipientDto;
import com.kcabEvent.dto.event.EventPageBlockDto;
import com.kcabEvent.dto.event.EventPageComponentCategoryDto;
import com.kcabEvent.dto.event.EventPageComponentTemplateDto;
import com.kcabEvent.dto.event.EventPageSectionDto;
import com.kcabEvent.dto.event.EventPricingDto;
import com.kcabEvent.dto.event.PublicEventPageDto;
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

    PublicEventPageDto selectPublishedEventPageBySlug(@Param("urlSlug") String urlSlug);

    PublicEventPageDto selectEventPageBuilderByEventSeq(@Param("eventSeq") Long eventSeq,
                                                        @Param("languageCode") String languageCode);

    List<EventPageSectionDto> selectPublishedEventPageSections(@Param("eventPageSeq") Long eventPageSeq);

    List<EventPageBlockDto> selectPublishedEventPageBlocks(@Param("eventPageSeq") Long eventPageSeq);

    List<EventPageSectionDto> selectEventPageBuilderSections(@Param("eventPageSeq") Long eventPageSeq);

    List<EventPageBlockDto> selectEventPageBuilderBlocks(@Param("eventPageSeq") Long eventPageSeq);

    List<EventPageComponentCategoryDto> selectEventPageComponentCategories();

    List<EventPageComponentTemplateDto> selectEventPageComponentTemplates();

    void insertEventPage(PublicEventPageDto page);

    void updateEventPage(PublicEventPageDto page);

    void softDeleteEventPageBlocksByPageSeq(@Param("eventPageSeq") Long eventPageSeq,
                                            @Param("userSeq") Long userSeq);

    void softDeleteEventPageSectionsByPageSeq(@Param("eventPageSeq") Long eventPageSeq,
                                              @Param("userSeq") Long userSeq);

    void insertEventPageSection(EventPageSectionDto section);

    void insertEventPageBlock(EventPageBlockDto block);

    EventNotificationRecipientDto selectEventNotificationRecipient(@Param("eventSeq") Long eventSeq);

    List<EventPricingDto> selectEventPricingList(@Param("eventSeq") Long eventSeq);

    List<EventDiscountCodeDto> selectEventDiscountCodeList(@Param("eventSeq") Long eventSeq);

    EventDiscountCodeDto selectEventDiscountCodeBySeq(@Param("discountCodeSeq") Long discountCodeSeq);

    List<DiscountCodeUsageDto> selectDiscountCodeUsage(@Param("discountCodeSeq") Long discountCodeSeq);

    void insertEvent(Event event);

    void updateEvent(Event event);

    void softDeleteEventPricingByEventSeq(@Param("eventSeq") Long eventSeq,
                                          @Param("userSeq") Long userSeq);

    void softDeleteEventPricingBySeq(@Param("eventPricingSeq") Long eventPricingSeq,
                                     @Param("userSeq") Long userSeq);

    void softDeleteEventDiscountCodesByEventSeq(@Param("eventSeq") Long eventSeq,
                                                @Param("userSeq") Long userSeq);

    void softDeleteEventDiscountCodeBySeq(@Param("discountCodeSeq") Long discountCodeSeq,
                                          @Param("userSeq") Long userSeq);

    void insertEventPricing(@Param("pricing") EventPricingDto pricing,
                            @Param("userSeq") Long userSeq);

    void updateEventPricing(@Param("pricing") EventPricingDto pricing,
                            @Param("userSeq") Long userSeq);

    void insertEventDiscountCode(@Param("discountCode") EventDiscountCodeDto discountCode,
                                 @Param("userSeq") Long userSeq);

    void updateEventDiscountCode(@Param("discountCode") EventDiscountCodeDto discountCode,
                                 @Param("userSeq") Long userSeq);

    int updateEventStatus(@Param("eventSeq") Long eventSeq,
                          @Param("status") String status,
                          @Param("updatedBy") Long updatedBy,
                          @Param("rejectionReason") String rejectionReason);

    int closeExpiredEvents(@Param("closedStatus") String closedStatus,
                           @Param("currentStatuses") List<String> currentStatuses);

    void deleteEvent(@Param("eventSeq") Long eventSeq);

}
