import { Locator } from "@playwright/test";
import { PageWithPageObjects } from "../types";
import Base from "./base";

export default class NewDeviceModal extends Base {
  readonly rootElement: Locator;
  readonly title: Locator;
  readonly newDevice: Locator;
  readonly createButton: Locator;
  readonly fields: Locator;

  constructor(page: PageWithPageObjects) {
    super(page);
    this.rootElement = page.locator("div.v-dialog");
    this.title = this.rootElement.locator("div.v-card__title");
    this.fields = this.rootElement.locator("div.v-text-field__slot");
    this.createButton = this.rootElement.locator('button:has-text("CREATE")');
  }

  get deviceName() { return this.getField('Device Name').locator('input') };
  get serialNumber() { return this.getField('Serial Number').locator('input') };
  get description() { return this.getField('Description').locator('textarea') };

  getField(name: string): Locator {
    return this.fields.filter({ hasText: name });
  }
}
