import { PublicKey } from "@solana/web3.js";

export interface Profile {
  owner: PublicKey;
  username: string;
  bio: string;
  profilePicture: string;
  createdAt: number;
  postCount: number;
}

export interface Post {
  author: PublicKey;
  timestamp: number;
  memoAccount: PublicKey;
}

export interface Message {
  sender: PublicKey;
  recipient: PublicKey;
  encryptedContent: string;
  timestamp: number;
  read: boolean;
}

export interface CreateProfileParams {
  username: string;
  bio: string;
  profilePicture: string;
}

export interface UpdateProfileParams {
  bio?: string;
  profilePicture?: string;
}

export interface SendMessageParams {
  recipient: PublicKey;
  content: string;
}
