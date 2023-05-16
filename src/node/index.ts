import { ZeroTierClient as ZeroTierClientBase } from "../base/client.js";
import { ZeroTierController as ZeroTierControllerBase } from "../base/controller.js";
import { NodeZeroTierAPI, NodeZeroTierAPIOptions } from "./api.js";

export * from "../base/rules.js";
export * from "../base/types.js";
export * from "./api.js";

export class ZeroTierClient extends ZeroTierClientBase<NodeZeroTierAPI> {
  constructor(opts?: NodeZeroTierAPIOptions);
  constructor(api?: NodeZeroTierAPI);
  constructor(optsOrAPI?: NodeZeroTierAPIOptions | NodeZeroTierAPI) {
    super(optsOrAPI instanceof NodeZeroTierAPI ? optsOrAPI : new NodeZeroTierAPI(optsOrAPI));
  }
}

export class ZeroTierController extends ZeroTierControllerBase<NodeZeroTierAPI> {
  constructor(opts?: NodeZeroTierAPIOptions);
  constructor(api?: NodeZeroTierAPI);
  constructor(optsOrAPI?: NodeZeroTierAPIOptions | NodeZeroTierAPI) {
    super(optsOrAPI instanceof NodeZeroTierAPI ? optsOrAPI : new NodeZeroTierAPI(optsOrAPI));
  }
}
