package com.kcabEvent.dto.saf;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * 조직(Organization) 대시보드 메트릭 응답 DTO.
 * 로그인한 organization 소속 사용자의 행사 통계를 담는다.
 */
@Getter
@Setter
public class SafOrgDashboardMetricsDto {
    /** 내(우리 조직) 행사 총 개수 (삭제되지 않은 것) */
    private Long myEventCount;
    /** 승인 대기 중인 내 부대행사 개수 */
    private Long pendingApprovalCount;
    private Long publishedEventCount;
    private Long draftEventCount;
    private Long rejectedEventCount;
    /** 내 행사들의 전체 참가신청자 수 (cancelled/refunded 제외) */
    private Long totalApplicantCount;
    private Long totalCapacityCount;
    /** 내 행사 카드 목록 (최근/임박 순) */
    private List<SafOrgDashboardEventDto> myEvents = List.of();
    private List<SafOrgDashboardActionItemDto> actionItems = List.of();
    private List<SafOrgDashboardRecentParticipantDto> recentParticipants = List.of();
}
