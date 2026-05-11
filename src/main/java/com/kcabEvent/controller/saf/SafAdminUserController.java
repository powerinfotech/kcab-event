package com.kcabEvent.controller.saf;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.saf.SafAdminUserDetailDto;
import com.kcabEvent.dto.saf.SafAdminUserListDto;
import com.kcabEvent.dto.saf.SafAdminUserSaveDto;
import com.kcabEvent.dto.saf.SafAdminUserSearchDto;
import com.kcabEvent.service.saf.SafAdminUserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * SAF 사용자/기관 관리자 API.
 *
 * <p>관리자 화면에서 SAF 사용자 목록을 확인하고, 상세 정보를 수정하거나 가입 신청을 승인하는 기능을 제공한다.</p>
 */
@RestController
@RequestMapping("/api/admin/users")
public class SafAdminUserController {

    @Resource(name = "safAdminUserService")
    private SafAdminUserService safAdminUserService;

    /**
     * 사용자/기관 목록을 조회한다.
     */
    @GetMapping
    public ApiResponse<List<SafAdminUserListDto>> selectUserList(SafAdminUserSearchDto searchDto) {
        return ApiResponse.ok(safAdminUserService.selectUserList(searchDto));
    }

    /**
     * 사용자 상세 정보를 조회한다.
     */
    @GetMapping("/{userSeq}")
    public ApiResponse<SafAdminUserDetailDto> selectUserDetail(@PathVariable Long userSeq) {
        return ApiResponse.ok(safAdminUserService.selectUserDetail(userSeq));
    }

    @PostMapping
    public ApiResponse<Void> createUser(
            @KcabEventSession LoginUser loginUser,
            @RequestBody SafAdminUserSaveDto saveDto
    ) {
        safAdminUserService.createUser(saveDto, loginUser);
        return ApiResponse.ok();
    }

    /**
     * 사용자와 연결 기관 정보를 수정한다.
     */
    @PutMapping("/{userSeq}")
    public ApiResponse<Void> updateUser(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long userSeq,
            @RequestBody SafAdminUserSaveDto saveDto,
            HttpSession session
    ) {
        safAdminUserService.updateUser(userSeq, saveDto, loginUser, session);
        return ApiResponse.ok();
    }

    /**
     * 가입 신청 사용자를 승인한다.
     */
    @PostMapping("/{userSeq}/approve")
    public ApiResponse<Void> approveUser(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long userSeq
    ) {
        safAdminUserService.approveUser(userSeq, loginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/{userSeq}/suspend")
    public ApiResponse<Void> suspendUser(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long userSeq
    ) {
        safAdminUserService.suspendUser(userSeq, loginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/{userSeq}/reactivate")
    public ApiResponse<Void> reactivateUser(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long userSeq
    ) {
        safAdminUserService.reactivateUser(userSeq, loginUser);
        return ApiResponse.ok();
    }

    @PostMapping("/{userSeq}/withdraw")
    public ApiResponse<Void> withdrawUser(
            @KcabEventSession LoginUser loginUser,
            @PathVariable Long userSeq
    ) {
        safAdminUserService.withdrawUser(userSeq, loginUser);
        return ApiResponse.ok();
    }
}
