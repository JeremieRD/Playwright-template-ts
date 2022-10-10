import type { APIRequestContext } from "@playwright/test";
import type {
  Device,
  Rule,
  RequestOptionsNoBody,
  RequestOptionsWithBody,
  ResponseFromTSDB,
  Twin,
  TwinType,
  User,
  Role,
} from "../types";
import { APIResponse } from "@playwright/test";

export default class platformCRUD {
  private readonly request: APIRequestContext;

  constructor(adminContext: APIRequestContext) {
    this.request = adminContext;
  }

  private async getObject(url: string, options: RequestOptionsNoBody = {}) {
    const response = await this.request.get(url, { failOnStatusCode: true, ...options });
    return (await response.json()).records[0];
  }

  // -----------------------
  //         DEVICES
  // -----------------------

  async getDevices(options: RequestOptionsNoBody = {}): Promise<Device[]> {
    const response = await this.request.get("/api/v1/devices", { failOnStatusCode: true, ...options });
    return (await response.json()).records;
  }

  async getDevice(uuid: string, options: RequestOptionsNoBody = {}): Promise<Device> {
    const response = await this.request.get(`/api/v1/devices/${uuid}`, { failOnStatusCode: true, ...options });
    return (await response.json()).records[0];
  }

  async createDevice(payload: object, options: RequestOptionsWithBody = {}): Promise<Device> {
    const response = await this.request.post("/api/v1/devices", { data: payload, failOnStatusCode: true, ...options });
    return (await response.json())[0];
  }

  async updateDevice(uuid: string, payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.put(`/api/v1/devices/${uuid}`, { data: payload, failOnStatusCode: true, ...options });
  }

  async deleteDevice(uuid: string, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.delete(`/api/v1/devices/${uuid}`, { failOnStatusCode: true, ...options });
  }

  // -----------------------
  //     RULES ENGINE
  // -----------------------

  async getRules(options: RequestOptionsNoBody = {}): Promise<Rule[]> {
    const response = await this.request.get("/api/v2/rules", { failOnStatusCode: true, ...options });
    return (await response.json()).records;
  }

