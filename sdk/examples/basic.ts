import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { OpenMSCPClient } from "../src";
import { Wallet } from "@project-serum/anchor";

async function main() {
  // Initialize connection to devnet
  const connection = new Connection("https://api.devnet.solana.com");

  // Load or create a wallet
  const keypair = Keypair.generate();
  const wallet = new Wallet(keypair);

  // Program ID from deployment
  const programId = new PublicKey(
    "7g9KYVp9QseDpRy8RRVKTR3zQ33ca4iHuDZNqoRihoWA"
  );

  // Initialize client
  const client = new OpenMSCPClient(connection, wallet, programId);

  try {
    // Create a profile
    console.log("Creating profile...");
    const createProfileTx = await client.createProfile({
      username: "testuser",
      bio: "Hello, OpenMSCP!",
      profilePicture: "ipfs://QmHash...",
    });
    console.log("Profile created:", createProfileTx);

    // Create a post
    console.log("Creating post...");
    const createPostTx = await client.createPost("My first post on OpenMSCP!");
    console.log("Post created:", createPostTx);

    // Get profile
    console.log("Fetching profile...");
    const profile = await client.getProfile(keypair.publicKey);
    console.log("Profile:", profile);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
