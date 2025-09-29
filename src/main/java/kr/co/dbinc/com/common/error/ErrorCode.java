package kr.co.dbinc.com.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 반환할 Http Status, 에러 코드, 에러 메시지 관리 Enum 클래스
 */
@Getter
public enum ErrorCode {

    TEST(HttpStatus.INTERNAL_SERVER_ERROR, "001", "business exception test");

    private HttpStatus httpStatus;
    private String errorCode;
    private String message;

    ErrorCode(HttpStatus httpStatus, String errorCode, String message) {
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.message = message;
    }
}