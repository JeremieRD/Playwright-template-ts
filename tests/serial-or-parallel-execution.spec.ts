/*
  This is a simple example of how tests can be configured to run in serial or parallel mode.
  By default, Playwright will run tests in parallel at file level, so tests in separate files will run in parallel
  with each other, but tests defined in the same file will run one after another. It is generally preferable to run
  tests in parallel, as it improves overall execution time and enforces good practices in terms of keeping the
  tests isolated. 

  In some situations, running tests in parallel is not practical. For example, if you have a lot of tests where each
  one needs to create a unique rule, running them all in parallel can fail if the maximum number of rules is reached.
  Running those tests in serial mode will allow you to avoid those issues at the cost of increased execution time.

  When running tests in serial mode, they will be executed in the same order in which they are defined.
*/

import { test, expect } from "../fixtures";

// Menu items and their respective url matches
const pages = {
  Devices: /\/#\/devices$/,
  "Rules Engine": /\/#\/rules-engine$/,
  "Graph Preview": /\/#\/random$/,
  Map: /\/#\/map$/,
};

// These tests will run in parallel
test.describe.parallel("Navigation menu test (parallel)", () => {
  test("Menu button and logo are displayed", async ({ navMenu }) => {
    await expect(navMenu.menuButton).toBeVisible();
    await expect(navMenu.davraLogo).toBeVisible();
    await expect(navMenu.davraLogo).toHaveAttribute("src", /davra-logo/);
  });

  test("Logo is not visible with menu collapsed", async ({ navMenu }) => {
    await navMenu.menuButton.click();
    await expect(navMenu.davraLogo).toBeHidden();
  });

  test("Can navigate to each page with menu expanded", async ({ navMenu }) => {
    for (const [menuItem, url] of Object.entries(pages)) {
      await navMenu.clickItem(menuItem);
      await expect(navMenu.selectedItem).toHaveText(menuItem);
      await expect(navMenu.page).toHaveURL(url);
    }
  });

  test("Can navigate to each page with menu collapsed", async ({ navMenu }) => {
    await navMenu.menuButton.click();
    for (const [menuItem, url] of Object.entries(pages)) {
      await navMenu.clickItem(menuItem);
      await expect(navMenu.selectedItem).toHaveText(menuItem);
      await expect(navMenu.page).toHaveURL(url);
    }
  });
});

// These tests will run NOT in parallel
test.describe("Navigation menu test (serial)", () => {
  test("Menu button and logo are displayed", async ({ navMenu }) => {
    await expect(navMenu.menuButton).toBeVisible();
    await expect(navMenu.davraLogo).toBeVisible();
    await expect(navMenu.davraLogo).toHaveAttribute("src", /davra-logo/);
  });

  test("Logo is not visible with menu collapsed", async ({ navMenu }) => {
    await navMenu.menuButton.click();
    await expect(navMenu.davraLogo).toBeHidden();
  });

  test("Can navigate to each page with menu expanded", async ({ navMenu }) => {
    for (const [menuItem, url] of Object.entries(pages)) {
      await navMenu.clickItem(menuItem);
      await expect(navMenu.selectedItem).toHaveText(menuItem);
      await expect(navMenu.page).toHaveURL(url);
    }
  });

  test("Can navigate to each page with menu collapsed", async ({ navMenu }) => {
    await navMenu.menuButton.click();
    for (const [menuItem, url] of Object.entries(pages)) {
      await navMenu.clickItem(menuItem);
      await expect(navMenu.selectedItem).toHaveText(menuItem);
      await expect(navMenu.page).toHaveURL(url);
    }
  });
});
