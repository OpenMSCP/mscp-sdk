import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { Post } from "../types";

// Solana Memo Program ID
const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export class PostService {
  private program: Program;
  private provider: AnchorProvider;
  private programId: PublicKey;

  constructor(
    program: Program,
    provider: AnchorProvider,
    programId: PublicKey
  ) {
    this.program = program;
    this.provider = provider;
    this.programId = programId;
  }

  /**
   * Create a new post
   * @param content The post content
   * @returns The transaction signature
   */
  async createPost(content: string): Promise<string> {
    // Get the user's profile to access the post count
    const [profilePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), this.provider.wallet.publicKey.toBuffer()],
      this.programId
    );

    // Fetch the profile to get the current post count
    const profileAccount = await this.program.account.profile.fetch(profilePDA);
    const postCount = profileAccount.postCount;

    // Derive post PDA using post count
    const [postPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("post"),
        this.provider.wallet.publicKey.toBuffer(),
        Buffer.from([postCount]),
      ],
      this.programId
    );

    // Create a memo account for storing the post content
    const memoAccount = this.provider.wallet.publicKey; // We'll use the user's wallet as a reference (memo doesn't need a separate account)

    // Get current timestamp for the post
    const timestamp = Math.floor(Date.now() / 1000);

    // Create the post data in the expected JSON format
    const postData = JSON.stringify({
      type: "post",
      author: this.provider.wallet.publicKey.toString(),
      ts: timestamp,
      content: content,
    });

    // Create the transaction
    const tx = new Transaction();

    // Add the create post instruction
    tx.add(
      await this.program.methods
        .createPost(content)
        .accounts({
          post: postPDA,
          user: this.provider.wallet.publicKey,
          profile: profilePDA,
          memoAccount: memoAccount,
          instructionsSysvar: new PublicKey(
            "Sysvar1nstructions1111111111111111111111111"
          ),
          systemProgram: new PublicKey("11111111111111111111111111111111"),
        })
        .instruction()
    );

    // Add the memo program instruction
    tx.add(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(postData),
      })
    );

    // Send and confirm the transaction
    return await this.provider.sendAndConfirm(tx);
  }

  /**
   * Get all posts for a given profile
   * @param profileOwner The public key of the profile owner
   * @returns Array of posts
   */
  async getPostsByProfile(profileOwner: PublicKey): Promise<Post[]> {
    // Get all post accounts for the specified user
    const posts = await this.program.account.post.all([
      {
        memcmp: {
          offset: 8, // After discriminator
          bytes: profileOwner.toBase58(),
        },
      },
    ]);

    return posts.map((post) => post.account as Post);
  }

  /**
   * Get a specific post by ID
   * @param author The post author's public key
   * @param postId The post ID (post count at creation time)
   * @returns The post or null if not found
   */
  async getPostById(author: PublicKey, postId: number): Promise<Post | null> {
    const [postPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("post"), author.toBuffer(), Buffer.from([postId])],
      this.programId
    );

    try {
      const post = await this.program.account.post.fetch(postPDA);
      return post as Post;
    } catch (error) {
      return null;
    }
  }
}
