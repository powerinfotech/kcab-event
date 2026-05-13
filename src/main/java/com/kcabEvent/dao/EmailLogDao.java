package com.kcabEvent.dao;

import com.kcabEvent.domain.EmailLog;
import com.kcabEvent.dto.email.EmailLogDetailDto;
import com.kcabEvent.dto.email.EmailLogListDto;
import com.kcabEvent.dto.email.EmailLogSearchDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("emailLogDao")
public interface EmailLogDao {
    void insertEmailLog(EmailLog emailLog);

    List<EmailLogListDto> selectEmailLogList(EmailLogSearchDto searchDto);

    EmailLogDetailDto selectEmailLogDetail(@Param("emailLogSeq") Long emailLogSeq);

    int updateEmailLogSent(@Param("emailLogSeq") Long emailLogSeq);

    int updateEmailLogFailed(
            @Param("emailLogSeq") Long emailLogSeq,
            @Param("errorMessage") String errorMessage
    );

    int updateEmailLogResent(@Param("emailLogSeq") Long emailLogSeq);

    int updateEmailLogResendFailed(
            @Param("emailLogSeq") Long emailLogSeq,
            @Param("errorMessage") String errorMessage
    );
}
