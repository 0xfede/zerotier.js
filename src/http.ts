import needle, { NeedleHttpVerbs, NeedleOptions, NeedleResponse } from "needle";

export abstract class HTTPClient {
  public abstract invoke<T>(method: string, url: string, headers: any, data?: any): Promise<T>;
}

export class NodeHTTPClient {
  async invoke<T>(method: string, url: string, headers: any, body?: any): Promise<T> {
    const opts: NeedleOptions = {
      headers,
      json: true
    }
    let response: NeedleResponse;
    if (body) {
      response = await needle(method as NeedleHttpVerbs, url, body, opts);
    } else {
      response = await needle(method as NeedleHttpVerbs, url, opts);
    }
    if (response.statusCode !== 200) {
      throw new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`);
    } else {
      return response.body as T;
    }
  }
}

export class BrowserHTTPClient {
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