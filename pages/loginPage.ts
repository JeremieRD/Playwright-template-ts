import { Locator, expect } from "@playwright/test";
import { PageWithPageObjects } from "../types";
import Base from "./base";

/** Davra OAuth login page */
export default class LoginPage extends Base {
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;
  readonly authorizeButton: Locator;
  readonly appRootElement: Locator;

  constructor(page: PageWithPageObjects) {
    super(page);
    this.usernameField = page.locator("#loginusername");
    this.passwordField = page.locator("#loginpassword");
    this.submitButton = page.locator("#loginformsubmit");
    this.authorizeButton = page.locator('input[name="authorize"]');
    // Root element of the app to confirm login was successful.
    this.appRootElement = page.locator("div.v-application--wrap"); // Replace this locator with one matching your application
  }

  async login(username: string, password: string, waitUntilAppLoaded: boolean = true): Promise<void> {
    await this.usernameField.type(username);
    await this.passwordField.type(password);
    await this.submitButton.click();
    await this.authorizeButton.click();
    if (waitUntilAppLoaded) await expect(this.appRootElement).toBeVisible();
  }
}
