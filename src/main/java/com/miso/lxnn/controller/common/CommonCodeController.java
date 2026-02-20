package com.miso.lxnn.controller.common;


import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.util.EnumCodeUtil;
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
