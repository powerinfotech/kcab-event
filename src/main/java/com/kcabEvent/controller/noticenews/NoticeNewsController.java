package com.kcabEvent.controller.noticenews;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.noticenews.NoticeNewsDetailDto;
import com.kcabEvent.dto.noticenews.NoticeNewsListDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSaveDto;
import com.kcabEvent.dto.noticenews.NoticeNewsSearchDto;
import com.kcabEvent.service.noticenews.NoticeNewsService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notice-news")
public class NoticeNewsController {

    @Resource(name = "noticeNewsService")
    private NoticeNewsService noticeNewsService;

    @GetMapping
    public ApiResponse<List<NoticeNewsListDto>> selectNoticeNewsList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String postType,
            @RequestParam(required = false) String useYn,
            @RequestParam(required = false) String keyword
    ) {
        NoticeNewsSearchDto search = new NoticeNewsSearchDto();
        search.setPostType(postType);
        search.setUseYn(useYn);
        search.setKeyword(keyword);
        return ApiResponse.ok(noticeNewsService.selectNoticeNewsList(search));
    }

    @GetMapping("/{noticeNewsSeq}")
    public ApiResponse<NoticeNewsDetailDto> selectNoticeNewsDetail(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long noticeNewsSeq
    ) {
        return ApiResponse.ok(noticeNewsService.selectNoticeNewsDetail(noticeNewsSeq));
    }

    @PostMapping
    public ApiResponse<Long> createNoticeNews(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid NoticeNewsSaveDto saveDto
    ) {
        saveDto.setNoticeNewsSeq(null);
        Long savedSeq = noticeNewsService.saveNoticeNews(saveDto, loginUser);
        return ApiResponse.ok(savedSeq);
    }

    @PutMapping("/{noticeNewsSeq}")
    public ApiResponse<Long> updateNoticeNews(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long noticeNewsSeq,
            @RequestBody @Valid NoticeNewsSaveDto saveDto
    ) {
        saveDto.setNoticeNewsSeq(noticeNewsSeq);
        Long savedSeq = noticeNewsService.saveNoticeNews(saveDto, loginUser);
        return ApiResponse.ok(savedSeq);
    }

    @DeleteMapping("/{noticeNewsSeq}")
    public ApiResponse<Void> deleteNoticeNews(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long noticeNewsSeq
    ) {
        noticeNewsService.deleteNoticeNews(noticeNewsSeq, loginUser);
        return ApiResponse.ok();
    }
}
