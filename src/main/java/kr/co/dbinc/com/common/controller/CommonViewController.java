package kr.co.dbinc.com.common.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class CommonViewController {

    @GetMapping("header")
    public String header() {
        return "include/header";
    }

    @GetMapping("main")
    public String main(HttpServletRequest request, Model model) {
        if(isAjaxRequest(request)){
            return "main";
        }

        model.addAttribute("includePage", PageType.MAIN.getJspPath());
        return "layout/layout";
    }

    @GetMapping("")
    public String redirect_visit_m01() {
        return "redirect:/main";
    }

    /**
     * AJAX 요청 체크 메서드
     */
    private boolean isAjaxRequest(HttpServletRequest request) {
        String xhrHeader = request.getHeader("X-Requested-With");
        return (xhrHeader != null && xhrHeader.equals("XMLHttpRequest"));
    }
}
