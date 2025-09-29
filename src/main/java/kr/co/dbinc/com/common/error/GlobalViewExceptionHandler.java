package kr.co.dbinc.com.common.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.dbinc.com.common.error.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.validation.BindException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Controller에서 발생하는 전역 예외를 GlobalViewExceptionHandler에서 처리
 */
@Slf4j
@ControllerAdvice(annotations = Controller.class)
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalViewExceptionHandler {

    // 기본 에러 뷰
    private static final String DEFAULT_ERROR_VIEW = "error/error";

    /**
     * javax.validation.Valid 또는 @Validated binding error가 발생할 경우
     * 컨트롤러에서 입력값을 DTO로 받을 경우, 입력값을 검증 받을 텐데 검증을 통과하지 못하면 bindException 발생
     * 이를 전역적으로 처리하고 클라이언트에게 에러 메시지를 담고 있는 에러 리스폰스를 반환할 것임
     */
    @ExceptionHandler(BindException.class)
    protected ModelAndView handleBind(BindException e,
                                      HttpServletRequest req,
                                      HttpServletResponse resp) {
        return logAndReturn(req, resp, HttpStatus.BAD_REQUEST, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 주로 @RequestParam enum으로 binding 못했을 경우 발생
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ModelAndView handleTypeMismatch(MethodArgumentTypeMismatchException e,
                                              HttpServletRequest req,
                                              HttpServletResponse resp) {
        return logAndReturn(req, resp, HttpStatus.BAD_REQUEST, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 지원하지 않은 HTTP method 호출 할 경우 발생
     * 컨트롤러에 매핑되지 않은 경우
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ModelAndView handleMethodNotSupported(HttpRequestMethodNotSupportedException e,
                                                    HttpServletRequest req,
                                                    HttpServletResponse resp) {
        return logAndReturn(req, resp, HttpStatus.METHOD_NOT_ALLOWED, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * DB 관련 예외 발생
     */
    @ExceptionHandler({
            org.mybatis.spring.MyBatisSystemException.class,          // MyBatis-Spring
            org.apache.ibatis.exceptions.PersistenceException.class,  // MyBatis
            org.springframework.dao.DataAccessException.class,        // Spring DAO 추상화
            java.sql.SQLException.class,                              // JDBC
            org.springframework.transaction.TransactionSystemException.class,
            org.springframework.transaction.CannotCreateTransactionException.class
    })
    protected ModelAndView handleDataAccess(Exception e,
                                            HttpServletRequest req,
                                            HttpServletResponse resp) {
        return logAndReturn(req, resp, HttpStatus.INTERNAL_SERVER_ERROR, e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 비즈니스 로직 실행 중 오류 발생
     */
    @ExceptionHandler(value = {BusinessException.class})
    protected ModelAndView handleBusiness(kr.co.dbinc.com.common.error.exception.BusinessException e,
                                          HttpServletRequest req,
                                          HttpServletResponse resp) {
        return logAndReturn(req, resp, e.getErrorCode().getHttpStatus(), e, DEFAULT_ERROR_VIEW);
    }

    /**
     * 나머지 예외 발생
     */
    @ExceptionHandler(Exception.class)
    protected ModelAndView handleEtc(Exception e,
                                     HttpServletRequest req,
                                     HttpServletResponse resp) {
        return logAndReturn(req, resp, HttpStatus.INTERNAL_SERVER_ERROR, e, DEFAULT_ERROR_VIEW);
    }


    /**
     * 공통 처리 메서드
     * 에러 로그 출력 및 에러 View 출력
     */
    private ModelAndView logAndReturn(HttpServletRequest req,
                                      HttpServletResponse resp,
                                      HttpStatus status,
                                      Exception e,
                                      String viewName) {
        String code = status.toString();
        printExceptionLog(code, req, e);

        resp.setStatus(status.value());
        return new ModelAndView(viewName);
    }

    /**
     * Exception 발생 시 로그 출력
     * - 코드, 요청 URI, 메서드, 예외 메시지 기록
     */
    private void printExceptionLog(String error, HttpServletRequest req, Exception e) {
        log.error("############### " + error + " : " + req.getRequestURI() + " ###############");
        log.error("############### " + error + " : " + req.getMethod() + " --- " + e.getMessage() + " ###############", e);
    }
}
