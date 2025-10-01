package kr.co.dbinc.com.common.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.dbinc.com.common.error.exception.AuthenticationException;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;


/**
 * @RestController에서 발생하는 전역적으로 발생하는 예외를 GlobalExceptionHandler에서 처리
 */
@Slf4j
@RestControllerAdvice(annotations = RestController.class)
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalRestExceptionHandler {
    // Client 반환용 에러 메시지
    private static final String MSG_BAD_REQUEST = "요청 형식이 올바르지 않습니다.";
    private static final String MSG_METHOD_NOT_ALLOWED = "지원하지 않는 요청입니다.";
    private static final String MSG_UNAUTHORIZED = "인증이 필요합니다.";
    private static final String MSG_INTERNAL_ERROR = "서버 에러가 발생하였습니다. 관리자에게 문의하여 주십시오.";
    private static final String MSG_DB_ERROR = "데이터 처리 중 오류가 발생했습니다.";

    /**
     * javax.validation.Valid 또는 @Validated binding error가 발생할 경우
     * 컨트롤러에서 입력값을 DTO로 받을 경우, 입력값을 검증 받을 텐데 검증을 통과하지 못하면 bindException 발생
     * 이를 전역적으로 처리하고 클라이언트에게 에러 메시지를 담고 있는 에러 리스폰스를 반환할 것임
     */
    @ExceptionHandler(BindException.class)
    protected ResponseEntity<ErrorResponse> handleBindException(BindException e, HttpServletRequest req) {
        return buildErrorResponse(req, e, HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.toString(), MSG_BAD_REQUEST);
    }

    /**
     * 주로 @RequestParam enum으로 binding 못했을 경우 발생
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest req) {
        return buildErrorResponse(req, e, HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.toString(), MSG_BAD_REQUEST);
    }

    /**
     * 지원하지 않은 HTTP method 호출 할 경우 발생
     * 컨트롤러에 매핑되지 않은 경우
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e, HttpServletRequest req) {
        return buildErrorResponse(req, e, HttpStatus.METHOD_NOT_ALLOWED, HttpStatus.METHOD_NOT_ALLOWED.toString(), MSG_METHOD_NOT_ALLOWED);
    }

    /**
     * DB 관련 에러 발생
     */
    @ExceptionHandler({
            org.mybatis.spring.MyBatisSystemException.class,          // MyBatis-Spring
            org.apache.ibatis.exceptions.PersistenceException.class,  // MyBatis
            org.springframework.dao.DataAccessException.class,        // Spring DAO 추상화
            java.sql.SQLException.class,                              // JDBC
            org.springframework.transaction.TransactionSystemException.class,
            org.springframework.transaction.CannotCreateTransactionException.class
    })
    protected ResponseEntity<ErrorResponse> handleDataAccess(Exception e, HttpServletRequest req, HttpServletResponse resp) {
        return buildErrorResponse(req, e, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.toString(), MSG_DB_ERROR);
    }

    /**
     * 인증 관련 예외 (사용자 정의)
     */
    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e, HttpServletRequest req) {
//        return buildErrorResponse(req, e, HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED.toString(), MSG_UNAUTHORIZED);
        return buildErrorResponse(req, e, e.getErrorCode().getHttpStatus(), e.getErrorCode().getErrorCode(), MSG_UNAUTHORIZED);
    }

    /**
     * 비즈니스 로직 실행 중 오류 발생
     */
    @ExceptionHandler(value = {BusinessException.class})
    protected ResponseEntity<ErrorResponse> handleConflict(BusinessException e, HttpServletRequest req) {
        return buildErrorResponse(req, e, e.getErrorCode().getHttpStatus(), e.getErrorCode().getErrorCode(), e.getErrorCode().getMessage());
    }

    /**
     * 나머지 예외 발생
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest req) {
        return buildErrorResponse(req, e, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.toString(), MSG_INTERNAL_ERROR);
    }

    /**
     * 공통 처리 메서드
     * 에러 로그 출력 및 Error Response 생성
     */
    private ResponseEntity<ErrorResponse> buildErrorResponse(HttpServletRequest req,
                                                             Exception e,
                                                             HttpStatus status,
                                                             String errorCode,
                                                             String message) {
        printExceptionLog(errorCode, req, e);
        ErrorResponse errorResponse = ErrorResponse.of(errorCode, message);
        return ResponseEntity.status(status).body(errorResponse);
    }


    /**
     * Exception 발생 시 로그를 출력
     * 에러 메시지와 요청 URI, 메소드 등을 로깅
     */
    private void printExceptionLog(String error, HttpServletRequest req, Exception e) {
        log.error("############### " + error + " : " + req.getRequestURI() + " ###############");
        log.error("############### " + error + " : " + req.getMethod() + " --- " + e.getMessage() + " ###############", e);
    }
}