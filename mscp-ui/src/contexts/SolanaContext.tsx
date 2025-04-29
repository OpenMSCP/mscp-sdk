import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { WalletContext } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "../idl/openmscp.json";

interface SolanaContextType {
  connection: Connection | null;
  programId: PublicKey;
  createProfile: (
    username: string,
    bio: string,
    profilePicture: string
  ) => Promise<void>;
  createPost: (content: string) => Promise<void>;
  updateProfile: (bio?: string, profilePicture?: string) => Promise<void>;
}

const SolanaContext = createContext<SolanaContextType | null>(null);

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { publicKey, signTransaction } = useWallet();
  const [connection] = useState(
    new Connection("http://localhost:8899", "confirmed")
  );
  const programId = new PublicKey(
    "9CuK5BsFiUEF781iSYSJt1BP2xJxDLH2DrVvfoZKJAtj"
  );

  const createProfile = useCallback(
    async (username: string, bio: string, profilePicture: string) => {
      if (!publicKey || !signTransaction)
        throw new Error("Wallet not connected");

      // Create profile PDA
      const [profilePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("profile"), publicKey.toBuffer()],
        programId
      );

      // Create instruction data
      const usernameBytes = Array.from(Buffer.from(username));
      const bioBytes = Array.from(Buffer.from(bio));
      const profilePictureBytes = Array.from(Buffer.from(profilePicture));

      const instructionData = Buffer.from(
        new Uint8Array([
          // Instruction index for createProfile
          1,
          // Username length
          username.length,
          // Username bytes
          ...usernameBytes,
          // Bio length
          bio.length,
          // Bio bytes
          ...bioBytes,
          // Profile picture length
          profilePicture.length,
          // Profile picture bytes
          ...profilePictureBytes,
        ])
      );

      // Create transaction
      const transaction = new Transaction().add(
        new web3.TransactionInstruction({
          keys: [
            { pubkey: profilePDA, isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: true },
            {
              pubkey: SystemProgram.programId,
              isSigner: false,
              isWritable: false,
            },
          ],
          programId,
          data: instructionData,
        })
      );

      // Sign and send transaction
      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      await connection.confirmTransaction(signature);
    },
    [publicKey, signTransaction, connection, programId]
  );

  const createPost = useCallback(
    async (content: string) => {
      if (!publicKey || !signTransaction)
        throw new Error("Wallet not connected");

      // Get profile PDA
      const [profilePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("profile"), publicKey.toBuffer()],
        programId
      );

      // Create post PDA
      const [postPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("post"), publicKey.toBuffer(), Buffer.from([0])], // You'll need to track post count
        programId
      );

      // Create memo account
      const memoAccount = new PublicKey(
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
      );

      // Create instruction data
      const contentBytes = Array.from(Buffer.from(content));
      const instructionData = Buffer.from(
        new Uint8Array([
          // Instruction index for createPost
          3,
          // Content length
          content.length,
          // Content bytes
          ...contentBytes,
        ])
      );

      // Create transaction
      const transaction = new Transaction().add(
        new web3.TransactionInstruction({
          keys: [
            { pubkey: postPDA, isSigner: false, isWritable: true },
            { pubkey: memoAccount, isSigner: false, isWritable: false },
            { pubkey: profilePDA, isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: true },
            {
              pubkey: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: SystemProgram.programId,
              isSigner: false,
              isWritable: false,
            },
          ],
          programId,
          data: instructionData,
        })
      );

      // Sign and send transaction
      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      await connection.confirmTransaction(signature);
    },
    [publicKey, signTransaction, connection, programId]
  );

  const updateProfile = useCallback(
    async (bio?: string, profilePicture?: string) => {
      if (!publicKey || !signTransaction)
        throw new Error("Wallet not connected");

      // Get profile PDA
      const [profilePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("profile"), publicKey.toBuffer()],
        programId
      );

      // Create instruction data
      const bioBytes = bio ? Array.from(Buffer.from(bio)) : [];
      const profilePictureBytes = profilePicture
        ? Array.from(Buffer.from(profilePicture))
        : [];

      const instructionData = Buffer.from(
        new Uint8Array([
          // Instruction index for updateProfile
          2,
          // Bio length (0 if not provided)
          bio ? bio.length : 0,
          // Bio bytes (if provided)
          ...bioBytes,
          // Profile picture length (0 if not provided)
          profilePicture ? profilePicture.length : 0,
          // Profile picture bytes (if provided)
          ...profilePictureBytes,
        ])
      );

      // Create transaction
      const transaction = new Transaction().add(
        new web3.TransactionInstruction({
          keys: [
            { pubkey: profilePDA, isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
          ],
          programId,
          data: instructionData,
        })
      );

      // Sign and send transaction
      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      await connection.confirmTransaction(signature);
    },
    [publicKey, signTransaction, connection, programId]
  );

  return (
    <SolanaContext.Provider
      value={{
        connection,
        programId,
        createProfile,
        createPost,
        updateProfile,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
};
