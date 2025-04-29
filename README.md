# MSCP SDK - Decentralized Solana Social Network

A decentralized social network built on Solana blockchain that enables users to create profiles, post content, and send private messages in a fully on-chain manner.

## Features

- **Profile Management**: Create and manage on-chain profiles with unique usernames
- **On-chain Posting**: Publish text posts directly to the Solana blockchain
- **Private Messaging**: Send encrypted messages to other users
- **IPFS Integration**: Store profile pictures on IPFS

## Project Structure

```
mscp-sdk/
├── programs/           # Anchor program source code
├── sdk/               # TypeScript SDK
├── tests/             # Program and SDK tests
└── ui/                # Reference UI implementation
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Rust (latest stable)
- Solana CLI tools
- Anchor CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/mscp-sdk.git
cd mscp-sdk
```

2. Install dependencies:

```bash
# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Install project dependencies
npm install
```

3. Build the program:

```bash
anchor build
```

4. Run tests:

```bash
anchor test
```

## Development

### Program Development

The Solana program is written in Rust using the Anchor framework. Key components:

- Profile management
- Post storage
- Message encryption
- Account structures

### SDK Development

The TypeScript SDK provides a simple interface to interact with the on-chain program:

```typescript
import { MSCP } from "@mscp/sdk";

const sdk = new MSCP();
await sdk.connect(); // Connect wallet

// Create profile
const profile = await sdk.createProfile({
  username: "alice",
  bio: "Web3 enthusiast",
});

// Create post
const post = await sdk.createPost("Hello, decentralized world!");

// Send message
const message = await sdk.sendMessage(recipientAddress, "Secret message");
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
