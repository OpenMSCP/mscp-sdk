import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Wallet, AnchorProvider } from "@project-serum/anchor";
import { OpenMSCPClient } from "../core";
import { PostService } from "../post";

// Mock the Program class from Anchor
jest.mock("@project-serum/anchor", () => {
  const originalModule = jest.requireActual("@project-serum/anchor");
  return {
    ...originalModule,
    Program: jest.fn().mockImplementation(() => ({
      methods: {
        createPost: () => ({
          accounts: () => ({
            instruction: () => ({
              keys: [],
              programId: new PublicKey(
                "9CuK5BsFiUEF781iSYSJt1BP2xJxDLH2DrVvfoZKJAtj"
              ),
              data: Buffer.from([]),
            }),
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
            postCount: 1,
          }),
        },
        post: {
          fetch: () => ({
            author: Keypair.generate().publicKey,
            timestamp: new Date().getTime(),
            memoAccount: new PublicKey(
              "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
            ),
          }),
          all: () => [
            {
              account: {
                author: Keypair.generate().publicKey,
                timestamp: new Date().getTime(),
                memoAccount: new PublicKey(
                  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
                ),
              },
            },
          ],
        },
      },
    })),
    AnchorProvider: jest.fn().mockImplementation(() => ({
      sendAndConfirm: jest.fn().mockResolvedValue("mock-tx-signature"),
      wallet: {
        publicKey: Keypair.generate().publicKey,
      },
    })),
  };
});

describe("PostService", () => {
  let connection: Connection;
  let wallet: Wallet;
  let client: OpenMSCPClient;
  let postService: PostService;
  const programId = new PublicKey(
    "9CuK5BsFiUEF781iSYSJt1BP2xJxDLH2DrVvfoZKJAtj"
  );

  beforeAll(() => {
    connection = new Connection("https://api.devnet.solana.com");
    const keypair = Keypair.generate();
    wallet = new Wallet(keypair);
    client = new OpenMSCPClient(connection, wallet, programId);
    postService = client.post;
  });

  it("should create a post", async () => {
    const content = "Test post content";
    const tx = await postService.createPost(content);
    expect(tx).toBe("mock-tx-signature");
  });

  it("should get posts by profile", async () => {
    const posts = await postService.getPostsByProfile(wallet.publicKey);
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty("author");
    expect(posts[0]).toHaveProperty("timestamp");
    expect(posts[0]).toHaveProperty("memoAccount");
  });

  it("should get a post by ID", async () => {
    const post = await postService.getPostById(wallet.publicKey, 0);
    expect(post).toBeDefined();
    expect(post).toHaveProperty("author");
    expect(post).toHaveProperty("timestamp");
    expect(post).toHaveProperty("memoAccount");
  });
});
