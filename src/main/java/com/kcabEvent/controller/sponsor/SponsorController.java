package com.kcabEvent.controller.sponsor;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.sponsor.SponsorDetailDto;
import com.kcabEvent.dto.sponsor.SponsorListDto;
import com.kcabEvent.dto.sponsor.SponsorSaveDto;
import com.kcabEvent.dto.sponsor.SponsorSearchDto;
import com.kcabEvent.dto.sponsor.SponsorTierDto;
import com.kcabEvent.service.sponsor.SponsorService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sponsor")
public class SponsorController {

    @Resource(name = "sponsorService")
    private SponsorService sponsorService;

    @GetMapping
    public ApiResponse<List<SponsorListDto>> selectSponsorList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) Integer editionYear,
            @RequestParam(required = false) String tierCd,
            @RequestParam(required = false) String useYn,
            @RequestParam(required = false) String keyword
    ) {
        SponsorSearchDto search = new SponsorSearchDto();
        search.setEditionYear(editionYear);
        search.setTierCd(tierCd);
        search.setUseYn(useYn);
        search.setKeyword(keyword);
        return ApiResponse.ok(sponsorService.selectSponsorList(search));
    }

    @GetMapping("/tiers")
    public ApiResponse<List<SponsorTierDto>> selectSponsorTiers(
            @KcabEventSession LoginUser loginUser
    ) {
        return ApiResponse.ok(sponsorService.selectSponsorTiers());
    }

    @GetMapping("/{sponsorSeq}")
    public ApiResponse<SponsorDetailDto> selectSponsorDetail(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long sponsorSeq
    ) {
        return ApiResponse.ok(sponsorService.selectSponsorDetail(sponsorSeq));
    }

    @PostMapping
    public ApiResponse<Long> createSponsor(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid SponsorSaveDto saveDto
    ) {
        saveDto.setSponsorSeq(null);
        return ApiResponse.ok(sponsorService.saveSponsor(saveDto, loginUser));
    }

    @PutMapping("/{sponsorSeq}")
    public ApiResponse<Long> updateSponsor(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long sponsorSeq,
            @RequestBody @Valid SponsorSaveDto saveDto
    ) {
        saveDto.setSponsorSeq(sponsorSeq);
        return ApiResponse.ok(sponsorService.saveSponsor(saveDto, loginUser));
    }

    @DeleteMapping("/{sponsorSeq}")
    public ApiResponse<Void> deleteSponsor(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long sponsorSeq
    ) {
        sponsorService.deleteSponsor(sponsorSeq, loginUser);
        return ApiResponse.ok();
    }
}
