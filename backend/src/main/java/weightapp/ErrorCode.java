
package weightapp;

public enum ErrorCode {


    // authentication / session token related

    INVALID_USER_ID(100, "Invalid/Empty user id"),
    INVALID_SESSION_TOKEN(101, "Invalid/Empty session token"),
    USER_ID_AND_SESSION_TOKEN_NOT_MATCHING(102, "User id does not match with session token"),

    // login / username / password related
    INVALID_USERNAME(200, "Username is empty or contains bad characters"),
    INVALID_PASSWORD(201, "Password is empty or contains bad characters"),

    // user properties related
    INVALID_DOB(300, "Invalid/empty date of birth"),
    INVALID_GENDER(301, "Gender must be either MALE or FEMALE"),
    INVALID_HEIGHT(302, "Height must be greater than zero"),

    // entry related
    INVALID_ENTRY_DATE(400, "Invalid/empty date for entry"),
    INVALID_ENTRY_WEIGHT(401, "Weight must be greater than zero"),

    ;

    private final int value;
    private final String description;

    ErrorCode(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return this.value;
    }

    public String getDescription() {
        return this.description;
    }

}
