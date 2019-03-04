package weightapp;

import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import weightapp.models.SessionTokenInfo;

public class AuthenticatorTest {

    private static final Logger log = LoggerFactory.getLogger(AuthenticatorTest.class);

    @Test
    public void testGenerateToken() {

        Authenticator authenticator = new Authenticator();

        SessionTokenInfo sessionTokenInfo = new SessionTokenInfo();
        sessionTokenInfo.user_id = "my_user_id";

        String token = authenticator.generateToken(sessionTokenInfo);

        log.info("JWT Token: " + token);

        SessionTokenInfo decoded = authenticator.decodeToken(token);

        Assert.assertEquals(sessionTokenInfo.user_id, decoded.user_id);

    }


}
