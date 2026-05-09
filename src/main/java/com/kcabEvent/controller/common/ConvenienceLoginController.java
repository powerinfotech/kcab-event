package com.kcabEvent.controller.common;

import com.kcabEvent.service.common.ConvenienceLoginService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;

/**
 * local/dev 환경에서만 사용하는 편의 로그인 기능을 제공한다.
 */
@Profile({"local", "dev"})
@Controller
public class ConvenienceLoginController {
    @Resource(name = "convenienceLoginService")
    private ConvenienceLoginService convenienceLoginService;


    /**
     * 요청한 사용자 세션을 생성하고 관리자 화면으로 이동한다.
     */
    @RequestMapping("/secure-login")
    public String convenienceLogin(@RequestParam("LX_USER") String id) {
        convenienceLoginService.login(id);
        return "redirect:/admin";
    }
}
