import { expect } from 'chai';
import fetch from 'node-fetch';
import { ZeroTierClient as BrowserZeroTierClient } from '../browser/index.js';
import { NodeZeroTierAPI as ZeroTierAPI } from '../node/api.js';
import { ZeroTierClient, ZeroTierController } from '../node/index.js';

describe('ZeroTierClient', () => {
  let address: string;
  let testNetworkId: string;

  before(async () => {
    const client = new ZeroTierClient();
    const controller = new ZeroTierController();
    const status = await client.getStatus();
    address = status.address;
    testNetworkId = address + 'fedefe';
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

  it('should accept an api instance in the constructor', async () => {
    const api = new ZeroTierAPI();
    const client = new ZeroTierClient(api);
    expect(client).to.be.an('object');
    expect((client as any).api).to.equal(api);
  });

  it('should return a config object', async () => {
    const client = new ZeroTierClient();
    const config = await client.getConfig();
    expect(config).to.be.an('object');
  });

  it('should return a status object', async () => {
    const client = new ZeroTierClient();
    const status = await client.getStatus();
    expect(status).to.be.an('object');
    expect(status.address).to.be.equal(address);
  });

  describe('Network', () => {
    before(async () => {
      const controller = new ZeroTierController();
      await controller.createNetwork(testNetworkId, { name: 'test_network' });
    });

    after(async () => {
      const controller = new ZeroTierController();
      const members = await controller.getMembers(testNetworkId);
      for (const member in members) {
        await controller.deleteMember(testNetworkId, member);
      }
      await controller.deleteNetwork(testNetworkId);
      const client = new ZeroTierClient();
      await client.leaveNetwork(testNetworkId);
    });

    //test joining and leaving a network
    it('should join a network and be unauthorized', async () => {
      debugger;
      const client = new ZeroTierClient();
      // check that it's not already joined
      let networks = await client.getNetworks();
      let network = networks.find((network) => network.id === testNetworkId);
      expect(network).to.be.undefined;

      network = await client.joinNetwork(testNetworkId);
      expect(network).to.be.an('object');
      expect(network.id).to.be.equal(testNetworkId);

      const status = await new Promise<string>((resolve) => {
        let count = 0;
        const interval = setInterval(async () => {
          networks = await client.getNetworks();
          network = networks.find((network) => network.id === testNetworkId);
          if (network?.status === 'ACCESS_DENIED') {
            clearInterval(interval);
            resolve(network?.status);
          }
          if (count > 10) {
            clearInterval(interval);
            resolve(network?.status || '');
          }
          count++;
        }, 500);
      });
      expect(status).to.equal('ACCESS_DENIED');

      const controller = new ZeroTierController();
      const members = await controller.getMembers(testNetworkId);
      expect(members[address]).to.be.a('number');
      const member = await controller.getMember(testNetworkId, address);
      expect(member).to.be.an('object');
      expect(member?.authorized).to.be.false;
    });

    it('should leave a network', async () => {
      const client = new ZeroTierClient();
      // check that it's already joined
      let networks = await client.getNetworks();
      let network = networks.find((network) => network.id === testNetworkId);
      expect(network).to.be.an('object');

      const result = await client.leaveNetwork(testNetworkId);
      expect(result).to.be.an('object');
      expect(result?.result).to.be.equal(true);
      networks = await client.getNetworks();
      network = networks.find((network) => network.id === testNetworkId);
      expect(network).to.be.undefined;
    });

    it('should join a network and be authorized', async () => {
      debugger;

      // authorize the member
      const controller = new ZeroTierController();
      await controller.authorizeMember(testNetworkId, address);

      // check that it's not already joined
      const client = new ZeroTierClient();
      let networks = await client.getNetworks();
      let network = networks.find((network) => network.id === testNetworkId);
      expect(network).to.be.undefined;

      network = await client.joinNetwork(testNetworkId);
      expect(network).to.be.an('object');
      expect(network.id).to.be.equal(testNetworkId);
      networks = await client.getNetworks();
      network = networks.find((network) => network.id === testNetworkId);
      expect(network).to.be.an('object');
      expect(network?.status).to.oneOf(['OK', 'REQUESTING_CONFIGURATION']);

      network = await client.getNetwork(testNetworkId);
      expect(network).to.be.an('object');
      expect(network.id).to.be.equal(testNetworkId);
      expect(network?.status).to.oneOf(['OK', 'REQUESTING_CONFIGURATION']);

      let member = await controller.getMember(testNetworkId, address);
      expect(member?.authorized).to.be.true;

      await controller.deauthorizeMember(testNetworkId, address);
      member = await controller.getMember(testNetworkId, address);
      expect(member?.authorized).to.be.false;

      /*
      await controller.deleteMember(testNetworkId, address);
      const members = await controller.getMembers(testNetworkId);
      expect(members[address]).to.be.undefined;
      */
    });
  });

  describe('Peer', () => {
    afterEach(async () => {
      global.window = undefined as any;
      global.fetch = undefined as any;
    });

    it('should return an array of peers (node version)', async () => {
      const client = new ZeroTierClient();
      const peers = await client.getPeers();
      expect(peers).to.be.an('array');
    });

    it('should return an array of peers (browser version)', async () => {
      global.window = {} as any;
      global.fetch = fetch as any;
      const client = new BrowserZeroTierClient();
      const peers = await client.getPeers();
      expect(peers).to.be.an('array');
    });

    it('should return a peer object (node version)', async () => {
      const client = new ZeroTierClient();
      const peers = await client.getPeers();
      const peer = await client.getPeer(peers[0].address);
      expect(peer).to.be.an('object');
    });

    it('should return a peer object (browser version)', async () => {
      global.window = {} as any;
      global.fetch = fetch as any;
      const client = new BrowserZeroTierClient(new ZeroTierAPI());
      const peers = await client.getPeers();
      const peer = await client.getPeer(peers[0].address);
      expect(peer).to.be.an('object');
    });
  });
});
