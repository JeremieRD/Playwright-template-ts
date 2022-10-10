import { Locator } from "../fixtures";
import { PageWithPageObjects } from "../types";

export default class Base {
  page: PageWithPageObjects;
  baseUrl: string;
  readonly currentSection: Locator;

  constructor(page: PageWithPageObjects) {
    this.page = page;
    // Include correct baseUrl in the constructor of every Page Object that extends this class
    this.baseUrl = "/";
    this.currentSection = page.locator("div.v-main__wrap");
  }

  /** Navigate to page */
  async goto(url?: string) {
    await this.page.goto(url || this.baseUrl);
  }
}
