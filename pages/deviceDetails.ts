import { Locator } from "@playwright/test";
import { PageWithPageObjects } from "../types";
import Base from "./base";

export default class DeviceDetailsPage extends Base {
  readonly rootElement: Locator;
  readonly title: Locator;
  readonly titleContainer: Locator;
  readonly generalFields: Locator;
  readonly tabs: Locator;
  readonly metricDropdown: Locator;
  readonly metricText: Locator;
  readonly datePicker: Locator;

  constructor(page: PageWithPageObjects) {
    super(page);
    this.rootElement = page.locator("div.v-main__wrap");
    this.title = page.locator("div.v-toolbar__title");
    this.titleContainer = page.locator("div.v-toolbar__content");
    this.generalFields = this.rootElement.locator("div[role='listitem']");
    this.tabs = page.locator("div.v-tab");
    this.metricDropdown = page.locator('select[label*="Metric"]');
    this.metricText = page.locator("div.v-card__text");
    this.datePicker = page.locator("div.v-input__slot");
  }

  get name() { return this.getFieldValue("Name") };
  get description() { return this.getFieldValue("Description") };
  get serialNumber() { return this.getFieldValue("Serial Number") };
  get state() { return this.getFieldValue("State") };
  get lastMessage() { return this.getFieldValue("Last Message") };

  private getFieldValue(fieldName: string): Locator {
    const field = this.generalFields.filter({ hasText: fieldName });
    return field.locator("div.v-list-item__subtitle");
  }

  async selectTab(tabName: "OVERVIEW" | "DATA" | "GRAPHS" | "ALARMS") {
    await this.tabs.filter({ hasText: tabName }).click();
  }
}
