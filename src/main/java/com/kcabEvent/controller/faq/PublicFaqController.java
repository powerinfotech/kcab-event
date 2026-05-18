package com.kcabEvent.controller.faq;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.faq.FaqListDto;
import com.kcabEvent.service.faq.FaqService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 비로그인 공개 화면에서 사용하는 FAQ 조회 API를 제공한다.
 */
@RestController
@RequestMapping("/api/public/faq")
public class PublicFaqController {

    @Resource(name = "faqService")
    private FaqService faqService;

    /**
     * 카테고리 조건에 따라 공개 FAQ 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<FaqListDto>> selectFaqList(
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(faqService.selectFaqList(category, "public", true));
    }
}
