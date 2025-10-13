package kr.co.dbinc.com.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 반환할 Http Status, 에러 코드, 에러 메시지 관리 Enum 클래스
 */
@Getter
public enum ErrorCode {

    TEST(HttpStatus.INTERNAL_SERVER_ERROR, "001", "business exception test"),
    /* -- Member -- */
    MEMBER_ALREADY_EXIST(HttpStatus.UNPROCESSABLE_ENTITY, "M-001", "이미 존재하는 회원입니다."),
    INVALID_MEMBER_NAME(HttpStatus.BAD_REQUEST, "M-002", "회원 이름은 비어 있을 수 없습니다."),
    INVALID_PHONE_NUMBER(HttpStatus.BAD_REQUEST, "M-003", "전화번호는 11자리 숫자여야 합니다."),
    INVALID_ADDRESS(HttpStatus.BAD_REQUEST, "M-004", "주소 정보는 비어 있을 수 없습니다."),
    NOT_EXIST_MEMBER(HttpStatus.NOT_FOUND, "M-005", "해당 회원은 존재하지 않습니다."),

    /* -- Item -- */
    ITEM_STOCK_NOT_ENOUGH(HttpStatus.UNPROCESSABLE_ENTITY, "I-001", "수량이 충분하지 않습니다."),
    ITEM_ALREADY_EXIST(HttpStatus.UNPROCESSABLE_ENTITY, "I-002", "이미 존재하는 상품입니다."),
    NOT_EXIST_ITEM(HttpStatus.NOT_FOUND, "I-003", "해당 상품은 존재하지 않습니다."),
    INVALID_ITEM_PRICE(HttpStatus.BAD_REQUEST, "I-004", "상품 가격은 0보다 커야 합니다."),
    INVALID_ITEM_QUANTITY(HttpStatus.BAD_REQUEST, "I-005", "상품 수량은 0보다 커야 합니다."),
    INVALID_ITEM_NAME(HttpStatus.BAD_REQUEST, "I-006" , "상품 이름은 비어 있을 수 없습니다." );

    private HttpStatus httpStatus;
    private String errorCode;
    private String message;

    ErrorCode(HttpStatus httpStatus, String errorCode, String message) {
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.message = message;
    }
}