
package weightapp;

public enum DBConnectorErrorEnum {


    DUPLICATE_KEY_WHEN_CREATING_USER(1000, "Duplicate key when trying to create user"),
    DUPLICATE_WEIGHT_RECORD_FOR_USER(1001, "Duplicate weight record for user"),

    USERNAME_DOES_NOT_EXIST(1002, "Username doesn't exist"),
    INCORRECT_PASSWORD(1003, "Incorrect password"),

    UNSPECIFIED_ERROR(2000, "Unspecified error occured");

    private final int value;
    private final String reasonPhrase;

    private DBConnectorErrorEnum(int value, String reasonPhrase) {
        this.value = value;
        this.reasonPhrase = reasonPhrase;
    }

    public int value() {
        return this.value;
    }

    public String getReasonPhrase() {
        return this.reasonPhrase;
    }

    public String toString() {
        return Integer.toString(this.value);
    }

    public static DBConnectorErrorEnum valueOf(int statusCode) {
        DBConnectorErrorEnum[] var1 = values();
        int var2 = var1.length;

        for(int var3 = 0; var3 < var2; ++var3) {
            DBConnectorErrorEnum status = var1[var3];
            if (status.value == statusCode) {
                return status;
            }
        }

        throw new IllegalArgumentException("No matching constant for [" + statusCode + "]");
    }

}
