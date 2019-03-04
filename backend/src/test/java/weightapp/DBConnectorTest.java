package weightapp;

import org.hamcrest.Matchers;
import org.junit.rules.ExpectedException;
import weightapp.models.*;
import org.junit.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;

public class DBConnectorTest {


    private static final Logger log = LoggerFactory.getLogger(DBConnectorTest.class);

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private DBConnector dbConnector;


    @Before
    public void setUp() {

        log.info("Calling setUp");

        String dbName = "weightapp_dev_" + System.currentTimeMillis();

        log.info("database used for testing: " + dbName);

        dbConnector = new DBConnector(dbName);

    }

    @After
    public void tearDown() {
        log.info("Calling tearDown");
        dbConnector.dropDatabase();
    }


    @Test
    public void testDuplicateUsers() {

        User user = dbConnector.createUser("duplicateuser", "mypassword");

        thrown.expect(DBConnectorException.class);
        thrown.expect(Matchers.hasProperty("status",
                Matchers.is(DBConnectorErrorEnum.DUPLICATE_KEY_WHEN_CREATING_USER)));

        user = dbConnector.createUser("duplicateuser", "mypassword");

    }

    @Test
    public void testDuplicateUsersIgnoreCase() {

        User user = dbConnector.createUser("duplicateuser", "mypassword");

        thrown.expect(DBConnectorException.class);
        thrown.expect(Matchers.hasProperty("status",
                Matchers.is(DBConnectorErrorEnum.DUPLICATE_KEY_WHEN_CREATING_USER)));

        user = dbConnector.createUser("DUPLICATEUSER", "mypassword");

    }


    @Test
    public void testCreateUser() {

        User user = dbConnector.createUser("myusername", "mypassword");

        Assert.assertEquals("myusername", user.username);
        Assert.assertEquals("mypassword", user.password);
        Assert.assertNotNull(user.user_id);


    }

    @Test
    public void testUpdateUserProperties() {

        User user = dbConnector.createUser("myusername", "mypassword");

        UserProperties userProperties = new UserProperties();

        userProperties.dob = LocalDate.of(1983, 12, 22);
        userProperties.gender = Gender.MALE;
        userProperties.height_cm = 180.0;

        dbConnector.updateUserProperties(user.user_id, userProperties);

        user = dbConnector.getUser(user.user_id);

        Assert.assertEquals(LocalDate.parse("1983-12-22"), user.dob);
        Assert.assertEquals(Gender.MALE, user.gender);
        Assert.assertEquals(180.0, user.height_cm, 0.01);

        //
        // we should be able to make the same exact update twice in a row
        //

        dbConnector.updateUserProperties(user.user_id, userProperties);

    }

    @Test
    public void testCreateMultipleUsers() {

        User user = dbConnector.createUser("myusername", "mypassword");
        User user2 = dbConnector.createUser("myusername2", "mypassword");

        Assert.assertNotEquals(user.username, user2.username);

    }


    @Test
    public void testFindUserId() {


        User user = dbConnector.createUser("myusername", "mypassword");

        String userId = dbConnector.findUserId(user.username, user.password);

        Assert.assertEquals(user.user_id, userId);

    }

    @Test
    public void testFindUserIdBadUsername() {


        //User user = dbConnector.createUser("myusernamedoesn't exist", "mypassword");

        thrown.expect(DBConnectorException.class);
        thrown.expect(Matchers.hasProperty("status",
                Matchers.is(DBConnectorErrorEnum.USERNAME_DOES_NOT_EXIST)));

        String userId = dbConnector.findUserId("doesntexist", "mypassword");

    }

    @Test
    public void testFindUserIdBadPassword() {


        User user = dbConnector.createUser("username", "mypassword");

        thrown.expect(DBConnectorException.class);
        thrown.expect(Matchers.hasProperty("status",
                Matchers.is(DBConnectorErrorEnum.INCORRECT_PASSWORD)));

        String userId = dbConnector.findUserId("username", "badpassword");

    }

    @Test
    public void testAddAndUpdateEntries() {

        User user = dbConnector.createUser("myusername", "mypassword");

        //
        // try adding entries
        //

        Entry entry = new Entry();
        entry.date = LocalDate.of(2018,10,21);
        entry.weight_kg = 123.2;
        entry.comment = "This is the first entry";

        dbConnector.addEntry(user.user_id, entry);

        entry = new Entry();
        entry.date = LocalDate.of(2018,10,28);
        entry.weight_kg = 120.1;

        dbConnector.addEntry(user.user_id, entry);

        user = dbConnector.getUser(user.user_id);

        entry = user.findEntry(LocalDate.parse("2018-10-21"))
                .orElseThrow(() -> new RuntimeException("Couldn't find entry"));

        Assert.assertNotNull(entry.entry_id);
        Assert.assertEquals(LocalDate.parse("2018-10-21"), entry.date);
        Assert.assertEquals(123.2, entry.weight_kg, 0.01);
        Assert.assertEquals("This is the first entry", entry.comment);

        entry = user.findEntry(LocalDate.parse("2018-10-28"))
                .orElseThrow(() -> new RuntimeException("Couldn't find entry"));

        Assert.assertNotNull(entry.entry_id);
        Assert.assertEquals(LocalDate.parse("2018-10-28"), entry.date);
        Assert.assertEquals(120.1, entry.weight_kg, 0.01);
        Assert.assertNull(entry.comment);

        String savedEntryId = entry.entry_id;

        //
        // try updating entries
        //

        entry = new Entry();
        entry.entry_id = savedEntryId;
        entry.date = LocalDate.of(2018,10,27);
        entry.weight_kg = 110.1;
        entry.comment = "This is the updated comment";

        dbConnector.updateEntry(user.user_id, entry);

        user = dbConnector.getUser(user.user_id);

        entry = user.findEntry(LocalDate.parse("2018-10-27"))
                .orElseThrow(() -> new RuntimeException("Couldn't find entry"));

        Assert.assertNotNull(savedEntryId);
        Assert.assertEquals(LocalDate.parse("2018-10-27"), entry.date);
        Assert.assertEquals(110.1, entry.weight_kg, 0.01);
        Assert.assertEquals("This is the updated comment", entry.comment);

        //
        // we should be able to make the same exact update twice in a row
        //

        dbConnector.updateEntry(user.user_id, entry);

        //
        // check that we have expected number of entries
        //

        Assert.assertEquals(2, user.entry_list.size());

    }

}
