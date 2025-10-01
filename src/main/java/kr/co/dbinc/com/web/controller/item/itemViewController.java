package kr.co.dbinc.com.web.controller.item;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.dbinc.com.common.controller.PageType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/item")
@RequiredArgsConstructor
public class itemViewController {

    @GetMapping("itemForm")
    public String itemForm(HttpServletRequest request, Model model) {
        if (isAjaxRequest(request)) {
            return "item/itemForm";
        } else {
            model.addAttribute("includePage", PageType.ITEM_FORM.getJspPath());
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
