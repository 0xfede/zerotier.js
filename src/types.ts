export namespace ZeroTier {
  // Typescript interfaces for https://docs.zerotier.com/service/v1

  export interface Config {
    settings: {
      allowTcpFallbackRelay: boolean;
      forceTcpRelay: boolean;
      primaryPort: number;
      secondaryPort: number;
      tertiaryPort: number;
      listeningOn: string[];
      portMappingEnabled: boolean;
      softwareUpdate: string;
      softwareUpdateChannel: string;
      surfaceAddresses: string[];
    }
  }

  export interface Status {
    address: string;
    publicIdentity: string;
    online: boolean;
    tcpFallbackActive: boolean;
    versionMajor: number;
    versionMinor: number;
    versionRev: number;
    versionBuild: number;
    version: string;
    customVersion?: string;
    clock: number;
    config: Config;
    planetWorldId: number;
    planetWorldTimestamp: number;
  }

  export interface Network {
    id: string;
    nwid: string;
    name: string;
    status: 'OK' | 'ACCESS_DENIED' | 'REQUESTING_CONFIGURATION' | 'NOT_FOUND' | 'PORT_ERROR' | 'CLIENT_TOO_OLD' | 'AUTHENTICATION_REQUIRED';
    type: 'PRIVATE' | 'PUBLIC';
    mac: string;
    mtu: number;
    dhcp: boolean;
    bridge: boolean;
    broadcastEnabled: boolean;
    portError: number;
    portDeviceName: string;
    netconfRevision: number;

    dns: {
      domain: string;
      servers: string[];
    }

    routes: {
      flags: number;
      metric: number;
      target: string;
      via: string;
    }[];

    allowDNS: boolean;
    allowManaged: boolean;
    allowDefault: boolean;
    allowGlobal: boolean;

    assignedAddresses: string[];
    multicastSubscriptions: {
      adi: number;
      mac: string;
    }[];

    authenticationURL: string;
    authenticationExpiryTime: number;
    ssoEnabled: boolean;
  }

  export interface Moon {
    id: string;
    timestamp: number;
    signature: string;
    updatesMustBeSignedBy: string;
    roots: {
      identity: string;
      stableEndpoints: string[];
    }[];
    waiting: boolean;
  }

  export interface Peer {
    address: string;
    versionMajor: number;
    versionMinor: number;
    versionRev: number;
    version: string;
    latency: number;
    role: 'LEAF' | 'MOON' | 'PLANET';
    isBonded: boolean;
    tunneled: boolean;
    paths: {
      active: boolean;
      address: string;
      expired: boolean;
      lastReceive: number;
      lastSend: number;
      localSocket: number;
      preferred: boolean;
      trustedPathId: number;
    }[];
    bondingPolicyCode?: number;
    bondingPolicyStr?: string;
    numAliveLinks?: number;
    numTotalLinks?: number;
    failoverInterval?: number;
    downDelay?: number;
    upDelay?: number;
    packetsPerLink?: number;
  }

  export namespace Controller {

    export interface Rule { // TODO check this out
      action: 'ACCEPT' | 'DROP';
      comment: string;
      disabled: boolean;
      dportEnd: number;
      dportStart: number;
      protocol: 'TCP' | 'UDP' | 'ICMP';
      sportEnd: number;
      sportStart: number;
      target: string;
    }

    export interface Network {
      id: string;
      nwid: string;
      objtype: 'network';
      name: string;
      description: string; // TODO check this out
      creationTime: number;
      private: boolean;
      enableBroadcast: boolean;
      v4AssignMode: 'none' | 'zt' | 'dhcp';
      v6AssignMode: {
        rfc4193: boolean;
        '6plane': boolean;
        zt: boolean;
      }
      mtu: number;
      multicastLimit: number;
      revision: number;
      routes: {
        target: string;
        via: string;
      }[];
      ipAssignmentPools: {
        ipRangeStart: string;
        ipRangeEnd: string;
      }[];
      rules: Rule[];
      tags: {
        id: number;
        default: number
      }[];
      capabilities: {
        id: number;
        default: boolean;
        rules: Rule[];
      }[]; // TODO
      remoteTraceTarget: string;
      remoteTraceLevel: number;
    }

    export interface Member {
      id: string;
      name: string; // TODO check this out
      description: string; // TODO check this out
      address: string;
      nwid: string;
      authorized: boolean;
      activeBridge: boolean;
      identity: string;
      ipAssignments: string[];
      revision: number;
      vMajor: number;
      vMinor: number;
      vRev: number;
      vProto: number;
      tags?: number[][];
      capabilities?: number[];
    }
  }

}