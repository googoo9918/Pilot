package kr.co.dbinc.com.web.controller.order;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.dbinc.com.common.controller.PageType;
import kr.co.dbinc.com.web.dto.item.ItemResponseDto;
import kr.co.dbinc.com.web.dto.member.MemberResponseDto;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.service.item.ItemService;
import kr.co.dbinc.com.web.service.member.MemberService;
import kr.co.dbinc.com.web.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderViewController {

    private final MemberService memberService;

    private final ItemService itemService;

    private final OrderService orderService;

    @GetMapping("orderForm")
    public String orderForm(HttpServletRequest request, Model model) {
        List<MemberResponseDto.MemberResponse> memberResponseList = memberService.getMemberListByJpa();
        model.addAttribute("member", memberResponseList);

        List<ItemResponseDto.ItemResponse> itemResponseList = itemService.getItemListByJpa();
        model.addAttribute("item", itemResponseList);

        if (isAjaxRequest(request)) {
            return "order/orderForm";
        } else {
            model.addAttribute("includePage", PageType.ORDER_FORM.getJspPath());
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
