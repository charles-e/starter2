import * as BufferLayout from '@solana/buffer-layout';
import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@safecoin/web3.js';

export const TOKEN_PROGRAM_ID: PublicKey;

export const WRAPPED_SAFE_MINT: PublicKey;

export const instructionMaxSpan: number;

export function encodeTokenInstructionData(instruction: any): Buffer;

export function initializeMint(params: {
  mint: PublicKey,
  decimals: number,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey,
}): TransactionInstruction;


export function initializeAccount(params:
  { account: Keypair, mint: PublicKey, owner: PublicKey }): TransactionInstruction;


export function transfer(params: {
  source: PublicKey,
  destination: PublicKey,
  amount: number,
  owner: Keypair
}): TransactionInstruction;

export function mintTo(params: {
  mint: PublicKey,
  destination: PublicKey,
  amount: number,
  mintAuthority: PublicKey
}): TransactionInstruction;

