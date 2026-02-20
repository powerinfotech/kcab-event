package com.miso.lxnn.controller.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;

@Controller
public class ContingencyController {

    @RequestMapping("/under-construction")
    public String underConstruction(HttpServletResponse response) {
        response.setContentType("text/html;charset=utf-8");
        return "UnderConstruction";
    }
}
