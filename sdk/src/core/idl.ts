import { Idl } from "@project-serum/anchor";

export const IDL: Idl = {
  version: "0.1.0",
  name: "openmscp",
  instructions: [
    {
      name: "createProfile",
      accounts: [
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "username",
          type: "string",
        },
        {
          name: "bio",
          type: "string",
        },
        {
          name: "profilePicture",
          type: "string",
        },
      ],
    },
    {
      name: "updateProfile",
      accounts: [
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "bio",
          type: {
            option: "string",
          },
        },
        {
          name: "profilePicture",
          type: {
            option: "string",
          },
        },
      ],
    },
    {
      name: "createPost",
      accounts: [
        {
          name: "post",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "content",
          type: "string",
        },
      ],
    },
    {
      name: "sendMessage",
      accounts: [
        {
          name: "message",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "recipient",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "content",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Profile",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "username",
            type: "string",
          },
          {
            name: "bio",
            type: "string",
          },
          {
            name: "profilePicture",
            type: "string",
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "updatedAt",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "Post",
      type: {
        kind: "struct",
        fields: [
          {
            name: "author",
            type: "publicKey",
          },
          {
            name: "timestamp",
            type: "i64",
          },
          {
            name: "memoAccount",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "Message",
      type: {
        kind: "struct",
        fields: [
          {
            name: "sender",
            type: "publicKey",
          },
          {
            name: "recipient",
            type: "publicKey",
          },
          {
            name: "encryptedContent",
            type: "string",
          },
          {
            name: "timestamp",
            type: "i64",
          },
          {
            name: "read",
            type: "bool",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "UsernameInvalid",
      msg: "Username must be between 3 and 20 characters",
    },
    {
      code: 6001,
      name: "BioTooLong",
      msg: "Bio must be less than 140 characters",
    },
    {
      code: 6002,
      name: "ProfilePictureTooLong",
      msg: "Profile picture hash too long",
    },
    {
      code: 6003,
      name: "PostTooLong",
      msg: "Post content too long",
    },
    {
      code: 6004,
      name: "MessageTooLong",
      msg: "Message too long",
    },
    {
      code: 6005,
      name: "InvalidMemoInstruction",
      msg: "Invalid memo instruction - must use Memo Program",
    },
    {
      code: 6006,
      name: "InvalidMemoData",
      msg: "Invalid memo data format",
    },
    {
      code: 6007,
      name: "Unauthorized",
      msg: "Unauthorized operation",
    },
  ],
};
