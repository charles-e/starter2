import { Connection, PublicKey, TransactionSignature } from '@safecoin/web3.js';
export function sleep(ms: number): Promise<void>;


export function useLocalStorageState(key: string, defaultState: any): any;

export function useEffectAfterTimeout(effect: any, timeout: number): void;


export function useListener(emitter: any, eventName: string): void;

export function abbreviateAddress(address: PublicKey): string;

export  function confirmTransaction(connection: Connection, 
  signature: TransactionSignature): Promise<number>;
