import { APIRequestContext } from "@playwright/test";
import PlatformCRUD from "./platformCRUD";
import type { Device, Rule, Twin, TwinType, User } from "../types";

export default class ApiUtils {
  private readonly request: APIRequestContext;
  private readonly appRequest: APIRequestContext;
  readonly crud: PlatformCRUD;

  constructor(adminContext: APIRequestContext, appContext: APIRequestContext) {
    this.request = adminContext;
    this.appRequest = appContext;
    this.crud = new PlatformCRUD(adminContext);
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Run function on a loop until it returns a truthy value or times out */
  async waitUntil(fn: Function, options?: WaitOptions) {
    const timeoutAt = Date.now() + (options?.timeout || 10000);
    let conditionMet = false;
    while (!conditionMet && Date.now() < timeoutAt) {
      conditionMet = await fn();
      if (!conditionMet) await this.delay(options?.retryRate || 250);
    }
    if (!conditionMet) throw new Error(options?.errorMessage || "Timed out waiting for condition to be met");
    return conditionMet;
  }

  /** GET device until successful (OK status code) */
  async waitForDevice(uuid: string, options?: WaitOptions) {
    return await this.waitUntil(async () => {
      try {
        return await this.crud.getDevice(uuid);
      } catch {
        return false;
      }
    }, options);
  }

  private async getObjectByName(objArray: { name: string }[], name: string): Promise<object> {
    const filteredTypes = objArray.filter((item) => item.name === name);
    if (filteredTypes.length !== 1) throw new Error(`Found ${filteredTypes.length} items matching name "${name}"`);
    return filteredTypes[0];
  }

  /** Uploads payload in chunks (500 datapoints by default) */
  async sendData(payload: object[] | object, options: { chunkSize?: number } = {}) {
    const data = payload;
    if (!Array.isArray(data)) {
      return await this.crud.sendIotData(data);
    }
    while (data.length) {
      let dataToPush = data.splice(0, options.chunkSize || 500);
      try {
        await this.crud.sendIotData(dataToPush);
      } catch (e) {
        console.error(e.message, dataToPush);
      }
    }
  }

  /**
   * Delete IoT data stretching from now to specified date in the past, 30 days ago by default
   * @example
   * // Deletes metric '43040_100' for the past 8 hours
   * await apiUtils.deleteData('43040_100', {
   *    timeframe: 8,
   *    unit: 'hours'
   * });
   */
  async deleteData(
    metric: string[] | string,
    options: {
      timeframe?: number | string;
      unit?: "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds";
    } = {}
  ) {
    const metrics = Array.isArray(metric) ? metric : [metric];
    for (const item of metrics) {
      await this.crud.deleteIotData({
        metrics: [{ name: item }],
        start_relative: {
          value: `${options.timeframe || 30}`,
          unit: `${options.unit || "days"}`,
        },
      });
    }
  }

  async getDeviceByName(deviceName: string): Promise<Device> {
    return <Device>await this.getObjectByName(await this.crud.getDevices(), deviceName);
  }

  async getRuleByName(ruleName: string): Promise<Rule> {
    return <Rule>await this.getObjectByName(await this.crud.getRules(), ruleName);
  }

  async getTwinByName(twinName: string): Promise<Twin> {
    return <Twin>await this.getObjectByName(await this.crud.getTwins(), twinName);
  }

  async getTwinTypeByName(twinTypeName: string): Promise<TwinType> {
    return <TwinType>await this.getObjectByName(await this.crud.getTwinTypes(), twinTypeName);
  }

  async getUserByName(userName: string): Promise<User> {
    return <User>await this.getObjectByName(await this.crud.getUsers(), userName);
  }
}

interface WaitOptions {
  timeout?: number;
  errorMessage?: string;
  retryRate?: number;
}
