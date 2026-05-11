package com.kcabEvent.controller.saf;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.saf.SafDashboardMetricsDto;
import com.kcabEvent.dto.saf.SafOrgDashboardMetricsDto;
import com.kcabEvent.service.saf.SafDashboardService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class SafDashboardController {

    @Resource(name = "safDashboardService")
    private SafDashboardService safDashboardService;

    @GetMapping("/metrics")
    public ApiResponse<SafDashboardMetricsDto> selectDashboardMetrics(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(safDashboardService.selectDashboardMetrics());
    }

    /** 로그인한 organization 사용자의 대시보드 메트릭 (소속 조직 기준) */
    @GetMapping("/org-metrics")
    public ApiResponse<SafOrgDashboardMetricsDto> selectOrgDashboardMetrics(@KcabEventSession LoginUser loginUser) {
        Long userSeq = loginUser != null && loginUser.getUserSeq() != null
                ? loginUser.getUserSeq().longValue()
                : null;
        return ApiResponse.ok(safDashboardService.selectOrgDashboardMetrics(userSeq));
    }
}
