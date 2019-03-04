package weightapp.models;

import org.bson.codecs.pojo.annotations.BsonId;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class User extends UserProperties {

    @BsonId
    public String user_id;

    public String username;

    public String password;

    public List<Entry> entry_list;

    public Optional<Entry> findEntry(LocalDate date) {
        return entry_list.stream().filter(x -> x.date.equals(date)).findFirst();
    }

    public Optional<Entry> findEntry(String entry_id) {
        return entry_list.stream().filter(x -> x.entry_id.contentEquals(entry_id)).findFirst();
    }

}
