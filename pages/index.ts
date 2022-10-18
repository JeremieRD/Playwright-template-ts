import { Page } from "@playwright/test";
import { PageWithPageObjects } from "../types";
// IMPORTS TO BE DELETED
import DeviceDetailsPage from "./deviceDetails";
import DevicesPage from "./devicesPage";
import GraphPage from "./graphPage";
import LoginPage from "./loginPage";
import NavMenu from "./navMenu";
import NewDeviceModal from "./newDeviceModal";

export default class PageObjects {
  private readonly page: PageWithPageObjects;

  constructor(page: Page) {
    this.page = <PageWithPageObjects>page;
  }

  // GETTERS TO BE DELETED
  get loginPage() { return new LoginPage(this.page) };
  get navMenu() { return new NavMenu(this.page) };
  get graphPage() { return new GraphPage(this.page) };
  get deviceDetailsPage() { return new DeviceDetailsPage(this.page) };
  get devicesPage() { return new DevicesPage(this.page) };
  get newDeviceModal() { return new NewDeviceModal(this.page) };
}
