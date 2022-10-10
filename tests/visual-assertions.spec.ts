/*
    Playwright can compare UI elements to their saved snapshots. Some elements can be displayed
    differently depending on the operating system of the machine running the tests. To avoid having to
    maintain snapshots for every environment where visual assertions are performed, they can be configured
    to only run on CI, presumably in a Docker container.

    To run them locally and/or update the snapshots, the tests need to run in a Docker container:
    https://playwright.dev/docs/docker#usage
*/
import { expect } from "../fixtures";
import { test } from "./unpredictable-data.spec";

test.describe.parallel("Visual assertions", () => {
  test.skip(!process.env.CI, "Only run visual assertions on CI");

  test("Simple visual assertion of a static element", async ({ navMenu }) => {
    /*
        The simplest visual assertions can compare images or static elements with
        a saved snapshot to ensure they are rendered correclty.
        This example compares the Davra logo with the saved snapshot.
    */
    await expect(navMenu.logo).toHaveScreenshot("davra-logo.png");
  });

  test("Compare graph screenshots (mock data)", async ({ graphPageMock }) => {
    /*
        Elements representing unpredictable data can be tested by providing a predefined payload.
        In this example, we replace the response from /random-data with a known dataset to test the graph.
        When possible, testing with real data is preferable to mocking.
        See 'unpredictable-data.spec.ts' and 'data-upload.spec.ts' for more information.
    */
    await expect(graphPageMock.graph).toHaveScreenshot("graph.png", {
      animations: "disabled",
    });
  });

  test("Visual assertion with masking", async ({ deviceDetailsPage }) => {
    const { detailsPage } = deviceDetailsPage;
    await detailsPage.selectTab("DATA");
    /*
        In some cases, the snapshot you're comparing will contain an element that can
        change in appearance and should be excluded from the comparison. Once all such elements
        are identified, they can be masked (replaced with a pink rectangle).
    */
    await expect(detailsPage.currentSection).toHaveScreenshot("device-data-tab.png", {
      mask: [
        detailsPage.titleContainer, // Title contains random device name
        detailsPage.datePicker, // Date & time will change depending on when the test runs
      ],
    });
  });
});
