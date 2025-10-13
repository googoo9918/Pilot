package kr.co.dbinc.com.web.repository.order;

import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderJpaRepository extends JpaRepository<Order, Long> {
    
    @Query("SELECT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.item JOIN FETCH o.member JOIN FETCH o.delivery")
    List<Order> findAllWithOrderItemsAndMemberAndDelivery();
}
