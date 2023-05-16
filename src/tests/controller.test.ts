import { expect } from "chai";
import fetch from "node-fetch";
import { ZeroTierController as BrowserZeroTierController } from "../browser/index.js";
import { NodeZeroTierAPI as ZeroTierAPI } from "../node/api.js";
import { ZeroTierClient, ZeroTierController } from "../node/index.js";

describe("ZeroTierController", () => {

  let address: string;
  let testNetworkId: string;

  before(async () => {
    const client = new ZeroTierClient();
    const controller = new ZeroTierController();
    const status = await client.getStatus();
    address = status.address;
    testNetworkId = address + "fedefe";
    const networks = await controller.getNetworks();
    if (networks.includes(testNetworkId)) {
      await controller.deleteNetwork(testNetworkId);
    }
  });

  after(async () => {
    const controller = new ZeroTierController();
    const networks = await controller.getNetworks();
    if (networks.includes(testNetworkId)) {
      await controller.deleteNetwork(testNetworkId);
    }
  });

  afterEach(async () => {
    global.window = undefined as any;
    global.fetch = undefined as any;
  });

  it('should accept an api instance in the constructor', async () => {
    const api = new ZeroTierAPI();
    const client = new ZeroTierController(api);
    expect(client).to.be.an("object");
    expect((client as any).api).to.equal(api);
  });
  
  it("should create a network in the controller", async () => {
    const controller = new ZeroTierController();
    const controllerNetwork = await controller.createNetwork(testNetworkId);
    expect(controllerNetwork).to.be.an("object");
    expect(controllerNetwork.id).to.be.equal(testNetworkId);
    const networks = await controller.getNetworks();
    expect(networks).to.include(testNetworkId);
  });

  it("should return a network from the controller", async () => {
    const controller = new ZeroTierController();
    const controllerNetwork = await controller.getNetwork(testNetworkId);
    expect(controllerNetwork).to.be.an("object");
    expect(controllerNetwork.id).to.be.equal(testNetworkId);
  });

  it("should update a network in the controller (node version)", async () => {
    const controller = new ZeroTierController();
    const controllerNetwork = await controller.updateNetwork(testNetworkId, { name: "test_network_node" });
    expect(controllerNetwork).to.be.an("object");
    expect(controllerNetwork.id).to.be.equal(testNetworkId);
    expect(controllerNetwork.name).to.be.equal("test_network_node");
  });

  it("should update a network in the controller (browser version 1)", async () => {
    global.window = {} as any;
    global.fetch = fetch as any;
    const controller = new BrowserZeroTierController();
    const controllerNetwork = await controller.updateNetwork(testNetworkId, { name: "test_network_browser" });
    expect(controllerNetwork).to.be.an("object");
    expect(controllerNetwork.id).to.be.equal(testNetworkId);
    expect(controllerNetwork.name).to.be.equal("test_network_browser");
  });

  it("should update a network in the controller (browser version 2)", async () => {
    global.window = {} as any;
    global.fetch = fetch as any;
    const controller = new BrowserZeroTierController(new ZeroTierAPI());
    const controllerNetwork = await controller.updateNetwork(testNetworkId, { name: "test_network_browser" });
    expect(controllerNetwork).to.be.an("object");
    expect(controllerNetwork.id).to.be.equal(testNetworkId);
    expect(controllerNetwork.name).to.be.equal("test_network_browser");
  });

  it("should delete a network from the controller", async () => {
    const controller = new ZeroTierController();
    const controllerNetwork = await controller.deleteNetwork(testNetworkId);
    expect(controllerNetwork).to.be.an("object");
    expect(controllerNetwork.id).to.be.equal(testNetworkId);
    const networks = await controller.getNetworks();
    expect(networks).to.not.include(testNetworkId);
  });

});
