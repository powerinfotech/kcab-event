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

/**
 * 공지사항 목록, 상세 조회, 저장, 삭제를 위한 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/notice")
public class NoticeController {

    @Resource(name = "noticeService")
    private NoticeService noticeService;

    /**
     * 검색어 조건에 따라 공지사항 목록을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<NoticeListDto>> selectNoticeList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(noticeService.selectNoticeList(searchText));
    }

    /**
     * 공지사항 순번으로 상세 정보를 조회한다.
     */
    @GetMapping("/detail")
    public ApiResponse<Notice> selectNoticeDetail(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long noticeSeq) {
        return ApiResponse.ok(noticeService.selectNoticeBySeq(noticeSeq));
    }

    /**
     * 공지사항을 생성하거나 수정한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> saveNotice(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid NoticeSaveDto saveDto) {
        noticeService.saveNotice(saveDto, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 공지사항 순번으로 공지사항을 삭제한다.
     */
    @PostMapping("/delete")
    public ApiResponse<Void> deleteNotice(
            @KcabEventSession LoginUser loginUser,
            @RequestParam Long noticeSeq) {
        noticeService.deleteNotice(noticeSeq);
        return ApiResponse.ok();
    }
}
