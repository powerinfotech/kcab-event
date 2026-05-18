package com.kcabEvent.dao;

import com.kcabEvent.domain.saf.SafOrganization;
import com.kcabEvent.domain.saf.SafOrganizationMember;
import com.kcabEvent.dto.saf.SafAdminUserSaveDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

@EgovMapper("safOrganizationDao")
public interface SafOrganizationDao {

    void insertOrganization(SafOrganization org);

    void insertOrganizationMember(SafOrganizationMember member);

    int updateAdminOrganization(SafAdminUserSaveDto saveDto);

    int approveOrganizationByUserSeq(@Param("userSeq") Long userSeq, @Param("approvedBy") Long approvedBy);

    Long selectOrganizationSeqByUserSeq(@Param("userSeq") Long userSeq);

    String selectOrganizationNameByUserSeq(@Param("userSeq") Long userSeq);
}
