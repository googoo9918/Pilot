package kr.co.dbinc.com.web.controller.member;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.dbinc.com.common.controller.PageType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberViewController {

    @GetMapping("memberForm")
    public String memberForm(HttpServletRequest request, Model model) {
        if(isAjaxRequest(request)){
            return "member/memberForm";
        } else {
            model.addAttribute("includePage", PageType.MEMBER_FORM.getJspPath());
            return "layout/layout";
        }
    }

    @GetMapping("memberList")
    public String memberList(HttpServletRequest request, Model model) {
        if(isAjaxRequest(request)){
            return "member/memberList";
        } else {
            model.addAttribute("includePage", PageType.MEMBER_LIST.getJspPath());
            return "layout/layout";
        }
    }
    /**
     * AJAX 요청 체크 메서드
     */
    private boolean isAjaxRequest(HttpServletRequest request) {
        String xhrHeader = request.getHeader("X-Requested-With");
        return (xhrHeader != null && xhrHeader.equals("XMLHttpRequest"));
    }
}
