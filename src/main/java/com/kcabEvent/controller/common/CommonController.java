package com.kcabEvent.controller.common;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.auth.MenuListDto;
import com.kcabEvent.dto.common.MenuBtnDetailDto;
import com.kcabEvent.dto.master.UserListDto;
import com.kcabEvent.dto.master.UserListSearchDto;
import com.kcabEvent.domain.User;
import com.kcabEvent.enums.MenuType;
import com.kcabEvent.service.master.UserManagementService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;


@Slf4j
@RequestMapping("/api/common")
@RestController
public class CommonController {
    @Resource(name = "userManagementService")
    private UserManagementService userManagementService;

    @GetMapping("/login-info")
    public ApiResponse<LoginUser> loginInfo(@KcabEventSession LoginUser loginUser) {
        if (loginUser == null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(resolveLoginInfoResponse(loginUser));
    }

    private LoginUser resolveLoginInfoResponse(LoginUser loginUser) {
        try {
            User user = userManagementService.selectUserInfo(loginUser.getUserId());
            return user != null ? LoginUser.convert(user) : loginUser;
        } catch (DataAccessException e) {
            log.warn("기존 TB_USER 로그인 정보 조회 실패, 세션 사용자 정보 사용: {}", e.getMessage());
            return loginUser;
        }
    }

    @GetMapping("/menu-info")
    public ApiResponse<List<MenuListDto>> menuInfo(@KcabEventSession LoginUser loginUser) {
        if(loginUser ==null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(resolveFixedMenuInfo(loginUser));
    }

    private List<MenuListDto> resolveFixedMenuInfo(LoginUser loginUser) {
        boolean superAdmin = "Y".equals(loginUser.getAdmYn());
        List<MenuListDto> menus = new ArrayList<>();

        if (superAdmin) {
            menus.add(fixedMenu(100, "대시보드", "/", "DashBoard", 1, 1));
            menus.add(fixedMenu(110, "행사 관리", "/events", "admin/SuperEventList", 2, 1));
            menus.add(fixedMenu(111, "행사 등록", "/events/new", "admin/EventEditor", 3, 2));
            menus.add(fixedMenu(120, "부대행사 승인", "/side-events/SE-0042", "admin/SideEventReview", 4, 1));
            menus.add(fixedMenu(130, "참가자 관리", "/participants", "admin/Participants", 5, 1));
            menus.add(fixedMenu(140, "결제 관리", "/payments", "admin/Payments", 6, 1));
            menus.add(fixedMenu(150, "이메일 CMS", "/email-cms/registration-confirm", "admin/EmailCms", 7, 1));
            menus.add(fixedMenu(160, "사용자 관리", "/users", "admin/UserManagementMock", 8, 1));
            menus.add(fixedMenu(170, "환경 설정", "/settings", "admin/SettingsMock", 9, 1));
            return menus;
        }

        menus.add(fixedMenu(200, "대시보드", "/", "DashBoard", 1, 1));
        menus.add(fixedMenu(210, "내 부대행사", "/side-events", "admin/OrgSideEvents", 2, 1));
        menus.add(fixedMenu(211, "부대행사 신청", "/side-events/new", "admin/OrgSideEventForm", 3, 2));
        menus.add(fixedMenu(220, "참가자", "/participants", "admin/Participants", 4, 1));
        menus.add(fixedMenu(230, "프로필", "/profile", "admin/OrgProfile", 5, 1));
        return menus;
    }

    private MenuListDto fixedMenu(Integer menuSeq, String menuNm, String menuUrl, String menuViewPath, Integer sortSeq, Integer level) {
        MenuListDto menu = new MenuListDto();
        menu.setMenuSeq(menuSeq);
        menu.setUpMenuSeq(0);
        menu.setMenuNm(menuNm);
        menu.setMenuTypeCd(MenuType.V);
        menu.setMenuUrl(menuUrl);
        menu.setMenuViewPath(menuViewPath);
        menu.setUseYn("Y");
        menu.setSortSeq(sortSeq);
        menu.setMenuNamePath("관리자 > " + menuNm);
        menu.setMenuIdPath("admin>" + menuSeq);
        menu.setLevel(level);
        return menu;
    }

    @GetMapping("/user-list")
    public ApiResponse<List<UserListDto>> userList(@KcabEventSession LoginUser loginUser, UserListSearchDto userListSearchDto) {
        if(loginUser ==null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(userManagementService.selectUserList(userListSearchDto));
    }

    @GetMapping("/menu-btn-list")
    public ApiResponse<List<MenuBtnDetailDto>> menuBtnList(@KcabEventSession LoginUser loginUser, @RequestParam("menuSeq") Long menuSeq) {
        if(loginUser == null)
            return ApiResponse.ok(null);
        return ApiResponse.ok(List.of());
    }

}
