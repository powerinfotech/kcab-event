package com.kcabEvent.controller.notice;

import com.kcabEvent.domain.Notice;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.notice.NoticeListDto;
import com.kcabEvent.service.notice.NoticeService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 비로그인 공개 화면에서 사용하는 공지사항 조회 API를 제공한다.
 */
@RestController
@RequestMapping("/api/public/notice")
public class PublicNoticeController {

    @Resource(name = "noticeService")
    private NoticeService noticeService;

    /**
     * 검색어 조건에 따라 공개 공지사항 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<NoticeListDto>> selectNoticeList(
            @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(noticeService.selectNoticeList(searchText));
    }

    /**
     * 조회수를 증가시키고 공개 공지사항 상세 정보를 조회한다.
     */
    @GetMapping("/detail")
    public ApiResponse<Notice> selectNoticeDetail(@RequestParam Long noticeSeq) {
        noticeService.incrementViewCount(noticeSeq);
        return ApiResponse.ok(noticeService.selectNoticeBySeq(noticeSeq));
    }
}
