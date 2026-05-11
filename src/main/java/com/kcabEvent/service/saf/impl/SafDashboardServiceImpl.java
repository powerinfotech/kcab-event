package com.kcabEvent.service.saf.impl;

import com.kcabEvent.dao.SafDashboardDao;
import com.kcabEvent.dto.saf.SafDashboardMetricsDto;
import com.kcabEvent.dto.saf.SafOrgDashboardMetricsDto;
import com.kcabEvent.service.saf.SafDashboardService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("safDashboardService")
public class SafDashboardServiceImpl extends EgovAbstractServiceImpl implements SafDashboardService {

    @Resource(name = "safDashboardDao")
    private SafDashboardDao safDashboardDao;

    @Override
    @Transactional(value = "transactionManager", readOnly = true)
    public SafDashboardMetricsDto selectDashboardMetrics() {
        SafDashboardMetricsDto metrics = safDashboardDao.selectDashboardMetrics();
        if (metrics == null) {
            metrics = new SafDashboardMetricsDto();
        }
        metrics.setUpcomingEvents(safDashboardDao.selectUpcomingEvents());
        metrics.setPendingSideEvents(safDashboardDao.selectPendingSideEvents());
        return metrics;
    }

    @Override
    @Transactional(value = "transactionManager", readOnly = true)
    public SafOrgDashboardMetricsDto selectOrgDashboardMetrics(Long userSeq) {
        SafOrgDashboardMetricsDto empty = new SafOrgDashboardMetricsDto();
        empty.setMyEventCount(0L);
        empty.setPendingApprovalCount(0L);
        empty.setTotalApplicantCount(0L);
        empty.setMyEvents(List.of());
        if (userSeq == null) return empty;

        Long organizationSeq = safDashboardDao.selectOrganizationSeqByUserSeq(userSeq);
        if (organizationSeq == null) return empty;

        SafOrgDashboardMetricsDto metrics = safDashboardDao.selectOrgDashboardMetrics(organizationSeq);
        if (metrics == null) metrics = empty;
        metrics.setMyEvents(safDashboardDao.selectOrgEvents(organizationSeq));
        return metrics;
    }
}
