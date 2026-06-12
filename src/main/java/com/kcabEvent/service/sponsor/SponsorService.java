package com.kcabEvent.service.sponsor;

import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.sponsor.SponsorDetailDto;
import com.kcabEvent.dto.sponsor.SponsorListDto;
import com.kcabEvent.dto.sponsor.SponsorSaveDto;
import com.kcabEvent.dto.sponsor.SponsorSearchDto;
import com.kcabEvent.dto.sponsor.SponsorTierDto;

import java.util.List;

public interface SponsorService {
    List<SponsorListDto> selectSponsorList(SponsorSearchDto search);

    SponsorDetailDto selectSponsorDetail(Long sponsorSeq);

    List<SponsorTierDto> selectSponsorTiers();

    Long saveSponsor(SponsorSaveDto saveDto, LoginUser loginUser);

    void deleteSponsor(Long sponsorSeq, LoginUser loginUser);
}
