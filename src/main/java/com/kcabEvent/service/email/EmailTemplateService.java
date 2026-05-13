package com.kcabEvent.service.email;

import com.kcabEvent.dto.email.EmailTemplateDetailDto;
import com.kcabEvent.dto.email.EmailTemplateListDto;
import com.kcabEvent.dto.email.EmailTemplatePreviewSendDto;
import com.kcabEvent.dto.email.EmailTemplateSaveDto;

import java.util.List;

public interface EmailTemplateService {
    List<EmailTemplateListDto> selectTemplateList();

    EmailTemplateDetailDto selectTemplateDetail(String code);

    void updateTemplate(String code, EmailTemplateSaveDto saveDto);

    void sendPreviewEmail(String code, EmailTemplatePreviewSendDto sendDto);
}
