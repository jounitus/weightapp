package weightapp;

public class DBConnectorException extends RuntimeException {

    private final DBConnectorErrorEnum status;

    public DBConnectorException(DBConnectorErrorEnum status) {
        super(status.getReasonPhrase());
        this.status = status;
    }

    public DBConnectorException(DBConnectorErrorEnum status, Throwable originalException) {
        super(status.getReasonPhrase(), originalException);
        this.status = status;
    }

    public DBConnectorErrorEnum getStatus() {
        return status;
    }

}
