package com.kcabEvent.controller.common;


import com.kcabEvent.dto.common.ApiResponse;
import com.kcabEvent.util.EnumCodeUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/common-code")
public class CommonCodeController {

    @GetMapping("/{name}")
    public ApiResponse<Map<String, String>> getEnumCode(@PathVariable String name) {
        return ApiResponse.ok(EnumCodeUtil.getEnumCode(name));
    }

}
