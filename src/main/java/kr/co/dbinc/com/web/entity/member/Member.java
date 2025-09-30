package kr.co.dbinc.com.web.entity.member;

import jakarta.persistence.*;
import kr.co.dbinc.com.web.entity.Address;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {
    @Id
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Embedded
    private Address address;

    public Member(String name, Address address) {
        this.name = name;
        this.address = address;
    }
}
