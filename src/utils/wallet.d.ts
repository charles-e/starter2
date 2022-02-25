import React from 'react';
import { Connection, Keypair, PublicKey, Transaction, TransactionSignature } from '@safecoin/web3.js';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

export class Wallet {
  constructor(connection: Connection, seed: any, walletIndex?: number);

  static getAccountFromSeed(seed: any, walletIndex: number, accountIndex?: number): Keypair;


  get publicKey(): PublicKey;

   signTransaction(transaction: Transaction): Promise<Transaction>;

  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;

  getTokenPublicKeys(): Promise<PublicKey[]>;

  createTokenAccount(tokenAddress: any): Promise<TransactionSignature>;

  tokenAccountCost(): Promise<number>;

 transferToken(source: Keypair,
    destination: PublicKey,
    amount: number): Promise<TransactionSignature>;
}

export const WalletContext: React.Context<any>

export function WalletProvider(params: { children: ReactJSXElement[] }): React.Provider<any>;

export function useWallet(): Wallet;

export function useWalletPublicKeys(): [keys: PublicKey[], loaded: boolean];

export function refreshWalletPublicKeys(wallet: Wallet): void;

export interface BalanceInfo {
  amount: number;
  decimals: number;
  mint: PublicKey;
  owner: PublicKey;
  tokenName: string;
  tokenSymbol: string;
  valid: boolean;
  tokenMintable: boolean;
}

export function useBalanceInfo(key: PublicKey): null | BalanceInfo;

type WalletIndexSetter = (p1: number) => void;

export function useWalletSelector(): {
  addresses: PublicKey[],
  walletIndex: number,
  setWalletIndex: WalletIndexSetter
};

export function mnemonicToSecretKey(mnemonic: string): Promise<Keypair>; 
