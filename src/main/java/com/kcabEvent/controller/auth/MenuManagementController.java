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

@RestController
@RequestMapping("/api/menu-mgt")
public class MenuManagementController {
    @Resource(name = "menuManagementService")
    private MenuManagementService menuManagementService;

    @Parameter(name = "loginUser", hidden = true)
    @GetMapping("/menu-list")
    public ApiResponse<List<MenuListDto>> selectMenuList(@KcabEventSession LoginUser loginUser) {
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectMenuInfo(userId));
    }

    @GetMapping("/btn-list")
    public ApiResponse<List<Btn>> selectBtnList() {
        return ApiResponse.ok(menuManagementService.selectBtnList());
    }

    @GetMapping("/menu-btn-list")
    public ApiResponse<List<MenuBtn>> selectMenuBtnList(@RequestParam("menuSeq") @NotNull Long menuSeq) {
        return ApiResponse.ok(menuManagementService.selectMenuBtnList(menuSeq));
    }

    @Parameter(name = "loginUser", hidden = true)
    @PostMapping("/save")
    public ApiResponse<Void> saveMenu(@KcabEventSession LoginUser loginUser, @RequestBody @Valid MenuSaveDto menuSaveDto) {
        menuManagementService.saveMenu(loginUser, menuSaveDto);
        return ApiResponse.ok();
    }

    @Parameter(name = "loginUser", hidden = true)
    @DeleteMapping("/delete/{menuSeq}")
    public ApiResponse<Void> deleteMenu(@PathVariable("menuSeq") @NotNull Integer menuSeq) {
        menuManagementService.deleteMenu(menuSeq);
        return ApiResponse.ok();
    }
}
