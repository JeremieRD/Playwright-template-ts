import { Locator } from "@playwright/test";
import { PageWithPageObjects } from "../types";
import Base from "./base";

export default class NavMenu extends Base {
  readonly rootElement: Locator;
  readonly logo: Locator;
  readonly menuButton: Locator;
  readonly davraLogo: Locator;
  readonly menuItems: Locator;
  readonly selectedItem: Locator;

  constructor(page: PageWithPageObjects) {
    super(page);
    this.rootElement = page.locator("nav.navigation");
    this.logo = page.locator("div.navigation-logo img");
    this.menuButton = page.locator("div.navigation-title button");
    this.davraLogo = page.locator("div.navigation-logo img");
    this.menuItems = page.locator("a.menu-item");
    this.selectedItem = page.locator("a.list-item.active");
  }

  async clickItem(itemText: string): Promise<void> {
    const elem = this.menuItems.filter({ hasText: itemText });
    await elem.click();
  }
}
