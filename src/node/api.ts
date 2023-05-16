import { readFile } from 'fs/promises';
import { ZeroTierAPI } from '../base/api.js';
import { NodeHTTPClient } from './http.js';

export interface NodeZeroTierAPIOptions {
  baseUrl?: string;
  secret?: string;
  credentialsPath?: string;
  httpClient?: NodeHTTPClient;
}

export class NodeZeroTierAPI extends ZeroTierAPI{
  constructor(protected nodeOpts: NodeZeroTierAPIOptions = {}) {
    super({ ...nodeOpts, httpClient: nodeOpts.httpClient || new NodeHTTPClient() });
    if (nodeOpts.secret) {
      this.secret = Promise.resolve(nodeOpts.secret);
    } else {
      if (!nodeOpts.credentialsPath) {
        if (process.platform === 'win32') {
          nodeOpts.credentialsPath = 'C:\\ProgramData\\ZeroTier\\One\\authtoken.secret';
        } else if (process.platform === 'linux') {
          nodeOpts.credentialsPath = '/var/lib/zerotier-one/authtoken.secret';
        } else if (process.platform === 'darwin') {
          nodeOpts.credentialsPath = '/Library/Application Support/ZeroTier/One/authtoken.secret';
        } else {
          throw new Error('Unsupported platform');
        }
      }
      if (process.env.ZT_SECRET) {
        this.secret = Promise.resolve(process.env.ZT_SECRET);
      } else {
        this.secret = readFile(nodeOpts.credentialsPath, 'utf8');
      }
    }
  }
}
