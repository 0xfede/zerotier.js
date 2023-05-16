import { ZeroTierAPI } from "./api.js";
import { ZeroTier } from "./types.js";

export class ZeroTierController<API extends ZeroTierAPI> {
  constructor(protected api: API) {
  }

  public getNetworks(): Promise<string[]> {
    return this.api.invoke<string[]>("get", "/controller/network");
  }

  public getNetwork(id: string): Promise<ZeroTier.Controller.Network> {
    return this.api.invoke<ZeroTier.Controller.Network>("get", `/controller/network/${id}`);
  }

  public createNetwork(id: string, data: Partial<ZeroTier.Controller.Network> = {}): Promise<ZeroTier.Controller.Network> {
    return this.api.invoke<ZeroTier.Controller.Network>("post", `/controller/network/${id}`, data);
  }

  public updateNetwork(id: string, data: Partial<ZeroTier.Controller.Network> = {}): Promise<ZeroTier.Controller.Network> {
    return this.api.invoke<ZeroTier.Controller.Network>("post", `/controller/network/${id}`, data);
  }

  public deleteNetwork(id: string): Promise<ZeroTier.Controller.Network> {
    return this.api.invoke<ZeroTier.Controller.Network>("delete", `/controller/network/${id}`, {});
  }

  public getMembers(id: string): Promise<{ [address: string]: number }> {
    return this.api.invoke<{ [address: string]: number }>("get", `/controller/network/${id}/member`);
  }

  public getMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member> {
    return this.api.invoke<ZeroTier.Controller.Member>("get", `/controller/network/${id}/member/${memberId}`);
  }

  public authorizeMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member> {
    return this.api.invoke<ZeroTier.Controller.Member>("post", `/controller/network/${id}/member/${memberId}`, { authorized: true });
  }

  public deauthorizeMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member> {
    return this.api.invoke<ZeroTier.Controller.Member>("post", `/controller/network/${id}/member/${memberId}`, { authorized: false });
  }

  public deleteMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member> {
    return this.api.invoke<ZeroTier.Controller.Member>("delete", `/controller/network/${id}/member/${memberId}`, {});
  }
}

