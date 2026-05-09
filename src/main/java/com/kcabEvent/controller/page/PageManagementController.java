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

/**
 * 공개 페이지와 섹션을 관리하는 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/page")
public class PageManagementController {

    @Resource(name = "pageService")
    private PageService pageService;

    /**
     * 관리 대상 전체 페이지 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<PageListDto>> selectPageList(@KcabEventSession LoginUser loginUser) {
        return ApiResponse.ok(pageService.selectPageList());
    }

    /**
     * 페이지 순번으로 페이지 상세와 섹션 목록을 조회한다.
     */
    @GetMapping("/detail")
    public ApiResponse<PageDetailDto> selectPageDetail(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long pageSeq) {
        return ApiResponse.ok(pageService.selectPageBySeq(pageSeq));
    }

    /**
     * 페이지와 섹션을 생성하거나 수정한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> savePage(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid PageSaveDto saveDto) {
        pageService.savePage(saveDto, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 페이지와 하위 섹션을 삭제한다.
     */
    @PostMapping("/delete")
    public ApiResponse<Void> deletePage(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long pageSeq) {
        pageService.deletePage(pageSeq);
        return ApiResponse.ok();
    }
}
