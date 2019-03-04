package weightapp.models.rest;

import java.util.HashMap;
import java.util.Map;

public class ErrorResponse {
    public int code;
    public String description;
    public String message;
    public Map<String, String> fields = new HashMap<>();
}
