@baseUrl @baseUrl-api
@json
Feature: Health Check
  User or system should be able to check the API health status

  Scenario: Check API health
    Given that I make a GET request to "/health"
    Then the response field "status" should be "true"
    And the response HTTP status code should be "200"
