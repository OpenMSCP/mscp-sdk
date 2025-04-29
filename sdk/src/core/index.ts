import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@project-serum/anchor";
import {
  CreateProfileParams,
  UpdateProfileParams,
  SendMessageParams,
  Profile,
  Message,
} from "../types";
import { IDL } from "./idl";

export class OpenMSCPClient {
  private program: Program;
  private provider: AnchorProvider;
  private programId: PublicKey;

  constructor(connection: Connection, wallet: Wallet, programId: PublicKey) {
    this.programId = programId;
    this.provider = new AnchorProvider(connection, wallet, {});
    this.program = new Program(IDL, programId, this.provider);
  }

  async createProfile(params: CreateProfileParams): Promise<string> {
    const [profilePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), this.provider.wallet.publicKey.toBuffer()],
      this.programId
    );

    const tx = await this.program.methods
      .createProfile(params.username, params.bio, params.profilePicture)
      .accounts({
        profile: profilePDA,
        user: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async updateProfile(params: UpdateProfileParams): Promise<string> {
    const [profilePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), this.provider.wallet.publicKey.toBuffer()],
      this.programId
    );

    const tx = await this.program.methods
      .updateProfile(params.bio, params.profilePicture)
      .accounts({
        profile: profilePDA,
        user: this.provider.wallet.publicKey,
      })
      .rpc();

    return tx;
  }

  async createPost(content: string): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000);
    const [postPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("post"),
        this.provider.wallet.publicKey.toBuffer(),
        Buffer.from(timestamp.toString()),
      ],
      this.programId
    );

    const tx = await this.program.methods
      .createPost(content)
      .accounts({
        post: postPDA,
        user: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async sendMessage(params: SendMessageParams): Promise<string> {
    const [messagePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("message"),
        this.provider.wallet.publicKey.toBuffer(),
        params.recipient.toBuffer(),
      ],
      this.programId
    );

    const tx = await this.program.methods
      .sendMessage(params.content)
      .accounts({
        message: messagePDA,
        sender: this.provider.wallet.publicKey,
        recipient: params.recipient,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async getProfile(publicKey: PublicKey): Promise<Profile | null> {
    const [profilePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), publicKey.toBuffer()],
      this.programId
    );

    try {
      const profile = await this.program.account.profile.fetch(profilePDA);
      return profile as Profile;
    } catch (error) {
      return null;
    }
  }

  async getMessages(): Promise<Message[]> {
    const messages = await this.program.account.message.all([
      {
        memcmp: {
          offset: 8, // After discriminator
          bytes: this.provider.wallet.publicKey.toBase58(),
        },
      },
    ]);

    return messages.map((msg) => msg.account as Message);
  }
}
