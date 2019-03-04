FROM openjdk:8 as builder

ARG MAVEN_VERSION=3.5.4
ARG USER_HOME_DIR="/root"
ARG BASE_URL=http://www-eu.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries

RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
  && curl -fsSL -o /tmp/apache-maven.tar.gz ${BASE_URL}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
  && tar -xzf /tmp/apache-maven.tar.gz -C /usr/share/maven --strip-components=1 \
  && rm -f /tmp/apache-maven.tar.gz \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"

COPY . /usr/src/myapp

WORKDIR /usr/src/myapp

RUN mvn -Dmaven.test.skip=true package

#
# build the image that runs the app
#

FROM openjdk:8-jre-slim-stretch

RUN apt-get update

# install envsubst from gettext-base that is used in docker-entrypoint.sh
RUN apt-get install -y --no-install-recommends gettext-base

RUN rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/myapp/target /usr/src/myapp/target

WORKDIR /usr/src/myapp

CMD ["java", "-Xmx256m", "-jar", "./target/gs-spring-boot-0.1.0.jar"]

