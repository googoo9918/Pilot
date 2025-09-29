package kr.co.dbinc.com.common.error.exception;

import kr.co.dbinc.com.common.error.ErrorCode;

/**
 * 자체 생성한 BusinessException을 상속(errorCode 일관화)
 * 엔티티 발생 에러 클래스 분류 목적
 */
public class EntityNotFoundException extends BusinessException {

    public EntityNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
}