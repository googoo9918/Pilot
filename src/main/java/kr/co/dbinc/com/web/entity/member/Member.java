package kr.co.dbinc.com.web.entity.member;

import jakarta.persistence.*;
import kr.co.dbinc.com.common.error.ErrorCode;
import kr.co.dbinc.com.common.error.exception.DomainException;
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

    @Column(unique = true, length = 10, nullable = false)
    private String name;

    @Column(unique = true, length = 11, nullable = false)
    private String phoneNumber;

    @Embedded
    private Address address;

    public Member(String name, String phoneNumber, Address address) {
        if (name == null || name.isBlank()) {
            throw new DomainException(ErrorCode.INVALID_MEMBER_NAME);
        }
        if (phoneNumber == null || !phoneNumber.matches("\\d{11}")) {
            throw new DomainException(ErrorCode.INVALID_PHONE_NUMBER);
        }
        if (address == null) {
            throw new DomainException(ErrorCode.INVALID_ADDRESS);
        }
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }
}
