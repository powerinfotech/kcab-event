package com.kcabEvent.dao;

import com.kcabEvent.dto.saf.SafDashboardMetricsDto;
import com.kcabEvent.dto.saf.SafDashboardUpcomingEventDto;
import com.kcabEvent.dto.saf.SafOrgDashboardEventDto;
import com.kcabEvent.dto.saf.SafOrgDashboardMetricsDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("safDashboardDao")
public interface SafDashboardDao {
    SafDashboardMetricsDto selectDashboardMetrics();

    List<SafDashboardUpcomingEventDto> selectUpcomingEvents();

    /** 로그인 user_seq로 소속 organization_seq 조회 (없으면 null) */
    Long selectOrganizationSeqByUserSeq(@Param("userSeq") Long userSeq);

    /** 특정 organization 행사 통계 */
    SafOrgDashboardMetricsDto selectOrgDashboardMetrics(@Param("organizationSeq") Long organizationSeq);

    /** 특정 organization 행사 카드 목록 (최근/임박 순) */
    List<SafOrgDashboardEventDto> selectOrgEvents(@Param("organizationSeq") Long organizationSeq);
}
