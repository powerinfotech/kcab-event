package com.miso.lxnn.controller.stats;

import com.miso.lxnn.dto.stats.AccessLogListDto;
import com.miso.lxnn.dto.stats.AccessLogListParam;
import com.miso.lxnn.dto.stats.AccessLogSearchUserListDto;
import com.miso.lxnn.dto.common.ApiResponse;
import com.miso.lxnn.service.stats.impl.AccessServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/access-log")
public class AccessLogController {

    @Resource(name = "accessService")
    private AccessServiceImpl accessService;

    @GetMapping("/user-list")
    public ApiResponse<List<AccessLogSearchUserListDto>> userList(String searchText) throws Exception {
        return ApiResponse.ok(accessService.selectUserList(searchText));
    }
    @GetMapping("/log-list")
    public ApiResponse<List<AccessLogListDto>> logList(AccessLogListParam param) throws Exception {
        return ApiResponse.ok(accessService.selectLogList(param));
    }
}
