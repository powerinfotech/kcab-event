package com.kcabEvent.controller.faq;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.faq.FaqListDto;
import com.kcabEvent.dto.faq.FaqSaveDto;
import com.kcabEvent.service.faq.FaqService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/faq")
public class FaqController {

    @Resource(name = "faqService")
    private FaqService faqService;

    @GetMapping("/list")
    public ApiResponse<List<FaqListDto>> selectFaqList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(faqService.selectFaqList(category));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveFaq(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid FaqSaveDto saveDto) {
        faqService.saveFaq(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
