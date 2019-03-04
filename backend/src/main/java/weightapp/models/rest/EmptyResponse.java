package weightapp.models.rest;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect(fieldVisibility=JsonAutoDetect.Visibility.NONE) // To prevent errors because of the empty class
public class EmptyResponse {

}
