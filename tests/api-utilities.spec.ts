/*
    This project comes with CRUD API utilities for the platform. They will allow you to set up and delete any test data
    on the platform, such as devices, digital twins, rules, iot data etc.
    Every test can access those utilities using the apiUtils fixture
*/
import { test, expect } from "../fixtures";

/* Adding a random value to the device name and serial number will ensure there's no conflicts with other existing devices */
const randomSuffix = Math.floor(Math.random() * Date.now());

const deviceData = {
  name: `test-${randomSuffix}`,
  serialNumber: `${randomSuffix}`,
  description: "Hello World!",
};

test.describe("Test that uses API utilities", () => {
  test("Device can be created", async ({ apiUtils, devicesPage }) => {
    await test.step("Create a device using the UI", async () => {
      await devicesPage.newDevice.click();
      const modal = devicesPage.page.objects.newDeviceModal;
      await expect(modal.rootElement).toBeVisible();
      await modal.deviceName.fill(deviceData.name);
      await modal.serialNumber.fill(deviceData.serialNumber);
      await modal.description.fill(deviceData.description);
      await modal.createButton.click();
      await expect(modal.rootElement).toBeHidden();
    });

    await test.step("Verify the new device is displayed in the table", async () => {
      await apiUtils.delay(2000);
      await devicesPage.page.reload();
      expect(await devicesPage.devices.count()).toBeGreaterThan(0);
      await expect(devicesPage.noDataIndicator).toBeHidden();
      await devicesPage.searchField.fill(deviceData.name);
      await expect(devicesPage.devices).toHaveCount(1);
      await expect(devicesPage.devices.nth(0)).toContainText(deviceData.name);
    });

    /*
        The device description is not displayed in the table, so we can get the device object
        using apiUtils and check whether it contains the correct description. 
    */
    const device = await test.step("Validate device description", async () => {
      /* 
            We don't know the UUID of the device, so we can't make a direct call like this: https://www.developer.davra.com/api/#retrieve-a-device
            Instead, apiUtils allows us to GET all devices and filter them by name, then return the
            matching device object. We can use it to run assertions and delete the device afterwards.
        */
      const device = await apiUtils.getDeviceByName(deviceData.name);
      expect.soft(device.description).toEqual(deviceData.description);
      return device; // Return the device so we can delete it in the next step
    });

    await test.step("Delete device via API", async () => {
      /*
            Deleting test data would normally NOT be done insinde the 'test' block, because any failure prior to this step
            could prevent the data from getting deleted. Using fixtures or hooks (afterEach or afterAll) is a safer solution
            for deleting data.
            For the sake of this example though, it will be done in a test step.

            Read more about hooks: https://playwright.dev/docs/api/class-test#test-after-all
         */
      await apiUtils.crud.deleteDevice(device.UUID);
    });
  });
});
