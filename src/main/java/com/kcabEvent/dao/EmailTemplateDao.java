package com.kcabEvent.dao;

import com.kcabEvent.dto.email.EmailTemplateDetailDto;
import com.kcabEvent.dto.email.EmailTemplateListDto;
import com.kcabEvent.dto.email.EmailTemplateSaveDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("emailTemplateDao")
public interface EmailTemplateDao {
    void insertDefaultTemplateIfMissing(
            @Param("code") String code,
            @Param("name") String name,
            @Param("subject") String subject,
            @Param("bodyHtml") String bodyHtml,
            @Param("variables") String variables
    );

    List<EmailTemplateListDto> selectEmailTemplateList(@Param("codes") List<String> codes);

    EmailTemplateDetailDto selectEmailTemplateDetail(@Param("code") String code);

    int updateEmailTemplate(
            @Param("code") String code,
            @Param("saveDto") EmailTemplateSaveDto saveDto
    );
}
