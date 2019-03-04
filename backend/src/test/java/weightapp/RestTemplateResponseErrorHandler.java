package weightapp;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import weightapp.models.rest.ErrorResponse;

import java.io.IOException;

import static org.springframework.http.HttpStatus.Series.CLIENT_ERROR;
import static org.springframework.http.HttpStatus.Series.SERVER_ERROR;

@Component
public class RestTemplateResponseErrorHandler
        implements ResponseErrorHandler {

    private static final Logger log = LoggerFactory.getLogger(RestTemplateResponseErrorHandler.class);

    @Override
    public boolean hasError(ClientHttpResponse httpResponse)
            throws IOException {

        return (
                httpResponse.getStatusCode().series() == CLIENT_ERROR
                        || httpResponse.getStatusCode().series() == SERVER_ERROR);
    }

    @Override
    public void handleError(ClientHttpResponse httpResponse)
            throws IOException {

        String body = IOUtils.toString(httpResponse.getBody(), "UTF-8");

        log.error("handleError: " + body);

        ErrorResponse errorResponse = null;

        try {
             errorResponse = new ObjectMapper().readValue(body, ErrorResponse.class);
        } catch(Exception ex) {
            // we might receive all kinds of responses, so skip this exception
            log.error(ex.toString());
        }

        if(errorResponse != null) {
            throw new ResponseException(errorResponse);
        }

        throw new RuntimeException(body);

    }
}