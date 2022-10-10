import { Locator } from "@playwright/test";
import { PageWithPageObjects } from "../types";
import Base from "./base";

export default class GraphPage extends Base {
  readonly rootElement: Locator;
  readonly title: Locator;
  readonly averageValue: Locator;
  readonly graph: Locator;

  constructor(page: PageWithPageObjects) {
    super(page);
    this.baseUrl = "/#/random";
    this.rootElement = page.locator("div.v-main__wrap");
    this.title = page.locator("div.v-banner__text h1");
    this.averageValue = page.locator("div.v-card__title h3");
    this.graph = page.locator("#chartdiv");
  }
}
