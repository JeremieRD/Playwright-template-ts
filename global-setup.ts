import { chromium } from "@playwright/test";
import { request } from "@playwright/test";
import PO from "./pages";
import env from "./env";

/* Exported function will be executed once before running all tests */
export default async () => {
  if (!(env.auth.username && env.auth.password)) {
    return console.log("No user credentials found, skipping authentication");
  }
  // Login using admin credentials and save authenticated state
  // Whenever the page fixture is used in a test, it will use this state by default
  if (env.authenticationMethod === "OAuth") {
    /*      OAuth      */
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const PageObjects = new PO(page);
    const loginPage = PageObjects.loginPage;
    await page.goto(env.baseUrl);
    await loginPage.login(env.auth.username, env.auth.password);
    await context.storageState({ path: "authState.json" });
    await browser.close();
  } else if (env.authenticationMethod === "Basic") {
    /*     Basic Auth through API     */
    const apiContext = await request.newContext({
      baseURL: env.platformUrl,
    });
    await apiContext.post("/ui/login", {
      data: `username=${env.auth.username}&password=${env.auth.password}`,
      failOnStatusCode: true,
    });
    await apiContext.storageState({ path: "authState.json" });
  }
};
