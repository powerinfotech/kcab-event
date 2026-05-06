package com.kcabEvent.controller.notice;

import com.kcabEvent.domain.Notice;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.notice.NoticeListDto;
import com.kcabEvent.service.notice.NoticeService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/public/notice")
public class PublicNoticeController {

    @Resource(name = "noticeService")
    private NoticeService noticeService;

    @GetMapping("/list")
    public ApiResponse<List<NoticeListDto>> selectNoticeList(
            @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(noticeService.selectNoticeList(searchText));
    }

    @GetMapping("/detail")
    public ApiResponse<Notice> selectNoticeDetail(@RequestParam Long noticeSeq) {
        noticeService.incrementViewCount(noticeSeq);
        return ApiResponse.ok(noticeService.selectNoticeBySeq(noticeSeq));
    }
}
