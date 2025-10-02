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

    /* -- Item -- */
    ITEM_STOCK_NOT_ENOUGH(HttpStatus.UNPROCESSABLE_ENTITY, "I-001" , "수량이 충분하지 않습니다."),
    ITEM_ALREADY_EXIST(HttpStatus.UNPROCESSABLE_ENTITY, "I-002", "이미 존재하는 상품입니다."),
    NOT_EXIST_ITEM(HttpStatus.NOT_FOUND, "I-003" , "해당 상품은 존재하지 않습니다." );

    private HttpStatus httpStatus;
    private String errorCode;
    private String message;

    ErrorCode(HttpStatus httpStatus, String errorCode, String message) {
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.message = message;
    }
}