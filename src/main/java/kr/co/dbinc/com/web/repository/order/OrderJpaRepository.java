package kr.co.dbinc.com.web.repository.order;

import kr.co.dbinc.com.web.entity.item.Item;
import kr.co.dbinc.com.web.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderJpaRepository extends JpaRepository<Order, Long> {
}
