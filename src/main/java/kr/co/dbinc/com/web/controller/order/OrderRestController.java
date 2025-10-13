package kr.co.dbinc.com.web.controller.order;

import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.order.OrderRequestDto;
import kr.co.dbinc.com.web.dto.order.OrderResponseDto;
import kr.co.dbinc.com.web.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/orders")
public class OrderRestController {
    private final OrderService orderService;

    /**
     * 상품 주문
     */
    @PostMapping
    public ResponseEntity createOrder(@Valid @RequestBody OrderRequestDto.OrderCreateRequest orderCreateRequest) {
        OrderResponseDto.OrderResponse orderResponse = orderService.createOrderByJpa(orderCreateRequest);

        URI location = URI.create("/orders/" + orderResponse.getOrderId());
        return ResponseEntity.created(location).body(orderResponse);
    }
}
