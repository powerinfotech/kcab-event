package com.kcabEvent.controller.code;

import com.kcabEvent.annotation.KcabEventSession;
import com.kcabEvent.dto.code.ComGrpCdListDto;
import com.kcabEvent.dto.code.ComGrpCdSaveDto;
import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.dto.common.LoginUser;
import com.kcabEvent.service.code.ComGrpCdService;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;

/**
 * 공통 코드 그룹을 관리하는 관리자 API를 제공한다.
 */
@RestController
@RequestMapping("/api/com-grp-cd")
public class ComGrpCdController {

    @Resource(name = "comGrpCdService")
    private ComGrpCdService comGrpCdService;

    /**
     * 검색어와 사용 여부로 공통 코드 그룹을 조회한다.
     */
    @GetMapping("/list")
    public ApiResponse<List<ComGrpCdListDto>> selectComGrpCdList(
            @KcabEventSession LoginUser loginUser,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String useYn) {
        return ApiResponse.ok(comGrpCdService.selectComGrpCdList(searchText, useYn));
    }

    /**
     * 생성, 수정, 삭제된 공통 코드 그룹을 저장한다.
     */
    @PostMapping("/save")
    public ApiResponse<Void> saveComGrpCd(
            @KcabEventSession LoginUser loginUser,
            @RequestBody @Valid ComGrpCdSaveDto saveDto) {
        comGrpCdService.saveComGrpCd(saveDto, loginUser);
        return ApiResponse.ok();
    }
}
