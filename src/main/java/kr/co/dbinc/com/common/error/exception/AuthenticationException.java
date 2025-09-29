package kr.co.dbinc.com.common.error.exception;

import kr.co.dbinc.com.common.error.ErrorCode;

/**
 * 자체 생성한 BusinessException을 상속(errorCode 일관화)
 * 인증처리 관련 에러 클래스 분류 목적
 */
public class AuthenticationException extends BusinessException {

    public AuthenticationException(ErrorCode errorCode) {
        super(errorCode);
    }

}

