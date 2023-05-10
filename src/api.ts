import { readFile } from 'fs/promises';
import { BrowserHTTPClient, HTTPClient, NodeHTTPClient } from './http.js';

export interface ZeroTierAPIOptions {
  baseUrl?: string;
  secret?: string;
  credentialsPath?: string;
  httpClient?: HTTPClient;
}

export class ZeroTierAPI {
  protected secret?: Promise<string>;

  constructor(protected opts: ZeroTierAPIOptions = {}) {
    if (!opts.baseUrl) {
      opts.baseUrl = 'http://localhost:9993';
    }
    if (opts.secret) {
      this.secret = Promise.resolve(opts.secret);
    } else {
      if (!opts.credentialsPath) {
        if (process.platform === 'win32') {
          opts.credentialsPath = 'C:\\ProgramData\\ZeroTier\\One\\authtoken.secret';
        } else if (process.platform === 'linux') {
          opts.credentialsPath = '/var/lib/zerotier-one/authtoken.secret';
        } else if (process.platform === 'darwin') {
          opts.credentialsPath = '/Library/Application Support/ZeroTier/One/authtoken.secret';
        } else {
          throw new Error('Unsupported platform');
        }
      }
      if (process.env.ZT_SECRET) {
        this.secret = Promise.resolve(process.env.ZT_SECRET);
      } else {
        this.secret = readFile(opts.credentialsPath, 'utf8');
      }
    }
    if (!opts.httpClient) {
      if (typeof window !== 'undefined') {
        opts.httpClient = new BrowserHTTPClient();
      } else {
        opts.httpClient = new NodeHTTPClient();
      }
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
