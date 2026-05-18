package com.kcabEvent.controller.noticenews;

import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.noticenews.NoticeNewsDetailDto;
import com.kcabEvent.dto.noticenews.NoticeNewsListDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSearchDto;
import com.kcabEvent.service.noticenews.NoticeNewsService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/notice-news")
public class PublicNoticeNewsController {

    @Resource(name = "noticeNewsService")
    private NoticeNewsService noticeNewsService;

    @GetMapping
    public ApiResponse<List<NoticeNewsListDto>> selectPublicNoticeNewsList(
            @RequestParam(required = false) String postType,
            @RequestParam(required = false) String keyword
    ) {
        NoticeNewsSearchDto search = new NoticeNewsSearchDto();
        search.setPostType(postType);
        search.setUseYn("Y");
        search.setKeyword(keyword);
        return ApiResponse.ok(noticeNewsService.selectNoticeNewsList(search));
    }

    @GetMapping("/{noticeNewsSeq}")
    public ApiResponse<NoticeNewsDetailDto> selectPublicNoticeNewsDetail(
            @PathVariable Long noticeNewsSeq
    ) {
        return ApiResponse.ok(noticeNewsService.selectPublicNoticeNewsDetail(noticeNewsSeq));
    }
}
