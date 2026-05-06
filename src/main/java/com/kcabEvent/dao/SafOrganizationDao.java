package com.kcabEvent.dao;

import com.kcabEvent.domain.saf.SafOrganization;
import com.kcabEvent.domain.saf.SafOrganizationMember;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

@EgovMapper("safOrganizationDao")
public interface SafOrganizationDao {

    SafOrganization selectByBusinessNumber(@Param("businessNumber") String businessNumber);

    void insertOrganization(SafOrganization org);

    void insertOrganizationMember(SafOrganizationMember member);
}
