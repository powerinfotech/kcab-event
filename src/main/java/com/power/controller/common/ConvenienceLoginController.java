package com.power.controller.common;

import com.power.service.common.ConvenienceLoginService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;

@Profile({"local", "dev"})
@Controller
public class ConvenienceLoginController {
    @Resource(name = "convenienceLoginService")
    private ConvenienceLoginService convenienceLoginService;


    @RequestMapping("/secure-login")
    public String convenienceLogin(@RequestParam("LX_USER") String id) {
        convenienceLoginService.login(id);
        return "redirect:/";
    }
}