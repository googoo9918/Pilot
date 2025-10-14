package kr.co.dbinc.com.web.repository.order;

import kr.co.dbinc.com.web.dto.order.OrderQueryResponseDto;
import kr.co.dbinc.com.web.dto.order.OrderWriteRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMyBatisRepository {
    int insertDelivery(OrderWriteRequestDto.DeliveryCreate deliveryCreate);

    int insertOrder(OrderWriteRequestDto.OrderCreate orderCreate);

    int insertOrderItem(OrderWriteRequestDto.OrderItemCreate orderItemCreate);

    List<OrderQueryResponseDto.OrderListRow> findOrderList();

    int cancelOrder(Long orderId);

    int restoreItemStockByOrder(Long orderId);
}
