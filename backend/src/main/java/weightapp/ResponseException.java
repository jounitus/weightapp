package weightapp;

import weightapp.models.rest.ErrorResponse;

import java.util.Map;

public class ResponseException extends RuntimeException {

    private final ErrorResponse errorResponse;

    public ResponseException(ErrorResponse errorResponse) {
        super(errorResponse.description);
        this.errorResponse = errorResponse;
    }

    public ResponseException(ErrorResponse errorResponse, Throwable originalException) {
        super(errorResponse.description, originalException);
        this.errorResponse = errorResponse;
    }

    public ErrorResponse getErrorResponse() {
        return errorResponse;
    }

    public int getErrorCode() { return errorResponse.code; }

    public static ResponseException fromErrorCode(ErrorCode errorCode) {

        return fromErrorCode(errorCode, null, null);

    }

    public static ResponseException fromErrorCode(ErrorCode errorCode, Map<String, String> fields) {

        return fromErrorCode(errorCode, fields, null);

    }

    public static ResponseException fromErrorCode(ErrorCode errorCode, Throwable originalException) {

        return fromErrorCode(errorCode, null, originalException);

    }

    public static ResponseException fromErrorCode(ErrorCode errorCode, Map<String, String> fields,
                                                  Throwable originalException) {

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.code = errorCode.getValue();
        errorResponse.description = errorCode.getDescription();
        errorResponse.message = (originalException != null) ? originalException.getMessage() : null;
        errorResponse.fields = fields;

        return new ResponseException(errorResponse, originalException);

    }

}
