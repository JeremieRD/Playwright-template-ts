import { Locator } from "@playwright/test";
import { PageWithPageObjects } from "../types";
import Base from "./base";

export default class DevicesPage extends Base {
  readonly rootElement: Locator;
  readonly title: Locator;
  readonly newDevice: Locator;
  readonly searchField: Locator;
  readonly devices: Locator;
  readonly noDataIndicator: Locator;

  constructor(page: PageWithPageObjects) {
    super(page);
    this.baseUrl = "/#/devices";
    this.rootElement = page.locator("div.v-main__wrap");
    this.title = page.locator("v-banner__text h1");
    this.newDevice = page.locator('button:has-text("NEW DEVICE")');
    this.searchField = page.locator("div.search input");
    this.devices = page.locator("div.device-table tbody tr");
    this.noDataIndicator = page.locator("tr.v-data-table__empty-wrapper");
  }
}
