package swp.koi.dto.response;

public enum ResponseCode {
    SUCCESS(200, "Successfully."),
    UNAUTHORIZED(403, "UNAUTHORIZED"),
    NOT_FOUND(400, "Not found"),
    INVALID_INFORMATION(400, "Data is invalid"),
    CREATED_SUCCESS(010, "Created successfully"),
    SUCCESS_GET_LIST(200, "Data retrieved successfully."),
    SUCCESS_SIGN_UP(200, "Sign up successful."),
    FAIL(000, "Fail"),

    // Authentication / Authorization
    SUCCESS_LOGIN(001, "Login successful."),
    INVALID_CREDENTIALS(002, "Invalid email or password."),
    EMAIL_ALREADY_EXISTS(003, "Email already exist."),
    JWT_INVALID(004, "JWT is invalid."),
    LOGOUT_JWT(005, "Logout successful."),
    EMAIL_NOT_FOUND(006, "Email not found"),
    INVALID_TOKEN(007, "Invalid token"),

    // Account related statuses
    ACCOUNT_ID_NOT_FOUND(1000, "Account ID not found"),

    // Member
    MEMBER_NOT_FOUND(1001, "Member not found"),
    MEMBER_REGISTED(1002, "Member already registered"),

    // Breeder related statuses
    FAILED_CREATE_BREEDER(2000, "Fail to create breeder"),
    BREEDER_ID_NOT_FOUND(2001, "Breeder ID not found"),
    BREEDER_NOT_FOUND(2002, "Breeder not found"),

    // KoiFish related statuses
    FISH_NOT_FOUND(3001, "Koi Fish not found"),

    // LotRegister related statuses
    LOT_REGISTER_SUCCESS(4001, "Lot registration successful"),
    MEMBER_ALREADY_REGISTERED(4002, "Member already REGISTERED."),

    // Bid related statuses
    BID_SUCCESS(5001, "Bid placed successfully"),
    BID_PRICE_TOO_LOW(5003, "Bid price is lower or different from requested price"),
    MEMBER_NOT_REGISTERED_FOR_LOT(5004, "Member is not registered for the Lot"),
    BID_TIME_PASSED(5005, "Bid time passed"),
    BID_LIST_EMPTY(5006, "Bid list is empty"),
    BID_SEALED_ALREADY(5007, "User already bidded to this sealed lot"),

    //Auction
    AUCTION_NOT_FOUND(6000, "Auction not found"),

    // AuctionRequest
    AUCTION_REQUEST_NOT_FOUND(7001, "Auction request not found"),
    AUCTION_STATUS_CHANGE(7002, "Auction request status changed"),
    STAFF_ASSIGN_SUCCESSFULLY(7003, "Staff assigned successfully"),
    ALREADY_HAVE_STAFF(7004, "This request already have staff"),
    MUST_BE_STAFF(7005, "Only staff can be assign"),
    CANCEL_REQUEST_SUCCESS(7006, "Canceled successfully"),
    UPDATE_REQUEST_SUCCESS(7007, "Updated successfully"),
    AUCTION_REQUEST_VALID_STATUS(7008, "Auction request status / Koi fish status have something wrong. Check again!"),
    WRONG_BREEDER_REQUEST(7009, "This breeder does not have this request"),

    // Auction type related statuses
    AUCTION_TYPE_NOT_FOUND(7500, "Auction type not found"),

    // Lot related statuses
    LOT_NOT_FOUND(8001, "Lot ID not found"),

    // Variety related statuses
    VARIETY_NOT_FOUND(9003, "Variety not found"),

    // Media
    MEDIA_NOT_FOUND(9500, "Media not found"),

    //transaction
    TRANSACTION_EXISTED(6969, "Fuck"),
    TRANSACTION_NOT_FOUND(9700, "Transaction not found"),
    ;



    private final int code;
    private final String message;

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
