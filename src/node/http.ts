import needle, { NeedleHttpVerbs, NeedleOptions, NeedleResponse } from "needle";
import { HTTPClient } from "../base/http.js";

export class NodeHTTPClient extends HTTPClient {
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
