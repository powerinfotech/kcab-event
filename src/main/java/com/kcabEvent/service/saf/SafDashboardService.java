package com.kcabEvent.service.saf;

import com.kcabEvent.dto.saf.SafDashboardMetricsDto;
import com.kcabEvent.dto.saf.SafOrgDashboardMetricsDto;

public interface SafDashboardService {
    SafDashboardMetricsDto selectDashboardMetrics();

    /** 로그인한 organization 사용자의 대시보드 메트릭 조회 (소속 조직 없으면 빈 결과) */
    SafOrgDashboardMetricsDto selectOrgDashboardMetrics(Long userSeq);
}
