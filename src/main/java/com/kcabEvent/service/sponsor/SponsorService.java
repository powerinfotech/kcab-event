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

    /** 공개 페이지용: 게시(use_yn='Y')된 스폰서. year 미지정 시 최신 연도, tierCd 지정 시 해당 티어만. */
    List<SponsorListDto> selectPublicSponsorList(Integer year, String tierCd);

    Long saveSponsor(SponsorSaveDto saveDto, LoginUser loginUser);

    void deleteSponsor(Long sponsorSeq, LoginUser loginUser);
}
