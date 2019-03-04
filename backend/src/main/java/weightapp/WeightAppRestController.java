package weightapp;

import com.google.common.hash.Hashing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import weightapp.models.SessionTokenInfo;
import weightapp.models.User;
import weightapp.models.UserProperties;
import weightapp.models.Entry;
import weightapp.models.rest.*;


import java.nio.charset.StandardCharsets;

@RestController
public class WeightAppRestController {

    private static final Logger log = LoggerFactory.getLogger(WeightAppRestController.class);

    private DBConnector dbConnector;
    private Authenticator authenticator;

    @Autowired
    WeightAppRestController(DBConnector dbConnector, Authenticator authenticator) {
        this.dbConnector = dbConnector;
        this.authenticator = authenticator;
    }

    private static String hashPassword(String password) {

        String sha256hex = Hashing.sha256()
                .hashString(password, StandardCharsets.UTF_8)
                .toString();

        return sha256hex;

    }

    @ExceptionHandler(ResponseException.class)
    public ResponseEntity<ErrorResponse> handleException(ResponseException responseException) {

        log.error(responseException.toString());

        return new ResponseEntity<>(responseException.getErrorResponse(), HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ErrorResponse> handleException(Throwable throwable) {

        log.error("Handing exception: " + throwable.toString());

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.description = throwable.getMessage();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);

    }

    @RequestMapping(value = "/user", method = RequestMethod.POST)
    public CreateUserResponse createUser(@RequestBody CreateUserRequest createUserRequest) {

        Validators.testValidUsernameAndPassword(createUserRequest.username, createUserRequest.password);

        User user = dbConnector.createUser(
                createUserRequest.username,
                hashPassword(createUserRequest.password)
        );

        CreateUserResponse response = new CreateUserResponse();

        response.user_id = user.user_id;

        return response;
    }

    @RequestMapping(value = "/user/{user_id}", method = RequestMethod.GET)
    public User getUser(@PathVariable("user_id") String userId,
                                   @RequestHeader("Authentication") String authentication) {

        log.info("/get-user called");

        Validators.testValidUserId(authenticator, userId, authentication);

        User user = dbConnector.getUser(userId);

        return user;
    }

    @RequestMapping(value = "/session-token", method = RequestMethod.POST)
    public CreateSessionTokenResponse createSessionToken(@RequestBody CreateSessionTokenRequest createSessionTokenRequest) {

        Validators.testValidUsernameAndPassword(createSessionTokenRequest.username, createSessionTokenRequest.password);

        String userId = dbConnector.findUserId(
                createSessionTokenRequest.username,
                hashPassword(createSessionTokenRequest.password)
        );

        SessionTokenInfo sessionTokenInfo = new SessionTokenInfo();
        sessionTokenInfo.user_id = userId;

        String token = authenticator.generateToken(sessionTokenInfo);

        //dbConnector.saveSessionTokenInfo(sessionTokenInfo);

        CreateSessionTokenResponse createSessionTokenResponse = new CreateSessionTokenResponse();
        createSessionTokenResponse.session_token = token;
        createSessionTokenResponse.user_id = userId;

        return createSessionTokenResponse;

    }

    @RequestMapping(value = "/user/{user_id}/properties", method = RequestMethod.PUT)
    @ResponseBody
    public EmptyResponse updateUserProperties(@PathVariable("user_id") String userId,
                                              @RequestHeader("Authentication") String authentication,
                                              @RequestBody UserProperties userProperties
                                             ) {

        log.info("/update-user-properties called");

        Validators.testValidUserId(authenticator, userId, authentication);
        Validators.testValidUserProperties(userProperties);

        dbConnector.updateUserProperties(userId, userProperties);

        return new EmptyResponse();

    }

    @RequestMapping(value = "/entry/{user_id}", method = RequestMethod.POST)
    @ResponseBody
    public EmptyResponse addWeightRecord(@PathVariable("user_id") String userId,
                                         @RequestHeader("Authentication") String authentication,
                                         @RequestBody Entry entry
    ) {

        Validators.testValidUserId(authenticator, userId, authentication);
        Validators.testValidEntry(entry);

        dbConnector.addEntry(userId, entry);

        return new EmptyResponse();

    }

    @RequestMapping(value = "/entry/{user_id}", method = RequestMethod.PUT)
    @ResponseBody
    public EmptyResponse updateWeightRecord(@PathVariable("user_id") String userId,
                                            @RequestHeader("Authentication") String authentication,
                                            @RequestBody Entry entry
    ) {

        Validators.testValidUserId(authenticator, userId, authentication);
        Validators.testValidEntry(entry);

        dbConnector.updateEntry(userId, entry);

        return new EmptyResponse();

    }

}
