# OpenMSCP - Open Modular Social Context Protocol

A decentralized social network built on Solana blockchain that enables users to create profiles, post content, and send private encrypted messages in a fully on-chain manner. OpenMSCP provides the building blocks for decentralized social systems that users can own and control.

Devnet Program ID: 9CuK5BsFiUEF781iSYSJt1BP2xJxDLH2DrVvfoZKJAtj

## Core Features

OpenMSCP enables integration of customizable modules that adapt to the needs of any platform:

- **Modular Communication**: Build and customize social interactions with our modular memo system
- **Decentralized Profiles**: User-owned identities powered by DIDs for complete control over your data
- **Blockchain Integration**: Seamless integration with Solana and DIDs for secure, transparent operations
- **User-Owned Data**: Take control of your social data with our decentralized storage solutions

## Building the Future of Social Networks

OpenMSCP provides the foundation for a new generation of social networks that prioritize user ownership, privacy, and interoperability:

- **Decentralized Social Networks**: Build social networks that put users in control of their data and interactions
- **User-Owned Communities**: Create communities where members have true ownership and governance rights
- **Interoperable Systems**: Enable seamless communication between different social platforms and protocols

## Project Structure

This project consists of three main components:

1. **Solana Program** (`openmscp/`) - The on-chain program built with Anchor framework, responsible for profile management, posting, and messaging.
2. **JavaScript/TypeScript SDK** (`sdk/`) - A comprehensive SDK that allows developers to build frontends to interact with the on-chain program.
3. **Web UI** (`mscp-ui/`) - A modern React-based user interface for interacting with the OpenMSCP protocol.

## Features

- **Profile Management**: Create and update profiles with usernames, bios, and profile pictures (IPFS hashes)
- **On-chain Posting**: Post content via Solana Memo Program with metadata stored on-chain
- **Private Messaging**: Send and receive encrypted messages between users
- **Developer SDK**: Easy-to-use JavaScript/TypeScript SDK for building applications on top of the network

## Setup and Installation

### Prerequisites

- [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation)
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mscp-sdk
   ```

2. Build the Solana program:

   ```bash
   cd openmscp
   yarn install
   anchor build
   ```

3. Deploy to devnet for testing:

   ```bash
   anchor deploy --provider.cluster devnet
   ```

4. Build the SDK:

   ```bash
   cd ../sdk
   yarn install
   yarn build
   ```

5. Start the Web UI:
   ```bash
   cd ../mscp-ui
   yarn install
   yarn dev
   ```

## Running Tests

### Program Tests

```bash
cd openmscp
anchor test
```

### SDK Tests

```bash
cd sdk
yarn test
```

### UI Tests

```bash
cd mscp-ui
yarn test
```

## Usage

### Using the SDK

```typescript
import { OpenMSCPClient } from "openmscp-sdk";
import { Connection, Keypair } from "@solana/web3.js";

// Initialize client
const connection = new Connection("https://api.devnet.solana.com");
const wallet = Keypair.generate(); // Or use a wallet adapter
const client = new OpenMSCPClient(connection, wallet);

// Create a profile
await client.createProfile({
  username: "satoshi",
  bio: "Bitcoin creator",
  profilePicture: "ipfs://QmHash...",
});

// Create a post
await client.createPost("Hello, Solana social network!");

// Send a message
await client.sendMessage(recipientPublicKey, "This is an encrypted message");
```

## Architecture

The project follows a three-layer architecture:

1. **On-chain Layer**: Anchor program with account structures for:

   - Profile management
   - Post metadata (content stored via Memo Program)
   - Private encrypted messaging

2. **SDK Layer**: TypeScript SDK with modules for:

   - Core blockchain interaction
   - Profile management
   - Post creation and retrieval
   - Messaging with encryption utilities

3. **UI Layer**: React-based web interface with:
   - Modern, responsive design
   - Real-time updates
   - Secure wallet integration
   - User-friendly profile management
   - Seamless post creation and viewing
   - Encrypted messaging interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
