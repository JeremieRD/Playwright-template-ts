/*
    In some cases, you might find yourself in need of testing a scenario where the outcome can be difficult to predict.
    For example, a component in your app could display data based on unpredictable values, such as exact 
    timestamps. Or the displayed values are based on data coming in from real devices, so the tests don't 
    know what the expected value should be at any given time. Our testing options in those cases are limited, but some
    aspects of the feature can still be tested by having Playwright intercept the API request containing the data and
    replace it with a previously captured dataset.

    In this example, the application has an endpoint that returns a random set of data and displays it in a chart.
    Since it's random, we can't test whether the retrieved data is correct, because we don't know what 'correct' is.
    However, there are some things we still can test:
        1. Does the application display correct data given a predefined dataset? (mock data)
        2. Is the data format correct? (real data)
        3. Does the API response body match the expected format? (real data) 

    Note that while mocking API responses is useful in some situations, it should only be used when testing with real data
    is not an option.
*/
import { test as base, expect } from "../fixtures";
import GraphPage from "../pages/graphPage";
import randomData from "../utils/testData/random-data";

const test = base.extend<{
  graphPageMock: GraphPage;
  graphPageWithData: {
    graphPage: GraphPage;
    data: { chartData: object[]; arr: number[] };
  };
}>({
  // Define a new fixture that replaces data from /random-data with a predefined dataset
  graphPageMock: async ({ page }, use) => {
    // Replace response from /random-data with a predefined one. See https://playwright.dev/docs/network#handle-requests
    await page.route("**/random-data", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(randomData),
      });
    });
    // Instantiate the Page Object and navigate to page
    const graphPage = page.objects.graphPage;
    await graphPage.goto();
    await use(graphPage);
  },

  // Data from API responses can also be read without modifying the incoming payload
  // This fixture will save data received from /random-data and pass it to the test
  graphPageWithData: async ({ page }, use) => {
    const graphPage = page.objects.graphPage;
    const response = page.waitForResponse("**/random-data").then((res) => res.json());
    await graphPage.goto();
    const data = await response;
    await use({ graphPage, data });
  },
});

test.describe.parallel("Testing unpredictable features", () => {
  test.describe("With mock data", () => {
    test("Check for exact value", async ({ graphPageMock }) => {
      await expect(graphPageMock.averageValue).toContainText("1269.397");
    });
  });

  test.describe("With real data", () => {
    // Verify the UI displays correct data
    test("Average value should be correct", async ({ graphPageWithData }) => {
      const { graphPage, data } = graphPageWithData;
      // Calculate average value in the same format as displayed by the application
      const expectedAverage = (data.arr.reduce((partialSum, num) => partialSum + num, 0) / data.arr.length).toFixed(3);
      // Verify displayed value matches the calculated one
      await expect(graphPage.averageValue).toContainText(expectedAverage);
    });
  });
});

export { test };
