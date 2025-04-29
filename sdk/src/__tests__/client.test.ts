import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import { OpenMSCPClient } from "../core";

// Mock the Program class from Anchor
jest.mock("@project-serum/anchor", () => {
  const originalModule = jest.requireActual("@project-serum/anchor");
  return {
    ...originalModule,
    Program: jest.fn().mockImplementation(() => ({
      methods: {
        createProfile: () => ({
          accounts: () => ({
            rpc: () => "mock-tx-signature",
          }),
        }),
        updateProfile: () => ({
          accounts: () => ({
            rpc: () => "mock-tx-signature",
          }),
        }),
        createPost: () => ({
          accounts: () => ({
            rpc: () => "mock-tx-signature",
          }),
        }),
        sendMessage: () => ({
          accounts: () => ({
            rpc: () => "mock-tx-signature",
          }),
        }),
      },
      account: {
        profile: {
          fetch: () => ({
            owner: Keypair.generate().publicKey,
            username: "testuser",
            bio: "Test bio",
            profilePicture: "ipfs://test",
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
          }),
        },
        message: {
          all: () => [],
        },
      },
    })),
  };
});

describe("OpenMSCPClient", () => {
  let connection: Connection;
  let wallet: Wallet;
  let client: OpenMSCPClient;
  const programId = new PublicKey(
    "9CuK5BsFiUEF781iSYSJt1BP2xJxDLH2DrVvfoZKJAtj"
  );

  beforeAll(() => {
    connection = new Connection("https://api.devnet.solana.com");
    const keypair = Keypair.generate();
    wallet = new Wallet(keypair);
    client = new OpenMSCPClient(connection, wallet, programId);
  });

  it("should initialize client", () => {
    expect(client).toBeInstanceOf(OpenMSCPClient);
  });

  it("should create a profile", async () => {
    const tx = await client.createProfile({
      username: "testuser",
      bio: "Test bio",
      profilePicture: "ipfs://test",
    });
    expect(tx).toBe("mock-tx-signature");
  });

  it("should get a profile", async () => {
    const profile = await client.getProfile(wallet.publicKey);
    expect(profile).toBeDefined();
    if (profile) {
      expect(profile.username).toBe("testuser");
      expect(profile.bio).toBe("Test bio");
    }
  });

  it("should create a post", async () => {
    const tx = await client.createPost("Test post content");
    expect(tx).toBe("mock-tx-signature");
  });

  it("should get messages", async () => {
    const messages = await client.getMessages();
    expect(Array.isArray(messages)).toBe(true);
  });
});
