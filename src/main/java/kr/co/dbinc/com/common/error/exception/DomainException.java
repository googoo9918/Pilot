package kr.co.dbinc.com.common.error.exception;

import kr.co.dbinc.com.common.error.ErrorCode;

public class DomainException extends BusinessException {
    public DomainException(ErrorCode errorCode) {
        super(errorCode);
    }

}
