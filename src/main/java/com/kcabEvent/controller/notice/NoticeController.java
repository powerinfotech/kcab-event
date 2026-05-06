package com.kcabEvent.controller.notice;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.domain.Notice;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.notice.NoticeListDto;
import com.kcabEvent.dto.notice.NoticeSaveDto;
import com.kcabEvent.service.notice.NoticeService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

    @Resource(name = "noticeService")
    private NoticeService noticeService;

    @GetMapping("/list")
    public ApiResponse<List<NoticeListDto>> selectNoticeList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(noticeService.selectNoticeList(searchText));
    }

    @GetMapping("/detail")
    public ApiResponse<Notice> selectNoticeDetail(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long noticeSeq) {
        return ApiResponse.ok(noticeService.selectNoticeBySeq(noticeSeq));
    }

    @PostMapping("/save")
    public ApiResponse<Void> saveNotice(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid NoticeSaveDto saveDto) {
        noticeService.saveNotice(saveDto, loginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/delete")
    public ApiResponse<Void> deleteNotice(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long noticeSeq) {
        noticeService.deleteNotice(noticeSeq);
        return ApiResponse.ok();
    }
}
