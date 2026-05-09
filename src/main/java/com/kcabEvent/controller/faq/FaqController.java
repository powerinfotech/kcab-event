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

/**
 * FAQ 목록 조회와 일괄 저장을 위한 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/faq")
public class FaqController {

    @Resource(name = "faqService")
    private FaqService faqService;

    /**
     * 카테고리 조건에 따라 FAQ 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<FaqListDto>> selectFaqList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(faqService.selectFaqList(category));
    }

    /**
     * 생성, 수정, 삭제된 FAQ 행을 저장한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> saveFaq(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid FaqSaveDto saveDto) {
        faqService.saveFaq(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
