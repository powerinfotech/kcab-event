package com.kcabEvent.controller.saf;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.email.EmailLogDetailDto;
import com.kcabEvent.dto.email.EmailLogListDto;
import com.kcabEvent.dto.email.EmailLogResendRequestDto;
import com.kcabEvent.dto.email.EmailLogResendResultDto;
import com.kcabEvent.dto.email.EmailLogSearchDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailLogManagementService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/email-logs")
public class SafEmailLogController {

    @Resource(name = "emailLogManagementService")
    private EmailLogManagementService emailLogManagementService;

    @GetMapping
    public ApiResponse<List<EmailLogListDto>> selectEmailLogList(
            @KcabEventSession LoginUser loginUser,
            EmailLogSearchDto searchDto
    ) {
        validateAdmin(loginUser);
        return ApiResponse.ok(emailLogManagementService.selectEmailLogList(searchDto));
    }

    @GetMapping("/{emailLogSeq}")
    public ApiResponse<EmailLogDetailDto> selectEmailLogDetail(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long emailLogSeq
    ) {
        validateAdmin(loginUser);
        return ApiResponse.ok(emailLogManagementService.selectEmailLogDetail(emailLogSeq));
    }

    @PostMapping("/resend")
    public ApiResponse<EmailLogResendResultDto> resendEmailLogs(
            @KcabEventSession LoginUser loginUser,
            @RequestBody EmailLogResendRequestDto requestDto
    ) {
        validateAdmin(loginUser);
        return ApiResponse.ok(emailLogManagementService.resendEmailLogs(requestDto));
    }

    private void validateAdmin(LoginUser loginUser) {
        if (loginUser == null || !"Y".equals(loginUser.getAdmYn())) {
            throw new BusinessException("Only administrators can view email history.");
        }
    }
}
