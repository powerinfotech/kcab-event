package com.kcabEvent.controller.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletResponse;

/**
 * JSON API 계층 밖에서 제공되는 비상 대응 페이지를 렌더링한다.
 */
@Controller
public class ContingencyController {

    /**
     * 점검 안내 페이지를 표시한다.
     */
    @RequestMapping("/under-construction")
    public String underConstruction(HttpServletResponse response) {
        response.setContentType("text/html;charset=utf-8");
        return "UnderConstruction";
    }
}
