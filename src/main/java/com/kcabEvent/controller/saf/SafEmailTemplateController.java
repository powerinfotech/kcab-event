package com.kcabEvent.controller.saf;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.email.EmailTemplateDetailDto;
import com.kcabEvent.dto.email.EmailTemplateListDto;
import com.kcabEvent.dto.email.EmailTemplatePreviewSendDto;
import com.kcabEvent.dto.email.EmailTemplateSaveDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailTemplateService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/email-templates")
public class SafEmailTemplateController {

    @Resource(name = "emailTemplateService")
    private EmailTemplateService emailTemplateService;

    @GetMapping
    public ApiResponse<List<EmailTemplateListDto>> selectTemplateList(@KcabEventSession LoginUser loginUser) {
        validateAdmin(loginUser);
        return ApiResponse.ok(emailTemplateService.selectTemplateList());
    }

    @GetMapping("/{code}")
    public ApiResponse<EmailTemplateDetailDto> selectTemplateDetail(
            @KcabEventSession LoginUser loginUser,
            @PathVariable String code
    ) {
        validateAdmin(loginUser);
        return ApiResponse.ok(emailTemplateService.selectTemplateDetail(code));
    }

    @PutMapping("/{code}")
    public ApiResponse<Void> updateTemplate(
            @KcabEventSession LoginUser loginUser,
            @PathVariable String code,
            @RequestBody EmailTemplateSaveDto saveDto
    ) {
        validateAdmin(loginUser);
        emailTemplateService.updateTemplate(code, saveDto);
        return ApiResponse.ok();
    }

    @PostMapping("/{code}/preview-send")
    public ApiResponse<Void> sendPreviewEmail(
            @KcabEventSession LoginUser loginUser,
            @PathVariable String code,
            @RequestBody EmailTemplatePreviewSendDto sendDto
    ) {
        validateAdmin(loginUser);
        emailTemplateService.sendPreviewEmail(code, sendDto);
        return ApiResponse.ok();
    }

    private void validateAdmin(LoginUser loginUser) {
        if (loginUser == null || !"Y".equals(loginUser.getAdmYn())) {
            throw new BusinessException("Only administrators can manage email templates.");
        }
    }
}
