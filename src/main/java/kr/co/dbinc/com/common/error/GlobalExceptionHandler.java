package kr.co.dbinc.com.common.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.dbinc.com.common.error.exception.AuthenticationException;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    // Client 반환용 에러 메시지
    private static final String MSG_BAD_REQUEST = "요청 형식이 올바르지 않습니다.";
    private static final String MSG_METHOD_NOT_ALLOWED = "지원하지 않는 요청입니다.";
    private static final String MSG_UNAUTHORIZED = "인증이 필요합니다.";
    private static final String MSG_INTERNAL_ERROR = "서버 에러가 발생하였습니다. 관리자에게 문의하여 주십시오.";
    private static final String MSG_DB_ERROR = "데이터 처리 중 오류가 발생했습니다.";

    // 기본 에러 뷰
    private static final String DEFAULT_ERROR_VIEW = "error/error";

    /**
     * javax.validation.Valid 또는 @Validated binding error가 발생할 경우
     * 컨트롤러에서 입력값을 DTO로 받을 경우, 입력값을 검증 받을 텐데 검증을 통과하지 못하면 bindException 발생
     * 이를 전역적으로 처리하고 클라이언트에게 에러 메시지를 담고 있는 에러 리스폰스를 반환할 것임
     */
    @ExceptionHandler(BindException.class)
    public Object handleBind(BindException e, HttpServletRequest req, HttpServletResponse resp) {
        return dispatch(req, resp, HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.toString(), MSG_BAD_REQUEST, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 주로 @RequestParam enum으로 binding 못했을 경우 발생
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public Object handleTypeMismatch(MethodArgumentTypeMismatchException e, HttpServletRequest req, HttpServletResponse resp) {
        return dispatch(req, resp, HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.toString(), MSG_BAD_REQUEST, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 지원하지 않은 HTTP method 호출 할 경우 발생
     * 컨트롤러에 매핑되지 않은 경우
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Object handleMethodNotSupported(HttpRequestMethodNotSupportedException e, HttpServletRequest req, HttpServletResponse resp) {
        return dispatch(req, resp, HttpStatus.METHOD_NOT_ALLOWED, HttpStatus.METHOD_NOT_ALLOWED.toString(), MSG_METHOD_NOT_ALLOWED, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 인증 관련 예외 (사용자 정의)
     */
    @ExceptionHandler(AuthenticationException.class)
    public Object handleAuthentication(AuthenticationException e, HttpServletRequest req, HttpServletResponse resp) {
        return dispatch(req, resp, e.getErrorCode().getHttpStatus(), e.getErrorCode().getErrorCode(), MSG_UNAUTHORIZED, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 비즈니스 로직 실행 중 오류 발생
     */
    @ExceptionHandler(BusinessException.class)
    public Object handleBusiness(BusinessException e, HttpServletRequest req, HttpServletResponse resp) {
        return dispatch(req, resp, e.getErrorCode().getHttpStatus(), e.getErrorCode().getErrorCode(), MSG_INTERNAL_ERROR, e, DEFAULT_ERROR_VIEW);
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
    public Object handleDataAccess(Exception e, HttpServletRequest req, HttpServletResponse resp) {
        return dispatch(req, resp, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.toString(), MSG_DB_ERROR, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 나머지 예외 발생
     */
    @ExceptionHandler(Exception.class)
    public Object handleEtc(Exception e, HttpServletRequest req, HttpServletResponse resp) {
        return dispatch(req, resp, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.toString(), MSG_INTERNAL_ERROR, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 요청에 따라 JSON(ResponseEntity) 또는 View(ModelAndView)로 분기
     */
    private Object dispatch(HttpServletRequest req,
                            HttpServletResponse resp,
                            HttpStatus httpStatus,
                            String errorCode,
                            String clientMessage,
                            Exception e,
                            String viewName) {

        printExceptionLog(errorCode, req, e);

        if (isApiRequest(req)) {
            ErrorResponse body = ErrorResponse.of(errorCode, clientMessage);
            return ResponseEntity.status(httpStatus).contentType(MediaType.APPLICATION_JSON).body(body);
        } else {
            resp.setStatus(httpStatus.value());
            return new ModelAndView(viewName);
        }
    }

    /**
     * API 요청 판별 로직
     * - Accept 헤더 JSON
     * - Content-Type JSON
     * - Ajax 헤더(X-Requested-With)
     * - URL Prefix(`/api`)
     */
    private boolean isApiRequest(HttpServletRequest req) {
        String accept = req.getHeader("Accept");
        String contentType = req.getContentType();
        String xrw = req.getHeader("X-Requested-With");
        String uri = req.getRequestURI();

        boolean acceptJson = accept != null && accept.toLowerCase().contains(MediaType.APPLICATION_JSON_VALUE);
        boolean contentJson = contentType != null && contentType.toLowerCase().contains(MediaType.APPLICATION_JSON_VALUE);
        boolean ajax = "XMLHttpRequest".equalsIgnoreCase(xrw);
        boolean apiPrefix = uri != null && uri.startsWith("/api");

        return acceptJson || contentJson || ajax || apiPrefix;
    }

    /**
     * 공통 로그 출력
     */
    private void printExceptionLog(String error, HttpServletRequest req, Exception e) {
        log.error("############### {} : {} ###############", error, req.getRequestURI());
        log.error("############### {} : {} --- {} ###############", error, req.getMethod(), e.getMessage(), e);
    }
}
