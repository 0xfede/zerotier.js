import { HTTPClient } from './http.js';

export interface ZeroTierAPIOptions {
  baseUrl?: string;
  secret?: string;
  httpClient: HTTPClient;
}

export class ZeroTierAPI {
  protected secret?: Promise<string>;

  constructor(protected opts: ZeroTierAPIOptions) {
    if (!opts.baseUrl) {
      opts.baseUrl = 'http://localhost:9993';
    }
    if (opts.secret) {
      this.secret = Promise.resolve(opts.secret);
    }
  }

  protected async getRequestHeaders(method: string, path: string, body?: any): Promise<any> {
    const headers: any = {};
    headers['X-ZT1-Auth'] = await this.secret;
    if (body) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  async invoke<T>(method: string, path: string, body?: any): Promise<T> {
    return this.opts.httpClient!.invoke<T>(method, `${this.opts.baseUrl!}${path}`, await this.getRequestHeaders(method, path, body), body);
  }
}
