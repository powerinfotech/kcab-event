package com.kcabEvent.dao;

import com.kcabEvent.domain.Sponsor;
import com.kcabEvent.dto.sponsor.SponsorDetailDto;
import com.kcabEvent.dto.sponsor.SponsorListDto;
import com.kcabEvent.dto.sponsor.SponsorSearchDto;
import com.kcabEvent.dto.sponsor.SponsorTierDto;
import org.apache.ibatis.annotations.Param;
import org.egovframe.rte.psl.dataaccess.mapper.EgovMapper;

import java.util.List;

@EgovMapper("sponsorDao")
public interface SponsorDao {
    List<SponsorListDto> selectSponsorList(SponsorSearchDto search);

    SponsorDetailDto selectSponsorDetail(@Param("sponsorSeq") Long sponsorSeq);

    List<SponsorTierDto> selectSponsorTiers();

    long insertSponsor(Sponsor sponsor);

    int updateSponsor(Sponsor sponsor);

    int softDeleteSponsor(@Param("sponsorSeq") Long sponsorSeq,
                          @Param("uptUserSeq") Long uptUserSeq);
}
