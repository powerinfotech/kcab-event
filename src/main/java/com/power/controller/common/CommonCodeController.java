package com.power.controller.common;


import com.power.dto.common.ApiResponse;
import com.power.util.EnumCodeUtil;
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
