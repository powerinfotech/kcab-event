package com.kcabEvent.service.email;

import com.kcabEvent.dto.email.EmailLogDetailDto;
import com.kcabEvent.dto.email.EmailLogListDto;
import com.kcabEvent.dto.email.EmailLogResendRequestDto;
import com.kcabEvent.dto.email.EmailLogResendResultDto;
import com.kcabEvent.dto.email.EmailLogSearchDto;

import java.util.List;

public interface EmailLogManagementService {
    List<EmailLogListDto> selectEmailLogList(EmailLogSearchDto searchDto);

    EmailLogDetailDto selectEmailLogDetail(Long emailLogSeq);

    EmailLogResendResultDto resendEmailLogs(EmailLogResendRequestDto requestDto);
}
