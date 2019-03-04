package weightapp;

import static org.junit.Assert.*;

import java.net.URL;
import java.time.LocalDate;

import org.hamcrest.Matchers;
import org.junit.*;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;
import weightapp.models.Gender;
import weightapp.models.User;
import weightapp.models.UserProperties;
import weightapp.models.Entry;
import weightapp.models.rest.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WeightAppRestControllerIT {


    private static final Logger log = LoggerFactory.getLogger(WeightAppRestControllerIT.class);

    @LocalServerPort
    private int port;

    private URL base;

    @Autowired
    private TestRestTemplate template;

    @Autowired
    private DBConnector dbConnector;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    public <T> ResponseEntity<T> makeRequest(HttpMethod httpMethod, String url, Class<T> responseType,
                                             String sessionToken) {

        return makeRequest(httpMethod, url, null, responseType, sessionToken);

    }

    public void makeRequest(HttpMethod httpMethod, String url, Object request, String sessionToken) {
        makeRequest(httpMethod, url, request, EmptyResponse.class, sessionToken);

    }

    public <T> ResponseEntity<T> makeRequest(HttpMethod httpMethod, String url, Object request, Class<T> responseType,
                                             String sessionToken) {

        RestTemplateBuilder builder = new RestTemplateBuilder().errorHandler(new RestTemplateResponseErrorHandler());

        RestTemplate template = builder.build();

        HttpHeaders headers = new HttpHeaders();

        headers.add("Authentication", sessionToken);

        ResponseEntity<T> response  = template.exchange(base.toString() + url, httpMethod,
                new HttpEntity<>(request, headers), responseType);

        assertEquals(200, response.getStatusCodeValue());

        return response;

    }

    @Before
    public void setUp() throws Exception {
        log.info("calling setUp");
        this.base = new URL("http://localhost:" + port + "/api/");
    }

    @After
    public void tearDown() {
        log.info("calling tearDown");
        dbConnector.dropDatabase();
    }

    @Test
    public void testUpdateUserProperties() throws Exception {

        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.username = "myusername";
        createUserRequest.password = "password";

        ResponseEntity<CreateUserResponse> response = makeRequest(HttpMethod.POST, "user",
                createUserRequest, CreateUserResponse.class, null);

        String userId = response.getBody().user_id;

        //
        // test creating the session token
        //

        CreateSessionTokenRequest createSessionTokenRequest = new CreateSessionTokenRequest();
        createSessionTokenRequest.username = "myusername";
        createSessionTokenRequest.password = "password";

        ResponseEntity<CreateSessionTokenResponse> createSessionTokenResponse
                = makeRequest(HttpMethod.POST, "session-token", createSessionTokenRequest,
                CreateSessionTokenResponse.class, null);

        String sessionToken = createSessionTokenResponse.getBody().session_token;

        assertNotNull(sessionToken);
        assertEquals(userId, createSessionTokenResponse.getBody().user_id);

        //
        // try updating the user properties
        //

        UserProperties userProperties = new UserProperties();
        userProperties.dob = LocalDate.of(1980, 10, 20);
        userProperties.gender = Gender.MALE;
        userProperties.height_cm = 180.0;

        makeRequest(HttpMethod.PUT, "user/" + userId + "/properties", userProperties, sessionToken);

        //
        // try getting the user data
        //

        ResponseEntity<User> getUserResponse = makeRequest(HttpMethod.GET, "user/" + userId,
                User.class, sessionToken);

        assertEquals(180.0, getUserResponse.getBody().height_cm, 0.01);
        assertEquals(Gender.MALE, getUserResponse.getBody().gender);
        assertEquals(LocalDate.of(1980, 10, 20), getUserResponse.getBody().dob);

    }

    @Test
    public void testAddAndUpdateEntries() throws Exception {

        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.username = "myusername";
        createUserRequest.password = "password";

        ResponseEntity<CreateUserResponse> response = makeRequest(HttpMethod.POST, "user",
                createUserRequest, CreateUserResponse.class, null);

        String userId = response.getBody().user_id;

        //
        // test creating the session token
        //

        CreateSessionTokenRequest createSessionTokenRequest = new CreateSessionTokenRequest();
        createSessionTokenRequest.username = "myusername";
        createSessionTokenRequest.password = "password";

        ResponseEntity<CreateSessionTokenResponse> createSessionTokenResponse
                = makeRequest(HttpMethod.POST, "session-token", createSessionTokenRequest,
                CreateSessionTokenResponse.class, null);

        String sessionToken = createSessionTokenResponse.getBody().session_token;

        assertNotNull(sessionToken);
        assertEquals(userId, createSessionTokenResponse.getBody().user_id);

        //
        // try updating weight records
        //

        Entry entry;

        entry = new Entry();
        entry.date = LocalDate.parse("2018-10-01");
        entry.weight_kg = 100.1;
        entry.comment = "This is the first entry";

        makeRequest(HttpMethod.POST, "entry/" + userId, entry, sessionToken);

        entry = new Entry();
        entry.date = LocalDate.parse("2018-10-03");
        entry.weight_kg = 99.1;

        makeRequest(HttpMethod.POST, "entry/" + userId, entry, sessionToken);

        //
        // try getting the user data
        //

        ResponseEntity<User> getUserResponse = makeRequest(HttpMethod.GET, "user/" + userId,
                User.class, sessionToken);

        User user = getUserResponse.getBody();

        entry = user.findEntry(LocalDate.parse("2018-10-01"))
                .orElseThrow(() -> new RuntimeException("Couldn't find entry"));

        Assert.assertNotNull(entry.entry_id);
        Assert.assertEquals(LocalDate.parse("2018-10-01"), entry.date);
        Assert.assertEquals(100.1, entry.weight_kg, 0.01);
        Assert.assertEquals("This is the first entry", entry.comment);

        entry = user.findEntry(LocalDate.parse("2018-10-03"))
                .orElseThrow(() -> new RuntimeException("Couldn't find entry"));

        Assert.assertNotNull(entry.entry_id);
        Assert.assertEquals(LocalDate.parse("2018-10-03"), entry.date);
        Assert.assertEquals(99.1, entry.weight_kg, 0.01);
        Assert.assertNull(entry.comment);

        String savedEntryId = entry.entry_id;

        //
        // try updating entries
        //

        entry = new Entry();
        entry.entry_id = savedEntryId;
        entry.date = LocalDate.parse("2018-10-05");
        entry.weight_kg = 90.1;
        entry.comment = "New comment for entry";

        makeRequest(HttpMethod.PUT, "entry/" + userId, entry, sessionToken);

        getUserResponse = makeRequest(HttpMethod.GET, "user/" + userId,
                User.class, sessionToken);

        user = getUserResponse.getBody();

        entry = user.findEntry(LocalDate.parse("2018-10-05"))
                .orElseThrow(() -> new RuntimeException("Couldn't find entry"));

        Assert.assertEquals(savedEntryId, entry.entry_id);
        Assert.assertEquals(LocalDate.parse("2018-10-05"), entry.date);
        Assert.assertEquals(90.1, entry.weight_kg, 0.01);
        Assert.assertEquals("New comment for entry", entry.comment);

        Assert.assertEquals(2, user.entry_list.size());

    }

    @Test
    public void testEmptySessionToken() {

        thrown.expect(ResponseException.class);
        thrown.expect(Matchers.hasProperty("errorCode",
                Matchers.is(ErrorCode.INVALID_SESSION_TOKEN.getValue())));

        UserProperties userProperties = new UserProperties();

        makeRequest(HttpMethod.PUT, "user/test/properties", userProperties, null);

    }

}
