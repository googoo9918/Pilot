package kr.co.dbinc.com.web.entity.delivery;

import jakarta.persistence.*;
import kr.co.dbinc.com.web.entity.Address;
import kr.co.dbinc.com.web.entity.order.Order;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long id;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status; //ENUM [READY(준비), COMP(배송)]

    public Delivery(Address address, DeliveryStatus deliveryStatus) {
        this.address = address;
        this.status = deliveryStatus;
    }
}
