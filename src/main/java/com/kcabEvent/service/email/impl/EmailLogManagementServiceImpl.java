package com.kcabEvent.service.email.impl;

import com.kcabEvent.dao.EmailLogDao;
import com.kcabEvent.dto.email.EmailLogDetailDto;
import com.kcabEvent.dto.email.EmailLogListDto;
import com.kcabEvent.dto.email.EmailLogSearchDto;
import com.kcabEvent.exception.custom.BusinessException;
import com.kcabEvent.service.email.EmailLogManagementService;
import jakarta.annotation.Resource;
import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("emailLogManagementService")
public class EmailLogManagementServiceImpl extends EgovAbstractServiceImpl implements EmailLogManagementService {

    @Resource(name = "emailLogDao")
    private EmailLogDao emailLogDao;

    @Override
    public List<EmailLogListDto> selectEmailLogList(EmailLogSearchDto searchDto) {
        EmailLogSearchDto safeSearchDto = searchDto == null ? new EmailLogSearchDto() : searchDto;
        Integer limit = safeSearchDto.getLimit();
        if (limit == null) {
            safeSearchDto.setLimit(100);
        } else if (limit < 1) {
            safeSearchDto.setLimit(1);
        } else if (limit > 500) {
            safeSearchDto.setLimit(500);
        }
        return emailLogDao.selectEmailLogList(safeSearchDto);
    }

    @Override
    public EmailLogDetailDto selectEmailLogDetail(Long emailLogSeq) {
        EmailLogDetailDto detail = emailLogDao.selectEmailLogDetail(emailLogSeq);
        if (detail == null) {
            throw new BusinessException("Email log was not found.");
        }
        return detail;
    }
}
