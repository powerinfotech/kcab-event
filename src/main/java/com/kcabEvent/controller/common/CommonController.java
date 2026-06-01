package com.kcabEvent.controller.common;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.domain.User;
import com.kcabEvent.dao.SafOrganizationDao;
import com.kcabEvent.dto.auth.MenuListDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.common.MenuBtnDetailDto;
import com.kcabEvent.dto.master.UserListDto;
import com.kcabEvent.dto.master.UserListSearchDto;
import com.kcabEvent.enums.MenuType;
import com.kcabEvent.service.master.UserManagementService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * 애플리케이션 셸에서 사용하는 세션 사용자와 내비게이션 공통 API를 제공한다.
 */
@Slf4j
@RequestMapping("/api/common")
@RestController
public class CommonController {
    @Resource(name = "userManagementService")
    private UserManagementService userManagementService;

    @Resource(name = "safOrganizationDao")
    private SafOrganizationDao safOrganizationDao;

    /**
     * 현재 세션 사용자를 조회하고 가능하면 최신 사용자 정보로 보강한다.
     */
    @GetMapping("/login-info")
    public ApiResponse<LoginUser> loginInfo(@KcabEventSession LoginUser loginUser) {
        if (loginUser == null) {
            return ApiResponse.ok(null);
        }
        return ApiResponse.ok(resolveLoginInfoResponse(loginUser));
    }

    private LoginUser resolveLoginInfoResponse(LoginUser loginUser) {
        try {
            User user = userManagementService.selectUserInfo(loginUser.getUserId());
            return enrichOrganizationName(user != null ? LoginUser.convert(user) : loginUser);
        } catch (DataAccessException e) {
            log.warn("Legacy user lookup failed; using session user info: {}", e.getMessage());
            return enrichOrganizationName(loginUser);
        }
    }

    private LoginUser enrichOrganizationName(LoginUser loginUser) {
        if (loginUser == null || "Y".equals(loginUser.getAdmYn()) || loginUser.getUserSeq() == null) {
            return loginUser;
        }
        try {
            loginUser.setOrganizationName(safOrganizationDao.selectOrganizationNameByUserSeq(loginUser.getUserSeq().longValue()));
        } catch (DataAccessException e) {
            log.warn("Organization lookup failed for user {}: {}", loginUser.getUserSeq(), e.getMessage());
        }
        return loginUser;
    }

    /**
     * 현재 세션 사용자에 대한 고정 내비게이션 메뉴를 조회한다.
     */
    @GetMapping("/menu-info")
    public ApiResponse<List<MenuListDto>> menuInfo(@KcabEventSession LoginUser loginUser) {
        if (loginUser == null) {
            return ApiResponse.ok(null);
        }
        return ApiResponse.ok(resolveFixedMenuInfo(loginUser));
    }

    private List<MenuListDto> resolveFixedMenuInfo(LoginUser loginUser) {
        boolean admin = "Y".equals(loginUser.getAdmYn());
        List<MenuListDto> menus = new ArrayList<>();

        if (admin) {
            menus.add(fixedMenu(100, "Dashboard", "/", "DashBoard", 1, 1));
            menus.add(fixedMenu(110, "Event Management", "/events", "admin/SuperEventList", 2, 1));
            menus.add(fixedMenu(111, "Create Event", "/events/new", "admin/EventEditor", 3, 2));
            menus.add(fixedMenu(130, "Participant Management", "/participants", "admin/Participants", 4, 1));
            menus.add(fixedMenu(140, "Payment Management", "/payments", "admin/Payments", 5, 1));
            menus.add(fixedMenu(150, "Email CMS", "/email-cms/registration-confirm", "admin/EmailCms", 7, 1));
            menus.add(fixedMenu(155, "Email History", "/email-logs", "admin/EmailLogHistory", 8, 1));
            menus.add(fixedMenu(156, "Law Firm / Organization Management", "/organizations", "admin/OrganizationManagementMock", 9, 1));
            menus.add(fixedMenu(158, "Notice & News", "/notice-news", "admin/NoticeNews", 10, 1));
            menus.add(fixedMenu(159, "Gallery", "/gallery", "admin/Gallery", 11, 1));
            menus.add(fixedMenu(160, "User Management", "/users", "admin/UserManagementMock", 12, 1));
            menus.add(fixedMenu(165, "FAQ Management", "/faq", "admin/FaqManagement", 13, 1));
            menus.add(fixedMenu(166, "Popup Management", "/popups", "admin/PopupManagement", 14, 1));
            menus.add(fixedMenu(170, "Settings", "/settings", "admin/Settings", 99, 1));
            return menus;
        }

        menus.add(fixedMenu(200, "Dashboard", "/", "DashBoard", 1, 1));
        menus.add(fixedMenu(210, "Event Management", "/events", "admin/SuperEventList", 2, 1));
        menus.add(fixedMenu(220, "Participants", "/participants", "admin/Participants", 3, 1));
        menus.add(fixedMenu(240, "FAQ", "/faq", "admin/OrganizationFaq", 4, 1));
        menus.add(fixedMenu(230, "Organization Profile", "/profile", "admin/OrgProfile", 99, 1));
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
        menu.setMenuNamePath("Admin > " + menuNm);
        menu.setMenuIdPath("admin>" + menuSeq);
        menu.setLevel(level);
        return menu;
    }

    /**
     * 공통 선택창과 관리 화면에서 사용할 사용자 목록을 조회한다.
     */
    @GetMapping("/user-list")
    public ApiResponse<List<UserListDto>> userList(@KcabEventSession LoginUser loginUser, UserListSearchDto userListSearchDto) {
        if (loginUser == null) {
            return ApiResponse.ok(null);
        }
        return ApiResponse.ok(userManagementService.selectUserList(userListSearchDto));
    }

    /**
     * 메뉴에 대해 허용된 버튼 메타데이터를 조회한다.
     */
    @GetMapping("/menu-btn-list")
    public ApiResponse<List<MenuBtnDetailDto>> menuBtnList(@KcabEventSession LoginUser loginUser, @RequestParam("menuSeq") Long menuSeq) {
        if (loginUser == null) {
            return ApiResponse.ok(null);
        }
        return ApiResponse.ok(List.of());
    }
}
