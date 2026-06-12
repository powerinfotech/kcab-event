package com.kcabEvent.controller.sponsor;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.sponsor.SponsorListDto;
import com.kcabEvent.service.sponsor.SponsorService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공개(비로그인) 스폰서 조회. /api/public/** 는 세션 인터셉터 제외. */
@RestController
@RequestMapping("/api/public/sponsors")
public class PublicSponsorController {

    @Resource(name = "sponsorService")
    private SponsorService sponsorService;

    @GetMapping("/list")
    public ApiResponse<List<SponsorListDto>> selectPublicSponsorList(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String tierCd
    ) {
        return ApiResponse.ok(sponsorService.selectPublicSponsorList(year, tierCd));
    }
}
