# OpenMSCP - Decentralized Solana Social Network

A decentralized social network built on Solana blockchain that enables users to create profiles, post content, and send private encrypted messages in a fully on-chain manner.

Devnet Program ID: 7g9KYVp9QseDpRy8RRVKTR3zQ33ca4iHuDZNqoRihoWA

## Project Structure

This project consists of two main components:

1. **Solana Program** (built with Anchor framework) - The on-chain program responsible for profile management, posting, and messaging.
2. **JavaScript/TypeScript SDK** - A comprehensive SDK that allows developers to build frontends to interact with the on-chain program.

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
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd openmscp
   ```

2. Build the Solana program:

   ```bash
   cd mscp-social
   yarn install
   anchor build --arch sbf
   ```

3. Deploy to localnet for testing:

   ```bash
   anchor deploy --arch sbf
   ```

4. Build the SDK:
   ```bash
   cd ../sdk
   yarn install
   yarn build
   ```

## Running Tests

### Program Tests

```bash
cd mscp-social
anchor test --arch sbf
```

### SDK Tests

```bash
cd sdk
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

The project follows a two-layer architecture:

1. **On-chain Layer**: Anchor program with account structures for:

   - Profile management
   - Post metadata (content stored via Memo Program)
   - Private encrypted messaging

2. **SDK Layer**: TypeScript SDK with modules for:
   - Core blockchain interaction
   - Profile management
   - Post creation and retrieval
   - Messaging with encryption utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
