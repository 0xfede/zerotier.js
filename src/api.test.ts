import { expect } from 'chai';
import { unlink, writeFile } from 'fs/promises';
import fetch from "node-fetch";
import os from 'os';
import { ZeroTierAPI } from './api.js';

describe('ZeroTierAPI', () => {
  describe('Constructor', () => {

    it('should failed to construct if the os is not recognized', async () => {
      const platform = process.platform;
      try {
        Object.defineProperty(process, 'platform', { value: 'unknown' });
        expect(() => new ZeroTierAPI()).to.throw('Unsupported platform');
      } finally {
        Object.defineProperty(process, 'platform', { value: platform });
      }
    });

    it('should select the correct credentials path for Windows', async () => {
      const platform = process.platform;
      try {
        Object.defineProperty(process, 'platform', { value: 'win32' });
        const api = new ZeroTierAPI();
        expect((api as any).opts.credentialsPath).to.equal('C:\\ProgramData\\ZeroTier\\One\\authtoken.secret');
      } finally {
        Object.defineProperty(process, 'platform', { value: platform });
      }
    });

    it('should select the correct credentials path for Linux', async () => {
      const platform = process.platform;
      try {
        Object.defineProperty(process, 'platform', { value: 'linux' });
        const api = new ZeroTierAPI();
        expect((api as any).opts.credentialsPath).to.equal('/var/lib/zerotier-one/authtoken.secret');
      } finally {
        Object.defineProperty(process, 'platform', { value: platform });
      }
    });

    it('should select the correct credentials path for macOS', async () => {
      const platform = process.platform;
      try {
        Object.defineProperty(process, 'platform', { value: 'darwin' });
        const api = new ZeroTierAPI();
        expect((api as any).opts.credentialsPath).to.equal('/Library/Application Support/ZeroTier/One/authtoken.secret');
      } finally {
        Object.defineProperty(process, 'platform', { value: platform });
      }
    });

  });

  describe('Authentication', () => {
    let secret: string | undefined;

    before(async () => {
      secret = process.env.ZT_SECRET;
      delete process.env.ZT_SECRET;
    });

    after(async () => {
      if (secret) {
        process.env.ZT_SECRET = secret;
      }
    });

    afterEach(async () => {
      global.window = undefined as any;
      global.fetch = undefined as any;
    });
  
    it('should fail to invoke a method without valid credentials file', async () => {
      const api = new ZeroTierAPI({ credentialsPath: 'test/invalid.secret' });
      try {
        await api.invoke('get', '/status');
        throw new Error('Expected an error');
      } catch (err: any) {
        expect(err.message).to.match(/ENOENT: no such file or directory/);
      }
    });

    it('should fail to invoke a method without valid credentials (node version)', async () => {
      // generate a random secret as a 24 character hex string
      const secret = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      // store the secret in a temporary file in the os temp directory
      const credentialsPath = `${os.tmpdir()}/authtoken.secret`;
      await writeFile(credentialsPath, secret, 'utf8');
      const api = new ZeroTierAPI({ credentialsPath });
      try {
        await api.invoke('get', '/status');
        throw new Error('Expected an error');
      } catch (err: any) {
        expect(err.message).to.match(/HTTP 401: Unauthorized/);
      } finally {
        // unlink the file
        await unlink(credentialsPath);
      }
    });

    it('should fail to invoke a method without valid credentials (browser version)', async () => {
      global.window = {} as any;
      global.fetch = fetch as any;
        // generate a random secret as a 24 character hex string
      const secret = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      // store the secret in a temporary file in the os temp directory
      const credentialsPath = `${os.tmpdir()}/authtoken.secret`;
      await writeFile(credentialsPath, secret, 'utf8');
      const api = new ZeroTierAPI({ credentialsPath });
      try {
        await api.invoke('get', '/status');
        throw new Error('Expected an error');
      } catch (err: any) {
        expect(err.message).to.match(/HTTP 401: Unauthorized/);
      } finally {
        // unlink the file
        await unlink(credentialsPath);
      }
    });

    it('should accept the secret in the options', async () => {
      const api = new ZeroTierAPI({ secret });
      const status = await api.invoke('get', '/status');
      expect(status).to.have.property('address');
    });

  });
  
});
