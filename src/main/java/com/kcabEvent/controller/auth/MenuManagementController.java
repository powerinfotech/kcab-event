package com.kcabEvent.controller.auth;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.domain.Btn;
import com.kcabEvent.domain.MenuBtn;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.dto.auth.MenuListDto;
import com.kcabEvent.dto.auth.MenuSaveDto;
import com.kcabEvent.service.auth.MenuManagementService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * 메뉴와 메뉴 버튼 연결을 관리하는 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/menu-mgt")
public class MenuManagementController {
    @Resource(name = "menuManagementService")
    private MenuManagementService menuManagementService;

    /**
     * 현재 관리자의 전체 메뉴 트리를 조회한다.
     */
    @Parameter(name = "loginUser", hidden = true)
    @GetMapping("/menu-list")
    public ApiResponse<List<MenuListDto>> selectMenuList(@KcabEventSession LoginUser loginUser) {
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectMenuInfo(userId));
    }

    /**
     * 사용 가능한 전체 버튼 정의 목록을 조회한다.
     */
    @GetMapping("/btn-list")
    public ApiResponse<List<Btn>> selectBtnList() {
        return ApiResponse.ok(menuManagementService.selectBtnList());
    }

    /**
     * 메뉴에 연결된 버튼 목록을 조회한다.
     */
    @GetMapping("/menu-btn-list")
    public ApiResponse<List<MenuBtn>> selectMenuBtnList(@RequestParam("menuSeq") @NotNull Long menuSeq) {
        return ApiResponse.ok(menuManagementService.selectMenuBtnList(menuSeq));
    }

    /**
     * 메뉴와 버튼 연결 정보를 생성하거나 수정한다.
     */
    @Parameter(name = "loginUser", hidden = true)
    @PostMapping("/save")
    public ApiResponse<Void> saveMenu(@KcabEventSession LoginUser loginUser, @RequestBody @Valid MenuSaveDto menuSaveDto) {
        menuManagementService.saveMenu(loginUser, menuSaveDto);
        return ApiResponse.ok();
    }

    /**
     * 메뉴 순번으로 메뉴를 삭제한다.
     */
    @Parameter(name = "loginUser", hidden = true)
    @DeleteMapping("/delete/{menuSeq}")
    public ApiResponse<Void> deleteMenu(@PathVariable("menuSeq") @NotNull Integer menuSeq) {
        menuManagementService.deleteMenu(menuSeq);
        return ApiResponse.ok();
    }
}
