package com.kcabEvent.controller.page;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.page.PageDetailDto;
import com.kcabEvent.dto.page.PageListDto;
import com.kcabEvent.service.page.PageService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/public/page")
public class PublicPageController {

    @Resource(name = "pageService")
    private PageService pageService;

    @GetMapping("/list")
    public ApiResponse<List<PageListDto>> selectPageList() {
        return ApiResponse.ok(pageService.selectPageList());
    }

    @GetMapping("/detail")
    public ApiResponse<PageDetailDto> selectPageByUrl(@RequestParam String pageUrl) {
        return ApiResponse.ok(pageService.selectPageByUrl(pageUrl));
    }
}
