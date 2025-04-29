# OpenMSCP SDK

A TypeScript SDK for interacting with the OpenMSCP Solana social network program.

## Installation

```bash
npm install openmscp-sdk
# or
yarn add openmscp-sdk
```

## Usage

```typescript
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import { OpenMSCPClient } from "openmscp-sdk";

// Initialize connection to devnet
const connection = new Connection("https://api.devnet.solana.com");

// Load or create a wallet
const keypair = Keypair.generate();
const wallet = new Wallet(keypair);

// Program ID from deployment
const programId = new PublicKey("7g9KYVp9QseDpRy8RRVKTR3zQ33ca4iHuDZNqoRihoWA");

// Initialize client
const client = new OpenMSCPClient(connection, wallet, programId);

// Create a profile
const createProfileTx = await client.createProfile({
  username: "testuser",
  bio: "Hello, OpenMSCP!",
  profilePicture: "ipfs://QmHash...",
});

// Create a post
const createPostTx = await client.createPost("My first post on OpenMSCP!");

// Get profile
const profile = await client.getProfile(keypair.publicKey);
```

## API Reference

### OpenMSCPClient

The main client class for interacting with the OpenMSCP program.

#### Constructor

```typescript
constructor(connection: Connection, wallet: Wallet, programId: PublicKey)
```

#### Methods

- `createProfile(params: CreateProfileParams): Promise<string>`
- `updateProfile(params: UpdateProfileParams): Promise<string>`
- `createPost(content: string): Promise<string>`
- `sendMessage(params: SendMessageParams): Promise<string>`
- `getProfile(publicKey: PublicKey): Promise<Profile | null>`
- `getMessages(): Promise<Message[]>`

### Types

#### CreateProfileParams

```typescript
interface CreateProfileParams {
  username: string;
  bio: string;
  profilePicture: string;
}
```

#### UpdateProfileParams

```typescript
interface UpdateProfileParams {
  bio?: string;
  profilePicture?: string;
}
```

#### SendMessageParams

```typescript
interface SendMessageParams {
  recipient: PublicKey;
  content: string;
}
```

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

### Building

```bash
yarn build
```

### Testing

```bash
yarn test
```

### Linting

```bash
yarn lint
```

## License

MIT
