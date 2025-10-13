package kr.co.dbinc.com.web.mapper.order;

import kr.co.dbinc.com.web.dto.order.OrderResponseDto;
import kr.co.dbinc.com.web.entity.order.Order;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

//    Order orderRequestDtoToOrder(OrderRequestDto.OrderRequest orderRequest);
    default OrderResponseDto.OrderResponse orderToOrderResponseDto(Order order) {
        if (order == null) {
            return null;
        }

        // items 변환
        List<OrderResponseDto.OrderItemSummary> items = new ArrayList<>();

        if (order.getOrderItems() != null) {
            for (OrderItem oi : order.getOrderItems()) {
                Long itemId = (oi.getItem() != null) ? oi.getItem().getId() : null;
                Long orderItemId = oi.getId();
                int orderPrice = oi.getOrderPrice();
                int count = oi.getCount();

                items.add(OrderResponseDto.OrderItemSummary.builder()
                        .itemId(itemId)
                        .orderItemId(orderItemId)
                        .orderPrice(orderPrice)
                        .count(count)
                        .build());
            }
        }

        return OrderResponseDto.OrderResponse.builder()
                .orderId(order.getId())
                .memberId(order.getMember() != null ? order.getMember().getId() : null)
                .orderStatus(order.getStatus() != null ? order.getStatus().name() : null)
                .orderDate(order.getOrderDate())
                .delivery(order.getDelivery())
                .items(items)
                .build();
    }
}
