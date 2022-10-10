/*
    Playwrights primary focus is UI testing, but it provides some API testing capabilities as well.
    In this project, several fixtures are configured to provide your tests with instances of APIRequestContext:
        - appRequest -> authenticated context for the application
        - baseRequest -> authenticated context for the platform
        - appRequestNoAuth -> unauthenticated context for the application
    
    See https://playwright.dev/docs/api/class-apirequestcontext
*/
import { test, expect } from "../fixtures";

test.describe.parallel("Sample API test", () => {
  test("GET /random-data", async ({ appRequest }) => {
    const response = await (await appRequest.get("/random-data")).json();
    // The response should contain 365 datapoints
    // Using soft assertions will allow the test to continue if they fail
    expect.soft(response).toHaveProperty("chartData");
    expect.soft(response).toHaveProperty("arr");
    expect.soft(Array.isArray(response.chartData)).toBe(true);
    expect.soft(Array.isArray(response.arr)).toBe(true);
    expect.soft(response.chartData.length).toEqual(365);
    expect.soft(response.arr.length).toEqual(365);
  });
});
