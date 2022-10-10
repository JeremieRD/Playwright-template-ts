/*
    Some features of your application might require creating devices, digital twins or other entities on the platform
    in order to test them. In order to keep the tests isolated and able to run in parallel without issues,
    this data should not be shared between tests. An exception to this would be a scenario where large amounts of data
    need to be uploaded prior to running the test, in which case it'd be preferable to use beforeAll and afterAll hooks
    for setup/teardown (see https://playwright.dev/docs/api/class-test#test-before-all)

    In the example below, each test creates its own device and deletes it after the test. The same principle could be 
    applied to other resources on the platform. 
*/
import { test, expect } from "../fixtures";
import moment from "moment";

test.describe.parallel("Isolated tests using unique devices", () => {
  /*
    Tests for devices A, B and C will each create their own device and test different
    aspects of the same page.
  */
  test("Device A", async ({ deviceDetailsPage }) => {
    // Destructure deviceDetailsPage to access the Page Object only, since the device data is not used in this test
    const { detailsPage } = deviceDetailsPage;
    await expect(detailsPage.generalFields).toContainText([
      "Name",
      "Description",
      "Serial Number",
      "State",
      "Last Message",
    ]);
  });

  test("Device B", async ({ deviceDetailsPage }) => {
    // Destructure the fixture to access the Page Object and device data
    const { detailsPage, testDevice } = deviceDetailsPage;
    await expect(detailsPage.title).toHaveText(testDevice.name);
    await expect(detailsPage.name).toHaveText(testDevice.name);
    await expect(detailsPage.description).toHaveText(""); // No description was provided
    await expect(detailsPage.serialNumber).toHaveText(testDevice.serialNumber);
    await expect(detailsPage.state).toHaveText("Active");
    // The 'Last Message' will contain the date and time when the device was created, so let's compare it to current time
    const now = moment();
    const lastMessageString = await detailsPage.lastMessage.textContent();
    const lastMessage = moment(lastMessageString, "YYYY-MM-DD h:mm");
    // Displayed time doesn't include seconds, so allow 1.5 min between displayed time and current time
    expect(lastMessage.diff(now)).toBeLessThan(90000);
  });

  /*
    Device C will not use the testDevice fixture, instead creating the device using API utilities.
    This gives us more flexibility in terms of customizing the device object.
  */
  test("Device C", async ({ page, apiUtils }) => {
    // First we need to define the device payload (see https://www.developer.davra.com/api/#the-device-object)
    const payload = {
      name: "MyTestDevice",
      serialNumber: "asd82es8a",
      description: "Custom description!",
    };
    const device = await apiUtils.crud.createDevice(payload);
    // Now we can instantiate the Page Object and navigate to device details page
    const devicesPage = page.objects.deviceDetailsPage;
    await devicesPage.goto(`/#/device/${device.UUID}`);
    // The description field now constains the value we've set
    await expect.soft(devicesPage.description).toHaveText(payload.description);
    // Since we didn't use a fixture to create the device, we have to delete it manually
    await apiUtils.crud.deleteDevice(device.UUID);
  });
});
