package com.kcabEvent.controller.page;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.page.PageDetailDto;
import com.kcabEvent.dto.page.PageListDto;
import com.kcabEvent.dto.page.PageSaveDto;
import com.kcabEvent.service.page.PageService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/page")
public class PageManagementController {

    @Resource(name = "pageService")
    private PageService pageService;

    @GetMapping("/list")
    public ApiResponse<List<PageListDto>> selectPageList(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(pageService.selectPageList());
    }

    @GetMapping("/detail")
    public ApiResponse<PageDetailDto> selectPageDetail(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long pageSeq) {
        return ApiResponse.ok(pageService.selectPageBySeq(pageSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> savePage(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid PageSaveDto saveDto) {
        pageService.savePage(saveDto, loginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/delete")
    public ApiResponse<Void> deletePage(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long pageSeq) {
        pageService.deletePage(pageSeq);
        return ApiResponse.ok();
    }
}
