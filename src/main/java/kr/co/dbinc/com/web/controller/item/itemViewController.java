package kr.co.dbinc.com.web.controller.item;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.dbinc.com.common.controller.PageType;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.service.item.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/item")
@RequiredArgsConstructor
public class itemViewController {

    private final ItemService itemService;

    @GetMapping("itemForm")
    public String itemForm(HttpServletRequest request, @RequestParam(value = "itemId", required = false) Long itemId, Model model) {
        if (itemId != null && itemId > 0) {
            Item item = itemService.getItemById(itemId);
            model.addAttribute("item", item);
        }
        if (isAjaxRequest(request)) {
            return "item/itemForm";
        } else {
            model.addAttribute("includePage", PageType.ITEM_FORM.getJspPath());
            return "layout/layout";
        }
    }

    @GetMapping("itemList")
    public String itemList(HttpServletRequest request, Model model) {
        if (isAjaxRequest(request)) {
            return "item/itemList";
        } else {
            model.addAttribute("includePage", PageType.ITEM_LIST.getJspPath());
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
