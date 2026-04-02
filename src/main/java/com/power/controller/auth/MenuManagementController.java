package com.power.controller.auth;

import com.power.annotation.MisoSession;
import com.power.domain.Btn;
import com.power.domain.MenuBtn;
import com.power.dto.common.ApiResponse;
import com.power.dto.common.LoginUser;
import com.power.dto.auth.MenuListDto;
import com.power.dto.auth.MenuSaveDto;
import com.power.service.auth.MenuManagementService;
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
    public ApiResponse<List<MenuListDto>> selectMenuList(@MisoSession LoginUser loginUser) throws Exception {
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectMenuInfo(userId));
    }

    @GetMapping("/btn-list")
    public ApiResponse<List<Btn>> selectBtnList() throws Exception {
        return ApiResponse.ok(menuManagementService.selectBtnList());
    }

    @GetMapping("/menu-btn-list")
    public ApiResponse<List<MenuBtn>> selectMenuBtnList(@RequestParam("menuSeq") Long menuSeq) throws Exception {
        return ApiResponse.ok(menuManagementService.selectMenuBtnList(menuSeq));
    }

    @Parameter(name = "loginUser", hidden = true)
    @PostMapping("/save")
    public ApiResponse<Void> saveMenu(@MisoSession LoginUser loginUser, @RequestBody @Valid MenuSaveDto menuSaveDto) throws Exception {
        menuManagementService.saveMenu(loginUser, menuSaveDto);
        return ApiResponse.ok();
    }

    @Parameter(name = "loginUser", hidden = true)
    @DeleteMapping("/delete/{menuSeq}")
    public ApiResponse<Void> deleteMenu(@PathVariable("menuSeq") @NotNull Integer menuSeq) throws Exception {
        menuManagementService.deleteMenu(menuSeq);
        return ApiResponse.ok();
    }
}
