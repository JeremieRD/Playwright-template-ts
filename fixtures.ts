import { test as base, Page, APIRequestContext, request, PlaywrightTestArgs } from "@playwright/test";
import env from "./env";
import ApiUtils from "./utils/apiUtils";
import PageObjects from "./pages/index";
import NavMenu from "./pages/navMenu";
import { Device, PageWithPageObjects } from "./types";
import DeviceDetailsPage from "./pages/deviceDetails";
import DevicesPage from "./pages/devicesPage";

// Define fixtures that will be available in all tests
export const test = base.extend<ExtendedPlaywrightTestArgs>({
  baseRequest: async ({}, use) => {
    const context = await request.newContext({
      baseURL: env.platformUrl,
      httpCredentials: env.auth,
    });
    await use(context);
    await context.dispose();
  },

  appRequest: async ({}, use) => {
    const context = await request.newContext({
      baseURL: env.baseUrl,
      storageState: "authState.json",
    });
    await use(context);
    await context.dispose();
  },

  appRequestNoAuth: async ({}, use) => {
    const context = await request.newContext({
      baseURL: env.baseUrl,
    });
    await use(context);
    await context.dispose();
  },

  apiUtils: async ({ baseRequest, appRequest }, use) => {
    const utils = new ApiUtils(baseRequest, appRequest);
    await use(utils);
  },

  page: async ({ page }, use) => {
    const extendedPage: PageWithPageObjects = Object.assign(page, {
      objects: new PageObjects(page),
    });
    await use(extendedPage);
  },

  noAuthPage: async ({ browser }, use) => {
    const page: Page = await browser.newPage({
      storageState: undefined,
      baseURL: env.baseUrl,
    });
    const extendedPage: PageWithPageObjects = Object.assign(page, {
      objects: new PageObjects(page),
    });
    await use(extendedPage);
  },

  testDevice: async ({ apiUtils }, use) => {
    const randomSuffix = Math.floor(Math.random() * Date.now());
    const device = await apiUtils.crud.createDevice({
      name: `auto-${randomSuffix}`,
      serialNumber: randomSuffix,
      labels: {
        testKey: `val-${randomSuffix}`,
      },
      customAttributes: {
        attKey: `attVal-${randomSuffix}`,
      },
    });
    // Wait until device is reachable
    await apiUtils.waitForDevice(device.UUID, {
      errorMessage: `Timed out waiting for device: ${device.name}, UUID: ${device.UUID}`,
    });
    await use(device);
    await apiUtils.crud.deleteDevice(device.UUID);
  },

  // TO BE DELETED
  navMenu: async ({ page }, use) => {
    const navMenu = page.objects.navMenu;
    await navMenu.goto();
    await use(navMenu);
  },

  // TO BE DELETED
  // A fixture can provide more than 1 value
  deviceDetailsPage: async ({ page, testDevice }, use) => {
    const detailsPage = page.objects.deviceDetailsPage;
    await detailsPage.goto(`/#/device/${testDevice.UUID}`);
    await use({ detailsPage, testDevice });
  },

  // TO BE DELETED
  devicesPage: async ({ page }, use) => {
    const devicesPage = page.objects.devicesPage;
    await devicesPage.goto();
    await use(devicesPage);
  },
});

export * from "@playwright/test";

interface ExtendedPlaywrightTestArgs extends PlaywrightTestArgs {
  /** Isolated [APIRequestContext] for the Davra platform */
  baseRequest: APIRequestContext;
  /** Isolated [APIRequestContext] for the application */
  appRequest: APIRequestContext;
  /** Isolated [APIRequestContext] for the application (no authentication) */
  appRequestNoAuth: APIRequestContext;
  /** API utilities for the platform */
  apiUtils: ApiUtils;
  page: PageWithPageObjects;
  /** Page Object for the navigation menu. Will navigate to the landing page of the app */
  navMenu: NavMenu;
  /** Isolated [Page] instance with no authentication state */
  noAuthPage: PageWithPageObjects;
  /** Create a sample device with a label and custom attribute */
  testDevice: Device;
  /** Page Object for the device details page. Will create a new device and go to the page. */
  deviceDetailsPage: { detailsPage: DeviceDetailsPage; testDevice: Device };
  /** Page Object for the devices page */
  devicesPage: DevicesPage;
}
