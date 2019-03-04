package weightapp;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;
import weightapp.models.SessionTokenInfo;

import java.util.Calendar;
import java.util.Date;

@Component
public class Authenticator {

    private Algorithm algorithm;
    private JWTVerifier verifier;

    public Authenticator() {

        algorithm = Algorithm.HMAC256("secret"); // TODO add better secret

        verifier = JWT.require(algorithm)
                .build(); //Reusable verifier instance

    }

    public String generateToken(SessionTokenInfo sessionTokenInfo) {

        Calendar calendar = Calendar.getInstance(); // gets a calendar using the default time zone and locale.
        calendar.add(Calendar.HOUR, 24);
        System.out.println(calendar.getTime());
        Date expiresAt = calendar.getTime();

        String token = JWT.create()
                .withClaim("user_id", sessionTokenInfo.user_id)
                .withIssuedAt(new Date())
                .withExpiresAt(expiresAt)
                .sign(algorithm);

        return token;

    }

    public SessionTokenInfo decodeToken(String token) {

        DecodedJWT decodedJWT = verifier.verify(token);

        SessionTokenInfo sessionTokenInfo = new SessionTokenInfo();
        sessionTokenInfo.user_id = decodedJWT.getClaim("user_id").asString();

        return sessionTokenInfo;

    }

}
