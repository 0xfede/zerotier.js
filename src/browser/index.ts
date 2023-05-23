import { ZeroTierAPI, ZeroTierAPIOptions } from "../base/api.js";
import { ZeroTierClient as ZeroTierClientBase } from "../base/client.js";
import { ZeroTierController as ZeroTierControllerBase } from "../base/controller.js";
import { BrowserHTTPClient } from "./http.js";

export * from "../base/api.js";
export * from "../base/rules.js";
export * from "../base/types.js";
export * from "./http.js";

export class ZeroTierClient extends ZeroTierClientBase<ZeroTierAPI> {
  constructor(opts?: Partial<ZeroTierAPIOptions>);
  constructor(api?: ZeroTierAPI);
  constructor(optsOrAPI?: Partial<ZeroTierAPIOptions> | ZeroTierAPI) {
    super(optsOrAPI instanceof ZeroTierAPI ? optsOrAPI : new ZeroTierAPI({ ...optsOrAPI, httpClient: new BrowserHTTPClient() }));
  }
}

export class ZeroTierController extends ZeroTierControllerBase<ZeroTierAPI> {
  constructor(opts?: Partial<ZeroTierAPIOptions>);
  constructor(api?: ZeroTierAPI);
  constructor(optsOrAPI?: Partial<ZeroTierAPIOptions> | ZeroTierAPI) {
    super(optsOrAPI instanceof ZeroTierAPI ? optsOrAPI : new ZeroTierAPI({ ...optsOrAPI, httpClient: new BrowserHTTPClient() }));
  }
}
