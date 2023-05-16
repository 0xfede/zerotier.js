import { HTTPClient } from "../base/http.js";

export class BrowserHTTPClient extends HTTPClient {
  async invoke<T>(method: string, url: string, headers: any, body?: any): Promise<T> {
    const opts: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    }
    const response = await fetch(url, opts);
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } else {
      return response.json() as Promise<T>;
    }
  }
}