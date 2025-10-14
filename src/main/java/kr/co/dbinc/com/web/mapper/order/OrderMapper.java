package kr.co.dbinc.com.web.mapper.order;

import kr.co.dbinc.com.web.dto.order.OrderRequestDto;
import kr.co.dbinc.com.web.dto.order.OrderResponseDto;
import kr.co.dbinc.com.web.dto.order.OrderWriteRequestDto;
import kr.co.dbinc.com.web.entity.delivery.DeliveryStatus;
import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.entity.member.Member;
import kr.co.dbinc.com.web.entity.order.Order;
import kr.co.dbinc.com.web.entity.order.OrderStatus;
import kr.co.dbinc.com.web.entity.orderItem.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mappings({
            @Mapping(target = "orderId", source = "id"),
            @Mapping(target = "memberId", source = "member.id"),
            @Mapping(target = "orderStatus", source = "status", qualifiedByName = "enumToString"),
            @Mapping(target = "orderDate", source = "orderDate"),
            @Mapping(target = "delivery", source = "delivery"),
            @Mapping(target = "items", source = "orderItems")
    })
    OrderResponseDto.OrderResponse orderToOrderResponseDto(Order order);

    @Mappings({
            @Mapping(target = "itemId", source = "item.id"),
            @Mapping(target = "orderItemId", source = "id"),
            @Mapping(target = "orderPrice", source = "orderPrice"),
            @Mapping(target = "count", source = "count")
    })
    OrderResponseDto.OrderItemSummary orderItemToSummary(OrderItem orderItem);

    List<OrderResponseDto.OrderItemSummary> orderItemsToSummaries(List<OrderItem> orderItems);

    default List<OrderResponseDto.OrderListRow> orderItemListToOrderListRows(List<Order> orders) {
        List<OrderResponseDto.OrderListRow> orderListRows = new ArrayList<>();
        for (Order order : orders) {
            for (OrderItem orderItem : order.getOrderItems()) {
                OrderResponseDto.OrderListRow orderListRow = OrderResponseDto.OrderListRow.builder()
                        .orderItemId(orderItem.getId())
                        .orderId(order.getId())
                        .itemId(orderItem.getItem().getId())
                        .memberName(order.getMember() != null ? order.getMember().getName() : null)
                        .itemName(orderItem.getItem() != null ? orderItem.getItem().getName() : null)
                        .orderPrice(orderItem.getOrderPrice())
                        .count(orderItem.getCount())
                        .orderStatus(order.getStatus() != null ? order.getStatus().name() : null)
                        .address(order.getDelivery() != null && order.getDelivery().getAddress() != null
                                ? order.getDelivery().getAddress().getStreet() : null)
                        .zipcode(order.getDelivery() != null && order.getDelivery().getAddress() != null
                                ? order.getDelivery().getAddress().getZipcode() : null)
                        .orderDate(order.getOrderDate())
                        .build();

                orderListRows.add(orderListRow);
            }
        }
        return orderListRows;
    }

    @Mapping(target = "deliveryId", ignore = true)
    @Mapping(target = "city", source = "member.address.city")
    @Mapping(target = "street", source = "member.address.street")
    @Mapping(target = "zipcode", source = "member.address.zipcode")
    @Mapping(target = "status", expression = "java(status.name())")
    OrderWriteRequestDto.DeliveryCreate toDeliveryCreate(Member member, DeliveryStatus status);

    @Mapping(target = "orderId", ignore = true)
    @Mapping(target = "memberId", source = "request.memberId")
    @Mapping(target = "deliveryId", source = "deliveryId")
    @Mapping(target = "status", expression = "java(status.name())")
    OrderWriteRequestDto.OrderCreate toOrderCreate(OrderRequestDto.OrderCreateRequest request,
                                                   Long deliveryId,
                                                   OrderStatus status);

    @Mapping(target = "orderItemId", ignore = true)
    @Mapping(target = "orderId", source = "orderId")
    @Mapping(target = "itemId", source = "item.id")
    @Mapping(target = "orderPrice", source = "item.price")
    @Mapping(target = "count", source = "count")
    OrderWriteRequestDto.OrderItemCreate toOrderItemCreate(Long orderId, Item item, Integer count);

    @Named("enumToString")
    static String enumToString(Enum<?> e) {
        return e != null ? e.name() : null;
    }
}
