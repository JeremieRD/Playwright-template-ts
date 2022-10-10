import type { Page } from "@playwright/test";
import PageObjects from "./pages";

export type RequestOptionsWithBody = Parameters<Page["request"]["post"]>[1];
export type RequestOptionsNoBody = Parameters<Page["request"]["get"]>[1];

export interface Device {
  _id: string;
  UUID: string;
  id: number;
  tenantId: string;
  name: string;
  serialNumber: string;
  owner: string;
  createdTime: string;
  modifiedTime: string;
  heartbeatStatus?: string;
  lastSeen?: number;
  latitude?: number;
  longitude?: number;
  gpsLastSeen?: number;
  profileId?: string;
  labels?: object;
  customTags?: object;
  customAttributes?: object;
  description?: string;
}

export interface Rule {
  name: string;
  status: string;
  alertOnChange: boolean;
  tenantId: string;
  createdTime: number;
  modifiedTime: number;
  UUID: string;
  owner: string;
  _id: string;
  actions?: object[];
  elseActions?: object[];
  description?: string;
  trigger?: object;
}

export interface Twin {
  _id: string;
  name: string;
  description?: string;
  labels: object;
  digitalTwinType?: string;
  digitalTwinTypeName?: string;
  customAttributes: object;
  tenantId: string;
  deviceType: "digitalTwin";
  UUID: string;
  createdTime: number;
  modified?: number;
  owner: string;
}

export interface TwinType {
  _id: string;
  name: string;
  description: string;
  labels?: object;
  customAttributes?: object;
  tenantId: string;
  UUID: string;
  created: number;
  owner: string;
  modified: number;
}

export interface User {
  name: string;
  owner: string;
  UUID: string;
  tenantId: string;
  tenants: string[];
  creationTime: string;
  modifiedTime?: string;
  phoneNumber?: string;
  id: string;
  roles: string[];
  displayName: string;
  _id: string;
  requiresVerificationCode?: boolean;
  labels?: object;
}

export interface Role {
  name: string;
  owner: string;
  UUID: string;
  creationTime: string;
  tenantId: string;
  _id: string;
  policy?: object;
  modifiedTime?: string;
}
export interface ResponseFromTSDB {
  queries: Array<{
    sample_size: number;
    results: Array<{
      name: string;
      tags: object;
      values: Array<[number, number | string]>;
      group_by?: Array<any>;
    }>;
  }>;
}

export type PageWithPageObjects = Page & { objects: PageObjects };

export type IotPayload = IotObject | IotObject[];
export interface IotObject {
  UUID: string;
  latitude?: number;
  longitude?: number;
  name: string;
  value: number | object;
  msg_type: "datum" | "event";
  timestamp?: number;
  tags?: object;
}
