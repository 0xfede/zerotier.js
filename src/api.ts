import { readFile } from "fs/promises";
import { OutgoingHttpHeaders } from 'http';
import needle, { NeedleHttpVerbs, NeedleOptions, NeedleResponse } from "needle";

export interface ZeroTierAPIOptions {
  baseUrl?: string;
  credentialsPath?: string;
}

export class ZeroTierAPI {
  protected secret?: Promise<string>;

  constructor(protected opts: ZeroTierAPIOptions = {}) {
    if (!opts.baseUrl) {
      opts.baseUrl = "http://localhost:9993";
    }
    if (!opts.credentialsPath) {
      if (process.platform === "win32") {
        opts.credentialsPath = "C:\\ProgramData\\ZeroTier\\One\\authtoken.secret";
      } else if (process.platform === "linux") {
        opts.credentialsPath = "/var/lib/zerotier-one/authtoken.secret";
      } else if (process.platform === "darwin") {
        opts.credentialsPath = "/Library/Application Support/ZeroTier/One/authtoken.secret";
      } else {
        throw new Error("Unsupported platform");
      }
    }
    if (process.env.ZT_SECRET) {
      this.secret = Promise.resolve(process.env.ZT_SECRET);
    } else {
      this.secret = readFile(opts.credentialsPath, "utf8");
    }
  }

  protected async getRequestHeaders(method: NeedleHttpVerbs, path: string, body?: any): Promise<OutgoingHttpHeaders> {
    const headers: OutgoingHttpHeaders = {};
    headers["X-ZT1-Auth"] = await this.secret;
    if (body) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  async invoke<T>(method: NeedleHttpVerbs, path: string, body?: any): Promise<T> {
    const opts: NeedleOptions = {
      headers: await this.getRequestHeaders(method, path, body),
      json: true
    }
    let response: NeedleResponse;
    if (body) {
      response = await needle(method, `${this.opts.baseUrl!}${path}`, body, opts);
    } else {
      response = await needle(method, `${this.opts.baseUrl!}${path}`, opts);
    }
    if (response.statusCode !== 200) {
      throw new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`);
    } else {
      return response.body as T;
    }
  }
}