  async getRule(uuid: string, options: RequestOptionsNoBody = {}): Promise<Rule> {
    const response = await this.request.get(`/api/v2/rules/${uuid}`, { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async createRule(payload: object, options: RequestOptionsWithBody = {}): Promise<Rule> {
    const response = await this.request.post("/api/v2/rules", { data: payload, failOnStatusCode: true, ...options });
    return await response.json();
  }

  async updateRule(uuid: string, payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.put(`/api/v2/rules/${uuid}`, { data: payload, failOnStatusCode: true, ...options });
  }

  async deleteRule(uuid: string, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.delete(`/api/v2/rules/${uuid}`, { failOnStatusCode: true, ...options });
  }

  // -----------------------
  //      DIGITAL TWINS
  // -----------------------

  async getTwins(options: RequestOptionsNoBody = {}): Promise<Twin[]> {
    const response = await this.request.get("/api/v1/twins", { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async getTwin(uuid: string, options: RequestOptionsNoBody = {}): Promise<Twin> {
    const response = await this.request.get(`/api/v1/twins/${uuid}`, { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async createTwin(payload: object, options: RequestOptionsWithBody = {}): Promise<Twin> {
    const response = await this.request.post("/api/v1/twins", { data: payload, failOnStatusCode: true, ...options });
    return await response.json();
  }

  async updateTwin(uuid: string, payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.put(`/api/v1/twins/${uuid}`, { data: payload, failOnStatusCode: true, ...options });
  }

  async deleteTwin(uuid: string, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.delete(`/api/v1/twins/${uuid}`, { failOnStatusCode: true, ...options });
  }

  async getTwinType(uuid: string, options: RequestOptionsNoBody = {}): Promise<TwinType> {
    const response = await this.request.get(`/api/v1/twintypes/${uuid}`, { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async getTwinTypes(options: RequestOptionsNoBody = {}): Promise<TwinType[]> {
    const response = await this.request.get("/api/v1/twintypes", { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async createTwinType(payload: object, options: RequestOptionsWithBody = {}): Promise<Twin> {
    const response = await this.request.post("/api/v1/twintypes", {
      data: payload,
      failOnStatusCode: true,
      ...options,
    });
    return await response.json();
  }

  async updateTwinType(uuid: string, payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.put(`/api/v1/twintypes/${uuid}`, { data: payload, failOnStatusCode: true, ...options });
  }

  async deleteTwinType(uuid: string, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.delete(`/api/v1/twintypes/${uuid}`, { failOnStatusCode: true, ...options });
  }

  // -----------------------
  //        IOT DATA
  // -----------------------

  async sendIotData(payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.put("/api/v1/iotdata", { data: payload, failOnStatusCode: true, ...options });
  }

  async queryTSDB(query: TimeseriesQuery, options: RequestOptionsWithBody = {}): Promise<ResponseFromTSDB> {
    const response = await this.request.post("/api/v2/timeseriesdata", {
      data: query,
      failOnStatusCode: true,
      ...options,
    });
    return await response.json();
  }

  async deleteIotData(query: TimeseriesQuery, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.delete("/api/v2/timeseriesdata", { data: query, failOnStatusCode: true, ...options });
  }

  // -----------------------
  //     User Management
  // -----------------------

  async getUsers(options: RequestOptionsNoBody = {}): Promise<User[]> {
    const response = await this.request.get("/api/v2/users", { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async getUser(uuid: string, options: RequestOptionsNoBody = {}): Promise<User> {
    const response = await this.request.get(`/api/v2/users/${uuid}`, { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async createUser(payload: object, options: RequestOptionsWithBody = {}): Promise<User> {
    const response = await this.request.post("/api/v2/users", { data: payload, failOnStatusCode: true, ...options });
    return await response.json();
  }

  async updateUser(uuid: string, payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.put(`/api/v2/users/${uuid}`, { data: payload, failOnStatusCode: true, ...options });
  }

  async deleteUser(uuid: string, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.delete(`/api/v2/users/${uuid}`, { failOnStatusCode: true, ...options });
  }

  // -----------------------
  //         Roles
  // -----------------------

  async getRoles(options: RequestOptionsNoBody = {}): Promise<Role[]> {
    const response = await this.request.get("/api/v1/authorization/roles", { failOnStatusCode: true, ...options });
    return await response.json();
  }

  async getRole(uuid: string, options: RequestOptionsNoBody = {}): Promise<Role> {
    const response = await this.request.get(`/api/v1/authorization/roles${uuid}`, {
      failOnStatusCode: true,
      ...options,
    });
    return await response.json();
  }

  async createRole(payload: object, options: RequestOptionsWithBody = {}): Promise<Role> {
    const response = await this.request.post("/api/v1/authorization/roles", {
      data: payload,
      failOnStatusCode: true,
      ...options,
    });
    return await response.json();
  }

  async updateRole(uuid: string, payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.put(`/api/v1/authorization/roles/${uuid}`, {
      data: payload,
      failOnStatusCode: true,
      ...options,
    });
  }

  async deleteRole(uuid: string, options: RequestOptionsWithBody = {}): Promise<APIResponse> {
    return await this.request.delete(`/api/v1/authorization/roles/${uuid}`, { failOnStatusCode: true, ...options });
  }
}

type TimeseriesQuery = RelativeTimeseriesQuery | AbsoluteTimeseriesQuery;

interface RelativeTimeseriesQuery extends BaseTimeseriesQuery {
  start_relative: RelativeRange;
  end_relative?: RelativeRange;
}

interface AbsoluteTimeseriesQuery extends BaseTimeseriesQuery {
  start_absolute: number;
  end_absolute?: number;
}

interface BaseTimeseriesQuery {
  metrics: {
    name: string;
    limit?: number;
  }[];
}

interface RelativeRange {
  value: string;
  unit: "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds";
}
