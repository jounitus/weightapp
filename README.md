# Weightapp

## The Idea

The idea of the app is for the user to be able to track their own weight.

My plan is to use this as a base for my own personal project.

At the moment this version is fairly generic web app, which is easy to use as a base for other web apps.

## About Frontend

* [React](https://reactjs.org/)
* [Jest](https://jestjs.io/) for testing

## About Backend

The REST API backend is fairly basic and only does authentication and the database calls for the frontend.

* [Spring Boot](https://spring.io/projects/spring-boot) for REST/HTTP handling
* [JSON Web Tokens](https://jwt.io/) for authentication
* [MongoDB](https://www.mongodb.com/) for database
* [JUnit](https://junit.org/) for testing

## Tests In Frontend

Most of the React components are tested with the `shallow` renderer. Most of the tests are in the `__tests__` directories.

Some of the tests directories:

* [`frontend/src/components/__tests__`](frontend/src/components/__tests__) Tests for the components the views use
* [`frontend/src/views/__tests__`](frontend/src/views/__tests__) Tests for the views

Some of the additional tests:

* [`frontend/src/App.test.js`](frontend/src/App.test.js) Tests for the main app
* [`frontend/src/Api.test.js`](frontend/src/Api.test.js) Tests for the API module


## Tests in Backend

All the tests are in [backend/src/test/java/weightapp/](backend/src/test/java/weightapp/) directory

* [AuthenticatorTest.java](backend/src/test/java/weightapp/AuthenticatorTest.java) Unit tests for JWT authentication
* [DBConnectorTest.java](backend/src/test/java/weightapp/DBConnectorTest.java) Integration tests for the database connector
* [WeightAppRestControllerIT.java](backend/src/test/java/weightapp/WeightAppRestControllerIT.java) Integration tests for the REST API


## Building

* [frontend/Dockerfile](frontend/Dockerfile) Frontend Dockerfile
* [backend/Dockerfile](backend/Dockerfile) Backend Dockerfile
* [MongoDB Dockerfile](https://hub.docker.com/_/mongo) tested with `mongo:4.0.6`

## Running the app in Kubernetes

[kubernetes/](kubernetes/) directory has basic Kubernetes scripts to run the app in Kubernetes.

These Kubernetes scripts assumes that the app is ran on a "bare metal" cluster with a local storage.

This directory also contains ansible scripts to setup the local directory for mongodb.
