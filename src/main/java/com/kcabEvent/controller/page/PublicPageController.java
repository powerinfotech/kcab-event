package com.kcabEvent.controller.page;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.page.PageDetailDto;
import com.kcabEvent.dto.page.PageListDto;
import com.kcabEvent.service.page.PageService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 비로그인 공개 화면에서 사용하는 페이지 조회 API를 제공한다.
 */
@RestController
@RequestMapping("/api/public/page")
public class PublicPageController {

    @Resource(name = "pageService")
    private PageService pageService;

    /**
     * 공개 페이지 내비게이션 메타데이터를 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<PageListDto>> selectPageList() {
        return ApiResponse.ok(pageService.selectPageList());
    }

    /**
     * URL로 공개 페이지 상세 정보를 조회한다.
     */
    @GetMapping("/detail")
    public ApiResponse<PageDetailDto> selectPageByUrl(@RequestParam String pageUrl) {
        return ApiResponse.ok(pageService.selectPageByUrl(pageUrl));
    }
}
