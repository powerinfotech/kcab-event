package com.miso.lxnn.controller.auth;

import com.miso.lxnn.annotation.MisoSession;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.dto.common.LoginUser;
import com.miso.lxnn.dto.auth.MenuListDto;
import com.miso.lxnn.dto.auth.MenuSaveDto;
import com.miso.lxnn.service.auth.MenuManagementService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
@RequestMapping("/api/menu-mgt")
public class MenuManagementController {
    @Resource(name = "menuManagementService")
    private MenuManagementService menuManagementService;

    @Parameter(name = "loginUser", hidden = true)
    @GetMapping("/menu-list")
    public ApiResponse<List<MenuListDto> > selectMenuList(@MisoSession LoginUser loginUser) throws Exception {
        String userId = loginUser.getUserId();
        return ApiResponse.ok(menuManagementService.selectMenuInfo(userId));
    }

    @Parameter(name = "loginUser", hidden = true)
    @PostMapping("/save")
    public ApiResponse<Void> saveMenu(@MisoSession LoginUser loginUser, @RequestBody @Valid MenuSaveDto menuSaveDto) throws Exception {
        menuManagementService.saveMenu(loginUser, menuSaveDto);
        return ApiResponse.ok();
    }

    @Parameter(name = "loginUser", hidden = true)
    @DeleteMapping("/delete/{menuSeq}")
    public ApiResponse<Void> saveMenu(@PathVariable("menuSeq") @NotNull Integer menuSeq) throws Exception {
        menuManagementService.deleteMenu(menuSeq);
        return ApiResponse.ok();
    }


}
