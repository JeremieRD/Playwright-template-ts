/*
  Lighthouse can be used to gather UI performance metrics from your application.
  It is not integrated with Playwright out of the box, so some initial setup is required.
  Playwright needs to start a persistent context with an exposed debugging port for Lighthouse to use.
  In this example, this is handled in the beforeAll block.

  Note that Lightouse test results can vary between runs. Having Lighthouse tests running in parallel
  with a large suite of tests can negatively affect the metrics. If you experience this problem, you can
  configure a dedicated project in playwright.config.ts and run it separately (before or after any other tests).
  See https://playwright.dev/docs/test-advanced#projects
 */
import { test, expect } from "../fixtures";
import { BrowserContext, chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import PO from "../pages";
import env from "../env";

test.describe("Lighthouse performance test", () => {
  let context: BrowserContext;

  test.beforeAll(async ({ baseURL }) => {
    // Setup persistent context for Lightouse to use
    context = await chromium.launchPersistentContext("lighthouseContext", {
      args: [`--remote-debugging-port=8041`],
      headless: true,
    });
    const [page] = context.pages();
    await page.goto(`${baseURL}/#/devices`);

    const PageObjects = new PO(page);
    const loginPage = PageObjects.loginPage;
    await page.goto(env.baseUrl);
    await loginPage.login(env.auth.username, env.auth.password);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test("Measure performance score", async ({ baseURL }) => {
    const result = await lighthouse(`${baseURL}/#/devices`, {
      port: 8041, // Must match the port configured in beforeAll
      onlyCategories: ["performance"],
      disableStorageReset: true,
      disableDeviceEmulation: true,
    });

    const performanceScore = result.lhr.categories.performance.score * 100;
    expect(performanceScore).toBeGreaterThan(30);
  });
});
