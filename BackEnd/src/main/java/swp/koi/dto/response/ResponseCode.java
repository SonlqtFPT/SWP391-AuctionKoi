package swp.koi.dto.response;

public enum ResponseCode {
    SUCCESS_GET_LIST(200, "Data retrieved successfully."),
    SUCCESS_SIGN_UP(200, "Sign up successful."),
    EMAIL_TAKEN(400, "Email is already in use."),
    INVALID_INPUT(400, "Invalid input data."),
    ERROR_AUTHENTICATION(500, "An error occurred during sign up.");
    ;

    private int code;
    private String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode(){
        return code;
    }

    public String getMessage() {
        return message;
    }
}
