import { expect } from "chai";
import { ZeroTierClient, ZeroTierController } from "./index.js";

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

  it("should update a network in the controller", async () => {
    const controller = new ZeroTierController();
    const controllerNetwork = await controller.updateNetwork(testNetworkId, { name: "test_network" });
    expect(controllerNetwork).to.be.an("object");
    expect(controllerNetwork.id).to.be.equal(testNetworkId);
    expect(controllerNetwork.name).to.be.equal("test_network");
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
