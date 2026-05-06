package com.kcabEvent.controller.faq;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.faq.FaqListDto;
import com.kcabEvent.service.faq.FaqService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/public/faq")
public class PublicFaqController {

    @Resource(name = "faqService")
    private FaqService faqService;

    @GetMapping("/list")
    public ApiResponse<List<FaqListDto>> selectFaqList(
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(faqService.selectFaqList(category));
    }
}
