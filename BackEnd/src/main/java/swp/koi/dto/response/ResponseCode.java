package swp.koi.dto.response;

public enum ResponseCode {
    SUCCESS(200, "Successfully."),
    NOT_FOUND(400, "Not found"),
    INVALID_INFORMATION(400, "Data is invalid"),
    CREATED_SUCCESS(400, "Created successfully"),
    SUCCESS_GET_LIST(200, "Data retrieved successfully."),
    SUCCESS_SIGN_UP(200, "Sign up successful."),

    // Authentication / Authorization
    SUCCESS_LOGIN(001, "Login successful."),
    INVALID_CREDENTIALS(002, "Invalid email or password."),
    EMAIL_ALREADY_EXISTS(003, "Email already exist."),

    // Account related statuses
    ACCOUNT_ID_NOT_FOUND(1000, "Account ID not found"),

    // Member
    MEMBER_NOT_FOUND(1001, "Member not found"),
    MEMBER_REGISTED(1002, "Member already registered"),

    // Breeder related statuses
    FAILED_CREATE_BREEDER(2000, "Fail to create breeder"),
    BREEDER_ID_NOT_FOUND(2001, "Breeder ID not found"),

    // KoiFish related statuses
    FISH_NOT_FOUND(3001, "Koi Fish not found"),

    // LotRegister related statuses
    LOT_REGISTER_SUCCESS(4001, "Lot registration successful"),

    // Bid related statuses
    BID_SUCCESS(5001, "Bid placed successfully"),
    BID_PRICE_TOO_LOW(5003, "Bid price is lower than the current price"),
    MEMBER_NOT_REGISTERED_FOR_LOT(5004, "Member is not registered for the Lot"),

    // AuctionRequest related statuses
    AUCTION_REQUEST_NOT_FOUND(7001, "Auction request not found"),

    // Auction type related statuses
    AUCTION_TYPE_NOT_FOUND(7001, "Auction type not found"),

    // Lot related statuses
    LOT_NOT_FOUND(8001, "Lot ID not found"),

    // Variety related statuses
    VARIETY_NOT_FOUND(9003, "Variety not found")
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
