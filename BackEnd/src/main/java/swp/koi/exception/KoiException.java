package swp.koi.exception;

import swp.koi.dto.response.ResponseCode;

public class KoiException extends RuntimeException {
    private ResponseCode responseCode;

    public KoiException(ResponseCode responseCode) {
        super(responseCode.getMessage());
        this.responseCode = responseCode;
    }

    public ResponseCode getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(ResponseCode responseCode) {
        this.responseCode = responseCode;
    }
}