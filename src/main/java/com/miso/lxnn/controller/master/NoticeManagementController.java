package com.miso.lxnn.controller.master;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.CodeResponseDto;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.master.NoticeListDto;
import com.miso.lxnn.dto.master.NoticeListSearchDto;
import com.miso.lxnn.dto.master.NoticeSaveDto;
import com.miso.lxnn.service.master.NoticeUserManagementService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notice-mgt")
public class NoticeManagementController {

    @Resource(name="NoticeUserManagementService")
    private NoticeUserManagementService noticeUserManagementService;

    @GetMapping("/search-conditions")
    public ApiResponse<List<CodeResponseDto>> searchConditions(){
        return ApiResponse.ok(noticeUserManagementService.searchConditions());
    }

    @GetMapping("/notice-list")
    public ApiResponse<List<NoticeListDto>>selectNoticeList(NoticeListSearchDto dto){
        return ApiResponse.ok(noticeUserManagementService.selectNoticeList(dto));
    }

    @PostMapping("/notice-save")
    public ApiResponse<Integer> saveNotice(@MisoSession LoginUser loginUser, @RequestBody @Valid NoticeSaveDto dto){
        Integer noticSeq = noticeUserManagementService.saveNotice(dto,loginUser);
        return ApiResponse.ok(noticSeq);
    }
    @PostMapping("/notice-delete")
    public ApiResponse<Void> deleteNotice(@RequestBody NoticeSaveDto dto){
        noticeUserManagementService.deleteNotice(dto);
        return ApiResponse.ok();
    }

}
