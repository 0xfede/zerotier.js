import { ZeroTierAPI, ZeroTierAPIOptions } from "./api.js";
import { ZeroTier } from "./types.js";

export class ZeroTierClient {
  protected api: ZeroTierAPI;

  constructor(opts?: ZeroTierAPIOptions);
  constructor(api?: ZeroTierAPI);
  constructor(optsOrAPI?: ZeroTierAPIOptions | ZeroTierAPI) {
    if (optsOrAPI instanceof ZeroTierAPI) {
      this.api = optsOrAPI;
    } else {
      this.api = new ZeroTierAPI(optsOrAPI);
    }
  }

  public getConfig(): Promise<ZeroTier.Config> {
    return this.api.invoke<ZeroTier.Config>("get", "/config");
  }

  public getStatus(): Promise<ZeroTier.Status> {
    return this.api.invoke<ZeroTier.Status>("get", "/status");
  }

  public getNetworks(): Promise<ZeroTier.Network[]> {
    return this.api.invoke<ZeroTier.Network[]>("get", "/network");
  }

  public getNetwork(id: string): Promise<ZeroTier.Network> {
    return this.api.invoke<ZeroTier.Network>("get", `/network/${id}`);
  }

  public joinNetwork(id: string): Promise<ZeroTier.Network> {
    return this.api.invoke<ZeroTier.Network>("post", `/network/${id}`, {});
  }

  public leaveNetwork(id: string): Promise<{ result: boolean }> {
    return this.api.invoke<{ result: boolean }>("delete", `/network/${id}`, {});
  }

  public getPeers(): Promise<ZeroTier.Peer[]> {
    return this.api.invoke<ZeroTier.Peer[]>("get", "/peer");
  }

  public getPeer(id: string): Promise<ZeroTier.Peer> {
    return this.api.invoke<ZeroTier.Peer>("get", `/peer/${id}`);
  }
}
