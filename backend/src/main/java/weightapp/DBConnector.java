package weightapp;

import com.mongodb.ErrorCategory;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoWriteException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.*;
import com.mongodb.client.result.UpdateResult;
import org.springframework.beans.factory.annotation.Value;
import weightapp.models.User;
import weightapp.models.UserProperties;
import weightapp.models.Entry;
import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

@Component
public class DBConnector {

    private static final Logger log = LoggerFactory.getLogger(DBConnector.class);

    private MongoClient mongoClient;
    private MongoDatabase mongoDatabase;
    private MongoCollection<User> userCollection;

    @Autowired
    DBConnector(@Value("${dbname:weightapp}") String dbName) {

        log.info(String.format("Using %s as dbname", dbName));

        CodecRegistry pojoCodecRegistry = fromRegistries(MongoClientSettings.getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build()));

        mongoClient = MongoClients.create();
        mongoDatabase = mongoClient.getDatabase(dbName).withCodecRegistry(pojoCodecRegistry);
        userCollection = mongoDatabase.getCollection("user", User.class);

        createIndexes();

    }

    private void createIndexes() {

        log.info("Creating indexes");

        Collation collation = Collation.builder()
                .caseLevel(false)
                .locale("en")
                .collationStrength(CollationStrength.SECONDARY)
                .build();

        userCollection.createIndex(new Document("username", 1), new IndexOptions().unique(true).collation(collation));

    }

    public void dropDatabase() {
        log.info("Dropping the database");
        mongoDatabase.drop();
    }

    public User createUser(String username, String password) {

        ObjectId id = new ObjectId();

        User user = new User();
        user.user_id = id.toHexString();
        user.username = username;
        user.password = password;

        try {
            userCollection.insertOne(user);
        } catch(MongoWriteException ex) {

            log.error("Exception when creating new user: " + username, ex);

            if(ex.getError().getCategory().equals(ErrorCategory.DUPLICATE_KEY)) {
                throw new DBConnectorException(DBConnectorErrorEnum.DUPLICATE_KEY_WHEN_CREATING_USER);
            } else {
                throw new DBConnectorException(DBConnectorErrorEnum.UNSPECIFIED_ERROR);
            }
        }


        return getUser(id);

    }

    public String findUserId(String username, String password)
    {

        User user = userCollection.find(new Document("username", username)).first();

        if(user == null) {
            throw new DBConnectorException(DBConnectorErrorEnum.USERNAME_DOES_NOT_EXIST);
        }

        if(!user.password.contentEquals(password)) {
            throw new DBConnectorException(DBConnectorErrorEnum.INCORRECT_PASSWORD);
        }

        return user.user_id;

    }

    public void updateUserProperties(String user_id, UserProperties userProperties) {

        Document doc = new Document();
        doc.append("dob", userProperties.dob);
        doc.append("gender", userProperties.gender.toString());
        doc.append("height_cm", userProperties.height_cm);


        UpdateResult result = userCollection.updateOne(
                //Filters.eq("_id", new ObjectId(user_id)),
                Filters.eq("_id", user_id),
                new Document("$set", doc)
        );

        if(result.getMatchedCount() != 1) {
            throw new RuntimeException("Matched count is not '1' it is: " + result.getMatchedCount());
        }

    }

    public void addEntry(String user_id, Entry entry) {

        if(entry.entry_id != null) {
            throw new RuntimeException("entry_id should be null when adding new entries");
        }

        Document doc = new Document();
        doc.append("entry_id", (new ObjectId()).toHexString());
        doc.append("date", entry.date);
        doc.append("weight_kg", entry.weight_kg);
        doc.append("comment", entry.comment);

        UpdateResult result = userCollection.updateOne(
                Filters.eq("_id", user_id),
                new Document("$push", new Document("entry_list", doc))
        );

        if(result.getModifiedCount() != 1) {
            throw new RuntimeException("Modified count is not '1' it is: " + result.getModifiedCount());
        }

    }

    public void updateEntry(String user_id, Entry entry) {

        if(entry.entry_id == null) {
            throw new RuntimeException("entry_id should NOT be null when updating entries");
        }

        Document doc = new Document();
        doc.append("entry_id", entry.entry_id);
        doc.append("date", entry.date);
        doc.append("weight_kg", entry.weight_kg);
        doc.append("comment", entry.comment);

        UpdateResult result = userCollection.updateOne(
                (new Document("_id", user_id)).append("entry_list.entry_id", entry.entry_id),
                new Document("$set", new Document("entry_list.$", doc))
        );

        if(result.getMatchedCount() != 1) {
            throw new RuntimeException("Matched count is not '1' it is: " + result.getMatchedCount());
        }

    }

    public User getUser(ObjectId user_id) {

        return getUser(user_id.toHexString());

    }

    public User getUser(String user_id) {

        User user = userCollection.find(Filters.eq("_id", user_id)).first();

        return user;

    }

}
