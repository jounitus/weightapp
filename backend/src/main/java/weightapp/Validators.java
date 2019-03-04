package weightapp;

import com.google.common.base.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import weightapp.models.Entry;
import weightapp.models.SessionTokenInfo;
import weightapp.models.UserProperties;

import java.util.HashMap;
import java.util.Map;

public class Validators {

    private static final Logger log = LoggerFactory.getLogger(Validators.class);

    public static void testValidUserId(Authenticator authenticator, String userId, String authentication) {

        if(Strings.isNullOrEmpty(userId)) {
            throw ResponseException.fromErrorCode(ErrorCode.INVALID_USER_ID);
        }

        SessionTokenInfo sessionTokenInfo;

        try {
            sessionTokenInfo = authenticator.decodeToken(authentication);
        } catch (Exception ex) {
            log.error("Authentication error for token '" + authentication + "' - " + ex.toString());
            throw ResponseException.fromErrorCode(ErrorCode.INVALID_SESSION_TOKEN, ex);
        }

        if(!sessionTokenInfo.user_id.contentEquals(userId)) {
            throw ResponseException.fromErrorCode(ErrorCode.USER_ID_AND_SESSION_TOKEN_NOT_MATCHING);
        }

    }

    public static void testValidUsernameAndPassword(String username, String password) {

        ErrorCode errorCode = null;
        Map<String, String> fields = new HashMap<>();

        //
        // test all fields at the same time, but show the most important error code (for the top most form field) first
        //

        if(Strings.isNullOrEmpty(password)) {
            errorCode = ErrorCode.INVALID_PASSWORD;
            fields.put("password", "Password must not be empty");
        }

        if(Strings.isNullOrEmpty(username)) {
            errorCode = ErrorCode.INVALID_USERNAME;
            fields.put("username", "Username must not be empty");
        }

        if(errorCode != null) {
            throw ResponseException.fromErrorCode(errorCode, fields);
        }

    }

    public static void testValidUserProperties(UserProperties userProperties) {

        ErrorCode errorCode = null;
        Map<String, String> fields = new HashMap<>();

        //
        // test all fields at the same time, but show the most important error code (for the top most form field) first
        //

        if(userProperties.height_cm == null || userProperties.height_cm <= 0) {
            errorCode = ErrorCode.INVALID_HEIGHT;
            fields.put("height_cm", "Height must be greater than zero");
        }

        if(userProperties.gender == null) {
            errorCode = ErrorCode.INVALID_GENDER;
            fields.put("gender", "Gender must not be empty");
        }

        if(userProperties.dob == null) {
            errorCode = ErrorCode.INVALID_DOB;
            fields.put("dob", "Invalid date of birth");
        }

        if(errorCode != null) {
            throw ResponseException.fromErrorCode(errorCode, fields);
        }

    }

    public static void testValidEntry(Entry entry) {

        ErrorCode errorCode = null;
        Map<String, String> fields = new HashMap<>();

        //
        // test all fields at the same time, but show the most important error code (for the top most form field) first
        //

        if(entry.weight_kg == null || entry.weight_kg <= 0) {
            errorCode = ErrorCode.INVALID_ENTRY_WEIGHT;
            fields.put("weight_kg", "Weight must be greater than zero");
        }

        if(entry.date == null) {
            errorCode = ErrorCode.INVALID_ENTRY_DATE;
            fields.put("date", "Invalid date for entry");
        }

        if(errorCode != null) {
            throw ResponseException.fromErrorCode(errorCode, fields);
        }

    }

}
