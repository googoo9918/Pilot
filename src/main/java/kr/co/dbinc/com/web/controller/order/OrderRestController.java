package kr.co.dbinc.com.web.controller.order;

import jakarta.validation.Valid;
import kr.co.dbinc.com.web.dto.order.OrderRequestDto;
import kr.co.dbinc.com.web.dto.order.OrderResponseDto;
import kr.co.dbinc.com.web.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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

    /**
     * 주문 목록 조회
     */
    @GetMapping()
    public ResponseEntity getOrderList() {
        List<OrderResponseDto.OrderListRow> orderListRows = orderService.getOrderListByJpa();

        return ResponseEntity.ok(orderListRows);
    }

    /**
     * 주문 삭제 (취소)
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity deleteOrder(@PathVariable Long orderId) {
        orderService.cancelOrderByJpa(orderId);
        return ResponseEntity.ok().build();
    }
}
