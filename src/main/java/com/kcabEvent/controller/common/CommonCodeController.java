package com.kcabEvent.controller.common;


import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.util.EnumCodeUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 클라이언트 옵션 렌더링에 사용할 enum 기반 공통 코드를 제공한다.
 */
@RestController
@RequestMapping("/api/common-code")
public class CommonCodeController {

    /**
     * 요청한 enum 코드명의 라벨/값 목록을 조회한다.
     */
    @GetMapping("/{name}")
    public ApiResponse<Map<String, String>> getEnumCode(@PathVariable String name) {
        return ApiResponse.ok(EnumCodeUtil.getEnumCode(name));
    }

}
