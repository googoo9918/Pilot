package kr.co.dbinc.com.web.service.order;

import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import kr.co.dbinc.com.common.error.exception.EntityNotFoundException;
import kr.co.dbinc.com.web.dto.order.OrderRequestDto;
import kr.co.dbinc.com.web.dto.order.OrderResponseDto;
import kr.co.dbinc.com.web.entity.delivery.Delivery;
import kr.co.dbinc.com.web.entity.delivery.DeliveryStatus;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.entity.order.Order;
import kr.co.dbinc.com.web.entity.order.OrderStatus;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import kr.co.dbinc.com.web.mapper.order.OrderMapper;
import kr.co.dbinc.com.web.repository.order.OrderJpaRepository;
import kr.co.dbinc.com.web.service.item.ItemService;
import kr.co.dbinc.com.web.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderJpaRepository orderJpaRepository;

    private final OrderMapper orderMapper;

    private final MemberService memberService;

    private final ItemService itemService;

    /**
     * JPA로 주문 등록
     */
    public OrderResponseDto.OrderResponse createOrderByJpa(OrderRequestDto.OrderCreateRequest orderCreateRequest) {
        Member member = memberService.getMemberById(orderCreateRequest.getMemberId());
        // 중복 상품 병합
        Map<Long, Integer> itemMap = new LinkedHashMap<>();
        for (OrderRequestDto.OrderItemRequest r : orderCreateRequest.getOrderItems()) {
            itemMap.merge(r.getItemId(), r.getCount(), Integer::sum);
        }

        // OrderItem 생성
        List<OrderItem> orderItems = new ArrayList<>();
        for (Map.Entry<Long, Integer> e : itemMap.entrySet()) {
            Long itemId = e.getKey();
            Integer count = e.getValue();

            Item item = itemService.getItemById(itemId);
            OrderItem oi = OrderItem.createOrderItem(item, item.getPrice(), count);
            orderItems.add(oi);
        }
        // 배송정보 생성
        Delivery delivery = new Delivery(member.getAddress(), DeliveryStatus.READY);

        // 주문 생성
        Order order = Order.createOrder(member, delivery, orderItems);
        order = orderJpaRepository.save(order);

        return orderMapper.orderToOrderResponseDto(order);
    }

    /**
     * JPA로 주문 목록 조회
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDto.OrderListRow> getOrderListByJpa() {
        List<Order> orders = orderJpaRepository.findAllWithOrderItemsAndMemberAndDelivery();

        return orderMapper.oderItemListToOrderListRows(orders);
    }

    /**
     * JPA로 주문 취소 (재고 복구, 상태 변경)
     */
    public void cancelOrderByJpa(Long orderId) {
        Order order = getOrderById(orderId);

        // 주문 상태가 ORDER인 경우에만 취소 가능
        if (order.getStatus() != OrderStatus.ORDER) {
            throw new BusinessException(ErrorCode.ORDER_ALREADY_CANCEL);
        }

        // 각 OrderItem에 대해 재고 복구
        for (OrderItem orderItem : order.getOrderItems()) {
            Item item = orderItem.getItem();
            if (item != null) {
                item.addStock(orderItem.getCount());
            }
        }

        // 주문 상태를 CANCEL로 변경
        order.changeStatus(OrderStatus.CANCEL);
        orderJpaRepository.save(order);
    }

    /**
     * PK로 order 조회
     */
    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        return orderJpaRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOT_EXIST_ORDER));
    }
}
