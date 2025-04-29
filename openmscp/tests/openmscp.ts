import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
// Note: Need to build the program with 'anchor build --arch sbf' before this import works
import { Openmscp } from "../target/types/openmscp";
import { expect } from "chai";
import * as bs58 from "bs58";

describe("openmscp", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Openmscp as Program<Openmscp>;
  const user = provider.wallet;

  it("Creates a profile", async () => {
    // Test data
    const username = "testuser";
    const bio = "This is a test bio";
    const profilePicture = "ipfs://QmTestHash";

    // Derive profile PDA
    const [profilePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), user.publicKey.toBuffer()],
      program.programId
    );

    // Execute the create profile instruction
    await program.methods
      .createProfile(username, bio, profilePicture)
      .accounts({
        profile: profilePda,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch the created profile
    const profileAccount = await program.account.profile.fetch(profilePda);

    // Verify account data
    expect(profileAccount.owner.toString()).to.equal(user.publicKey.toString());
    expect(profileAccount.username).to.equal(username);
    expect(profileAccount.bio).to.equal(bio);
    expect(profileAccount.profilePicture).to.equal(profilePicture);
    expect(profileAccount.createdAt.toNumber()).to.be.greaterThan(0);
    expect(profileAccount.updatedAt.toNumber()).to.be.greaterThan(0);
  });

  it("Updates a profile", async () => {
    // Test update data
    const newBio = "Updated bio for testing";
    const newProfilePicture = "ipfs://QmUpdatedHash";

    // Derive profile PDA
    const [profilePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), user.publicKey.toBuffer()],
      program.programId
    );

    // Get original profile data for comparison
    const originalProfile = await program.account.profile.fetch(profilePda);

    // Execute the update profile instruction
    await program.methods
      .updateProfile(newBio, newProfilePicture)
      .accounts({
        profile: profilePda,
        user: user.publicKey,
      })
      .rpc();

    // Fetch the updated profile
    const updatedProfile = await program.account.profile.fetch(profilePda);

    // Verify updated account data
    expect(updatedProfile.owner.toString()).to.equal(user.publicKey.toString());
    expect(updatedProfile.username).to.equal(originalProfile.username); // Username didn't change
    expect(updatedProfile.bio).to.equal(newBio);
    expect(updatedProfile.profilePicture).to.equal(newProfilePicture);
    expect(updatedProfile.createdAt.toNumber()).to.equal(
      originalProfile.createdAt.toNumber()
    );
    expect(updatedProfile.updatedAt.toNumber()).to.be.greaterThan(
      originalProfile.updatedAt.toNumber()
    );
  });

  it("Sends a message", async () => {
    // Create a second wallet for testing messaging
    const recipient = anchor.web3.Keypair.generate();

    // Airdrop SOL to the recipient for account creation
    const connection = provider.connection;
    const airdropSig = await connection.requestAirdrop(
      recipient.publicKey,
      1 * anchor.web3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSig);

    // Create a profile for the recipient
    const recipientUsername = "recipient";
    const recipientBio = "Recipient test bio";
    const recipientProfilePic = "ipfs://QmRecipientHash";

    // Derive recipient profile PDA
    const [recipientProfilePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), recipient.publicKey.toBuffer()],
      program.programId
    );

    // Create recipient profile
    await program.methods
      .createProfile(recipientUsername, recipientBio, recipientProfilePic)
      .accounts({
        profile: recipientProfilePda,
        user: recipient.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([recipient])
      .rpc();

    // Encrypted message content (in real app this would be encrypted)
    const encryptedContent = "This is a test encrypted message";

    // Create a new message account
    const message = anchor.web3.Keypair.generate();

    // Send message from user to recipient
    await program.methods
      .sendMessage(encryptedContent)
      .accounts({
        message: message.publicKey,
        sender: user.publicKey,
        recipientProfile: recipientProfilePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([message])
      .rpc();

    // Fetch the message
    const messageAccount = await program.account.message.fetch(
      message.publicKey
    );

    // Verify message data
    expect(messageAccount.sender.toString()).to.equal(
      user.publicKey.toString()
    );
    expect(messageAccount.recipient.toString()).to.equal(
      recipient.publicKey.toString()
    );
    expect(messageAccount.encryptedContent).to.equal(encryptedContent);
    expect(messageAccount.timestamp.toNumber()).to.be.greaterThan(0);
    expect(messageAccount.read).to.be.false;
  });

  // Note: Testing post creation with Memo Program integration
  // requires more complex transaction building that we'll implement later
});
