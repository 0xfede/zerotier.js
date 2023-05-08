# ZeroTier.js

A TypeScript wrapper for the ZeroTier One API, providing an easy-to-use interface for managing ZeroTier networks and clients.

## Features

- Supports ZeroTier Client and Controller functionality
- Written in TypeScript for better type safety and autocompletion
- Compatible with Node.js and browser environments
- Automatically detects the platform and sets appropriate defaults
- Supports reading credentials from a file or environment variable

## Installation

```sh
npm install zerotier.js
```

## Usage

### ZeroTier Client

```typescript
import { ZeroTierClient } from "zerotier.js";

const client = new ZeroTierClient();

client.getStatus().then((status) => {
  console.log("ZeroTier Status:", status);
});

client.getNetworks().then((networks) => {
  console.log("Networks:", networks);
});
```

### ZeroTier Controller

```typescript
import { ZeroTierController } from "zerotier.js";

const controller = new ZeroTierController();

controller.getNetworks().then((networks) => {
  console.log("Controller Networks:", networks);
});

controller.getMembers("your_network_id").then((members) => {
  console.log("Network Members:", members);
});
```

## API Reference

### ZeroTierAPI

The `ZeroTierAPI` class handles the underlying HTTP communication with the ZeroTier One API.

#### ZeroTierAPIOptions

The `ZeroTierAPIOptions` interface contains optional settings for the `ZeroTierAPI` class.

- `baseUrl`: The base URL for the ZeroTier One API. Defaults to `http://localhost:9993`.
- `credentialsPath`: The file path to the ZeroTier One API credentials. Defaults to the appropriate path based on the platform.
- `httpClient`: An optional custom `HTTPClient` instance to use for making requests. Defaults to either `BrowserHTTPClient` or `NodeHTTPClient` depending on the environment.

#### Methods

- `invoke<T>(method: string, path: string, body?: any): Promise<T>`: Makes an HTTP request to the API and returns the deserialized response body.

### ZeroTierClient

The `ZeroTierClient` class provides methods for managing ZeroTier clients.

#### Methods

- `getConfig(): Promise<ZeroTier.Config>`: Retrieves the client's configuration.
- `getStatus(): Promise<ZeroTier.Status>`: Retrieves the client's status information.
- `getNetworks(): Promise<ZeroTier.Network[]>`: Retrieves a list of networks the client is a member of.
- `getNetwork(id: string): Promise<ZeroTier.Network>`: Retrieves information about a specific network.
- `joinNetwork(id: string): Promise<ZeroTier.Network>`: Joins the client to a network.
- `leaveNetwork(id: string): Promise<{ result: boolean }>`: Removes the client from a network.
- `getPeers(): Promise<ZeroTier.Peer[]>`: Retrieves a list of peers connected to the client.
- `getPeer(id: string): Promise<ZeroTier.Peer>`: Retrieves information about a specific peer.

### ZeroTierController

The `ZeroTierController` class provides methods for managing ZeroTier networks and members.

#### Methods

- `getNetworks(): Promise<string[]>`: Retrieves a list of network IDs managed by the controller.
- `getNetwork(id: string): Promise<ZeroTier.Controller.Network>`: Retrieves information about a specific network.
- `createNetwork(id: string, data: Partial<ZeroTier.Controller.Network>): Promise<ZeroTier.Controller.Network>`: Creates a new network with the provided data.
- `updateNetwork(id: string, data: Partial<ZeroTier.Controller.Network>): Promise<ZeroTier.Controller.Network>`: Updates an existing network with the provided data.
- `deleteNetwork(id: string): Promise<ZeroTier.Controller.Network>`: Deletes a network.
- `getMembers(id: string): Promise<{ [address: string]: number }>`: Retrieves a list of members for a specific network.
- `getMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member>`: Retrieves information about a specific member.
- `authorizeMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member>`: Authorizes a member to access a network.
- `deauthorizeMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member>`: Deauthorizes a member from accessing a network.
- `deleteMember(id: string, memberId: string): Promise<ZeroTier.Controller.Member>`: Removes a member from a network.


Please refer to the [ZeroTier API documentation](https://docs.zerotier.com/service/v1) for more information on the available methods and data structures.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue to report bugs, suggest improvements, or request new features.

## License

This project is licensed under the MIT License.